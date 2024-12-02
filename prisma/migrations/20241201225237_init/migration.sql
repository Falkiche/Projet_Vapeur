/*
  Warnings:

  - You are about to drop the column `createdAt` on the `VideoGame` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_VideoGame" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "releaseDate" TEXT NOT NULL,
    "genre" TEXT NOT NULL,
    "editor" TEXT NOT NULL
);
INSERT INTO "new_VideoGame" ("description", "editor", "genre", "id", "releaseDate", "title") SELECT "description", "editor", "genre", "id", "releaseDate", "title" FROM "VideoGame";
DROP TABLE "VideoGame";
ALTER TABLE "new_VideoGame" RENAME TO "VideoGame";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
