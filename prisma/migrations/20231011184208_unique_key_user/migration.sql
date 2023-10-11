/*
  Warnings:

  - A unique constraint covering the columns `[last_name]` on the table `users` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "users_last_name_un" ON "users"("last_name");
