/*
  Warnings:

  - You are about to drop the column `description` on the `Games` table. All the data in the column will be lost.
  - You are about to drop the column `editor` on the `Games` table. All the data in the column will be lost.
  - You are about to drop the column `genre` on the `Games` table. All the data in the column will be lost.
  - You are about to drop the column `releaseDate` on the `Games` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Games" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL
);
INSERT INTO "new_Games" ("id", "name") SELECT "id", "name" FROM "Games";
DROP TABLE "Games";
ALTER TABLE "new_Games" RENAME TO "Games";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
