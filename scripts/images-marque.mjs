#!/usr/bin/env node
// Génère les images de marque du site, dans le langage du hero de l'accueil :
//   public/og/ofm2027-{fr,en}.png   image de partage Open Graph, 1200 × 630, par langue
//   app/favicon.ico                 Σ, 16 et 32 px (PNG encapsulés dans l'ICO)
//   app/icon.png                    Σ, 96 px
//   app/apple-icon.png              Σ, 180 px (apple-touch-icon)
//   public/icons/icon-{192,512}.png Σ, icônes du manifeste web
//
// Image de partage : fond vert-nuit, titre en Fraunces, méta-ligne sous un filet or,
// la figure construite dans son état final. Textes, couleurs et géométrie viennent
// des sources du site (messages, event.json, globals.css, lib/figure-geometrie.ts).
//
// Usage : node scripts/images-marque.mjs   (CHROME_PATH pour un autre Chrome/Chromium)
// Rendu par Chrome sans interface, piloté par le protocole DevTools ; polices Google Fonts.
import { spawn } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { K, OMEGA_R, P } from "../lib/figure-geometrie.ts";
import { composerFrancais } from "../lib/typographie.ts";
import { lireJetons } from "../lib/jetons.ts";

const RACINE = path.resolve(import.meta.dirname, "..");
const lireJson = (fichier) => JSON.parse(fs.readFileSync(path.join(RACINE, fichier), "utf-8"));
const CHROME = process.env.CHROME_PATH ?? "/usr/bin/google-chrome";
const LARGEUR = 1200;
const HAUTEUR = 630;
const POLICES =
  "https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght,SOFT,WONK@0,9..144,300..600,0..100,0..1;1,9..144,300..600,0..100,0..1&family=Inter:wght@400;500&family=JetBrains+Mono:wght@400&display=block";

const echapper = (texte) => texte.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
const seg = (a, b) => `M${a.x} ${a.y}L${b.x} ${b.y}`;

/** La figure du hero, état final de la construction (mêmes épaisseurs et opacités que globals.css). */
function figure() {
  const points = Object.values(P).map((p) => `<circle cx="${p.x}" cy="${p.y}" r="4" class="point"/>`).join("");
  const etiquettes = [
    ["A", -4, -14], ["B", -24, 8], ["C", 14, 8], ["O", -22, -8], ["D", -8, 26], ["E", 12, -10], ["M", -26, 18],
  ]
    .map(([nom, dx, dy]) => `<text x="${P[nom].x + dx}" y="${P[nom].y + dy}" class="etiquette">${nom}</text>`)
    .join("");
  return `<svg viewBox="0 0 600 600" fill="none" stroke-linecap="round" stroke-linejoin="round">
    <circle cx="${P.O.x}" cy="${P.O.y}" r="${OMEGA_R}" class="trait"/>
    <path d="${seg(P.A, P.B)}${seg(P.B, P.C)}${seg(P.C, P.A)}" class="trait"/>
    <path d="${seg(P.A, P.D)}" class="construction"/>
    <circle cx="${K.x}" cy="${K.y}" r="${K.r}" class="construction"/>
    <path d="${seg(P.B, P.E)}" class="trait"/>
    <path d="${seg(P.D, P.E)}${seg(P.O, P.M)}" class="conclusion"/>
    ${points}${etiquettes}
  </svg>`;
}

function page(locale, couleurs) {
  const messages = lireJson(`messages/${locale}.json`);
  const evenement = lireJson("content/event.json");
  const composer = locale === "fr" ? composerFrancais : (texte) => texte;
  const titre = composer(messages.Home.Hero.title);
  const meta = [
    { texte: evenement.dates[locale], donnee: true },
    { texte: composer(`${evenement.city[locale]}, ${evenement.country[locale]}`) },
    { texte: evenement.categories.map((c) => c.name[locale]).join(" · ") },
  ];

  return `<!doctype html><html lang="${locale}"><head><meta charset="utf-8">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="${POLICES}" rel="stylesheet">
<style>
  * { margin: 0; box-sizing: border-box; }
  html, body { width: ${LARGEUR}px; height: ${HAUTEUR}px; overflow: hidden; }
  body {
    background: ${couleurs["vert-nuit"]}; color: ${couleurs.ivoire};
    font-family: Inter, system-ui, sans-serif;
    display: grid; grid-template-columns: 1fr 440px; column-gap: 24px;
    padding: 64px 56px 56px 72px;
  }
  .texte { display: flex; flex-direction: column; justify-content: space-between; }
  .marque { font-size: 22px; font-weight: 500; opacity: .72; display: flex; gap: 12px; align-items: baseline; }
  .marque b { font-family: Fraunces, serif; font-weight: 500; font-size: 28px; color: ${couleurs["or-clair"]}; opacity: 1; }
  h1 {
    font-family: Fraunces, Georgia, serif; font-weight: 400; font-size: 78px; line-height: .98;
    font-variation-settings: "SOFT" 30, "WONK" 1; letter-spacing: -0.02em; text-wrap: balance;
  }
  .meta { border-top: 1px solid ${couleurs.or}; padding-top: 22px; display: flex; gap: 32px; font-size: 21px; font-weight: 500; white-space: nowrap; }
  .donnee { font-family: "JetBrains Mono", monospace; font-weight: 400; font-variant-numeric: tabular-nums; color: ${couleurs["or-clair"]}; }
  .figure { align-self: center; }
  svg { width: 440px; height: 440px; display: block; overflow: visible; }
  .trait { stroke: ${couleurs["or-clair"]}; stroke-width: 1.5; }
  .construction { stroke: ${couleurs.or}; stroke-width: 1.25; opacity: .22; }
  .conclusion { stroke: ${couleurs["or-clair"]}; stroke-width: 2.5; }
  .point { fill: ${couleurs["or-clair"]}; }
  .etiquette { fill: ${couleurs["or-clair"]}; font-family: Fraunces, serif; font-style: italic; font-size: 19px; opacity: .85; }
</style></head><body>
  <div class="texte">
    <p class="marque"><b>Σ</b>OFM 2027</p>
    <h1>${echapper(titre)}</h1>
    <p class="meta">${meta.map((m) => `<span${m.donnee ? ' class="donnee"' : ""}>${echapper(m.texte)}</span>`).join("")}</p>
  </div>
  <div class="figure">${figure()}</div>
</body></html>`;
}

/**
 * Le sigle Σ, or clair sur vert-nuit. Plein cadre pour les icônes que le système
 * arrondit lui-même (iOS, Android) ; coins arrondis pour le favicon, dont les coins
 * transparents imposent aussi le RGBA exigé par le décodeur ICO de Next.js.
 * Tracé à la règle plutôt que composé : Fraunces n'a pas de glyphe grec, et une icône
 * ne doit pas dépendre de la police de repli de la machine qui la génère.
 */
function pageIcone(cote, couleurs, { arrondi = false } = {}) {
  const trait = cote <= 32 ? 11 : 8;
  return `<!doctype html><html><head><meta charset="utf-8"><style>
  * { margin: 0; }
  html, body { width: ${cote}px; height: ${cote}px; overflow: hidden; background: transparent; }
  svg { display: block; width: 100%; height: 100%; background: ${couleurs["vert-nuit"]}; border-radius: ${arrondi ? "18%" : "0"}; }
</style></head><body>
  <svg viewBox="0 0 100 100"><path d="M73 31V23H27L51 50L27 77H73V69" fill="none"
    stroke="${couleurs["or-clair"]}" stroke-width="${trait}" stroke-linejoin="miter" stroke-linecap="square"/></svg>
</body></html>`;
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
  ecrire(`public/og/ofm2027-${locale}.png`, png);
}

const icone = (cote, options) => capturer(pageIcone(cote, couleurs, options), cote, cote, []);
const favicon = (cote) => icone(cote, { arrondi: true });
ecrire("app/favicon.ico", ico([{ cote: 16, donnees: await favicon(16) }, { cote: 32, donnees: await favicon(32) }]));
ecrire("app/icon.png", await icone(96));
ecrire("app/apple-icon.png", await icone(180));
ecrire("public/icons/icon-192.png", await icone(192));
ecrire("public/icons/icon-512.png", await icone(512));
