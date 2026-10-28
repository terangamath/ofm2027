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
- **KaTeX** : dans les MDX de `problemes/`, `$...$` en ligne et `$$...$$` en bloc.
  Le composant `<Callout status="...">` gère l'état `coming_soon`.

## Reco (optionnel mais conseillé)

Valider ces fichiers au build avec des schémas **Zod** dérivés de `types.ts`, pour
détecter tout contenu malformé avant déploiement.
