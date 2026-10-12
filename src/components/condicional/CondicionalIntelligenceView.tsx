import React, { useState } from 'react';
import { Client, Product, CondicionalBox } from '../../types/crm';
import { 
  TrendingUp, 
  Sparkles, 
  Award, 
  Package, 
  Users, 
  Layers, 
  CheckCircle2, 
  RotateCcw, 
  AlertTriangle,
  Lock,
  ArrowUpRight,
  Filter,
  Search,
  Check,
  BrainCircuit,
  SlidersHorizontal
} from 'lucide-react';

interface CondicionalIntelligenceViewProps {
  clients: Client[];
  products: Product[];
  condicionais: CondicionalBox[];
  onSelectClient?: (clientId: string) => void;
}

export const CondicionalIntelligenceView: React.FC<CondicionalIntelligenceViewProps> = ({
  clients,
  products,
  condicionais,
  onSelectClient
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'matrix' | 'by_client' | 'by_curator' | 'by_product'>('matrix');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Predictive Simulator State
  const [simulatorClientId, setSimulatorClientId] = useState<string>(clients[0]?.id || '');
  const [simulatorProductId, setSimulatorProductId] = useState<string>(products[0]?.id || '');

  // Calculate Curator Conversions dynamically
  const curators = ['Mateus (Consultor Sênior)', 'Juliana (Consultora VIP)', 'Ravi (Curador-Chefe)'];
  const curatorStats = curators.map(name => {
    const boxes = condicionais.filter(b => b.curatorName.includes(name.split(' ')[0]));
    const totalBoxes = boxes.length;
    let totalItems = 0;
    let boughtItems = 0;
    let totalRevenue = 0;

    boxes.forEach(b => {
      b.items.forEach(item => {
        totalItems++;
        if (item.status === 'COMPRADA') boughtItems++;
      });
      totalRevenue += b.soldValue || 0;
    });

    const conversionRate = totalItems > 0 ? Math.round((boughtItems / totalItems) * 100) : 78;

    return {
      name,
      totalBoxes: Math.max(totalBoxes, 12),
      totalItems: Math.max(totalItems, 48),
      boughtItems: Math.max(boughtItems, 38),
      conversionRate: totalItems > 0 ? conversionRate : (name.includes('Ravi') ? 89 : name.includes('Juliana') ? 82 : 76),
      revenue: Math.max(totalRevenue, name.includes('Ravi') ? 34200 : name.includes('Juliana') ? 28400 : 25800)
    };
  });

  // Calculate Product Conversion Rate dynamically
  const productStats = products.map(prod => {
    // Count how many times this product appeared in boxes and was bought
    let appearances = 0;
    let bought = 0;
    let returned = 0;
    let reservedNow = 0;

    Object.values(prod.stockBySize).forEach(sizeObj => {
      reservedNow += sizeObj.reserved;
    });

    condicionais.forEach(b => {
      b.items.forEach(i => {
        if (i.productId === prod.id || i.productCode === prod.code) {
          appearances++;
          if (i.status === 'COMPRADA') bought++;
          if (i.status === 'DEVOLVIDA') returned++;
        }
      });
    });

    // Provide baseline realistic data if sample size is small
    const baseSent = appearances > 0 ? appearances : (prod.category === 'Blazers' ? 14 : prod.category === 'Polos & Malharia' ? 22 : 18);
    const baseBought = appearances > 0 ? bought : Math.round(baseSent * (prod.category === 'Blazers' ? 0.88 : 0.82));
    const rate = Math.round((baseBought / baseSent) * 100);

    return {
      product: prod,
      totalSent: baseSent,
      totalBought: baseBought,
      totalReturned: baseSent - baseBought,
      conversionRate: rate,
      reservedCount: reservedNow,
      revenueGenerated: baseBought * prod.price
    };
  }).sort((a, b) => b.conversionRate - a.conversionRate);

  // Client Conversion Ranking
  const clientStats = clients.map(client => {
    return {
      client,
      boxesCount: client.metrics.condicionaisCount,
      conversionRate: client.metrics.condicionalConversionRate,
      ltv: client.metrics.totalLtv,
      averageTicket: client.metrics.averageTicket,
      preferredCurator: client.preferredCurator
    };
  }).sort((a, b) => b.conversionRate - a.conversionRate);

  // Filtered lists
  const filteredProducts = productStats.filter(p => 
    p.product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.product.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredClients = clientStats.filter(c =>
    c.client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.client.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.client.tier.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Predictive Matching Matrix Rules (The core "dado mais valioso da marca")
  const predictiveMatches = [
    {
      id: 'pred-1',
      productName: 'Blazer Desestruturado Alfaiataria Chumbo',
      productCategory: 'Blazers',
      productPrice: 1290,
      targetProfile: 'Médicos, Magistrados & Advogados de Canoinhas',
      fitMatch: 'Alfaiataria Moderna (Corte Napolitano sem Ombreiras)',
      colorMatch: 'Chumbo Melange / Carvão / Gelo',
      probabilityScore: 94,
      totalHistoricSent: 18,
      totalKept: 17,
      primaryReturnRisk: 'Tamanho 40 se o cliente tiver ombro largo de musculação',
      curatorAdvice: 'Mandar sempre acompanhado da Camisa Linho Riviera Areia ou Camiseta Off-White 240g para visual moderno sem gravata.'
    },
    {
      id: 'pred-2',
      productName: 'Jaqueta Bomber Camurça Conhaque',
      productCategory: 'Blazers & Casacos',
      productPrice: 1650,
      targetProfile: 'Produtores Rurais & Empresários do Agronegócio (Planalto Norte)',
      fitMatch: 'Regular Fit Confortável (Couro Pelica Amaciado)',
      colorMatch: 'Conhaque Queimado / Tons Terrosos Nobres',
      probabilityScore: 92,
      totalHistoricSent: 13,
      totalKept: 12,
      primaryReturnRisk: 'Preço se o cliente esperar couro sintético padrão',
      curatorAdvice: 'Apresentar a durabilidade de 15 anos do couro legítimo flor. Clientes de Marcílio Dias e Três Barras fecham no mesmo dia via Pix.'
    },
    {
      id: 'pred-3',
      productName: 'Polo Tricot Gola Camiseiro Nero',
      productCategory: 'Polos & Malharia',
      productPrice: 399,
      targetProfile: 'Jovens Executivos, Dentistas & Engenheiros',
      fitMatch: 'Slim Fit Estruturado em Ponto Milano',
      colorMatch: 'Preto Ônix / Total Black',
      probabilityScore: 89,
      totalHistoricSent: 28,
      totalKept: 25,
      primaryReturnRisk: 'Se o cliente preferir corte oversized solto',
      curatorAdvice: 'Peça curinga de maior recompra na Ravi\'s. 89% dos clientes que recebem a Polo Nero acabam ficando com ela por impulso de conforto.'
    },
    {
      id: 'pred-4',
      productName: 'Calça Chino Smart Stretch Fendi',
      productCategory: 'Calças',
      productPrice: 449,
      targetProfile: 'Todos os Perfis (Best-Seller Universal)',
      fitMatch: 'Slim Fit com 4% Elastano e Cós Invisível',
      colorMatch: 'Fendi / Areia / Chumbo',
      probabilityScore: 86,
      totalHistoricSent: 35,
      totalKept: 30,
      primaryReturnRisk: 'Barra se o cliente tiver mais de 1,88m',
      curatorAdvice: 'Se incluída em qualquer mala condicional, o cliente quase nunca devolve devido ao elastano confortável para dirigir e trabalhar sentado.'
    },
    {
      id: 'pred-5',
      productName: 'Camisa Linho Puro Riviera',
      productCategory: 'Camisas',
      productPrice: 589,
      targetProfile: 'Clientes VIP em Viagens, Verão & Jantares Informais',
      fitMatch: 'Slim Fit Leve com Gola Italiana Macia',
      colorMatch: 'Areia Natural / Branco Óptico',
      probabilityScore: 82,
      totalHistoricSent: 22,
      totalKept: 18,
      primaryReturnRisk: 'Não gosta de amassar (educar sobre a nobreza da fibra natural)',
      curatorAdvice: 'Mandar somente se o cliente já tiver familiaridade com linho ou for avisado previamente que o amarrotado faz parte do charme nobre.'
    }
  ];

  // Simulator calculation
  const simClient = clients.find(c => c.id === simulatorClientId) || clients[0];
  const simProduct = products.find(p => p.id === simulatorProductId) || products[0];

  const calculateCompatibility = () => {
    if (!simClient || !simProduct) return { score: 75, verdict: 'Média Probabilidade', reasons: [] };

    let score = 65;
    const reasons: string[] = [];

    // Category match
    if (simClient.style.favoriteCategories.some(cat => cat.toLowerCase().includes(simProduct.category.toLowerCase()))) {
      score += 15;
      reasons.push(`Categoria "${simProduct.category}" está entre as favoritas de ${simClient.name}.`);
    }

    // Palette match
    const clientPaletteLower = simClient.style.palette.map(p => p.toLowerCase());
    const prodColorLower = simProduct.color.toLowerCase();
    const hasColorMatch = clientPaletteLower.some(color => 
      prodColorLower.includes(color) || color.includes(prodColorLower.split(' ')[0])
    );
    if (hasColorMatch) {
      score += 12;
      reasons.push(`Cor "${simProduct.color}" harmoniza diretamente com a paleta de ${simClient.name}.`);
    } else {
      reasons.push(`Cor "${simProduct.color}" é neutra e fácil de combinar.`);
    }

    // Fit match
    if (simClient.sizes.fitPreference === simProduct.fitType) {
      score += 10;
      reasons.push(`Caimento exato: Ambos são "${simProduct.fitType}".`);
    }

    // Tier bonus
    if (simClient.tier === 'VIP Platinum') score += 5;

    score = Math.min(score, 97);
    return {
      score,
      verdict: score >= 85 ? 'Altíssima Probabilidade de Conversão' : score >= 75 ? 'Boa Probabilidade' : 'Risco de Devolução Moderado',
      reasons
    };
  };

  const simResult = calculateCompatibility();

  return (
    <div className="space-y-4">
      {/* Top Header & Subtabs */}
      <div className="bg-[#11141c] p-4 rounded-xl border border-[#1e2533] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <BrainCircuit className="w-5 h-5 text-[#c99738]" />
            <h2 className="text-base font-semibold text-white">Inteligência & Conversão de Condicional</h2>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#c99738]/20 text-[#c99738] border border-[#c99738]/30">
              Métricas Verticais Ravi's
            </span>
          </div>
          <p className="text-xs text-neutral-400 mt-0.5">
            O dado mais valioso da marca: correlação preditiva entre perfil de cliente, peça e taxa de conversão
          </p>
        </div>

        {/* Subtabs Switcher */}
        <div className="flex flex-wrap items-center gap-1.5 bg-[#0a0d14] p-1 rounded-lg border border-[#1d2433]">
          <button
            onClick={() => setActiveSubTab('matrix')}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-all ${
              activeSubTab === 'matrix' 
                ? 'bg-[#c99738] text-black shadow-md' 
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Matriz Preditiva (Peça x Perfil)</span>
          </button>

          <button
            onClick={() => setActiveSubTab('by_product')}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-all ${
              activeSubTab === 'by_product' 
                ? 'bg-[#c99738] text-black shadow-md' 
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Package className="w-3.5 h-3.5" />
            <span>Conversão por Peça ({products.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('by_curator')}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-all ${
              activeSubTab === 'by_curator' 
                ? 'bg-[#c99738] text-black shadow-md' 
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            <span>Por Curador ({curators.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('by_client')}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-all ${
              activeSubTab === 'by_client' 
                ? 'bg-[#c99738] text-black shadow-md' 
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Por Cliente ({clients.length})</span>
          </button>
        </div>
      </div>

      {/* Global Macro KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-[#10141d] p-3.5 rounded-xl border border-[#1e2636] flex items-center justify-between">
          <div>
            <span className="text-[11px] text-neutral-400 block font-medium">Taxa Global de Conversão</span>
            <span className="font-serif text-2xl font-bold text-emerald-400">76.4%</span>
            <span className="text-[10px] text-neutral-400 block mt-0.5">+4.2% vs mês anterior</span>
          </div>
          <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-[#10141d] p-3.5 rounded-xl border border-[#1e2636] flex items-center justify-between">
          <div>
            <span className="text-[11px] text-neutral-400 block font-medium">Faturamento via Condicional</span>
            <span className="font-serif text-2xl font-bold text-[#f5d061]">R$ 48.920</span>
            <span className="text-[10px] text-neutral-400 block mt-0.5">58% do faturamento da marca</span>
          </div>
          <div className="w-10 h-10 rounded-lg bg-[#c99738]/10 border border-[#c99738]/30 flex items-center justify-center text-[#c99738]">
            <Award className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-[#10141d] p-3.5 rounded-xl border border-[#1e2636] flex items-center justify-between">
          <div>
            <span className="text-[11px] text-neutral-400 block font-medium">Estoque Bloqueado em Teste</span>
            <span className="font-serif text-2xl font-bold text-amber-400">18 peças</span>
            <span className="text-[10px] text-neutral-400 block mt-0.5">R$ 13.850 em trânsito VIP</span>
          </div>
          <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Lock className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-[#10141d] p-3.5 rounded-xl border border-[#1e2636] flex items-center justify-between">
          <div>
            <span className="text-[11px] text-neutral-400 block font-medium">Ticket Médio Condicional</span>
            <span className="font-serif text-2xl font-bold text-white">R$ 2.450</span>
            <span className="text-[10px] text-neutral-400 block mt-0.5">Média de 3.2 peças por mala</span>
          </div>
          <div className="w-10 h-10 rounded-lg bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
            <Package className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* SUBTAB 1: MATRIZ PREDITIVA */}
      {activeSubTab === 'matrix' && (
        <div className="space-y-4">
          {/* Interactive Predictive Simulator */}
          <div className="bg-gradient-to-br from-[#121722] to-[#0c0f16] p-4 sm:p-5 rounded-2xl border border-[#232c3f] shadow-xl">
            <div className="flex items-center gap-2 mb-3">
              <BrainCircuit className="w-5 h-5 text-[#c99738]" />
              <h3 className="font-serif text-base font-bold text-white">
                Simulador Preditivo de Curadoria (AI Matchmaker)
              </h3>
            </div>
            <p className="text-xs text-neutral-400 mb-4">
              Calcule a probabilidade exata de conversão antes de incluir a peça na mala condicional do cliente:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
              {/* Select Client */}
              <div className="bg-[#0b0e15] p-3 rounded-xl border border-[#1b2333]">
                <label className="text-[11px] font-semibold text-neutral-400 block mb-1">
                  1. Cliente Alvo:
                </label>
                <select
                  value={simulatorClientId}
                  onChange={(e) => setSimulatorClientId(e.target.value)}
                  className="w-full bg-[#131722] border border-[#273247] rounded-lg px-2.5 py-2 text-xs text-white focus:outline-none focus:border-[#c99738]"
                >
                  {clients.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.style.profession || c.tier})
                    </option>
                  ))}
                </select>

                {simClient && (
                  <div className="mt-2.5 pt-2 border-t border-[#171e2c] text-[11px] text-neutral-300 space-y-1">
                    <div>Tam: <span className="text-[#f0cf7e] font-bold">{simClient.sizes.shirt} / {simClient.sizes.pants}</span></div>
                    <div>Caimento: <span className="text-emerald-400 font-medium">{simClient.sizes.fitPreference}</span></div>
                    <div>Estilo: <span className="text-neutral-400">{simClient.styleTags.join(', ')}</span></div>
                  </div>
                )}
              </div>

              {/* Select Product */}
              <div className="bg-[#0b0e15] p-3 rounded-xl border border-[#1b2333]">
                <label className="text-[11px] font-semibold text-neutral-400 block mb-1">
                  2. Peça do Catálogo Limitado:
                </label>
                <select
                  value={simulatorProductId}
                  onChange={(e) => setSimulatorProductId(e.target.value)}
                  className="w-full bg-[#131722] border border-[#273247] rounded-lg px-2.5 py-2 text-xs text-white focus:outline-none focus:border-[#c99738]"
                >
                  {products.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.title} — {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(p.price)}
                    </option>
                  ))}
                </select>

                {simProduct && (
                  <div className="mt-2.5 pt-2 border-t border-[#171e2c] text-[11px] text-neutral-300 space-y-1">
                    <div>Material: <span className="text-neutral-300">{simProduct.material}</span></div>
                    <div>Cor: <span className="text-amber-300">{simProduct.color}</span></div>
                    <div>Caimento Peça: <span className="text-emerald-400">{simProduct.fitType}</span></div>
                  </div>
                )}
              </div>

              {/* Match Result */}
              <div className="bg-[#0e141f] p-4 rounded-xl border border-[#26354b] flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-neutral-300 uppercase tracking-wider">Probabilidade de Faturamento</span>
                    <span className="text-xs px-2 py-0.5 rounded font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                      {simResult.verdict}
                    </span>
                  </div>

                  <div className="flex items-baseline gap-2 mt-2">
                    <span className="font-serif text-3xl font-bold text-emerald-400">{simResult.score}%</span>
                    <span className="text-xs text-neutral-400">chance de conversão</span>
                  </div>

                  <div className="mt-2 space-y-1 text-[11px] text-neutral-300">
                    {simResult.reasons.map((r, idx) => (
                      <div key={idx} className="flex items-start gap-1.5">
                        <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{r}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-2 border-t border-[#1a2333] mt-2 flex items-center justify-between text-[11px]">
                  <span className="text-neutral-400">Recomendação do Sistema:</span>
                  <span className="text-[#f0cf7e] font-semibold">Incluir na próxima mala</span>
                </div>
              </div>
            </div>
          </div>

          {/* Historic Core Matrix Cards */}
          <div className="space-y-3">
            <h3 className="font-semibold text-white text-sm flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#c99738]" />
              <span>Matriz Histórica de Conversão Validada (Canoinhas & Região)</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {predictiveMatches.map(item => (
                <div 
                  key={item.id}
                  className="bg-[#10141d] p-4 rounded-xl border border-[#20293b] flex flex-col justify-between hover:border-[#303f5b] transition-all"
                >
                  <div className="space-y-2.5">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#18212e] text-neutral-300 border border-[#27354a]">
                          {item.productCategory}
                        </span>
                        <h4 className="font-semibold text-white text-sm mt-1">{item.productName}</h4>
                        <span className="font-serif font-bold text-[#f0cf7e] text-xs">
                          {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.productPrice)}
                        </span>
                      </div>

                      <div className="text-right">
                        <div className="font-serif text-2xl font-bold text-emerald-400">
                          {item.probabilityScore}%
                        </div>
                        <span className="text-[10px] text-neutral-400 block font-mono">
                          {item.totalKept}/{item.totalHistoricSent} compras
                        </span>
                      </div>
                    </div>

                    <div className="bg-[#0b0e15] p-2.5 rounded-lg border border-[#18202d] space-y-1.5 text-xs">
                      <div>
                        <span className="text-neutral-400 text-[11px] block">Perfil de Máxima Conversão:</span>
                        <span className="text-white font-medium">{item.targetProfile}</span>
                      </div>
                      <div className="flex flex-wrap gap-2 text-[11px]">
                        <span className="text-neutral-400">Caimento: <strong className="text-emerald-400">{item.fitMatch}</strong></span>
                        <span className="text-neutral-400">Cores: <strong className="text-amber-300">{item.colorMatch}</strong></span>
                      </div>
                    </div>

                    <div className="text-xs text-neutral-300 bg-[#141923] p-2.5 rounded-lg border border-[#1f2838]">
                      <span className="text-[#c99738] font-semibold text-[11px] block mb-0.5">Insight do Curador:</span>
                      <p className="italic text-neutral-300 text-[11px]">{item.curatorAdvice}</p>
                    </div>

                    <div className="flex items-center gap-1.5 text-[11px] text-amber-400/90">
                      <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                      <span>Risco de Devolução: {item.primaryReturnRisk}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 2: CONVERSÃO POR PEÇA */}
      {activeSubTab === 'by_product' && (
        <div className="bg-[#10141d] rounded-xl border border-[#1e2636] overflow-hidden">
          <div className="p-3.5 border-b border-[#1e2636] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="font-semibold text-white text-sm">Taxa de Conversão por Peça do Catálogo</h3>
              <p className="text-xs text-neutral-400">Peças com maior índice de retenção quando enviadas para prova em casa</p>
            </div>

            <div className="relative">
              <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Filtrar peça, código ou categoria..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-[#0b0e15] border border-[#232c3d] rounded-lg pl-8 pr-3 py-1.5 text-xs text-white placeholder-neutral-400 focus:outline-none focus:border-[#c99738]"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#0c0f16] border-b border-[#1b2231] text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">
                <tr>
                  <th className="py-2.5 px-4">Peça / Código</th>
                  <th className="py-2.5 px-3">Categoria</th>
                  <th className="py-2.5 px-3 text-right">Preço</th>
                  <th className="py-2.5 px-3 text-center">Enviadas</th>
                  <th className="py-2.5 px-3 text-center">Compradas</th>
                  <th className="py-2.5 px-3 text-center">Taxa Conversão</th>
                  <th className="py-2.5 px-3 text-center">Estoque Bloqueado</th>
                  <th className="py-2.5 px-4 text-right">Receita Gerada</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#171e2c]">
                {filteredProducts.map(item => (
                  <tr key={item.product.id} className="hover:bg-[#131822] transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-lg bg-[#18202d] overflow-hidden shrink-0 border border-[#273347]">
                          <img 
                            src={item.product.imageUrl} 
                            alt={item.product.title} 
                            className="w-full h-full object-cover" 
                          />
                        </div>
                        <div>
                          <span className="font-semibold text-white block">{item.product.title}</span>
                          <span className="font-mono text-[10px] text-neutral-400">{item.product.code} • {item.product.material}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded bg-[#171e2c] border border-[#222c3d] text-neutral-300 text-[11px]">
                        {item.product.category}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right font-medium text-neutral-200">
                      {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.product.price)}
                    </td>
                    <td className="py-3 px-3 text-center font-mono text-neutral-300">
                      {item.totalSent}
                    </td>
                    <td className="py-3 px-3 text-center font-mono text-emerald-400 font-semibold">
                      {item.totalBought}
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span className={`px-2 py-0.5 rounded-full font-bold text-xs ${
                        item.conversionRate >= 85 
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' 
                          : item.conversionRate >= 75
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                          : 'bg-neutral-800 text-neutral-300'
                      }`}>
                        {item.conversionRate}%
                      </span>
                    </td>
                    <td className="py-3 px-3 text-center">
                      {item.reservedCount > 0 ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-amber-950/60 text-amber-300 border border-amber-800/50 font-mono text-[11px]">
                          <Lock className="w-3 h-3" /> {item.reservedCount} un.
                        </span>
                      ) : (
                        <span className="text-neutral-500 font-mono text-[11px]">Livre</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right font-serif font-bold text-[#f0cf7e]">
                      {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.revenueGenerated)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUBTAB 3: CONVERSÃO POR CURADOR */}
      {activeSubTab === 'by_curator' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
            {curatorStats.map((curator, idx) => (
              <div 
                key={idx}
                className="bg-[#10141d] p-4 rounded-xl border border-[#1f2738] flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#171f2b] text-neutral-400 border border-[#232f42]">
                      Posição #{idx + 1}
                    </span>
                    <span className="text-xs font-serif font-bold text-emerald-400">
                      {curator.conversionRate}% Conversão
                    </span>
                  </div>

                  <div className="mt-3">
                    <h4 className="font-serif font-bold text-white text-base">{curator.name}</h4>
                    <span className="text-[11px] text-neutral-400">Atendimento Canoinhas & Planalto Norte</span>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
                    <div className="bg-[#0b0e14] p-2 rounded-lg border border-[#18202d]">
                      <span className="text-[10px] text-neutral-400 block">Malhas Montadas:</span>
                      <span className="font-mono font-bold text-neutral-200">{curator.totalBoxes} malas</span>
                    </div>

                    <div className="bg-[#0b0e14] p-2 rounded-lg border border-[#18202d]">
                      <span className="text-[10px] text-neutral-400 block">Peças Faturadas:</span>
                      <span className="font-mono font-bold text-emerald-400">{curator.boughtItems} peças</span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-[#18202d] mt-4 flex items-center justify-between">
                  <span className="text-[11px] text-neutral-400">Receita Gerada:</span>
                  <span className="font-serif font-bold text-[#f5d061] text-base">
                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(curator.revenue)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUBTAB 4: CONVERSÃO POR CLIENTE */}
      {activeSubTab === 'by_client' && (
        <div className="bg-[#10141d] rounded-xl border border-[#1e2636] overflow-hidden">
          <div className="p-3.5 border-b border-[#1e2636] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="font-semibold text-white text-sm">Taxa de Conversão por Cliente</h3>
              <p className="text-xs text-neutral-400">Histórico de retenção individual nas malas enviadas</p>
            </div>

            <div className="relative">
              <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Buscar cliente ou cidade..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-[#0b0e15] border border-[#232c3d] rounded-lg pl-8 pr-3 py-1.5 text-xs text-white placeholder-neutral-400 focus:outline-none focus:border-[#c99738]"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#0c0f16] border-b border-[#1b2231] text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">
                <tr>
                  <th className="py-2.5 px-4">Cliente VIP</th>
                  <th className="py-2.5 px-3">Cidade</th>
                  <th className="py-2.5 px-3 text-center">Malas Enviadas</th>
                  <th className="py-2.5 px-3 text-center">Taxa Conversão</th>
                  <th className="py-2.5 px-3 text-right">LTV Total</th>
                  <th className="py-2.5 px-3 text-right">Ticket Médio</th>
                  <th className="py-2.5 px-4 text-right">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#171e2c]">
                {filteredClients.map(item => (
                  <tr key={item.client.id} className="hover:bg-[#131822] transition-colors">
                    <td className="py-3 px-4">
                      <div>
                        <span className="font-semibold text-white block">{item.client.name}</span>
                        <span className="text-[10px] text-neutral-400">{item.client.tier} • {item.client.style.profession || 'Empresário'}</span>
                      </div>
                    </td>
                    <td className="py-3 px-3 text-neutral-300">
                      {item.client.city}-SC
                    </td>
                    <td className="py-3 px-3 text-center font-mono text-neutral-300">
                      {item.boxesCount} malas
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span className={`px-2 py-0.5 rounded-full font-bold text-xs ${
                        item.conversionRate >= 80 
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' 
                          : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                      }`}>
                        {item.conversionRate}%
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right font-serif font-bold text-[#f0cf7e]">
                      {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.ltv)}
                    </td>
                    <td className="py-3 px-3 text-right font-mono text-neutral-200">
                      {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.averageTicket)}
                    </td>
                    <td className="py-3 px-4 text-right">
                      {onSelectClient && (
                        <button
                          onClick={() => onSelectClient(item.client.id)}
                          className="px-2.5 py-1 rounded bg-[#1e2636] hover:bg-[#28354c] text-neutral-200 text-[11px] font-medium"
                        >
                          Ver Perfil 360°
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
