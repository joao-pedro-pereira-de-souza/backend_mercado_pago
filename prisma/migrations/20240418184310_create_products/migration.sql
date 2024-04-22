-- CreateTable
CREATE TABLE "products" (
    "id" TEXT NOT NULL,
    "title" TEXT,
    "description" TEXT,
    "type" TEXT NOT NULL,
    "image" TEXT,
    "value" DOUBLE PRECISION,
    "id_item_mercado_pago" TEXT,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "products_honey_pot" (
    "id" TEXT NOT NULL,
    "value_ml" DOUBLE PRECISION NOT NULL,
    "minimum_ml" DOUBLE PRECISION NOT NULL,
    "maximum_ml" DOUBLE PRECISION NOT NULL,
    "id_product" TEXT NOT NULL,

    CONSTRAINT "products_honey_pot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "products_bee" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,
    "id_product" TEXT NOT NULL,

    CONSTRAINT "products_bee_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "products_id_key" ON "products"("id");

-- CreateIndex
CREATE UNIQUE INDEX "products_honey_pot_id_key" ON "products_honey_pot"("id");

-- CreateIndex
CREATE UNIQUE INDEX "products_honey_pot_id_product_key" ON "products_honey_pot"("id_product");

-- CreateIndex
CREATE UNIQUE INDEX "products_bee_id_key" ON "products_bee"("id");

-- AddForeignKey
ALTER TABLE "products_honey_pot" ADD CONSTRAINT "products_honey_pot_id_product_fkey" FOREIGN KEY ("id_product") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "products_bee" ADD CONSTRAINT "products_bee_id_product_fkey" FOREIGN KEY ("id_product") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
