Voici le projet Vapeur ! Ce site permet de gérer une collection de jeu vidéo !

Modules requis : 
- Express : npm install express
- HBS : npm install hbs

Suivez les étapes suivantes pour installer et utiliser le projet Vapeur

1 - Téléchargez le dossier : Code -> Download as ZIP, puis l'extraire où vous le souhaitez
2 - Ouvrez un terminal dans le dossier racine
3 - Saisir les commandes d'initialisation de prisma ( ORM pour la gestion de base de donnée sous JS )
      --> installer le module : npm install prisma @prisma/client sqlite3
      --> initialiser la base de donnée : npx prisma migrate dev --name init
4 - Lancer le serveur
      --> node server.js
      --> ouvrez une page web à l'adresse : http://localhost:3000/
