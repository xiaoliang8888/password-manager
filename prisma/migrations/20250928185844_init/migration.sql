-- CreateTable
CREATE TABLE "public"."PasswordEntry" (
    "id" TEXT NOT NULL,
    "website" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PasswordEntry_pkey" PRIMARY KEY ("id")
);
