#!/usr/bin/env node
// Génère les icônes du site à partir de l'emblème officiel de l'OFM 2027
// (public/icons/logo-without-text.png : le π, le baobab et la pirogue, sans texte) :
//   app/favicon.ico                   16 et 32 px (PNG encapsulés dans l'ICO)
//   app/icon1.png, app/icon2.png      16 et 32 px (<link rel="icon"> générés par Next.js)
//   app/apple-icon.png                180 px (apple-touch-icon), sur fond ivoire
//   public/icons/icon-{192,512}.png   icônes du manifeste web (app/manifest.ts)
//
// L'emblème est recadré sur sa partie visible, puis centré dans un carré sans
// déformation (fit "contain") : ni étiré ni coupé, le fond reste transparent.
// Seule l'icône Apple reçoit un fond : iOS remplit la transparence de noir.
//
// Usage : node scripts/icones.mjs   (sharp est fourni par Next.js)
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";
import { lireJetons } from "../lib/jetons.ts";

const RACINE = path.resolve(import.meta.dirname, "..");
const SOURCE = path.join(RACINE, "public/icons/logo-without-text.png");
const TRANSPARENT = { r: 0, g: 0, b: 0, alpha: 0 };
// Les pixels presque transparents (poussière du détourage) ne comptent pas dans le cadrage.
const SEUIL_ALPHA = 16;

/** Boîte des pixels visibles de l'emblème. */
async function cadrage() {
  const { data, info } = await sharp(SOURCE).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  let gauche = info.width, haut = info.height, droite = -1, bas = -1;
  for (let y = 0; y < info.height; y++) {
    for (let x = 0; x < info.width; x++) {
      if (data[(y * info.width + x) * 4 + 3] > SEUIL_ALPHA) {
        gauche = Math.min(gauche, x);
        droite = Math.max(droite, x);
        haut = Math.min(haut, y);
        bas = Math.max(bas, y);
      }
    }
  }
  return { left: gauche, top: haut, width: droite - gauche + 1, height: bas - haut + 1 };
}

const boite = await cadrage();
const embleme = await sharp(SOURCE).extract(boite).png().toBuffer();

/**
 * L'emblème centré dans un carré de `cote` px, avec une marge relative.
 * Aux petites tailles, aucune marge : chaque pixel compte pour la lisibilité.
 */
async function icone(cote, { marge = 0, fond = TRANSPARENT } = {}) {
  const interieur = Math.round(cote * (1 - 2 * marge));
  const reduit = await sharp(embleme)
    .resize(interieur, interieur, { fit: "contain", background: TRANSPARENT, kernel: "lanczos3" })
    .png()
    .toBuffer();
  return sharp({ create: { width: cote, height: cote, channels: 4, background: fond } })
    .composite([{ input: reduit, gravity: "center" }])
    .png({ compressionLevel: 9 })
    .toBuffer();
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

const ecrire = (relatif, donnees) => {
  fs.writeFileSync(path.join(RACINE, relatif), donnees);
  console.log(relatif);
};

const couleurs = lireJetons(RACINE);
const ivoire = couleurs.ivoire;
const fondIvoire = {
  r: parseInt(ivoire.slice(1, 3), 16),
  g: parseInt(ivoire.slice(3, 5), 16),
  b: parseInt(ivoire.slice(5, 7), 16),
  alpha: 1,
};

const p16 = await icone(16);
const p32 = await icone(32);
ecrire("app/favicon.ico", ico([{ cote: 16, donnees: p16 }, { cote: 32, donnees: p32 }]));
ecrire("app/icon1.png", p16);
ecrire("app/icon2.png", p32);
ecrire("app/apple-icon.png", await icone(180, { marge: 0.1, fond: fondIvoire }));
ecrire("public/icons/icon-192.png", await icone(192, { marge: 0.04 }));
ecrire("public/icons/icon-512.png", await icone(512, { marge: 0.04 }));
