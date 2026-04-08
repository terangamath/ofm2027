Tu es un lead engineer + product designer + architecte front-end/back-end.

Je veux que tu conçoives puis développes un site web complet pour **l’Olympiade Francophone de Mathématiques 2027 (OFM 2027)** organisée au **Sénégal**, sous la coordination principale de **l’association Terangamath**.

Le site doit être :
- institutionnel, élégant, sobre et moderne
- rapide, responsive, accessible, SEO-friendly
- facilement maintenable
- pensé pour évoluer avant, pendant et après l’événement
- bilingue prêt à l’emploi (français d’abord, architecture extensible pour anglais plus tard)
- orienté publication de contenu (news, documents PDF, équipes, résultats, photos)

## 1) Objectif produit

Le site doit servir à 4 usages principaux :
1. présenter l’édition OFM 2027 et son identité
2. centraliser les informations utiles pour les délégations, encadrants, élèves, partenaires et visiteurs
3. publier au fil du temps les documents, équipes, annonces, problèmes, solutions et résultats
4. conserver une archive propre de l’édition 2027 après l’événement

Le site doit inspirer confiance à un public académique/institutionnel international francophone.

## 2) Références fonctionnelles à reprendre puis améliorer

Les éditions précédentes avaient globalement ces rubriques :
- Accueil
- À propos / présentation de l’OFM
- Organisation
- Équipes participantes
- Problèmes
- Solutions
- Résultats
- Historique
- Contact

Je veux garder cette logique, mais en mieux :
- meilleure hiérarchie d’information
- meilleure qualité visuelle
- meilleure maintenabilité
- meilleure expérience mobile
- meilleure structure de contenu
- meilleure capacité à publier facilement les mises à jour

Il ne faut PAS cloner visuellement les anciens sites.
Il faut créer une version 2027 plus premium, plus claire, plus professionnelle et plus scalable.

## 3) Positionnement éditorial et ton

Le ton du site doit être :
- institutionnel
- clair
- accueillant
- rigoureux
- panafricain et francophone
- valorisant pour le Sénégal sans tomber dans le folklore

Le Sénégal doit être mis en avant avec subtilité :
- excellence académique
- hospitalité
- jeunesse
- rayonnement francophone
- sérieux de l’organisation

## 4) Design system souhaité

Créer une direction artistique inspirée :
- des codes académiques / olympiades scientifiques
- d’un web design moderne et minimaliste
- d’une touche élégante évoquant le Sénégal

Contraintes visuelles :
- interface claire
- bonne lisibilité
- grands titres nets
- cartes propres
- sections aérées
- responsive mobile très soigné
- animations discrètes seulement

Palette recommandée (à ajuster intelligemment) :
- vert profond
- or/doré discret
- blanc cassé / sable clair
- anthracite / noir doux
- rouge très léger en couleur d’accent secondaire si nécessaire

Ne pas surcharger l’interface.
Je préfère un rendu premium et institutionnel à un rendu tape-à-l’œil.

## 5) Stack technique à proposer

Choisis une stack moderne, simple à maintenir et adaptée à ce besoin.

Je veux une proposition argumentée, mais tu peux partir par défaut sur quelque chose comme :
- Next.js
- TypeScript
- Tailwind CSS
- shadcn/ui ou composants maison sobres
- CMS léger ou contenu local structuré (MDX / JSON / YAML) selon la complexité
- déploiement Vercel
- stockage images/documents simple

Ton rôle est de choisir l’architecture la plus pertinente avec ce critère :
**facilité de maintenance par une petite équipe non technique ou semi-technique**.

Si un CMS est utile, propose l’option la plus légère et robuste.
Sinon, propose une architecture fichiers structurés très propre.

## 6) Arborescence du site

Je veux au minimum les pages/rubriques suivantes :

### A. Accueil
Contenus attendus :
- hero principal “OFM 2027 — Sénégal”
- sous-texte de présentation
- date(s) de l’événement (placeholder si besoin)
- CTA vers “Informations pratiques”, “Équipes”, “Documents”, “Contact”
- section “L’OFM en bref”
- section “Pays participants” ou “pays invités” (placeholder)
- section “Temps forts / actualités”
- section “Informations clés”
- section “Partenaires / soutiens”
- section “Comptes à rebours” si pertinent
- section “Questions fréquentes” courte
- footer complet

### B. L’Olympiade / À propos
Sous-sections :
- Qu’est-ce que l’OFM ?
- Objectifs
- Format de la compétition
- Catégories Junior / Senior
- Mode d’organisation de l’édition 2027
- Documents officiels à télécharger
- Foire aux questions plus détaillée

### C. Organisation
Sous-sections :
- Présentation de Terangamath
- Comité d’organisation
- Comité scientifique / sélection des problèmes
- Coordination / jury / bénévoles
- Partenaires institutionnels
- Remerciements

### D. Équipes participantes
Page structurée avec :
- liste des pays
- fiche par pays
- possibilité d’ajouter drapeau, nom du chef de délégation, encadrants, élèves junior/senior
- état de publication (ex. “à venir” si non publié)
- filtre / recherche si utile

### E. Programme / Calendrier
Page dédiée :
- agenda global
- jalons avant l’événement
- programme des journées de compétition
- publication des résultats
- événements annexes éventuellement

### F. Informations pratiques
Page orientée visiteurs/délégations :
- lieu(x) ou format de participation
- hébergement (si présentiel ou hybride)
- transports
- visas / formalités (si pertinent)
- restauration
- fuseaux horaires / horaires officiels
- consignes pour chefs de délégation
- documents téléchargeables

### G. Problèmes & Solutions
Architecture propre pour publier :
- problèmes Junior
- problèmes Senior
- solutions Junior
- solutions Senior
- statut de publication : “bientôt disponible”, “publié”
- possibilité de joindre PDF et/ou rendu HTML
- pages lisibles math-friendly

Prévois le support d’affichage des formules mathématiques (KaTeX ou équivalent).

### H. Résultats
Page dédiée avec :
- résultats Junior
- résultats Senior
- médailles / mentions
- téléchargements PDF
- tableaux lisibles
- possibilité d’ajouter rapidement les données officielles

### I. Actualités / Annonces
Mini blog ou section news pour :
- ouverture des inscriptions
- annonce des pays
- publication des documents
- rappel des échéances
- publication des résultats
- bilan final

### J. Galerie médias
- photos
- vidéos
- albums
- couverture post-événement

### K. Historique des éditions
Page archive :
- OFM 2020 à OFM 2026 au minimum
- année
- pays organisateur
- dates
- liens vers ressources / anciens sites
- petits blocs chronologiques élégants

### L. Contact
- formulaire
- email(s)
- téléphone(s) si besoin
- réseaux sociaux
- FAQ de contact
- mentions légales de base

## 7) Exigences UX/UI

Je veux :
- navigation desktop + mobile impeccable
- header sticky propre
- footer riche
- breadcrumbs sur pages internes si pertinent
- composants réutilisables
- états “à venir”, “bientôt disponible”, “non publié”
- skeleton/loading states sobres
- gestion d’erreurs propre
- excellent responsive
- accessibilité correcte (contrastes, aria, navigation clavier, tailles lisibles)

## 8) Exigences techniques

Je veux un code :
- propre
- modulaire
- fortement typé
- documenté
- scalable
- simple à relire

À produire :
1. architecture du projet
2. choix techniques justifiés
3. structure des données
4. composants UI réutilisables
5. pages principales implémentées
6. contenu de démonstration réaliste
7. SEO de base
8. favicon / métadonnées / Open Graph
9. README d’installation
10. stratégie de déploiement

## 9) Modèle de contenu

Je veux que tu conçoives un vrai modèle de données pour faciliter la maintenance.

Prévois des collections ou structures pour :
- settings globaux du site
- pages statiques
- actualités
- documents
- pays
- équipes
- membres d’organisation
- partenaires
- problèmes
- solutions
- résultats
- événements du programme
- FAQ
- galerie média
- historiques des éditions précédentes

Chaque type de contenu doit avoir un schéma clair.

## 10) Identité éditoriale par défaut

Utilise du faux contenu crédible si les informations réelles ne sont pas encore connues.
Tous les contenus non confirmés doivent être balisés clairement comme placeholders.

Exemples :
- [Date à confirmer]
- [Liste des pays à confirmer]
- [Document bientôt disponible]
- [Nom du coordinateur à compléter]

Ne pas inventer de faits présentés comme officiels.
Toujours distinguer “contenu fictif de démonstration” et “contenu officiel confirmé”.

## 11) Internationalisation et maintenabilité

Prépare le site pour qu’on puisse plus tard :
- ajouter l’anglais
- ajouter de nouveaux pays / équipes
- publier rapidement des PDF
- mettre à jour résultats et documents sans casser le site
- archiver l’édition 2027 proprement après la compétition

## 12) Performance et SEO

Optimise pour :
- performance Lighthouse élevée
- images optimisées
- métadonnées propres
- URLs claires
- titres et descriptions bien structurés
- schémas sémantiques HTML
- partage social correct

## 13) Ce que je veux de toi maintenant

Travaille par étapes, mais en produisant directement du concret :

### Étape 1
Propose l’architecture fonctionnelle et technique du site.

### Étape 2
Définis l’arborescence détaillée + le modèle de données.

### Étape 3
Génère la structure du projet complète.

### Étape 4
Implémente les principales pages et composants avec un design premium.

### Étape 5
Ajoute du contenu de démonstration réaliste pour OFM 2027 Sénégal.

### Étape 6
Explique comment maintenir le site et modifier facilement les contenus.

## 14) Niveau d’exigence

Je ne veux pas un prototype brouillon.
Je veux un socle sérieux, esthétique et exploitable.

Tu dois agir comme si ce site allait être vu par :
- délégations officielles
- enseignants
- élèves
- partenaires institutionnels
- médias
- public international francophone

## 15) Important

- Pose le moins de questions possible.
- Quand une information manque, utilise des placeholders propres.
- Donne des noms de fichiers, dossiers, composants et structures de données précis.
- Génère du vrai code prêt à lancer.
- Sois exigeant sur la qualité visuelle et sur la structure de contenu.
- Pense “site officiel pérenne”, pas “landing page temporaire”.

Commence par :
1. une recommandation de stack
2. l’arborescence complète
3. le modèle de données
4. puis le code du projet