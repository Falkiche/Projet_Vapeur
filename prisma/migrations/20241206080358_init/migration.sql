-- CreateTable
CREATE TABLE "Games" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL
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
