# RECAP — Livraison OFM 2027

> Document de travail pour Terangamath. Récapitule ce qui a été livré, ce qui reste
> à confirmer, et où retrouver chaque information dans le dépôt.
>
> Mis à jour après le lot de corrections « aucun placeholder visible sur le site
> public » (voir `PROMPT-CORRECTIONS-GLOBALES.md`). **Ce document est désormais le
> seul endroit où l'incertitude sur le contenu 2027 reste visible** : le site public
> n'affiche plus aucun `[À confirmer]`, badge « Information provisoire » ni mention
> « à venir »/« bientôt disponible » pour du contenu manquant — soit l'information
> réelle 2027 est affichée, soit une valeur 2026 documentée est reprise à sa place,
> soit le bloc concerné est simplement masqué.
>
> Dernière mise à jour : lot « corrections de fond » du 22 octobre 2026
> (`PROMPT-CORRECTIONS-FOND.md`, branche `fix/corrections-fond`), détaillé en §0.

---

## 0. Corrections de fond — 22 octobre 2026

### 0.1 Règlement de référence

**Règlement OFM version du 23 mars 2025 confirmé applicable à l'OFM 2027 par
l'association, le 22 octobre 2026. Toutes les règles affichées sur le site en
découlent.** (Le jury de l'OFM 2026 ne l'a pas amendé, art. 1.4.) Fichier :
`public/documents/ofm-reglement-2025.pdf` ; `content/documents.json` le marque
désormais `provisional: false`.

### 0.2 Catégories Junior et Senior

Le site les définissait par le niveau scolaire français (« jusqu'en 3ème »,
« seconde à terminale »), ce que le règlement ne fait pas. Elles sont désormais
définies par l'âge, avec la formulation validée par l'association :

| Catégorie | Condition affichée | Source |
|---|---|---|
| Junior | Nés le 1er janvier 2011 ou après, et scolarisés dans le primaire ou le secondaire | Règlement OFM art. 4.4 (éligible Senior **et** né le 1er janvier de N−16 ou après) |
| Senior | Nés le 1er juillet 2007 ou après, et scolarisés dans le primaire ou le secondaire | Règlement OFM art. 4.4 → clause 2.2 du règlement général de l'IMO (né le 1er juillet de x−20 ou après) |

Les deux articles sont cités, avec lien, sous les catégories (accueil et
`/olympiade`), et repris dans la FAQ « Qui peut participer ». Clause 2.2 de l'IMO
vérifiée sur imo-official.org le 22 octobre 2026 (General Regulations, version
approuvée à l'IMO 2025). Détails de la clause **non affichés** sur le site, à
connaître pour répondre aux professeurs :
- la scolarisation exigée est une scolarisation **à temps plein**, constatée
  **au 1er décembre de l'année précédant l'IMO ou après**, soit le 1er décembre 2026
  pour 2027 ;
- les élèves instruits à domicile sont éligibles s'ils n'ont pas obtenu le diplôme
  de fin d'études secondaires et le préparent au 1er décembre ;
- la clause fixe aussi des conditions de nationalité ou de résidence longue
  (au moins une année scolaire complète déjà effectuée dans le pays).

### 0.3 Autres écarts avec le règlement, corrigés

| Avant | Après | Article |
|---|---|---|
| Médailles « pour environ la moitié des participants » | Au moins 1/12 d'or, au moins 1/4 d'or ou d'argent, au moins la moitié médaillée ; mention honorable (7 points sur un problème, sans médaille) ; certificat numérique pour tous | 5.20 à 5.22 |
| « Coordinateurs internationaux » (format, programme, FAQ) | Coordinateurs nommés par le pays organisateur | 5.16, 5.17 |
| « Comité scientifique international » (description du site, FAQ, `/olympiade`, `/problemes`) | Problèmes proposés par les pays, sélectionnés par un comité nommé par le pays organisateur, approuvés par le jury | 5.1 à 5.5 |
| `/equipes` : « chaque délégation réunit des compétiteurs Junior et Senior » | « Chaque pays peut présenter une délégation Junior et une délégation Senior, de un à six élèves chacune » | 4.2 |
| `/organisation` : le comité de sélection « rédige les solutions officielles » | Il sélectionne les huit problèmes, rédige épreuves et barèmes, soumis au jury | 5.4 à 5.6 |

Conformes, inchangés : 4 problèmes par épreuve, 4 h 30, jusqu'à 6 élèves par
délégation et par catégorie, domaines, langue française, format à distance
(art. 3.3), début à 09:00 heure de Paris soit 08:00 à Dakar le 27 mars 2027.

### 0.4 Délégations 2027

- **15 délégations confirmées affichées** : Sénégal (pays hôte) puis, par ordre
  alphabétique, Algérie, Belgique, Burkina Faso, Cameroun, Comores, Congo,
  Côte d'Ivoire, Djibouti, France, Maroc, **Mauritanie** (nouvelle), Niger,
  Suisse, Tunisie.
- **Luxembourg et Canada : invités, en attente de confirmation.** Ils ont reçu une
  invitation à revenir et doivent être relancés. Ils sont présents dans
  `content/delegations/` avec `status: "invited"`, **jamais rendus** (ni liste, ni
  fiche, ni partition, ni sitemap). Drapeaux prêts (`public/flags/lu.svg`,
  `ca.svg`). Le jour où l'un d'eux confirme : passer `status` à `"confirmed"` et,
  pour le Canada, renseigner `timeZone` (fuseau IANA de la ville d'où la délégation
  compose — le pays en a six ; laissé à `null` faute de le savoir).
- Le nombre de pays de la partition de la simultanéité est calculé depuis les
  données (il était écrit « Quatorze » en dur).
- Historique inchangé : l'édition 2026 compte toujours 14 pays
  (`content/editions.json`, indépendant des délégations 2027).

### 0.5 Mention de Dakar

Le comité d'organisation se réunit à Dakar ; les épreuves se passent à distance.
Image de partage : « Comité à Dakar » au lieu de « Dakar, Sénégal » (régénérée,
fr et en). Titre du site : « … · organisée depuis Dakar ». Libellés « Pays
organisateur » / « Lieu » devenus « Comité d'organisation ». JSON-LD : événement
déjà déclaré en ligne (`OnlineEventAttendanceMode`, `VirtualLocation`), Dakar
n'apparaît que dans l'adresse de l'association.

### 0.6 Pied de page, Galerie et Résultats

Pied de page ramené à 6 liens : Σ OFM 2027 (accueil), Terangamath (vers
`/organisation`), Contact, Historique des éditions, Site officiel de l'OFM,
Mentions légales.

**Galerie et Résultats ont été retirées entièrement** (routes, messages, sitemap,
audit de contraste) : une page vide sans lien entrant mais présente dans le
sitemap n'aide personne. Elles répondent désormais 404.

**Procédure de réactivation** (Résultats après le 28 mars 2027, Galerie quand des
photos existent). Le commit de retrait est `refactor(footer): simplification des
liens` (`973cebb`) ; `<sha>` ci-dessous désigne ce commit.
1. Restaurer la page : `git checkout <sha>^ -- "app/[locale]/resultats/page.tsx"`
   (ou `galerie`).
2. Restaurer les messages depuis `git show <sha>^:messages/fr.json` (et `en.json`) :
   la clé `Nav.results` (ou `Nav.gallery`) et le bloc `Pages.Results` (ou
   `Pages.Gallery`). Ne pas reprendre la phrase « correction par le jury
   international », inexacte (art. 5.16-5.19).
3. Remplacer le `ComingSoonPanel` par le vrai contenu : la page ne revient qu'avec
   des données.
4. Ajouter la route à `STATIC_ROUTES` dans `app/sitemap.ts` et à `ROUTES` dans
   `scripts/audit-contraste.mjs`.
5. Résultats : l'ajouter au menu principal (`PRIMARY_NAV` dans
   `components/layout/header.tsx` et l'union `href` de `NavItem` dans
   `components/layout/header-nav.tsx`).
6. Vérifier : `npm test`, `npm run lint`, `npm run test:seo`.

### 0.7 Partenaires — format attendu des logos

La section partenaires de l'accueil est alimentée par **`content/partenaires.json`**.
Elle n'affiche que les partenaires `"confirmed"` **pourvus d'un logo** ; sans aucun,
la section n'existe pas (c'est le cas aujourd'hui). Aucun nom ni logo n'a été
ajouté : CaCi, Animath, Force N et Campus France ont été cités en conversation,
pas validés.

Logos à fournir par l'association :
- **SVG de préférence** ; à défaut **PNG à fond transparent**, d'au moins 192 px de
  haut (affichage net sur écrans haute densité) ;
- recadrés au plus près, sans marge blanche autour du logo ;
- lisibles sur le fond sable clair du site (`#F5F0E8`) ;
- affichés à **hauteur normalisée de 48 px**, la largeur suivant les proportions
  du fichier ;
- déposés dans `public/partenaires/`, nommés d'après l'identifiant
  (`public/partenaires/campus-france.svg`).

Entrée correspondante dans `content/partenaires.json` :

```json
{
  "id": "campus-france",
  "name": { "fr": "Campus France", "en": "Campus France" },
  "category": "institutionnel",
  "status": "confirmed",
  "logo": { "src": "/partenaires/campus-france.svg", "width": 240, "height": 80 },
  "url": "https://www.campusfrance.org/"
}
```

`width`/`height` : dimensions intrinsèques du fichier (le `viewBox` d'un SVG, les
pixels d'un PNG) — elles donnent le rapport d'aspect. `category` est facultative
(`"institutionnel"`, `"financier"`, `"technique"` ou `null`) : les intitulés de
catégorie ne s'affichent que si plusieurs catégories sont présentes. `url` peut
être `null`.

Le fichier contient encore le ministère de l'Éducation nationale du Sénégal et
l'UCAD au statut `"pending"`, sans logo : ils ne sont **plus affichés** (ils
l'étaient avec la mention « En cours de confirmation »). Terangamath, organisateur
et non partenaire, en est sorti : son site est porté par `content/event.json`
(`organizerUrl`).

### 0.8 Vérifications

- ✅ `npm run lint`, `npx tsc --noEmit` : sans erreur.
- ✅ `npm test` : 90 tests, dont un nouveau test de parité fr/en des clés (175 de
  chaque côté) et un garde-fou contre l'apostrophe droite devant une balise ICU.
- ✅ `npm run test:seo` : 207 tests sur deux builds (préprod et production),
  hreflang, sitemap, JSON-LD, Open Graph.
- ✅ HTML rendu : aucune occurrence de « à confirmer », « en attente », « en cours
  de confirmation », « collège », « lycée », « 3ème », « internationaux » ;
  Luxembourg et Canada n'apparaissent que dans `/historique` (nations ayant déjà
  participé, inchangé).
- ⚠️ **Lighthouse mobile, performance sous 95** : accueil 85-91, `/olympiade` 93,
  `/equipes` 93 (accessibilité, bonnes pratiques, SEO : 100 ; desktop : 100
  partout). **Pas une régression** : `main` mesuré dans les mêmes conditions donne
  84-86, 92-95 et 91-93. En cause, le LCP (3 à 4 s sous throttling simulé, mesuré
  en local). À mesurer sur le déploiement réel (PageSpeed Insights) avant tout
  chantier dédié.
- Hors périmètre, pour le document « forme » : en mode sombre, sur une page courte
  et un écran haut, une bande vert-nuit apparaît entre le contenu (fond sable) et
  le pied de page (`main` étiré sur le fond de page).

### 0.9 Commits du lot (branche `fix/corrections-fond`)

```
e4ee5f0 feat(equipes): quinze delegations confirmees, ajout de la mauritanie
f7a165d fix(seo): mention de dakar precisee, comite distingue des epreuves
48a8c6b fix(content): categories junior et senior conformes au reglement
973cebb refactor(footer): simplification des liens
f410840 fix(i18n): balises de la reference reglementaire rendues en francais
302e265 feat(partenaires): structure de la section, masquee sans donnees
```

(Un dernier commit ajoute la mise à jour de ce document.)

---

## 1. État des livrables

- ✅ `npm run build` : OK, sans erreur (56 pages générées, dont les 30 fiches
  délégations fr/en).
- ✅ `npx eslint .` : OK, sans avertissement.
- ✅ Parité fr/en : 175 clés de traduction de chaque côté, aucun écart (vérifié
  par `tests/messages.test.ts`).
- ✅ Liens vérifiés :
  - `https://www.terangamath.org/` répond **HTTP 200** (le certificat/404 constatés
    lors d'une livraison précédente ne sont plus d'actualité).
  - `mailto:contact@terangamath.org` correctement formé sur la page Contact.
  - Aucun lien interne mort : toutes les routes testées via `next start` répondent
    200 (`/`, `/equipes`, les 30 fiches pays, `/historique`, `/programme`,
    `/organisation`, `/contact`, `/mentions-legales`, `/olympiade`), et une fiche
    pays inexistante répond bien 404.
- ✅ Masquages vérifiés en HTML rendu (pas seulement au niveau du code) : aucune
  occurrence visible de « à confirmer », « à venir », « en attente », « bientôt
  disponible » ou de badge provisoire n'a survécu sur les pages modifiées — seules
  des occurrences internes aux données de traduction non déclenchées (payload React
  Server Components) ou à l'état `coming_soon` légitime des problèmes subsistent
  (Galerie et Résultats ont été retirées, voir §0.6).
- ⚠️ Audit Lighthouse : voir §0.8. **Non exécuté** : test manuel complet sur
  tablette/mobile physique. Aucune classe Tailwind de largeur/alignement n'a été
  retirée par ce lot (seuls des blocs de texte/label ont été masqués ou des cartes
  simplifiées), le risque de rupture de grille est donc faible, mais un contrôle
  visuel réel avant mise en ligne reste recommandé.

---

## 2. Registre exhaustif — valeurs reprises de 2026 (règle générale, étape 2)

| Donnée affichée | Fichier | Source | Note |
|---|---|---|---|
| « 14 pays participants (2026) » | `content/stats.json` | Chiffre réel OFM 2026 | Repère historique, jamais présenté comme un chiffre 2027 |
| « 132 élèves compétiteurs (2025) » | `content/stats.json` | Chiffre réel OFM 2025 | Idem |
| Format de la compétition (6 élèves/délégation/catégorie, 4 problèmes, 4 domaines, 4h30, coordination le lendemain, distinctions) | `content/format.json` | Règlement OFM 2025, confirmé applicable à 2027 (§0.1) | `provisional: true` en données : le règlement fixe la règle, Terangamath n'a pas confirmé nommément chaque modalité pour 2027 |
| Structure du déroulé (session unique jour 1, correction coordonnée jour 2) | `content/programme.json` | Règle générale OFM | Les **dates** (27-28 mars 2027) sont, elles, confirmées (`event.json`) |
| Règlement OFM version du 23 mars 2025 | `content/documents.json` | Confirmé applicable à 2027 par l'association le 22 octobre 2026 | `provisional: false` (§0.1) |
| Ligne « OFM 2026 » de l'historique (dates, Djibouti, 14 pays) | `content/editions.json` | Faits publiés par Djibouti | Effectifs/sujets/solutions/résultats non publiés → cellule vide, pas de ligne texte |

---

## 3. Registre exhaustif — blocs masqués faute de donnée (règle générale, étape 3)

Aucun de ces blocs n'affiche de texte de substitution : ils sont simplement absents
du rendu. Chaque ligne indique ce qu'il faudra fournir pour les faire réapparaître.

| Emplacement | Ce qui est masqué | Ce qu'il faut fournir |
|---|---|---|
| `/organisation` — Comité de sélection des problèmes | Liste des membres (bloc entier, y compris le titre « Délégation »/« Membres ») | Composition nominative du comité |
| `/organisation` — Équipe de coordination | Idem | Composition nominative de l'équipe |
| `/` — section partenaires | Section entière : aucun partenaire confirmé avec logo (ministère et UCAD `pending`, non affichés) | Liste confirmée et logos au format du §0.7 |
| `/galerie`, `/resultats` | Pages retirées (routes, sitemap) | Contenu réel ; procédure de réactivation au §0.6 |
| `/olympiade` — FAQ | Item « Comment inscrire sa délégation ? » retiré (aucune modalité publiée) | Modalités d'inscription des délégations 2027 |
| `/historique` — ligne OFM 2026 | Cellule « note » vide (effectifs, sujets, solutions, résultats 2026 non publiés par Djibouti) | Publication officielle de ces données par Djibouti (hors contrôle de Terangamath) |
| `/mentions-legales` | Sections « Éditeur du site », « Hébergement », « Directeur de la publication », « Données personnelles » retirées de l'affichage (seules « Propriété intellectuelle » et « Contact » restent) | Raison sociale et adresse de Terangamath, nom de l'hébergeur, nom du directeur de publication, politique de confidentialité rédigée |
| `/equipes/{algerie, belgique, burkina-faso, cameroun, comores, congo, cote-divoire, djibouti, france, maroc, mauritanie, niger, suisse, tunisie}` | Description et liste des membres (blocs entiers) ; le lien « Voir la fiche » n'apparaît pas depuis la grille `/equipes` pour ces 14 délégations (la fiche existe et reste accessible par URL directe, mais n'est pas mise en avant tant qu'elle est vide) | Une présentation courte et/ou la liste des compétiteurs pour chaque délégation, au fur et à mesure de leur communication |
| `/programme` | Horaire précis (heure de début) de chaque épreuve masqué ; seuls le jour et la durée (4h30) restent affichés — l'édition 2026 n'a jamais publié d'horaire à l'heure près | Horaire précis si Terangamath souhaite le publier pour 2027 |

---

## 4. Corrections de coordonnées et de liens appliquées

| Élément | Avant | Après |
|---|---|---|
| URL Terangamath (partout : footer→partenaires, `/contact`, `/organisation`, JSON-LD) | `https://terangamath.org` (répondait en erreur lors d'un contrôle précédent) | `https://www.terangamath.org/` — **vérifié HTTP 200** |
| Email de contact | « Adresse à confirmer » | `contact@terangamath.org`, affiché en lien `mailto:` |
| Contact téléphonique / contact djiboutien | Absent du code (rien à corriger) | Toujours absent — aucun numéro ni contact djiboutien n'a jamais été présent sur ce site |
| Formulaire de contact | Absent du code (rien à corriger) | Toujours absent — l'email reste l'unique canal |

---

## 5. Section Équipes — traitement des statuts

- **15 délégations** affichées depuis le 22 octobre 2026 (§0.4) : les 14 de
  l'édition 2026 plus la Mauritanie, toutes au statut `"confirmed"`. Luxembourg et
  Canada, invités sans réponse, sont au statut `"invited"` et ne sont pas rendus.
- Tri : Sénégal en tête (pays hôte), puis ordre alphabétique — géré automatiquement
  par `lib/content.ts` (`getDelegations`), aucune modification de code nécessaire.
- Le badge de statut par carte (« Confirmée »/« En attente ») a été retiré : il
  n'apportait plus d'information distincte. Seul le Sénégal porte le marqueur
  « Pays hôte ». Les 14 autres n'affichent que le drapeau et le nom du pays.
- Les textes d'introduction (page `/equipes` et section d'accueil « Délégations »)
  ont été reformulés : ils décrivent des délégations **engagées**, plus un
  processus de confirmation en cours.

---

## 6. Section Historique

- **Ligne OFM 2027 supprimée** du tableau : 2027 est l'édition en cours (présentée
  dans le hero et les pages dédiées), pas une archive. Le tableau s'arrête donc à
  2026.
- Le libellé d'introduction (« éditions passées et à venir ») a été corrigé en
  « éditions passées », cohérent avec la suppression de la ligne 2027.
- Ligne OFM 2026 : dates, organisateur (Djibouti) et 14 pays participants
  conservés ; la note qui affichait « Effectifs non publiés à ce jour » a été
  retirée (cellule vide plutôt qu'un message d'indisponibilité).
- Éditions 2020–2025 : inchangées.

---

## 7. À faire confirmer par écrit par Terangamath

1. Composition nominative des deux comités (sélection des problèmes, coordination).
2. Liste des partenaires confirmés et leurs logos, au format du §0.7.
3. Modalités d'inscription des délégations pour 2027.
4. Coordonnées légales : raison sociale et adresse de Terangamath, hébergeur, nom
   du directeur de publication, politique de confidentialité.
5. Présentation et/ou liste des compétiteurs pour les délégations autres que le
   Sénégal, à mesure de leur communication.
6. Horaire précis des épreuves (heure de début), si Terangamath souhaite le
   publier pour 2027 — non repris de 2026 car jamais publié à l'heure près par
   Djibouti.
7. Luxembourg et Canada : réponse à la relance (invités, non affichés, §0.4) ;
   pour le Canada, la ville d'où la délégation compose (fuseau horaire).
8. Activer **Speed Insights** dans le tableau de bord Vercel (projet → onglet Speed
   Insights → Enable). Le composant est en place dans `app/[locale]/layout.tsx` ;
   il ne mesure rien tant que ce n'est pas fait. Objectif : des données de visiteurs
   réels (LCP, INP, CLS par pays et par appareil) d'ici mars 2027 — PageSpeed n'en
   a aucune pour ofm2027.org au 22 octobre 2026. Sans cookie ; à mentionner dans la
   politique de confidentialité quand elle sera rédigée.
9. ~~Règlement amendé par le jury de l'OFM 2026 ?~~ — réglé : non, la version du
   23 mars 2025 s'applique à 2027 (§0.1).
10. ~~Domaine de production du site~~ — réglé : `https://www.ofm2027.org`, fourni par
   la variable `NEXT_PUBLIC_SITE_URL` (voir `DEPLOIEMENT.md`).

---

## 8. Commits de cette livraison

```
d34207a fix(links): correction de l'url de l'association terangamath
61e5ac2 feat(contact): coordonnees officielles terangamath
bb2e897 refactor(content): suppression des placeholders visibles, reprise des valeurs 2026
a9bd7d7 refactor(historique): tableau limite aux editions passees, cellules non publiees masquees
4ef1709 fix(equipes): delegations confirmees et marqueur pays hote
```

(Un 6e commit ajoute la mise à jour de ce document.)

---

## 9. Historique — livraison précédente

Pour le détail de la livraison initiale (scaffolding, i18n, contenu importé
d'ofm2026.org, pages supprimées, reformulations « accueil physique » → format
distanciel), voir `git show 299dbb4` et les commits antérieurs à `d34207a`. Cette
mise à jour ne revient sur aucune de ces décisions ; elle traite exclusivement le
lot de corrections décrit dans `PROMPT-CORRECTIONS-GLOBALES.md`.
