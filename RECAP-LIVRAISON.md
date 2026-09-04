# RECAP — Livraison OFM 2027

> Document de travail pour Terangamath. Récapitule ce qui a été livré, ce qui reste
> à confirmer, et où retrouver chaque information dans le dépôt.

---

## 1. État des livrables (§8)

- ✅ `npm run build` : OK, sans erreur.
- ✅ `npx eslint .` : OK, sans avertissement.
- ✅ Aucun lien mort **interne** (toutes les routes vivantes répondent 200, les 2 routes
  supprimées répondent 404 proprement, aucune référence résiduelle dans le code).
- ⚠️ Liens externes : voir §7 ci-dessous — un lien pose problème (`terangamath.org`).
- ✅ Parité fr/en complète : 193 clés de traduction de chaque côté, aucun écart
  (vérifié programmatiquement).
- ✅ Français par défaut vérifié en conditions réelles : une requête avec
  `Accept-Language: en-US,en;q=0.9` sur `/` renvoie bien `<html lang="fr">` ; `/en`
  reste accessible explicitement.
- ⚠️ **Non exécuté dans cette session** : audit Lighthouse (Perf/A11y/Best practices/SEO)
  et vérification manuelle en navigateur. Le design system existant (contrastes,
  focus visibles, `prefers-reduced-motion`, cibles tactiles) n'a pas été modifié dans
  sa logique, seuls du contenu et des sections ont été ajoutés/retirés en réutilisant
  les composants et tokens existants — mais un passage Lighthouse réel avant mise en
  ligne reste recommandé.

---

## 2. Registre exhaustif des informations à confirmer

Toutes les entrées ci-dessous sont soit marquées `"provisional": true` dans un fichier
JSON, soit portent un placeholder `[À confirmer]` explicite. Aucune n'est présentée
comme définitive dans l'interface (badge « Information provisoire » sur les blocs
concernés, italique/pastille pour les statuts `pending`).

### Catégorie C — noms et contacts (interdits de reprise, jamais renseignés)

| Fichier | Ligne | Nature |
|---|---|---|
| `content/organisation.json` | 12 | Nom du/des membres du comité de sélection des problèmes |
| `content/organisation.json` | 29 | Nom du/des membres de l'équipe de coordination |
| `messages/fr.json` / `en.json` | `Pages.Legal.Publisher.body` | Raison sociale et adresse de Terangamath |
| `messages/fr.json` / `en.json` | `Pages.Legal.Host.body` | Nom de l'hébergeur du site |
| `messages/fr.json` / `en.json` | `Pages.Legal.Director.body` | Nom du directeur de publication |
| `messages/fr.json` / `en.json` | `Pages.Contact.emailValue` | Adresse email de contact officielle |

### Catégorie B — structure/format réutilisé de l'OFM, non confirmé pour 2027

| Fichier | Ligne | Nature |
|---|---|---|
| `content/format.json` | 1 (racine) | Composition des délégations, nb de problèmes, domaines, durée, correction, distinctions — repris de la règle générale OFM |
| `content/programme.json` | 3 (racine) | Structure du déroulé (session unique + correction) — dates elles-mêmes confirmées (§3) |
| `content/organisation.json` | 9, 26, 43 | Existence et rôle des 3 comités (sélection, coordination, remerciements) |
| `content/documents.json` | 10 | Règlement OFM référencé = version 2025, en attente de la version 2027 |
| `content/faq.json` | 22 (item « Quel est le format ? ») | Détails du format dans la réponse FAQ |

### Autres informations en attente (non bloquantes, déjà traitées comme `pending`/`coming_soon`)

| Fichier | Nature |
|---|---|
| `content/partenaires.json` (4 entrées `status: pending`) | Ministère de l'Éducation, UCAD, partenaire financier, partenaire technique — aucun logo, aucun engagement présenté comme acquis |
| `content/delegations/cote-divoire.json` (`status: pending`) | Participation de la Côte d'Ivoire à confirmer |
| `content/stats.json` (2 entrées `provisional: true`) | « 14 pays (2026) » et « 132 élèves (2025) » sont des chiffres **historiques réels**, utilisés comme repères en l'absence de chiffres 2027 — jamais présentés comme des chiffres 2027 |
| `content/faq.json` (item « Comment inscrire sa délégation ? ») | Modalités d'inscription 2027 |
| `messages/*.json` `Pages.Legal.Privacy.body` | Politique de confidentialité à rédiger et publier |

---

## 3. À faire confirmer par écrit par Terangamath

1. **Dates de l'édition 2027 : samedi 27 et dimanche 28 mars 2027.**
   Déduites de la règle « dernier week-end de mars » (vérification calendaire : le
   1er mars 2027 est un lundi, les samedis de mars 2027 sont les 6, 13, 20 et 27).
   Déjà intégrées partout (hero, fiche événement, compte à rebours, JSON-LD,
   sitemap) et marquées `datesConfirmed: true` dans `content/event.json` conformément
   à la décision de l'association (§2.2 du prompt) — mais elles restent une
   **déduction**, pas un communiqué officiel. Terangamath doit les valider par écrit.
2. Le format détaillé de la compétition (§2 ci-dessus, catégorie B).
3. La composition nominative des comités.
4. Les coordonnées légales et de contact (§2 ci-dessus, catégorie C).
5. Les partenaires et délégations encore `pending`.

---

## 4. Pages et sections supprimées (§4)

| Élément supprimé | Fichiers retirés | Comment réactiver |
|---|---|---|
| Section « 06 — Déroulé » (accueil) | `components/home/programme-teaser.tsx` | Recréer le composant (supprimé, récupérable via `git log` / commit `299dbb4^`) et le réimporter dans `app/[locale]/page.tsx` + restaurer les clés `Home.Programme` dans les messages |
| Page + section « Actualités » | `app/[locale]/actualites/**`, `components/home/news.tsx`, `content/actualites/**`, `lib/content.ts` (`getNews*`), `content/types.ts` (`NewsFrontmatter`) | Tout est récupérable via `git log` (commit `299dbb4^`) ; réintégrer les routes, le composant, les fonctions et les clés `Nav.news`, `Home.News`, `Pages.News*` |
| Page « Infos pratiques » | `app/[locale]/informations/page.tsx` | Récupérable via `git log` (commit `299dbb4^`) ; réintégrer la route, l'entrée de nav (`Nav.practicalInfo`) et les clés `Pages.PracticalInfo.*`. **Note** : son contenu (visa, hébergement, transport) est structurellement incompatible avec le format 100 % distanciel — à réévaluer entièrement plutôt qu'à restaurer telle quelle si le format venait à changer. |

**Résultats, Problèmes & solutions, Galerie : conservées, pas supprimées.** Décision
argumentée en Phase 1 (voir `git show 299dbb4` pour le contexte) : CLAUDE.md fixe ces
trois routes dans l'arborescence du site et exige un état `coming_soon` soigné, déjà en
place (`ComingSoonPanel`). Le problème de démonstration factice
(`content/problemes/fr/2027-senior-01.mdx`, marqué « MODÈLE DE DÉMONSTRATION ») a été
retiré ; la page `/problemes` bascule automatiquement sur l'état vide dès qu'aucun
fichier MDX réel n'est présent, et listera les vrais problèmes dès qu'un éditeur en
déposera un dans `content/problemes/{locale}/`.

---

## 5. Reformulations « accueil physique » → format distanciel (§2.4)

| Emplacement | Avant | Après |
|---|---|---|
| `Metadata.description` (fr/en) | « réunit à Dakar les meilleurs jeunes mathématiciens » | « rassemble, à distance, les meilleurs jeunes mathématiciens (…) Organisée par Terangamath (Dakar, Sénégal) » |
| `Home.Hero.lead` | « Dakar accueille en 2027 les meilleurs jeunes mathématiciens (…) » | « Le Sénégal accueille l'organisation de l'édition 2027 (…), disputée à distance » |
| `Home.Hero.metaLocation` | Libellé « Lieu » | Libellé « Pays organisateur » |
| `Home.Event.lead` | « organisée par Terangamath, au cœur de Dakar » | « organisée par Terangamath, disputée entièrement à distance » |
| `Home.Event` / `components/home/event-info.tsx` | Ligne « Lieu → Dakar, Sénégal » séparée | Fusionnée dans la ligne « Organisateur → Terangamath — Dakar, Sénégal » |
| `Home.Countdown.title` | « Rendez-vous à Dakar » | « Compte à rebours — édition 2027 » |
| `content/organisation.json` (comité d'organisation) | « il coordonne la logistique, l'accueil des délégations (…) » | Bloc entièrement restructuré selon les 3 comités réels de l'OFM (§3.4 du prompt), aucune mention de logistique physique |
| `Pages.Olympiad.Presentation.body2` | « organisée **à** Dakar par Terangamath » | « portée **depuis** Dakar par Terangamath » |
| `content/programme.json` | Jour 1 « Arrivées & ouverture », « Accueil des délégations » | Reconstruit : Jour 1 = épreuves à distance (27 mars), Jour 2 = correction coordonnée (28 mars) |
| `Pages.Programme.lead` | « Des arrivées à la cérémonie de clôture (…) » | « Le déroulé des deux journées : épreuves à distance, puis correction coordonnée » |
| `content/faq.json` (format) | « Deux jours d'épreuves (…) » | « Une compétition à distance : session unique de 4h30 (…) » |
| Page `/informations` entière | Lieu, aéroport, visa, hébergement | **Supprimée** (§4) |

**Conservé tel quel** (légitime au niveau symbolique) : `Footer.tagline` (« La
géométrie de l'hospitalité — Dakar, 2027 »), les mentions de « la Teranga » comme
valeur, et le motif constellation.

---

## 6. Fichiers importés d'ofm2026.org

| Source | Destination | Note |
|---|---|---|
| `ofm2026.org/historique` (tableau éditions + effectifs + pays) | `content/editions.json`, `content/nations.json` | Recoupé et conforme aux données déjà fournies dans le prompt |
| `ofm2026.org/à-propos` (format : catégories, taille délégation, durée, correction, distinctions) | `content/format.json` | Catégorie B, `provisional: true` |
| `ofm2026.org/organisation` (structure des 3 comités — **sans aucun nom 2026**) | `content/organisation.json` | Noms 2026 identifiés et exclus (voir liste ci-dessous), structure seule reprise |
| 34 PDF (`/assets/sujets/{2020..2025}/...`) | `public/archives/{année}/ofm-{année}-{junior\|senior}-{sujet\|solutions\|resultats}.pdf` | Renommés sans accents, indexés dans `content/archives.json`, référencés depuis `/historique` |
| Règlement (`/assets/pdf/reglement-OFM-version-2025.pdf`) | `public/documents/ofm-reglement-2025.pdf` | Référencé depuis `content/documents.json` et affiché sur `/olympiade` |

**Noms identifiés sur ofm2026.org et explicitement exclus** (catégorie C) : Mohamed Ali
Beyle, Mohamed Abdo Ali (contacts ADAM-Maths / MENFOP Djibouti), Arnaud Maret, Coumba
Sarr, Mariam Elkaf, Mohamed Omar, Paul Boureau, Pierre Alain Jacqmin, Abdoulahy
Coundou, Ali Akir, Harbi Hassan, Mahamoud Omar, Mahmoud Essamet, Marco Cavaleri,
Moustapha Houssein, Noura Lidersa, Said Guirre Atteyeh, Tanish Patil, Valentin Imbach,
Mohamed Barreh Sougal. Aucun de ces noms, ni ADAM-Maths, ni MENFOP Djibouti, ni les
dates du 28-29 mars 2026, n'apparaissent dans le site livré.

---

## 7. Échecs et anomalies constatées

### Téléchargements PDF
**Aucun échec.** Les 35 documents (34 archives + règlement) ont été téléchargés,
vérifiés (HTTP 200, type PDF réel, taille non nulle) et sont servis correctement par
le site. Comme prévu par le prompt, les résultats 2025 et 2026 n'existent pas encore
sur ofm2026.org (`/assets/sujets/2025/OFM-*-Résultats.pdf` renvoie une redirection 302
vers l'accueil, pas un PDF) : aucun lien n'a donc été créé pour ces deux cas, ce n'est
pas un échec mais un état confirmé.

### Lien externe cassé — hors périmètre de contenu, à signaler
`https://terangamath.org` (référencé dans `content/partenaires.json`, utilisé sur les
pages Organisation et Contact) répond avec le certificat TLS par défaut de Traefik
(non valide, `CN = TRAEFIK DEFAULT CERT`) et un `404` une fois la vérification
TLS contournée. **Le domaine de l'association elle-même semble mal configuré ou en
cours de déploiement côté hébergeur.** Ce lien préexistait dans le scaffold (avant
cette mission) et n'a pas été modifié : il s'agit du domaine officiel de
l'association, donc il n'a pas été retiré, mais Terangamath doit vérifier la
configuration de son serveur/reverse-proxy avant la mise en ligne.

### Domaine du site lui-même
`lib/site.ts` utilise un domaine placeholder (`https://ofm2027.org`, non confirmé) pour
`metadataBase`, le sitemap et les JSON-LD, faute de domaine de production communiqué.
**À définir via la variable d'environnement `NEXT_PUBLIC_SITE_URL`** avant déploiement
(sans quoi les URLs canoniques, OG et sitemap resteront sur ce placeholder).

---

## 8. Commits de cette livraison

```
299dbb4 refactor(routes): suppression des sections deroule, actualites et infos pratiques
aef8e88 feat(i18n): francais comme langue par defaut du site
e0d9857 feat(content): integration du format de competition et de l'historique OFM
69590f9 feat(ui): badge de contenu provisoire et etats vides
```

(Un 6e commit ajoute ce document.)
