/*
  Warnings:

  - You are about to drop the column `title` on the `VideoGame` table. All the data in the column will be lost.
  - Added the required column `name` to the `VideoGame` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "GameGenre" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "genre" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Editor" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "editorName" TEXT NOT NULL
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_VideoGame" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "releaseDate" TEXT NOT NULL,
    "genre" TEXT NOT NULL,
    "editor" TEXT NOT NULL
);
INSERT INTO "new_VideoGame" ("description", "editor", "genre", "id", "releaseDate") SELECT "description", "editor", "genre", "id", "releaseDate" FROM "VideoGame";
DROP TABLE "VideoGame";
ALTER TABLE "new_VideoGame" RENAME TO "VideoGame";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
