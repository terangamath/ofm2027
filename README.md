# OFM 2027 — Site officiel

Site institutionnel de l'**Olympiade Francophone de Mathématiques 2027**,
organisée à Dakar, Sénégal par [Terangamath](https://terangamath.org).

**Stack :** Next.js 16 · TypeScript strict · Tailwind CSS v4 · next-intl (FR/EN) · SSG

---

## Développement local

### Prérequis

- Node.js ≥ 20
- npm ≥ 10

### Installation

```bash
git clone https://github.com/eds-fb/ofm2027.git
cd ofm2027
npm install
```

### Variables d'environnement

```bash
cp .env.example .env.local
# Éditez .env.local si nécessaire (voir commentaires dans le fichier)
```

> Pour le développement local, aucune variable n'est strictement requise.
> Le site fonctionne entièrement avec les fichiers JSON du dossier `content/`.

### Lancement

```bash
npm run dev
# → http://localhost:3000
```

### Build de production (vérification locale)

```bash
npm run build
npm run start
# → http://localhost:3000
```

### Lint

```bash
npm run lint
```

---

## Structure du projet

```
ofm2027/
├── app/[locale]/          # Pages (App Router, i18n)
├── components/
│   ├── layout/            # Header, Footer, Breadcrumb
│   ├── sections/          # Sections de la homepage
│   └── ui/                # Composants primitifs (Section, SectionHeading…)
├── content/               # Contenu JSON/YAML éditable
│   ├── equipes/           # Pays participants
│   ├── programme/         # Agenda OFM 2027
│   ├── organisation/      # Comités et Terangamath
│   ├── actualites/        # Articles
│   └── faq/               # Questions fréquentes
├── messages/              # Traductions (fr.json, en.json)
├── styles/globals.css     # Design system (tokens, échelle typo, container)
└── public/                # Assets statiques
```

---

## Contenu éditable

Tout le contenu du site est dans `/content/` sous forme de fichiers JSON.
Aucun CMS requis — modifier un fichier JSON et redéployer suffit.

| Fichier | Contenu |
|---------|---------|
| `content/equipes/index.json` | Liste des pays participants |
| `content/programme/agenda-2027.json` | Calendrier et événements |
| `content/organisation/index.json` | Comités et Terangamath |
| `content/actualites/*.md` | Articles d'actualité |
| `content/faq/index.json` | Questions fréquentes |

---

## Déploiement sur Vercel

### 1. Connecter le dépôt à Vercel

1. Aller sur [vercel.com](https://vercel.com) → **Add New Project**
2. Importer le dépôt GitHub `eds-fb/ofm2027`
3. Vercel détecte automatiquement **Next.js** — ne rien changer aux paramètres par défaut
4. Cliquer **Deploy**

> Aucun `vercel.json` requis. Vercel gère Next.js nativement.

### 2. Variables d'environnement sur Vercel

Dans **Settings → Environment Variables**, ajouter :

| Variable | Valeur | Environnements |
|----------|--------|----------------|
| `NEXT_PUBLIC_SITE_URL` | `https://votre-domaine.com` | Production |
| `NEXT_PUBLIC_SITE_URL` | _(laisser vide — Vercel injecte `VERCEL_URL`)_ | Preview |

> Pour l'instant, le site fonctionne sans variables d'environnement.
> Les ajouter n'est nécessaire que quand vous activez les OG tags dynamiques ou un formulaire de contact.

### 3. Previews automatiques

Chaque `git push` sur une branche crée automatiquement une **Preview URL** sur Vercel.
Le push sur `main` déclenche le déploiement en **Production**.

Workflow recommandé :
```
feature/ma-modification  →  Preview URL (test)
        ↓  merge
       main              →  Production
```

### 4. Redéployer manuellement

Depuis le dashboard Vercel → projet **ofm2027** → **Deployments** → **Redeploy**.

Ou en ligne de commande (optionnel) :
```bash
npm i -g vercel
vercel --prod
```

### 5. Connecter un domaine personnalisé

Dans **Settings → Domains** :
1. Ajouter votre domaine (ex : `ofm2027.org`)
2. Suivre les instructions DNS affichées par Vercel
3. Vercel gère automatiquement le certificat HTTPS

---

## Internationalisation

Le site est bilingue **Français / Anglais** via `next-intl`.

- Français : `/` (racine, pas de préfixe)
- Anglais : `/en/…`

Les traductions sont dans `messages/fr.json` et `messages/en.json`.

---

## Licence

Projet privé — Terangamath · OFM 2027. Tous droits réservés.
