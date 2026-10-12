import React, { useState } from 'react';
import { 
  Palette, 
  Layers, 
  Smartphone, 
  Monitor, 
  Command, 
  Sparkles, 
  Check, 
  Copy, 
  ArrowRight, 
  ShieldCheck, 
  Sliders, 
  Tag, 
  MousePointer, 
  ExternalLink,
  Lock,
  Eye,
  Heart,
  TrendingUp,
  MessageSquare,
  Package,
  ShoppingBag,
  Calendar,
  Clock,
  Send,
  Zap,
  Info,
  ChevronRight,
  Filter,
  Search,
  CheckCircle2,
  XCircle,
  AlertTriangle
} from 'lucide-react';
import { RAVIS_DESIGN_TOKENS, WIREFRAME_SCREENS, NAVIGATION_FLOW_STEPS } from '../../data/designSystemData';
import { INITIAL_CLIENTS, INITIAL_PRODUCTS } from '../../data/initialData';

export const DesignSystemWireframesView: React.FC = () => {
  const [activeMainTab, setActiveMainTab] = useState<'tokens' | 'components' | 'navigation' | 'prototypes'>('prototypes');
  const [activePrototype, setActivePrototype] = useState<'login' | 'dashboard' | 'selection'>('dashboard');
  const [copiedToken, setCopiedToken] = useState<string | null>(null);

  // Prototype state: Login
  const [loginEmail, setLoginEmail] = useState('curador@ravispremium.com.br');
  const [loginPassword, setLoginPassword] = useState('••••••••••••');
  const [loginRole, setLoginRole] = useState<'CURADOR' | 'ADMIN' | 'ATENDENTE'>('CURADOR');
  const [loginSuccess, setLoginSuccess] = useState(false);

  // Prototype state: Dashboard filters
  const [dashboardRange, setDashboardRange] = useState<'7D' | '30D' | '90D' | 'ANO'>('30D');

  // Prototype state: Drag and Drop Selection
  const [selectedClientIndex, setSelectedClientIndex] = useState(0);
  const [draggedItems, setDraggedItems] = useState<any[]>([
    INITIAL_PRODUCTS[0],
    INITIAL_PRODUCTS[1]
  ]);
  const [availableProducts, setAvailableProducts] = useState<any[]>(
    INITIAL_PRODUCTS.slice(2, 7)
  );
  const [boxDispatched, setBoxDispatched] = useState(false);
  const [boxDeadline, setBoxDeadline] = useState<'48h' | '72h' | '7d'>('48h');

  const currentClient = INITIAL_CLIENTS[selectedClientIndex] || INITIAL_CLIENTS[0];

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedToken(id);
    setTimeout(() => setCopiedToken(null), 2000);
  };

  const handleAddItemToBox = (product: any) => {
    if (draggedItems.find(i => i.id === product.id)) return;
    setDraggedItems([...draggedItems, product]);
    setAvailableProducts(availableProducts.filter(p => p.id !== product.id));
  };

  const handleRemoveItemFromBox = (product: any) => {
    setDraggedItems(draggedItems.filter(i => i.id !== product.id));
    setAvailableProducts([...availableProducts, product]);
  };

  const boxTotalValue = draggedItems.reduce((acc, curr) => acc + curr.price, 0);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Banner with Brand Philosophy */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#0F0F10] via-[#1A1A1A] to-[#0F0F10] border border-[#C9A227]/30 p-6 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#C9A227]/5 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold tracking-wider uppercase bg-[#C9A227]/15 text-[#C9A227] border border-[#C9A227]/30">
                Design System & Wireframes
              </span>
              <span className="text-xs text-[#9E998E]">Ravi's Premium Menswear • Canoinhas - SC</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-serif text-[#EDE6D6] tracking-tight font-bold">
              Identidade Visual & Experiência Operacional de Luxo
            </h1>
            <p className="text-xs md:text-sm text-[#9E998E] mt-1 max-w-3xl leading-relaxed">
              Fundo preto profundo (<code className="text-[#C9A227]">#0F0F10</code>), carvão (<code className="text-[#C9A227]">#1A1A1A</code>), acentos em dourado champanhe (<code className="text-[#C9A227]">#C9A227</code>) e neutros creme (<code className="text-[#EDE6D6]">#EDE6D6</code>). Tipografia refinada (<strong className="text-neutral-200">Cormorant Garamond + Inter</strong>) combinada à velocidade analítica das ferramentas Linear & Raycast.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <span className="text-xs text-[#9E998E] flex items-center gap-1.5 bg-[#0F0F10] px-3 py-1.5 rounded-lg border border-[#2D2D2E]">
              <Smartphone className="w-3.5 h-3.5 text-[#C9A227]" /> 70% Mobile-First
            </span>
            <span className="text-xs text-[#9E998E] flex items-center gap-1.5 bg-[#0F0F10] px-3 py-1.5 rounded-lg border border-[#2D2D2E]">
              <Command className="w-3.5 h-3.5 text-[#C9A227]" /> Keyboard Shortcuts
            </span>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap items-center gap-2 mt-6 pt-4 border-t border-[#2D2D2E]">
          <button
            onClick={() => setActiveMainTab('prototypes')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium transition-all ${
              activeMainTab === 'prototypes'
                ? 'bg-[#C9A227] text-black font-semibold shadow-lg shadow-[#C9A227]/20'
                : 'bg-[#0F0F10] text-[#EDE6D6] hover:bg-[#242424] border border-[#2D2D2E]'
            }`}
          >
            <Sparkles className="w-4 h-4" /> Protótipos Interativos das 3 Telas
          </button>
          <button
            onClick={() => setActiveMainTab('tokens')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium transition-all ${
              activeMainTab === 'tokens'
                ? 'bg-[#C9A227] text-black font-semibold shadow-lg shadow-[#C9A227]/20'
                : 'bg-[#0F0F10] text-[#EDE6D6] hover:bg-[#242424] border border-[#2D2D2E]'
            }`}
          >
            <Palette className="w-4 h-4" /> Tokens de Design (Cores, Tipografia, Grid)
          </button>
          <button
            onClick={() => setActiveMainTab('components')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium transition-all ${
              activeMainTab === 'components'
                ? 'bg-[#C9A227] text-black font-semibold shadow-lg shadow-[#C9A227]/20'
                : 'bg-[#0F0F10] text-[#EDE6D6] hover:bg-[#242424] border border-[#2D2D2E]'
            }`}
          >
            <Layers className="w-4 h-4" /> Biblioteca de Componentes UI
          </button>
          <button
            onClick={() => setActiveMainTab('navigation')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium transition-all ${
              activeMainTab === 'navigation'
                ? 'bg-[#C9A227] text-black font-semibold shadow-lg shadow-[#C9A227]/20'
                : 'bg-[#0F0F10] text-[#EDE6D6] hover:bg-[#242424] border border-[#2D2D2E]'
            }`}
          >
            <ArrowRight className="w-4 h-4" /> Fluxo de Navegação & Wireframes
          </button>
        </div>
      </div>

      {/* 1. PROTOTYPES VIEW */}
      {activeMainTab === 'prototypes' && (
        <div className="space-y-6">
          {/* Sub-selector for the 3 main screens */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#1A1A1A] p-2.5 rounded-xl border border-[#2D2D2E]">
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase tracking-wider text-[#9E998E] font-semibold pl-2">
                Tela Protótipo Ativa:
              </span>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setActivePrototype('dashboard')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    activePrototype === 'dashboard'
                      ? 'bg-[#C9A227] text-black font-semibold'
                      : 'text-[#EDE6D6] hover:bg-[#242424]'
                  }`}
                >
                  1. Dashboard do Gestor
                </button>
                <button
                  onClick={() => setActivePrototype('selection')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    activePrototype === 'selection'
                      ? 'bg-[#C9A227] text-black font-semibold'
                      : 'text-[#EDE6D6] hover:bg-[#242424]'
                  }`}
                >
                  2. Montagem de Seleção (Drag & Drop)
                </button>
                <button
                  onClick={() => setActivePrototype('login')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    activePrototype === 'login'
                      ? 'bg-[#C9A227] text-black font-semibold'
                      : 'text-[#EDE6D6] hover:bg-[#242424]'
                  }`}
                >
                  3. Login & Autenticação
                </button>
              </div>
            </div>

            <div className="text-[11px] text-[#9E998E] pr-2">
              Interativo • Baseado em HTML + Tailwind + Tokens Reais
            </div>
          </div>

          {/* SCREEN 1: DASHBOARD DO GESTOR */}
          {activePrototype === 'dashboard' && (
            <div className="bg-[#0F0F10] border border-[#2D2D2E] rounded-2xl overflow-hidden shadow-2xl">
              {/* Wireframe Header Bar */}
              <div className="bg-[#1A1A1A] border-b border-[#2D2D2E] px-5 py-3.5 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#C9A227] to-[#754e12] flex items-center justify-center font-serif text-black font-bold">
                    R
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-[#EDE6D6] flex items-center gap-2">
                      Cockpit Executivo & Analytics do Gestor
                      <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        Tempo Real
                      </span>
                    </h3>
                    <p className="text-[11px] text-[#9E998E]">
                      Métricas consolidadas de malas condicionais, conversão de alfaiataria e LTV de clientes
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex items-center bg-[#0F0F10] p-1 rounded-lg border border-[#2D2D2E] text-xs">
                    {(['7D', '30D', '90D', 'ANO'] as const).map(range => (
                      <button
                        key={range}
                        onClick={() => setDashboardRange(range)}
                        className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-all ${
                          dashboardRange === range
                            ? 'bg-[#C9A227] text-black font-semibold'
                            : 'text-[#9E998E] hover:text-[#EDE6D6]'
                        }`}
                      >
                        {range}
                      </button>
                    ))}
                  </div>
                  <button className="px-3 py-1.5 rounded-lg bg-[#242424] hover:bg-[#2D2D2E] text-[#EDE6D6] text-xs flex items-center gap-1.5 border border-[#2D2D2E]">
                    <Command className="w-3.5 h-3.5 text-[#C9A227]" />
                    <span>Exportar</span>
                  </button>
                </div>
              </div>

              {/* Wireframe Body */}
              <div className="p-5 space-y-6">
                {/* 4 Key KPIs Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-[#1A1A1A] p-4 rounded-xl border border-[#2D2D2E] hover:border-[#C9A227]/40 transition-all">
                    <div className="flex items-center justify-between text-xs text-[#9E998E] mb-2">
                      <span>Faturamento Total ({dashboardRange})</span>
                      <TrendingUp className="w-4 h-4 text-emerald-400" />
                    </div>
                    <div className="text-2xl font-serif font-bold text-[#EDE6D6]">
                      R$ 84.520<span className="text-sm font-sans text-[#9E998E]">,00</span>
                    </div>
                    <div className="flex items-center gap-1.5 mt-2 text-[11px]">
                      <span className="text-emerald-400 font-semibold">+18.4%</span>
                      <span className="text-[#9E998E]">vs período anterior</span>
                    </div>
                  </div>

                  <div className="bg-[#1A1A1A] p-4 rounded-xl border border-[#2D2D2E] hover:border-[#C9A227]/40 transition-all">
                    <div className="flex items-center justify-between text-xs text-[#9E998E] mb-2">
                      <span>Conversão de Condicional</span>
                      <Sparkles className="w-4 h-4 text-[#C9A227]" />
                    </div>
                    <div className="text-2xl font-serif font-bold text-[#C9A227]">
                      74.8%
                    </div>
                    <div className="flex items-center gap-1.5 mt-2 text-[11px]">
                      <span className="text-emerald-400 font-semibold">+6.2 p.p.</span>
                      <span className="text-[#9E998E]">Meta da loja: 65%</span>
                    </div>
                  </div>

                  <div className="bg-[#1A1A1A] p-4 rounded-xl border border-[#2D2D2E] hover:border-[#C9A227]/40 transition-all">
                    <div className="flex items-center justify-between text-xs text-[#9E998E] mb-2">
                      <span>Ticket Médio por Mala</span>
                      <ShoppingBag className="w-4 h-4 text-amber-400" />
                    </div>
                    <div className="text-2xl font-serif font-bold text-[#EDE6D6]">
                      R$ 1.842<span className="text-sm font-sans text-[#9E998E]">,50</span>
                    </div>
                    <div className="flex items-center gap-1.5 mt-2 text-[11px]">
                      <span className="text-[#9E998E]">Média de 3.2 peças compradas/mala</span>
                    </div>
                  </div>

                  <div className="bg-[#1A1A1A] p-4 rounded-xl border border-[#2D2D2E] hover:border-[#C9A227]/40 transition-all">
                    <div className="flex items-center justify-between text-xs text-[#9E998E] mb-2">
                      <span>Capital na Rua (Em Trânsito)</span>
                      <Package className="w-4 h-4 text-blue-400" />
                    </div>
                    <div className="text-2xl font-serif font-bold text-blue-300">
                      R$ 38.640<span className="text-sm font-sans text-[#9E998E]">,00</span>
                    </div>
                    <div className="flex items-center gap-1.5 mt-2 text-[11px]">
                      <span className="text-amber-400 font-semibold">14 malas ativas</span>
                      <span className="text-[#9E998E]">com clientes</span>
                    </div>
                  </div>
                </div>

                {/* Performance Chart & Top Pieces */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                  {/* Performance Chart representation */}
                  <div className="lg:col-span-2 bg-[#1A1A1A] p-5 rounded-xl border border-[#2D2D2E] space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-medium text-[#EDE6D6]">Ciclo de Conversão Semanal (Peças Selecionadas vs Compradas)</h4>
                        <p className="text-xs text-[#9E998E]">Evolução do volume de peças enviadas em condicional vs peças retidas</p>
                      </div>
                      <div className="flex items-center gap-3 text-xs">
                        <span className="flex items-center gap-1.5 text-[#EDE6D6]">
                          <span className="w-2.5 h-2.5 rounded-full bg-[#C9A227]" /> Compradas
                        </span>
                        <span className="flex items-center gap-1.5 text-[#9E998E]">
                          <span className="w-2.5 h-2.5 rounded-full bg-[#3D3D3E]" /> Devolvidas
                        </span>
                      </div>
                    </div>

                    {/* Chart Bars simulation */}
                    <div className="h-44 flex items-end justify-between gap-3 pt-6 border-b border-[#2D2D2E] pb-2">
                      {[
                        { label: 'Semana 1', sent: 48, bought: 38 },
                        { label: 'Semana 2', sent: 55, bought: 42 },
                        { label: 'Semana 3', sent: 62, bought: 49 },
                        { label: 'Semana 4', sent: 70, bought: 56 },
                      ].map((item, idx) => {
                        const totalHeight = 100;
                        const boughtHeight = (item.bought / 70) * totalHeight;
                        const returnedHeight = ((item.sent - item.bought) / 70) * totalHeight;

                        return (
                          <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                            <div className="text-[10px] text-[#9E998E] opacity-0 group-hover:opacity-100 transition-opacity">
                              {Math.round((item.bought / item.sent) * 100)}%
                            </div>
                            <div className="w-full max-w-[48px] flex flex-col gap-1 items-center">
                              {/* Returned part */}
                              <div
                                style={{ height: `${returnedHeight}%` }}
                                className="w-full bg-[#3D3D3E] rounded-t-sm"
                                title={`Devolvidas: ${item.sent - item.bought} peças`}
                              />
                              {/* Bought part */}
                              <div
                                style={{ height: `${boughtHeight}%` }}
                                className="w-full bg-gradient-to-t from-[#C9A227] to-[#DFC053] rounded-b-sm shadow-md"
                                title={`Compradas: ${item.bought} peças`}
                              />
                            </div>
                            <span className="text-[11px] text-[#9E998E] mt-1">{item.label}</span>
                          </div>
                        );
                      })}
                    </div>

                    <div className="flex items-center justify-between text-xs text-[#9E998E] pt-1">
                      <span>Curador de destaque da semana: <strong className="text-[#C9A227]">Matheus (82% conv.)</strong></span>
                      <span>Tempo médio de prova na casa do cliente: <strong className="text-[#EDE6D6]">41 horas</strong></span>
                    </div>
                  </div>

                  {/* Top Pieces & Return Reasons */}
                  <div className="bg-[#1A1A1A] p-5 rounded-xl border border-[#2D2D2E] space-y-4">
                    <h4 className="text-sm font-medium text-[#EDE6D6] flex items-center justify-between">
                      <span>Top Peças Campeãs</span>
                      <span className="text-[10px] text-[#C9A227]">Taxa de Retenção</span>
                    </h4>

                    <div className="space-y-3">
                      {[
                        { title: "Camisa Linho Puro Areia", conv: "92%", units: "12/13 un", price: "R$ 489" },
                        { title: "Costume Alfaiataria Grafite", conv: "86%", units: "6/7 un", price: "R$ 1.890" },
                        { title: "Calça Chino Confort Marinho", conv: "78%", units: "14/18 un", price: "R$ 429" },
                        { title: "Sapato Oxford Pelica Café", conv: "71%", units: "5/7 un", price: "R$ 890" }
                      ].map((piece, i) => (
                        <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-[#0F0F10] border border-[#2D2D2E] text-xs">
                          <div>
                            <div className="text-[#EDE6D6] font-medium">{piece.title}</div>
                            <div className="text-[10px] text-[#9E998E]">{piece.units} • {piece.price}</div>
                          </div>
                          <span className="px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400 font-semibold text-[11px]">
                            {piece.conv}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="pt-2 border-t border-[#2D2D2E]">
                      <div className="text-xs text-[#9E998E] mb-2 font-medium">Motivos de Devolução Registrados</div>
                      <div className="space-y-1.5 text-[11px]">
                        <div className="flex justify-between text-[#9E998E]">
                          <span>Comprimento/Ajuste de barra</span>
                          <span className="text-[#EDE6D6]">48%</span>
                        </div>
                        <div className="w-full h-1.5 bg-[#0F0F10] rounded-full overflow-hidden">
                          <div className="w-[48%] h-full bg-[#C9A227]" />
                        </div>

                        <div className="flex justify-between text-[#9E998E]">
                          <span>Cliente já possuía cor similar</span>
                          <span className="text-[#EDE6D6]">32%</span>
                        </div>
                        <div className="w-full h-1.5 bg-[#0F0F10] rounded-full overflow-hidden">
                          <div className="w-[32%] h-full bg-[#9E998E]" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SCREEN 2: MONTAGEM DE SELEÇÃO (DRAG & DROP) */}
          {activePrototype === 'selection' && (
            <div className="bg-[#0F0F10] border border-[#2D2D2E] rounded-2xl overflow-hidden shadow-2xl">
              {/* Header */}
              <div className="bg-[#1A1A1A] border-b border-[#2D2D2E] px-5 py-3.5 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#C9A227]/20 border border-[#C9A227]/40 flex items-center justify-center text-[#C9A227]">
                    <Package className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-[#EDE6D6] flex items-center gap-2">
                      Montagem de Mala Condicional VIP
                      <span className="text-[10px] px-2 py-0.5 rounded bg-[#C9A227]/20 text-[#C9A227] font-mono">
                        #MC-2024-001
                      </span>
                    </h3>
                    <p className="text-[11px] text-[#9E998E]">
                      Curadoria visual sob medida arrastando peças do estoque para a mala do cliente
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-[#9E998E]">Cliente:</span>
                  <select
                    value={selectedClientIndex}
                    onChange={(e) => setSelectedClientIndex(Number(e.target.value))}
                    className="bg-[#0F0F10] border border-[#2D2D2E] text-[#EDE6D6] text-xs px-3 py-1.5 rounded-lg focus:outline-none focus:border-[#C9A227]"
                  >
                    {INITIAL_CLIENTS.map((c, idx) => (
                      <option key={c.id} value={idx}>{c.name} ({c.style.profession || 'VIP'})</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Client Profile bar */}
              <div className="bg-[#151516] border-b border-[#2D2D2E] px-5 py-2.5 flex flex-wrap items-center justify-between text-xs gap-3">
                <div className="flex items-center gap-4">
                  <span className="text-[#9E998E]">Medidas do Dr. / Cliente:</span>
                  <span className="bg-[#1A1A1A] px-2 py-0.5 rounded border border-[#2D2D2E] text-[#C9A227] font-semibold">
                    Camisa: {currentClient.sizes.shirt}
                  </span>
                  <span className="bg-[#1A1A1A] px-2 py-0.5 rounded border border-[#2D2D2E] text-[#C9A227] font-semibold">
                    Calça: {currentClient.sizes.pants}
                  </span>
                  <span className="bg-[#1A1A1A] px-2 py-0.5 rounded border border-[#2D2D2E] text-[#C9A227] font-semibold">
                    Sapato: {currentClient.sizes.shoes}
                  </span>
                  <span className="text-[#9E998E]">Estilo: <strong className="text-[#EDE6D6]">{currentClient.sizes.fitPreference}</strong></span>
                </div>

                <div className="flex items-center gap-2 text-[11px]">
                  <span className="text-[#9E998E]">Prazo de Prova:</span>
                  {(['48h', '72h', '7d'] as const).map(p => (
                    <button
                      key={p}
                      onClick={() => setBoxDeadline(p)}
                      className={`px-2 py-0.5 rounded font-mono ${
                        boxDeadline === p
                          ? 'bg-[#C9A227] text-black font-bold'
                          : 'bg-[#1A1A1A] text-[#9E998E] hover:text-[#EDE6D6]'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              {/* Two Column Layout (Catalogue on Left, Virtual Box on Right) */}
              <div className="p-5 grid grid-cols-1 lg:grid-cols-12 gap-5">
                {/* Left: Available filtered catalog */}
                <div className="lg:col-span-7 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-[#EDE6D6] flex items-center gap-1.5">
                      <Filter className="w-3.5 h-3.5 text-[#C9A227]" />
                      Peças Disponíveis (Filtradas por Tamanho {currentClient.sizes.shirt} e {currentClient.sizes.pants})
                    </span>
                    <span className="text-[11px] text-[#9E998E]">
                      {availableProducts.length} peças compatíveis
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[440px] overflow-y-auto pr-1">
                    {availableProducts.map((prod) => (
                      <div
                        key={prod.id}
                        className="bg-[#1A1A1A] border border-[#2D2D2E] hover:border-[#C9A227] rounded-xl p-3 flex flex-col justify-between transition-all group shadow-sm"
                      >
                        <div className="flex gap-3">
                          <img
                            src={prod.imageUrl}
                            alt={prod.title}
                            className="w-16 h-16 rounded-lg object-cover border border-[#2D2D2E] shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <span className="text-[10px] text-[#9E998E] font-mono">{prod.sku}</span>
                            <h5 className="text-xs font-medium text-[#EDE6D6] truncate group-hover:text-[#C9A227] transition-colors">
                              {prod.title}
                            </h5>
                            <div className="text-xs font-semibold text-[#EDE6D6] mt-1">
                              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(prod.price)}
                            </div>
                            <div className="flex items-center gap-1 mt-1">
                              <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-500/10 text-amber-400">
                                {prod.stock} un. restantes
                              </span>
                            </div>
                          </div>
                        </div>

                        <button
                          onClick={() => handleAddItemToBox(prod)}
                          className="mt-3 w-full py-1.5 rounded-lg bg-[#242424] hover:bg-[#C9A227] hover:text-black text-[#EDE6D6] text-xs font-medium flex items-center justify-center gap-1.5 transition-all"
                        >
                          <MousePointer className="w-3.5 h-3.5" /> + Arrastar para Mala
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right: The Virtual Box (Dropzone) */}
                <div className="lg:col-span-5 bg-[#1A1A1A] border-2 border-dashed border-[#C9A227]/50 rounded-xl p-4 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between pb-3 border-b border-[#2D2D2E]">
                      <div className="flex items-center gap-2">
                        <Package className="w-4 h-4 text-[#C9A227]" />
                        <span className="text-xs font-semibold text-[#EDE6D6]">
                          Mala Ravi's do Cliente ({draggedItems.length} peças)
                        </span>
                      </div>
                      <span className="text-xs font-mono text-[#C9A227]">
                        Total: {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(boxTotalValue)}
                      </span>
                    </div>

                    {/* Dragged Items List */}
                    <div className="py-3 space-y-2 max-h-[300px] overflow-y-auto pr-1">
                      {draggedItems.length === 0 ? (
                        <div className="py-12 text-center text-[#9E998E] text-xs">
                          Nenhuma peça na mala ainda.<br />Clique em "+ Arrastar para Mala" ao lado.
                        </div>
                      ) : (
                        draggedItems.map((item, idx) => (
                          <div
                            key={idx}
                            className="bg-[#0F0F10] border border-[#2D2D2E] rounded-lg p-2.5 flex items-center justify-between gap-3 text-xs"
                          >
                            <img
                              src={item.imageUrl}
                              alt={item.title}
                              className="w-10 h-10 rounded object-cover border border-[#2D2D2E]"
                            />
                            <div className="flex-1 min-w-0">
                              <div className="text-[#EDE6D6] font-medium truncate">{item.title}</div>
                              <div className="text-[10px] text-[#9E998E]">{item.category} • Tam {item.sizes?.[0] || 'G'}</div>
                            </div>
                            <span className="text-xs font-semibold text-[#C9A227]">
                              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.price)}
                            </span>
                            <button
                              onClick={() => handleRemoveItemFromBox(item)}
                              className="text-[#9E998E] hover:text-red-400 p-1"
                              title="Remover da mala"
                            >
                              <XCircle className="w-4 h-4" />
                            </button>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  {/* Actions Bottom */}
                  <div className="pt-3 border-t border-[#2D2D2E] space-y-2">
                    {boxDispatched ? (
                      <div className="bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 p-3 rounded-xl text-xs flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                        <span>Mala despachada com sucesso! Notificação via WhatsApp disparada para {currentClient.name}.</span>
                      </div>
                    ) : (
                      <button
                        onClick={() => {
                          setBoxDispatched(true);
                          setTimeout(() => setBoxDispatched(false), 4000);
                        }}
                        disabled={draggedItems.length === 0}
                        className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#C9A227] to-[#DFC053] hover:from-[#DFC053] hover:to-[#C9A227] text-black font-semibold text-xs flex items-center justify-center gap-2 shadow-lg shadow-[#C9A227]/20 disabled:opacity-50 transition-all"
                      >
                        <Send className="w-4 h-4" />
                        <span>Finalizar Mala & Disparar no WhatsApp</span>
                      </button>
                    )}

                    <div className="flex items-center justify-between text-[10px] text-[#9E998E] pt-1">
                      <span>Motorista VIP: <strong className="text-[#EDE6D6]">Agendado para 14:00</strong></span>
                      <span>Prazo de devolução: <strong className="text-[#C9A227]">{boxDeadline}</strong></span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SCREEN 3: LOGIN & AUTENTICAÇÃO */}
          {activePrototype === 'login' && (
            <div className="max-w-md mx-auto bg-[#0F0F10] border border-[#2D2D2E] rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6">
              {/* Brand Header */}
              <div className="text-center space-y-2">
                <div className="w-14 h-14 mx-auto rounded-xl bg-gradient-to-br from-[#C9A227] via-[#a87424] to-[#754e12] flex items-center justify-center shadow-lg shadow-[#C9A227]/25 border border-[#DFC053]/40">
                  <span className="font-serif font-bold text-black text-2xl">R</span>
                </div>
                <h3 className="font-serif text-2xl text-[#EDE6D6] font-bold tracking-wide">
                  RAVI'S PREMIUM
                </h3>
                <p className="text-xs text-[#9E998E]">
                  Canoinhas - SC • Acesso ao Sistema de Curadoria & CRM
                </p>
              </div>

              {/* Role Selector */}
              <div className="bg-[#1A1A1A] p-1 rounded-xl border border-[#2D2D2E] flex text-xs">
                {(['CURADOR', 'ADMIN', 'ATENDENTE'] as const).map(role => (
                  <button
                    key={role}
                    onClick={() => setLoginRole(role)}
                    className={`flex-1 py-1.5 rounded-lg font-medium transition-all ${
                      loginRole === role
                        ? 'bg-[#C9A227] text-black font-semibold shadow'
                        : 'text-[#9E998E] hover:text-[#EDE6D6]'
                    }`}
                  >
                    {role}
                  </button>
                ))}
              </div>

              {/* Form */}
              <div className="space-y-4 text-xs">
                <div>
                  <label className="block text-[#9E998E] mb-1 font-medium">E-mail Corporativo ou Usuário</label>
                  <input
                    type="email"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    className="w-full bg-[#1A1A1A] border border-[#2D2D2E] focus:border-[#C9A227] rounded-xl px-3.5 py-2.5 text-[#EDE6D6] focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-[#9E998E] font-medium">Chave de Acesso / Senha</label>
                    <span className="text-[11px] text-[#C9A227] hover:underline cursor-pointer">Esqueceu?</span>
                  </div>
                  <input
                    type="password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="w-full bg-[#1A1A1A] border border-[#2D2D2E] focus:border-[#C9A227] rounded-xl px-3.5 py-2.5 text-[#EDE6D6] focus:outline-none transition-colors"
                  />
                </div>

                <div className="flex items-center justify-between text-[11px] text-[#9E998E]">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" defaultChecked className="rounded accent-[#C9A227]" />
                    <span>Lembrar dispositivo por 30 dias</span>
                  </label>
                  <span className="flex items-center gap-1 text-[#C9A227]">
                    <ShieldCheck className="w-3.5 h-3.5" /> SSL 256-bit
                  </span>
                </div>

                {loginSuccess ? (
                  <div className="bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 p-3 rounded-xl text-xs text-center font-medium">
                    Autenticado como {loginRole}! Redirecionando para o cockpit...
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      setLoginSuccess(true);
                      setTimeout(() => setLoginSuccess(false), 3000);
                    }}
                    className="w-full py-2.5 rounded-xl bg-[#C9A227] hover:bg-[#DFC053] text-black font-semibold text-xs flex items-center justify-center gap-2 shadow-lg shadow-[#C9A227]/25 transition-all"
                  >
                    <Lock className="w-3.5 h-3.5" />
                    <span>Entrar no Ravis CRM</span>
                  </button>
                )}

                {/* Mobile Fast-Pin Option */}
                <div className="pt-2 text-center">
                  <button className="text-[11px] text-[#9E998E] hover:text-[#EDE6D6] flex items-center justify-center gap-1.5 mx-auto">
                    <Smartphone className="w-3.5 h-3.5 text-[#C9A227]" />
                    <span>Acesso rápido no balcão via Biometria / PIN</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 2. DESIGN TOKENS TAB */}
      {activeMainTab === 'tokens' && (
        <div className="space-y-6">
          {RAVIS_DESIGN_TOKENS.map((group, groupIdx) => (
            <div key={groupIdx} className="bg-[#1A1A1A] border border-[#2D2D2E] rounded-2xl p-5 space-y-4">
              <div>
                <h3 className="text-sm font-semibold text-[#EDE6D6] font-serif">{group.category}</h3>
                <p className="text-xs text-[#9E998E] mt-0.5">{group.description}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {group.tokens.map((token, tokIdx) => {
                  const tokenKey = `${groupIdx}-${tokIdx}`;
                  return (
                    <div
                      key={tokIdx}
                      className="bg-[#0F0F10] border border-[#2D2D2E] rounded-xl p-3 flex flex-col justify-between hover:border-[#C9A227]/40 transition-all text-xs"
                    >
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <code className="text-[#C9A227] font-mono text-[11px] font-semibold">{token.name}</code>
                          <button
                            onClick={() => handleCopy(token.value, tokenKey)}
                            className="text-[#9E998E] hover:text-[#EDE6D6] p-1"
                            title="Copiar valor do token"
                          >
                            {copiedToken === tokenKey ? (
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                        <div className="flex items-center gap-2">
                          {token.sample && (
                            <div
                              style={{ backgroundColor: token.sample }}
                              className="w-5 h-5 rounded border border-[#2D2D2E] shrink-0"
                            />
                          )}
                          <div className="font-mono text-[11px] text-[#EDE6D6] truncate">{token.value}</div>
                        </div>
                        <p className="text-[11px] text-[#9E998E] pt-1 border-t border-[#2D2D2E]/60">
                          {token.usage}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 3. UI COMPONENTS TAB */}
      {activeMainTab === 'components' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Buttons & CTAs */}
            <div className="bg-[#1A1A1A] border border-[#2D2D2E] rounded-2xl p-5 space-y-4">
              <h4 className="text-sm font-semibold text-[#EDE6D6]">1. Botões & Ações Operacionais</h4>
              <p className="text-xs text-[#9E998E]">Estilização com feedback tátil de alta velocidade (Raycast/Linear).</p>

              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-2">
                  <button className="px-4 py-2 rounded-xl bg-[#C9A227] hover:bg-[#DFC053] text-black font-semibold text-xs flex items-center gap-1.5 shadow-lg shadow-[#C9A227]/20">
                    <Sparkles className="w-3.5 h-3.5" /> Primário Dourado (CTA)
                  </button>
                  <button className="px-4 py-2 rounded-xl bg-[#242424] hover:bg-[#2D2D2E] text-[#EDE6D6] text-xs font-medium border border-[#2D2D2E]">
                    Secundário Carvão
                  </button>
                  <button className="px-3 py-2 rounded-xl bg-[#0F0F10] hover:bg-[#1A1A1A] text-[#9E998E] hover:text-red-400 text-xs border border-[#2D2D2E]">
                    Destrutivo Sutil
                  </button>
                </div>

                <div className="flex items-center gap-2 text-xs">
                  <span className="text-[#9E998E]">Atalhos embutidos:</span>
                  <button className="px-2.5 py-1 rounded-lg bg-[#0F0F10] border border-[#2D2D2E] text-xs text-[#EDE6D6] flex items-center gap-1.5">
                    <span>Nova Mala</span>
                    <kbd className="px-1.5 py-0.5 rounded bg-[#1A1A1A] text-[9px] font-mono text-[#C9A227] border border-[#2D2D2E]">N</kbd>
                  </button>
                  <button className="px-2.5 py-1 rounded-lg bg-[#0F0F10] border border-[#2D2D2E] text-xs text-[#EDE6D6] flex items-center gap-1.5">
                    <span>Buscar Cliente</span>
                    <kbd className="px-1.5 py-0.5 rounded bg-[#1A1A1A] text-[9px] font-mono text-[#C9A227] border border-[#2D2D2E]">Cmd+K</kbd>
                  </button>
                </div>
              </div>
            </div>

            {/* Badges & Tags */}
            <div className="bg-[#1A1A1A] border border-[#2D2D2E] rounded-2xl p-5 space-y-4">
              <h4 className="text-sm font-semibold text-[#EDE6D6]">2. Badges de Status & Tags de Moda</h4>
              <p className="text-xs text-[#9E998E]">Controle de ciclo da mala e categorização de alfaiataria.</p>

              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-1 rounded-md text-[10px] font-medium bg-amber-500/15 text-amber-300 border border-amber-500/30">
                  EM_TESTE (48h restantes)
                </span>
                <span className="px-2.5 py-1 rounded-md text-[10px] font-medium bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                  COMPRADO (100% Retenção)
                </span>
                <span className="px-2.5 py-1 rounded-md text-[10px] font-medium bg-red-500/15 text-red-300 border border-red-500/30">
                  DEVOLVIDO (Ajuste barra)
                </span>
                <span className="px-2.5 py-1 rounded-md text-[10px] font-medium bg-[#C9A227]/15 text-[#C9A227] border border-[#C9A227]/30">
                  VIP DIAMANTE
                </span>
                <span className="px-2.5 py-1 rounded-md text-[10px] font-medium bg-[#242424] text-[#EDE6D6] border border-[#2D2D2E]">
                  Tam: 42 Slim
                </span>
              </div>
            </div>

            {/* Inputs & Form Elements */}
            <div className="bg-[#1A1A1A] border border-[#2D2D2E] rounded-2xl p-5 space-y-4">
              <h4 className="text-sm font-semibold text-[#EDE6D6]">3. Inputs & Controles de Busca</h4>
              <div className="space-y-3">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-3 text-[#9E998E]" />
                  <input
                    type="text"
                    placeholder="Buscar por nome, telefone ou @instagram..."
                    className="w-full bg-[#0F0F10] border border-[#2D2D2E] focus:border-[#C9A227] rounded-xl pl-9 pr-3 py-2 text-xs text-[#EDE6D6] focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Cards & Elevation */}
            <div className="bg-[#1A1A1A] border border-[#2D2D2E] rounded-2xl p-5 space-y-4">
              <h4 className="text-sm font-semibold text-[#EDE6D6]">4. Cards de Produto & Clientes</h4>
              <div className="bg-[#0F0F10] border border-[#2D2D2E] hover:border-[#C9A227]/50 rounded-xl p-3 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#1A1A1A] border border-[#2D2D2E] flex items-center justify-center text-[#C9A227] font-serif font-bold">
                    DG
                  </div>
                  <div>
                    <div className="font-semibold text-[#EDE6D6]">Dr. Guilherme (Médico)</div>
                    <div className="text-[10px] text-[#9E998E]">LTV R$ 14.200 • Conv: 85% • Tam: 3 / 42</div>
                  </div>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400 font-medium">
                  Ativo
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. NAVIGATION FLOW TAB */}
      {activeMainTab === 'navigation' && (
        <div className="space-y-6">
          <div className="bg-[#1A1A1A] border border-[#2D2D2E] rounded-2xl p-5">
            <h3 className="text-sm font-semibold text-[#EDE6D6] font-serif mb-1">
              Fluxo End-to-End da Curadoria de Moda Ravi's
            </h3>
            <p className="text-xs text-[#9E998E] mb-5">
              Do primeiro contato no WhatsApp à retenção de peças e recompra em 60 dias
            </p>

            <div className="space-y-4">
              {NAVIGATION_FLOW_STEPS.map((step) => (
                <div
                  key={step.step}
                  className="bg-[#0F0F10] border border-[#2D2D2E] rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-[#C9A227]/40 transition-all text-xs"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-7 h-7 rounded-full bg-[#C9A227]/20 border border-[#C9A227]/40 text-[#C9A227] flex items-center justify-center font-bold font-mono shrink-0">
                      {step.step}
                    </div>
                    <div>
                      <h4 className="font-semibold text-[#EDE6D6]">{step.title}</h4>
                      <p className="text-[11px] text-[#9E998E] mt-0.5">
                        <strong className="text-neutral-400">Gatilho:</strong> {step.trigger}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col md:items-end gap-1 shrink-0 text-left md:text-right">
                    <span className="px-2.5 py-0.5 rounded bg-[#1A1A1A] border border-[#2D2D2E] text-[#C9A227] font-medium text-[11px]">
                      Tela: {step.screen}
                    </span>
                    <span className="text-[11px] text-[#9E998E] max-w-sm">
                      {step.outcome}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Wireframes Screen Catalog */}
          <div className="bg-[#1A1A1A] border border-[#2D2D2E] rounded-2xl p-5 space-y-4">
            <h3 className="text-sm font-semibold text-[#EDE6D6] font-serif">
              Catálogo de Telas Prioritárias do CRM (7 Telas)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {WIREFRAME_SCREENS.map((screen) => (
                <div
                  key={screen.id}
                  className="bg-[#0F0F10] border border-[#2D2D2E] rounded-xl p-4 space-y-3 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-[#EDE6D6]">{screen.name}</h4>
                    <span className="px-2 py-0.5 rounded bg-[#242424] text-[10px] text-[#9E998E]">
                      {screen.viewport}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#9E998E] leading-relaxed">
                    {screen.purpose}
                  </p>

                  <div className="space-y-1.5 pt-2 border-t border-[#2D2D2E]">
                    <div className="text-[10px] text-[#C9A227] font-mono">Zonas de Interface:</div>
                    {screen.zones.map((z, idx) => (
                      <div key={idx} className="text-[11px] text-[#9E998E] pl-2 border-l border-[#2D2D2E]">
                        <strong className="text-[#EDE6D6]">{z.zone}:</strong> {z.description}
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-wrap items-center gap-1.5 pt-2">
                    <span className="text-[10px] text-[#9E998E]">Atalhos:</span>
                    {screen.keyShortcuts.map((sc, i) => (
                      <span key={i} className="text-[9px] px-1.5 py-0.5 rounded bg-[#1A1A1A] border border-[#2D2D2E] text-[#C9A227] font-mono">
                        {sc}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
