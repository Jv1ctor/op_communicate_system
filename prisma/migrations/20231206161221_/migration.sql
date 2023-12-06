-- AlterTable
ALTER TABLE "analysis" ADD COLUMN     "checked" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "products" ADD COLUMN     "analyst_name" VARCHAR NOT NULL DEFAULT 'none';
