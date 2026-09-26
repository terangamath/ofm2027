# Déploiement — OFM 2027

Site en production : **https://www.ofm2027.org**, hébergé sur Vercel.
L'adresse sans `www` (`ofm2027.org`) redirige vers elle.

---

## 1. Variables d'environnement à déclarer sur Vercel

Vercel → projet → **Settings → Environment Variables**.

| Variable | Valeur | Environnements Vercel à cocher |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | `https://www.ofm2027.org` | **Production uniquement** |

C'est la seule variable du site. Il n'y a ni clé, ni jeton, ni secret.

- **Ne cochez pas Preview.** Sans la variable, une prévisualisation utilise sa propre
  adresse (`VERCEL_URL`, fournie par Vercel). Chaque déploiement de branche reste
  alors cohérent avec lui-même : liens, sitemap, balises canoniques.
- **Écriture exacte** : `https://`, avec le `www`. Une barre oblique finale est
  tolérée et retirée automatiquement.
- **Si la variable manque ou est mal écrite**, le build échoue avec un message qui dit
  quoi corriger. Le site en ligne n'est pas touché : l'ancienne version reste servie.
- Une variable `NEXT_PUBLIC_*` est figée **au moment du build**. Après l'avoir modifiée,
  il faut **redéployer** (voir §3) pour qu'elle soit prise en compte.

### Domaines

Vercel → projet → **Settings → Domains** :

1. `www.ofm2027.org` : domaine principal.
2. `ofm2027.org` : **Redirect to `www.ofm2027.org`**, code **308** (permanent).

### Développement local

```bash
cp .env.example .env.local   # contient NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

`.env.local` n'est jamais commité (`.gitignore`). Aucun fichier `.env` réel n'est
présent dans l'historique Git (vérifié sur toutes les branches, septembre 2026).

---

## 2. Indexation par les moteurs de recherche

| Déploiement | Indexable | Ce que le site émet |
|---|---|---|
| Production (`https://www.ofm2027.org`, environnement Production de Vercel) | **oui** | `robots.txt` : `Allow: /` + sitemap |
| Tout le reste : prévisualisations, préproduction, local | non | `Disallow: /` dans `robots.txt`, balise `<meta name="robots" content="noindex, nofollow">` sur chaque page, en-tête `X-Robots-Tag: noindex, nofollow` sur chaque réponse |

La règle est double : il faut l'URL de production **et**, sur Vercel, l'environnement
Production. Une prévisualisation qui recevrait par erreur l'URL de production reste
donc non indexable.

> **Si une adresse de préproduction venait malgré tout à être indexée**, il faudrait
> **retirer temporairement le `Disallow: /`** de son `robots.txt` (`lib/indexation.ts`).
> Un robot à qui `robots.txt` interdit une page ne la télécharge pas, et ne voit donc
> jamais son `noindex`. Les deux protections ne se cumulent pas dans ce cas précis :
> pour désindexer, le robot doit pouvoir lire la page et y trouver le `noindex`.
> Une fois les pages sorties de l'index (Google Search Console → Suppressions),
> remettre le `Disallow`.

---

## 3. Redéployer

**Cas normal : une modification poussée sur `main`.** Vercel construit et publie
automatiquement. Rien à faire.

**Redéployer sans changer le code** (après une modification de variable, par exemple) :

1. Vercel → projet → **Deployments**.
2. Sur le dernier déploiement de production, menu **⋯** → **Redeploy**.
3. Laisser **décochée** l'option « Use existing Build Cache » après une modification
   de variable.
4. Attendre l'état **Ready** (environ une à deux minutes).

**Revenir à la version précédente** si une mise en ligne pose problème : Deployments →
un déploiement antérieur marqué *Ready* → **⋯** → **Promote to Production**. C'est
immédiat, sans reconstruction.

### Vérifier après une mise en ligne

```bash
curl -sI https://ofm2027.org | grep -i location        # → https://www.ofm2027.org/
curl -s https://www.ofm2027.org/robots.txt              # Allow: / et Sitemap absolu
curl -sI https://www.ofm2027.org | grep -i x-robots-tag # doit ne rien afficher
curl -sI https://www.ofm2027.org/fr/equipes | head -1   # 308 vers /equipes
```

Puis coller l'adresse dans une conversation WhatsApp ou Signal (sans l'envoyer) :
l'aperçu doit montrer l'image de partage.

Avant une mise en ligne, en local : `npm run test:seo`. Ce script construit le site en
préproduction puis en production et vérifie, page par page, canoniques, hreflang
réciproques, sitemap, robots, noindex, Open Graph et données structurées.

---

## 4. Dépôt du fichier des résultats (CSV)

> **Non disponible à ce jour.** Le site ne sait pas encore lire un fichier de
> résultats : la page `/resultats` affiche « Les résultats seront publiés après la
> correction », et aucun emplacement ni format de fichier n'est prévu. La procédure
> ci-dessous ne pourra être écrite qu'une fois ce mécanisme construit.

Ce qu'il faudra décider pour le construire :

1. **Le format du fichier** : les colonnes (rang, nom, pays, catégorie, score par
   problème, total, distinction), l'encodage et le séparateur. Un modèle à télécharger
   évitera les erreurs de saisie.
2. **Qui dépose le fichier, et où** : la personne qui publie les résultats n'est pas
   forcément à l'aise avec Git.
3. **Les contrôles automatiques** : un fichier mal formé doit faire échouer la
   publication avec un message clair, et ne jamais afficher un classement faux.
4. **La vie privée** : un classement nominatif de mineurs. L'accord des familles et le
   niveau de détail publié sont à valider par Terangamath.

La procédure de dépôt sera alors rédigée ici, pour une personne non technique.
