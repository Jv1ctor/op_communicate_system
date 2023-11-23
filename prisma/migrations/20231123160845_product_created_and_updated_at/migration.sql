/*
  Warnings:

  - You are about to drop the `analisys` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "analisys" DROP CONSTRAINT "analisys_fk";

-- DropForeignKey
ALTER TABLE "analisys" DROP CONSTRAINT "analisys_user_fk";

-- AlterTable
ALTER TABLE "products" ADD COLUMN     "status" VARCHAR NOT NULL DEFAULT 'andamento',
ADD COLUMN     "updated_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP;

-- DropTable
DROP TABLE "analisys";

-- CreateTable
CREATE TABLE "analysis" (
    "analysis_id" VARCHAR NOT NULL,
    "adjustment" TEXT NOT NULL,
    "count" INTEGER NOT NULL,
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fk_product" VARCHAR NOT NULL,
    "fk_user_cq" VARCHAR NOT NULL,

    CONSTRAINT "analysis_pk" PRIMARY KEY ("analysis_id")
);

-- AddForeignKey
ALTER TABLE "analysis" ADD CONSTRAINT "analysis_fk" FOREIGN KEY ("fk_product") REFERENCES "products"("product_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "analysis" ADD CONSTRAINT "analysis_user_fk" FOREIGN KEY ("fk_user_cq") REFERENCES "user_cq"("fk_id_user_cq") ON DELETE NO ACTION ON UPDATE NO ACTION;
