/*
  Warnings:

  - You are about to drop the `Editor` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `GameGenre` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `VideoGame` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Editor";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "GameGenre";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "VideoGame";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "Games" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "releaseDate" TEXT NOT NULL,
    "genre" TEXT NOT NULL,
    "editor" TEXT NOT NULL
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
