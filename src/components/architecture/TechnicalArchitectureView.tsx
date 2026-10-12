import React, { useState } from 'react';
import { 
  TECHNICAL_STACK_DATA, 
  RBAC_ROLES_DATA, 
  INFRA_ESTIMATES, 
  PRISMA_SCHEMA_CODE,
  PRISMA_MODULES_MAPPING,
  PRISMA_MIGRATION_SQL,
  PRISMA_SEED_CODE,
  API_ENDPOINTS_SPECS,
  ASSEMBLE_AND_SEND_EXAMPLE_PAYLOAD
} from '../../data/technicalArchitecture';
import { 
  Layers, 
  Server, 
  ShieldCheck, 
  WifiOff, 
  DollarSign, 
  FileCode, 
  Check, 
  Copy, 
  Database, 
  Cpu, 
  Lock, 
  Zap, 
  MessageSquare, 
  CreditCard, 
  Cloud, 
  Activity, 
  ArrowRight,
  ChevronDown,
  ChevronRight,
  Users,
  Smartphone,
  Terminal,
  Code
} from 'lucide-react';

export const TechnicalArchitectureView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
    'LAYERS' | 'STACK' | 'RBAC' | 'OFFLINE' | 'SECURITY' | 'APIS_PRISMA' | 'FINOPS'
  >('LAYERS');

  const [copiedSchema, setCopiedSchema] = useState(false);
  const [copiedContract, setCopiedContract] = useState(false);
  const [copiedMigration, setCopiedMigration] = useState(false);
  const [copiedSeed, setCopiedSeed] = useState(false);
  const [copiedPayload, setCopiedPayload] = useState(false);
  const [schemaSubTab, setSchemaSubTab] = useState<'OPENAPI' | 'ASSEMBLE_PAYLOAD' | 'MAPPING' | 'SCHEMA' | 'MIGRATION' | 'SEED' | 'TRPC'>('OPENAPI');
  const [apiFilterTag, setApiFilterTag] = useState<string>('ALL');
  const [selectedCostTier, setSelectedCostTier] = useState<number>(0);
  const [expandedLayer, setExpandedLayer] = useState<string | null>('APPLICATION');

  const handleCopySchema = () => {
    navigator.clipboard?.writeText(PRISMA_SCHEMA_CODE);
    setCopiedSchema(true);
    setTimeout(() => setCopiedSchema(false), 2000);
  };

  const handleCopyMigration = () => {
    navigator.clipboard?.writeText(PRISMA_MIGRATION_SQL);
    setCopiedMigration(true);
    setTimeout(() => setCopiedMigration(false), 2000);
  };

  const handleCopySeed = () => {
    navigator.clipboard?.writeText(PRISMA_SEED_CODE);
    setCopiedSeed(true);
    setTimeout(() => setCopiedSeed(false), 2000);
  };

  const sampleTrpcCode = `// trpc/routers/condicional.ts - Contrato de API Type-Safe
import { z } from 'zod';
import { router, curatorProcedure, adminProcedure } from '../trpc';
import { TRPCError } from '@trpc/server';

export const condicionalRouter = router({
  // 1. Montagem de Mala com Reserva Atômica de Estoque
  createBox: curatorProcedure
    .input(z.object({
      clientId: z.string().cuid(),
      items: z.array(z.object({
        productId: z.string().cuid(),
        size: z.string().min(1),
      })).min(1).max(10),
      testDurationHours: z.number().default(48),
      deliveryMethod: z.string(),
      notes: z.string().optional()
    }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.$transaction(async (tx) => {
        // Validação e bloqueio pessimista de estoque por tamanho
        for (const item of input.items) {
          const stock = await tx.stockLevel.findUnique({
            where: { productId_size: { productId: item.productId, size: item.size } }
          });
          if (!stock || stock.available <= 0) {
            throw new TRPCError({
              code: 'PRECONDITION_FAILED',
              message: \`Estoque indisponível para o produto \${item.productId} tamanho \${item.size}\`
            });
          }
          // Incrementa reserva atômica
          await tx.stockLevel.update({
            where: { id: stock.id },
            data: { reserved: { increment: 1 }, available: { decrement: 1 } }
          });
        }
        // Criação da Mala e enfileiramento do job BullMQ de 48h
        const box = await tx.condicionalBox.create({
          data: {
            clientId: input.clientId,
            curatorId: ctx.session.user.id,
            status: 'SELECAO_MONTADA',
            deadlineDate: new Date(Date.now() + input.testDurationHours * 3600 * 1000),
            items: { create: input.items.map(i => ({ productId: i.productId, size: i.size, priceInCents: 58900 })) }
          }
        });
        await ctx.bullmq.addCondicionalTimer(box.id, input.testDurationHours);
        return box;
      });
    }),

  // 2. Fechamento de Mala: Check-in de Peças e Devolução ao Estoque
  checkout: curatorProcedure
    .input(z.object({
      boxId: z.string().cuid(),
      decisions: z.array(z.object({
        itemId: z.string().cuid(),
        decision: z.enum(['COMPRADA', 'DEVOLVIDA']),
        returnReason: z.string().optional()
      })),
      paymentMethod: z.enum(['PIX', 'CREDIT_CARD', 'FATURADO_VIP'])
    }))
    .mutation(async ({ ctx, input }) => {
      // Processa itens e reconcilia estoque (restaura peças devolvidas)
      return await ctx.services.condicional.settleBox(input);
    })
});`;

  const sampleOfflineSyncCode = `// lib/offline/syncEngine.ts - Sincronização Offline-First para Chão de Loja
import Dexie, { Table } from 'dexie';

interface OfflineMutation {
  id: string; // UUID v4 idempotente
  endpoint: string; // ex: 'condicional.updateStatus'
  payload: any;
  createdAt: number;
  retryCount: number;
  status: 'PENDING' | 'SYNCING' | 'FAILED';
}

class RavisOfflineDatabase extends Dexie {
  mutations!: Table<OfflineMutation, string>;
  clientsCache!: Table<any, string>;
  stockCache!: Table<any, string>;

  constructor() {
    super('RavisOfflineDB');
    this.version(1).stores({
      mutations: 'id, createdAt, status',
      clientsCache: 'id, phone, name',
      stockCache: 'productId, size'
    });
  }
}

export const offlineDb = new RavisOfflineDatabase();

export async function processOutboxQueue() {
  if (!navigator.onLine) return;

  const pending = await offlineDb.mutations
    .where('status')
    .equals('PENDING')
    .sortBy('createdAt');

  for (const item of pending) {
    try {
      await offlineDb.mutations.update(item.id, { status: 'SYNCING' });
      const res = await fetch('/api/trpc/' + item.endpoint, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'X-Idempotency-Key': item.id 
        },
        body: JSON.stringify(item.payload)
      });
      if (res.ok) {
        await offlineDb.mutations.delete(item.id);
      } else {
        await offlineDb.mutations.update(item.id, { 
          status: 'FAILED', 
          retryCount: item.retryCount + 1 
        });
      }
    } catch (err) {
      await offlineDb.mutations.update(item.id, { status: 'PENDING' });
      break; // Aguarda estabilização de conexão
    }
  }
}`;

  return (
    <div className="space-y-6">
      {/* Blueprint Header */}
      <div className="bg-[#10141d] rounded-2xl border border-[#222a3b] p-6 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-950/80 border border-blue-500/40 text-blue-300 uppercase tracking-wider flex items-center gap-1.5">
                <Cpu className="w-3 h-3 text-blue-400" />
                Especificação Técnica de Engenharia
              </span>
              <span className="text-xs text-neutral-400">Next.js 14 • PostgreSQL • tRPC • BullMQ</span>
            </div>

            <h1 className="text-xl sm:text-2xl font-serif font-bold text-white tracking-tight">
              Arquitetura de Software do Ravis CRM
            </h1>
            <p className="text-xs sm:text-sm text-neutral-300 mt-1 max-w-3xl leading-relaxed">
              Sistema vertical de alta performance projetado para curadoria de moda masculina, ciclo de condicional com garantia ACID, sincronização offline para o chão de loja e mensageria WhatsApp via BullMQ.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleCopySchema}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#171f2d] hover:bg-[#202b3d] border border-[#29364b] text-neutral-200 text-xs font-medium transition-all"
            >
              {copiedSchema ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Database className="w-3.5 h-3.5 text-[#c99738]" />}
              <span>{copiedSchema ? 'Prisma Copiado!' : 'Copiar schema.prisma'}</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1.5 mt-6 pt-4 border-t border-[#1c2434] overflow-x-auto scrollbar-none">
          {[
            { id: 'LAYERS', label: '1. Arquitetura em Camadas', icon: Layers },
            { id: 'STACK', label: '2. Stack & Racionais', icon: Server },
            { id: 'RBAC', label: '3. Multi-Usuário (RBAC)', icon: Users },
            { id: 'OFFLINE', label: '4. Sincronização Offline', icon: WifiOff },
            { id: 'SECURITY', label: '5. Segurança & LGPD', icon: ShieldCheck },
            { id: 'APIS_PRISMA', label: '6. Contratos de API & Schema', icon: FileCode },
            { id: 'FINOPS', label: '7. Custos de Infra (FinOps)', icon: DollarSign }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-[#1e2536] text-[#f5d061] border border-[#344158] shadow-sm'
                    : 'bg-[#121620] text-neutral-400 hover:text-white hover:bg-[#181d2a]'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#c99738]' : 'text-neutral-400'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* TAB 1: Camadas da Arquitetura */}
      {activeTab === 'LAYERS' && (
        <div className="space-y-4">
          <div className="bg-[#10141d] rounded-2xl border border-[#222a3b] p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-[#1c2434] pb-3">
              <div>
                <h2 className="text-base font-serif font-bold text-white flex items-center gap-2">
                  <Layers className="w-4 h-4 text-[#c99738]" />
                  <span>Diagrama de Arquitetura em 4 Camadas (Clean / Hexagonal)</span>
                </h2>
                <p className="text-xs text-neutral-400 mt-0.5">
                  Isolamento rigoroso de regras de negócio de vestuário e adaptadores externos
                </p>
              </div>
              <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-800/40">
                Inversão de Dependência
              </span>
            </div>

            {/* Layer 1: Apresentação */}
            <div className="border border-[#263145] rounded-xl p-4 bg-[#0e121a] space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs uppercase tracking-wider text-blue-400 flex items-center gap-2">
                  <Smartphone className="w-4 h-4" />
                  <span>1. Camada de Apresentação (Presentation / UI Layer)</span>
                </span>
                <span className="text-[10px] bg-[#161f2e] text-blue-300 px-2 py-0.5 rounded border border-blue-800/40 font-mono">
                  Client / Edge
                </span>
              </div>
              <p className="text-xs text-neutral-300">
                Interface unificada mobile-first e painel administrativo do gestor.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
                <div className="bg-[#121824] p-3 rounded-lg border border-[#1e273a]">
                  <strong className="text-white block">Next.js 14 App Router</strong>
                  <span className="text-neutral-400 text-[11px]">Server Components para carregamento ultrarrápido de fichas 360°</span>
                </div>
                <div className="bg-[#121824] p-3 rounded-lg border border-[#1e273a]">
                  <strong className="text-white block">PWA Mobile-First + Tailwind</strong>
                  <span className="text-neutral-400 text-[11px]">Instalável no celular de atendentes no chão de loja e depósito</span>
                </div>
                <div className="bg-[#121824] p-3 rounded-lg border border-[#1e273a]">
                  <strong className="text-white block">Offline UI Controller</strong>
                  <span className="text-neutral-400 text-[11px]">IndexedDB Cache com aviso visual de sincronização pendente</span>
                </div>
              </div>
            </div>

            {/* Downward Arrow */}
            <div className="flex justify-center -my-1">
              <div className="bg-[#1a2233] p-1 rounded-full text-neutral-400">
                <ArrowRight className="w-3.5 h-3.5 rotate-90" />
              </div>
            </div>

            {/* Layer 2: Aplicação */}
            <div className="border border-[#2d394e] rounded-xl p-4 bg-[#111622] space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs uppercase tracking-wider text-[#f5d061] flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-[#c99738]" />
                  <span>2. Camada de Aplicação (Application / Use Cases Layer)</span>
                </span>
                <span className="text-[10px] bg-amber-950/60 text-amber-300 px-2 py-0.5 rounded border border-amber-600/40 font-mono">
                  Orquestração & tRPC
                </span>
              </div>
              <p className="text-xs text-neutral-300">
                Coordena casos de uso e orquestra transações atômicas de negócio.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
                <div className="bg-[#161d2b] p-3 rounded-lg border border-[#232f45]">
                  <strong className="text-white block">tRPC v11 Routers</strong>
                  <span className="text-neutral-400 text-[11px]">Type-safety estrito: condicionalRouter, clientRouter, catalogRouter</span>
                </div>
                <div className="bg-[#161d2b] p-3 rounded-lg border border-[#232f45]">
                  <strong className="text-white block">BullMQ Job Dispatcher</strong>
                  <span className="text-neutral-400 text-[11px]">Agendamento de lembretes D-1 (24h) e alerta de expiração de mala</span>
                </div>
                <div className="bg-[#161d2b] p-3 rounded-lg border border-[#232f45]">
                  <strong className="text-white block">NextAuth.js RBAC Guard</strong>
                  <span className="text-neutral-400 text-[11px]">Validação de papéis ADMIN, CURATOR e ATTENDANT por rota</span>
                </div>
              </div>
            </div>

            {/* Downward Arrow */}
            <div className="flex justify-center -my-1">
              <div className="bg-[#1a2233] p-1 rounded-full text-neutral-400">
                <ArrowRight className="w-3.5 h-3.5 rotate-90" />
              </div>
            </div>

            {/* Layer 3: Domínio */}
            <div className="border border-emerald-800/40 rounded-xl p-4 bg-[#0f1715] space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs uppercase tracking-wider text-emerald-400 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4" />
                  <span>3. Camada de Domínio (Domain / Core Business Rules)</span>
                </span>
                <span className="text-[10px] bg-emerald-950 text-emerald-300 px-2 py-0.5 rounded border border-emerald-800/40 font-mono">
                  Regras Puras (Zero Deps)
                </span>
              </div>
              <p className="text-xs text-neutral-300">
                Entidades ricas de vestuário e a máquina de estados canônica do Condicional.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
                <div className="bg-[#131f1c] p-3 rounded-lg border border-[#1b2f29]">
                  <strong className="text-white block">Máquina de Estados Condicional</strong>
                  <span className="text-neutral-400 text-[11px]">Seleção Montada → Caixa Enviada → Em Teste (48h) → Comprada / Devolvida</span>
                </div>
                <div className="bg-[#131f1c] p-3 rounded-lg border border-[#1b2f29]">
                  <strong className="text-white block">Invariante de Estoque por Tamanho</strong>
                  <span className="text-neutral-400 text-[11px]">Regra: Disponível = Total - Reservado. Proíbe overbooking em 100% dos casos.</span>
                </div>
                <div className="bg-[#131f1c] p-3 rounded-lg border border-[#1b2f29]">
                  <strong className="text-white block">Value Object: Antropometria</strong>
                  <span className="text-neutral-400 text-[11px]">Compatibilizador automático de grade (ex: Camisa M com Calça 42 Slim)</span>
                </div>
              </div>
            </div>

            {/* Downward Arrow */}
            <div className="flex justify-center -my-1">
              <div className="bg-[#1a2233] p-1 rounded-full text-neutral-400">
                <ArrowRight className="w-3.5 h-3.5 rotate-90" />
              </div>
            </div>

            {/* Layer 4: Infraestrutura */}
            <div className="border border-[#263145] rounded-xl p-4 bg-[#0e121a] space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs uppercase tracking-wider text-purple-400 flex items-center gap-2">
                  <Database className="w-4 h-4" />
                  <span>4. Camada de Infraestrutura (Infrastructure / Adapters)</span>
                </span>
                <span className="text-[10px] bg-purple-950 text-purple-300 px-2 py-0.5 rounded border border-purple-800/40 font-mono">
                  Sistemas Externos
                </span>
              </div>
              <p className="text-xs text-neutral-300">
                Drivers de banco de dados, gateways de mensagem, pagamentos e storage.
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                <div className="bg-[#141824] p-2.5 rounded-lg border border-[#1e273a]">
                  <strong className="text-white block text-[11px]">PostgreSQL (Neon)</strong>
                  <span className="text-neutral-400 text-[10px]">Prisma ORM + PgBouncer Pool</span>
                </div>
                <div className="bg-[#141824] p-2.5 rounded-lg border border-[#1e273a]">
                  <strong className="text-white block text-[11px]">Upstash Redis</strong>
                  <span className="text-neutral-400 text-[10px]">BullMQ Workers + Rate Limiter</span>
                </div>
                <div className="bg-[#141824] p-2.5 rounded-lg border border-[#1e273a]">
                  <strong className="text-white block text-[11px]">Evolution API</strong>
                  <span className="text-neutral-400 text-[10px]">WhatsApp Webhooks + Baileys</span>
                </div>
                <div className="bg-[#141824] p-2.5 rounded-lg border border-[#1e273a]">
                  <strong className="text-white block text-[11px]">Mercado Pago + R2</strong>
                  <span className="text-neutral-400 text-[10px]">Pix Instantâneo + Cloudflare R2</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Stack Tecnológica */}
      {activeTab === 'STACK' && (
        <div className="space-y-4">
          <div className="bg-[#10141d] rounded-2xl border border-[#222a3b] p-6 space-y-4">
            <div className="border-b border-[#1c2434] pb-3">
              <h2 className="text-base font-serif font-bold text-white flex items-center gap-2">
                <Server className="w-4 h-4 text-[#c99738]" />
                <span>Racional Técnico Detalhado da Stack Recomendada</span>
              </h2>
              <p className="text-xs text-neutral-400 mt-0.5">
                Justificativa arquitetural e tradeoffs para cada componente tecnológico
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {TECHNICAL_STACK_DATA.map((item, idx) => (
                <div key={idx} className="bg-[#0b0e14] p-4 rounded-xl border border-[#1c2434] space-y-2.5 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-neutral-400 text-[10px] uppercase font-bold tracking-wider">{item.category}</span>
                    <span className="text-[10px] bg-blue-950/70 text-blue-300 px-2 py-0.5 rounded border border-blue-700/40 font-medium">
                      {item.badge}
                    </span>
                  </div>

                  <h3 className="font-bold text-sm text-white">{item.technology}</h3>

                  <div className="bg-[#121620] p-3 rounded-lg border border-[#1f2738] space-y-1">
                    <span className="text-emerald-400 font-semibold text-[11px] block">Por que esta escolha:</span>
                    <p className="text-neutral-300 leading-relaxed text-[11px]">{item.rationale}</p>
                  </div>

                  <div className="text-[11px] text-neutral-400 pt-1">
                    <strong className="text-amber-400">Trade-offs & Mitigação: </strong>
                    <span>{item.tradeoffs}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: RBAC Multi-Usuário */}
      {activeTab === 'RBAC' && (
        <div className="space-y-4">
          <div className="bg-[#10141d] rounded-2xl border border-[#222a3b] p-6 space-y-5">
            <div className="border-b border-[#1c2434] pb-3">
              <h2 className="text-base font-serif font-bold text-white flex items-center gap-2">
                <Users className="w-4 h-4 text-[#c99738]" />
                <span>Modelo Multi-Usuário por Papel (RBAC Granular)</span>
              </h2>
              <p className="text-xs text-neutral-400 mt-0.5">
                Controle rígido de acessos para Admin (Ravi), Curador (Mateus) e Atendente (Juliana/Operador Logístico)
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {RBAC_ROLES_DATA.map((role, idx) => (
                <div key={idx} className="bg-[#0b0e14] p-4 rounded-xl border border-[#1d2535] space-y-3 text-xs flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                        idx === 0 ? 'bg-amber-400 text-black' : idx === 1 ? 'bg-blue-600 text-white' : 'bg-neutral-700 text-neutral-200'
                      }`}>
                        {role.role.split(' ')[0]}
                      </span>
                      <span className="text-[10px] text-neutral-400 font-mono">{role.scope}</span>
                    </div>

                    <h3 className="font-bold text-sm text-white mt-2">{role.role}</h3>
                    <p className="text-neutral-400 text-[11px] mt-1">{role.description}</p>

                    <div className="mt-3 space-y-2 pt-2 border-t border-[#18202d]">
                      <span className="text-neutral-300 font-semibold text-[11px] block">Permissões de Recursos:</span>
                      {role.permissions.map((perm, pIdx) => (
                        <div key={pIdx} className="bg-[#121620] p-2 rounded-lg border border-[#1f2738] space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="font-medium text-white text-[11px]">{perm.resource}</span>
                            <div className="flex items-center gap-1 text-[9px] font-mono">
                              <span className={perm.read ? 'text-emerald-400' : 'text-neutral-400'}>R</span>
                              <span className={perm.create ? 'text-blue-400' : 'text-neutral-400'}>C</span>
                              <span className={perm.update ? 'text-amber-400' : 'text-neutral-400'}>U</span>
                              <span className={perm.delete ? 'text-red-400' : 'text-neutral-400'}>D</span>
                            </div>
                          </div>
                          <span className="text-[10px] text-neutral-400 block italic">{perm.specialNotes}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Middleware implementation pattern */}
            <div className="bg-[#0d1017] p-4 rounded-xl border border-[#1e2535] space-y-2 text-xs">
              <span className="text-[#c99738] font-bold block text-xs flex items-center gap-1.5">
                <Code className="w-4 h-4" />
                <span>Padrão de Guarda tRPC com NextAuth Session (Backend Enforcement):</span>
              </span>
              <pre className="text-[11px] font-mono text-neutral-300 bg-[#07090d] p-3 rounded-lg overflow-x-auto border border-[#181d28]">
{`export const adminProcedure = t.procedure.use(async ({ ctx, next }) => {
  if (!ctx.session?.user || ctx.session.user.role !== 'ADMIN') {
    throw new TRPCError({ code: 'FORBIDDEN', message: 'Acesso restrito a administradores Ravi\'s' });
  }
  return next({ ctx: { ...ctx, user: ctx.session.user } });
});

export const curatorProcedure = t.procedure.use(async ({ ctx, next }) => {
  if (!ctx.session?.user || !['ADMIN', 'CURATOR'].includes(ctx.session.user.role)) {
    throw new TRPCError({ code: 'FORBIDDEN', message: 'Acesso exclusivo para Curadores de Estilo' });
  }
  return next({ ctx: { ...ctx, user: ctx.session.user } });
});`}
              </pre>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: Sincronização Offline-First */}
      {activeTab === 'OFFLINE' && (
        <div className="space-y-4">
          <div className="bg-[#10141d] rounded-2xl border border-[#222a3b] p-6 space-y-5">
            <div className="border-b border-[#1c2434] pb-3">
              <h2 className="text-base font-serif font-bold text-white flex items-center gap-2">
                <WifiOff className="w-4 h-4 text-[#c99738]" />
                <span>Estratégia de Sincronização Offline-First (Chão de Loja & Depósito)</span>
              </h2>
              <p className="text-xs text-neutral-400 mt-0.5">
                Garante que consultores e motoristas VIP continuem operando mesmo sem conexão 4G/Wi-Fi
              </p>
            </div>

            {/* Offline Flow Explanation */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              <div className="bg-[#0b0e14] p-3.5 rounded-xl border border-[#1b2332] space-y-2">
                <span className="font-bold text-blue-400 text-xs block">1. Cache Local de Leitura (IndexedDB)</span>
                <p className="text-neutral-300 text-[11px]">
                  Ao iniciar a sessão, o app baixa o catálogo resumido de peças e a ficha dos clientes recentes para o IndexedDB local. O consultor consulta tamanhos e fotos sem bater no servidor.
                </p>
              </div>

              <div className="bg-[#0b0e14] p-3.5 rounded-xl border border-[#1b2332] space-y-2">
                <span className="font-bold text-amber-400 text-xs block">2. Fila Outbox Idempotente (UUID v4)</span>
                <p className="text-neutral-300 text-[11px]">
                  Toda mutação offline (ex: montar mala ou mudar status para despachada) recebe um UUID v4 de idempotência e vai para a tabela local de outbox. A UI atualiza optimistamente.
                </p>
              </div>

              <div className="bg-[#0b0e14] p-3.5 rounded-xl border border-[#1b2332] space-y-2">
                <span className="font-bold text-emerald-400 text-xs block">3. Resolução de Conflitos & Sincronização</span>
                <p className="text-neutral-300 text-[11px]">
                  Quando a conexão retorna, um Service Worker dispara o processamento em lote da Outbox. Conflitos de estoque utilizam bloqueio atômico do PostgreSQL; se esgotar, a mala entra em alerta de revisão.
                </p>
              </div>
            </div>

            {/* Offline Sync Engine Code */}
            <div className="bg-[#0b0e14] p-4 rounded-xl border border-[#1c2434] space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-neutral-300 flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-[#c99738]" />
                  <span>lib/offline/syncEngine.ts (Motor de Outbox Queue)</span>
                </span>
                <button
                  onClick={() => {
                    navigator.clipboard?.writeText(sampleOfflineSyncCode);
                    setCopiedContract(true);
                    setTimeout(() => setCopiedContract(false), 2000);
                  }}
                  className="text-[11px] text-[#c99738] hover:underline"
                >
                  {copiedContract ? 'Copiado!' : 'Copiar Código'}
                </button>
              </div>
              <pre className="text-[11px] font-mono text-neutral-300 bg-[#07090d] p-3 rounded-lg overflow-x-auto border border-[#181d28] max-h-72">
                {sampleOfflineSyncCode}
              </pre>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: Segurança & LGPD */}
      {activeTab === 'SECURITY' && (
        <div className="space-y-4">
          <div className="bg-[#10141d] rounded-2xl border border-[#222a3b] p-6 space-y-5">
            <div className="border-b border-[#1c2434] pb-3">
              <h2 className="text-base font-serif font-bold text-white flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#c99738]" />
                <span>Plano de Segurança da Informação, LGPD e Anti-Ban WhatsApp</span>
              </h2>
              <p className="text-xs text-neutral-400 mt-0.5">
                Privacidade de dados de alto padrão e conformidade legal estrita
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              {/* LGPD */}
              <div className="bg-[#0b0e14] p-4 rounded-xl border border-[#1d2535] space-y-3">
                <div className="flex items-center gap-2">
                  <Lock className="w-4 h-4 text-emerald-400" />
                  <h3 className="font-bold text-white text-xs uppercase tracking-wider">Conformidade LGPD (Lei 13.709/2018)</h3>
                </div>

                <div className="space-y-2 text-neutral-300 text-[11px]">
                  <div className="bg-[#121620] p-2.5 rounded-lg border border-[#1e2738]">
                    <strong className="text-white block">Criptografia em Repouso (Envelope Encryption):</strong>
                    <span>Medidas antropométricas corporais (altura, peso, tamanho de calça) e endereços residenciais são cifrados no PostgreSQL com AES-256-GCM via chaves geridas em KMS seguro.</span>
                  </div>

                  <div className="bg-[#121620] p-2.5 rounded-lg border border-[#1e2738]">
                    <strong className="text-white block">Direito ao Esquecimento (Artigo 18 LGPD):</strong>
                    <span>Endpoint dedicado <code>client.anonymize</code> que desassocia telefone e nome, preservando apenas agregados estatísticos anônimos para DRE contábil.</span>
                  </div>

                  <div className="bg-[#121620] p-2.5 rounded-lg border border-[#1e2738]">
                    <strong className="text-white block">Trilha de Auditoria Imutável (AuditLog):</strong>
                    <span>Toda visualização de dados ou exportação de carteira gera log com IP, User ID e timestamp imutável.</span>
                  </div>
                </div>
              </div>

              {/* Anti-Ban WhatsApp */}
              <div className="bg-[#0b0e14] p-4 rounded-xl border border-[#1d2535] space-y-3">
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-amber-400" />
                  <h3 className="font-bold text-white text-xs uppercase tracking-wider">Política Anti-Ban WhatsApp (Evolution API / Baileys)</h3>
                </div>

                <div className="space-y-2 text-neutral-300 text-[11px]">
                  <div className="bg-[#121620] p-2.5 rounded-lg border border-[#1e2738]">
                    <strong className="text-white block">Algoritmo Leaky Bucket (Upstash Ratelimit):</strong>
                    <span>Espaçamento mandatório de no mínimo 4 a 6 segundos entre mensagens para o mesmo número e jitter randômico de 500ms para evitar heurística de bot.</span>
                  </div>

                  <div className="bg-[#121620] p-2.5 rounded-lg border border-[#1e2738]">
                    <strong className="text-white block">Warm-up de Chip & Rotação de Instâncias:</strong>
                    <span>Chips novos iniciam com limite estrito de 25 mensagens ativas/dia, escalando 20% a cada semana com confirmação de engajamento do cliente.</span>
                  </div>

                  <div className="bg-[#121620] p-2.5 rounded-lg border border-[#1e2738]">
                    <strong className="text-white block">Opt-in Explícito de Condicional:</strong>
                    <span>Disparos de lembretes só ocorrem se o cliente autorizou a mala no cadastro; comando <code>PARE</code> bloqueia novos envios automáticos instantaneamente.</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: Contratos de API, Schema Prisma & Banco PostgreSQL */}
      {activeTab === 'APIS_PRISMA' && (
        <div className="space-y-4">
          <div className="bg-[#10141d] rounded-2xl border border-[#222a3b] p-6 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-[#1c2434] pb-4">
              <div>
                <h2 className="text-base font-serif font-bold text-white flex items-center gap-2">
                  <Database className="w-4 h-4 text-[#c99738]" />
                  <span>Schema Prisma & Banco PostgreSQL do Ravis CRM</span>
                </h2>
                <p className="text-xs text-neutral-400 mt-0.5">
                  Modelagem relacional completa, migrations DDL e seed com 3 clientes, 8 produtos e mala condicional
                </p>
              </div>

              {/* Sub-tab Switcher */}
              <div className="flex flex-wrap items-center gap-1.5 bg-[#0b0e14] p-1 rounded-xl border border-[#1b2332]">
                <button
                  onClick={() => setSchemaSubTab('OPENAPI')}
                  className={`px-2.5 py-1 text-xs rounded-lg transition-colors flex items-center gap-1 ${
                    schemaSubTab === 'OPENAPI'
                      ? 'bg-[#1e2736] text-[#c99738] font-bold border border-[#c99738]/40'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  <Terminal className="w-3 h-3 text-[#c99738]" />
                  <span>API REST OpenAPI/Swagger ({API_ENDPOINTS_SPECS.length} Endpoints)</span>
                </button>
                <button
                  onClick={() => setSchemaSubTab('ASSEMBLE_PAYLOAD')}
                  className={`px-2.5 py-1 text-xs rounded-lg transition-colors flex items-center gap-1 ${
                    schemaSubTab === 'ASSEMBLE_PAYLOAD'
                      ? 'bg-[#1e2736] text-amber-300 font-bold border border-amber-400/50'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  <Zap className="w-3 h-3 text-amber-400" />
                  <span>Payload: Montar Seleção (Curador)</span>
                </button>
                <button
                  onClick={() => setSchemaSubTab('MAPPING')}
                  className={`px-2.5 py-1 text-xs rounded-lg transition-colors ${
                    schemaSubTab === 'MAPPING'
                      ? 'bg-[#1e2736] text-[#c99738] font-bold border border-[#c99738]/40'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  Mapeamento ({PRISMA_MODULES_MAPPING.length} Tabelas)
                </button>
                <button
                  onClick={() => setSchemaSubTab('SCHEMA')}
                  className={`px-2.5 py-1 text-xs rounded-lg transition-colors ${
                    schemaSubTab === 'SCHEMA'
                      ? 'bg-[#1e2736] text-[#c99738] font-bold border border-[#c99738]/40'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  schema.prisma
                </button>
                <button
                  onClick={() => setSchemaSubTab('MIGRATION')}
                  className={`px-2.5 py-1 text-xs rounded-lg transition-colors ${
                    schemaSubTab === 'MIGRATION'
                      ? 'bg-[#1e2736] text-[#c99738] font-bold border border-[#c99738]/40'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  migration.sql
                </button>
                <button
                  onClick={() => setSchemaSubTab('SEED')}
                  className={`px-2.5 py-1 text-xs rounded-lg transition-colors ${
                    schemaSubTab === 'SEED'
                      ? 'bg-[#1e2736] text-[#c99738] font-bold border border-[#c99738]/40'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  seed.ts / seed.sql
                </button>
                <button
                  onClick={() => setSchemaSubTab('TRPC')}
                  className={`px-2.5 py-1 text-xs rounded-lg transition-colors ${
                    schemaSubTab === 'TRPC'
                      ? 'bg-[#1e2736] text-[#c99738] font-bold border border-[#c99738]/40'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  tRPC Contract
                </button>
              </div>
            </div>

            {/* Quick Metrics Badge Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
              <div className="bg-[#0b0e14] p-3 rounded-xl border border-[#1a2130]">
                <span className="text-[10px] text-neutral-400 uppercase tracking-wider block">Entidades Modeladas</span>
                <span className="text-sm font-bold text-white mt-0.5 block">20 Tabelas + 18 Enums</span>
                <span className="text-[10px] text-neutral-500">PostgreSQL com UUIDs pgcrypto</span>
              </div>
              <div className="bg-[#0b0e14] p-3 rounded-xl border border-[#1a2130]">
                <span className="text-[10px] text-amber-400 uppercase tracking-wider block font-bold">Módulo Condicional</span>
                <span className="text-sm font-bold text-white mt-0.5 block">ConditionalBox & Item</span>
                <span className="text-[10px] text-amber-300/80">Kardex de estoque atômico</span>
              </div>
              <div className="bg-[#0b0e14] p-3 rounded-xl border border-[#1a2130]">
                <span className="text-[10px] text-purple-400 uppercase tracking-wider block font-bold">Segmentação 360°</span>
                <span className="text-sm font-bold text-white mt-0.5 block">StyleProfile, Tags & LGPD</span>
                <span className="text-[10px] text-purple-300/80">Índices em fone e @Instagram</span>
              </div>
              <div className="bg-[#0b0e14] p-3 rounded-xl border border-[#1a2130]">
                <span className="text-[10px] text-emerald-400 uppercase tracking-wider block font-bold">Canais & PDV</span>
                <span className="text-sm font-bold text-white mt-0.5 block">WhatsApp + PDV Canoinhas</span>
                <span className="text-[10px] text-emerald-300/80">Comissões & Pix dinâmico</span>
              </div>
            </div>

            {/* SUB-TAB 0: OpenAPI & REST API Specification */}
            {schemaSubTab === 'OPENAPI' && (
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-[#0b0e14] p-4 rounded-xl border border-[#1b2332]">
                  <div>
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <Terminal className="w-4 h-4 text-[#c99738]" />
                      <span>Especificação OpenAPI 3.1 & Swagger (Ravis CRM v1)</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#c99738]/20 text-[#f5d061] border border-[#c99738]/30">
                        JWT & NextAuth
                      </span>
                    </h3>
                    <p className="text-xs text-neutral-400 mt-1">
                      Contratos RESTful com paginação, rate-limiting, tratamento de erros RFC 7807 e webhooks multicanal (Evolution API, Meta Graph e Mercado Pago/Stripe).
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-mono text-neutral-400 bg-[#161d2a] px-2.5 py-1 rounded border border-[#222d40]">
                      Base URL: /v1
                    </span>
                  </div>
                </div>

                {/* Filter tags bar */}
                <div className="flex flex-wrap items-center gap-1.5 text-xs">
                  {['ALL', 'Customers', 'Products', 'Conditionals', 'Orders', 'Inbox', 'Automations', 'Campaigns', 'Analytics', 'Webhooks Inbound', 'Webhooks Outbound'].map(tag => (
                    <button
                      key={tag}
                      onClick={() => setApiFilterTag(tag)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] transition-colors ${
                        apiFilterTag === tag
                          ? 'bg-[#c99738] text-black font-bold'
                          : 'bg-[#0f141f] text-neutral-400 hover:text-white border border-[#1a2233]'
                      }`}
                    >
                      {tag === 'ALL' ? 'Todos Endpoints (29)' : tag}
                    </button>
                  ))}
                </div>

                {/* Endpoints Table / Cards */}
                <div className="space-y-2 max-h-[480px] overflow-y-auto pr-1">
                  {API_ENDPOINTS_SPECS
                    .filter(ep => apiFilterTag === 'ALL' || ep.tag === apiFilterTag)
                    .map((ep, idx) => {
                      const methodColors: Record<string, string> = {
                        GET: 'bg-blue-900/60 text-blue-300 border-blue-700/60',
                        POST: 'bg-emerald-900/60 text-emerald-300 border-emerald-700/60',
                        PUT: 'bg-amber-900/60 text-amber-300 border-amber-700/60',
                        PATCH: 'bg-purple-900/60 text-purple-300 border-purple-700/60',
                        DELETE: 'bg-rose-900/60 text-rose-300 border-rose-700/60'
                      };

                      return (
                        <div
                          key={idx}
                          className={`p-3 rounded-xl border transition-all flex flex-col md:flex-row md:items-center justify-between gap-2.5 ${
                            ep.isCuratorKeyAction
                              ? 'bg-[#181a15] border-amber-500/40 shadow-sm shadow-amber-500/10'
                              : 'bg-[#0b0e14] border-[#182130] hover:border-[#27344a]'
                          }`}
                        >
                          <div className="flex items-center gap-2.5 min-w-[320px]">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono border ${methodColors[ep.method]}`}>
                              {ep.method}
                            </span>
                            <span className="font-mono text-xs text-white font-semibold tracking-tight">
                              {ep.path}
                            </span>
                            {ep.isCuratorKeyAction && (
                              <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-400/20 text-amber-300 border border-amber-400/40">
                                AÇÃO CENTRAL CURADOR
                              </span>
                            )}
                          </div>

                          <div className="flex-1 text-xs text-neutral-300">
                            {ep.summary}
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            <span className="px-2 py-0.5 rounded bg-[#131924] border border-[#202b3c] text-[10px] text-neutral-400 font-mono">
                              {ep.auth}
                            </span>
                            <span className="px-1.5 py-0.5 rounded bg-[#070a0f] text-[10px] text-neutral-500 font-mono">
                              {ep.rateLimit}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                </div>

                {/* Standards Summary */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
                  <div className="bg-[#0b0e14] p-3 rounded-xl border border-[#1a2130]">
                    <span className="font-bold text-[#f5d061] block mb-1">Padronização de Erros</span>
                    <p className="text-[11px] text-neutral-400 leading-relaxed">
                      RFC 7807 Problem Details com status, tipo URI, detalhe humanizado e array de validação de campos.
                    </p>
                  </div>
                  <div className="bg-[#0b0e14] p-3 rounded-xl border border-[#1a2130]">
                    <span className="font-bold text-[#f5d061] block mb-1">Webhooks de Entrada</span>
                    <p className="text-[11px] text-neutral-400 leading-relaxed">
                      Evolution API (WhatsApp), Graph API (Instagram) e Mercado Pago/Stripe com validação criptográfica de assinatura.
                    </p>
                  </div>
                  <div className="bg-[#0b0e14] p-3 rounded-xl border border-[#1a2130]">
                    <span className="font-bold text-[#f5d061] block mb-1">Webhooks de Saída</span>
                    <p className="text-[11px] text-neutral-400 leading-relaxed">
                      Notificação de nova mala condicional para Leva e Traz VIP, lembrete D+3 e mudança de status com retry no BullMQ.
                    </p>
                  </div>
                  <div className="bg-[#0b0e14] p-3 rounded-xl border border-[#1a2130]">
                    <span className="font-bold text-[#f5d061] block mb-1">Especificação Completa</span>
                    <p className="text-[11px] text-neutral-400 leading-relaxed">
                      Arquivo OpenAPI 3.1 YAML persistido em <code className="text-[#c99738]">/src/data/ravis-crm-openapi.yaml</code>.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* SUB-TAB 0.5: Payload Central do Curador */}
            {schemaSubTab === 'ASSEMBLE_PAYLOAD' && (
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-[#0b0e14] p-4 rounded-xl border border-[#1b2332]">
                  <div>
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <Zap className="w-4 h-4 text-amber-400" />
                      <span>Payload Central: Montar Seleção e Enviar ao Cliente</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                        POST /v1/conditional-boxes/:id/assemble-and-send
                      </span>
                    </h3>
                    <p className="text-xs text-neutral-400 mt-1">
                      Ação mais frequente do curador: validação contra StyleProfile, reserva atômica de estoque por SKU, cálculo financeiro e disparo WhatsApp.
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      navigator.clipboard?.writeText(JSON.stringify(ASSEMBLE_AND_SEND_EXAMPLE_PAYLOAD, null, 2));
                      setCopiedPayload(true);
                      setTimeout(() => setCopiedPayload(false), 2000);
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#18202d] text-xs text-[#c99738] border border-[#273449] hover:bg-[#202b3d]"
                  >
                    {copiedPayload ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedPayload ? 'JSON Copiado!' : 'Copiar Payload Completo'}</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {/* Request Body */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5 font-mono">
                        <span>▶ Request Body (Enviado pelo App Mobile do Curador)</span>
                      </span>
                      <span className="text-[10px] text-neutral-500 font-mono">application/json</span>
                    </div>
                    <pre className="text-[11px] font-mono text-neutral-300 bg-[#07090d] p-3.5 rounded-xl overflow-x-auto border border-[#1c2434] max-h-96">
                      {JSON.stringify(ASSEMBLE_AND_SEND_EXAMPLE_PAYLOAD.requestBody, null, 2)}
                    </pre>
                  </div>

                  {/* Response Body */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-blue-400 flex items-center gap-1.5 font-mono">
                        <span>◀ Response Body (200 OK - Mala Despachada e Estoque Reservado)</span>
                      </span>
                      <span className="text-[10px] text-neutral-500 font-mono">application/json</span>
                    </div>
                    <pre className="text-[11px] font-mono text-neutral-300 bg-[#07090d] p-3.5 rounded-xl overflow-x-auto border border-[#1c2434] max-h-96">
                      {JSON.stringify(ASSEMBLE_AND_SEND_EXAMPLE_PAYLOAD.responseBody, null, 2)}
                    </pre>
                  </div>
                </div>

                {/* Workflow Explanation Steps */}
                <div className="bg-[#0b0e14] p-4 rounded-xl border border-[#1b2332] space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#c99738]">
                    Fluxo Interno de Execução com Garantia Transacional (ACID)
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
                    <div className="p-3 bg-[#10141d] rounded-lg border border-[#1f283a] space-y-1">
                      <span className="font-bold text-white block">1. Validação de Medidas</span>
                      <p className="text-[11px] text-neutral-400">
                        O backend checa se o tamanho da variante corresponde ao <code className="text-amber-300">StyleProfile</code> (ex: Tam 42 e M) e se o cliente não está com pendências financeiras.
                      </p>
                    </div>
                    <div className="p-3 bg-[#10141d] rounded-lg border border-[#1f283a] space-y-1">
                      <span className="font-bold text-white block">2. Bloqueio & Reserva</span>
                      <p className="text-[11px] text-neutral-400">
                        Dentro de uma <code className="text-amber-300">tx.$transaction</code>, incrementa <code className="text-amber-300">stockReserved</code> e decrementa <code className="text-amber-300">stockAvailable</code> de forma atômica.
                      </p>
                    </div>
                    <div className="p-3 bg-[#10141d] rounded-lg border border-[#1f283a] space-y-1">
                      <span className="font-bold text-white block">3. Disparo WhatsApp</span>
                      <p className="text-[11px] text-neutral-400">
                        Envia mensagem via <code className="text-emerald-400">Evolution API</code> com o link de tracking da mala condicional e styling tips do curador.
                      </p>
                    </div>
                    <div className="p-3 bg-[#10141d] rounded-lg border border-[#1f283a] space-y-1">
                      <span className="font-bold text-white block">4. Job BullMQ D+3</span>
                      <p className="text-[11px] text-neutral-400">
                        Enfileira agendador de lembrete cordial após 72 horas para checar se o cliente já experimentou as peças e deseja a visita do motorista.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* SUB-TAB 1: Mapeamento de Tabelas */}
            {schemaSubTab === 'MAPPING' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-300">
                    Como as Tabelas Suportam o Módulo de Condicional e a Segmentação de Clientes
                  </h3>
                  <span className="text-[11px] text-neutral-400">
                    Clique em uma tabela para inspecionar relacionamentos e índices
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {PRISMA_MODULES_MAPPING.map((item, idx) => {
                    const badgeStyles: Record<string, string> = {
                      CONDICIONAL: 'bg-amber-950/60 text-amber-300 border-amber-800/60',
                      SEGMENTACAO: 'bg-purple-950/60 text-purple-300 border-purple-800/60',
                      CATALOGO_ESTOQUE: 'bg-blue-950/60 text-blue-300 border-blue-800/60',
                      PEDIDOS_PDV: 'bg-emerald-950/60 text-emerald-300 border-emerald-800/60',
                      ATENDIMENTO_INBOX: 'bg-cyan-950/60 text-cyan-300 border-cyan-800/60',
                      CORE_RBAC: 'bg-neutral-800 text-neutral-300 border-neutral-700',
                    };

                    return (
                      <div
                        key={idx}
                        className="bg-[#0b0e14] p-4 rounded-xl border border-[#1b2332] space-y-2.5 hover:border-[#273347] transition-all"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-xs font-bold text-white flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#c99738]"></span>
                            {item.table}
                          </span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${badgeStyles[item.module] || badgeStyles.CORE_RBAC}`}>
                            {item.module}
                          </span>
                        </div>

                        <p className="text-xs text-neutral-300 leading-relaxed">
                          {item.description}
                        </p>

                        <div className="pt-2 border-t border-[#181f2c] space-y-1 text-[11px]">
                          <div>
                            <span className="text-neutral-500 font-mono">Índices-chave: </span>
                            <span className="text-neutral-300 font-mono">{item.keyIndexes.join(' • ')}</span>
                          </div>
                          <div>
                            <span className="text-neutral-500 font-mono">Relacionamentos: </span>
                            <span className="text-neutral-400">{item.relationships}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* SUB-TAB 2: schema.prisma */}
            {schemaSubTab === 'SCHEMA' && (
              <div className="bg-[#0b0e14] p-4 rounded-xl border border-[#1c2434] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-[#f5d061] font-bold flex items-center gap-2">
                    <FileCode className="w-4 h-4 text-[#c99738]" />
                    <span>prisma/schema.prisma (PostgreSQL ORM - Modelagem Completa)</span>
                  </span>
                  <button
                    onClick={handleCopySchema}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#18202d] text-xs text-[#c99738] border border-[#273449] hover:bg-[#202b3d]"
                  >
                    {copiedSchema ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedSchema ? 'Copiado!' : 'Copiar schema.prisma'}</span>
                  </button>
                </div>
                <pre className="text-[11px] font-mono text-neutral-300 bg-[#07090d] p-3 rounded-lg overflow-x-auto border border-[#181d28] max-h-96">
                  {PRISMA_SCHEMA_CODE}
                </pre>
              </div>
            )}

            {/* SUB-TAB 3: migration.sql */}
            {schemaSubTab === 'MIGRATION' && (
              <div className="bg-[#0b0e14] p-4 rounded-xl border border-[#1c2434] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-emerald-300 font-bold flex items-center gap-2">
                    <Terminal className="w-4 h-4 text-emerald-400" />
                    <span>prisma/migrations/20261012000000_init_ravis_crm/migration.sql</span>
                  </span>
                  <button
                    onClick={handleCopyMigration}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#18202d] text-xs text-[#c99738] border border-[#273449] hover:bg-[#202b3d]"
                  >
                    {copiedMigration ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedMigration ? 'Copiado!' : 'Copiar migration.sql'}</span>
                  </button>
                </div>
                <div className="bg-[#07090d] p-3 rounded-lg border border-[#181d28] text-xs text-neutral-400 space-y-2">
                  <p className="text-neutral-300">
                    Arquivo de migração inicial completo pronto para execução direta em PostgreSQL 14+, Neon, Supabase ou Cloud SQL. Contém a criação de 18 enums, 20 tabelas, índices de busca por telefone e Instagram, e chaves estrangeiras com integridade relacional.
                  </p>
                  <div className="font-mono text-[11px] text-[#c99738] bg-[#10141d] p-2 rounded border border-[#1c2434]">
                    psql -d postgresql://user:pass@host:5432/ravis_crm -f prisma/migrations/20261012000000_init_ravis_crm/migration.sql
                  </div>
                </div>
                <pre className="text-[11px] font-mono text-neutral-300 bg-[#07090d] p-3 rounded-lg overflow-x-auto border border-[#181d28] max-h-96">
                  {PRISMA_MIGRATION_SQL}
                </pre>
              </div>
            )}

            {/* SUB-TAB 4: seed.ts / seed.sql */}
            {schemaSubTab === 'SEED' && (
              <div className="bg-[#0b0e14] p-4 rounded-xl border border-[#1c2434] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-purple-300 font-bold flex items-center gap-2">
                    <Database className="w-4 h-4 text-purple-400" />
                    <span>Dados de Seed: 3 Clientes VIP, 8 Peças de Luxo e 1 Mala Condicional Real</span>
                  </span>
                  <button
                    onClick={handleCopySeed}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#18202d] text-xs text-[#c99738] border border-[#273449] hover:bg-[#202b3d]"
                  >
                    {copiedSeed ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedSeed ? 'Copiado!' : 'Copiar seed info'}</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                  <div className="bg-[#07090d] p-3.5 rounded-xl border border-[#181f2c] space-y-2">
                    <span className="font-bold text-[#f5d061] block">3 Clientes VIP Canoinhas-SC</span>
                    <ul className="text-[11px] text-neutral-300 space-y-1">
                      <li>• <strong>Dr. Guilherme Schramm</strong> (Médico, M/42/41, Linho e tons terrosos, VIP Platinum)</li>
                      <li>• <strong>Rodrigo Silveira</strong> (Produtor Rural Marcílio Dias, G/44/42, Couro e tons fendi, VIP Ouro)</li>
                      <li>• <strong>Dr. Carlos Eduardo Guimarães</strong> (Advogado Tributarista, 40/M/40, Lã fria, VIP Black)</li>
                    </ul>
                  </div>

                  <div className="bg-[#07090d] p-3.5 rounded-xl border border-[#181f2c] space-y-2">
                    <span className="font-bold text-[#f5d061] block">8 Produtos Pomelli Photoshoot</span>
                    <ul className="text-[11px] text-neutral-300 space-y-1">
                      <li>• Camiseta Slim Algodão Egípcio (RAV-CSL-01)</li>
                      <li>• Camiseta Longline Minimalist (RAV-CLG-02)</li>
                      <li>• Tricô Modal Canelado (RAV-TRC-03)</li>
                      <li>• Sobretudo Lã Batida (RAV-SBT-04) - 2 unidades</li>
                      <li>• Cachecol Lã Merino Tartan (RAV-CCH-05)</li>
                      <li>• Calça Chino Tech (RAV-CAL-06)</li>
                      <li>• Camisa Linho Riviera (RAV-LNH-07)</li>
                      <li>• Blazer Desestruturado Chumbo (RAV-BLZ-08)</li>
                    </ul>
                  </div>

                  <div className="bg-[#07090d] p-3.5 rounded-xl border border-[#181f2c] space-y-2">
                    <span className="font-bold text-[#f5d061] block">Mala Exemplo: COND-2026-088</span>
                    <ul className="text-[11px] text-neutral-300 space-y-1">
                      <li>• 4 Peças sob Prova (Valor Total: R$ 1.849,00)</li>
                      <li>• 2 Peças COMPRADAS (R$ 769,00) com Pix</li>
                      <li>• 1 Devolvida: "Ficou folgado na cintura"</li>
                      <li>• 1 Em Teste no consultório</li>
                      <li>• 6 Movimentações Kardex de Estoque</li>
                      <li>• Pedido PED-2026-1042 faturado com comissão</li>
                    </ul>
                  </div>
                </div>

                <div className="font-mono text-[11px] text-[#c99738] bg-[#07090d] p-2.5 rounded border border-[#1c2434]">
                  npx tsx prisma/seed.ts &nbsp;&nbsp;|&nbsp;&nbsp; psql -f prisma/seed.sql
                </div>
              </div>
            )}

            {/* SUB-TAB 5: tRPC Contract */}
            {schemaSubTab === 'TRPC' && (
              <div className="bg-[#0b0e14] p-4 rounded-xl border border-[#1c2434] space-y-2">
                <span className="text-xs font-mono text-neutral-300 block font-bold text-blue-300">
                  Contrato tRPC Type-Safe: trpc/routers/condicional.ts (Reserva Atômica e Checkout)
                </span>
                <pre className="text-[11px] font-mono text-neutral-300 bg-[#07090d] p-3 rounded-lg overflow-x-auto border border-[#181d28] max-h-72">
                  {sampleTrpcCode}
                </pre>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 7: Custos de Infraestrutura (FinOps) */}
      {activeTab === 'FINOPS' && (
        <div className="space-y-4">
          <div className="bg-[#10141d] rounded-2xl border border-[#222a3b] p-6 space-y-5">
            <div className="border-b border-[#1c2434] pb-3">
              <h2 className="text-base font-serif font-bold text-white flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-emerald-400" />
                <span>Planejamento Orçamentário de Infraestrutura Cloud (FinOps)</span>
              </h2>
              <p className="text-xs text-neutral-400 mt-0.5">
                Estimativa mensal transparente do MVP à escala multiloja regional
              </p>
            </div>

            {/* Tier Switcher */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {INFRA_ESTIMATES.map((tier, idx) => (
                <div
                  key={idx}
                  onClick={() => setSelectedCostTier(idx)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    selectedCostTier === idx
                      ? 'bg-[#151c27] border-[#c99738] shadow-lg shadow-[#c99738]/10'
                      : 'bg-[#0b0e14] border-[#1c2331] hover:border-[#273347]'
                  }`}
                >
                  <span className="text-[10px] uppercase font-bold text-neutral-400 block">{tier.tierName.split(':')[0]}</span>
                  <h3 className="font-bold text-sm text-white mt-0.5">{tier.tierName.split(':')[1]}</h3>
                  <span className="text-xs text-neutral-400 block mt-1">{tier.volume}</span>

                  <div className="mt-3 pt-2 border-t border-[#1a2130] flex items-baseline justify-between">
                    <span className="font-serif text-lg font-bold text-[#f5d061]">R$ {tier.totalBrl}/mês</span>
                    <span className="text-[11px] text-neutral-400 font-mono">~US$ {tier.totalUsd}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Detailed Table for Selected Tier */}
            <div className="bg-[#0b0e14] rounded-xl border border-[#1b2332] p-4 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-xs text-white uppercase tracking-wider">
                  Detalhamento de Custos: {INFRA_ESTIMATES[selectedCostTier].tierName}
                </h3>
                <span className="text-xs font-mono font-bold text-emerald-400">
                  Total Estimado: R$ {INFRA_ESTIMATES[selectedCostTier].totalBrl}/mês
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#121620] text-neutral-400 uppercase text-[10px] tracking-wider border-b border-[#1e2637]">
                    <tr>
                      <th className="py-2 px-3">Serviço</th>
                      <th className="py-2 px-3">Plano Recomendado</th>
                      <th className="py-2 px-3">Finalidade no Ravis CRM</th>
                      <th className="py-2 px-3 text-right">USD</th>
                      <th className="py-2 px-3 text-right">BRL (Estimado)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#171d29] text-neutral-300 text-[11px]">
                    {INFRA_ESTIMATES[selectedCostTier].items.map((row, rIdx) => (
                      <tr key={rIdx} className="hover:bg-[#121722]/50">
                        <td className="py-2.5 px-3 font-semibold text-white">{row.service}</td>
                        <td className="py-2.5 px-3 font-mono text-neutral-400">{row.plan}</td>
                        <td className="py-2.5 px-3 text-neutral-300">{row.purpose}</td>
                        <td className="py-2.5 px-3 text-right font-mono text-neutral-400">${row.monthlyUsd}</td>
                        <td className="py-2.5 px-3 text-right font-mono font-semibold text-[#f5d061]">
                          R$ {row.monthlyBrl}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="bg-[#121620] p-3 rounded-lg border border-[#1e2738] text-[11px] text-neutral-300">
                <strong className="text-emerald-400 block mb-0.5">Vantagem de Custo no Modelo Serverless:</strong>
                <span>
                  O custo operacional no MVP é de apenas <strong>R$ 165/mês</strong>. Uma única venda de condicional fechada (ticket médio R$ 2.150) já paga mais de 12 meses inteiros de infraestrutura cloud do Ravis CRM, comprovando o ROI massivo da arquitetura.
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
