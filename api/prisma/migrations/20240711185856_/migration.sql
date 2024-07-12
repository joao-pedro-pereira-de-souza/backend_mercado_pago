-- CreateTable
CREATE TABLE "Client" (
    "id" TEXT NOT NULL,
    "cpf" TEXT NOT NULL,
    "id_user" TEXT NOT NULL,

    CONSTRAINT "Client_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Client_id_key" ON "Client"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Client_cpf_key" ON "Client"("cpf");

-- CreateIndex
CREATE UNIQUE INDEX "Client_id_user_key" ON "Client"("id_user");

-- AddForeignKey
ALTER TABLE "Client" ADD CONSTRAINT "Client_id_user_fkey" FOREIGN KEY ("id_user") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
