/*
  Warnings:

  - The primary key for the `analisys` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `analisys_id` on the `analisys` table. All the data in the column will be lost.
  - The required column `analysis_id` was added to the `analisys` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- AlterTable
ALTER TABLE "analisys" DROP CONSTRAINT "analisys_pk",
RENAME CONSTRAINT "analisys_pk" TO "analysis_pk",
DROP COLUMN "analisys_id",
ADD COLUMN     "analysis_id" VARCHAR NOT NULL,
ADD COLUMN     "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD CONSTRAINT "analysis_pk" PRIMARY KEY ("analysis_id");

-- AlterTable
ALTER TABLE "products" ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP;

-- RenameForeignKey
ALTER TABLE "analisys" RENAME CONSTRAINT "analisys_fk" TO "analysis_fk";

-- RenameForeignKey
ALTER TABLE "analisys" RENAME CONSTRAINT "analisys_user_fk" TO "analysis_user_fk";
