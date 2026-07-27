-- DropIndex
DROP INDEX "User_password_key";

-- AlterTable
ALTER TABLE "Account" ALTER COLUMN "access_token" DROP NOT NULL,
ALTER COLUMN "refresh_token" DROP NOT NULL;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "password" DROP NOT NULL;
