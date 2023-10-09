-- CreateTable
CREATE TABLE "analisys" (
    "analisys_id" VARCHAR NOT NULL,
    "adjustment" TEXT NOT NULL,
    "fk_product" VARCHAR NOT NULL,
    "fk_user_cq" VARCHAR NOT NULL,

    CONSTRAINT "analisys_pk" PRIMARY KEY ("analisys_id")
);

-- CreateTable
CREATE TABLE "products" (
    "product_id" VARCHAR NOT NULL,
    "name_product" VARCHAR NOT NULL,
    "quant_produce" DOUBLE PRECISION NOT NULL,
    "reactor" VARCHAR NOT NULL,
    "operator" VARCHAR NOT NULL,
    "installation_unit" VARCHAR NOT NULL,
    "num_op" INTEGER NOT NULL,
    "num_batch" INTEGER NOT NULL,
    "num_roadmap" INTEGER NOT NULL,
    "turn_supervisor" VARCHAR NOT NULL,
    "turn" CHAR(1) NOT NULL,
    "fk_reactor" VARCHAR NOT NULL,
    "fk_user_prod" VARCHAR NOT NULL,

    CONSTRAINT "products_pk" PRIMARY KEY ("product_id")
);

-- CreateTable
CREATE TABLE "reactors" (
    "id_reactor" VARCHAR NOT NULL,
    "name_reactor" VARCHAR NOT NULL,
    "fk_user_adm" VARCHAR NOT NULL,

    CONSTRAINT "reactors_pk" PRIMARY KEY ("id_reactor")
);

-- CreateTable
CREATE TABLE "refresh_token" (
    "id" VARCHAR NOT NULL,
    "expires_in" INTEGER NOT NULL,
    "fk_user_id" VARCHAR NOT NULL,

    CONSTRAINT "refresh_token_pk" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_adm" (
    "fk_id_user_adm" VARCHAR NOT NULL,

    CONSTRAINT "user_adm_pk" PRIMARY KEY ("fk_id_user_adm")
);

-- CreateTable
CREATE TABLE "user_cq" (
    "fk_id_user_cq" VARCHAR NOT NULL,

    CONSTRAINT "user_cq_pk" PRIMARY KEY ("fk_id_user_cq")
);

-- CreateTable
CREATE TABLE "user_prod" (
    "fk_id_user_prod" VARCHAR NOT NULL,

    CONSTRAINT "user_prod_pk" PRIMARY KEY ("fk_id_user_prod")
);

-- CreateTable
CREATE TABLE "users" (
    "id" VARCHAR NOT NULL,
    "first_name" VARCHAR NOT NULL,
    "last_name" VARCHAR NOT NULL,
    "password" VARCHAR NOT NULL,

    CONSTRAINT "users_pk" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "refresh_token_un" ON "refresh_token"("fk_user_id");

-- AddForeignKey
ALTER TABLE "analisys" ADD CONSTRAINT "analisys_fk" FOREIGN KEY ("fk_product") REFERENCES "products"("product_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "analisys" ADD CONSTRAINT "analisys_user_fk" FOREIGN KEY ("fk_user_cq") REFERENCES "user_cq"("fk_id_user_cq") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_fk" FOREIGN KEY ("fk_reactor") REFERENCES "reactors"("id_reactor") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_user_fk" FOREIGN KEY ("fk_user_prod") REFERENCES "user_prod"("fk_id_user_prod") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "reactors" ADD CONSTRAINT "reactors_fk" FOREIGN KEY ("fk_user_adm") REFERENCES "user_adm"("fk_id_user_adm") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "refresh_token" ADD CONSTRAINT "refresh_token_fk" FOREIGN KEY ("fk_user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_adm" ADD CONSTRAINT "user_adm_fk" FOREIGN KEY ("fk_id_user_adm") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "user_cq" ADD CONSTRAINT "user_cq_fk" FOREIGN KEY ("fk_id_user_cq") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_prod" ADD CONSTRAINT "user_prod_fk" FOREIGN KEY ("fk_id_user_prod") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
