# Rapport de direction artistique — OFM 2027

> Branche `design/elevation`, six commits indépendamment fusionnables, dans l'ordre :
> `refactor(ui)` → `feat(type)` → `feat(motion)` → `feat(simultaneite)` → `polish(ui)` → `docs`.
> Ce rapport contient le plan retenu (Passe 1, tel que validé), ce qui a été fait (Passe 2),
> les pistes écartées, la liste des mouvements supprimés, les scores Lighthouse avant/après
> et l'index des captures (`docs/captures/`).

---

## 1. Ce que l'audit du code a établi

| Constat | Où | Conséquence |
|---|---|---|
| Le motif « constellation » était un canvas de points **aléatoires** en dérive perpétuelle, reliés par distance | `components/motifs/constellation.tsx` | C'est l'esthétique particles.js. Remplacé par une figure **construite**, déterministe, immobile une fois tracée |
| Eyebrow mono en capitales sur les 9 sections de l'accueil et toutes les pages internes | `section-heading.tsx`, `page-hero.tsx` | Supprimés partout, numérotation comprise |
| 8 liens « … → » avec la flèche dans la chaîne | accueil, équipes, olympiade, problèmes, organisation | Flèche retirée ; lien texte = filet or qui s'épaissit |
| `label-mono` employé 60 fois, dont ~45 sur des libellés d'interface | partout | Mono réservé à la donnée (`.data`), libellés en Inter (`.label`) |
| Quatre blocs sombres alternés sur l'accueil (hero, stats, problèmes, compte à rebours) | accueil | Un seul chapitre sombre : hero + geste signature |
| `--gris` sur sable = **4,26:1**, `--link` sur sable = **4,45:1** : sous AA | stats, partenaires, historique, tous les liens sur sable | Tons `--encre` et `--or-encre` |
| Compte à rebours calé sur minuit UTC, avec un lead « les dates seront annoncées » alors qu'elles sont confirmées | `countdown.tsx` | Absorbé par le geste signature |
| Le règlement OFM publié sur le site (art. 5.8) fixe l'heure : « traditionnellement à 09:00 heure de Paris », 4 h 30 | `public/documents/ofm-reglement-2025.pdf` | Instant de référence, **affiché en heure de Dakar** (08:00), règlement cité en note |
| Base IANA (ICU 77) : Paris, Bruxelles, Zurich passent de +01:00 à +02:00 entre le 27 et le 28 mars 2027 ; Casablanca est à +00:00 début mars (ramadan) et revient à +01:00 le 27 | vérification Node | Deux pièges réels, couverts par les tests |
| 74 apostrophes droites dans `messages/fr.json`, aucun guillemet français | messages, content | Microtypographie appliquée **au rendu** |
| Drapeaux emoji | délégations | Ne rendent pas sous Windows : SVG partout |

---

## 2. Palette — 6 valeurs nommées

Les teintes du brief sont conservées ; ce qui change est leur **répartition** : le sombre devient rare.

| Nom | Hex | Rôle unique | Contrastes WCAG |
|---|---|---|---|
| **Nuit** `--vert-nuit` | `#0E2018` | Le seul fond sombre : hero + geste signature | ivoire 16,1 · or-clair 10,6 · or 7,4 |
| **Sable** `--sable` | `#F5F0E8` | Fond dominant (papier chaud) | anthracite 15,0 · vert 9,8 · encre 6,7 |
| **Ivoire** `--ivoire` | `#FBF9F4` | Surfaces posées sur le sable, pages de lecture | anthracite 16,2 · vert 10,5 |
| **Vert** `--vert` | `#1B4332` | Titres et texte fort sur clair, boutons pleins. Plus jamais en fond de section | sur sable 9,8 |
| **Or** `--or` / `--or-clair` | `#C9A84C` / `#E8C97A` | Sur nuit : figure, chiffres. Sur clair : filets à 40 % et gros titres seulement | sur nuit 7,4 / 10,6 |
| **Terre** `--terracotta` / `--terracotta-clair` | `#B24A2E` / `#E07A5A` | **Un seul emploi** : le trait « maintenant » de la partition (clair sur nuit) | clair sur nuit ≥ 5 |

Tons dérivés, fixes dans les deux thèmes (surfaces claires fixes) : `--encre` `#4B5563` (texte secondaire, sable 6,66 · ivoire 7,18), `--or-encre` `#6F5314` (liens, sable 6,33 · ivoire 6,83). Le mode sombre existant est conservé ; `--link` et `--ring` y basculent sur l'or clair.

---

## 3. Typographie

**Fraunces — la voix.** h1, h2, chiffres de tête. Axes réellement chargés via `next/font` (`opsz`, `SOFT`, `WONK`) : titrage `SOFT 30, WONK 1` (l'esperluette et certaines lettres prennent leurs formes « wonky »), intertitres `SOFT 0, WONK 0`, `opsz` automatique (l'axe suit la taille réelle du texte), `text-wrap: balance`. Interlignage 0,95 / 1,05 / 1,2.

**Inter — l'interface et la lecture.** Corps 1,0625 rem / 1,65, mesure 62 ch, `text-wrap: pretty`. Libellés (`.label`) : 0,875 rem, graisse 500, jamais de capitales ni de tracking.

**JetBrains Mono — la donnée.** Règle vérifiable : *ce qui est en mono peut se trier ou se calculer.* Dates, heures, durées, effectifs, années, numéros de problème, compte à rebours, heures locales. Chiffres tabulaires (`.data`, tables) ; proportionnels dans le texte courant.

**Microtypographie française — au rendu** (`lib/typographie.ts`) : fine insécable avant `; : ! ?` et dans les guillemets « », apostrophe U+2019, insécables nombre/unité, « OFM 2027 », dates (trait d'union insécable), insécable avant le dernier mot des titres quand le bloc final est court. Branchée dans `i18n/request.ts` (messages fr), `lib/contenu.ts` (frontière unique du contenu JSON), `lib/content.ts` (délégations, problèmes) et `lib/remark-typographie.ts` (MDX, après remark-math). **Exclusions explicites** : `$…$`, `$$…$$`, `\(…\)`, `\[…\]`, code entre accents graves, adresses (`@`, `://`), deux-points des heures. Les fichiers `messages/*.json` et `content/` ne changent pas d'un caractère ; l'anglais n'est pas touché. 17 tests (`tests/typographie.test.ts`).

---

## 4. Mise en page — ce qui a été construit

**Accueil** — six sections de hauteurs différentes, un seul chapitre sombre au début :
1. **Hero** (nuit) : titre à gauche, la figure construite à droite avec sa légende (lien vers le sujet PDF), méta-ligne (dates en mono, lieu, langue, catégories).
2. **Partition** (nuit) : le geste signature, voir §5.
3. **Fiche et chiffres** (sable) : « 2027 » et la fiche à gauche, la liste définition à droite, puis les quatre nombres en **une ligne entre deux filets**.
4. **Catégories** (ivoire) : diptyque Junior | Senior séparé d'un filet vertical, sans boîtes.
5. **Délégations** (sable) : registre à trois colonnes, drapeau SVG + nom, « Pays hôte » en Inter bas de casse, statut `en attente` par la couleur du nom et un libellé.
6. **Problèmes** (ivoire, compact), **Partenaires** (sable, noms en Fraunces sur lignes filetées, « en cours de confirmation » en Inter), **FAQ** (accordéon natif).

**Pages internes** : le titre ouvre la page sur sable, sans bande sombre ; le contenu enchaîne sous un filet or.
- **Historique** : une vraie `<table>` (thead, chiffres mono tabulaires alignés à droite, effectifs Junior/Senior lus au rendu dans le champ `note`, archives en colonne) ; la liste des nations en texte simple.
- **Équipes** : registre à deux colonnes, la ligne Sénégal porte sa description et le lien vers la fiche. La fiche pays passe sur sable.
- **Olympiade**, **Organisation** : titre | texte en deux colonnes, diptyque des catégories, faits du format et comités en listes définition/description sans cartes.
- **Programme** : structure conservée ; le jour 1 affiche l'heure de début en heure de Dakar avec renvoi vers la partition.
- **Problèmes** : lignes filetées à la place des cartes, catégorie en bas de casse, numéro en mono.

---

## 5. Geste signature — la partition de la simultanéité

### Pistes explorées

| Piste | Verdict | Raison |
|---|---|---|
| **Cadran** à quatorze aiguilles | écartée | Des aiguilles à des angles différents montrent des *instants différents* : le contraire du message. Et c'est le cliché des horloges de hall d'hôtel |
| **Ruban** de quatorze horloges | écartée | C'est la liste des fuseaux que le brief interdit |
| **Arc / méridiens** | écartée | Conduit à une carte, cliché de l'international ; la géographie est hors sujet, personne ne voyage |
| **Constellation** qui s'allume | écartée | Muette sur la différence des horloges |
| **Partition** — règles horaires empilées et décalées, une barre verticale | **retenue** | Une seule forme traverse quatorze échelles différentes : la définition graphique de la simultanéité, et l'image de la barre de mesure d'une partition |

### Réalisation (`components/home/simultaneite.tsx`, `simultaneite-partition.tsx`, `lib/fuseaux.ts`)
- Quatorze lignes, une par délégation, chacune avec sa règle sur la journée UTC de l'épreuve, graduée en **heure locale** (décalage IANA à l'instant de l'épreuve) ; la ligne du pays hôte en or.
- **Une seule bande** (l'épreuve, 4 h 30) traverse toutes les lignes ; le trait « maintenant » (terre) avance à vitesse réelle ; le compte à rebours est la distance entre les deux traits.
- Trois états : avant (trait + compte à rebours), pendant (bande pleine, « épreuve en cours »), après (bande solide, trait disparu, ligne commémorative).
- Ligne du visiteur après hydratation, dans un espace réservé (CLS = 0) ; si son fuseau est celui d'une délégation, la ligne de celle-ci est surlignée (« Vous »).
- Sémantique : `<ol>` réel (« Sénégal, 08:00 heure locale »), règles en `aria-hidden`, compte à rebours en `role="status"`. Sous `prefers-reduced-motion` : mise à jour à la minute.
- Mobile : nom, décalage et heure sur une ligne, la règle en pleine largeur dessous.

### Instant de référence et correctness
`content/event.json` porte un champ technique `exam` : `2027-03-27T08:00:00Z`, référence `Africa/Dakar`, 270 min, `provisional: true`. Affiché **08:00 à Dakar** ; la note cite le règlement (art. 5.8, 09:00 heure de Paris). Chaque délégation porte son fuseau IANA. `lib/fuseaux.ts` s'appuie sur la base IANA d'ICU via `Intl` — **aucun décalage en dur**, aucune dépendance, fonctions pures (le HTML statique ne dépend pas de l'heure de build).

**Tests** (`tests/fuseaux.test.ts`, 41 cas, `npm test`) : Paris/Bruxelles/Zurich à +60 le 27 et +120 le 28 mars 2027 ; « 09:00 mural » = 08:00 UTC le 27 et **07:00 UTC le 28** ; l'heure inexistante de la nuit du changement est résolue ; Casablanca +0 le 1ᵉʳ mars et +60 le 27 ; stabilité des onze autres fuseaux ; les quatorze heures locales de début ; états et compte à rebours.

---

## 6. Séquence d'ouverture — la géométrie de l'hospitalité, littéralement

La figure du hero est **celle du problème 3 (Senior) de l'OFM 2024**, publié sur ce site : ABC acutangle, ω son cercle circonscrit de centre O ; la hauteur issue de A recoupe ω en D ; le cercle circonscrit à OCD recoupe [AC] en E ; M milieu de [BE] ; à démontrer, (DE) ∥ (OM). Coordonnées calculées une fois (parallélisme vérifié numériquement), SVG inline, chorégraphie CSS :

| t | Geste |
|---|---|
| 0 – 500 ms | ω, puis les trois côtés depuis leurs sommets |
| 450 – 850 ms | la hauteur prolongée jusqu'à D (trait de construction) |
| 800 – 1250 ms | le cercle OCD, E |
| 1200 – 1750 ms | [BE], M, puis (DE) et (OM) en trait fort |
| 1600 – 1900 ms | les traits de construction s'estompent à 14 % ; la figure reste, immobile |

Texte lisible dès 0 ms (aucun écran de chargement) ; une fois par session (`sessionStorage`) ; état final direct sous `prefers-reduced-motion`. Légende vraie sous la figure, liée au sujet PDF. Ce langage n'est réutilisé nulle part.

---

## 7. Mouvement

### Supprimé
1. La dérive perpétuelle du canvas constellation, et le canvas lui-même (plus aucun point aléatoire sur le site).
2. La grille isométrique en fond de section (stats, délégations, page-hero, panneaux « à venir »).
3. `hover:-translate-y` + ombre élevée sur les pastilles pays, les cartes équipes et problèmes.
4. `transition-colors` uniforme sur tous les liens et boutons (36 occurrences).
5. Les animations d'accordéon importées (`tw-animate-css`, dépendance retirée).
6. La section compte à rebours et son rafraîchissement à la seconde hors du geste signature.

### Conservé ou ajouté — chacun avec sa physique
| Mouvement | Déclencheur | Durée / courbe |
|---|---|---|
| Construction de la figure | chargement de l'accueil, une fois par session | 1,8 s, tracés `cubic-bezier(0.45, 0.05, 0.25, 1)` |
| Trait « maintenant » | le temps | vitesse réelle, sans transition |
| Bascule d'état de la partition | franchissement de l'instant | 400 ms, courbe signature |
| Accordéon FAQ (`details`/`summary` natif) | clic | ouverture 280 ms courbe signature, fermeture 180 ms `ease-in`, chevron 250 ms |
| Menu mobile | clic | 200 ms, opacité seule |
| Lien texte | survol | filet 1 → 2 px, 120 ms |
| Bouton plein | survol / appui | fond 100 ms, appui 1 px |
| Filet du header | scroll > 8 px | 150 ms |
| Focus clavier | tabulation | anneau 2 px or d'encre (clair) / or clair (nuit), décalé de 3 px |

Aucune apparition au scroll, nulle part.

---

## 8. Relecture critique du plan — ce qui a été révisé

| Point de départ | Générique ? | Révision |
|---|---|---|
| Hero sombre avec réseau de points reliés | oui | Figure d'un problème réel, construite dans l'ordre de l'énoncé, puis immobile |
| Compte à rebours à quatre cases | oui | Devient la distance entre deux traits sur la partition |
| Quatre grands chiffres en grille | oui | Une ligne de chiffres entre deux filets, dans la fiche |
| Bande sombre en tête de chaque page interne | oui | Titres sur papier ; le sombre est réservé à l'accueil |
| Eyebrows numérotés | oui, même numérotés | Supprimés, numérotation comprise |
| Cartes délégations avec survol qui soulève | oui | Registre filaire |
| Trio Fraunces / Inter / JetBrains Mono | en partie | Axes variables activés, règle « mono = donnée » |
| Grille isométrique | oui | Retirée ; l'idée de règle graduée survit dans la partition, où elle porte une information |
| Partition, microtypographie au rendu | non | Conservées |

**Retrait final (§7 du brief)** — tranché par le commanditaire : l'italique dans les grands titres, prévu au plan, n'a **pas** été implémenté (tic documenté de page générée). Le soulignement animé des liens et la légende sous la figure sont conservés.

**Corrections demandées à la validation, toutes appliquées** : heure de référence affichée en heure de Dakar (règlement cité en note) ; drapeaux en SVG partout (flag-icons, MIT, 14 fichiers dans `public/flags/`) ; pas d'italique dans les titres ; exclusion explicite du contenu mathématique et des délimiteurs KaTeX dans la transformation typographique, testée. `CLAUDE.md` mis à jour dans les mêmes commits (section « Chrome interdit », motif signature, doctrine du mouvement, geste signature).

---

## 9. Lighthouse — avant / après

Mesures : Lighthouse 12, Chrome headless, `next start` local, bridage **simulé** (défaut), thème clair forcé (le site suit le système). Fichiers : `docs/captures/lighthouse-avant.json`, `lighthouse-apres.json`.

| Page | Format | Perf avant → après | A11y | Bonnes pratiques | SEO | CLS |
|---|---|---|---|---|---|---|
| Accueil | mobile | 88 → **91** | 96 → **100** | 100 | 100 | 0 |
| Accueil | desktop | 71 → **74** | 96 → **100** | 100 | 100 | 0 |
| Équipes | mobile | 93 → **93** | 100 | 100 | 100 | 0 |
| Équipes | desktop | 68 → **67** | 100 | 100 | 100 | 0 |
| Historique | mobile | 91 → **90** | 96 → **100** | 100 | 100 | 0 |
| Historique | desktop | 82 → **80** | 95 → **100** | 100 | 100 | 0 |

Accessibilité, bonnes pratiques et SEO sont à 100 partout (les trois défauts de contraste de la version livrée sont corrigés). CLS = 0 : le mouvement ne décale rien.

**Le plancher « performance ≥ 95 » n'est pas atteint, et ne l'était pas avant cette branche.** Le diagnostic, vérifié par expérience :
- Sans bridage, LCP = FCP = **0,3 s** (score 100). Le LCP simulé (3,3 – 3,5 s) vient du modèle *Lantern* de Lighthouse, qui compte comme critiques toutes les ressources chargées avant le premier rendu observé — sur un serveur local, toutes le sont.
- Pages de laboratoire servies dans les mêmes conditions : titre sans police web → LCP 0,75 s, perf **99** ; mêmes trois polices web, sans JavaScript → LCP 1,95 s, perf **91** ; polices + les scripts du site en `async` → LCP 3,3 s, perf **82**. Ne précharger qu'une police ne change rien (87).
- Autrement dit, sous ce bridage, **les trois polices web plafonnent le score desktop autour de 91**, et le seul moyen d'atteindre 95 serait `font-display: optional` (la police n'est pas utilisée à la première visite sur une connexion lente) ou l'abandon des polices web — deux choix contraires au brief. Nous ne les avons pas faits.
- Ce qui a été fait pour alléger : en-tête serveur avec un îlot client sans moteur de traduction (les messages ne sont plus envoyés au navigateur), FAQ en `details`/`summary` natif, retrait de `@base-ui/react`, `shadcn` et `tw-animate-css`. JavaScript transféré : 225 → 214 Ko gzip, dont ~120 Ko de socle React/Next.
- Ce qui pèse et qui est assumé : Fraunces avec ses axes (85 → 121 Ko woff2), Inter (48 Ko), JetBrains Mono (31 Ko).

Mesuré avec bridage réel (`devtools`) sur cette machine, FCP = LCP = 1,9 s ; sans bridage, 0,3 s.

---

## 10. Captures (`docs/captures/`)

- `avant-*.png` / `apres-*.png` (1440 px) : accueil, équipes, historique, olympiade, programme, problèmes ; `avant-accueil-mobile.png`, `apres-accueil-mobile.png` (390 px) ; `apres-accueil-sombre.png`.
- `construction-700ms.png`, `construction-1200ms.png`, `construction-2100ms.png` : trois instants de la séquence d'ouverture.
- `partition-avant-berlin.png` (visiteur hors des quatorze fuseaux), `partition-avant-dakar.png` (visiteur à l'heure du Sénégal), `partition-pendant.png`, `partition-apres.png` (horloge simulée au 27 mars 2027 et au 2 avril 2027), `partition-avant-mobile.png`.
- `faq-ouverte.png` : accordéon natif ouvert.

---

## 11. Vérifications

- `npm run build` : 55 pages statiques, sans erreur. `npx eslint .` : aucun avertissement. `npx tsc --noEmit` : propre.
- `npm test` : 57 cas (typographie 17, fuseaux 40), tous verts.
- Parité fr/en : 181 clés de chaque côté.
- Contenu : `content/` n'a reçu que deux champs techniques validés (`exam`, `timeZone`), insérés sans reformater les fichiers ; aucun texte informatif modifié. Aucune route ajoutée, supprimée ni renommée.
- `prefers-reduced-motion` : figure à l'état final, partition sans transition (mise à jour par minute), accordéon instantané, aucune autre animation.
- Focus clavier : anneau or décalé sur tout élément focalisable ; navigation au clavier de l'accordéon et du menu par le navigateur.

### Limites connues
- L'animation de l'accordéon natif repose sur `::details-content` interpolable (Chrome 131+, Edge) ; ailleurs l'ouverture est instantanée mais complète.
- Le champ `flagEmoji` reste dans les données (non affiché) : le retirer relèverait d'une modification de contenu.
- En mode sombre (thème système), le principe « un seul chapitre sombre » ne peut pas s'exprimer ; le site reste lisible et conforme AA.
