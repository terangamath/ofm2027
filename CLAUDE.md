# CLAUDE.md — OFM 2027 · Olympiade Francophone de Mathématiques · Sénégal

> Fichier de contexte projet pour Claude Code. À placer à la racine du **nouveau** dépôt.
> Objectif : un site **mémorable, esthétiquement exceptionnel et de haut niveau**, digne d'une olympiade internationale.

---

## 1. Contexte projet

Site officiel de l'**OFM 2027**, l'Olympiade Francophone de Mathématiques organisée à **Dakar (Sénégal)** par l'association **Terangamath**. Elle réunit les meilleurs jeunes mathématiciens du monde francophone (catégories **Junior** collège et **Senior** lycée), autour d'épreuves conçues par un comité scientifique international.

Public : élèves et délégations nationales, encadrants, partenaires institutionnels, presse, curieux. Le site doit inspirer **prestige, rigueur et hospitalité**.

**Langue par défaut : français**, avec version **anglaise**. Événement en préparation → beaucoup de contenu est encore provisoire (voir §10).

---

## 2. Direction artistique (FIXÉE — ne pas rediscuter, exécuter)

### Concept : « Géométrie de l'hospitalité »
Le site parle deux langues à la fois :
- **La rigueur mathématique** — géométrie, réseaux, grilles, courbes, formules, précision d'alignement. La mise en page elle-même doit *donner à voir* de la structure.
- **La Teranga sénégalaise** — chaleur, lumière, hospitalité, richesse chromatique. Sans jamais tomber dans le cliché du « motif ethnique » plaqué : la culture s'exprime par la **couleur, la lumière et la générosité des espaces**, pas par des ornements folkloriques.

**Registre visuel** : éditorial et prestigieux (pensé comme une revue scientifique de haut de gamme croisée avec l'affiche d'un grand événement), pas « site institutionnel générique ». Beaucoup d'air, une typographie forte, un motif signature vivant, une finition obsessionnelle.

### Motif signature : la constellation des nations
Un **réseau de points reliés** (graphe) qui évoque simultanément la théorie des graphes et la constellation des délégations francophones réunies à Dakar. Rendu en SVG/canvas léger, animation lente et discrète (dérive douce des nœuds, liens qui se dessinent), **toujours** conditionnée à `prefers-reduced-motion`. Palette or sur fond vert profond dans le hero.
En texture secondaire : une **grille isométrique / triangulée très fine** façon « papier millimétré élégant », en filets or à très faible opacité, pour habiller certaines sections sans les charger.

### Signes récurrents (à réutiliser partout pour la cohérence)
- Le sigle **Σ** comme marque.
- Des **eyebrows en mono** numérotant les sections comme une démonstration : `01 — L'Olympiade`, `02 — Équipes`…
- Des **filets or (hairlines)** comme séparateurs.
- De **grands chiffres en display** (chiffres tabulaires) pour les statistiques et le compte à rebours.

---

## 3. Stack technique
- **Next.js 14+** (App Router), **TypeScript strict**, **Tailwind CSS**, **shadcn/ui**
- Contenu : **MDX** + JSON/YAML, **KaTeX** pour les formules, **next-intl** pour l'i18n
- Polices via **next/font** (zéro FOUT), images via **next/image**
- Déploiement **Vercel**
- **Nouveau dépôt** — scaffolding propre, pas de reprise de l'ancien code (voir §14).

---

## 4. Design tokens — Couleurs

Exposer en variables CSS + thème Tailwind. Rôles sémantiques à respecter.

| Token | Hex | Rôle |
|---|---|---|
| `--vert` | `#1B4332` | Primaire, prestige, fonds sombres |
| `--vert-clair` | `#2D6A4F` | Primaire clair, hovers, dégradés |
| `--vert-nuit` | `#0E2018` | Surfaces sombres / dark mode |
| `--or` | `#C9A84C` | Accent principal, filets, motif, focus |
| `--or-clair` | `#E8C97A` | Accent clair, survols, dégradés or |
| `--sable` | `#F5F0E8` | Fond chaud clair |
| `--ivoire` | `#FBF9F4` | Fond « papier » très clair |
| `--anthracite` | `#1C1C1E` | Texte principal |
| `--gris` | `#6B7280` | Texte secondaire, légendes |
| `--terracotta` | `#B24A2E` | Accent chaud **rare** (clin d'œil au drapeau) — usage parcimonieux |
| `--blanc` | `#FFFFFF` | Blanc pur |

- Contraste **WCAG AA minimum** sur toute paire texte/fond (viser AAA sur le corps de texte).
- L'or ne passe pas AA sur fond clair pour du petit texte : le réserver aux accents, filets, gros titres, ou l'assombrir si besoin.
- **Dark mode** recommandé : surfaces `--vert-nuit`, texte `--ivoire`/`--sable`, l'or ressort. Prévoir les tokens dès le départ.

---

## 5. Design tokens — Typographie

Système à **3 familles** (chargées via next/font) :

- **Display — `Fraunces`** (variable) : titres, chiffres héros. Optical size élevée, contraste marqué, tracking légèrement resserré sur les grands titres. *(Remplace volontairement Playfair Display : plus caractériel et contemporain.)*
- **UI / Corps — `Inter`** : navigation, paragraphes, boutons, formulaires.
- **Data / Labels — `JetBrains Mono`** : dates, eyebrows de section, scores, compte à rebours, tags de statut. Uppercase + letter-spacing pour les labels.

Fallbacks système déclarés dans chaque `next/font`.

### Échelle typographique fluide (`clamp`)
- `display-xl` (hero) : `clamp(3rem, 8vw, 7rem)`, line-height ~0.95
- `display-l` (h1 page) : `clamp(2.5rem, 5vw, 4.5rem)`
- `h2` : `clamp(2rem, 3.5vw, 3rem)`
- `h3` : `clamp(1.5rem, 2.5vw, 2rem)`
- `h4` : `1.25rem`
- `body-l` : `1.125rem` (lead)
- `body` : `1rem`, line-height 1.6
- `small` : `0.875rem`
- `label` (mono) : `0.8125rem`, uppercase, letter-spacing `0.08em`

**Chiffres tabulaires** (`font-variant-numeric: tabular-nums`) pour toutes les statistiques, dates et compte à rebours.

---

## 6. Design tokens — Espacement, formes, ombres, motion

- **Espacement** : base 4px (échelle Tailwind). Rythme de section généreux : `py` de 96→128px en desktop, 64px en mobile. L'air fait partie du design.
- **Grille** : 12 colonnes éditoriales, marges larges, **compositions asymétriques bienvenues**. Alignements stricts (rigueur visible).
- **Rayons** : `2px` (fin) · `8px` (cartes) · `16px` (grands blocs) · `full` (pastilles). Rester plutôt net.
- **Ombres** : douces et basses. Ex. `0 1px 2px rgba(0,0,0,.04)`, `0 8px 24px rgba(14,32,24,.08)` (teinte verte discrète). Jamais d'ombre lourde.
- **Motion** : durées 150 / 250 / 400 ms, easing `cubic-bezier(0.2, 0.8, 0.2, 1)`. Reveal au scroll = translation 12–16px + opacité. Micro-interactions sur cartes (élévation légère, filet or qui apparaît). **Tout** est désactivé/atténué sous `prefers-reduced-motion`. Aucun parallaxe gadget.

---

## 7. Composants signatures à créer

- **Header** : navigation claire, sélecteur de langue fr/en, Σ à gauche, fin filet or au scroll.
- **Hero** : motif constellation animé + titre `display-xl` en Fraunces + méta-infos en mono (lieu, dates provisoires, langue, catégories). Pas de hero vide (voir §13).
- **Fiche événement** : bloc élégant récapitulant lieu / dates / organisateur / langue / format.
- **Bloc statistiques** : grands chiffres tabulaires (pays, élèves, catégories, éditions) — placeholders si non confirmés.
- **Deux catégories** : cartes Junior (collège) / Senior (lycée) différenciées, pas deux cartes vides jumelles.
- **Grille des délégations** : pastilles pays + drapeaux, hover riche, **statut `confirmé` / `en attente`** clairement distingué, lien vers page pays.
- **Timeline / Programme** : déroulé des épreuves et temps forts.
- **Cartes actualités** éditoriales (type, date, titre, extrait).
- **Bloc Problèmes & Solutions** : rendu **KaTeX** soigné (aligné à la palette, délimiteurs discrets), état `coming_soon`.
- **Compte à rebours vers 2027** : chiffres mono tabulaires, sobre, jamais kitsch.
- **Partenaires** : institutionnels / financiers / techniques, traités dignement même en attente (pas de logos fantômes flottants — voir §13).
- **FAQ** en accordéon.
- **Footer** : structuré, mesuré (pas surdimensionné).

---

## 8. Arborescence

Pages (routes localisées fr/en) :
- `/` Accueil
- `/olympiade` L'Olympiade (présentation, format, FAQ)
- `/organisation` Organisation (Terangamath, comités)
- `/equipes` Équipes + `/equipes/[pays]` fiches délégations
- `/programme` Programme
- `/informations` Infos pratiques (venue, Dakar, logistique)
- `/problemes` Problèmes & Solutions
- `/resultats` Résultats (état `coming_soon`)
- `/actualites` + `/actualites/[slug]`
- `/historique` Historique des éditions
- `/galerie` Galerie
- `/contact` Contact
- `/mentions-legales`

---

## 9. Internationalisation
- **fr par défaut**, **en** secondaire, via **next-intl**.
- **Aucun texte UI hardcodé** : tout passe par `messages/fr.json` et `messages/en.json`.
- `hreflang` correct, `<html lang>` dynamique, métadonnées (title/description/OG) **par locale**.
- Sitemap et OG images soignées par page.

---

## 10. Contenu & placeholders
- Marqueurs explicites pour tout ce qui n'est pas confirmé : `[Date à confirmer]`, `[Liste des pays à confirmer]`, etc.
- **Toujours** gérer l'état `coming_soon` (problèmes, résultats, partenaires, dates).
- **Ne jamais inventer de faits présentés comme définitifs** (partenaires signés, résultats, chiffres précis). Placeholders réalistes, jamais mensongers.

---

## 11. Accessibilité (WCAG AA — non négociable)
- Contrastes conformes, **focus visibles** partout, navigation clavier complète.
- HTML sémantique, `aria-*` pertinents, landmarks, ordre de tabulation logique.
- `prefers-reduced-motion` respecté pour **toute** animation.
- Cibles tactiles ≥ 44px, textes zoomables sans casse.

---

## 12. Performance
- **next/font** (pas de FOUT), **next/image** partout, dimensions explicites → **zéro layout shift**.
- **Server Components par défaut**, `"use client"` seulement si nécessaire (motif animé, accordéons, sélecteur de langue).
- Motif/animations légers (SVG/CSS ou canvas maîtrisé, `requestAnimationFrame` throttlé, pause hors viewport).
- Cible **Lighthouse ≥ 95** (Perf / A11y / Best practices / SEO) sur mobile et desktop.

---

## 13. Règles strictes de design (interdits)
- ❌ Pas de **hero vide** ou sous-exploité.
- ❌ Pas de section réduite à **2 énormes cartes quasi vides**.
- ❌ Pas de **grille monotone** répétée à l'identique partout — varier les rythmes de section.
- ❌ Pas de **footer surdimensionné**.
- ❌ Pas de **partenaires en placeholders flottants** sans traitement graphique digne.
- ❌ Pas de **scroll inutile** pour afficher peu d'information (densité maîtrisée, chaque écran mérite d'exister).
- ❌ Jamais de `any` TypeScript.

---

## 14. Nouveau dépôt & référence de l'ancien
- **On repart de zéro** dans ce dépôt. Scaffolder proprement le projet (Next.js App Router + TS strict + Tailwind + shadcn/ui + next-intl + KaTeX).
- L'ancien travail est disponible **en lecture seule** ici : `[CHEMIN_VERS_ANCIEN_REPO]`.
  → Sert **uniquement de référence** pour l'architecture d'information et la comparaison. **Ne pas copier** son code ni son style : l'objectif est de faire nettement mieux.

---

## 15. Conventions de code
- TypeScript **strict**, pas de `any`, types explicites pour les données (délégations, actualités, problèmes…).
- Mobile-first.
- Composants **Server** par défaut.
- Design tokens centralisés (variables CSS + thème Tailwind), **aucune** valeur hex en dur dans les composants.
- Nommage clair, composants réutilisables, contenu séparé de la présentation (MDX/JSON).

---

## 16. Workflow Git
- **Un commit par incrément cohérent**, messages **en français**, clairs et scopés.
- Checkpoints réguliers pour pouvoir revenir en arrière sans risque.
