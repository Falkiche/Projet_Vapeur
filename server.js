    const express = require("express");
    const { PrismaClient } = require("@prisma/client");
    const bodyParser = require("body-parser");
    const path = require("path");

    const app = express();
    const prisma = new PrismaClient();
    const PORT = 3000;


    app.set("view engine", "hbs");
    app.set("views", path.join(__dirname, "views"));

    
    app.use(bodyParser.urlencoded({ extended: true }));

    app.get("/", async (req, res) => {
        try {
            const games = await prisma.games.findMany({
                where: { appearHomepage: true }, // Récupère les jeux où appearHomepage est true
            });
    
            res.render("homepage", { games }); // Passe les jeux à la vue
        } catch (error) {
            console.error("Erreur de récupération des jeux pour la page d'accueil:", error);
            res.status(500).send("Erreur de serveur");
        }
    });
    
    app.get("/addGame", async (req, res) => {
        try {
            // Requêtes simultanées pour les genres et les éditeurs
            const [genres, editors] = await Promise.all([
                prisma.genres.findMany(),
                prisma.editors.findMany()
            ]);
    
            // Rendu du formulaire avec les deux listes
            res.render("addGame", { genres, editors });
        } catch (error) {   
            console.error("Erreur de récupération des données:", error);
            res.status(500).send("Erreur de serveur");
        }
    });

    app.post("/addGame", async (req, res) => {
        let { name, description, releaseDate, genre, editor } = req.body;

        if (!description) 
            description = "Sans description";

        try {
            await prisma.games.create({
                data: {
                    name,
                    description,
                    releaseDate,
                    genre,
                    editor,
                },
            }); // Ici on ne stock pas le retour de la requête, mais on attend quand même son exécution
            res.status(201).redirect("/gameList"); // On redirige vers la page des tâches
        } catch (error) {
            console.error(error);
            res.status(400).json({ error: "Game creation failed" });
        }
    });

    app.get("/gameList", async (req, res) => {
        try {
            const games = await prisma.games.findMany({
                select: { id: true, name: true, appearHomepage: true }, // On récupère uniquement le nom des jeux
                orderBy: { name: "asc" } // Trie par ordre alphabétique
            });
            res.render("gameList", { games });
        } catch (error) {
            console.error("Erreur de récupération des jeux:", error);
            res.status(500).send("Erreur de serveur");
        }
    });

    app.get("/editorList", async (req, res) => {
        try {
            const editors = await prisma.editors.findMany({
                select: { id: true, editorName: true }, // On récupère uniquement le nom des jeux
                orderBy: { editorName: "asc" } // Trie par ordre alphabétique
            });
            res.render("editorList", { editors });
        } catch (error) {
            console.error("Erreur de récupération des jeux:", error);
            res.status(500).send("Erreur de serveur");
        }
    });


    app.get("/addEditor", (req, res) => {
        res.sendFile(path.join(__dirname,"public", "addEditor.html"));;
    });

    app.post("/addEditor", async (req, res) => {
        const { editorName } = req.body;
        try {
            await prisma.editors.create({
                data: {
                    editorName
                },
            }); // Ici on ne stock pas le retour de la requête, mais on attend quand même son exécution
            res.status(201).redirect("/"); // On redirige vers la page des tâches
        } catch (error) {
            console.error(error);
            res.status(400).json({ error: "Game creation failed" });
        }
    });
    
    app.get("/gameDetails/:id-:name", async (req, res) => {
        const { id, name } = req.params;
    
        try {
            const game = await prisma.games.findUnique({
                where: { id: parseInt(id) },
            });
    
            if (!game || game.name !== name) {
                return res.status(404).send("Jeu non trouvé");
            }
    
            res.render("gameDetails", { game });
        } catch (error) {
            console.error("Erreur de récupération des détails du jeu:", error);
            res.status(500).send("Erreur de serveur");
        }
    });

    app.get("/editorDetails/:id-:name", async (req, res) => {
        const { id, name } = req.params;
        try {
            const games = await prisma.games.findMany({
                where: { editor: name },
            });
            const editor = await prisma.editors.findUnique({
                where: { id: parseInt(id) }
            });
        if (!games || games.length === 0) {
            return res.status(404).send("Aucun jeu trouvé pour cet éditeur");
        }
    
            res.render("editorDetails", { games, editor });
        } catch (error) {
            console.error("Erreur de récupération des détails de l'éditeur:", error);
            res.status(500).send("Erreur de serveur");
        }
    });

    app.get("/genreDetails/:id-:genre", async (req, res) => {
        const { id, genreName } = req.params;
        try {
            const games = await prisma.games.findMany({
                where: { genre: genreName },
            });
            const genre = await prisma.genres.findUnique({
                where: { id: parseInt(id) }
            });
        if (!games || games.length === 0) {
            return res.status(404).send("Aucun jeu trouvé pour ce genre");
        }
    
            res.render("genreDetails", { games, genre });
        } catch (error) {
            console.error("Erreur de récupération des détails du genre:", error);
            res.status(500).send("Erreur de serveur");
        }
    });

    app.get("/genreList", async (req, res) => {
        try {
            const genres = await prisma.genres.findMany({
                select: { id: true, genre: true },
                orderBy: { genre: "asc" } // Trie par ordre alphabétique
            });
            res.render("genreList", { genres });
        } catch (error) {
            console.error("Erreur de récupération des genres:", error);
            res.status(500).send("Erreur de serveur");
        }
    });

    app.post("/deleteGame/:id", async (req, res) => {
        const { id } = req.params;
    
        try {
            await prisma.games.delete({
                where: { id: parseInt(id) }
            });
            res.redirect("/gameList"); // Redirection après suppression
        } catch (error) {
            console.error("Erreur lors de la suppression du jeu:", error);
            res.status(500).send("Erreur de serveur");
        }
    });

    app.post("/deleteEditor/:id-:name", async (req, res) => {
        const { id, name } = req.params;
    
        try {
            await prisma.games.deleteMany({
                where: { editor: name }
            });
            await prisma.editors.delete({
                where: { id: parseInt(id) }
            });
            res.redirect("/EditorList"); // Redirection après suppression
        } catch (error) {
            console.error("Erreur lors de la suppression de l'éditeur:", error);
            res.status(500).send("Erreur de serveur");
        }
    });


    app.get("/modifyGame/:id-:name", async (req, res) => {
        const { id, name } = req.params;
        try {
            const game = await prisma.games.findUnique({
                where: { id: parseInt(id) }
            });
    
            if (!game || game.name !== name) {
                return res.status(404).send("Jeu non trouvé");
            }
            // Requêtes simultanées pour les genres et les éditeurs
            const [genres, editors] = await Promise.all([
                prisma.genres.findMany(),
                prisma.editors.findMany()
            ]);
    
            // Rendu du formulaire avec les deux listes
            res.render("modifyGame", { genres, editors, game });
        } catch (error) {   
            console.error("Erreur de récupération des données:", error);
            res.status(500).send("Erreur de serveur");
        }
    });

    app.post("/modifyGame/:id", async (req, res) => {
        const { id } = req.params;
        let { name, description, releaseDate, genre, editor } = req.body;

        if (!description) 
            description = "Sans description";

        try {
            await prisma.games.update({
                where: { id: parseInt(id) },
                data: {
                    name,
                    description,
                    releaseDate,
                    genre,
                    editor,
                },
            });
            res.status(201).redirect("/gameList"); // On redirige vers la page des tâches
        } catch (error) {
            console.error(error);
            res.status(400).json({ error: "Game creation failed" });
        }
    });


    app.get("/modifyEditor/:id-:name", async (req, res) => {
        const { id, name } = req.params;
        try {
            const editor = await prisma.editors.findUnique({
                where: { id: parseInt(id) }
            });
    
            if (!editor || editor.editorName !== name) {
                return res.status(404).send("Jeu non trouvé");
            }


            res.render("modifyEditor", { editor });
        } catch (error) {   
            console.error("Erreur de récupération des données:", error);
            res.status(500).send("Erreur de serveur");
        }
    });

    app.post("/modifyEditor/:id", async (req, res) => {
        const { id } = req.params;
        let { editorName } = req.body;

        try {

            const editor = await prisma.editors.findUnique({
                where: { id: parseInt(id) },
            });

            await prisma.editors.update({
                where: { id: parseInt(id) },
                data: {
                    editorName,
                },
            });
            await prisma.games.updateMany({
                where: { editor: editor.editorName },
                data: {
                    editor: editorName,
                },
            });
            res.status(201).redirect("/editorList");
        } catch (error) {
            console.error(error);
            res.status(400).json({ error: "Game creation failed" });
        }
    });


    app.post("/toggleHomepage/:id", async (req, res) => {
        const { id } = req.params;
    
        try {
            // Récupérer le jeu actuel
            const game = await prisma.games.findUnique({
                where: { id: parseInt(id) },
            });
    
            if (!game) {
                return res.status(404).send("Jeu non trouvé");
            }
    
            // Basculer la valeur du booléen
            await prisma.games.update({
                where: { id: parseInt(id) },
                data: { appearHomepage: !game.appearHomepage },
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