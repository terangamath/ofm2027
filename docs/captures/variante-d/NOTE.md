# Variante D — « Teranga géométrique »

Branche `design/variante-d`, partie de `design/variante-a`. Références : `docs/references/`
(IMG_5254 principale, IMG_5257 pour la figure, IMG_5255 écartée).

## Repris des maquettes

- **5254** : fond ivoire dominant ; titre Fraunces grasse en vert profond ; **disque soleil**
  plein, décentré vers le haut et la droite, derrière la figure ; **cercles et arcs de
  construction** visibles, fins, en pointillés ; **bandeau tissé** vertical pleine hauteur
  sur le bord droit (rouge, vert, jaune, ivoire) ; rangée de quatre informations à
  **pastilles circulaires** (vert, jaune, rouge, vert) séparées par des filets ; bouton
  principal en pilule ; hero compact.
- **5257** : la **vraie figure** du problème 3 Senior OFM 2024 (A, B, C, D, E, O, M), pas un
  triangle décoratif.

## Construit, pas importé

- **Bandeau** : une colonne du pavage {3,6} (`lib/pavage.ts`, testée) : losanges de deux
  triangles empilés pointe contre pointe, deux losanges emboîtés par homothétie, flancs en
  dents de scie alternant rouge et jaune, liserés verts. Frise p2mm. Un `<pattern>` SVG, des
  couleurs par classes (suivent le thème), aucune animation. 52 px en desktop, 28 px en
  tablette, **couché sous le hero (20 px) sur téléphone** : la version supprimée laissait
  le hero sans transition vers la partition ; la bande couchée fait couture.
- **Construction de O** : les médiatrices de [AB] et [AC], chacune obtenue par deux arcs de
  compas qui se coupent hors de ω (petit cercle à la pointe du compas), tracées en
  pointillés jusqu'au-delà de O (`lib/figure-geometrie.ts`, `COMPAS`, testé : la pointe
  est équidistante des extrémités, la droite passe par O). Ordre de la séquence (1,8 s) :
  triangle, arcs, médiatrices, O, ω, hauteur, cercle OCD, conclusion.
- **Logo** (emplacement, `components/brand/logo.tsx`) : une maille du bandeau. Rien n'en
  dépend.

## Écarté, et pourquoi

- **5255** en entier (consigne) : sans-serif à la place de Fraunces, double composition
  droite + bande basse, trop de couleurs.
- La **flèche** dans le bouton de 5254 : interdite par la direction artistique (§2).
- Le triangle équilatéral générique de 5254 : remplacé par la vraie figure.
- Lieu et langue officielle sortent de la rangée du hero (ils restent dans la fiche
  événement) au profit de « Épreuves à distance » et de l'organisateur, comme sur 5254.

## Écarts à CLAUDE.md, à trancher si la variante est retenue

- Deux couleurs ajoutées à la palette : `--soleil` `#F0C33C` (disque, bandeau, pastille) et
  `--rouge` `#BC3A2A` (bandeau, pastille, droite de conclusion). La terracotta reste seule
  au trait « maintenant » de la partition.
- Ivoire dominant, sable en alternance (l'inverse de la variante A).
- Le Σ quitte le logo (il reste en icône de l'organisateur et dans le favicon).

## Contrastes mesurés au rendu (Chrome, valeurs calculées)

| Point sensible | Clair, sur disque | Clair, sur ivoire | Sombre, sur disque | Sombre, sur fond |
|---|---:|---:|---:|---:|
| Traits, points (seuil 3:1) | 6,63 | 10,53 | 6,02 | 12,3 |
| **Lettres A…M** (seuil 4,5:1) | **6,63** | 10,53 | **6,02** | 12,3 |
| Arcs et pointillés de construction | 3,83 | 6,07 | 4,46 | 9,11 |
| Droite de conclusion (DE), (OM) | 3,33 | 5,28 | 3,41 | 6,96 |

| Pastille | Icône / pastille | Pastille / fond (3:1) |
|---|---:|---:|
| Verte (clair · sombre) | 10,53 · 6,85 | 10,53 · 6,12 |
| **Jaune** (clair · sombre) | 10,15 · 10,15 | **1,59 → liseré or profond 5,93** · 9,07 |
| Rouge (clair · sombre) | 5,28 · 5,73 | 5,28 · 5,12 |

Icônes vert nuit sur le jaune, jamais blanches. En clair, le jaune seul ne fait que 1,59:1
sur l'ivoire : un liseré or profond intérieur de 1,5 px en dessine le bord.

Audit complet (11 routes × fr/en × clair/sombre × 1440/390) : **10 416 mesures, 0 KO**
(`contraste.md`).

## Poids et performance

- Bandeau (deux orientations) + disque + règles CSS : **903 o gzip** dans le HTML
  (≈ 1,8 Kio en comptant la copie dans la charge RSC). Budget : 3 Kio.
- Lighthouse mobile, 3 passages, même machine, build de production :
  A : perf 85 / 89 / 91, LCP médian 3,47 s ; D : perf 88 / 89 / 85, LCP médian 3,25 s ;
  CLS 0 des deux côtés ; accessibilité 100. Pas de régression au-delà du bruit de mesure.
  (SEO 66 des deux côtés en local : `noindex` hors production, voulu.)
- 390 × 844 : titre, texte, bouton et **les quatre** informations visibles sans défiler.
- `prefers-reduced-motion` : figure à l'état final, aucune animation ; le bandeau n'est
  jamais animé.

---

# Suite — bandeau des pages internes et partenaires

## Bandeau sur le hero des pages internes

- Un seul bandeau par page, dans le `PageHero` des huit pages internes (Olympiade,
  Organisation, Équipes, Programme, Problèmes, Historique, Contact, Mentions légales).
  Vertical à droite dès la tablette, couché sous le hero sur téléphone. Rien dans le pied
  de page, rien entre deux sections.
- Phase propre à chaque page (`PHASES`, `components/layout/page-hero.tsx`) : même pavage,
  morceau différent — le haut de la colonne tombe tantôt sur un flanc rouge, tantôt sur
  un jaune, tantôt au milieu d'un losange.
- Les fiches pays et les pages d'un problème n'ont pas de hero distinct (titre et contenu
  dans une même section) : pas de bandeau, il y courrait sur toute la page.
- Hauteurs : de ~230 px (Mentions légales, titre seul) à ~450 px (Équipes). Même au plus
  court, quatre losanges entiers : pas de timbre-poste, pas besoin de passer à
  l'horizontale en desktop.

**Avis.** Ça tient, à une condition que j'ai ajoutée : le bandeau doit reposer sur
quelque chose. Sur l'accueil il s'arrête sur un changement de fond ; sur les pages
internes, la section suivante a le même ivoire, et la première version flottait. Le filet
or qui fermait l'en-tête est désormais tiré sur toute la largeur et reçoit le pied du
bandeau : la bande se lit comme une lisière d'en-tête, pas comme un ornement collé. Une
colonne par page, en tête, ne pèse pas ; je n'irais pas plus loin.

## Partenaires — inventaire du dépôt `terangamath/terangamath-website`

Commit source `4850108`. Logos dans `src/assets/partners/`, données dans
`src/components/partners/Partners.jsx` (et un bandeau de logos dans `Home.jsx`).

| Partenaire | Fichier source | Format | Dimensions | Poids | Fond | Catégorie sur le site Terangamath | Ici |
|---|---|---|---|---:|---|---|---|
| « CACI Assurance » | `CaCI.png` | PNG | 580 × 360 | 22,1 Kio | transparent | Entreprises | **non repris** : c'est le logo de Crédit Agricole Assurances, rangé par erreur sous CACI |
| Animath | `animath.png` | PNG | 300 × 120 | 13,6 Kio | transparent | Associations | **affiché** |
| Force N | `ForceN.webp` | WebP | 448 × 170 | 19,9 Kio | transparent | Académiques | **affiché** |
| AIMS Sénégal | `aimssn.png` | PNG → WebP sans perte | 2352 × 433 | 65,6 → 24,3 Kio | transparent | Académiques | en attente |
| ANSTS | `ANSTS.jpg` | JPEG | 200 × 200 | 8,1 Kio | blanc | Institutionnels | en attente |
| Ministère de l'Éducation nationale | `men.png` | PNG | 225 × 225 | 4,6 Kio | blanc | Institutionnels | en attente |
| APROSS | `afr.jpg` | JPEG | 554 × 554 | 39,2 Kio | gris clair | — | en attente |

Trouvés mais **sans logo dans le dépôt** (non repris) :
- **Math & Maroc** (page Partenaires) : logo chargé depuis `mathmaroc.com`.
- **POFM** et **ADAM-Maths (Djibouti)** (bandeau de l'accueil Terangamath) : logos chargés
  depuis des sites tiers.
- Le Ministère y est affiché en initiales « MEN » ; le fichier `men.png` existe pourtant
  dans le dépôt, sans être utilisé.
- `afr.jpg` (APROSS) est importé dans `Home.jsx` mais affiché nulle part.

**Campus France** (cité par l'association pour l'OFM) : **absent du dépôt**. Entrée créée
dans les données, sans logo, en attente.

### Choix

- Affichés : les trois noms cités par l'association pour l'OFM **et** présents dans le
  dépôt — Animath, Force N. **CaCi** reste confirmé mais sans logo ni lien (donc masqué) :
  le fichier du dépôt est celui de Crédit Agricole Assurances, et le lien pointait vers
  leur site ; le bon logo sera fourni par l'association. Les autres logos sont versés et
  en `pending` :
  passer `status` à `"confirmed"` suffit à les afficher, sans toucher au code.
- Catégories laissées à `null` : celles du site Terangamath (associations, entreprises,
  académiques) ne recouvrent pas celles de l'OFM (institutionnel, financier, technique).
  Le Ministère et l'UCAD gardent la leur (`institutionnel`), déjà présente.
- Aucun logo modifié. AIMS est seulement réencodé en WebP sans perte (0 pixel différent,
  vérifié) : 24 Kio au lieu de 66.
- Aucune version claire dans le dépôt : chaque logo est posé sur une plaque blanche, dans
  les deux thèmes. Taille optique (surface constante, hauteur 28 à 72 px).
- À signaler à l'association si ces logos doivent paraître : **APROSS** est un JPEG sur
  fond gris clair (un carré gris se voit sur la plaque blanche) et **MEN** a de grandes
  marges internes (il paraît petit). Des fichiers PNG transparents et recadrés seraient
  préférables ; je ne les ai pas retouchés.

## Vérifications

- Audit de contraste complet : **10 544 mesures, 0 KO** (après correction : la première
  version mettait le cadre et l'anneau de focus sur le lien ; le cadre est passé sur le
  `<li>`, l'anneau à l'intérieur de la plaque, or d'encre sur blanc, 7,18:1 dans les deux
  thèmes).
- Logos : `next/image`, dimensions explicites, chargement différé, `srcset` 1x/2x
  (8 Kio en 1x pour les deux logos affichés, 22 Kio en 2x). CLS 0.
- Lighthouse mobile, accueil, 3 passages : 85 / 91 / 90, accessibilité 100 (avant ces
  ajouts : 88 / 89 / 85). Équipes : 93, accessibilité 100.
- Test `tests/partenaires.test.ts` : chaque logo référencé existe, ses dimensions
  déclarées sont les vraies, il pèse au plus 50 Kio, son nom est renseigné en fr et en en.
