# content/ — Contenu OFM 2027

Source de vérité du contenu du site. La présentation (composants, styles) est séparée
des données. **Aucune valeur en dur dans les composants** : tout vient d'ici.

## Structure

```
content/
  types.ts            # Types TypeScript stricts (à importer partout — jamais de `any`)
  event.json          # Fiche événement globale (lieu, dates, catégories)
  stats.json          # Chiffres clés accueil (champ `provisional`)
  faq.json            # FAQ bilingue
  partenaires.json    # Partenaires : affichés seulement si confirmed + logo (public/partenaires/)
  programme.json      # Programme (status coming_soon + jours/événements)
  editions.json       # Historique des éditions
  organisation.json   # Comités et membres
  delegations/        # 1 fichier JSON par pays  → route /equipes/[pays]
    senegal.json
    france.json
    cote-divoire.json
  actualites/         # 1 MDX par langue         → route /actualites/[slug]
    fr/AAAA-MM-JJ-slug.mdx
    en/AAAA-MM-JJ-slug.mdx
  problemes/          # 1 MDX par langue         → route /problemes
    fr/EDITION-categorie-NN.mdx
```

## Conventions

- **i18n** : les données JSON portent des champs `LocalizedText` (`{ fr, en }`).
  Les contenus longs (actualités, problèmes) sont **un fichier MDX par langue**,
  reliés par un `slug` commun dans le frontmatter.
- **Placeholders** : tout ce qui n'est pas confirmé est marqué explicitement
  (`[À confirmer]`, `datesConfirmed: false`, `status: "coming_soon"`,
  `members: null`, `provisional: true`). **Ne jamais présenter un placeholder
  comme un fait acquis** (partenaire signé, résultat, chiffre précis).
- **Statuts** : `EngagementStatus` = `confirmed | pending` (délégations, partenaires) ;
  `ContentStatus` = `published | coming_soon` (programme, problèmes, éditions).
- **Ajouter un pays** : déposer `delegations/<slug>.json` (voir les exemples).
  `status: "invited"` : pays invité sans réponse, présent dans les données mais
  jamais rendu ; passer à `"confirmed"` (et renseigner `timeZone`) pour l'afficher.
  `ofName` donne le nom avec sa préposition, pour le titre de la fiche
  (« Délégation **de la Belgique** », « Delegation of **the Comoros** »).
- **Publier une équipe** : dans `members`, un objet par personne connue, dans
  l'ordre d'affichage. Chaque équipe montre 6 participants et 2 encadrants ;
  les places sans membre affichent « À confirmer » (jamais de nom inventé) :
  ```json
  "members": [
    { "name": "Prénom Nom", "category": "junior", "position": "participant",
      "photo": "/delegations/senegal/prenom-nom.jpg",
      "detail": { "fr": "15 ans", "en": "15 years old" } },
    { "name": "Prénom Nom", "category": "senior", "position": "leader",
      "detail": { "fr": "Chef de délégation", "en": "Team leader" } }
  ]
  ```
  `photo` et `detail` sont facultatifs (sans photo : avatar neutre).
- **Publier un comité** (`organisation.json`, page Organisation) : l'ordre du
  fichier est l'ordre des sections (fonds clair et vert alternés). Tant que
  `members` est vide, la section affiche « Composition à venir ». Sinon, un
  objet par personne, dans l'ordre d'affichage, en nombre libre ; `name: null`
  marque une place prévue mais pas encore nommée (« Membre à confirmer », ou
  « Coordinateur à confirmer » si le comité a `kind: "coordinators"`) :
  ```json
  "members": [
    { "name": "Prénom Nom", "role": { "fr": "Président", "en": "Chair" },
      "org": null, "country": "SN", "photo": "/organisation/prenom-nom.jpg" },
    { "name": null, "role": null, "org": null, "country": null }
  ]
  ```
  `role`, `org` et `photo` sont facultatifs (sans photo : avatar neutre).
- **Publier les résultats** (`resultats.json`, page Résultats) : remplir `junior`
  et `senior` dans l'ordre du classement, puis passer `published` à `true`.
  Rangs et distinctions sont affichés tels quels, jamais recalculés : deux
  ex æquo portent le même rang (1, 2, 2, 4…) ; `award` vaut `"gold"`,
  `"silver"`, `"bronze"` ou `null`. Tant que `published` est `false`, la page
  annonce que les résultats seront publiés après les épreuves.
  ```json
  { "rank": 1, "award": "gold", "name": "Prénom Nom", "countryCode": "SN",
    "scores": [7, 7, 6, 7], "total": 27 }
  ```
  `tests/resultats.test.ts` vérifie totaux, ordre, rangs et drapeaux.
  `apercu/resultats-fictifs.json` est un classement **fictif**, pour
  prévisualiser le tableau : il n'apparaît qu'en développement, sur les
  prévisualisations Vercel ou avec `OFM_APERCU=1`, jamais en production.
- **Ajouter un partenaire** : déposer le logo dans `public/partenaires/`, puis une
  entrée dans `partenaires.json` avec `status: "confirmed"` et
  `logo: { src, width, height }` (dimensions intrinsèques). Format détaillé dans
  `RECAP-LIVRAISON.md`. Pour retirer un partenaire sans supprimer son entrée,
  repasser son `status` à `"pending"`.
  Logos actuels : repris tels quels du dépôt `terangamath/terangamath-website`
  (`src/assets/partners/`, commit `4850108`) ; seul AIMS est réencodé en WebP
  sans perte (pixels identiques, 24 Kio au lieu de 66).
- **Ajouter une actualité** : créer `actualites/fr/<slug>.mdx` + `actualites/en/<slug>.mdx`
  avec le même `slug` et la même `date`.
- **Publier un énoncé** (page Problèmes et solutions, `/problemes` ;
  `/solutions` y redirige) : `problemes/fr/<slug>.mdx` (et
  `problemes/en/<slug>.mdx` pour la traduction, sinon le français s'affiche),
  avec `edition` égale à celle de `event.json`, `number` de 1 à 4 et
  `status: "published"`. `author` est facultatif. Les places sans énoncé
  publié affichent « L'énoncé du problème sera publié ici ».
  ```yaml
  slug: "2027-junior-01"
  edition: 2027
  category: "junior"
  number: 1
  title: "Titre du problème"
  author: "Pays proposant ou nom"
  topics: []
  hasSolution: false
  status: "published"
  ```
  **PDF** : déposer le fichier dans `public/archives/2027/` et le déclarer
  dans `archives.json`. Énoncés complets d'une catégorie (bouton « Énoncés
  Junior PDF ») : `{ "year": 2027, "category": "junior", "type": "sujet",
  "path": "/archives/2027/ofm-2027-junior-sujet.pdf" }`. Corrigé d'un
  problème (bandeau de la carte) : même forme avec `"type": "solutions"` et
  `"problem": 2`, ex. `ofm-2027-junior-p2-solution.pdf`. Sans fichier déclaré
  et déposé : « PDF à venir », ou bouton de corrigé désactivé suivi de
  « Disponible après publication », sans lien. Les corrigés
  par problème n'apparaissent pas dans la page Historique. Les solutions ne
  sont publiées qu'en PDF.
- **Compléter une édition passée** (`editions.json`, page Historique) :
  `hostCode` donne le drapeau (code ISO, fichier dans `public/flags/`) ;
  `competitors` (`{ "junior": 60, "senior": 72 }`) et `participants`
  (codes ISO par catégorie, noms tirés de `nations.json`) restent `null` tant
  qu'ils ne sont pas publiés : la fiche l'annonce, sans chiffre de remplacement.
  Les PDF de l'édition se déclarent dans `archives.json` (`sujet`, `solutions`,
  `resultats`, sans `problem`) ; sans fichier, « Document indisponible ».
  L'onglet ouvert par défaut est la dernière édition dont effectifs et pays
  sont publiés. Sources 2020-2025 : ofm2025.maths-olympiques.fr/a-propos
  (PDF 2020-2024 identiques octet pour octet à ceux du site igm.univ-mlv.fr).
- **KaTeX** : dans les MDX de `problemes/`, `$...$` en ligne et `$$...$$` en bloc
  (le bloc sur ses propres lignes). Images : `![description](/chemin.png)`.
  Le composant `<Callout status="...">` gère l'état `coming_soon`.

## Reco (optionnel mais conseillé)

Valider ces fichiers au build avec des schémas **Zod** dérivés de `types.ts`, pour
détecter tout contenu malformé avant déploiement.
