// Ce fichier permet de créer des données dites "seed",
// c'est-à-dire des données déjà inscrites à la création de la BDD.

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const genres = [
  "Action",
  "Aventure",
  "RPG",
  "Simulation",
  "Sport",
  "MMORPG"
];

async function main() {
for (let genre of genres) {
    await prisma.genres.create({
        data: { genre }
    })
}}

// Récupération des erreurs liées à la fonction main

main(e => {
    console.log(e);
    process.exit(1)
}).finally(() => {
    prisma.$disconnect();
})