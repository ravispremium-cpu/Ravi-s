import React, { useState } from 'react';
import { AnalyticsSummary, CondicionalBox, Client, Product } from '../../types/crm';
import { 
  TrendingUp, 
  BarChart3, 
  ShoppingBag, 
  Clock, 
  AlertCircle, 
  Award, 
  PieChart, 
  DollarSign,
  Package,
  Layers,
  ArrowUpRight,
  ArrowDownRight,
  Users,
  Target,
  Sparkles,
  Calendar,
  Download,
  CheckCircle2,
  Phone,
  Instagram,
  MapPin,
  Scissors,
  Check,
  Zap,
  HelpCircle
} from 'lucide-react';

interface AnalyticsDashboardProps {
  analytics: AnalyticsSummary;
  condicionais: CondicionalBox[];
  clients?: Client[];
  products?: Product[];
}

export const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({
  analytics,
  condicionais,
  clients = [],
  products = []
}) => {
  const [selectedPeriod, setSelectedPeriod] = useState<'7D' | '30D' | 'TRIMESTRE' | 'ANO'>('30D');
  const [reportGenerated, setReportGenerated] = useState(false);

  // Period multiplier to make metrics reactive to period toggle
  const periodMultiplier = selectedPeriod === '7D' ? 0.25 : selectedPeriod === '30D' ? 1.0 : selectedPeriod === 'TRIMESTRE' ? 2.8 : 11.4;

  const totalRevenue = Math.round((analytics.monthlyRevenue.condicional + analytics.monthlyRevenue.store + analytics.monthlyRevenue.ecommerce) * periodMultiplier);
  const condicionalRevenue = Math.round(analytics.monthlyRevenue.condicional * periodMultiplier);
  const storeRevenue = Math.round(analytics.monthlyRevenue.store * periodMultiplier);
  const ecommerceRevenue = Math.round(analytics.monthlyRevenue.ecommerce * periodMultiplier);
  const condicionalPercentage = Math.round((condicionalRevenue / totalRevenue) * 100);

  // Top Selected vs Top Purchased Matrix
  const piecesPerformanceMatrix = [
    {
      title: 'Camisa Linho Puro Riviera Areia',
      category: 'Camisas',
      sku: 'RAV-LNH-01',
      selectedCount: 28,
      purchasedCount: 24,
      conversionRate: 85.7,
      price: 589,
      revenueGenerated: 14136,
      status: 'Ícone de Curadoria • Alta Margem'
    },
    {
      title: 'Calça Chino Smart Stretch Fendi',
      category: 'Calças',
      sku: 'RAV-CAL-04',
      selectedCount: 34,
      purchasedCount: 30,
      conversionRate: 88.2,
      price: 490,
      revenueGenerated: 14700,
      status: 'Bestseller Absoluto • Baixa Devolução'
    },
    {
      title: 'Blazer Desestruturado Alfaiataria',
      category: 'Blazers',
      sku: 'RAV-BLZ-02',
      selectedCount: 19,
      purchasedCount: 15,
      conversionRate: 78.9,
      price: 1290,
      revenueGenerated: 19350,
      status: 'Maior Ticket Médio • Alavanca LTV'
    },
    {
      title: 'Tricô Canelado Merino Nero',
      category: 'Tricô',
      sku: 'RAV-TRC-03',
      selectedCount: 22,
      purchasedCount: 17,
      conversionRate: 77.3,
      price: 680,
      revenueGenerated: 11560,
      status: 'Alta Retenção no Frio de Canoinhas'
    },
    {
      title: 'Polo Tricot Gola Camiseiro Nero',
      category: 'Polos & Malharia',
      sku: 'RAV-POL-07',
      selectedCount: 26,
      purchasedCount: 17,
      conversionRate: 65.4,
      price: 399,
      revenueGenerated: 6783,
      status: 'Ajuste Fino na Grade P/M Recomendado'
    },
    {
      title: 'Loafer Gravata Pelica Mocca',
      category: 'Calçados',
      sku: 'RAV-LOA-05',
      selectedCount: 14,
      purchasedCount: 10,
      conversionRate: 71.4,
      price: 890,
      revenueGenerated: 8900,
      status: 'Excelente para Cross-selling de Mala'
    }
  ];

  // Client Style & Demographics Breakdown
  const sizesDistribution = [
    { label: 'Tamanho M', percentage: 46, count: 184, isLead: true },
    { label: 'Tamanho P', percentage: 24, count: 96 },
    { label: 'Tamanho G', percentage: 20, count: 80 },
    { label: 'Tamanho GG / Extra', percentage: 10, count: 40 }
  ];

  const fitPreferences = [
    { label: 'Slim Fit', percentage: 54, count: 216, color: 'bg-[#c99738]' },
    { label: 'Regular Fit / Clássico', percentage: 28, count: 112, color: 'bg-blue-500' },
    { label: 'Longline', percentage: 12, count: 48, color: 'bg-purple-500' },
    { label: 'Alfaiataria Moderna / Oversized', percentage: 6, count: 24, color: 'bg-emerald-500' }
  ];

  const regionDistribution = [
    { city: 'Canoinhas (Centro, Marcílio Dias, Industrial)', percentage: 64, count: 256 },
    { city: 'Três Barras (Jardim América, Rigesa)', percentage: 18, count: 72 },
    { city: 'Mafra & Rio Negro', percentage: 10, count: 40 },
    { city: 'Porto União & União da Vitória', percentage: 8, count: 32 }
  ];

  const handleExportReport = () => {
    setReportGenerated(true);
    setTimeout(() => setReportGenerated(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Period Selector */}
      <div className="bg-[#10141d] border border-[#222a3b] rounded-2xl p-4 sm:p-5 flex flex-wrap items-center justify-between gap-4 shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-[#c99738]" />
              <span>Painel de Inteligência & Analytics da Ravi's Premium</span>
            </h2>
            <span className="text-[10px] bg-amber-500/10 text-[#c99738] font-bold px-2 py-0.5 rounded-full border border-amber-500/30">
              Gestor Executivo
            </span>
          </div>
          <p className="text-xs text-neutral-400 mt-0.5">
            Métricas verticais de moda masculina, ciclo de condicional, SLA de atendimento, LTV e CAC
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Period Filter Buttons */}
          <div className="bg-[#141924] p-1 rounded-xl border border-[#232b3d] flex items-center text-xs">
            <button
              onClick={() => setSelectedPeriod('7D')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                selectedPeriod === '7D' ? 'bg-[#c99738] text-black font-bold shadow-sm' : 'text-neutral-400 hover:text-white'
              }`}
            >
              7 Dias
            </button>
            <button
              onClick={() => setSelectedPeriod('30D')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                selectedPeriod === '30D' ? 'bg-[#c99738] text-black font-bold shadow-sm' : 'text-neutral-400 hover:text-white'
              }`}
            >
              Mês Atual
            </button>
            <button
              onClick={() => setSelectedPeriod('TRIMESTRE')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                selectedPeriod === 'TRIMESTRE' ? 'bg-[#c99738] text-black font-bold shadow-sm' : 'text-neutral-400 hover:text-white'
              }`}
            >
              Trimestre
            </button>
            <button
              onClick={() => setSelectedPeriod('ANO')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                selectedPeriod === 'ANO' ? 'bg-[#c99738] text-black font-bold shadow-sm' : 'text-neutral-400 hover:text-white'
              }`}
            >
              Ano 2026
            </button>
          </div>

          <button
            onClick={handleExportReport}
            className="px-3.5 py-2 rounded-xl bg-[#141924] hover:bg-[#1e2535] border border-[#242d3e] text-xs font-semibold text-neutral-200 hover:text-white flex items-center gap-1.5 transition-colors"
          >
            {reportGenerated ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Relatório Exportado</span>
              </>
            ) : (
              <>
                <Download className="w-3.5 h-3.5 text-[#c99738]" />
                <span>Exportar Relatório</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Top 4 Primary Executive KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Faturamento Total */}
        <div className="bg-[#10141d] p-4.5 rounded-2xl border border-[#20293a] space-y-2 shadow-md relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-neutral-400 text-xs font-medium">Faturamento Total do Período</span>
            <div className="w-8 h-8 rounded-lg bg-amber-950/60 border border-amber-600/40 flex items-center justify-center text-[#f5d061]">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-serif text-2xl font-bold text-white">
              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(totalRevenue)}
            </span>
            <span className="text-[11px] text-emerald-400 font-semibold flex items-center">
              <ArrowUpRight className="w-3 h-3" /> +24.8%
            </span>
          </div>
          <p className="text-[11px] text-neutral-400">
            {condicionalPercentage}% oriundo do serviço de Mala Condicional VIP.
          </p>
        </div>

        {/* KPI 2: Conversão de Condicional */}
        <div className="bg-[#10141d] p-4.5 rounded-2xl border border-[#20293a] space-y-2 shadow-md relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-neutral-400 text-xs font-medium">Taxa de Conversão Condicional</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-950/60 border border-emerald-700/40 flex items-center justify-center text-emerald-400">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-mono text-2xl font-bold text-emerald-400">{analytics.condicionalConversionRate}%</span>
            <span className="text-[11px] text-emerald-500 font-semibold flex items-center">
              <ArrowUpRight className="w-3 h-3" /> +8.4% vs meta
            </span>
          </div>
          <p className="text-[11px] text-neutral-400">
            A cada 10 peças enviadas em mala, ~7.3 são faturadas pelo cliente.
          </p>
        </div>

        {/* KPI 3: Ticket Médio Comparativo */}
        <div className="bg-[#10141d] p-4.5 rounded-2xl border border-[#20293a] space-y-2 shadow-md relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-neutral-400 text-xs font-medium">Ticket Médio Condicional</span>
            <div className="w-8 h-8 rounded-lg bg-blue-950/60 border border-blue-700/40 flex items-center justify-center text-blue-300">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-serif text-2xl font-bold text-blue-300">R$ 2.150</span>
            <span className="text-[11px] text-blue-400 font-semibold">
              2.7x vs Balcão
            </span>
          </div>
          <p className="text-[11px] text-neutral-400">
            Loja física: R$ 780 • Prova no espelho de casa estimula combos completos.
          </p>
        </div>

        {/* KPI 4: Mercadoria Ativa em Trânsito */}
        <div className="bg-[#10141d] p-4.5 rounded-2xl border border-[#20293a] space-y-2 shadow-md relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-neutral-400 text-xs font-medium">Mercadoria em Teste Ativo</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-950/60 border border-indigo-700/40 flex items-center justify-center text-indigo-300">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-serif text-2xl font-bold text-[#f5d061]">
              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(analytics.totalInTransitValue)}
            </span>
            <span className="text-[11px] text-neutral-400">
              {analytics.activeCondicionaisCount} malas ativas
            </span>
          </div>
          <p className="text-[11px] text-neutral-400">
            Giro de estoque acelerado com devolução programada em 7 dias.
          </p>
        </div>
      </div>

      {/* Row 2: Canais de Faturamento & LTV / CAC */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Faturamento por Canal */}
        <div className="bg-[#10141d] rounded-2xl border border-[#20293a] p-5 space-y-4 shadow-md">
          <div className="flex items-center justify-between border-b border-[#1c2433] pb-3">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-[#c99738]" />
              <h3 className="font-semibold text-xs text-white uppercase tracking-wider">
                Faturamento por Canal ({selectedPeriod})
              </h3>
            </div>
            <span className="text-xs text-neutral-400 font-medium">
              Total: {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(totalRevenue)}
            </span>
          </div>

          <div className="space-y-3.5 text-xs">
            {/* Condicional */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-medium text-white flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#c99738]" />
                  <span>Mala Condicional VIP em Domicílio</span>
                </span>
                <span className="font-mono text-neutral-200">
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(condicionalRevenue)} ({condicionalPercentage}%)
                </span>
              </div>
              <div className="w-full h-2.5 rounded-full bg-[#1b2230] overflow-hidden">
                <div className="h-full bg-gradient-to-r from-[#c99738] to-[#f5d061] rounded-full" style={{ width: `${condicionalPercentage}%` }} />
              </div>
            </div>

            {/* Loja Física */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-medium text-white flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                  <span>Loja Física Centro Canoinhas (PDV)</span>
                </span>
                <span className="font-mono text-neutral-200">
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(storeRevenue)} (32%)
                </span>
              </div>
              <div className="w-full h-2.5 rounded-full bg-[#1b2230] overflow-hidden">
                <div className="h-full bg-blue-500 rounded-full" style={{ width: `32%` }} />
              </div>
            </div>

            {/* E-commerce & WhatsApp */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-medium text-white flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
                  <span>E-commerce & WhatsApp Direto (Link Pagamento)</span>
                </span>
                <span className="font-mono text-neutral-200">
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(ecommerceRevenue)} (15%)
                </span>
              </div>
              <div className="w-full h-2.5 rounded-full bg-[#1b2230] overflow-hidden">
                <div className="h-full bg-indigo-500 rounded-full" style={{ width: `15%` }} />
              </div>
            </div>
          </div>

          <div className="p-3 bg-[#0c0e12] rounded-xl border border-[#1b2230] text-[11px] text-neutral-400">
            💡 <strong>Insight Estratégico:</strong> O modelo de condicional responde por <strong>53% a 68% do lucro líquido</strong> devido à ausência de custos de devolução de frete interestadual e alta taxa de retenção das peças pelo cliente em Canoinhas.
          </div>
        </div>

        {/* LTV & CAC (Lifetime Value & Custo de Aquisição) */}
        <div className="bg-[#10141d] rounded-2xl border border-[#20293a] p-5 space-y-4 shadow-md">
          <div className="flex items-center justify-between border-b border-[#1c2433] pb-3">
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-emerald-400" />
              <h3 className="font-semibold text-xs text-white uppercase tracking-wider">
                Unit Economics: LTV vs CAC
              </h3>
            </div>
            <span className="text-[11px] bg-emerald-950 text-emerald-400 font-bold px-2 py-0.5 rounded border border-emerald-800/40">
              LTV/CAC: 120.8x
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="bg-[#141924] p-3 rounded-xl border border-[#20293a] space-y-1">
              <span className="text-[11px] text-neutral-400">LTV Médio por Cliente</span>
              <span className="text-xl font-bold font-serif text-white block">R$ 8.940</span>
              <p className="text-[10px] text-neutral-400">
                VIP Platinum: R$ 18.400 • VIP Ouro: R$ 9.200 • Recorrente: R$ 4.600
              </p>
            </div>

            <div className="bg-[#141924] p-3 rounded-xl border border-[#20293a] space-y-1">
              <span className="text-[11px] text-neutral-400">CAC Médio Ponderado</span>
              <span className="text-xl font-bold font-serif text-emerald-400 block">R$ 74,00</span>
              <p className="text-[10px] text-neutral-400">
                Indicação Canoinhas: R$ 22,00 • Tráfego Pago Meta: R$ 138,00
              </p>
            </div>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-neutral-300">Tempo de Payback do CAC</span>
              <span className="font-bold text-emerald-400">18 Dias (1ª Mala Condicional)</span>
            </div>
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-neutral-300">Taxa de Recompra em 90 dias</span>
              <span className="font-bold text-[#c99738]">76.4% dos clientes ativos</span>
            </div>
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-neutral-300">Frequência Anual de Malas</span>
              <span className="font-bold text-white">4.8 malas / ano por cliente VIP</span>
            </div>
          </div>

          <p className="text-[11px] text-neutral-400 italic pt-1 border-t border-[#1c2433]">
            A retenção gerada pela curadoria personalizada torna o CAC insignificante perante o valor do cliente ao longo do ano.
          </p>
        </div>
      </div>

      {/* Row 3: Top Peças Selecionadas vs Top Peças Compradas (Matriz de Inteligência) */}
      <div className="bg-[#10141d] rounded-2xl border border-[#20293a] p-5 space-y-4 shadow-md">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#1c2433] pb-3">
          <div className="flex items-center gap-2">
            <Package className="w-4 h-4 text-[#c99738]" />
            <div>
              <h3 className="font-semibold text-xs text-white uppercase tracking-wider">
                Matriz Comparativa: Peças Selecionadas vs Compradas
              </h3>
              <p className="text-[11px] text-neutral-400">
                Identificação de produtos com alto magnetismo de escolha e real fechamento na mala
              </p>
            </div>
          </div>
          <span className="text-[11px] text-neutral-400">
            Ordenado por Faturamento Gerado em Mala
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#1f2637] text-neutral-400 text-[11px]">
                <th className="pb-2.5 font-medium">Peça de Edição Limitada</th>
                <th className="pb-2.5 font-medium">Categoria / SKU</th>
                <th className="pb-2.5 font-medium text-center">Enviadas em Mala</th>
                <th className="pb-2.5 font-medium text-center">Compradas</th>
                <th className="pb-2.5 font-medium text-center">Taxa de Conversão</th>
                <th className="pb-2.5 font-medium text-right">Receita Gerada</th>
                <th className="pb-2.5 font-medium text-right">Diagnóstico de Curadoria</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#171d2b]">
              {piecesPerformanceMatrix.map((piece, idx) => (
                <tr key={idx} className="hover:bg-[#141924]/60 transition-colors">
                  <td className="py-3 font-semibold text-white">
                    {piece.title}
                  </td>
                  <td className="py-3 text-neutral-400 font-mono text-[11px]">
                    {piece.category} • {piece.sku}
                  </td>
                  <td className="py-3 text-center text-neutral-300 font-medium">
                    {piece.selectedCount} malas
                  </td>
                  <td className="py-3 text-center text-white font-bold">
                    {piece.purchasedCount} peças
                  </td>
                  <td className="py-3 text-center">
                    <span className={`inline-block px-2 py-0.5 rounded text-[11px] font-bold ${
                      piece.conversionRate >= 80 
                        ? 'bg-emerald-950 text-emerald-400 border border-emerald-800/40' 
                        : piece.conversionRate >= 70
                        ? 'bg-amber-950 text-amber-300 border border-amber-800/40'
                        : 'bg-blue-950 text-blue-300 border border-blue-800/40'
                    }`}>
                      {piece.conversionRate}%
                    </span>
                  </td>
                  <td className="py-3 text-right font-mono font-bold text-[#f5d061]">
                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(piece.revenueGenerated)}
                  </td>
                  <td className="py-3 text-right text-[11px] text-neutral-400">
                    <span className="text-neutral-300 font-medium">{piece.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Row 4: Performance dos Curadores & SLA de Atendimento */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Curators Ranking */}
        <div className="bg-[#10141d] rounded-2xl border border-[#20293a] p-5 space-y-3 shadow-md">
          <div className="flex items-center justify-between border-b border-[#1c2433] pb-3">
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-[#c99738]" />
              <h3 className="font-semibold text-xs text-white uppercase tracking-wider">
                Performance Individual dos Curadores
              </h3>
            </div>
            <span className="text-[11px] text-neutral-400">Comissões & Conversão</span>
          </div>

          <div className="space-y-2.5">
            {analytics.curatorPerformance.map((curator, idx) => (
              <div key={idx} className="p-3 rounded-xl bg-[#0b0e14] border border-[#1b2332] flex items-center justify-between text-xs">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-[#1c2433] text-[#c99738] font-bold text-[11px] flex items-center justify-center">
                      {idx + 1}
                    </span>
                    <span className="font-semibold text-white">{curator.name}</span>
                  </div>
                  <div className="text-[11px] text-neutral-400 mt-0.5 ml-7">
                    {curator.boxesSent} malas montadas • <strong className="text-emerald-400">{curator.conversionRate}% conversão</strong>
                  </div>
                </div>

                <div className="text-right">
                  <span className="font-mono font-bold text-[#f5d061] block">
                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(curator.revenue)}
                  </span>
                  <span className="text-[10px] text-neutral-400">
                    Comissão est.: R$ {Math.round(curator.revenue * 0.06).toLocaleString('pt-BR')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SLA & Tempo de Resposta no Atendimento */}
        <div className="bg-[#10141d] rounded-2xl border border-[#20293a] p-5 space-y-4 shadow-md">
          <div className="flex items-center justify-between border-b border-[#1c2433] pb-3">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#c99738]" />
              <h3 className="font-semibold text-xs text-white uppercase tracking-wider">
                SLA & Tempo de Resposta no Atendimento
              </h3>
            </div>
            <span className="text-[10px] bg-emerald-950 text-emerald-400 px-2 py-0.5 rounded border border-emerald-800/40 font-bold">
              96.4% no Prazo
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="bg-[#141924] p-3 rounded-xl border border-[#20293a] space-y-1">
              <div className="flex items-center gap-1.5 text-emerald-400">
                <Phone className="w-3.5 h-3.5" />
                <span className="text-[11px] font-semibold text-white">WhatsApp Business</span>
              </div>
              <span className="text-xl font-bold font-mono text-emerald-400 block mt-1">3m 45s</span>
              <p className="text-[10px] text-neutral-400">Tempo médio de primeira resposta</p>
            </div>

            <div className="bg-[#141924] p-3 rounded-xl border border-[#20293a] space-y-1">
              <div className="flex items-center gap-1.5 text-pink-400">
                <Instagram className="w-3.5 h-3.5" />
                <span className="text-[11px] font-semibold text-white">Instagram Direct</span>
              </div>
              <span className="text-xl font-bold font-mono text-pink-400 block mt-1">12m 30s</span>
              <p className="text-[10px] text-neutral-400">Tempo médio de primeira resposta</p>
            </div>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-neutral-300">Respostas dentro da meta (&lt; 15 min):</span>
              <strong className="text-emerald-400">96.4% das conversas</strong>
            </div>
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-neutral-300">Horários de Maior Fluxo em Canoinhas:</span>
              <strong className="text-white">11:30 às 13:30 e 18:00 às 19:30</strong>
            </div>
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-neutral-300">Satisfação do Cliente (CSAT Curadoria):</span>
              <strong className="text-[#c99738]">4.9 / 5.0 (98% aprovação)</strong>
            </div>
          </div>

          <p className="text-[11px] text-neutral-400 italic pt-1 border-t border-[#1c2433]">
            O uso de respostas rápidas (`/tamanho` e `/condicional`) reduziu o tempo de onboarding em 65%.
          </p>
        </div>
      </div>

      {/* Row 5: Perfil Demográfico & de Estilo dos Clientes */}
      <div className="bg-[#10141d] rounded-2xl border border-[#20293a] p-5 space-y-5 shadow-md">
        <div className="flex items-center justify-between border-b border-[#1c2433] pb-3">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-[#c99738]" />
            <div>
              <h3 className="font-semibold text-xs text-white uppercase tracking-wider">
                Perfil Demográfico, Tamanhos & Estilo da Base de Clientes
              </h3>
              <p className="text-[11px] text-neutral-400">
                Inteligência de compras para assertividade no lote e pré-compra de tecidos
              </p>
            </div>
          </div>
          <span className="text-xs text-neutral-400">Base Ativa: 400 clientes monitorados</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Distribuição de Tamanhos */}
          <div className="bg-[#141924] p-4 rounded-xl border border-[#20293a] space-y-3 text-xs">
            <span className="font-semibold text-white uppercase tracking-wider text-[11px] block">
              Grade de Tamanhos Mais Demandada
            </span>
            <div className="space-y-2">
              {sizesDistribution.map((item, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-neutral-300">{item.label}</span>
                    <span className="font-mono text-neutral-400">{item.percentage}% ({item.count} clientes)</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-[#1b2230] overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${item.isLead ? 'bg-[#c99738]' : 'bg-neutral-500'}`} 
                      style={{ width: `${item.percentage}%` }} 
                    />
                  </div>
                </div>
              ))}
            </div>
            <p className="text-[10px] text-neutral-500 pt-1">
              *Tamanho M concentra quase metade da base. Priorizar 2x estoque neste tamanho no photoshoot.
            </p>
          </div>

          {/* Caimento Preferido */}
          <div className="bg-[#141924] p-4 rounded-xl border border-[#20293a] space-y-3 text-xs">
            <span className="font-semibold text-white uppercase tracking-wider text-[11px] block">
              Preferência de Caimento (Modelagem)
            </span>
            <div className="space-y-2">
              {fitPreferences.map((item, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-neutral-300">{item.label}</span>
                    <span className="font-mono text-neutral-400">{item.percentage}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-[#1b2230] overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${item.color}`} 
                      style={{ width: `${item.percentage}%` }} 
                    />
                  </div>
                </div>
              ))}
            </div>
            <p className="text-[10px] text-neutral-500 pt-1">
              *Slim Fit predomina entre médicos, empresários do agronegócio e advogados de Canoinhas.
            </p>
          </div>

          {/* Região e Cidades */}
          <div className="bg-[#141924] p-4 rounded-xl border border-[#20293a] space-y-3 text-xs">
            <span className="font-semibold text-white uppercase tracking-wider text-[11px] block flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-[#c99738]" />
              <span>Distribuição Geográfica (Planalto Norte)</span>
            </span>
            <div className="space-y-2">
              {regionDistribution.map((item, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-neutral-300 truncate max-w-[200px]">{item.city}</span>
                    <span className="font-mono text-neutral-400">{item.percentage}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-[#1b2230] overflow-hidden">
                    <div 
                      className="h-full rounded-full bg-emerald-500" 
                      style={{ width: `${item.percentage}%` }} 
                    />
                  </div>
                </div>
              ))}
            </div>
            <p className="text-[10px] text-neutral-500 pt-1">
              *Entregas em Três Barras e Mafra possuem motorista dedicado 2x por semana.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
