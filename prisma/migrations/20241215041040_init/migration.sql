-- CreateTable
CREATE TABLE "Games" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "releaseDate" TEXT NOT NULL,
    "genre" TEXT NOT NULL,
    "editor" TEXT NOT NULL,
    "appearHomepage" BOOLEAN NOT NULL DEFAULT false
);

-- CreateTable
CREATE TABLE "Genres" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "genre" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Editors" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "editorName" TEXT NOT NULL
);
