#!/usr/bin/env node
/**
 * Audit de contraste sur le rendu réel.
 *
 *   node scripts/audit-contraste.mjs --port 3210 --out docs/captures/contraste-apres [--routes /,/equipes]
 *
 * Pour chaque route × locale (fr, en) × thème (clair, sombre) × largeur (1440, 390),
 * la page est ouverte dans Chrome headless (puppeteer-core, résolu depuis
 * `AUDIT_NODE_PATH` ou node_modules) ; chaque texte visible, chaque icône SVG,
 * chaque bordure visible et chaque anneau de focus est comparé au fond
 * **réellement composé** derrière lui (remontée des ancêtres, alpha et opacité
 * compris). Les états survol et focus-visible sont forcés via le protocole
 * DevTools. Les accordéons sont audités fermés puis ouverts.
 *
 * Seuils WCAG : 4,5:1 pour le texte ; 3:1 pour le texte ≥ 24 px ou ≥ 18,66 px gras ;
 * 3:1 pour les composants d'interface (icônes, anneau de focus, bordures de
 * composant). Les filets purement décoratifs (séparateurs) sont listés avec le
 * verdict « décoratif » : WCAG 1.4.11 ne s'y applique pas.
 *
 * Sortie : <out>.json (toutes les lignes) et <out>.md (résumé + lignes KO).
 */
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";

const args = Object.fromEntries(
  process.argv.slice(2).reduce((acc, a, i, arr) => {
    if (a.startsWith("--")) acc.push([a.slice(2), arr[i + 1] && !arr[i + 1].startsWith("--") ? arr[i + 1] : "true"]);
    return acc;
  }, [])
);
const PORT = args.port ?? "3000";
const OUT = args.out ?? "contraste";
const ROUTES = (args.routes ?? "/,/olympiade,/organisation,/equipes,/equipes/senegal,/equipes/france,/programme,/problemes,/historique,/contact,/mentions-legales").split(",");
const LOCALES = ["fr", "en"];
const SCHEMES = ["light", "dark"];
const WIDTHS = [1440, 390];

const require = createRequire(import.meta.url);
const puppeteer = require(process.env.AUDIT_NODE_PATH ? path.join(process.env.AUDIT_NODE_PATH, "puppeteer-core") : "puppeteer-core");

/** Fonction exécutée dans la page : relève tous les éléments à auditer. */
function releverDansLaPage(etat) {
  // Toute syntaxe de couleur est acceptée : #rrggbb, rgb[a](), color(srgb r g b / a)
  // (forme calculée des couleurs à opacité, color-mix compris) ; les autres
  // espaces (oklab, oklch…) sont normalisés par un canvas, que le navigateur
  // sérialise en #rrggbb, rgba() ou color(srgb …).
  const ctx = document.createElement("canvas").getContext("2d");
  const lire = (v) => {
    if (!v) return null;
    let m;
    if ((m = /^#([0-9a-f]{6})([0-9a-f]{2})?$/i.exec(v))) {
      const h = m[1];
      return { r: parseInt(h.slice(0, 2), 16), g: parseInt(h.slice(2, 4), 16), b: parseInt(h.slice(4, 6), 16), a: m[2] ? parseInt(m[2], 16) / 255 : 1 };
    }
    if ((m = /^rgba?\(([^)]+)\)$/.exec(v))) {
      const p = m[1].split(/[,/\s]+/).filter(Boolean).map(Number);
      return { r: p[0], g: p[1], b: p[2], a: p.length > 3 ? p[3] : 1 };
    }
    if ((m = /^color\(srgb\s+([^)]+)\)$/.exec(v))) {
      const p = m[1].split(/[/\s]+/).filter(Boolean).map(Number);
      return { r: p[0] * 255, g: p[1] * 255, b: p[2] * 255, a: p.length > 3 ? p[3] : 1 };
    }
    return null;
  };
  const parse = (c) => {
    if (!c || c === "transparent") return null;
    const direct = lire(c.trim());
    if (direct) return direct;
    ctx.fillStyle = "#010203";
    ctx.fillStyle = c;
    const v = ctx.fillStyle;
    if (v === "#010203") return null;
    return lire(v);
  };
  const over = (top, bot) => {
    const a = top.a + bot.a * (1 - top.a);
    if (a === 0) return { r: 0, g: 0, b: 0, a: 0 };
    return {
      r: (top.r * top.a + bot.r * bot.a * (1 - top.a)) / a,
      g: (top.g * top.a + bot.g * bot.a * (1 - top.a)) / a,
      b: (top.b * top.a + bot.b * bot.a * (1 - top.a)) / a,
      a,
    };
  };
  const lum = ({ r, g, b }) => {
    const f = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); };
    return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
  };
  const ratio = (x, y) => { const a = lum(x), b = lum(y); return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05); };
  const hex = ({ r, g, b }) => "#" + [r, g, b].map((v) => Math.round(v).toString(16).padStart(2, "0")).join("");

  const bodyBg = parse(getComputedStyle(document.body).backgroundColor);
  const canvas = { r: 255, g: 255, b: 255, a: 1 };

  /** Fond composé derrière un élément (sans le fond de l'élément lui-même si `exclureSoi`). */
  function fondDerriere(el, exclureSoi) {
    let acc = { r: 0, g: 0, b: 0, a: 0 };
    let node = exclureSoi ? el.parentElement : el;
    let opacite = 1;
    while (node) {
      const cs = getComputedStyle(node);
      const bg = parse(cs.backgroundColor);
      if (bg && bg.a > 0) acc = over(acc, { ...bg, a: bg.a * opacite });
      if (cs.backgroundImage && cs.backgroundImage !== "none" && !/^url/.test(cs.backgroundImage)) {
        // dégradé : on prend la première couleur nommée comme approximation, signalée
        const first = parse(cs.backgroundImage);
        if (first) acc = over(acc, { ...first, a: 1 });
      }
      if (acc.a >= 0.999) break;
      opacite *= Number(cs.opacity);
      node = node.parentElement;
    }
    if (acc.a < 0.999) acc = over(acc, bodyBg && bodyBg.a > 0 ? bodyBg : canvas);
    return acc;
  }
  function opaciteCumulee(el) {
    let o = 1; let n = el;
    while (n) { o *= Number(getComputedStyle(n).opacity); n = n.parentElement; }
    return o;
  }
  function visible(el) {
    const cs = getComputedStyle(el);
    if (cs.display === "none" || cs.visibility === "hidden") return false;
    const r = el.getBoundingClientRect();
    if (r.width < 2 || r.height < 2) return false;
    if (el.closest("[hidden]")) return false;
    return true;
  }
  function decrire(el) {
    const tag = el.tagName.toLowerCase();
    const cls = (typeof el.className === "string" ? el.className : "").split(/\s+/).filter(Boolean).slice(0, 4).join(".");
    const texte = (el.innerText || el.textContent || "").trim().replace(/\s+/g, " ").slice(0, 48);
    return `${tag}${cls ? "." + cls : ""}${texte ? " « " + texte + " »" : ""}`;
  }

  const lignes = [];
  // 1. Textes
  for (const el of document.querySelectorAll("body *")) {
    if (["SCRIPT", "STYLE", "SVG", "PATH", "NOSCRIPT"].includes(el.tagName)) continue;
    const direct = [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim().length > 0);
    if (!direct || !visible(el)) continue;
    const cs = getComputedStyle(el);
    const couleur = parse(cs.color); if (!couleur) continue;
    const fond = fondDerriere(el, false);
    const texte = over({ ...couleur, a: couleur.a * opaciteCumulee(el) }, fond);
    const taille = parseFloat(cs.fontSize);
    const gras = parseInt(cs.fontWeight, 10) >= 700;
    const grand = taille >= 24 || (taille >= 18.66 && gras);
    const seuil = grand ? 3 : 4.5;
    const c = ratio(texte, fond);
    lignes.push({ etat, type: "texte", element: decrire(el), taille: Math.round(taille), couleur: hex(texte), fond: hex(fond), contraste: +c.toFixed(2), seuil, verdict: c >= seuil ? "OK" : "KO" });
  }
  // 2. Icônes SVG (lucide) : stroke = currentColor
  for (const svg of document.querySelectorAll("svg.lucide")) {
    if (!visible(svg)) continue;
    const cs = getComputedStyle(svg);
    const couleur = parse(cs.color); if (!couleur) continue;
    const fond = fondDerriere(svg, true);
    const c = ratio(over({ ...couleur, a: couleur.a * opaciteCumulee(svg) }, fond), fond);
    lignes.push({ etat, type: "icône", element: decrire(svg.parentElement) + " > svg", taille: 0, couleur: hex(couleur), fond: hex(fond), contraste: +c.toFixed(2), seuil: 3, verdict: c >= 3 ? "OK" : "KO" });
  }
  // 3. Bordures visibles : composants (boutons, champs) vs filets décoratifs
  for (const el of document.querySelectorAll("body *")) {
    if (!visible(el)) continue;
    const cs = getComputedStyle(el);
    const cotes = ["Top", "Right", "Bottom", "Left"].filter((s) => parseFloat(cs[`border${s}Width`]) > 0 && cs[`border${s}Style`] !== "none");
    if (cotes.length === 0) continue;
    const bc = parse(cs[`border${cotes[0]}Color`]); if (!bc || bc.a === 0) continue;
    const fond = fondDerriere(el, true);
    const c = ratio(over({ ...bc, a: bc.a * opaciteCumulee(el) }, fond), fond);
    const composant = ["A", "BUTTON", "INPUT", "SELECT", "TEXTAREA", "SUMMARY"].includes(el.tagName) || el.getAttribute("role") === "button";
    lignes.push({ etat, type: composant ? "bordure de composant" : "filet", element: decrire(el), taille: 0, couleur: hex(bc), fond: hex(fond), contraste: +c.toFixed(2), seuil: 3, verdict: composant ? (c >= 3 ? "OK" : "KO") : (c >= 3 ? "OK" : "décoratif") });
  }
  return lignes;
}

/** États forcés (survol, focus-visible) sur les éléments interactifs, via CDP. */
async function etatsForces(page, cdp, etat) {
  const { root } = await cdp.send("DOM.getDocument", { depth: -1 });
  const { nodeIds } = await cdp.send("DOM.querySelectorAll", { nodeId: root.nodeId, selector: "a, button, summary" });
  const lignes = [];
  for (const nodeId of nodeIds) {
    for (const pseudo of ["hover", "focus-visible"]) {
      await cdp.send("CSS.forcePseudoState", { nodeId, forcedPseudoClasses: [pseudo, ...(pseudo === "focus-visible" ? ["focus"] : [])] });
      // Le style calculé est lu après la fin des transitions (même réduites à
      // 0,01 ms) : lu trop tôt, l'anneau de focus renvoie un état intermédiaire.
      await new Promise((r) => setTimeout(r, 40));
      const { object } = await cdp.send("DOM.resolveNode", { nodeId });
      const { result } = await cdp.send("Runtime.callFunctionOn", {
        objectId: object.objectId,
        returnByValue: true,
        functionDeclaration: `function(pseudo, etat) {
          ${releverDansLaPage.toString().replace(/^function releverDansLaPage\([^)]*\)\s*\{/, "").replace(/\}\s*$/, "").split("const lignes = [];")[0]}
          if (!visible(this)) return [];
          const cs = getComputedStyle(this);
          const out = [];
          if (pseudo === "hover") {
            const cible = [...this.querySelectorAll("*")].find((n) => [...n.childNodes].some((c) => c.nodeType === 3 && c.textContent.trim())) || this;
            const ccs = getComputedStyle(cible);
            const couleur = parse(ccs.color); const fond = fondDerriere(cible, false);
            if (couleur) {
              const taille = parseFloat(ccs.fontSize); const gras = parseInt(ccs.fontWeight, 10) >= 700;
              const seuil = taille >= 24 || (taille >= 18.66 && gras) ? 3 : 4.5;
              const c = ratio(over({ ...couleur, a: couleur.a * opaciteCumulee(cible) }, fond), fond);
              out.push({ etat: etat + " · survol", type: "texte", element: decrire(this), taille: Math.round(taille), couleur: hex(couleur), fond: hex(fond), contraste: +c.toFixed(2), seuil, verdict: c >= seuil ? "OK" : "KO" });
            }
          } else {
            const oc = parse(cs.outlineColor); const largeur = parseFloat(cs.outlineWidth);
            const fond = fondDerriere(this, true);
            if (oc && cs.outlineStyle !== "none" && largeur > 0) {
              const c = ratio(over(oc, fond), fond);
              out.push({ etat: etat + " · focus", type: "anneau de focus", element: decrire(this), taille: 0, couleur: hex(oc), fond: hex(fond), contraste: +c.toFixed(2), seuil: 3, verdict: c >= 3 ? "OK" : "KO" });
            } else {
              out.push({ etat: etat + " · focus", type: "anneau de focus", element: decrire(this), taille: 0, couleur: "—", fond: hex(fond), contraste: 0, seuil: 3, verdict: "KO (aucun anneau)" });
            }
          }
          return out;
        }`,
        arguments: [{ value: pseudo }, { value: etat }],
      });
      lignes.push(...(result.value ?? []));
      await cdp.send("CSS.forcePseudoState", { nodeId, forcedPseudoClasses: [] });
    }
  }
  return lignes;
}

const browser = await puppeteer.launch({ executablePath: process.env.CHROME_PATH ?? "/usr/bin/google-chrome", headless: "new", args: ["--no-sandbox", "--disable-gpu", "--hide-scrollbars"] });
const toutes = [];
for (const width of WIDTHS) {
  for (const scheme of SCHEMES) {
    for (const locale of LOCALES) {
      for (const route of ROUTES) {
        const url = `http://localhost:${PORT}${locale === "fr" ? "" : "/en"}${route === "/" && locale === "en" ? "" : route}`;
        const page = await browser.newPage();
        await page.setViewport({ width, height: 900, deviceScaleFactor: 1 });
        await page.emulateMediaFeatures([{ name: "prefers-color-scheme", value: scheme }, { name: "prefers-reduced-motion", value: "reduce" }]);
        // Le thème ne suit plus le système (clair par défaut) : on pose le choix
        // du visiteur, tel que le sélecteur de l'en-tête l'enregistre (next-themes).
        await page.evaluateOnNewDocument((t) => localStorage.setItem("theme", t), scheme);
        await page.goto(url, { waitUntil: "networkidle0" });
        await new Promise((r) => setTimeout(r, 400));
        const cdp = await page.target().createCDPSession();
        await cdp.send("DOM.enable"); await cdp.send("CSS.enable");
        const contexte = { route, locale, scheme: scheme === "light" ? "clair" : "sombre", width };
        const ferme = await page.evaluate(releverDansLaPage, "normal");
        const forces = await etatsForces(page, cdp, "normal");
        const aDetails = await page.evaluate(() => { const d = document.querySelectorAll("details"); d.forEach((x) => (x.open = true)); return d.length; });
        const ouvert = aDetails ? (await page.evaluate(releverDansLaPage, "accordéon ouvert")).filter((l) => l.element.includes("details") || l.element.startsWith("p.") || l.element.startsWith("span")) : [];
        for (const l of [...ferme, ...forces, ...ouvert]) toutes.push({ ...contexte, ...l });
        await page.close();
        process.stderr.write(`${width} ${scheme} ${locale} ${route}: ${ferme.length + forces.length + ouvert.length} lignes\n`);
      }
    }
  }
}
await browser.close();

fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(`${OUT}.json`, JSON.stringify(toutes));
const ko = toutes.filter((l) => l.verdict.startsWith("KO"));
const parContexte = {};
for (const l of toutes) {
  const k = `${l.route} · ${l.locale} · ${l.scheme} · ${l.width}`;
  parContexte[k] ??= { total: 0, ko: 0, min: Infinity };
  parContexte[k].total++;
  if (l.verdict.startsWith("KO")) parContexte[k].ko++;
  if (l.type === "texte" && l.contraste < parContexte[k].min) parContexte[k].min = l.contraste;
}
let md = `# Audit de contraste — ${new Date().toISOString().slice(0, 16).replace("T", " ")}\n\n`;
md += `${toutes.length} mesures, **${ko.length} KO**, ${toutes.filter((l) => l.verdict === "décoratif").length} filets décoratifs (hors 1.4.11).\n\n`;
md += `| Route · locale · thème · largeur | Mesures | KO | Contraste texte min. |\n|---|---:|---:|---:|\n`;
for (const [k, v] of Object.entries(parContexte)) md += `| ${k} | ${v.total} | ${v.ko} | ${v.min === Infinity ? "—" : v.min} |\n`;
if (ko.length) {
  md += `\n## Lignes KO\n\n| Route | Locale | Thème | Largeur | État | Type | Élément | Couleur | Fond | Contraste | Seuil |\n|---|---|---|---:|---|---|---|---|---|---:|---:|\n`;
  const vus = new Set();
  for (const l of ko) {
    const cle = `${l.route}|${l.locale}|${l.scheme}|${l.width}|${l.etat}|${l.element}`;
    if (vus.has(cle)) continue; vus.add(cle);
    md += `| ${l.route} | ${l.locale} | ${l.scheme} | ${l.width} | ${l.etat} | ${l.type} | ${l.element.replace(/\|/g, "¦")} | ${l.couleur} | ${l.fond} | ${l.contraste} | ${l.seuil} |\n`;
  }
}
fs.writeFileSync(`${OUT}.md`, md);
console.log(`${toutes.length} mesures, ${ko.length} KO → ${OUT}.md / ${OUT}.json`);
