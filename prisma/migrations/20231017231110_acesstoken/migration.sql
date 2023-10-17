-- CreateTable
CREATE TABLE "acess_token" (
    "id" VARCHAR NOT NULL,
    "expires_in" INTEGER NOT NULL,
    "refresh_token_id" VARCHAR NOT NULL,

    CONSTRAINT "acess_token_pk" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "acess_token_un" ON "acess_token"("refresh_token_id");

-- AddForeignKey
ALTER TABLE "acess_token" ADD CONSTRAINT "acess_token_fk" FOREIGN KEY ("refresh_token_id") REFERENCES "refresh_token"("id") ON DELETE CASCADE ON UPDATE CASCADE;
