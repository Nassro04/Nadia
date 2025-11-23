# Calculateur Risque LAB/FT - Personne Morale | Cash Plus

## Description

Application web pour l'évaluation du risque de blanchiment et de financement du terrorisme (LAB/FT) des personnes morales selon l'approche basée sur les risques de Cash Plus.

## Fonctionnalités

- Évaluation complète du risque LAB/FT avec 4 axes pondérés :
  - Zone géographique (35%)
  - Caractéristiques client (35%)
  - Produits et services (20%)
  - Canaux de distribution (10%)

- Support de plusieurs dirigeants, associés et bénéficiaires effectifs
- Règles automatiques de risque élevé et faible
- Détection des critères rédhibitoires
- Alertes pour sanctions internationales et pays interdits
- Section de forçage du risque pour responsables
- Export PDF et Excel des résultats
- 650 activités économiques référencées
- 197 pays avec scores de risque
- 45 villes marocaines

## Prérequis

- Node.js version 18 ou supérieure
- pnpm (gestionnaire de paquets)

## Installation

### 1. Installer Node.js et pnpm

Si Node.js n'est pas installé :
```bash
# Télécharger depuis https://nodejs.org/
# Ou via gestionnaire de paquets (exemple Ubuntu/Debian)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

Installer pnpm :
```bash
npm install -g pnpm
```

### 2. Extraire les fichiers

Extraire le contenu du ZIP dans un dossier de votre choix.

### 3. Installer les dépendances

```bash
cd calculateur-lab-ft
pnpm install
```

### 4. Lancer l'application en développement

```bash
pnpm dev
```

L'application sera accessible sur `http://localhost:3000`

### 5. Compiler pour la production

```bash
pnpm build
```

Les fichiers compilés seront dans le dossier `dist/`

## Déploiement en production

### Option A : Serveur web statique (Nginx, Apache)

1. Compiler l'application :
```bash
pnpm build
```

2. Copier le contenu du dossier `dist/` vers le répertoire web de votre serveur :
```bash
cp -r dist/* /var/www/html/calculateur-labft/
```

3. Configuration Nginx (exemple) :
```nginx
server {
    listen 80;
    server_name calculateur-risque.cashplus.ma;
    
    root /var/www/html/calculateur-labft;
    index index.html;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

### Option B : Serveur Node.js avec PM2

1. Installer PM2 :
```bash
npm install -g pm2
```

2. Créer un fichier `ecosystem.config.js` :
```javascript
module.exports = {
  apps: [{
    name: 'calculateur-labft',
    script: 'npx',
    args: 'serve dist -l 3000',
    cwd: '/chemin/vers/calculateur-lab-ft',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production'
    }
  }]
};
```

3. Lancer avec PM2 :
```bash
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

## Configuration

### Personnalisation

- **Logo** : Remplacer `/client/public/cashplus-logo.png`
- **Couleurs** : Modifier `/client/src/index.css` (variables CSS)
- **Titre** : Modifier `/shared/const.ts`

### Données de référence

Les données de référence (pays, villes, activités) sont dans `/client/src/data.json`

## Support technique

Pour toute question technique, contacter le Service IT de Cash Plus.

## Sécurité

- L'application fonctionne entièrement côté client (navigateur)
- Aucune donnée n'est envoyée à des serveurs externes
- Les exports PDF/Excel sont générés localement dans le navigateur
- Recommandé : héberger sur un réseau interne ou avec authentification

## Version

Version 1.0.0 - Janvier 2025

---

© 2025 Cash Plus. Tous droits réservés.
