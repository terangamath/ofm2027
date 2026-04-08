# CLAUDE.md — OFM 2027 · Olympiade Francophone de Mathématiques · Sénégal

> Fichier de contexte projet pour Claude Code. À placer à la racine du dépôt.

## Stack technique
- Next.js 14+ (App Router), TypeScript strict, Tailwind CSS, shadcn/ui
- Contenu : MDX + JSON/YAML, KaTeX pour les formules, next-intl pour i18n
- Déploiement : Vercel

## Palette de couleurs
- --color-vert: #1B4332 (primaire)
- --color-vert-clair: #2D6A4F
- --color-or: #C9A84C (accent)
- --color-or-clair: #E8C97A
- --color-sable: #F5F0E8 (fond)
- --color-anthracite: #1C1C1E
- --color-gris: #6B7280
- --color-rouge: #C0392B
- --color-blanc: #FFFFFF

## Typographie
- Titres : Playfair Display, Corps : Inter / DM Sans, Code : JetBrains Mono

## Règles clés
- Placeholders pour tout contenu non confirmé : [Date à confirmer], [Liste des pays à confirmer]
- Jamais de `any` TypeScript
- Toujours gérer l'état `coming_soon`
- Mobile first, accessible (WCAG AA)
- Composants Server Components par défaut, "use client" si nécessaire
- Texte UI uniquement via messages/fr.json, pas hardcodé
