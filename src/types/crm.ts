export type SizeShirt = 'P' | 'M' | 'G' | 'GG' | 'XG';
export type SizePants = '38' | '40' | '42' | '44' | '46' | '48';
export type SizeShoes = '39' | '40' | '41' | '42' | '43' | '44';

export type FitPreference = 
  | 'Slim Fit'
  | 'Regular Fit'
  | 'Alfaiataria Moderna'
  | 'Longline'
  | 'Oversized Minimalista';

export type ClientTier = 'VIP Platinum' | 'VIP Ouro' | 'Recorrente' | 'Novo Cliente';

export interface ClientSizes {
  shirt: SizeShirt;
  pants: SizePants;
  shoes: SizeShoes;
  fitPreference: FitPreference;
  heightCm?: number;
  weightKg?: number;
}

export interface ClientStyleProfile {
  palette: string[];
  favoriteCategories: string[];
  avoidItems: string[];
  lifestyle: string;
  profession: string;
}

export interface ClientMetrics {
  totalLtv: number;
  ordersCount: number;
  condicionaisCount: number;
  condicionalConversionRate: number; // e.g. 78%
  averageTicket: number;
  lastInteractionDate: string;
}

export type StyleTag = 'Clássico' | 'Moderno' | 'Casual' | 'Social' | 'Minimalista' | 'Rústico Chic' | 'Urbano';

export interface PurchasedPieceHistory {
  id: string;
  title: string;
  category: string;
  color: string;
  fit: string;
  date: string;
  price: number;
}

export interface ReturnedPieceHistory {
  id: string;
  title: string;
  category: string;
  size: string;
  reason: string;
  date: string;
}

export interface ClientTimelineEvent {
  id: string;
  type: 'WHATSAPP' | 'INSTAGRAM' | 'EMAIL' | 'CONDICIONAL' | 'VISITA_LOJA' | 'PAGAMENTO' | 'NOTA_CURADOR';
  title: string;
  description: string;
  timestamp: string;
}

export interface Client {
  id: string;
  name: string;
  phone: string;
  email: string;
  instagram?: string;
  city: string;
  neighborhood: string;
  address: string;
  tier: ClientTier;
  sizes: ClientSizes;
  style: ClientStyleProfile;
  styleTags: StyleTag[];
  customTags: string[];
  metrics: ClientMetrics;
  purchasedPieces: PurchasedPieceHistory[];
  returnedPieces: ReturnedPieceHistory[];
  timeline: ClientTimelineEvent[];
  curatorNotes: string[];
  preferredCurator: string;
  createdAt: string;
  birthDate?: string;
  lgpdConsent?: 'OPT_IN' | 'PENDENTE' | 'OPT_OUT';
  lgpdConsentDate?: string;
  lastPurchaseDate?: string;
}

export type CondicionalStatus = 
  | 'RASCUNHO'    // Curador monta seleção
  | 'AGENDADO'    // Data programada para saída
  | 'ENVIADO'     // Retirada na loja ou entrega a caminho
  | 'EM_TESTE'    // Cliente tem X dias (padrão 7 dias)
  | 'FINALIZADO'; // Status final: COMPRADO (inteiro ou parcial) ou DEVOLVIDO

export type CondicionalFinalOutcome = 'COMPRADO_INTEIRO' | 'COMPRADO_PARCIAL' | 'DEVOLVIDO_TOTAL';

export type ReturnReasonCategory = 'TAMANHO' | 'ESTILO' | 'PRECO' | 'OUTRO';

export interface CondicionalItem {
  id: string;
  productId: string;
  productCode: string;
  title: string;
  category: string;
  size: string;
  price: number;
  imageUrl?: string;
  imageAccent?: string;
  material?: string;
  color?: string;
  status: 'PENDENTE' | 'COMPRADA' | 'DEVOLVIDA';
  returnReasonCategory?: ReturnReasonCategory;
  returnReason?: string;
}

export interface CondicionalBox {
  id: string;
  code: string; // e.g. "COND-2026-089"
  clientId: string;
  clientName: string;
  clientPhone: string;
  clientAddress: string;
  curatorName: string;
  status: CondicionalStatus;
  finalOutcome?: CondicionalFinalOutcome;
  items: CondicionalItem[];
  totalValue: number;
  soldValue: number;
  createdAt: string;
  scheduledForDate?: string;
  sentAt?: string;
  testDurationDays: number; // Padrão 7 dias
  deadlineDate: string; // ISO date string
  daysRemaining: number;
  hoursRemaining: number;
  deliveryMethod: 'Entrega VIP Motorista Ravi\'s' | 'Retirada na Loja Canoinhas' | 'Sedex Express Planalto Norte';
  notes?: string;
  confirmationToken: string;
  isConfirmedByClient: boolean;
  confirmedAt?: string;
  whatsappLog: {
    messageType: string;
    sentAt: string;
    status: 'ENVIADO' | 'ENTREGUE' | 'LIDO';
    previewSnippet?: string;
  }[];
  reminders: {
    day3Sent: boolean;
    day3SentAt?: string;
    day6Sent: boolean;
    day6SentAt?: string;
    curatorAlertSent: boolean;
    curatorAlertSentAt?: string;
  };
}

export type ProductCategory = 
  | 'Camiseta Slim'
  | 'Camiseta Longline'
  | 'Tricô'
  | 'Sobretudo'
  | 'Cachecol'
  | 'Calça'
  | 'Calças'
  | 'Camisas' 
  | 'Blazers' 
  | 'Polos & Malharia' 
  | 'Calçados' 
  | 'Acessórios';

export interface ProductStockBySize {
  total: number;
  reserved: number; // Reserved in active condicionais
  available: number;
}

export interface Product {
  id: string;
  code: string;
  title: string;
  category: ProductCategory;
  price: number;
  costPrice: number;
  material: string;
  color: string;
  fitType: FitPreference;
  limitedEditionCount: number; // e.g. 1-3 unidades por SKU
  description: string;
  stockBySize: Record<string, ProductStockBySize>;
  tag: string;
  imageAccent: string; // Color swatch or styling tone
  imageUrl: string;
  photoshootSource?: string; // Ex: 'Photoshoot do Pomelli'
}

export interface PredictiveConversionItem {
  id: string;
  productId: string;
  productTitle: string;
  productCategory: string;
  imageUrl: string;
  clientProfileType: string; // Ex: 'Médico / Agro (Slim, Linho, Tons Terrosos)'
  conversionRate: number; // Ex: 94.2%
  totalSent: number;
  totalKept: number;
  primaryReturnReason: string;
  recommendationScore: number; // 0 - 100
  rationale: string;
}

export type MessageChannel = 'WHATSAPP' | 'INSTAGRAM' | 'EMAIL';
export type ConversationStatus = 'ABERTO' | 'EM_ATENDIMENTO' | 'AGUARDANDO_CLIENTE' | 'RESOLVIDO';

export interface UnifiedMessage {
  id: string;
  channel: MessageChannel;
  clientId: string;
  clientName: string;
  clientPhone: string;
  sender: 'CLIENT' | 'CURATOR' | 'SYSTEM';
  content: string;
  timestamp: string;
  read: boolean;
  linkedCondicionalId?: string;
  assignedAgent?: string;
  status?: 'ENVIADO' | 'ENTREGUE' | 'LIDO';
  templateUsedId?: string;
}

export interface Conversation {
  id: string;
  clientId: string;
  clientName: string;
  clientPhone: string;
  clientInstagram?: string;
  clientEmail?: string;
  channel: MessageChannel;
  assignedAgent: string;
  status: ConversationStatus;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  tags: string[];
}

export interface ScheduledMessage {
  id: string;
  clientId: string;
  clientName: string;
  clientPhone: string;
  channel: MessageChannel;
  content: string;
  scheduledFor: string;
  status: 'PENDENTE' | 'DISPARADO' | 'CANCELADO';
  creatorName: string;
  createdAt: string;
}

export interface QuickReply {
  id: string;
  shortcut: string;
  title: string;
  content: string;
  category: 'ATENDIMENTO' | 'CONDICIONAL' | 'PAGAMENTO' | 'LOJA';
}

export interface ApprovedTemplate {
  id: string;
  name: string;
  category: 'ONBOARDING' | 'CONDICIONAL' | 'ANIVERSARIO' | 'REATIVACAO' | 'DROP_CATALOGO' | 'COBRANCA';
  text: string;
  variables: string[];
  metaStatus: 'APROVADO_META' | 'OFICIAL_RAVIS';
}

export interface AutomationRule {
  id: string;
  key: 'NOVO_CLIENTE' | 'CONDICIONAL_D3' | 'ANIVERSARIANTE' | 'REATIVACAO_60D' | 'DROP_NOVA_PECA';
  name: string;
  description: string;
  trigger: string;
  condition: string;
  action: string;
  channel: MessageChannel | 'MULTICANAL';
  isActive: boolean;
  totalExecutions: number;
  successRate: number;
  lastExecutedAt?: string;
  templateText: string;
}

export interface AutomationLog {
  id: string;
  automationKey: string;
  automationName: string;
  clientId: string;
  clientName: string;
  channel: MessageChannel;
  status: 'SUCESSO' | 'AGUARDANDO_JANELA' | 'FALHA';
  executedAt: string;
  details: string;
  messagePreview: string;
}

export interface CampaignFilter {
  size?: string;
  style?: string;
  history?: string;
  condicionalHistory?: string;
  city?: string;
}

export interface Campaign {
  id: string;
  name: string;
  targetFilter: CampaignFilter;
  channel: MessageChannel | 'MULTICANAL';
  templateMessage: string;
  eligibleCount: number;
  status: 'RASCUNHO' | 'AGENDADA' | 'DISPARADA' | 'CONCLUIDA';
  scheduledFor?: string;
  createdAt: string;
  stats?: {
    sent: number;
    delivered: number;
    read: number;
    replied: number;
    converted: number;
  };
  respectsBusinessHours: boolean;
  respectsLgpd: boolean;
}

export interface AnalyticsSummary {
  condicionalConversionRate: number; // e.g. 68.4%
  totalInTransitValue: number; // e.g. R$ 28.450
  activeCondicionaisCount: number;
  monthlyRevenue: {
    condicional: number;
    store: number;
    ecommerce: number;
  };
  returnReasonsBreakdown: { reason: string; percentage: number; count: number }[];
  topSelectedItems: { title: string; selections: number; conversionRate: number }[];
  curatorPerformance: { name: string; boxesSent: number; conversionRate: number; revenue: number }[];
}

export type OrderChannel = 'ONLINE' | 'PDV_CANOINHAS';
export type PaymentMethod = 'PIX' | 'MERCADO_PAGO_LINK' | 'STRIPE_CARD' | 'CARTAO_MAQUININHA_PDV' | 'DINHEIRO';
export type PaymentStatus = 'PENDENTE' | 'PAGO' | 'ESTORNADO';
export type OrderStatus = 'PENDENTE' | 'PAGO' | 'ENVIADO' | 'ENTREGUE';

export interface OrderItem {
  id: string;
  productId: string;
  productCode: string;
  title: string;
  category: ProductCategory;
  size: string;
  color: string;
  quantity: number;
  unitPrice: number;
  costPrice: number;
  subtotal: number;
  imageUrl?: string;
}

export interface Order {
  id: string;
  code: string; // Ex: "PED-2026-104"
  channel: OrderChannel;
  clientId: string;
  clientName: string;
  clientPhone: string;
  clientCity: string;
  curatorId: string;
  curatorName: string; // Atendente vinculado
  commissionRate: number; // Ex: 0.06 (6%)
  commissionValue: number; // Ex: R$ 89,40
  items: OrderItem[];
  subtotal: number;
  discount: number;
  shippingFee: number;
  totalValue: number;
  grossProfit: number; // totalValue - totalCost
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  whatsappPaymentLink?: string;
  createdAt: string;
  paidAt?: string;
  deliveredAt?: string;
  notes?: string;
}

export type WishlistStatus = 'AGUARDANDO_CURADORIA' | 'PECA_CHEGOU_AVISAR' | 'CONVERTIDO_CONDICIONAL' | 'FINALIZADO';

export interface WishlistItem {
  id: string;
  clientId: string;
  clientName: string;
  clientPhone: string;
  clientInstagram?: string;
  categoryRequested: ProductCategory | string;
  preferredColor: string;
  preferredSize: string; // P, M, 40, etc.
  maxBudget?: number;
  notes: string; // Ex: "Cliente quer sobretudo chumbo para viagem em julho"
  status: WishlistStatus;
  matchedProductId?: string; // ID da peça quando encontrada no photoshoot ou catálogo
  matchedProductTitle?: string;
  matchedProductImage?: string;
  createdAt: string;
  notifiedAt?: string;
}
