-- ============================================================================
-- MIGRATION: 20261012000000_init_ravis_crm
-- PostgreSQL Database Initialization for Ravi's CRM
-- Architecture: Luxury Menswear, Curated Conditional Box & Smart Omnichannel
-- Canoinhas, Santa Catarina - Brasil
-- ============================================================================

-- Habilitar extensão pgcrypto para geração nativa de UUIDs
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================================
-- 1. CRIAÇÃO DOS TIPOS ENUMERADOS (ENUMS)
-- ============================================================================

CREATE TYPE "Role" AS ENUM (
    'ADMIN',
    'CURADOR',
    'ATENDENTE'
);

CREATE TYPE "FitPreference" AS ENUM (
    'SLIM_FIT',
    'REGULAR_FIT',
    'ALFAIATARIA_MODERNA',
    'LONGLINE',
    'OVERSIZED'
);

CREATE TYPE "ConditionalStatus" AS ENUM (
    'CRIADO',
    'EM_PREPARACAO',
    'ENVIADO',
    'EM_TESTE',
    'FINALIZADO',
    'CANCELADO',
    'VENCIDO'
);

CREATE TYPE "ConditionalItemStatus" AS ENUM (
    'EM_EXPERIMENTACAO',
    'COMPRADO',
    'DEVOLVIDO'
);

CREATE TYPE "OrderChannel" AS ENUM (
    'ONLINE_WHATSAPP',
    'PDV_FISICO_CANOINHAS',
    'ECOMMERCE'
);

CREATE TYPE "OrderStatus" AS ENUM (
    'PENDENTE',
    'PAGO',
    'EM_SEPARACAO',
    'ENVIADO',
    'ENTREGUE',
    'CANCELADO'
);

CREATE TYPE "PaymentMethod" AS ENUM (
    'PIX',
    'CARTAO_CREDITO',
    'CARTAO_DEBITO',
    'DINHEIRO',
    'LINK_MERCADO_PAGO',
    'LINK_STRIPE'
);

CREATE TYPE "PaymentStatus" AS ENUM (
    'PENDENTE',
    'APROVADO',
    'RECUSADO',
    'ESTORNADO'
);

CREATE TYPE "Channel" AS ENUM (
    'WHATSAPP',
    'INSTAGRAM',
    'EMAIL'
);

CREATE TYPE "ConversationStatus" AS ENUM (
    'ABERTO',
    'EM_ATENDIMENTO',
    'AGUARDANDO_CLIENTE',
    'RESOLVIDO',
    'ARQUIVADO'
);

CREATE TYPE "SenderType" AS ENUM (
    'CLIENT',
    'CURATOR',
    'BOT_AUTOMATION'
);

CREATE TYPE "MessageStatus" AS ENUM (
    'ENVIADO',
    'ENTREGUE',
    'LIDO',
    'FALHA'
);

CREATE TYPE "InteractionType" AS ENUM (
    'WHATSAPP',
    'INSTAGRAM',
    'EMAIL',
    'CONDICIONAL',
    'VISITA_LOJA',
    'PAGAMENTO',
    'NOTA_CURADOR',
    'CHAMADA_TELEFONICA'
);

CREATE TYPE "InventoryMovementType" AS ENUM (
    'ENTRADA',
    'SAIDA_VENDA',
    'RESERVA_CONDICIONAL',
    'LIBERACAO_CONDICIONAL',
    'AJUSTE_BALANCO',
    'DEVOLUCAO'
);

CREATE TYPE "CampaignStatus" AS ENUM (
    'RASCUNHO',
    'AGENDADA',
    'EM_DISPARO',
    'CONCLUIDA',
    'CANCELADA'
);

CREATE TYPE "RecipientStatus" AS ENUM (
    'FILA',
    'ENVIADO',
    'ENTREGUE',
    'LIDO',
    'RESPONDEU',
    'CONVERTEU',
    'FALHA',
    'OPT_OUT'
);

CREATE TYPE "WishlistStatus" AS ENUM (
    'DESEJADO',
    'NOTIFICADO',
    'DISPONIVEL',
    'ATENDIDO',
    'EXPIRADO'
);

CREATE TYPE "LgpdConsentStatus" AS ENUM (
    'OPT_IN',
    'PENDENTE',
    'OPT_OUT'
);

-- ============================================================================
-- 2. CRIAÇÃO DAS TABELAS
-- ============================================================================

-- ----------------------------------------------------------------------------
-- TABELA: "User" (Controle de Acesso RBAC)
-- ----------------------------------------------------------------------------
CREATE TABLE "User" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "passwordHash" VARCHAR(255),
    "phone" VARCHAR(50),
    "role" "Role" NOT NULL DEFAULT 'CURADOR',
    "avatarUrl" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "commissionRate" DECIMAL(5, 4) NOT NULL DEFAULT 0.0500,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- ----------------------------------------------------------------------------
-- TABELA: "Customer" [SEGMENTAÇÃO DE CLIENTES]
-- Base do CRM 360°, indexada por telefone e instagram para identificação instantânea
-- ----------------------------------------------------------------------------
CREATE TABLE "Customer" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" VARCHAR(255) NOT NULL,
    "phone" VARCHAR(50) NOT NULL,
    "email" VARCHAR(255),
    "instagram" VARCHAR(100),
    "city" VARCHAR(100) NOT NULL DEFAULT 'Canoinhas',
    "neighborhood" VARCHAR(100),
    "address" TEXT,
    "tier" VARCHAR(50) NOT NULL DEFAULT 'VIP Ouro',
    "lgpdConsent" "LgpdConsentStatus" NOT NULL DEFAULT 'OPT_IN',
    "lgpdConsentDate" TIMESTAMP(3),
    "birthDate" TIMESTAMP(3),
    "lastPurchaseDate" TIMESTAMP(3),
    "curatorId" UUID,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Customer_pkey" PRIMARY KEY ("id")
);

-- ----------------------------------------------------------------------------
-- TABELA: "StyleProfile" [SEGMENTAÇÃO DE CLIENTES]
-- Perfil Antropométrico e DNA Estético do cliente para curadoria personalizada
-- ----------------------------------------------------------------------------
CREATE TABLE "StyleProfile" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "customerId" UUID NOT NULL,
    "shirtSize" VARCHAR(10) NOT NULL,
    "pantsSize" VARCHAR(10) NOT NULL,
    "shoesSize" VARCHAR(10),
    "fitPreference" "FitPreference" NOT NULL DEFAULT 'SLIM_FIT',
    "heightCm" INTEGER,
    "weightKg" INTEGER,
    "colorPalette" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
    "favoriteCategories" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
    "avoidItems" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
    "lifestyle" TEXT,
    "profession" VARCHAR(255),
    "curatorObservations" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "StyleProfile_pkey" PRIMARY KEY ("id")
);

-- ----------------------------------------------------------------------------
-- TABELA: "Tag" [SEGMENTAÇÃO DE CLIENTES]
-- ----------------------------------------------------------------------------
CREATE TABLE "Tag" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" VARCHAR(100) NOT NULL,
    "category" VARCHAR(50) NOT NULL DEFAULT 'ESTILO',
    "color" VARCHAR(20) NOT NULL DEFAULT '#D4AF37',
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Tag_pkey" PRIMARY KEY ("id")
);

-- ----------------------------------------------------------------------------
-- TABELA: "CustomerTag" [SEGMENTAÇÃO DE CLIENTES]
-- ----------------------------------------------------------------------------
CREATE TABLE "CustomerTag" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "customerId" UUID NOT NULL,
    "tagId" UUID NOT NULL,
    "assignedById" UUID,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CustomerTag_pkey" PRIMARY KEY ("id")
);

-- ----------------------------------------------------------------------------
-- TABELA: "Product" (Catálogo de Peças Selecionadas da Boutique)
-- ----------------------------------------------------------------------------
CREATE TABLE "Product" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "code" VARCHAR(50) NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "slug" VARCHAR(255) NOT NULL,
    "category" VARCHAR(100) NOT NULL,
    "description" TEXT,
    "material" VARCHAR(255),
    "basePrice" DECIMAL(10, 2) NOT NULL,
    "costPrice" DECIMAL(10, 2) NOT NULL,
    "photos" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- ----------------------------------------------------------------------------
-- TABELA: "ProductVariant" (SKUs com Estoque Limitado 1-3 Unidades)
-- ----------------------------------------------------------------------------
CREATE TABLE "ProductVariant" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "productId" UUID NOT NULL,
    "sku" VARCHAR(100) NOT NULL,
    "size" VARCHAR(20) NOT NULL,
    "color" VARCHAR(50) NOT NULL,
    "colorHex" VARCHAR(20),
    "barcode" VARCHAR(100),
    "stock" INTEGER NOT NULL DEFAULT 1,
    "reservedStock" INTEGER NOT NULL DEFAULT 0,
    "minStockAlert" INTEGER NOT NULL DEFAULT 1,
    "isLimitedEdition" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "ProductVariant_pkey" PRIMARY KEY ("id")
);

-- ----------------------------------------------------------------------------
-- TABELA: "InventoryMovement" (Auditoria Kardex de Estoque)
-- Rastreia baixa por venda, reserva na mala e reposição na devolução
-- ----------------------------------------------------------------------------
CREATE TABLE "InventoryMovement" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "variantId" UUID NOT NULL,
    "type" "InventoryMovementType" NOT NULL,
    "quantity" INTEGER NOT NULL,
    "previousStock" INTEGER NOT NULL,
    "newStock" INTEGER NOT NULL,
    "reason" VARCHAR(255),
    "orderId" UUID,
    "conditionalBoxId" UUID,
    "createdById" UUID,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "InventoryMovement_pkey" PRIMARY KEY ("id")
);

-- ----------------------------------------------------------------------------
-- TABELA: "ConditionalBox" [MÓDULO DE CONDICIONAL]
-- Mala de Prova em Domicílio (SLA de 48h-72h, status de máquina e valor total)
-- ----------------------------------------------------------------------------
CREATE TABLE "ConditionalBox" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "boxCode" VARCHAR(50) NOT NULL,
    "customerId" UUID NOT NULL,
    "curatorId" UUID NOT NULL,
    "status" "ConditionalStatus" NOT NULL DEFAULT 'CRIADO',
    "dataEnvio" TIMESTAMP(3),
    "dataDevolucao" TIMESTAMP(3),
    "prazoDias" INTEGER NOT NULL DEFAULT 3,
    "dataLimite" TIMESTAMP(3),
    "valorTotal" DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    "valorComprado" DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    "deliveryType" VARCHAR(50) NOT NULL DEFAULT 'MOTORISTA_VIP',
    "addressDelivery" TEXT,
    "trackingCode" VARCHAR(100),
    "observation" TEXT,
    "boxPhotoUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "ConditionalBox_pkey" PRIMARY KEY ("id")
);

-- ----------------------------------------------------------------------------
-- TABELA: "ConditionalItem" [MÓDULO DE CONDICIONAL]
-- Peças individuais da mala com status de decisão e motivo de devolução
-- ----------------------------------------------------------------------------
CREATE TABLE "ConditionalItem" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "conditionalBoxId" UUID NOT NULL,
    "variantId" UUID NOT NULL,
    "priceSnapshot" DECIMAL(10, 2) NOT NULL,
    "status" "ConditionalItemStatus" NOT NULL DEFAULT 'EM_EXPERIMENTACAO',
    "motivoDevolucao" TEXT,
    "feedbackRating" INTEGER,
    "clientFeedback" TEXT,
    "decidedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ConditionalItem_pkey" PRIMARY KEY ("id")
);

-- ----------------------------------------------------------------------------
-- TABELA: "Order" (Pedidos do PDV Canoinhas e WhatsApp com Comissões)
-- ----------------------------------------------------------------------------
CREATE TABLE "Order" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "orderNumber" VARCHAR(50) NOT NULL,
    "customerId" UUID NOT NULL,
    "attendantId" UUID NOT NULL,
    "channel" "OrderChannel" NOT NULL DEFAULT 'ONLINE_WHATSAPP',
    "status" "OrderStatus" NOT NULL DEFAULT 'PENDENTE',
    "totalAmount" DECIMAL(10, 2) NOT NULL,
    "discountAmount" DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    "commissionRate" DECIMAL(5, 4) NOT NULL DEFAULT 0.0500,
    "commissionAmount" DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    "conditionalBoxId" UUID,
    "paymentLink" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

-- ----------------------------------------------------------------------------
-- TABELA: "OrderItem"
-- ----------------------------------------------------------------------------
CREATE TABLE "OrderItem" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "orderId" UUID NOT NULL,
    "variantId" UUID NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "unitPrice" DECIMAL(10, 2) NOT NULL,
    "discount" DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    "total" DECIMAL(10, 2) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "OrderItem_pkey" PRIMARY KEY ("id")
);

-- ----------------------------------------------------------------------------
-- TABELA: "Payment" (Liquidações Pix, Cartão e Links de Pagamento)
-- ----------------------------------------------------------------------------
CREATE TABLE "Payment" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "orderId" UUID,
    "conditionalBoxId" UUID,
    "method" "PaymentMethod" NOT NULL DEFAULT 'PIX',
    "status" "PaymentStatus" NOT NULL DEFAULT 'PENDENTE',
    "amount" DECIMAL(10, 2) NOT NULL,
    "installments" INTEGER NOT NULL DEFAULT 1,
    "transactionId" VARCHAR(255),
    "gatewayResponse" TEXT,
    "paidAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);

-- ----------------------------------------------------------------------------
-- TABELA: "Conversation" (Inbox Omnichannel: WhatsApp, Instagram & Email)
-- ----------------------------------------------------------------------------
CREATE TABLE "Conversation" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "customerId" UUID NOT NULL,
    "assignedUserId" UUID,
    "channel" "Channel" NOT NULL DEFAULT 'WHATSAPP',
    "status" "ConversationStatus" NOT NULL DEFAULT 'ABERTO',
    "unreadCount" INTEGER NOT NULL DEFAULT 0,
    "lastMessageAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "externalConversationId" VARCHAR(255),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Conversation_pkey" PRIMARY KEY ("id")
);

-- ----------------------------------------------------------------------------
-- TABELA: "Message"
-- ----------------------------------------------------------------------------
CREATE TABLE "Message" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "conversationId" UUID NOT NULL,
    "senderType" "SenderType" NOT NULL DEFAULT 'CURATOR',
    "channel" "Channel" NOT NULL DEFAULT 'WHATSAPP',
    "status" "MessageStatus" NOT NULL DEFAULT 'ENVIADO',
    "content" TEXT NOT NULL,
    "mediaUrl" TEXT,
    "templateUsed" VARCHAR(100),
    "scheduledFor" TIMESTAMP(3),
    "sentAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Message_pkey" PRIMARY KEY ("id")
);

-- ----------------------------------------------------------------------------
-- TABELA: "Interaction" (Linha do Tempo 360° do Cliente)
-- ----------------------------------------------------------------------------
CREATE TABLE "Interaction" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "customerId" UUID NOT NULL,
    "userId" UUID,
    "type" "InteractionType" NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "metadata" TEXT,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Interaction_pkey" PRIMARY KEY ("id")
);

-- ----------------------------------------------------------------------------
-- TABELA: "Automation" (Gatilhos Automáticos de Moda: Onboarding, D+3, Aniversário)
-- ----------------------------------------------------------------------------
CREATE TABLE "Automation" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" VARCHAR(255) NOT NULL,
    "key" VARCHAR(100) NOT NULL,
    "triggerEvent" VARCHAR(100) NOT NULL,
    "channel" "Channel" NOT NULL DEFAULT 'WHATSAPP',
    "active" BOOLEAN NOT NULL DEFAULT true,
    "delayMinutes" INTEGER NOT NULL DEFAULT 0,
    "conditions" TEXT,
    "actionConfig" TEXT,
    "executionsCount" INTEGER NOT NULL DEFAULT 0,
    "successRate" DECIMAL(5, 2) NOT NULL DEFAULT 100.00,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Automation_pkey" PRIMARY KEY ("id")
);

-- ----------------------------------------------------------------------------
-- TABELA: "Campaign" [SEGMENTAÇÃO DE CLIENTES]
-- Campanhas segmentadas por tamanho, estilo, histórico e janela comercial
-- ----------------------------------------------------------------------------
CREATE TABLE "Campaign" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "title" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "channel" "Channel" NOT NULL DEFAULT 'WHATSAPP',
    "status" "CampaignStatus" NOT NULL DEFAULT 'RASCUNHO',
    "scheduledFor" TIMESTAMP(3),
    "sentAt" TIMESTAMP(3),
    "targetFilter" TEXT NOT NULL,
    "templateMessage" TEXT NOT NULL,
    "totalEligible" INTEGER NOT NULL DEFAULT 0,
    "totalSent" INTEGER NOT NULL DEFAULT 0,
    "totalDelivered" INTEGER NOT NULL DEFAULT 0,
    "totalRead" INTEGER NOT NULL DEFAULT 0,
    "totalReplied" INTEGER NOT NULL DEFAULT 0,
    "totalConverted" INTEGER NOT NULL DEFAULT 0,
    "createdById" UUID,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Campaign_pkey" PRIMARY KEY ("id")
);

-- ----------------------------------------------------------------------------
-- TABELA: "CampaignRecipient"
-- ----------------------------------------------------------------------------
CREATE TABLE "CampaignRecipient" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "campaignId" UUID NOT NULL,
    "customerId" UUID NOT NULL,
    "channel" "Channel" NOT NULL DEFAULT 'WHATSAPP',
    "status" "RecipientStatus" NOT NULL DEFAULT 'FILA',
    "sentAt" TIMESTAMP(3),
    "errorReason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CampaignRecipient_pkey" PRIMARY KEY ("id")
);

-- ----------------------------------------------------------------------------
-- TABELA: "Wishlist" (Lista de Desejo & Curadoria Sob Encomenda)
-- ----------------------------------------------------------------------------
CREATE TABLE "Wishlist" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "customerId" UUID NOT NULL,
    "variantId" UUID,
    "desiredCategory" VARCHAR(100),
    "desiredSize" VARCHAR(20),
    "desiredColor" VARCHAR(50),
    "status" "WishlistStatus" NOT NULL DEFAULT 'DESEJADO',
    "priority" INTEGER NOT NULL DEFAULT 1,
    "notes" TEXT,
    "notifiedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Wishlist_pkey" PRIMARY KEY ("id")
);

-- ============================================================================
-- 3. CHAVES ÚNICAS (UNIQUE CONSTRAINTS)
-- ============================================================================

CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE UNIQUE INDEX "Customer_phone_key" ON "Customer"("phone");
CREATE UNIQUE INDEX "Customer_email_key" ON "Customer"("email");
CREATE UNIQUE INDEX "Customer_instagram_key" ON "Customer"("instagram");
CREATE UNIQUE INDEX "StyleProfile_customerId_key" ON "StyleProfile"("customerId");
CREATE UNIQUE INDEX "Tag_name_key" ON "Tag"("name");
CREATE UNIQUE INDEX "CustomerTag_customerId_tagId_key" ON "CustomerTag"("customerId", "tagId");
CREATE UNIQUE INDEX "Product_code_key" ON "Product"("code");
CREATE UNIQUE INDEX "Product_slug_key" ON "Product"("slug");
CREATE UNIQUE INDEX "ProductVariant_sku_key" ON "ProductVariant"("sku");
CREATE UNIQUE INDEX "ProductVariant_barcode_key" ON "ProductVariant"("barcode");
CREATE UNIQUE INDEX "ConditionalBox_boxCode_key" ON "ConditionalBox"("boxCode");
CREATE UNIQUE INDEX "ConditionalItem_conditionalBoxId_variantId_key" ON "ConditionalItem"("conditionalBoxId", "variantId");
CREATE UNIQUE INDEX "Order_orderNumber_key" ON "Order"("orderNumber");
CREATE UNIQUE INDEX "Automation_key_key" ON "Automation"("key");
CREATE UNIQUE INDEX "CampaignRecipient_campaignId_customerId_key" ON "CampaignRecipient"("campaignId", "customerId");

-- ============================================================================
-- 4. ÍNDICES DE PERFORMANCE E PESQUISA RÁPIDA
-- ============================================================================

-- Índices de Atendimento e Busca de Clientes por Telefone e @Instagram
CREATE INDEX "Customer_phone_idx" ON "Customer"("phone");
CREATE INDEX "Customer_instagram_idx" ON "Customer"("instagram");
CREATE INDEX "Customer_email_idx" ON "Customer"("email");
CREATE INDEX "Customer_city_idx" ON "Customer"("city");
CREATE INDEX "Customer_tier_idx" ON "Customer"("tier");
CREATE INDEX "Customer_lastPurchaseDate_idx" ON "Customer"("lastPurchaseDate");
CREATE INDEX "Customer_birthDate_idx" ON "Customer"("birthDate");

-- Índices de Segmentação de Estilo
CREATE INDEX "StyleProfile_shirtSize_idx" ON "StyleProfile"("shirtSize");
CREATE INDEX "StyleProfile_pantsSize_idx" ON "StyleProfile"("pantsSize");
CREATE INDEX "StyleProfile_fitPreference_idx" ON "StyleProfile"("fitPreference");
CREATE INDEX "Tag_category_idx" ON "Tag"("category");
CREATE INDEX "CustomerTag_customerId_idx" ON "CustomerTag"("customerId");
CREATE INDEX "CustomerTag_tagId_idx" ON "CustomerTag"("tagId");

-- Índices de Catálogo e Estoque
CREATE INDEX "Product_category_idx" ON "Product"("category");
CREATE INDEX "Product_active_idx" ON "Product"("active");
CREATE INDEX "ProductVariant_productId_idx" ON "ProductVariant"("productId");
CREATE INDEX "ProductVariant_sku_idx" ON "ProductVariant"("sku");
CREATE INDEX "ProductVariant_barcode_idx" ON "ProductVariant"("barcode");
CREATE INDEX "ProductVariant_size_idx" ON "ProductVariant"("size");
CREATE INDEX "ProductVariant_color_idx" ON "ProductVariant"("color");

-- Índices de Movimentações de Estoque
CREATE INDEX "InventoryMovement_variantId_idx" ON "InventoryMovement"("variantId");
CREATE INDEX "InventoryMovement_type_idx" ON "InventoryMovement"("type");
CREATE INDEX "InventoryMovement_createdAt_idx" ON "InventoryMovement"("createdAt");

-- Índices do Módulo de Condicional
CREATE INDEX "ConditionalBox_customerId_idx" ON "ConditionalBox"("customerId");
CREATE INDEX "ConditionalBox_curatorId_idx" ON "ConditionalBox"("curatorId");
CREATE INDEX "ConditionalBox_status_idx" ON "ConditionalBox"("status");
CREATE INDEX "ConditionalBox_dataLimite_idx" ON "ConditionalBox"("dataLimite");
CREATE INDEX "ConditionalBox_createdAt_idx" ON "ConditionalBox"("createdAt");
CREATE INDEX "ConditionalItem_conditionalBoxId_idx" ON "ConditionalItem"("conditionalBoxId");
CREATE INDEX "ConditionalItem_variantId_idx" ON "ConditionalItem"("variantId");
CREATE INDEX "ConditionalItem_status_idx" ON "ConditionalItem"("status");

-- Índices de Vendas e Financeiro
CREATE INDEX "Order_customerId_idx" ON "Order"("customerId");
CREATE INDEX "Order_attendantId_idx" ON "Order"("attendantId");
CREATE INDEX "Order_status_idx" ON "Order"("status");
CREATE INDEX "Order_channel_idx" ON "Order"("channel");
CREATE INDEX "Order_createdAt_idx" ON "Order"("createdAt");
CREATE INDEX "OrderItem_orderId_idx" ON "OrderItem"("orderId");
CREATE INDEX "OrderItem_variantId_idx" ON "OrderItem"("variantId");
CREATE INDEX "Payment_orderId_idx" ON "Payment"("orderId");
CREATE INDEX "Payment_conditionalBoxId_idx" ON "Payment"("conditionalBoxId");
CREATE INDEX "Payment_status_idx" ON "Payment"("status");
CREATE INDEX "Payment_method_idx" ON "Payment"("method");

-- Índices de Inbox e Atendimento Omnichannel
CREATE INDEX "Conversation_customerId_idx" ON "Conversation"("customerId");
CREATE INDEX "Conversation_assignedUserId_idx" ON "Conversation"("assignedUserId");
CREATE INDEX "Conversation_channel_idx" ON "Conversation"("channel");
CREATE INDEX "Conversation_status_idx" ON "Conversation"("status");
CREATE INDEX "Conversation_lastMessageAt_idx" ON "Conversation"("lastMessageAt");
CREATE INDEX "Message_conversationId_idx" ON "Message"("conversationId");
CREATE INDEX "Message_status_idx" ON "Message"("status");
CREATE INDEX "Message_sentAt_idx" ON "Message"("sentAt");
CREATE INDEX "Interaction_customerId_idx" ON "Interaction"("customerId");
CREATE INDEX "Interaction_type_idx" ON "Interaction"("type");
CREATE INDEX "Interaction_timestamp_idx" ON "Interaction"("timestamp");

-- Índices de Automação, Campanhas e Wishlist
CREATE INDEX "Automation_active_idx" ON "Automation"("active");
CREATE INDEX "Automation_key_idx" ON "Automation"("key");
CREATE INDEX "Campaign_status_idx" ON "Campaign"("status");
CREATE INDEX "Campaign_channel_idx" ON "Campaign"("channel");
CREATE INDEX "Campaign_scheduledFor_idx" ON "Campaign"("scheduledFor");
CREATE INDEX "CampaignRecipient_campaignId_idx" ON "CampaignRecipient"("campaignId");
CREATE INDEX "CampaignRecipient_customerId_idx" ON "CampaignRecipient"("customerId");
CREATE INDEX "CampaignRecipient_status_idx" ON "CampaignRecipient"("status");
CREATE INDEX "Wishlist_customerId_idx" ON "Wishlist"("customerId");
CREATE INDEX "Wishlist_variantId_idx" ON "Wishlist"("variantId");
CREATE INDEX "Wishlist_status_idx" ON "Wishlist"("status");

-- ============================================================================
-- 5. CHAVES ESTRANGEIRAS (FOREIGN KEYS)
-- ============================================================================

ALTER TABLE "Customer" ADD CONSTRAINT "Customer_curatorId_fkey" 
    FOREIGN KEY ("curatorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "StyleProfile" ADD CONSTRAINT "StyleProfile_customerId_fkey" 
    FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "CustomerTag" ADD CONSTRAINT "CustomerTag_customerId_fkey" 
    FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "CustomerTag" ADD CONSTRAINT "CustomerTag_tagId_fkey" 
    FOREIGN KEY ("tagId") REFERENCES "Tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "CustomerTag" ADD CONSTRAINT "CustomerTag_assignedById_fkey" 
    FOREIGN KEY ("assignedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "ProductVariant" ADD CONSTRAINT "ProductVariant_productId_fkey" 
    FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "InventoryMovement" ADD CONSTRAINT "InventoryMovement_variantId_fkey" 
    FOREIGN KEY ("variantId") REFERENCES "ProductVariant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "InventoryMovement" ADD CONSTRAINT "InventoryMovement_orderId_fkey" 
    FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "InventoryMovement" ADD CONSTRAINT "InventoryMovement_conditionalBoxId_fkey" 
    FOREIGN KEY ("conditionalBoxId") REFERENCES "ConditionalBox"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "InventoryMovement" ADD CONSTRAINT "InventoryMovement_createdById_fkey" 
    FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "ConditionalBox" ADD CONSTRAINT "ConditionalBox_customerId_fkey" 
    FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "ConditionalBox" ADD CONSTRAINT "ConditionalBox_curatorId_fkey" 
    FOREIGN KEY ("curatorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "ConditionalItem" ADD CONSTRAINT "ConditionalItem_conditionalBoxId_fkey" 
    FOREIGN KEY ("conditionalBoxId") REFERENCES "ConditionalBox"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "ConditionalItem" ADD CONSTRAINT "ConditionalItem_variantId_fkey" 
    FOREIGN KEY ("variantId") REFERENCES "ProductVariant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "Order" ADD CONSTRAINT "Order_customerId_fkey" 
    FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "Order" ADD CONSTRAINT "Order_attendantId_fkey" 
    FOREIGN KEY ("attendantId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "Order" ADD CONSTRAINT "Order_conditionalBoxId_fkey" 
    FOREIGN KEY ("conditionalBoxId") REFERENCES "ConditionalBox"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_orderId_fkey" 
    FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_variantId_fkey" 
    FOREIGN KEY ("variantId") REFERENCES "ProductVariant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "Payment" ADD CONSTRAINT "Payment_orderId_fkey" 
    FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "Payment" ADD CONSTRAINT "Payment_conditionalBoxId_fkey" 
    FOREIGN KEY ("conditionalBoxId") REFERENCES "ConditionalBox"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "Conversation" ADD CONSTRAINT "Conversation_customerId_fkey" 
    FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "Conversation" ADD CONSTRAINT "Conversation_assignedUserId_fkey" 
    FOREIGN KEY ("assignedUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "Message" ADD CONSTRAINT "Message_conversationId_fkey" 
    FOREIGN KEY ("conversationId") REFERENCES "Conversation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "Interaction" ADD CONSTRAINT "Interaction_customerId_fkey" 
    FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "Interaction" ADD CONSTRAINT "Interaction_userId_fkey" 
    FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "Campaign" ADD CONSTRAINT "Campaign_createdById_fkey" 
    FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "CampaignRecipient" ADD CONSTRAINT "CampaignRecipient_campaignId_fkey" 
    FOREIGN KEY ("campaignId") REFERENCES "Campaign"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "CampaignRecipient" ADD CONSTRAINT "CampaignRecipient_customerId_fkey" 
    FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "Wishlist" ADD CONSTRAINT "Wishlist_customerId_fkey" 
    FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "Wishlist" ADD CONSTRAINT "Wishlist_variantId_fkey" 
    FOREIGN KEY ("variantId") REFERENCES "ProductVariant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- ============================================================================
-- 6. COMENTÁRIOS EXPLICATIVOS DE ARQUITETURA
-- ============================================================================

COMMENT ON TABLE "ConditionalBox" IS 'Suporta o Módulo de Condicional (Mala em Casa): gerencia o ciclo de vida da seleção, reserva temporária de estoque, prazos de 48h-72h e métricas de conversão financeira.';
COMMENT ON TABLE "ConditionalItem" IS 'Suporta o Módulo de Condicional: armazena cada peça sob prova, snapshots de preço no envio, motivos de devolução e feedback para aprendizado do curador.';
COMMENT ON TABLE "Customer" IS 'Suporta o Módulo de CRM & Segmentação: dados cadastrais unificados, índices otimizados por telefone/Instagram, opt-in LGPD e histórico de interação.';
COMMENT ON TABLE "StyleProfile" IS 'Suporta o Módulo de Segmentação: armazena antropometria (tamanho de camisa/calça/calçado), caimento e DNA de estilo para filtragem precisa de novos drops e mala personalizada.';
COMMENT ON TABLE "Tag" IS 'Suporta o Módulo de Segmentação: tags dinâmicas como Amante de Linho, Ticket Alto e VIP Médico para disparos direcionados no WhatsApp.';
COMMENT ON TABLE "ProductVariant" IS 'Suporta o Módulo de Estoque: controle rigoroso de unidades limitadas (1 a 3 peças por SKU) e separação entre estoque físico total e estoque reservado em condicional ativo.';
COMMENT ON TABLE "InventoryMovement" IS 'Suporta a Auditoria de Estoque: registra atomicamente saídas por venda, reservas por mala e reposições por devolução garantindo integridade ACID.';
