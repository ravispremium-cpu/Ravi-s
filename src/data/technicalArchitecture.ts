export interface TechChoice {
  category: string;
  technology: string;
  badge: string;
  rationale: string;
  tradeoffs: string;
}

export interface RbacRole {
  role: string;
  description: string;
  scope: string;
  permissions: {
    resource: string;
    create: boolean;
    read: boolean;
    update: boolean;
    delete: boolean;
    specialNotes: string;
  }[];
}

export interface InfraCostTier {
  tierName: string;
  volume: string;
  items: {
    service: string;
    plan: string;
    monthlyUsd: number;
    monthlyBrl: number;
    purpose: string;
  }[];
  totalBrl: number;
  totalUsd: number;
}

export const TECHNICAL_STACK_DATA: TechChoice[] = [
  {
    category: "Frontend & Fullstack Framework",
    technology: "Next.js 14+ (App Router) + TypeScript + Tailwind CSS",
    badge: "Produtividade & SSR/PWA",
    rationale: "Unifica a interface web do gestor e o app mobile PWA do atendente em uma única base de código com Server Components (RSC) para carregar perfis 360° instantaneamente sem hidratação excessiva no smartphone. Tailwind CSS provê a disciplina de tokens de luxo e mobile-first sem bundle inflado.",
    tradeoffs: "Curva de aprendizado do App Router e controle fino do ciclo de vida de Client Components em formulários dinâmicos de montagem de malas."
  },
  {
    category: "Camada de API / Backend",
    technology: "Next.js Route Handlers + tRPC v11",
    badge: "Type-Safety End-to-End",
    rationale: "Garante contrato tipado estrito entre o cliente web/mobile e o servidor sem boilerplate de serialização manual ou risco de dessincronização de campos de tamanho e estoque. Handlers nativos lidam com webhooks da Evolution API e Mercado Pago.",
    tradeoffs: "Exige que os clientes frontend compartilhem o ecossistema TypeScript do monorepo."
  },
  {
    category: "ORM & Camada de Dados",
    technology: "Prisma ORM",
    badge: "Schema Declarativo & Migrations",
    rationale: "Modelagem estrita do ciclo de vida complexo do Condicional (estados de máquina, itens relacionados, estoque reservado vs disponível por tamanho) e migrações rastreáveis via código.",
    tradeoffs: "Necessidade de otimização em queries complexas com agregações financeiras pesadas (uso pontual de `$queryRaw`)."
  },
  {
    category: "Banco de Dados Relacional",
    technology: "PostgreSQL Serverless (Neon ou Supabase)",
    badge: "ACID & Branching",
    rationale: "PostgreSQL é obrigatório para garantir consistência ACID intransigente em reservas de estoque de edições limitadas (evitando 'overbooking' de blazers e camisas exclusivas). Neon oferece scale-to-zero e database branching para testes rápidos de migração.",
    tradeoffs: "Cold start insignificante em planos gratuitos, mitigado por pool de conexões (PgBouncer/Neon Connection Pooling)."
  },
  {
    category: "Autenticação & RBAC",
    technology: "NextAuth.js (Auth.js v5) + JWT Sessions",
    badge: "Sessões Leves & OAuth 2.0",
    rationale: "Suporta login de conveniência Google Workspace corporativo para os sócios e login seguro e-mail/senha com 2FA para consultores de loja. O payload do JWT embute o `role` (ADMIN, CURATOR, ATTENDANT) permitindo checagens de autorização em nanossegundos na Edge.",
    tradeoffs: "Requer controle rigoroso de invalidação de sessão no logout através de jti / blacklist no Redis."
  },
  {
    category: "Fila de Mensageria & Jobs Assíncronos",
    technology: "BullMQ + Upstash Redis Serverless",
    badge: "SLA de Prazos 48h & WhatsApp",
    rationale: "O cerne do condicional exige timers precisos: contagem regressiva de 48h com disparo pontual de lembrete D-1, alerta de encerramento e follow-up de devolução. BullMQ permite delayed jobs robustos e retry exponencial. Upstash Redis Serverless elimina a necessidade de manter clusters EC2 rodando 24/7.",
    tradeoffs: "Upstash cobra por comandos/leituras, exigindo payloads compactos nos jobs."
  },
  {
    category: "Gateway WhatsApp & Instagram",
    technology: "Evolution API (Node.js/Baileys) + Meta Graph API",
    badge: "Omnichannel de Alta Conversão",
    rationale: "Evolution API provê interface REST robusta e webhooks para WhatsApp Business conectado a instâncias dedicadas da loja em Canoinhas, garantindo envio de fotos de looks e links Pix sem latência. Instagram Direct via Graph API oficial mantém a conversa em thread única.",
    tradeoffs: "Exige servidor Docker dedicado leve para a Evolution API (ex: VPS Hetzner ou Railway $5/mês) para manter a sessão do socket WhatsApp estável."
  },
  {
    category: "Gateways de Pagamento",
    technology: "Mercado Pago (Pix Dinâmico Instantâneo) + Stripe (Cartão)",
    badge: "Liquidação Imediata",
    rationale: "Em Santa Catarina e no modelo de condicional, o Pix é o método preferido em 85%+ das compras masculinas. Mercado Pago gera QR Codes Pix com webhooks de baixa latência e confirmação em 3 segundos. Stripe processa cartões de crédito em até 6x com proteção antifraude avançada.",
    tradeoffs: "Gerenciamento de reconciliação de webhooks duplos com tabela de `PaymentTransaction` unificada."
  },
  {
    category: "Armazenamento de Imagens & Mídia",
    technology: "Cloudflare R2 (Compatível com S3)",
    badge: "Zero Custo de Egress",
    rationale: "Fotos em altíssima resolução dos tecidos nobres (linho francês, alfaiataria 120s) e lookbooks das malas. O Cloudflare R2 não cobra taxa de tráfego de saída (egress zero), reduzindo em 90% a conta de CDN em comparação com AWS S3.",
    tradeoffs: "URLs assinadas para fotos privadas exigem configuração de worker ou presigned URLs."
  },
  {
    category: "Observabilidade & APM",
    technology: "Sentry + OpenTelemetry",
    badge: "Rastreabilidade de Falhas",
    rationale: "Monitora falhas críticas como tentativas de reserva de peça com estoque zerado, quedas na entrega de mensagens de WhatsApp e erros de webhooks de pagamento com stack traces completos.",
    tradeoffs: "Volume de traces precisa ser amostrado (sampling de 10-20% em produção) para permanecer na camada gratuita."
  }
];

export const RBAC_ROLES_DATA: RbacRole[] = [
  {
    role: "ADMIN (Gestor & Sócio-Proprietário)",
    description: "Acesso irrestrito a configurações estratégicas, compras de atacado, finanças e cancelamento de malas.",
    scope: "Global (Loja Física, E-commerce, Condicional, DRE)",
    permissions: [
      { resource: "Dashboard Financeiro & DRE", create: true, read: true, update: true, delete: true, specialNotes: "Visibilidade total de margens e custos de aquisição" },
      { resource: "Módulo Condicional", create: true, read: true, update: true, delete: true, specialNotes: "Pode forçar fechamento ou anular mala com extravio" },
      { resource: "Clientes & Ficha Antropométrica", create: true, read: true, update: true, delete: true, specialNotes: "Exportação em conformidade com LGPD" },
      { resource: "Catálogo & Custo de Peças", create: true, read: true, update: true, delete: true, specialNotes: "Visualiza preço de custo e markup" },
      { resource: "Equipe & Gestão de Acessos", create: true, read: true, update: true, delete: true, specialNotes: "Adiciona novos consultores e define comissões" }
    ]
  },
  {
    role: "CURATOR (Consultor de Estilo Sênior)",
    description: "Montagem técnica de malas, atendimento personalizado no WhatsApp e consultoria de caimento.",
    scope: "Carteira Própria + Chão de Loja",
    permissions: [
      { resource: "Dashboard Financeiro", create: false, read: true, update: false, delete: false, specialNotes: "Apenas metas pessoais e comissões da carteira" },
      { resource: "Módulo Condicional", create: true, read: true, update: true, delete: false, specialNotes: "Monta, despacha e realiza fechamento de suas malas" },
      { resource: "Clientes & Ficha Antropométrica", create: true, read: true, update: true, delete: false, specialNotes: "Edita medidas e adiciona notas secretas" },
      { resource: "Catálogo & Estoque", create: false, read: true, update: false, delete: false, specialNotes: "Vê apenas preço de venda ao cliente e estoque disponível" },
      { resource: "Equipe & Gestão de Acessos", create: false, read: false, update: false, delete: false, specialNotes: "Sem acesso a configurações administrativas" }
    ]
  },
  {
    role: "ATTENDANT (Operador de Caixa & Logística)",
    description: "Expedição de caixas para o motorista, conferência de retorno e baixa de estoque físico.",
    scope: "Operação e Logística Local Canoinhas",
    permissions: [
      { resource: "Dashboard Financeiro", create: false, read: false, update: false, delete: false, specialNotes: "Sem acesso a faturamento global" },
      { resource: "Módulo Condicional", create: false, read: true, update: true, delete: false, specialNotes: "Muda status para 'Caixa Enviada' e 'Devolvida ao Estoque'" },
      { resource: "Clientes", create: true, read: true, update: false, delete: false, specialNotes: "Acesso a endereço e telefone para entrega com motorista" },
      { resource: "Catálogo & Estoque", create: false, read: true, update: true, delete: false, specialNotes: "Apenas conferência física e contagem de peças devolvidas" },
      { resource: "Equipe", create: false, read: false, update: false, delete: false, specialNotes: "Sem acesso" }
    ]
  }
];

export const INFRA_ESTIMATES: InfraCostTier[] = [
  {
    tierName: "Fase 1: MVP & Lançamento Canoinhas",
    volume: "Até 300 clientes ativos • 1 loja física • ~60 malas/mês",
    totalUsd: 29,
    totalBrl: 165,
    items: [
      { service: "Vercel", plan: "Hobby / Pro", monthlyUsd: 20, monthlyBrl: 114, purpose: "Deploy do Next.js 14, Edge CDN e Serverless Functions" },
      { service: "Neon PostgreSQL", plan: "Free / Launch", monthlyUsd: 0, monthlyBrl: 0, purpose: "PostgreSQL com 0.5 GiB de storage (suficiente para ~50k registros)" },
      { service: "Upstash Redis", plan: "Free Tier", monthlyUsd: 0, monthlyBrl: 0, purpose: "BullMQ queue com até 10.000 comandos diários gratuitos" },
      { service: "Cloudflare R2", plan: "Free Tier", monthlyUsd: 0, monthlyBrl: 0, purpose: "10 GB de imagens de lookbooks sem taxa de egress" },
      { service: "Evolution API (VPS)", plan: "Hetzner CX22 ou Railway", monthlyUsd: 5, monthlyBrl: 28, purpose: "Instância Docker dedicada do WhatsApp Web Socket" },
      { service: "Sentry", plan: "Developer Free", monthlyUsd: 0, monthlyBrl: 0, purpose: "5.000 eventos de erro mensais" },
      { service: "Mercado Pago / Stripe", plan: "Pay-as-you-go", monthlyUsd: 4, monthlyBrl: 23, purpose: "Apenas taxas transacionais por venda realizada (0.99% no Pix)" }
    ]
  },
  {
    tierName: "Fase 2: Consolidação Planalto Norte",
    volume: "1.000 a 2.500 clientes • 3 curadores • ~250 malas/mês",
    totalUsd: 87,
    totalBrl: 495,
    items: [
      { service: "Vercel", plan: "Pro Plan (2 seats)", monthlyUsd: 40, monthlyBrl: 228, purpose: "Ambiente de pré-visualização, analítica de tráfego e alta disponibilidade" },
      { service: "Neon PostgreSQL", plan: "Scale Plan", monthlyUsd: 19, monthlyBrl: 108, purpose: "Computação elástica com branching para testes e backup pontual" },
      { service: "Upstash Redis", plan: "Pay-as-you-go", monthlyUsd: 10, monthlyBrl: 57, purpose: "Processamento de até 500k comandos de filas e rate limiters" },
      { service: "Cloudflare R2", plan: "Standard", monthlyUsd: 3, monthlyBrl: 17, purpose: "50 GB de armazenamento de fotos em ultra-resolução" },
      { service: "Evolution API (VPS)", plan: "VPS Dedicada 4GB RAM", monthlyUsd: 15, monthlyBrl: 85, purpose: "2 instâncias WhatsApp conectadas (Loja + Pessoal VIP)" },
      { service: "Sentry", plan: "Team Plan", monthlyUsd: 0, monthlyBrl: 0, purpose: "Monitoramento básico de erros de transação" }
    ]
  },
  {
    tierName: "Fase 3: Expansão Multiloja Regional",
    volume: "10.000+ clientes • 3 unidades (Canoinhas, Mafra, Porto União) • ~1.200 malas/mês",
    totalUsd: 260,
    totalBrl: 1480,
    items: [
      { service: "Vercel", plan: "Pro Plan (Multi-seat)", monthlyUsd: 80, monthlyBrl: 456, purpose: "Equipe de engenharia e curadoria com CDN enterprise regional" },
      { service: "Neon PostgreSQL", plan: "Business Tier", monthlyUsd: 69, monthlyBrl: 393, purpose: "Alta disponibilidade com read-replicas e failover instantâneo" },
      { service: "Upstash Redis", plan: "Enterprise Pro", monthlyUsd: 35, monthlyBrl: 200, purpose: "Fila de alto rendimento com replicação multirregional" },
      { service: "Cloudflare R2", plan: "Pro Storage", monthlyUsd: 12, monthlyBrl: 68, purpose: "Lookbooks em vídeo curto de alta qualidade" },
      { service: "Evolution API / Meta Cloud API Oficial", plan: "Cluster Docker + WhatsApp Cloud", monthlyUsd: 40, monthlyBrl: 228, purpose: "Cluster de instâncias com failover automático e Meta API híbrida" },
      { service: "Sentry & Observabilidade", plan: "Business Tier", monthlyUsd: 24, monthlyBrl: 135, purpose: "Tracing de performance de checkout e métricas de latência" }
    ]
  }
];

export interface TableModuleSupport {
  table: string;
  module: 'CONDICIONAL' | 'SEGMENTACAO' | 'CATALOGO_ESTOQUE' | 'PEDIDOS_PDV' | 'ATENDIMENTO_INBOX' | 'CORE_RBAC';
  description: string;
  keyIndexes: string[];
  relationships: string;
}

export const PRISMA_MODULES_MAPPING: TableModuleSupport[] = [
  {
    table: 'ConditionalBox',
    module: 'CONDICIONAL',
    description: 'Suporte central ao Módulo de Condicional (Mala em Casa): armazena o código único da mala (COND-2026-088), cliente, curador responsável, datas de despacho e devolução, SLA de 48h-72h, status de máquina e valor total.',
    keyIndexes: ['boxCode (UNIQUE)', 'customerId', 'curatorId', 'status', 'dataLimite'],
    relationships: 'Pertence a Customer e User (Curador); possui muitos ConditionalItem, Order, Payment e InventoryMovement.'
  },
  {
    table: 'ConditionalItem',
    module: 'CONDICIONAL',
    description: 'Peças individuais sob prova na residência do cliente: registra snapshots de preço no momento do despacho, status final (COMPRADO / DEVOLVIDO / EM_EXPERIMENTACAO), motivo da devolução e avaliação de feedback para aperfeiçoar a curadoria.',
    keyIndexes: ['conditionalBoxId + variantId (UNIQUE)', 'status', 'variantId'],
    relationships: 'Pertence a ConditionalBox e ProductVariant.'
  },
  {
    table: 'Customer',
    module: 'SEGMENTACAO',
    description: 'Base do CRM Inteligente 360°: dados cadastrais unificados, telefone e @Instagram com índices únicos para identificação instantânea na fila do WhatsApp, consentimento LGPD, datas de aniversário e última compra.',
    keyIndexes: ['phone (UNIQUE)', 'instagram (UNIQUE)', 'email (UNIQUE)', 'city', 'tier', 'birthDate', 'lastPurchaseDate'],
    relationships: 'Possui 1 StyleProfile; possui muitos CustomerTag, ConditionalBox, Order, Conversation, Interaction, Wishlist.'
  },
  {
    table: 'StyleProfile',
    module: 'SEGMENTACAO',
    description: 'Perfil Antropométrico e DNA Estético: armazena tamanhos de camisa, calça e calçado, preferência de caimento (Slim, Regular, Alfaiataria), paleta de cores preferida, categorias favoritas e peças a evitar.',
    keyIndexes: ['customerId (UNIQUE)', 'shirtSize', 'pantsSize', 'fitPreference'],
    relationships: 'Relação 1:1 estrita com Customer.'
  },
  {
    table: 'Tag & CustomerTag',
    module: 'SEGMENTACAO',
    description: 'Segmentação comportamental e de estilo dinâmica (ex: "Amante de Linho", "VIP Médico Canoinhas", "Ticket Alto", "Mala Recorrente") para filtragem cirúrgica em novos drops.',
    keyIndexes: ['name (UNIQUE)', 'category', 'customerId + tagId (UNIQUE)'],
    relationships: 'Relação N:M entre Customer e Tag com auditoria de quem atribuiu a tag.'
  },
  {
    table: 'Automation',
    module: 'SEGMENTACAO',
    description: 'Motor de automações estilo Salesforce/HubSpot específico para moda: regras pré-configuradas para Onboarding de novo cliente, Lembrete Condicional D+3, Aniversariante do Mês, Reativação 60d e Notificação de Novos Drops por estilo.',
    keyIndexes: ['key (UNIQUE)', 'active'],
    relationships: 'Aciona templates e gera interações no WhatsApp / Instagram.'
  },
  {
    table: 'Campaign & CampaignRecipient',
    module: 'SEGMENTACAO',
    description: 'Campanhas de marketing em lote com filtros de estilo/tamanho, controle estrito de opt-in LGPD e validação de horário comercial de Canoinhas-SC para evitar ban da Meta.',
    keyIndexes: ['status', 'channel', 'scheduledFor', 'campaignId + customerId (UNIQUE)'],
    relationships: 'Criada por User; envia para múltiplos Customer com métricas de entrega, leitura e conversão.'
  },
  {
    table: 'ProductVariant & InventoryMovement',
    module: 'CATALOGO_ESTOQUE',
    description: 'Controle de unidades limitadas (1 a 3 peças por SKU) e Kardex auditado de estoque: baixa automática na venda, trava atômica de reserva em condicional e reposição na devolução.',
    keyIndexes: ['sku (UNIQUE)', 'barcode (UNIQUE)', 'variantId', 'type', 'createdAt'],
    relationships: 'ProductVariant pertence a Product; InventoryMovement rastreia baixas vinculadas a Order e ConditionalBox.'
  },
  {
    table: 'Order & OrderItem',
    module: 'PEDIDOS_PDV',
    description: 'Faturamento de vendas online (link WhatsApp Mercado Pago/Stripe) e PDV físico central de Canoinhas-SC, comissionamento do atendente e vínculo à mala de origem.',
    keyIndexes: ['orderNumber (UNIQUE)', 'customerId', 'attendantId', 'status', 'channel'],
    relationships: 'Pertence a Customer e User (Atendente); vincula ConditionalBox opcional; possui OrderItem e Payment.'
  },
  {
    table: 'Conversation & Message',
    module: 'ATENDIMENTO_INBOX',
    description: 'Inbox unificado omnichannel que consolida WhatsApp Business, Instagram Direct e E-mail em uma única fila com atribuição de atendente e templates aprovados.',
    keyIndexes: ['customerId', 'assignedUserId', 'channel', 'status', 'lastMessageAt'],
    relationships: 'Conversation pertence a Customer e User; possui Message.'
  },
  {
    table: 'Interaction',
    module: 'ATENDIMENTO_INBOX',
    description: 'Linha do tempo cronológica 360° do cliente: unifica visitas à loja física em Canoinhas, compras, malas enviadas, notas de alfaiataria e conversas.',
    keyIndexes: ['customerId', 'type', 'timestamp'],
    relationships: 'Pertence a Customer e User (autor).'
  },
  {
    table: 'Wishlist',
    module: 'CATALOGO_ESTOQUE',
    description: 'Lista de desejos e encomendas de clientes: alerta automático quando uma peça rara entra no acervo ou é importada.',
    keyIndexes: ['customerId', 'variantId', 'status'],
    relationships: 'Pertence a Customer e ProductVariant opcional.'
  }
];

export const PRISMA_SCHEMA_CODE = `// ============================================================================
// RAVIS CRM - SCHEMA PRISMA ORM PARA POSTGRESQL
// Sistema de Gestão de Moda Masculina Premium, Curadoria & Mala Condicional
// Ravi's Premium Menswear - Canoinhas, SC
// ============================================================================

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

// ----------------------------------------------------------------------------
// ENUMS DE NEGÓCIO E CONTROLE DE ACESSO (RBAC)
// ----------------------------------------------------------------------------
enum Role {
  ADMIN       // Acesso irrestrito a DRE, comissões, margens de custo e configurações
  CURADOR     // Montagem de malas condicionais, curadoria de estilo e atendimento VIP
  ATENDENTE   // Operação do PDV físico em Canoinhas, baixas e atendimento de balcão
}

enum FitPreference {
  SLIM_FIT
  REGULAR_FIT
  ALFAIATARIA_MODERNA
  LONGLINE
  OVERSIZED
}

enum ConditionalStatus {
  CRIADO            // Seleção inicial montada pelo curador no sistema
  EM_PREPARACAO     // Peças reservadas e separadas na arara da boutique
  ENVIADO           // Despachada para a residência/escritório do cliente
  EM_TESTE          // Em posse do cliente durante o prazo de experimentação (48h-72h)
  FINALIZADO        // Itens conferidos, baixas financeiras efetuadas e devoluções guardadas
  CANCELADO         // Cancelado antes do despacho
  VENCIDO           // Prazo de devolução expirado sem retorno do cliente
}

enum ConditionalItemStatus {
  EM_EXPERIMENTACAO // Item sob teste na residência do cliente
  COMPRADO          // Faturado e convertido em venda
  DEVOLVIDO         // Retornado para reintegração ao estoque disponível
}

enum OrderChannel {
  ONLINE_WHATSAPP       // Venda fechada via WhatsApp com link de pagamento
  PDV_FISICO_CANOINHAS  // Venda balcão na loja física central em Canoinhas-SC
  ECOMMERCE             // Pedido originado via catálogo online / e-commerce
}

enum OrderStatus {
  PENDENTE
  PAGO
  EM_SEPARACAO
  ENVIADO
  ENTREGUE
  CANCELADO
}

enum PaymentMethod {
  PIX
  CARTAO_CREDITO
  CARTAO_DEBITO
  DINHEIRO
  LINK_MERCADO_PAGO
  LINK_STRIPE
}

enum PaymentStatus {
  PENDENTE
  APROVADO
  RECUSADO
  ESTORNADO
}

enum Channel {
  WHATSAPP
  INSTAGRAM
  EMAIL
}

enum ConversationStatus {
  ABERTO
  EM_ATENDIMENTO
  AGUARDANDO_CLIENTE
  RESOLVIDO
  ARQUIVADO
}

enum SenderType {
  CLIENT
  CURATOR
  BOT_AUTOMATION
}

enum MessageStatus {
  ENVIADO
  ENTREGUE
  LIDO
  FALHA
}

enum InteractionType {
  WHATSAPP
  INSTAGRAM
  EMAIL
  CONDICIONAL
  VISITA_LOJA
  PAGAMENTO
  NOTA_CURADOR
  CHAMADA_TELEFONICA
}

enum InventoryMovementType {
  ENTRADA               // Recebimento de confecção / novo lote
  SAIDA_VENDA           // Baixa definitiva de estoque por venda faturada
  RESERVA_CONDICIONAL   // Bloqueio temporário para mala condicional em trânsito/teste
  LIBERACAO_CONDICIONAL // Desbloqueio por devolução de mala sem compra
  AJUSTE_BALANCO        // Correção de inventário físico
  DEVOLUCAO             // Retorno formal ao estoque após conferência
}

enum CampaignStatus {
  RASCUNHO
  AGENDADA
  EM_DISPARO
  CONCLUIDA
  CANCELADA
}

enum RecipientStatus {
  FILA
  ENVIADO
  ENTREGUE
  LIDO
  RESPONDEU
  CONVERTEU
  FALHA
  OPT_OUT
}

enum WishlistStatus {
  DESEJADO    // Aguardando peça entrar no acervo
  NOTIFICADO  // Cliente avisado via WhatsApp/Direct que o SKU chegou
  DISPONIVEL  // Peça física em loja aguardando decisão
  ATENDIDO    // Comprado ou incluído em mala condicional
  EXPIRADO    // Cliente desistiu ou desatualizado
}

enum LgpdConsentStatus {
  OPT_IN
  PENDENTE
  OPT_OUT
}

// ----------------------------------------------------------------------------
// GESTÃO DE USUÁRIOS E EQUIPE (RBAC)
// ----------------------------------------------------------------------------
model User {
  id              String         @id @default(uuid())
  name            String
  email           String         @unique
  passwordHash    String?
  phone           String?
  role            Role           @default(CURATOR)
  avatarUrl       String?
  active          Boolean        @default(true)
  commissionRate  Decimal        @default(0.05) @db.Decimal(5, 4)

  createdAt       DateTime       @default(now())
  updatedAt       DateTime       @updatedAt
  deletedAt       DateTime?

  assignedCustomers   Customer[]           @relation("CuratorCustomers")
  conditionalBoxes    ConditionalBox[]     @relation("CuratorBoxes")
  orders              Order[]              @relation("AttendantOrders")
  conversations       Conversation[]       @relation("AssignedConversations")
  interactions        Interaction[]        @relation("UserInteractions")
  customerTags        CustomerTag[]        @relation("TaggedByUser")
  inventoryMovements  InventoryMovement[]  @relation("MovementAuthor")
  createdCampaigns    Campaign[]           @relation("CampaignCreator")

  @@index([role])
  @@index([email])
}

// ----------------------------------------------------------------------------
// [CRM & SEGMENTAÇÃO] CLIENTE E PERFIL DE ESTILO 360°
// ----------------------------------------------------------------------------
model Customer {
  id                String            @id @default(uuid())
  name              String
  phone             String            @unique // Normalizado: +5547998241102
  email             String?           @unique
  instagram         String?           @unique // Ex: @drguilhermeschramm
  city              String            @default("Canoinhas")
  neighborhood      String?
  address           String?
  tier              String            @default("VIP Ouro")

  lgpdConsent       LgpdConsentStatus @default(OPT_IN)
  lgpdConsentDate   DateTime?
  birthDate         DateTime?         // Automação (3) Aniversariante do Mês
  lastPurchaseDate  DateTime?         // Automação (4) Reativação 60 dias

  curatorId         String?
  curator           User?             @relation("CuratorCustomers", fields: [curatorId], references: [id], onDelete: SetNull)

  active            Boolean           @default(true)
  createdAt         DateTime          @default(now())
  updatedAt         DateTime          @updatedAt
  deletedAt         DateTime?

  styleProfile      StyleProfile?     // Perfil Antropométrico (1:1)
  tags              CustomerTag[]     // Segmentação Dinâmica por Tags (N:M)
  conditionalBoxes  ConditionalBox[]  // Malas Condicionais
  orders            Order[]           // Pedidos e Faturamento (LTV)
  conversations     Conversation[]    // Inbox Omnichannel
  interactions      Interaction[]     // Linha do tempo 360°
  wishlist          Wishlist[]        // Lista de desejos
  campaignDeliveries CampaignRecipient[]

  @@index([phone])
  @@index([instagram])
  @@index([email])
  @@index([city])
  @@index([tier])
  @@index([lastPurchaseDate])
  @@index([birthDate])
}

model StyleProfile {
  id                  String         @id @default(uuid())
  customerId          String         @unique
  customer            Customer       @relation(fields: [customerId], references: [id], onDelete: Cascade)

  shirtSize           String         // P, M, G, GG, XG
  pantsSize           String         // 38, 40, 42, 44, 46, 48
  shoesSize           String?        // 39, 40, 41, 42, 43, 44
  fitPreference       FitPreference  @default(SLIM_FIT)
  heightCm            Int?
  weightKg            Int?

  colorPalette        String[]       @default([])
  favoriteCategories  String[]       @default([])
  avoidItems          String[]       @default([])
  lifestyle           String?
  profession          String?
  curatorObservations String?        @db.Text

  createdAt           DateTime       @default(now())
  updatedAt           DateTime       @updatedAt

  @@index([shirtSize])
  @@index([pantsSize])
  @@index([fitPreference])
}

model Tag {
  id          String        @id @default(uuid())
  name        String        @unique
  category    String        @default("ESTILO")
  color       String        @default("#D4AF37")
  description String?

  createdAt   DateTime      @default(now())
  updatedAt   DateTime      @updatedAt

  customers   CustomerTag[]

  @@index([category])
}

model CustomerTag {
  id          String    @id @default(uuid())
  customerId  String
  customer    Customer  @relation(fields: [customerId], references: [id], onDelete: Cascade)
  tagId       String
  tag         Tag       @relation(fields: [tagId], references: [id], onDelete: Cascade)
  
  assignedById String?
  assignedBy   User?    @relation("TaggedByUser", fields: [assignedById], references: [id], onDelete: SetNull)
  assignedAt   DateTime @default(now())

  @@unique([customerId, tagId])
  @@index([customerId])
  @@index([tagId])
}

// ----------------------------------------------------------------------------
// CATÁLOGO E ESTOQUE LIMITADO (1 A 3 UNIDADES POR SKU)
// ----------------------------------------------------------------------------
model Product {
  id            String           @id @default(uuid())
  code          String           @unique
  name          String
  slug          String           @unique
  category      String           // Camiseta slim, Longline, Tricô, Sobretudo, etc.
  description   String?          @db.Text
  material      String?
  basePrice     Decimal          @db.Decimal(10, 2)
  costPrice     Decimal          @db.Decimal(10, 2)
  photos        String[]         @default([]) // Photoshoot Pomelli
  active        Boolean          @default(true)

  createdAt     DateTime         @default(now())
  updatedAt     DateTime         @updatedAt
  deletedAt     DateTime?

  variants      ProductVariant[]

  @@index([category])
  @@index([active])
}

model ProductVariant {
  id                String             @id @default(uuid())
  productId         String
  product           Product            @relation(fields: [productId], references: [id], onDelete: Cascade)
  sku               String             @unique
  size              String
  color             String
  colorHex          String?
  barcode           String?            @unique

  stock             Int                @default(1)
  reservedStock     Int                @default(0)
  minStockAlert     Int                @default(1)
  isLimitedEdition  Boolean            @default(true)

  createdAt         DateTime           @default(now())
  updatedAt         DateTime           @updatedAt
  deletedAt         DateTime?

  conditionalItems   ConditionalItem[]
  orderItems         OrderItem[]
  movements          InventoryMovement[]
  wishlists          Wishlist[]

  @@index([productId])
  @@index([sku])
  @@index([barcode])
  @@index([size])
  @@index([color])
}

model InventoryMovement {
  id              String                 @id @default(uuid())
  variantId       String
  variant         ProductVariant         @relation(fields: [variantId], references: [id], onDelete: Cascade)
  type            InventoryMovementType
  quantity        Int
  previousStock   Int
  newStock        Int
  reason          String?

  orderId         String?
  order           Order?                 @relation(fields: [orderId], references: [id], onDelete: SetNull)
  conditionalBoxId String?
  conditionalBox  ConditionalBox?        @relation(fields: [conditionalBoxId], references: [id], onDelete: SetNull)

  createdById     String?
  createdBy       User?                  @relation("MovementAuthor", fields: [createdById], references: [id], onDelete: SetNull)
  createdAt       DateTime               @default(now())

  @@index([variantId])
  @@index([type])
  @@index([createdAt])
}

// ----------------------------------------------------------------------------
// [MÓDULO DE CONDICIONAL - MALA EM CASA]
// ----------------------------------------------------------------------------
model ConditionalBox {
  id              String            @id @default(uuid())
  boxCode         String            @unique
  customerId      String
  customer        Customer          @relation(fields: [customerId], references: [id], onDelete: Cascade)
  curatorId       String
  curator         User              @relation("CuratorBoxes", fields: [curatorId], references: [id], onDelete: Restrict)
  status          ConditionalStatus @default(CRIADO)

  dataEnvio       DateTime?
  dataDevolucao   DateTime?
  prazoDias       Int               @default(3)
  dataLimite      DateTime?

  valorTotal      Decimal           @db.Decimal(10, 2) @default(0.00)
  valorComprado   Decimal           @db.Decimal(10, 2) @default(0.00)

  deliveryType    String            @default("MOTORISTA_VIP")
  addressDelivery String?
  trackingCode    String?
  observation     String?           @db.Text
  boxPhotoUrl     String?

  createdAt       DateTime          @default(now())
  updatedAt       DateTime          @updatedAt
  deletedAt       DateTime?

  items           ConditionalItem[]
  orders          Order[]
  movements       InventoryMovement[]
  payments        Payment[]

  @@index([customerId])
  @@index([curatorId])
  @@index([status])
  @@index([dataLimite])
  @@index([createdAt])
}

model ConditionalItem {
  id                String                @id @default(uuid())
  conditionalBoxId  String
  conditionalBox    ConditionalBox        @relation(fields: [conditionalBoxId], references: [id], onDelete: Cascade)
  variantId         String
  variant           ProductVariant        @relation(fields: [variantId], references: [id], onDelete: Restrict)

  priceSnapshot     Decimal               @db.Decimal(10, 2)
  status            ConditionalItemStatus @default(EM_EXPERIMENTACAO)
  motivoDevolucao   String?
  feedbackRating    Int?
  clientFeedback    String?

  decidedAt         DateTime?
  createdAt         DateTime              @default(now())
  updatedAt         DateTime              @updatedAt

  @@unique([conditionalBoxId, variantId])
  @@index([conditionalBoxId])
  @@index([variantId])
  @@index([status])
}

// ----------------------------------------------------------------------------
// PEDIDOS E FATURAMENTO (ONLINE WHATSAPP & PDV CANOINHAS)
// ----------------------------------------------------------------------------
model Order {
  id                String          @id @default(uuid())
  orderNumber       String          @unique
  customerId        String
  customer          Customer        @relation(fields: [customerId], references: [id], onDelete: Restrict)
  attendantId       String
  attendant         User            @relation("AttendantOrders", fields: [attendantId], references: [id], onDelete: Restrict)

  channel           OrderChannel    @default(ONLINE_WHATSAPP)
  status            OrderStatus     @default(PENDENTE)

  totalAmount       Decimal         @db.Decimal(10, 2)
  discountAmount    Decimal         @db.Decimal(10, 2) @default(0.00)
  commissionRate    Decimal         @db.Decimal(5, 4)  @default(0.05)
  commissionAmount  Decimal         @db.Decimal(10, 2) @default(0.00)

  conditionalBoxId  String?
  conditionalBox    ConditionalBox? @relation(fields: [conditionalBoxId], references: [id], onDelete: SetNull)

  paymentLink       String?
  notes             String?

  createdAt         DateTime        @default(now())
  updatedAt         DateTime        @updatedAt
  deletedAt         DateTime?

  items             OrderItem[]
  payments          Payment[]
  movements         InventoryMovement[]

  @@index([customerId])
  @@index([attendantId])
  @@index([status])
  @@index([channel])
  @@index([createdAt])
}

model OrderItem {
  id          String         @id @default(uuid())
  orderId     String
  order       Order          @relation(fields: [orderId], references: [id], onDelete: Cascade)
  variantId   String
  variant     ProductVariant @relation(fields: [variantId], references: [id], onDelete: Restrict)

  quantity    Int            @default(1)
  unitPrice   Decimal        @db.Decimal(10, 2)
  discount    Decimal        @db.Decimal(10, 2) @default(0.00)
  total       Decimal        @db.Decimal(10, 2)

  createdAt   DateTime       @default(now())
  updatedAt   DateTime       @updatedAt

  @@index([orderId])
  @@index([variantId])
}

model Payment {
  id                String          @id @default(uuid())
  orderId           String?
  order             Order?          @relation(fields: [orderId], references: [id], onDelete: SetNull)
  conditionalBoxId  String?
  conditionalBox    ConditionalBox? @relation(fields: [conditionalBoxId], references: [id], onDelete: SetNull)

  method            PaymentMethod   @default(PIX)
  status            PaymentStatus   @default(PENDENTE)
  amount            Decimal         @db.Decimal(10, 2)
  installments      Int             @default(1)

  transactionId     String?
  gatewayResponse   String?         @db.Text
  paidAt            DateTime?

  createdAt         DateTime        @default(now())
  updatedAt         DateTime        @updatedAt

  @@index([orderId])
  @@index([conditionalBoxId])
  @@index([status])
  @@index([method])
}

// ----------------------------------------------------------------------------
// ATENDIMENTO E INBOX OMNICHANNEL
// ----------------------------------------------------------------------------
model Conversation {
  id                     String             @id @default(uuid())
  customerId             String
  customer               Customer           @relation(fields: [customerId], references: [id], onDelete: Cascade)
  assignedUserId         String?
  assignedUser           User?              @relation("AssignedConversations", fields: [assignedUserId], references: [id], onDelete: SetNull)

  channel                Channel            @default(WHATSAPP)
  status                 ConversationStatus @default(ABERTO)
  unreadCount            Int                @default(0)
  lastMessageAt          DateTime           @default(now())
  externalConversationId String?

  createdAt              DateTime           @default(now())
  updatedAt              DateTime           @updatedAt
  deletedAt              DateTime?

  messages               Message[]

  @@index([customerId])
  @@index([assignedUserId])
  @@index([channel])
  @@index([status])
  @@index([lastMessageAt])
}

model Message {
  id              String        @id @default(uuid())
  conversationId  String
  conversation    Conversation  @relation(fields: [conversationId], references: [id], onDelete: Cascade)

  senderType      SenderType    @default(CURATOR)
  channel         Channel       @default(WHATSAPP)
  status          MessageStatus @default(ENVIADO)
  content         String        @db.Text
  mediaUrl        String?
  templateUsed    String?
  scheduledFor    DateTime?
  sentAt          DateTime      @default(now())

  createdAt       DateTime      @default(now())
  updatedAt       DateTime      @updatedAt

  @@index([conversationId])
  @@index([status])
  @@index([sentAt])
}

model Interaction {
  id          String          @id @default(uuid())
  customerId  String
  customer    Customer        @relation(fields: [customerId], references: [id], onDelete: Cascade)
  userId      String?
  user        User?           @relation("UserInteractions", fields: [userId], references: [id], onDelete: SetNull)

  type        InteractionType
  title       String
  description String?         @db.Text
  metadata    String?         @db.Text
  timestamp   DateTime        @default(now())

  createdAt   DateTime        @default(now())

  @@index([customerId])
  @@index([type])
  @@index([timestamp])
}

// ----------------------------------------------------------------------------
// AUTOMAÇÕES DE MODA E CAMPANHAS
// ----------------------------------------------------------------------------
model Automation {
  id              String        @id @default(uuid())
  name            String
  key             String        @unique
  triggerEvent    String
  channel         Channel       @default(WHATSAPP)
  active          Boolean       @default(true)
  delayMinutes    Int           @default(0)

  conditions      String?       @db.Text
  actionConfig    String?       @db.Text

  executionsCount Int           @default(0)
  successRate     Decimal       @db.Decimal(5, 2) @default(100.00)

  createdAt       DateTime      @default(now())
  updatedAt       DateTime      @updatedAt
  deletedAt       DateTime?

  @@index([active])
  @@index([key])
}

model Campaign {
  id              String             @id @default(uuid())
  title           String
  description     String?
  channel         Channel            @default(WHATSAPP)
  status          CampaignStatus     @default(RASCUNHO)

  scheduledFor    DateTime?
  sentAt          DateTime?

  targetFilter    String             @db.Text
  templateMessage String             @db.Text

  totalEligible   Int                @default(0)
  totalSent       Int                @default(0)
  totalDelivered  Int                @default(0)
  totalRead       Int                @default(0)
  totalReplied    Int                @default(0)
  totalConverted  Int                @default(0)

  createdById     String?
  createdBy       User?              @relation("CampaignCreator", fields: [createdById], references: [id], onDelete: SetNull)

  createdAt       DateTime           @default(now())
  updatedAt       DateTime           @updatedAt
  deletedAt       DateTime?

  recipients      CampaignRecipient[]

  @@index([status])
  @@index([channel])
  @@index([scheduledFor])
}

model CampaignRecipient {
  id            String          @id @default(uuid())
  campaignId    String
  campaign      Campaign        @relation(fields: [campaignId], references: [id], onDelete: Cascade)
  customerId    String
  customer      Customer        @relation(fields: [customerId], references: [id], onDelete: Cascade)

  channel       Channel         @default(WHATSAPP)
  status        RecipientStatus @default(FILA)
  sentAt        DateTime?
  errorReason   String?

  createdAt     DateTime        @default(now())

  @@unique([campaignId, customerId])
  @@index([campaignId])
  @@index([customerId])
  @@index([status])
}

// ----------------------------------------------------------------------------
// LISTA DE DESEJO (WISHLIST) & ENCOMENDAS
// ----------------------------------------------------------------------------
model Wishlist {
  id            String         @id @default(uuid())
  customerId    String
  customer      Customer       @relation(fields: [customerId], references: [id], onDelete: Cascade)
  variantId     String?
  variant       ProductVariant? @relation(fields: [variantId], references: [id], onDelete: Cascade)

  desiredCategory String?
  desiredSize     String?
  desiredColor    String?

  status        WishlistStatus @default(DESEJADO)
  priority      Int            @default(1)
  notes         String?
  notifiedAt    DateTime?

  createdAt     DateTime       @default(now())
  updatedAt     DateTime       @updatedAt
  deletedAt     DateTime?

  @@index([customerId])
  @@index([variantId])
  @@index([status])
}
`;

export const PRISMA_MIGRATION_SQL = `-- Migration: 20261012000000_init_ravis_crm.sql
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TYPE "Role" AS ENUM ('ADMIN', 'CURADOR', 'ATENDENTE');
CREATE TYPE "FitPreference" AS ENUM ('SLIM_FIT', 'REGULAR_FIT', 'ALFAIATARIA_MODERNA', 'LONGLINE', 'OVERSIZED');
CREATE TYPE "ConditionalStatus" AS ENUM ('CRIADO', 'EM_PREPARACAO', 'ENVIADO', 'EM_TESTE', 'FINALIZADO', 'CANCELADO', 'VENCIDO');
CREATE TYPE "ConditionalItemStatus" AS ENUM ('EM_EXPERIMENTACAO', 'COMPRADO', 'DEVOLVIDO');
CREATE TYPE "OrderChannel" AS ENUM ('ONLINE_WHATSAPP', 'PDV_FISICO_CANOINHAS', 'ECOMMERCE');
CREATE TYPE "OrderStatus" AS ENUM ('PENDENTE', 'PAGO', 'EM_SEPARACAO', 'ENVIADO', 'ENTREGUE', 'CANCELADO');
CREATE TYPE "PaymentMethod" AS ENUM ('PIX', 'CARTAO_CREDITO', 'CARTAO_DEBITO', 'DINHEIRO', 'LINK_MERCADO_PAGO', 'LINK_STRIPE');
CREATE TYPE "PaymentStatus" AS ENUM ('PENDENTE', 'APROVADO', 'RECUSADO', 'ESTORNADO');
CREATE TYPE "Channel" AS ENUM ('WHATSAPP', 'INSTAGRAM', 'EMAIL');
CREATE TYPE "ConversationStatus" AS ENUM ('ABERTO', 'EM_ATENDIMENTO', 'AGUARDANDO_CLIENTE', 'RESOLVIDO', 'ARQUIVADO');
CREATE TYPE "SenderType" AS ENUM ('CLIENT', 'CURATOR', 'BOT_AUTOMATION');
CREATE TYPE "MessageStatus" AS ENUM ('ENVIADO', 'ENTREGUE', 'LIDO', 'FALHA');
CREATE TYPE "InteractionType" AS ENUM ('WHATSAPP', 'INSTAGRAM', 'EMAIL', 'CONDICIONAL', 'VISITA_LOJA', 'PAGAMENTO', 'NOTA_CURADOR', 'CHAMADA_TELEFONICA');
CREATE TYPE "InventoryMovementType" AS ENUM ('ENTRADA', 'SAIDA_VENDA', 'RESERVA_CONDICIONAL', 'LIBERACAO_CONDICIONAL', 'AJUSTE_BALANCO', 'DEVOLUCAO');
CREATE TYPE "CampaignStatus" AS ENUM ('RASCUNHO', 'AGENDADA', 'EM_DISPARO', 'CONCLUIDA', 'CANCELADA');
CREATE TYPE "RecipientStatus" AS ENUM ('FILA', 'ENVIADO', 'ENTREGUE', 'LIDO', 'RESPONDEU', 'CONVERTEU', 'FALHA', 'OPT_OUT');
CREATE TYPE "WishlistStatus" AS ENUM ('DESEJADO', 'NOTIFICADO', 'DISPONIVEL', 'ATENDIDO', 'EXPIRADO');
CREATE TYPE "LgpdConsentStatus" AS ENUM ('OPT_IN', 'PENDENTE', 'OPT_OUT');

-- Tabelas Criadas: User, Customer, StyleProfile, Tag, CustomerTag, Product, ProductVariant,
-- InventoryMovement, ConditionalBox, ConditionalItem, Order, OrderItem, Payment, Conversation,
-- Message, Interaction, Automation, Campaign, CampaignRecipient, Wishlist.
-- Total: 20 tabelas com índices em phone, instagram, status, skus e chaves estrangeiras com integridade relacional.
-- (Ver arquivo prisma/migrations/20261012000000_init_ravis_crm/migration.sql para DDL completo)
`;

export const PRISMA_SEED_CODE = `// prisma/seed.ts - Executável via tsx prisma/seed.ts ou prisma/seed.sql
// Contém 3 Clientes VIP de Canoinhas (Dr. Guilherme, Rodrigo Silveira, Dr. Carlos Eduardo),
// 8 Produtos Selecionados Ravi's com Unidades Limitadas (1-3 por SKU),
// e 1 Mala Condicional Real (COND-2026-088) com 4 peças, conversão e movimentações Kardex.
// (Ver arquivos prisma/seed.ts e prisma/seed.sql para código fonte completo)
`;

export interface ApiEndpointSpec {
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  path: string;
  tag: string;
  summary: string;
  auth: string;
  rateLimit: string;
  isCuratorKeyAction?: boolean;
}

export const API_ENDPOINTS_SPECS: ApiEndpointSpec[] = [
  // Auth
  { method: 'POST', path: '/v1/auth/login', tag: 'Auth', summary: 'Autenticar com e-mail/senha e emitir JWT + Refresh Token', auth: 'Public', rateLimit: '5 req/min' },
  { method: 'GET', path: '/v1/auth/me', tag: 'Auth', summary: 'Obter dados do usuário logado e permissões RBAC', auth: 'JWT / Session', rateLimit: '60 req/min' },

  // Customers
  { method: 'GET', path: '/v1/customers', tag: 'Customers', summary: 'Listar clientes com busca, paginação, filtros de tamanho e LGPD', auth: 'JWT / Session', rateLimit: '120 req/min' },
  { method: 'POST', path: '/v1/customers', tag: 'Customers', summary: 'Cadastrar cliente com StyleProfile integrado e consentimento LGPD', auth: 'JWT (Atendente+)', rateLimit: '60 req/min' },
  { method: 'GET', path: '/v1/customers/:id', tag: 'Customers', summary: 'Visão 360° do cliente: medidas, timeline, LTV e condicionais', auth: 'JWT / Session', rateLimit: '120 req/min' },
  { method: 'PUT', path: '/v1/customers/:id', tag: 'Customers', summary: 'Atualizar dados cadastrais e preferências de caimento/tamanhos', auth: 'JWT / Session', rateLimit: '60 req/min' },
  { method: 'DELETE', path: '/v1/customers/:id', tag: 'Customers', summary: 'Soft-delete e anonimização LGPD do cliente (deletedAt)', auth: 'JWT (Admin)', rateLimit: '30 req/min' },
  { method: 'POST', path: '/v1/customers/segmentation', tag: 'Customers', summary: 'Query booleana de segmentação por tamanhos, tags e inatividade', auth: 'JWT / Session', rateLimit: '60 req/min' },

  // Products & Variants (Estoque)
  { method: 'GET', path: '/v1/products', tag: 'Products', summary: 'Catálogo Pomelli com fotos, categorias e filtros de estoque', auth: 'JWT / Session', rateLimit: '120 req/min' },
  { method: 'POST', path: '/v1/products', tag: 'Products', summary: 'Cadastrar produto com variantes (SKUs, grade e unidades limitadas)', auth: 'JWT (Admin/Curador)', rateLimit: '30 req/min' },
  { method: 'GET', path: '/v1/products/:id', tag: 'Products', summary: 'Detalhe do produto com histórico de movimentações Kardex', auth: 'JWT / Session', rateLimit: '120 req/min' },
  { method: 'PATCH', path: '/v1/variants/:id/inventory', tag: 'Products', summary: 'Ajuste manual ou entrada/saída física de estoque com log Kardex', auth: 'JWT (Curador/Admin)', rateLimit: '60 req/min' },

  // Conditional Boxes (Curadoria)
  { method: 'GET', path: '/v1/conditional-boxes', tag: 'Conditionals', summary: 'Listar malas por status (Criado, Em Teste, Finalizado) e curador', auth: 'JWT / Session', rateLimit: '120 req/min' },
  { method: 'POST', path: '/v1/conditional-boxes', tag: 'Conditionals', summary: 'Criar mala condicional vazia vinculando cliente e curador', auth: 'JWT (Curador+)', rateLimit: '60 req/min' },
  { method: 'POST', path: '/v1/conditional-boxes/:id/assemble-and-send', tag: 'Conditionals', summary: 'MONTAR SELEÇÃO E ENVIAR AO CLIENTE (Reserva atômica de estoque + WhatsApp + BullMQ)', auth: 'JWT (Curador)', rateLimit: '30 req/min', isCuratorKeyAction: true },
  { method: 'PATCH', path: '/v1/conditional-boxes/:id/status', tag: 'Conditionals', summary: 'Mudar status do ciclo de vida da mala e registrar notas de entrega', auth: 'JWT / Session', rateLimit: '60 req/min' },
  { method: 'POST', path: '/v1/conditional-boxes/:id/return', tag: 'Conditionals', summary: 'Registrar devolução/compra: gera Pedido de Venda e retorna itens ao estoque', auth: 'JWT (Curador+)', rateLimit: '60 req/min' },

  // Orders & Checkout
  { method: 'GET', path: '/v1/orders', tag: 'Orders', summary: 'Listar pedidos faturados por canal (WhatsApp vs PDV Canoinhas)', auth: 'JWT / Session', rateLimit: '120 req/min' },
  { method: 'POST', path: '/v1/orders', tag: 'Orders', summary: 'Criar pedido de venda física no PDV ou WhatsApp com baixa definitiva', auth: 'JWT / Session', rateLimit: '60 req/min' },
  { method: 'POST', path: '/v1/orders/:id/payments', tag: 'Orders', summary: 'Gerar link Mercado Pago/Stripe ou QR Code Pix dinâmico instantâneo', auth: 'JWT / Session', rateLimit: '60 req/min' },

  // Conversations & Messages
  { method: 'GET', path: '/v1/conversations', tag: 'Inbox', summary: 'Fila unificada do Inbox (WhatsApp, Instagram Direct e E-mail)', auth: 'JWT / Session', rateLimit: '120 req/min' },
  { method: 'GET', path: '/v1/conversations/:id/messages', tag: 'Inbox', summary: 'Histórico de mensagens de chat ordenado cronologicamente', auth: 'JWT / Session', rateLimit: '120 req/min' },
  { method: 'POST', path: '/v1/conversations/:id/messages', tag: 'Inbox', summary: 'Enviar mensagem direta ou agendada para o cliente no canal', auth: 'JWT / Session', rateLimit: '60 req/min' },

  // Automations & Campaigns
  { method: 'GET', path: '/v1/automations', tag: 'Automations', summary: 'Listar 5 réguas ativas (Boas-vindas, 3 dias condicional, 60 dias sem compra, etc.)', auth: 'JWT (Admin/Curador)', rateLimit: '60 req/min' },
  { method: 'POST', path: '/v1/automations', tag: 'Automations', summary: 'Criar ou calibrar gatilhos e templates de automação', auth: 'JWT (Admin)', rateLimit: '30 req/min' },
  { method: 'GET', path: '/v1/campaigns', tag: 'Campaigns', summary: 'Listar campanhas segmentadas e taxas de entrega/conversão', auth: 'JWT / Session', rateLimit: '60 req/min' },
  { method: 'POST', path: '/v1/campaigns', tag: 'Campaigns', summary: 'Criar campanha com filtro de segmentação e mensagem aprovada', auth: 'JWT (Admin/Curador)', rateLimit: '30 req/min' },
  { method: 'POST', path: '/v1/campaigns/:id/trigger', tag: 'Campaigns', summary: 'Disparo em massa com rate-limit humanizado e respeito a horário comercial', auth: 'JWT (Admin)', rateLimit: '10 req/min' },

  // Analytics & BI
  { method: 'GET', path: '/v1/analytics/overview', tag: 'Analytics', summary: 'Dashboard do gestor: faturamento, ticket médio, taxa conversão condicional e LTV', auth: 'JWT (Admin)', rateLimit: '60 req/min' },
  { method: 'GET', path: '/v1/analytics/curators', tag: 'Analytics', summary: 'Ranking e métricas por curador: malas montadas, conversão e comissão', auth: 'JWT (Admin)', rateLimit: '60 req/min' },

  // Inbound Webhooks
  { method: 'POST', path: '/v1/webhooks/evolution-api', tag: 'Webhooks Inbound', summary: 'Recebimento de mensagens WhatsApp em tempo real (Evolution API)', auth: 'X-Evolution-Secret', rateLimit: '1000 req/min' },
  { method: 'POST', path: '/v1/webhooks/instagram-graph', tag: 'Webhooks Inbound', summary: 'Recebimento de DMs e interações Instagram Direct (Graph API)', auth: 'X-Hub-Signature-256', rateLimit: '1000 req/min' },
  { method: 'POST', path: '/v1/webhooks/payments', tag: 'Webhooks Inbound', summary: 'Confirmação de Pix e Cartão Mercado Pago / Stripe', auth: 'X-Signature HMAC', rateLimit: '500 req/min' },

  // Outbound Webhooks
  { method: 'POST', path: '/v1/webhooks/outbound/conditional-dispatched', tag: 'Webhooks Outbound', summary: 'Notificação externa para serviço Leva e Traz VIP de Canoinhas', auth: 'HMAC Webhook', rateLimit: 'N/A' },
];

export const ASSEMBLE_AND_SEND_EXAMPLE_PAYLOAD = {
  endpoint: 'POST /v1/conditional-boxes/:id/assemble-and-send',
  description: 'Payload de montagem de mala condicional executado pelo curador com validação de StyleProfile e reserva atômica de estoque',
  requestBody: {
    curatorId: "1a2b3c4d-5e6f-7a8b-9c0d-1e2f3a4b5c6d",
    deliveryMethod: "LEVA_E_TRAZ_VIP",
    testDurationDays: 3,
    dispatchNotes: "Seleção montada com 4 peças em linho e modal sob medida para o Dr. Guilherme Schramm.",
    items: [
      {
        variantId: "4b87cf31-7e8e-4752-b88e-c1cfc14b3011",
        stylingTip: "Camiseta Slim Algodão Egípcio Preto (M). Combine com a Chino Tech para o dia a dia na clínica.",
        specialPriceOverride: 280.00
      },
      {
        variantId: "4b87cf31-7e8e-4752-b88e-c1cfc14b3013",
        stylingTip: "Tricô Modal Canelado Off-White (M). Toque macio e caimento clássico impecável.",
        specialPriceOverride: 489.00
      },
      {
        variantId: "4b87cf31-7e8e-4752-b88e-c1cfc14b3016",
        stylingTip: "Calça Chino Tech Chumbo (Tam 42). Alta mobilidade com alfaiataria italiana.",
        specialPriceOverride: 489.00
      },
      {
        variantId: "4b87cf31-7e8e-4752-b88e-c1cfc14b3017",
        stylingTip: "Camisa Linho Puro Riviera Areia (M). Leveza e elegância natural para jantares.",
        specialPriceOverride: 591.00
      }
    ],
    notification: {
      sendWhatsAppImmediately: true,
      customWhatsAppMessage: "Olá Dr. Guilherme! Mateus da Ravi's aqui. Montei uma seleção exclusiva de 4 peças em tons sóbrios e linho, perfeitamente alinhadas ao seu tamanho M/42. Nosso motorista VIP acabou de sair para entregar em seu consultório."
    }
  },
  responseBody: {
    boxId: "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d",
    code: "COND-2026-088",
    status: "ENVIADO",
    totalAmount: 1849.00,
    itemsCount: 4,
    reservedItems: [
      { sku: "RAV-CSL-01-M-BLK", productName: "Camiseta Slim Algodão Egípcio Preto", stockRemainingAvailable: 1 },
      { sku: "RAV-TRC-03-M-OFF", productName: "Tricô Modal Canelado Off-White", stockRemainingAvailable: 1 },
      { sku: "RAV-CAL-06-42-CHM", productName: "Calça Chino Tech Chumbo", stockRemainingAvailable: 0 },
      { sku: "RAV-LNH-07-M-SND", productName: "Camisa Linho Riviera Areia", stockRemainingAvailable: 1 }
    ],
    dispatchTrackingUrl: "https://ravispremium.com.br/condicional/COND-2026-088",
    whatsAppDispatched: true,
    whatsAppMessageId: "wamid.HBgLNTU0Nzk5MTIzNDU2NxUCABEYEjA1MzQ...",
    scheduledReminderAt: "2026-10-15T10:00:00-03:00"
  }
};


