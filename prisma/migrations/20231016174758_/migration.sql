-- DropForeignKey
ALTER TABLE "refresh_token" DROP CONSTRAINT "refresh_token_fk";

-- AddForeignKey
ALTER TABLE "refresh_token" ADD CONSTRAINT "refresh_token_fk" FOREIGN KEY ("fk_user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
