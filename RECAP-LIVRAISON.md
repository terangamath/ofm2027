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

---

## 1. État des livrables

- ✅ `npm run build` : OK, sans erreur (55 pages générées, dont les 28 fiches
  délégations fr/en).
- ✅ `npx eslint .` : OK, sans avertissement.
- ✅ Parité fr/en : 177 clés de traduction de chaque côté, aucun écart (vérifié
  programmatiquement après suppression des clés devenues inutiles).
- ✅ Liens vérifiés :
  - `https://www.terangamath.org/` répond **HTTP 200** (le certificat/404 constatés
    lors d'une livraison précédente ne sont plus d'actualité).
  - `mailto:contact@terangamath.org` correctement formé sur la page Contact.
  - Aucun lien interne mort : toutes les routes testées via `next start` répondent
    200 (`/`, `/equipes`, les 28 fiches pays, `/historique`, `/programme`,
    `/organisation`, `/contact`, `/mentions-legales`, `/olympiade`), et une fiche
    pays inexistante répond bien 404.
- ✅ Masquages vérifiés en HTML rendu (pas seulement au niveau du code) : aucune
  occurrence visible de « à confirmer », « à venir », « en attente », « bientôt
  disponible » ou de badge provisoire n'a survécu sur les pages modifiées — seules
  des occurrences internes aux données de traduction non déclenchées (payload React
  Server Components) ou à des états `coming_soon` légitimes (résultats, problèmes,
  galerie, prévus par `CLAUDE.md`) subsistent.
- ⚠️ **Non exécuté dans cette session** : audit Lighthouse et test manuel complet
  sur tablette/mobile physique. Aucune classe Tailwind de largeur/alignement n'a été
  retirée par ce lot (seuls des blocs de texte/label ont été masqués ou des cartes
  simplifiées), le risque de rupture de grille est donc faible, mais un contrôle
  visuel réel avant mise en ligne reste recommandé.

---

## 2. Registre exhaustif — valeurs reprises de 2026 (règle générale, étape 2)

| Donnée affichée | Fichier | Source | Note |
|---|---|---|---|
| « 14 pays participants (2026) » | `content/stats.json` | Chiffre réel OFM 2026 | Repère historique, jamais présenté comme un chiffre 2027 |
| « 132 élèves compétiteurs (2025) » | `content/stats.json` | Chiffre réel OFM 2025 | Idem |
| Format de la compétition (6 élèves/délégation/catégorie, 4 problèmes, 4 domaines, 4h30, correction le lendemain, distinctions) | `content/format.json` | Règle générale OFM | `provisional: true` en données ; non confirmé nommément pour 2027 |
| Structure du déroulé (session unique jour 1, correction coordonnée jour 2) | `content/programme.json` | Règle générale OFM | Les **dates** (27-28 mars 2027) sont, elles, confirmées (`event.json`) |
| Règlement OFM version 2025 | `content/documents.json` | Dernière version publiée | Reste affiché comme référence jusqu'à publication de la version 2027 |
| Ligne « OFM 2026 » de l'historique (dates, Djibouti, 14 pays) | `content/editions.json` | Faits publiés par Djibouti | Effectifs/sujets/solutions/résultats non publiés → cellule vide, pas de ligne texte |

---

## 3. Registre exhaustif — blocs masqués faute de donnée (règle générale, étape 3)

Aucun de ces blocs n'affiche de texte de substitution : ils sont simplement absents
du rendu. Chaque ligne indique ce qu'il faudra fournir pour les faire réapparaître.

| Emplacement | Ce qui est masqué | Ce qu'il faut fournir |
|---|---|---|
| `/organisation` — Comité de sélection des problèmes | Liste des membres (bloc entier, y compris le titre « Délégation »/« Membres ») | Composition nominative du comité |
| `/organisation` — Équipe de coordination | Idem | Composition nominative de l'équipe |
| `/organisation`, `/`, `/contact` — partenaires | Deux entrées « partenaire financier » et « partenaire technique » retirées de `content/partenaires.json` (aucun nom, pas de placeholder affichable) | Identité du/des partenaire(s) financier et technique une fois signés |
| `/olympiade` — FAQ | Item « Comment inscrire sa délégation ? » retiré (aucune modalité publiée) | Modalités d'inscription des délégations 2027 |
| `/historique` — ligne OFM 2026 | Cellule « note » vide (effectifs, sujets, solutions, résultats 2026 non publiés par Djibouti) | Publication officielle de ces données par Djibouti (hors contrôle de Terangamath) |
| `/mentions-legales` | Sections « Éditeur du site », « Hébergement », « Directeur de la publication », « Données personnelles » retirées de l'affichage (seules « Propriété intellectuelle » et « Contact » restent) | Raison sociale et adresse de Terangamath, nom de l'hébergeur, nom du directeur de publication, politique de confidentialité rédigée |
| `/equipes/{algerie, belgique, burkina-faso, cameroun, comores, congo, cote-divoire, djibouti, france, maroc, niger, suisse, tunisie}` | Description et liste des membres (blocs entiers) ; le lien « Voir la fiche » n'apparaît pas depuis la grille `/equipes` pour ces 13 délégations (la fiche existe et reste accessible par URL directe, mais n'est pas mise en avant tant qu'elle est vide) | Une présentation courte et/ou la liste des compétiteurs pour chaque délégation, au fur et à mesure de leur communication |
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

- Les **14 délégations** de l'édition 2026 sont désormais toutes présentes dans
  `content/delegations/` (Sénégal, Algérie, Belgique, Burkina Faso, Cameroun,
  Comores, Congo, Côte d'Ivoire, Djibouti, France, Maroc, Niger, Suisse, Tunisie),
  toutes au statut `"confirmed"` (plus aucune ne porte `"pending"`).
- Tri : Sénégal en tête (pays hôte), puis ordre alphabétique — géré automatiquement
  par `lib/content.ts` (`getDelegations`), aucune modification de code nécessaire.
- Le badge de statut par carte (« Confirmée »/« En attente ») a été retiré : sur 14
  cartes il n'apportait plus d'information distincte. Seul le Sénégal porte
  désormais le marqueur « Pays hôte ». Les 13 autres cartes n'affichent que le
  drapeau et le nom du pays.
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
2. Partenaires financier et technique (aucun nom à ce jour).
3. Modalités d'inscription des délégations pour 2027.
4. Coordonnées légales : raison sociale et adresse de Terangamath, hébergeur, nom
   du directeur de publication, politique de confidentialité.
5. Présentation et/ou liste des compétiteurs pour les délégations autres que le
   Sénégal, à mesure de leur communication.
6. Horaire précis des épreuves (heure de début), si Terangamath souhaite le
   publier pour 2027 — non repris de 2026 car jamais publié à l'heure près par
   Djibouti.
7. Domaine de production du site (`lib/site.ts` utilise toujours un placeholder
   `https://ofm2027.org`, non modifié par ce lot de corrections — hors périmètre
   du prompt traité ici).

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
