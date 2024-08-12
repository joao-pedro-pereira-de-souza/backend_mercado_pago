/*
  Warnings:

  - You are about to drop the `Client` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Client" DROP CONSTRAINT "Client_id_user_fkey";

-- DropTable
DROP TABLE "Client";

-- CreateTable
CREATE TABLE "clients" (
    "id" TEXT NOT NULL,
    "cpf" TEXT NOT NULL,
    "id_user" TEXT NOT NULL,

    CONSTRAINT "clients_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "clients_id_key" ON "clients"("id");

-- CreateIndex
CREATE UNIQUE INDEX "clients_cpf_key" ON "clients"("cpf");

-- CreateIndex
CREATE UNIQUE INDEX "clients_id_user_key" ON "clients"("id_user");

-- AddForeignKey
ALTER TABLE "clients" ADD CONSTRAINT "clients_id_user_fkey" FOREIGN KEY ("id_user") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
