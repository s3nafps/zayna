-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "OrderSource" AS ENUM ('STOREFRONT', 'SHOPIFY_THEME', 'MANUAL', 'FACEBOOK', 'INSTAGRAM');

-- CreateEnum
CREATE TYPE "DeliveryType" AS ENUM ('HOME', 'STOPDESK');

-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('NEW', 'CONFIRMED', 'UNREACHABLE', 'CANCELLED', 'PREPARING', 'SHIPPED', 'IN_TRANSIT', 'OUT_FOR_DELIVERY', 'AT_STOPDESK', 'DELIVERED', 'COD_SETTLED', 'RETURNED', 'FAILED');

-- CreateEnum
CREATE TYPE "CarrierType" AS ENUM ('YALIDINE', 'GUEPEX', 'ZR_EXPRESS', 'PROCOLIS', 'ECOTRACK', 'MAYSTRO', 'NOEST', 'CUSTOM');

-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('OWNER', 'AGENT');

-- CreateEnum
CREATE TYPE "OrderEventKind" AS ENUM ('STATUS_CHANGE', 'CALL_ATTEMPT', 'NOTE', 'CARRIER_UPDATE', 'SHOPIFY_SYNC');

-- CreateEnum
CREATE TYPE "ActorType" AS ENUM ('USER', 'SYSTEM', 'SHOPIFY', 'CARRIER');

-- CreateTable
CREATE TABLE "Wilaya" (
    "code" CHAR(2) NOT NULL,
    "nameFr" TEXT NOT NULL,
    "nameAr" TEXT NOT NULL,
    "zone" TEXT,

    CONSTRAINT "Wilaya_pkey" PRIMARY KEY ("code")
);

-- CreateTable
CREATE TABLE "Commune" (
    "id" SERIAL NOT NULL,
    "wilayaCode" CHAR(2) NOT NULL,
    "nameFr" TEXT NOT NULL,
    "nameAr" TEXT NOT NULL,
    "postalCode" TEXT,

    CONSTRAINT "Commune_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Carrier" (
    "id" TEXT NOT NULL,
    "type" "CarrierType" NOT NULL,
    "displayName" TEXT NOT NULL,
    "credentials" JSONB,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "isEnabled" BOOLEAN NOT NULL DEFAULT false,
    "autoSync" BOOLEAN NOT NULL DEFAULT false,
    "lastTestAt" TIMESTAMP(3),
    "lastTestOk" BOOLEAN,
    "webhookSecret" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Carrier_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StopDesk" (
    "id" TEXT NOT NULL,
    "carrierId" TEXT NOT NULL,
    "communeId" INTEGER,
    "externalId" TEXT,
    "name" TEXT NOT NULL,
    "address" TEXT,

    CONSTRAINT "StopDesk_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ShippingRate" (
    "id" TEXT NOT NULL,
    "carrierId" TEXT NOT NULL,
    "wilayaCode" CHAR(2) NOT NULL,
    "homePrice" INTEGER NOT NULL,
    "deskPrice" INTEGER NOT NULL,
    "isEnabled" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "ShippingRate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Order" (
    "id" TEXT NOT NULL,
    "shopifyOrderId" TEXT,
    "number" TEXT NOT NULL,
    "source" "OrderSource" NOT NULL,
    "customerName" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "secondaryPhone" TEXT,
    "wilayaCode" CHAR(2) NOT NULL,
    "communeId" INTEGER,
    "address" TEXT,
    "deliveryType" "DeliveryType" NOT NULL,
    "stopDeskId" TEXT,
    "items" JSONB NOT NULL,
    "subtotal" INTEGER NOT NULL,
    "shippingFee" INTEGER NOT NULL,
    "total" INTEGER NOT NULL,
    "status" "OrderStatus" NOT NULL DEFAULT 'NEW',
    "confirmationAttempts" INTEGER NOT NULL DEFAULT 0,
    "notes" TEXT,
    "carrierId" TEXT,
    "trackingNumber" TEXT,
    "labelUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrderEvent" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "kind" "OrderEventKind" NOT NULL,
    "fromStatus" "OrderStatus",
    "toStatus" "OrderStatus",
    "actorType" "ActorType" NOT NULL,
    "actorUserId" TEXT,
    "message" TEXT,
    "meta" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "OrderEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Shipment" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "carrierId" TEXT NOT NULL,
    "externalId" TEXT,
    "tracking" TEXT,
    "rawStatus" TEXT,
    "mappedStatus" "OrderStatus",
    "history" JSONB,
    "codAmount" INTEGER NOT NULL,
    "codCollected" INTEGER,
    "codSettledAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Shipment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PhoneReputation" (
    "phone" TEXT NOT NULL,
    "ordersCount" INTEGER NOT NULL DEFAULT 0,
    "deliveredCount" INTEGER NOT NULL DEFAULT 0,
    "returnedCount" INTEGER NOT NULL DEFAULT 0,
    "isBlocked" BOOLEAN NOT NULL DEFAULT false,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PhoneReputation_pkey" PRIMARY KEY ("phone")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'AGENT',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Commune_wilayaCode_idx" ON "Commune"("wilayaCode");

-- CreateIndex
CREATE UNIQUE INDEX "Commune_wilayaCode_nameFr_key" ON "Commune"("wilayaCode", "nameFr");

-- CreateIndex
CREATE UNIQUE INDEX "StopDesk_carrierId_externalId_key" ON "StopDesk"("carrierId", "externalId");

-- CreateIndex
CREATE UNIQUE INDEX "ShippingRate_carrierId_wilayaCode_key" ON "ShippingRate"("carrierId", "wilayaCode");

-- CreateIndex
CREATE UNIQUE INDEX "Order_shopifyOrderId_key" ON "Order"("shopifyOrderId");

-- CreateIndex
CREATE UNIQUE INDEX "Order_number_key" ON "Order"("number");

-- CreateIndex
CREATE INDEX "Order_status_idx" ON "Order"("status");

-- CreateIndex
CREATE INDEX "Order_phone_idx" ON "Order"("phone");

-- CreateIndex
CREATE INDEX "Order_createdAt_idx" ON "Order"("createdAt");

-- CreateIndex
CREATE INDEX "OrderEvent_orderId_createdAt_idx" ON "OrderEvent"("orderId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "Shipment_carrierId_externalId_key" ON "Shipment"("carrierId", "externalId");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "Commune" ADD CONSTRAINT "Commune_wilayaCode_fkey" FOREIGN KEY ("wilayaCode") REFERENCES "Wilaya"("code") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StopDesk" ADD CONSTRAINT "StopDesk_carrierId_fkey" FOREIGN KEY ("carrierId") REFERENCES "Carrier"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StopDesk" ADD CONSTRAINT "StopDesk_communeId_fkey" FOREIGN KEY ("communeId") REFERENCES "Commune"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShippingRate" ADD CONSTRAINT "ShippingRate_carrierId_fkey" FOREIGN KEY ("carrierId") REFERENCES "Carrier"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShippingRate" ADD CONSTRAINT "ShippingRate_wilayaCode_fkey" FOREIGN KEY ("wilayaCode") REFERENCES "Wilaya"("code") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_wilayaCode_fkey" FOREIGN KEY ("wilayaCode") REFERENCES "Wilaya"("code") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_communeId_fkey" FOREIGN KEY ("communeId") REFERENCES "Commune"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_stopDeskId_fkey" FOREIGN KEY ("stopDeskId") REFERENCES "StopDesk"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_carrierId_fkey" FOREIGN KEY ("carrierId") REFERENCES "Carrier"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderEvent" ADD CONSTRAINT "OrderEvent_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderEvent" ADD CONSTRAINT "OrderEvent_actorUserId_fkey" FOREIGN KEY ("actorUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Shipment" ADD CONSTRAINT "Shipment_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Shipment" ADD CONSTRAINT "Shipment_carrierId_fkey" FOREIGN KEY ("carrierId") REFERENCES "Carrier"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

