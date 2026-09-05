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

### Motif signature : la figure construite
Le site n'a plus de réseau de points aléatoires. Sa seule géométrie est **la figure du problème 3 (Senior) de l'OFM 2024**, publié sur ce site, qui **se construit à la règle et au compas** à l'ouverture de l'accueil, dans l'ordre de l'énoncé (cercle circonscrit, triangle, hauteur, second cercle, conclusion). SVG inline, chorégraphie CSS de 1,8 s, texte lisible dès 0 ms, une fois par session, état final direct sous `prefers-reduced-motion`. Après la séquence, la figure est **immobile**. Ce langage de construction (arcs, traits pointillés) n'apparaît nulle part ailleurs. Composant : `components/motifs/figure-construction.tsx`.
Aucune texture secondaire : la grille isométrique a été retirée (voir « Chrome interdit »).

### Signes récurrents (à réutiliser partout pour la cohérence)
- Le sigle **Σ** comme marque.
- Des **filets or (hairlines)** comme séparateurs.
- De **grands chiffres en display** (chiffres tabulaires) pour les statistiques et le compte à rebours.

### Chrome interdit (décision de la montée en gamme — voir `RAPPORT-DESIGN.md`)
Ces traits ont été retirés parce que leur accumulation signe un site généré. **Ne pas les réintroduire.**
- ❌ **Eyebrow** au-dessus des titres (« 01 — L'Olympiade », « ÉQUIPES »…) : le titre porte seul la hiérarchie. Les `SectionHeading` et `PageHero` n'ont plus de prop `eyebrow`.
- ❌ **Capitales espacées** sur les libellés : aucun `uppercase`, aucun `letter-spacing` sur du texte d'interface.
- ❌ **Flèche `→`** dans le texte des liens. Un lien texte utilise la classe `.link-text` (filet or qui s'épaissit au survol).
- ❌ **Mono comme chrome** : JetBrains Mono (`.data`) est réservé à ce qui se trie ou se calcule — dates, heures, durées, effectifs, numéros. Les libellés d'interface sont en Inter (`.label`).
- ❌ **Grille isométrique** en fond de section : supprimée. La seule géométrie du site est la figure construite du hero.
- ❌ **Drapeaux emoji** : ils ne rendent pas sous Windows. Utiliser `components/shared/flag.tsx` (SVG dans `public/flags/`, issus de flag-icons, MIT).
- ❌ **Survol qui soulève** (`hover:-translate-y`, ombre élevée) et `transition-colors` uniforme sur tous les éléments interactifs.
- ❌ **Bande sombre** en tête des pages internes : le fond `vert-nuit` est réservé à l'accueil (hero et geste signature). Les pages internes ouvrent sur sable.

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
- Tons dérivés pour tenir AA sur sable (`--gris` y échoue à 4,26:1) : `--encre` `#4B5563` pour le texte secondaire (6,7:1), `--or-encre` `#6F5314` pour les liens (6,3:1). `--link` pointe sur `--or-encre`.
- **Dark mode** recommandé : surfaces `--vert-nuit`, texte `--ivoire`/`--sable`, l'or ressort. Prévoir les tokens dès le départ.

---

## 5. Design tokens — Typographie

Système à **3 familles** (chargées via next/font) :

- **Display — `Fraunces`** (variable) : titres, chiffres héros. Optical size élevée, contraste marqué, tracking légèrement resserré sur les grands titres. *(Remplace volontairement Playfair Display : plus caractériel et contemporain.)*
- **UI / Corps — `Inter`** : navigation, paragraphes, boutons, formulaires.
- **Data — `JetBrains Mono`** : uniquement de la donnée — dates, horaires, durées, effectifs, scores, numéros de problème, compte à rebours. Chiffres tabulaires. Jamais de capitales ni de letter-spacing ; jamais pour un libellé d'interface.

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
- **Motion — doctrine : surtout, en retirer.** Aucune animation d'ambiance, aucune apparition au scroll, aucune transition de survol uniforme. Trois familles seulement : (1) **une** séquence orchestrée à l'ouverture de l'accueil (la figure construite) ; (2) le mouvement qui **répond à une action** — accordéon (ouverture 280 ms `cubic-bezier(0.2, 0.8, 0.2, 1)`, fermeture 180 ms `ease-in`), menu mobile (200 ms, opacité seule), lien texte (filet 1 → 2 px, 120 ms), bouton (fond 100 ms) ; (3) le geste signature (voir §7). Durées et courbes différenciées selon la fonction : ce qui se déplie a une inertie, ce qui apparaît n'en a pas. **Tout** est désactivé sous `prefers-reduced-motion`.

---

## 7. Composants signatures à créer

- **Header** : navigation claire, sélecteur de langue fr/en, Σ à gauche, fin filet or au scroll.
- **Hero** : titre `display-xl` en Fraunces à gauche, figure construite à droite avec sa légende (lien vers le sujet PDF), méta-ligne (dates en mono, lieu, langue, catégories). Pas de hero vide (voir §13).
- **Fiche événement** : bloc élégant récapitulant lieu / dates / organisateur / langue / format.
- **Bloc statistiques** : grands chiffres tabulaires (pays, élèves, catégories, éditions) — placeholders si non confirmés.
- **Deux catégories** : cartes Junior (collège) / Senior (lycée) différenciées, pas deux cartes vides jumelles.
- **Registre des délégations** : lignes filetées, drapeau SVG + nom, **statut `confirmé` / `en attente`** distingué par la couleur du nom et un libellé, lien vers page pays. Pas de cartes, pas de pastilles.
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
