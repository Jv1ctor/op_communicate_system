/*
  Warnings:

  - You are about to drop the column `installation_unit` on the `products` table. All the data in the column will be lost.
  - You are about to drop the `acess_token` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[name_reactor]` on the table `reactors` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `created_at` to the `products` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "acess_token" DROP CONSTRAINT "acess_token_fk";

-- AlterTable
ALTER TABLE "products" DROP COLUMN "installation_unit",
ADD COLUMN     "created_at" TIMESTAMP NOT NULL;

-- DropTable
DROP TABLE "acess_token";

-- CreateTable
CREATE TABLE "access_token" (
    "id" VARCHAR NOT NULL,
    "expires_in" INTEGER NOT NULL,
    "refresh_token_id" VARCHAR NOT NULL,

    CONSTRAINT "access_token_pk" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "access_token_un" ON "access_token"("refresh_token_id");

-- CreateIndex
CREATE UNIQUE INDEX "reactors_un" ON "reactors"("name_reactor");

-- AddForeignKey
ALTER TABLE "access_token" ADD CONSTRAINT "access_token_fk" FOREIGN KEY ("refresh_token_id") REFERENCES "refresh_token"("id") ON DELETE CASCADE ON UPDATE CASCADE;
