-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "v2_user_role" AS ENUM ('ADMIN', 'ANALYST');

-- CreateTable
CREATE TABLE "v2_users" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "role" "v2_user_role" NOT NULL DEFAULT 'ANALYST',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "lastLoginAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "v2_users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "v2_sessions" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "v2_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "v2_users_username_key" ON "v2_users"("username");

-- CreateIndex
CREATE INDEX "v2_users_role_idx" ON "v2_users"("role");

-- CreateIndex
CREATE UNIQUE INDEX "v2_sessions_tokenHash_key" ON "v2_sessions"("tokenHash");

-- CreateIndex
CREATE INDEX "v2_sessions_userId_idx" ON "v2_sessions"("userId");

-- CreateIndex
CREATE INDEX "v2_sessions_expiresAt_idx" ON "v2_sessions"("expiresAt");

-- AddForeignKey
ALTER TABLE "v2_sessions" ADD CONSTRAINT "v2_sessions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "v2_users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

