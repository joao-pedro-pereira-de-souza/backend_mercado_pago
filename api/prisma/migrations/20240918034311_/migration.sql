-- CreateEnum
CREATE TYPE "StatusPayment" AS ENUM ('approved', 'rejected', 'pending');

-- CreateTable
CREATE TABLE "orders" (
    "id" TEXT NOT NULL,
    "status" "StatusPayment" NOT NULL,
    "amount" INTEGER NOT NULL,
    "payment_method" TEXT NOT NULL,
    "id_product" TEXT NOT NULL,
    "id_product_been" TEXT,
    "id_user" TEXT NOT NULL,

    CONSTRAINT "orders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "orders_details" (
    "id" TEXT NOT NULL,
    "id_order" TEXT NOT NULL,
    "json_response_gateway" JSONB NOT NULL,

    CONSTRAINT "orders_details_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "logs_payment" (
    "id" TEXT NOT NULL,
    "status" "StatusPayment" NOT NULL,
    "message" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id_user" TEXT,

    CONSTRAINT "logs_payment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "orders_id_key" ON "orders"("id");

-- CreateIndex
CREATE UNIQUE INDEX "orders_details_id_key" ON "orders_details"("id");

-- CreateIndex
CREATE UNIQUE INDEX "orders_details_id_order_key" ON "orders_details"("id_order");

-- CreateIndex
CREATE UNIQUE INDEX "logs_payment_id_key" ON "logs_payment"("id");

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_id_user_fkey" FOREIGN KEY ("id_user") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_id_product_fkey" FOREIGN KEY ("id_product") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_id_product_been_fkey" FOREIGN KEY ("id_product_been") REFERENCES "products_bee"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders_details" ADD CONSTRAINT "orders_details_id_order_fkey" FOREIGN KEY ("id_order") REFERENCES "orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "logs_payment" ADD CONSTRAINT "logs_payment_id_user_fkey" FOREIGN KEY ("id_user") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
