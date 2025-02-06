# Tracteur Scraper API

Une API REST pour scraper les données de tracteurs depuis tractorpool.com. Cette API permet de récupérer la liste des tracteurs disponibles ainsi que les détails spécifiques pour chaque tracteur.

## Technologies Utilisées

- TypeScript
- Node.js
- Express.js
- Cheerio (pour le web scraping)
- Axios (pour les requêtes HTTP)

## Installation

1. Clonez le repository :
```bash
git clone [votre-repo]
cd test-scrapper ```

2. Installez les dependencies :
```bash
npm install
```

## Configuration
Le projet utilise TypeScript et nécessite les dépendances suivantes (déjà incluses dans package.json) :

express et @types/express
cors et @types/cors
cheerio
axios
ts-node
typescript

## Démarrage

Pour demarrer l'API, executez la commande suivante :
```bash
npm run start
```

L'API sera accessible à l'adresse : http://localhost:3000

## Endpoints

1. Liste des Tracteurs :

```
Get `/tractors` :
```

Retourne la liste de tous les tracteurs disponibles.

Exemple d'une requête :
```bash
curl http://localhost:3000/tractors
```

Exemple de réponse :

```json
[
  {
    "TractorID": "8135250",
    "classification": "New-Holland-T-7270-AUTO-COMMAND",
    "name": "New Holland T 7270 AUTO COMMAND"
  }
]
```

2. Détails du Tracteur :

```
GET /tractor/:classification/:id
```

Retourne les détails complets d'un tracteur spécifique.

Paramètres :

*classification* : Classification du tracteur
*id* : ID du tracteur

Exemple d'une requête :
```bash
curl http://localhost:3000/tractor/New-Holland-T-7270-AUTO-COMMAND/8135250
```

Exemple de réponse :

```json
{
  "advert": 8135250,
  "price": 125000,
  "hours": 3500,
  "year": 2019,
  "advertiserStatut": "Dealer",
  "condition": "Used",
  "description": "...",
  "location": "France"
}
```

## Structure du projet

- *api.ts* : Point d'entrée de l'API et configuration Express
- *tractor.ts* : Logique de scraping pour la liste des tracteurs
- *details.ts* : Logique de scraping pour les détails d'un tracteur
- *tsconfig.json* : Configuration TypeScript
- *package.json* : Dépendances et scripts

## Gestion des erreurs 

- Erreur 500 si le scraping échoue
- Messages d'erreur descriptifs dans la console

## Notes
Ce projet est conçu pour le scraping de données depuis tractorpool.com. Assurez-vous de respecter les conditions d'utilisation du site et les limites de taux de requêtes appropriées.