#!/usr/bin/env node
// Génère les images de marque du site, dans le traitement de la variante D :
//   public/og/ofm2027-{fr,en}-v<N>.png  image de partage Open Graph, 1200 × 630, par langue
//                                       (nom versionné : lib/image-partage.ts)
//   app/favicon.ico                     maille du logo, 16 et 32 px (PNG encapsulés dans l'ICO)
//   app/icon.png                        maille, 96 px
//   app/apple-icon.png                  maille, 180 px (apple-touch-icon)
//   public/icons/icon-{192,512}.png     maille, icônes du manifeste web
//
// Image de partage : ce que voit celui qui clique — fond ivoire, titre Fraunces grasse
// en vert, rangée d'informations à pastilles, la figure sur son disque soleil avec sa
// construction au compas, le bandeau tissé sur le bord droit. Textes, couleurs et
// géométrie viennent des sources du site (messages, event.json, globals.css,
// lib/figure-geometrie.ts, lib/pavage.ts, icônes lucide).
//
// Usage : node scripts/images-marque.mjs   (CHROME_PATH pour un autre Chrome/Chromium)
// Rendu par Chrome sans interface, piloté par le protocole DevTools ; polices Google Fonts.
import { spawn } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { COMPAS, DISQUE, K, OMEGA_R, P } from "../lib/figure-geometrie.ts";
import { bandeau, maille } from "../lib/pavage.ts";
import { cheminImagePartage } from "../lib/image-partage.ts";
import { composerFrancais } from "../lib/typographie.ts";
import { lireJetons } from "../lib/jetons.ts";
import { __iconNode as iconeCalendrier } from "../node_modules/lucide-react/dist/esm/icons/calendar-days.mjs";
import { __iconNode as iconeComite } from "../node_modules/lucide-react/dist/esm/icons/building-2.mjs";
import { __iconNode as iconeCategories } from "../node_modules/lucide-react/dist/esm/icons/users.mjs";

const RACINE = path.resolve(import.meta.dirname, "..");
const lireJson = (fichier) => JSON.parse(fs.readFileSync(path.join(RACINE, fichier), "utf-8"));
const CHROME = process.env.CHROME_PATH ?? "/usr/bin/google-chrome";
const LARGEUR = 1200;
const HAUTEUR = 630;
const POLICES =
  "https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght,SOFT,WONK@0,9..144,300..700,0..100,0..1;1,9..144,300..700,0..100,0..1&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=block";

const echapper = (texte) => texte.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
const seg = (a, b) => `M${a.x} ${a.y}L${b.x} ${b.y}`;
const cercle = (c, r) => `M${c.x - r} ${c.y}a${r} ${r} 0 1 0 ${2 * r} 0a${r} ${r} 0 1 0 ${-2 * r} 0`;

/** Une icône lucide en SVG autonome (mêmes tracés que les composants du site). */
function icone(noeuds, couleur) {
  const enfants = noeuds
    .map(([balise, attributs]) => {
      const attrs = Object.entries(attributs)
        .filter(([cle]) => cle !== "key")
        .map(([cle, valeur]) => `${cle}="${valeur}"`)
        .join(" ");
      return `<${balise} ${attrs}/>`;
    })
    .join("");
  return `<svg viewBox="0 0 24 24" fill="none" stroke="${couleur}" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">${enfants}</svg>`;
}

/** La maille du logo (components/brand/logo.tsx), même géométrie. */
function svgMaille(c, hauteurCss) {
  const m = maille(18);
  return `<svg viewBox="0 0 ${m.largeur} ${m.hauteur}" style="height:${hauteurCss};width:auto;display:block">
    <path d="${m.vert}" fill="${c.vert}"/><path d="${m.jaune}" fill="${c.soleil}"/><path d="${m.rouge}" fill="${c.rouge}"/></svg>`;
}

/** Bandeau tissé vertical (components/motifs/bandeau-tisse.tsx), même géométrie, même cadrage. */
function svgBandeau(c) {
  const b = bandeau(16);
  const repetitions = 40;
  return `<svg viewBox="0 0 ${b.largeur} ${b.periode * repetitions}" preserveAspectRatio="xMidYMin slice" style="display:block;width:100%;height:100%">
    <defs><pattern id="tissage" width="${b.largeur}" height="${b.periode}" patternUnits="userSpaceOnUse">
      <rect width="${b.largeur}" height="${b.periode}" fill="${c.ivoire}"/>
      <path d="${b.vert}" fill="${c.vert}"/><path d="${b.jaune}" fill="${c.soleil}"/><path d="${b.rouge}" fill="${c.rouge}"/>
    </pattern></defs>
    <rect width="${b.largeur}" height="${b.periode * repetitions}" fill="url(#tissage)"/></svg>`;
}

/**
 * La figure du hero, état final de la construction, sur son disque soleil
 * (mêmes éléments que components/motifs/figure-construction.tsx). Traits un peu
 * plus épais qu'à l'écran : l'image est surtout vue en vignette.
 */
function figure() {
  const points = ["A", "B", "C", "O", "D", "E", "M"].map((n) => `<circle cx="${P[n].x}" cy="${P[n].y}" r="5.5" class="point"/>`).join("");
  const etiquettes = [
    ["A", -5, -15], ["B", -26, 8], ["C", 14, 8], ["O", -8, -14], ["D", -8, 28], ["E", 12, -10], ["M", -22, 28],
  ]
    .map(([nom, dx, dy]) => `<text x="${P[nom].x + dx}" y="${P[nom].y + dy}" class="etiquette">${nom}</text>`)
    .join("");
  const compas = [COMPAS.AB, COMPAS.AC];
  return `<svg viewBox="0 0 600 640" fill="none" stroke-linecap="round" stroke-linejoin="round">
    <circle cx="${DISQUE.x}" cy="${DISQUE.y}" r="${DISQUE.r}" class="disque"/>
    <path d="${compas.flatMap((m) => m.arcs).join("")}" class="compas"/>
    <path d="${compas.map((m) => m.mediatrice).join("")}${seg(P.A, P.D)}${cercle(K, K.r)}" class="pointille"/>
    <path d="${seg(P.A, P.B)}${seg(P.B, P.C)}${seg(P.C, P.A)}${seg(P.B, P.E)}" class="trait"/>
    <circle cx="${P.O.x}" cy="${P.O.y}" r="${OMEGA_R}" class="trait"/>
    <path d="${seg(P.D, P.E)}${seg(P.O, P.M)}" class="conclusion"/>
    ${compas.map((m) => `<circle cx="${m.X.x}" cy="${m.X.y}" r="6" class="repere"/>`).join("")}
    ${points}${etiquettes}
  </svg>`;
}

function page(locale, c) {
  const messages = lireJson(`messages/${locale}.json`);
  const evenement = lireJson("content/event.json");
  const composer = locale === "fr" ? composerFrancais : (texte) => texte;
  const titre = composer(messages.Home.Hero.title);
  // Pastilles et icônes du hero de l'accueil (vert, soleil bordé d'or profond, rouge).
  const meta = [
    { texte: evenement.dates[locale], donnee: true, icone: iconeCalendrier, fond: c.vert, trait: c.ivoire },
    // « Dakar » seul, entre la date et les catégories, se lit comme le lieu des épreuves :
    // on nomme ce qui s'y tient, le comité d'organisation (les épreuves sont à distance).
    {
      texte: composer(messages.Metadata.ogCommittee.replace("{city}", evenement.city[locale])),
      icone: iconeComite, fond: c.soleil, trait: c["vert-nuit"], bord: c["or-profond"],
    },
    { texte: evenement.categories.map((cat) => cat.name[locale]).join(" · "), icone: iconeCategories, fond: c.rouge, trait: c.ivoire },
  ];

  return `<!doctype html><html lang="${locale}"><head><meta charset="utf-8">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="${POLICES}" rel="stylesheet">
<style>
  * { margin: 0; box-sizing: border-box; }
  html, body { width: ${LARGEUR}px; height: ${HAUTEUR}px; overflow: hidden; }
  body {
    position: relative; background: ${c.ivoire}; color: ${c.anthracite};
    font-family: Inter, system-ui, sans-serif;
    /* Comme le hero : texte et figure côte à côte, la rangée d'informations dessous, sur toute la largeur. */
    display: grid; grid-template-columns: minmax(0, 1fr) 420px; grid-template-rows: minmax(0, 1fr) auto;
    column-gap: 24px; row-gap: 18px;
    padding: 44px 92px 40px 64px;
  }
  .bandeau { position: absolute; top: 0; right: 0; bottom: 0; width: 52px; }
  .texte { display: flex; flex-direction: column; justify-content: center; gap: 40px; }
  .marque { display: flex; align-items: center; gap: 12px; font-family: Fraunces, serif; font-weight: 700; font-size: 30px; letter-spacing: -0.02em; }
  .marque span { color: ${c.vert}; }
  h1 {
    font-family: Fraunces, Georgia, serif; font-weight: 700; font-size: 74px; line-height: .98; color: ${c.vert};
    font-variation-settings: "SOFT" 30, "WONK" 1; letter-spacing: -0.025em; text-wrap: balance;
  }
  .meta { grid-column: 1 / -1; margin: 0; padding-left: 0; border-top: 1px solid color-mix(in srgb, ${c.anthracite} 14%, transparent); padding-top: 22px; display: flex; gap: 28px; font-size: 21px; font-weight: 500; white-space: nowrap; }
  .meta li { display: flex; align-items: center; gap: 11px; list-style: none; }
  .pastille { width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; flex: none; }
  .pastille svg { width: 20px; height: 20px; }
  .donnee { font-family: "JetBrains Mono", monospace; font-weight: 500; font-variant-numeric: tabular-nums; }
  .figure { align-self: center; }
  .figure svg { width: 420px; height: auto; display: block; overflow: visible; }
  .disque { fill: ${c.soleil}; }
  .trait { stroke: ${c.vert}; stroke-width: 2.2; }
  .compas { stroke: ${c["vert-clair"]}; stroke-width: 1.8; }
  .pointille { stroke: ${c["vert-clair"]}; stroke-width: 2.2; stroke-dasharray: 0.5 6; }
  .conclusion { stroke: ${c.rouge}; stroke-width: 3.4; }
  .repere { fill: ${c.ivoire}; stroke: ${c["vert-clair"]}; stroke-width: 2; }
  .point { fill: ${c.vert}; }
  .etiquette { fill: ${c.vert}; font-family: Fraunces, serif; font-style: italic; font-weight: 600; font-size: 25px; }
</style></head><body>
  <div class="texte">
    <p class="marque">${svgMaille(c, "38px")}OFM <span>2027</span></p>
    <h1>${echapper(titre)}</h1>
  </div>
  <div class="figure">${figure()}</div>
  <ul class="meta">${meta
      .map(
        (m) => `<li><span class="pastille" style="background:${m.fond};${m.bord ? `box-shadow:inset 0 0 0 1.5px ${m.bord}` : ""}">${icone(m.icone, m.trait)}</span><span${m.donnee ? ' class="donnee"' : ""}>${echapper(m.texte)}</span></li>`,
      )
      .join("")}</ul>
  <div class="bandeau">${svgBandeau(c)}</div>
</body></html>`;
}

/**
 * Icônes : la maille du logo sur fond ivoire. Plein cadre pour les icônes que le
 * système arrondit lui-même (iOS, Android) ; coins arrondis pour le favicon, dont
 * les coins transparents imposent aussi le RGBA exigé par le décodeur ICO de Next.js.
 * Le fond ivoire garde la maille lisible sur un onglet sombre comme sur un clair.
 */
function pageIcone(cote, c, { arrondi = false } = {}) {
  return `<!doctype html><html><head><meta charset="utf-8"><style>
  * { margin: 0; }
  html, body { width: ${cote}px; height: ${cote}px; overflow: hidden; background: transparent; }
  svg { display: block; width: 100%; height: 100%; background: ${c.ivoire}; border-radius: ${arrondi ? "18%" : "0"}; }
</style></head><body>${svgIcone(cote, c)}</body></html>`;
}

/**
 * La maille dessinée pour sa taille de rendu. À 16 et 32 px, un tracé mis à
 * l'échelle tombe entre deux pixels et se brouille en demi-teintes : la maille y
 * est échantillonnée sur la grille (chaque pixel prend la couleur du losange qui
 * contient son centre), symétrique par construction (centre sur un coin de pixel).
 * À 16 px, le cœur rouge ne couvrirait que 2 × 2 pixels — un carré, qui fait lire
 * une croix : la maille s'y réduit au losange vert et à son cœur jaune.
 * Au-delà, tracé vectoriel, la maille occupant 76 % de la hauteur.
 */
function svgIcone(cote, c) {
  const m = maille(18);
  if (cote <= 32) {
    const demiH = cote === 16 ? 7.5 : 14.5;
    const demiL = demiH / Math.sqrt(3);
    const k = cote === 16 ? { jaune: 0.5, rouge: 0 } : { jaune: 0.56, rouge: 0.2 };
    const rects = [];
    for (let y = 0; y < cote; y++) {
      for (let x = 0; x < cote; x++) {
        const d = Math.abs(x + 0.5 - cote / 2) / demiL + Math.abs(y + 0.5 - cote / 2) / demiH;
        const couleur = d <= k.rouge ? c.rouge : d <= k.jaune ? c.soleil : d <= 1 ? c.vert : null;
        if (couleur) rects.push(`<rect x="${x}" y="${y}" width="1" height="1" fill="${couleur}"/>`);
      }
    }
    return `<svg viewBox="0 0 ${cote} ${cote}" shape-rendering="crispEdges">${rects.join("")}</svg>`;
  }
  const h = 76;
  const l = (h * m.largeur) / m.hauteur;
  return `<svg viewBox="0 0 100 100"><g transform="translate(${50 - l / 2} 12) scale(${h / m.hauteur})">
    <path d="${m.vert}" fill="${c.vert}"/><path d="${m.jaune}" fill="${c.soleil}"/><path d="${m.rouge}" fill="${c.rouge}"/></g></svg>`;
}

/** Fichier ICO contenant des PNG (format admis par tous les navigateurs actuels). */
function ico(pngs) {
  const entete = Buffer.alloc(6 + 16 * pngs.length);
  entete.writeUInt16LE(0, 0);
  entete.writeUInt16LE(1, 2);
  entete.writeUInt16LE(pngs.length, 4);
  let decalage = entete.length;
  pngs.forEach(({ cote, donnees }, i) => {
    const e = 6 + 16 * i;
    entete.writeUInt8(cote >= 256 ? 0 : cote, e);
    entete.writeUInt8(cote >= 256 ? 0 : cote, e + 1);
    entete.writeUInt16LE(1, e + 4);
    entete.writeUInt16LE(32, e + 6);
    entete.writeUInt32LE(donnees.length, e + 8);
    entete.writeUInt32LE(decalage, e + 12);
    decalage += donnees.length;
  });
  return Buffer.concat([entete, ...pngs.map((p) => p.donnees)]);
}

/**
 * Capture exacte d'une page à la taille demandée via le protocole DevTools de Chrome
 * (WebSocket natif de Node, aucune dépendance). `--screenshot` en ligne de commande
 * ne convient pas : en mode sans interface, la fenêtre retire ~87 px à la hauteur.
 */
async function capturer(html, largeur, hauteur, polices) {
  const profil = fs.mkdtempSync(path.join(os.tmpdir(), "ofm-og-chrome-"));
  const chrome = spawn(CHROME, [
    "--headless=new",
    "--disable-gpu",
    "--hide-scrollbars",
    "--remote-debugging-port=0",
    `--user-data-dir=${profil}`,
    "about:blank",
  ], { stdio: ["ignore", "ignore", "pipe"] });

  let adresse = "";
  try {
    adresse = await new Promise((resoudre, rejeter) => {
      let tampon = "";
      chrome.stderr.on("data", (morceau) => {
        tampon += morceau;
        const trouve = /DevTools listening on (ws:\/\/\S+)/.exec(tampon);
        if (trouve) resoudre(trouve[1]);
      });
      chrome.on("exit", () => rejeter(new Error(`Chrome s'est arrêté (${CHROME})`)));
    });
    const port = new URL(adresse).port;
    const cibles = await (await fetch(`http://127.0.0.1:${port}/json/list`)).json();
    const ws = new WebSocket(cibles.find((c) => c.type === "page").webSocketDebuggerUrl);
    await new Promise((resoudre) => ws.addEventListener("open", resoudre, { once: true }));

    let suivant = 0;
    const attentes = new Map();
    ws.addEventListener("message", ({ data }) => {
      const message = JSON.parse(data);
      if (message.id && attentes.has(message.id)) {
        const { resoudre, rejeter } = attentes.get(message.id);
        attentes.delete(message.id);
        if (message.error) rejeter(new Error(message.error.message));
        else resoudre(message.result);
      }
    });
    const envoyer = (method, params = {}) =>
      new Promise((resoudre, rejeter) => {
        const id = ++suivant;
        attentes.set(id, { resoudre, rejeter });
        ws.send(JSON.stringify({ id, method, params }));
      });

    await envoyer("Emulation.setDeviceMetricsOverride", {
      width: largeur, height: hauteur, deviceScaleFactor: 1, mobile: false,
    });
    // Fond de page transparent : ce qui n'est pas peint reste transparent (coins du favicon).
    await envoyer("Emulation.setDefaultBackgroundColorOverride", { color: { r: 0, g: 0, b: 0, a: 0 } });
    const fichierHtml = path.join(profil, "page.html");
    fs.writeFileSync(fichierHtml, html);
    await envoyer("Page.navigate", { url: `file://${fichierHtml}` });
    // Attend le chargement puis les polices : sans elles, le rendu retombe sur les polices système.
    const { result } = await envoyer("Runtime.evaluate", {
      expression: `new Promise((ok) => {
        const pret = () => document.fonts.ready.then(() => ok([...document.fonts].filter((f) => f.status === "loaded").map((f) => f.family).join(",")));
        document.readyState === "complete" ? pret() : addEventListener("load", pret);
      })`,
      awaitPromise: true,
      returnByValue: true,
    });
    for (const famille of polices) {
      if (!String(result.value).includes(famille)) throw new Error(`Police non chargée : ${famille}`);
    }
    const { data } = await envoyer("Page.captureScreenshot", {
      format: "png",
      clip: { x: 0, y: 0, width: largeur, height: hauteur, scale: 1 },
    });
    ws.close();
    return Buffer.from(data, "base64");
  } finally {
    // Fermeture propre par le protocole (Browser.close) : tuer le processus laisse
    // ses sous-processus écrire dans le profil pendant qu'on le supprime.
    const arret = new Promise((resoudre) => chrome.once("exit", resoudre));
    if (adresse) {
      const navigateur = new WebSocket(adresse);
      navigateur.addEventListener("open", () => navigateur.send(JSON.stringify({ id: 1, method: "Browser.close" })));
    } else {
      chrome.kill();
    }
    await Promise.race([arret, new Promise((resoudre) => setTimeout(resoudre, 5000))]);
    fs.rmSync(profil, { recursive: true, force: true, maxRetries: 10, retryDelay: 200 });
  }
}

const couleurs = lireJetons(RACINE);
const ecrire = (relatif, donnees) => {
  const cible = path.join(RACINE, relatif);
  fs.mkdirSync(path.dirname(cible), { recursive: true });
  fs.writeFileSync(cible, donnees);
  console.log(relatif);
};

for (const locale of ["fr", "en"]) {
  const png = await capturer(page(locale, couleurs), LARGEUR, HAUTEUR, ["Fraunces", "Inter", "JetBrains Mono"]);
  ecrire(`public${cheminImagePartage(locale)}`, png);
}

const rendreIcone = (cote, options) => capturer(pageIcone(cote, couleurs, options), cote, cote, []);
const favicon = (cote) => rendreIcone(cote, { arrondi: true });
ecrire("app/favicon.ico", ico([{ cote: 16, donnees: await favicon(16) }, { cote: 32, donnees: await favicon(32) }]));
ecrire("app/icon.png", await rendreIcone(96));
ecrire("app/apple-icon.png", await rendreIcone(180));
ecrire("public/icons/icon-192.png", await rendreIcone(192));
ecrire("public/icons/icon-512.png", await rendreIcone(512));
