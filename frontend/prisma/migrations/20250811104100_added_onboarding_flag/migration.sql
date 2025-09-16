-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "onboarded" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "profilePictureUrl" TEXT;
