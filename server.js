    const express = require("express");
    const { PrismaClient } = require("@prisma/client");
    const bodyParser = require("body-parser");
    const path = require("path");

    const app = express();
    const prisma = new PrismaClient();
    const PORT = 3000;

    // On définit un middleware pour parser les données des requêtes entrantes.
    // Cela permet de récupérer les données envoyées via des formulaires et les rendre disponibles dans req.body.
    app.use(bodyParser.urlencoded({ extended: true }));
    app.get("/", (req, res) => {
        res.sendFile(path.join(__dirname,"public", "addGame.html"));;
    });
    app.get("/addGame", async (req, res) => {
        const game = await prisma.games.findMany();
        res.json(game);
    });

    app.post("/addGame", async (req, res) => {
        console.log("SALUT")
        const { name } = req.body;
        try {
            await prisma.games.create({
                data: { name },
            }); // Ici on ne stock pas le retour de la requête, mais on attend quand même son exécution
            res.status(201).redirect("/addGame"); // On redirige vers la page des tâches
        } catch (error) {
            console.error(error);
            res.status(400).json({ error: "Game creation failed" });
        }
    });

    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });