//  ---------------------------------------------------
//  --- VÉRIFICATIONS DES MODULES ET DES EXTENSIONS ---
//  ---------------------------------------------------

const express = require("express");
const { PrismaClient } = require("@prisma/client");
const bodyParser = require("body-parser");
const path = require("path");
const hbs = require("hbs");

const app = express();
const prisma = new PrismaClient();
const PORT = 3000;

app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "views"));
hbs.registerPartials(path.join(__dirname, "views", "partials"));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// Helper permettant de vérifier sur quel page l'utilisateur est (pour le Header)

hbs.registerHelper('isEqual', function(a, b) {
    return a === b;
});

//  --------------------------------------
//  --- DÉFINITIONS DES ROUTES SERVEUR ---
//  --------------------------------------

// Pour l'accueil --------------

app.get("/", async (req, res) => {
    try {   // Renvoie les jeux qui doivent être mis en avant dans la page d'accueil
        const games = await prisma.games.findMany({
            where: { appearHomepage: true }});
        res.render("homepage", { games, currentPage: "homepage"  });
    } catch (error) {
        console.error("Erreur de récupération des jeux pour la page d'accueil:", error);
        res.status(500).send("Erreur de serveur");
    }
});

// Pour la création d'un jeu ----

app.get("/addGame", async (req, res) => {
    try {   // Renvoie les genres et les éditeurs pour les liste déroulantes
        const genres = await prisma.genres.findMany()
        const editors = await prisma.editors.findMany()
        res.render("addGame", { genres, editors, currentPage: "addGame"  });
    } catch (error) {   
        console.error("Erreur de récupération des données:", error);
        res.status(500).send("Erreur de serveur");
    }
});

app.post("/addGame", async (req, res) => {
    // Récupération des données saisies par l'utilisateur
    let { name, description, releaseDate, genre, editor } = req.body;

    // Initialise la description dans le cas où l'utilisateur
    // ne saisit rien pour la description
    if (!description) 
        description = "Sans description";

    try {   // Ajout dans la table Games les données du formulaire
        await prisma.games.create({
            data: {
                name,
                description,
                releaseDate,
                genreId: parseInt(genre),
                editorId: parseInt(editor),
            },
        });
        res.status(201).redirect("/gameList");
    } catch (error) {
        console.error(error);
        res.status(400).json({ error: "Game creation failed" });
    }
});

// Pour la liste des jeux ----

app.get("/gameList", async (req, res) => {
    try {   // Renvoie les données dans l'ordre croissant du nom des jeux
        const games = await prisma.games.findMany({
            orderBy: { name: "asc" }});
        res.render("gameList", { games, currentPage: "gameList"  });
    } catch (error) {
        console.error("Erreur de récupération des jeux:", error);
        res.status(500).send("Erreur de serveur");
    }
});

// Pour la liste des editeurs ----

app.get("/editorList", async (req, res) => {
    try {   // Renvoie les données dans l'ordre croissant du nom des éditeurs
        const editors = await prisma.editors.findMany({
            orderBy: { editorName: "asc" }});
        res.render("editorList", { editors, currentPage: "editorList"  });
    } catch (error) {
        console.error("Erreur de récupération des jeux:", error);
        res.status(500).send("Erreur de serveur");
    }
});

// Pour la création d'éditeurs ----

app.get("/addEditor", (req, res) => { // Renvoie la page actuel
    res.render("addEditor",  {currentPage: "addEditor"} );
});

app.post("/addEditor", async (req, res) => {
    // Récupération de la donnée saisie par l'utilisateur
    const { editorName } = req.body;
    try { // Ajout dans la table Editors la donnée du formulaire
        await prisma.editors.create({
            data: {
                editorName
            },
        });
        res.status(201).redirect("/editorList");
    } catch (error) {
        console.error(error);
        res.status(400).json({ error: "Game creation failed" });
    }
});

// Pour le détail des jeux ----

app.get("/gameDetails/:id-:name", async (req, res) => {
    // Récupération de l'id du jeu par l'URL
    const { id } = req.params;

    try { // Renvoie les éditeurs et le genre du jeu concerné
        const game = await prisma.games.findUnique({
            where: { id: parseInt(id) },
        });   
        const editor = await prisma.editors.findUnique({
            where: { id: game.editorId },
        });   
        const genre = await prisma.genres.findUnique({
            where: { id: game.genreId },
        });   

        res.render("gameDetails", { game, editor, genre });
    } catch (error) {
        console.error("Erreur de récupération des détails du jeu:", error);
        res.status(500).send("Erreur de serveur");
    }
});

// Pour le détail des éditeurs ----

app.get("/editorDetails/:id-:name", async (req, res) => {
    // Récupération de l'id de l'éditeur par l'URL
    const { id } = req.params;

    try { // Renvoie les jeux liés à l'éditeur concerné
        const games = await prisma.games.findMany({
            where: { editorId: parseInt(id) },
        });
        const editor = await prisma.editors.findUnique({
            where: { id: parseInt(id) }
        });

        res.render("editorDetails", { games, editor });
    } catch (error) {
        console.error("Erreur de récupération des détails de l'éditeur:", error);
        res.status(500).send("Erreur de serveur");
    }
});

// Pour le détail des genres ----

app.get("/genreDetails/:id-:genre", async (req, res) => {
    // Récupération de l'id du genre par l'URL
    const { id } = req.params;
    try { // Renvoie les jeux liés au genre concerné
        const games = await prisma.games.findMany({
            where: { genreId: parseInt(id) },
        });
        const genre = await prisma.genres.findUnique({
            where: { id: parseInt(id) }
        });

        res.render("genreDetails", { games, genre });
    } catch (error) {
        console.error("Erreur de récupération des détails du genre:", error);
        res.status(500).send("Erreur de serveur");
    }
});

// Pour la liste des genres ----

app.get("/genreList", async (req, res) => {
    try { // Renvoie les données dans l'ordre croissant du nom des genres
        const genres = await prisma.genres.findMany({
            orderBy: { genre: "asc" }});
        res.render("genreList", { genres, currentPage: "genreList" });
    } catch (error) {
        console.error("Erreur de récupération des genres:", error);
        res.status(500).send("Erreur de serveur");
    }
});

// Pour supprimer un jeu ----

app.post("/deleteGame/:id", async (req, res) => {
    // Récupération de l'id du jeu par l'URL
    const { id } = req.params;

    try { // Supprime le jeu à l'id correspondant
        await prisma.games.delete({
            where: { id: parseInt(id) }});
        res.redirect("/gameList");
    } catch (error) {
        console.error("Erreur lors de la suppression du jeu:", error);
        res.status(500).send("Erreur de serveur");
    }
});

// Pour supprimer un éditeur (ainsi que ses jeux associés) ----

app.post("/deleteEditor/:id-:name", async (req, res) => {
    // Récupération de l'id de l'éditeur par l'URL
    const { id } = req.params;

    try { // Supprime l'éditeur à l'id correspondant ainsi que ses jeux
        await prisma.games.deleteMany({
            where: { editorId: parseInt(id) }});
        await prisma.editors.delete({
            where: { id: parseInt(id) }});
        res.redirect("/EditorList"); // Redirection après suppression
    } catch (error) {
        console.error("Erreur lors de la suppression de l'éditeur:", error);
        res.status(500).send("Erreur de serveur");
    }
});

// Pour modifier un jeu ----

app.get("/modifyGame/:id-:name", async (req, res) => {
    // Récupération de l'id du jeu par l'URL
    const { id } = req.params;
    try { // Renvoie les informations du jeu ainsi que les genres et éditeurs pour les listes déroulantes
        const game = await prisma.games.findUnique({
            where: { id: parseInt(id) }});
        const genres = await prisma.genres.findMany()
        const editors = await prisma.editors.findMany()

        res.render("modifyGame", { game, genres, editors});
    } catch (error) {   
        console.error("Erreur de récupération des données:", error);
        res.status(500).send("Erreur de serveur");
    }
});

app.post("/modifyGame/:id", async (req, res) => {
    // Récupération de l'id du jeu par l'URL
    const { id } = req.params;
    // Récupération des données saisies par l'utilisateur
    let { name, description, releaseDate, genre, editor } = req.body;


    // Initialise la description dans le cas où l'utilisateur
    // ne saisit rien pour la description
    if (!description) 
        description = "Sans description";

    try { // Modifie dans la table Games les données avec les nouvelles saisies
        await prisma.games.update({
            where: { id: parseInt(id) },
            data: {
                name,
                description,
                releaseDate,
                genreId: parseInt(genre),
                editorId: parseInt(editor),
            },
        });
        res.status(201).redirect("/gameList");
    } catch (error) {
        console.error(error);
        res.status(400).json({ error: "Game creation failed" });
    }
});

// Pour modifier un éditeur ----

app.get("/modifyEditor/:id-:name", async (req, res) => {
    // Récupération de l'id de l'éditeur par l'URL
    const { id } = req.params;
    try {// Renvoie les informations de l'éditeur
        const editor = await prisma.editors.findUnique({
            where: { id: parseInt(id) }});

        res.render("modifyEditor", { editor });
    } catch (error) {   
        console.error("Erreur de récupération des données:", error);
        res.status(500).send("Erreur de serveur");
    }
});

app.post("/modifyEditor/:id", async (req, res) => {
    // Récupération de l'id de l'éditeur par l'URL
    const { id } = req.params;
        // Récupération de la donnée saisie par l'utilisateur
    const { editorName } = req.body;

    try { // Modifie dans la table Editors les données avec la nouvelle saisie
        await prisma.editors.update({
            where: { id: parseInt(id) },
            data: {
                editorName,
            },
        });
        
        res.status(201).redirect("/editorList");
    } catch (error) {
        console.error(error);
        res.status(400).json({ error: "Game creation failed" });
    }
});

// Pour la mise en avant d'un jeu ----

app.post("/toggleHomepage/:id", async (req, res) => {
    // Récupération de l'id du jeu par l'URL
    const { id } = req.params;

    try { // Récupère le jeu dans la table Games
        const game = await prisma.games.findUnique({
            where: { id: parseInt(id) }});

        // Inversion de la valeur du booléen permettant la mise en avant
        await prisma.games.update({
            where: { id: parseInt(id) },
            data: { appearHomepage: !game.appearHomepage }
        });

        res.redirect("/gameList");
    } catch (error) {
        console.error("Erreur de mise à jour :", error);
        res.status(500).send("Erreur de serveur");
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});