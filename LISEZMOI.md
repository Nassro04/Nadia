# Calculateur de Risque LAB/FT - Guide d'Installation

## 📦 Contenu de cette archive

Cette archive contient le code source complet de votre application **Calculateur de Risque LAB/FT** pour Cash Plus.

L'application est **100% fonctionnelle** et prête à être utilisée !

---

## 🚀 Installation Rapide (3 étapes)

### Prérequis
Vous devez avoir **Node.js** installé sur votre ordinateur.
- Téléchargez Node.js ici : https://nodejs.org/ (version LTS recommandée)

### Étape 1 : Extraire l'archive
Décompressez le fichier ZIP dans un dossier de votre choix.

### Étape 2 : Installer les dépendances
Ouvrez un terminal/invite de commandes dans le dossier extrait et exécutez :

```bash
npm install
```

ou si vous utilisez pnpm :

```bash
pnpm install
```

### Étape 3 : Lancer l'application
Une fois l'installation terminée, lancez l'application avec :

```bash
npm run dev
```

L'application s'ouvrira automatiquement dans votre navigateur à l'adresse : **http://localhost:3000**

---

## 📁 Structure du projet

```
calculateur-lab-ft/
├── client/              # Code de l'application frontend
│   ├── src/
│   │   ├── pages/      # Pages de l'application
│   │   ├── components/ # Composants réutilisables
│   │   ├── lib/        # Générateurs PDF/Excel, calculs
│   │   └── data.json   # Données de référence (pays, activités, etc.)
│   └── public/         # Fichiers statiques (logo, etc.)
├── package.json        # Dépendances du projet
└── LISEZMOI.md        # Ce fichier
```

---

## 🌐 Déploiement en ligne

Pour mettre votre application en ligne, vous pouvez utiliser :

### Option 1 : Vercel (Gratuit et simple)
1. Créez un compte sur https://vercel.com
2. Importez votre projet
3. Vercel déploiera automatiquement votre application

### Option 2 : Netlify (Gratuit)
1. Créez un compte sur https://netlify.com
2. Glissez-déposez le dossier du projet
3. Votre site sera en ligne en quelques secondes

### Option 3 : Votre propre serveur
Exécutez `npm run build` pour créer une version optimisée dans le dossier `dist/`, puis hébergez ce dossier sur n'importe quel serveur web.

---

## 🔧 Personnalisation

### Modifier le logo
Remplacez le fichier dans `client/public/` et mettez à jour la référence dans le code.

### Modifier les données de référence
Éditez le fichier `client/src/data.json` pour ajuster :
- Les pays et leurs scores
- Les activités
- Les produits et canaux
- Etc.

### Modifier les règles de calcul
Le fichier `client/src/lib/riskCalculator.ts` contient toute la logique de calcul du risque.

---

## 📞 Support Technique

Si vous avez besoin d'aide pour :
- Installer l'application
- La déployer en ligne
- La personnaliser
- Corriger un bug

Vous pouvez faire appel à n'importe quel développeur web qui connaît React/TypeScript.

---

## ✅ Fonctionnalités incluses

- ✅ Évaluation complète du risque LAB/FT
- ✅ Gestion des dirigeants, associés et bénéficiaires effectifs
- ✅ Export PDF professionnel avec logo Cash Plus
- ✅ Export Excel détaillé
- ✅ Sauvegarde/chargement des données (JSON)
- ✅ Forçage du niveau de risque
- ✅ Détection automatique des critères redhibitoires
- ✅ Duplication automatique des associés >25% vers bénéficiaires
- ✅ Interface moderne et responsive
- ✅ Champs personnalisés (adresses, RC, ICE, IF, etc.)

---

## 📄 Licence

Ce code vous appartient. Vous êtes libre de le modifier, le distribuer et l'utiliser comme bon vous semble.

---

**Bonne utilisation ! 🎉**
