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
