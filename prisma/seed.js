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

main(e => {
    console.log(e);
    process.exit(1)
}).finally(() => {
    prisma.$disconnect();
})