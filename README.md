# OFM 2027 — Olympiade Francophone de Mathématiques

Site officiel de l'OFM 2027, organisée par Terangamath depuis Dakar.
Production : https://www.ofm2027.org

Next.js (App Router), TypeScript strict, Tailwind CSS, next-intl (fr par défaut, en),
MDX et KaTeX. Contexte et direction artistique : `CLAUDE.md`.

## Démarrer

```bash
cp .env.example .env.local   # NEXT_PUBLIC_SITE_URL=http://localhost:3000
npm install
npm run dev
```

## Variables d'environnement

| Variable | Où | Valeur |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | Vercel, environnement **Production** | `https://www.ofm2027.org` |
| `NEXT_PUBLIC_SITE_URL` | Vercel, environnement **Preview** | ne pas déclarer : `VERCEL_URL` est utilisée |
| `NEXT_PUBLIC_SITE_URL` | `.env.local` | `http://localhost:3000` |

La variable est lue et validée par `lib/site.ts`, seul module autorisé à la lire.
Absente ou malformée, elle fait échouer le build. Seule l'URL de production est
indexable. Détails et procédures : `DEPLOIEMENT.md`.

## Vérifier

```bash
npm test          # tests unitaires (fuseaux, typographie, URL du site, indexation)
npm run test:seo  # construit le site deux fois (préproduction, production) et vérifie
                  # canoniques, hreflang réciproques, sitemap, robots et noindex
npm run lint
```
