# Voici le projet Vapeur ! 
Ce site permet de gérer une collection de jeux vidéo !

## Modules requis :
- Express : `npm install express`
- HBS : `npm install hbs`

## Suivez les étapes suivantes pour installer et utiliser le projet Vapeur

1. Téléchargez le dossier :
   - Code -> Download as ZIP, puis l'extraire où vous le souhaitez

2. Ouvrez un terminal dans le dossier racine

3. Saisir les commandes d'initialisation de Prisma (ORM pour la gestion de base de données sous JS) :
   - Installer le module :  
     ```bash
     npm install prisma @prisma/client sqlite3
     ```
   - Initialiser la base de données :  
     ```bash
     npx prisma migrate dev --name init
     ```

4. Lancer le serveur :
   - Démarrer le serveur :  
     ```bash
     node server.js
     ```
   - Ouvrez une page web à l'adresse : [http://localhost:3000/](http://localhost:3000/)
