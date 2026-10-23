# Mettre en ligne et entretenir le site de l'OFM 2027

Ce document s'adresse aux membres de l'association Terangamath qui gèrent la mise en
ligne du site. **Il ne demande aucune connaissance en programmation.** Les quelques
commandes destinées aux développeurs sont regroupées à la fin, dans l'annexe.

Adresse officielle du site : **https://www.ofm2027.org**

---

## Les mots à connaître

- **Vercel** : le service qui héberge le site et le rend visible sur Internet. On s'y
  connecte depuis un navigateur, à l'adresse https://vercel.com. Son interface est en
  anglais : les noms de boutons sont donc cités en anglais ci-dessous.
- **Déploiement** : une version du site mise en ligne. Chaque modification du site
  produit un nouveau déploiement ; Vercel garde les précédents, ce qui permet de
  revenir en arrière.
- **Production** : la version officielle, celle que voit le public sur
  www.ofm2027.org.
- **Prévisualisation** (*Preview*) : une version d'essai, publiée à une adresse
  provisoire en `….vercel.app`, pour relire une modification avant de la rendre
  officielle. Le public ne la trouve pas, et les moteurs de recherche ne la
  référencent pas.
- **Variable d'environnement** : un réglage que Vercel transmet au site au moment où il
  le fabrique. C'est une paire *nom* / *valeur*, comme une ligne de formulaire. Le site
  en utilise une seule : son adresse officielle.

---

## 1. Le seul réglage à faire sur Vercel

Le site doit connaître sa propre adresse, pour l'écrire dans les liens partagés sur les
réseaux sociaux, dans le plan du site destiné à Google, etc. On la lui donne une fois
pour toutes :

1. Se connecter à Vercel et ouvrir le projet du site.
2. Cliquer sur l'onglet **Settings**, puis dans le menu de gauche sur
   **Environment Variables**.
3. Remplir le formulaire :
   - **Key** (le nom) : `NEXT_PUBLIC_SITE_URL`
   - **Value** (la valeur) : `https://www.ofm2027.org`
   - **Environments** : cocher **Production seulement**. Décocher *Preview* et
     *Development*.
4. Cliquer sur **Save**.
5. Republier le site (voir §3) : le réglage n'est pris en compte qu'à la prochaine
   publication.

**Points d'attention**

- Recopier la valeur **exactement** : `https://`, puis `www.`, puis `ofm2027.org`.
- **Ne pas cocher *Preview*.** Les versions d'essai utilisent automatiquement leur
  propre adresse provisoire, et c'est voulu.
- **En cas d'erreur de saisie**, rien ne casse pour le public : Vercel refuse de
  publier la nouvelle version. Dans le détail de la publication (onglet
  **Deployments**, ligne en erreur), un message commençant par
  `Error: NEXT_PUBLIC_SITE_URL :` explique quoi corriger. L'ancienne version reste en
  ligne en attendant.

Il n'y a aucun mot de passe, aucune clé secrète ni aucun autre réglage à saisir.

---

## 2. L'adresse du site (noms de domaine)

Le site doit répondre à deux adresses : `www.ofm2027.org` (l'officielle) et
`ofm2027.org` (sans `www`, que beaucoup de gens tapent), qui renvoie vers la première.

1. Vercel → le projet → **Settings** → **Domains**.
2. Ajouter `www.ofm2027.org`.
3. Ajouter `ofm2027.org`. Quand Vercel le propose, choisir de **rediriger vers
   `www.ofm2027.org`** (redirection permanente).
4. Vercel affiche ensuite des lignes de configuration (appelées « enregistrements
   DNS ») à recopier chez le bureau d'enregistrement du domaine, c'est-à-dire la
   société auprès de laquelle `ofm2027.org` a été acheté. C'est à faire une seule fois.
   La prise en compte peut demander de quelques minutes à quelques heures.

---

## 3. Republier le site, ou revenir en arrière

**Quand une modification du site est validée**, Vercel la publie tout seul, en une à
deux minutes. Il n'y a rien à faire.

**Republier sans rien changer** (par exemple après avoir modifié le réglage du §1) :

1. Vercel → le projet → onglet **Deployments**.
2. Sur la première ligne marquée **Production**, cliquer sur les trois points **⋯**,
   puis sur **Redeploy**.
3. Si une case **Use existing Build Cache** apparaît, la **décocher**.
4. Valider, puis attendre que l'état passe à **Ready** (une à deux minutes).

**Revenir à la version précédente** si une mise en ligne pose problème :

1. Vercel → le projet → onglet **Deployments**.
2. Repérer une version antérieure qui fonctionnait (état **Ready**), cliquer sur ses
   trois points **⋯**, puis sur **Instant Rollback** (ou **Promote to Production**,
   selon la version de l'interface).
3. Le retour est immédiat.

---

## 4. Vérifier le site après une mise en ligne

Depuis un navigateur ordinaire :

1. Taper `ofm2027.org` (sans `www`) : la barre d'adresse doit afficher
   `https://www.ofm2027.org`.
2. Ouvrir une page, puis cliquer sur **EN** en haut à droite : la même page s'affiche
   en anglais. Cliquer sur **FR** pour revenir.
3. Taper une adresse qui n'existe pas, par exemple `www.ofm2027.org/essai` : une page
   « Page introuvable » aux couleurs du site doit s'afficher, avec des liens pour
   repartir.
4. **L'aperçu de partage** : dans WhatsApp, Signal ou un courriel, coller l'adresse
   `https://www.ofm2027.org` sans envoyer le message. Un aperçu doit apparaître,
   avec l'image vert foncé du site (titre de l'Olympiade et figure géométrique dorée).
   Si l'aperçu est vide juste après la mise en ligne, réessayer quelques minutes plus
   tard : ces applications gardent un moment l'ancien aperçu en mémoire.

---

## 5. Google et les moteurs de recherche

Le site est réglé pour que **seule la version officielle** apparaisse dans les
résultats de recherche. Les versions d'essai (prévisualisations) signalent
automatiquement aux moteurs de ne pas les référencer, par trois moyens à la fois.
Rien n'est à régler.

**Cas rare : une version d'essai apparaît quand même dans Google.** Il faut alors
demander à un développeur d'**assouplir temporairement** l'un des trois moyens (le
fichier `robots.txt` de cette version). Cela paraît paradoxal, mais c'est nécessaire.
Tant que ce fichier interdit aux robots de Google de lire la page, ils ne voient pas
non plus la consigne « ne pas référencer » écrite dans la page, et la page reste dans
l'index. Une fois la page retirée des résultats (via Google Search Console, rubrique
*Suppressions*), on rétablit le réglage d'origine. Détail technique pour le
développeur : retirer le `Disallow: /` dans `lib/indexation.ts`.

---

## 6. Publier les résultats (fichier CSV)

> **Pas encore disponible.** Aujourd'hui, la page Résultats affiche « Les résultats
> seront publiés après la correction ». Le site ne sait pas encore lire un fichier de
> résultats. Cette fonction sera construite bien avant le 28 mars 2027, et la procédure
> de dépôt sera alors écrite ici, pas à pas.

Les décisions à prendre d'ici là :

1. **Le modèle de fichier** : quelles colonnes (rang, nom, pays, catégorie, points par
   problème, total, distinction). Un modèle de tableur à remplir sera fourni.
2. **Qui dépose le fichier, et comment**, sans avoir à connaître les outils des
   développeurs.
3. **Les garde-fous** : un fichier incomplet ou mal rempli doit être refusé avec un
   message clair, et ne jamais aboutir à un classement faux en ligne.
4. **La vie privée** : il s'agit d'un classement nominatif d'élèves mineurs. Le niveau
   de détail publié et l'accord des familles sont à valider par Terangamath.

---

## Annexe — pour les développeurs

**Travailler sur le site en local**

```bash
cp .env.example .env.local   # NEXT_PUBLIC_SITE_URL=http://localhost:3000
npm install
npm run dev
```

`.env.local` n'est jamais commité. Aucun fichier `.env` réel n'est présent dans
l'historique Git (vérifié sur toutes les branches, septembre 2026).

**Fonctionnement de la variable** : lue et validée par `lib/site.ts`, seul module
autorisé à lire `process.env`. En l'absence de `NEXT_PUBLIC_SITE_URL`, une
prévisualisation Vercel utilise `https://$VERCEL_URL`. Tout autre cas sans variable
fait échouer le build. Barre oblique finale tolérée et retirée ; https obligatoire
hors `localhost`. Les variables `NEXT_PUBLIC_*` sont figées au build.

**Indexation** : indexable seulement si l'URL vaut `https://www.ofm2027.org` **et**
`VERCEL_ENV` vaut `production` (ou est absent, hors Vercel). Sinon : `Disallow: /`,
`<meta name="robots" content="noindex, nofollow">` et `X-Robots-Tag: noindex, nofollow`.

**Avant une mise en ligne**

```bash
npm test          # tests unitaires
npm run test:seo  # build préproduction puis production : canoniques, hreflang
                  # réciproques, sitemap, robots, noindex, Open Graph, JSON-LD
npm run lint
```

**Après une mise en ligne**

```bash
curl -sI https://ofm2027.org | grep -i location          # → https://www.ofm2027.org/
curl -s  https://www.ofm2027.org/robots.txt               # Allow: / et Sitemap absolu
curl -sI https://www.ofm2027.org | grep -i x-robots-tag   # ne doit rien afficher
curl -sI https://www.ofm2027.org/fr/equipes | head -1     # 308 vers /equipes
```

**Image de partage, favicon et icônes** : générés par `node scripts/images-marque.mjs`
à partir des textes et couleurs du site. À relancer si le titre, les dates ou la
palette changent.

Quand l'image de partage change, augmenter d'abord `VERSION_IMAGE_PARTAGE` dans
`lib/image-partage.ts` : le nom du fichier change, donc son adresse. WhatsApp,
Facebook et LinkedIn gardent l'image en mémoire plusieurs jours par adresse ; sous le
même nom, l'ancienne continuerait de s'afficher.
