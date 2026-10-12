import React, { useState } from 'react';
import { Order, OrderStatus, OrderChannel, Client, Product } from '../../types/crm';
import { NewOrderPDVModal } from './NewOrderPDVModal';
import { NewOnlineOrderModal } from './NewOnlineOrderModal';
import { 
  Store, 
  Globe, 
  Search, 
  Plus, 
  Filter, 
  TrendingUp, 
  Award, 
  CheckCircle2, 
  Clock, 
  Truck, 
  Copy, 
  Check, 
  MessageCircle, 
  CreditCard, 
  DollarSign, 
  Calendar, 
  BarChart3, 
  Layers, 
  Users, 
  ShoppingBag,
  ExternalLink,
  Percent
} from 'lucide-react';

interface OrdersViewProps {
  orders: Order[];
  clients: Client[];
  products: Product[];
  onCreateOrder: (order: Order) => void;
  onUpdateOrderStatus: (orderId: string, newStatus: OrderStatus) => void;
}

export const OrdersView: React.FC<OrdersViewProps> = ({
  orders,
  clients,
  products,
  onCreateOrder,
  onUpdateOrderStatus
}) => {
  const [activeTab, setActiveTab] = useState<'orders' | 'rep_period' | 'rep_attendant' | 'rep_product'>('orders');
  const [searchTerm, setSearchTerm] = useState('');
  const [channelFilter, setChannelFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  // Modals
  const [isPDVModalOpen, setIsPDVModalOpen] = useState(false);
  const [isOnlineModalOpen, setIsOnlineModalOpen] = useState(false);
  const [copiedOrderId, setCopiedOrderId] = useState<string | null>(null);

  // Filter orders
  const filteredOrders = orders.filter(o => {
    const matchesSearch = 
      o.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.curatorName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesChannel = channelFilter === 'ALL' || o.channel === channelFilter;
    const matchesStatus = statusFilter === 'ALL' || o.orderStatus === statusFilter;

    return matchesSearch && matchesChannel && matchesStatus;
  });

  // Calculate global sales metrics
  const totalGrossRevenue = orders.filter(o => o.paymentStatus === 'PAGO').reduce((acc, o) => acc + o.totalValue, 0);
  const totalProfit = orders.filter(o => o.paymentStatus === 'PAGO').reduce((acc, o) => acc + o.grossProfit, 0);
  const totalCommissionPaid = orders.filter(o => o.paymentStatus === 'PAGO').reduce((acc, o) => acc + o.commissionValue, 0);
  const pdvRevenue = orders.filter(o => o.paymentStatus === 'PAGO' && o.channel === 'PDV_CANOINHAS').reduce((acc, o) => acc + o.totalValue, 0);
  const onlineRevenue = orders.filter(o => o.paymentStatus === 'PAGO' && o.channel === 'ONLINE').reduce((acc, o) => acc + o.totalValue, 0);

  // Attendant performance calculation
  const attendants = ['Mateus (Consultor Sênior)', 'Juliana (Consultora VIP)', 'Ravi (Curador-Chefe)'];
  const attendantStats = attendants.map(name => {
    const attOrders = orders.filter(o => o.curatorName.includes(name.split(' ')[0]));
    const paidOrders = attOrders.filter(o => o.paymentStatus === 'PAGO');
    const revenue = paidOrders.reduce((acc, o) => acc + o.totalValue, 0);
    const commissions = paidOrders.reduce((acc, o) => acc + o.commissionValue, 0);

    return {
      name,
      totalOrders: attOrders.length,
      paidOrders: paidOrders.length,
      revenue,
      commissions,
      averageTicket: paidOrders.length > 0 ? Math.round(revenue / paidOrders.length) : 0
    };
  }).sort((a, b) => b.revenue - a.revenue);

  // Product sales ranking
  const productSalesMap: Record<string, { title: string; category: string; unitsSold: number; totalRevenue: number; grossProfit: number; currentStock: number }> = {};
  orders.forEach(o => {
    if (o.paymentStatus === 'PAGO') {
      o.items.forEach(item => {
        if (!productSalesMap[item.productId]) {
          const originalProd = products.find(p => p.id === item.productId);
          const currentAvail = originalProd ? Object.values(originalProd.stockBySize).reduce((acc, s) => acc + s.available, 0) : 0;
          productSalesMap[item.productId] = {
            title: item.title,
            category: item.category,
            unitsSold: 0,
            totalRevenue: 0,
            grossProfit: 0,
            currentStock: currentAvail
          };
        }
        productSalesMap[item.productId].unitsSold += item.quantity;
        productSalesMap[item.productId].totalRevenue += item.subtotal;
        productSalesMap[item.productId].grossProfit += (item.unitPrice - item.costPrice) * item.quantity;
      });
    }
  });

  const productSalesRanking = Object.values(productSalesMap).sort((a, b) => b.totalRevenue - a.totalRevenue);

  const handleCopyLink = (order: Order) => {
    if (order.whatsappPaymentLink) {
      navigator.clipboard?.writeText(order.whatsappPaymentLink);
      setCopiedOrderId(order.id);
      setTimeout(() => setCopiedOrderId(null), 2000);
    }
  };

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'PENDENTE':
        return { label: 'Pendente', bg: 'bg-amber-500/10 border-amber-500/40 text-amber-300' };
      case 'PAGO':
        return { label: 'Pago', bg: 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300' };
      case 'ENVIADO':
        return { label: 'Enviado / Rota', bg: 'bg-blue-500/10 border-blue-500/40 text-blue-300' };
      case 'ENTREGUE':
        return { label: 'Entregue / Concluído', bg: 'bg-neutral-800 border-neutral-700 text-neutral-300' };
    }
  };

  return (
    <div className="space-y-4">
      {/* Top Header & Subtabs */}
      <div className="bg-[#11141c] p-4 rounded-xl border border-[#1e2533] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-[#c99738]" />
            <h2 className="text-base font-semibold text-white">Gestão de Pedidos & PDV Canoinhas</h2>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#c99738]/20 text-[#c99738] border border-[#c99738]/30">
              Online & Físico
            </span>
          </div>
          <p className="text-xs text-neutral-400 mt-0.5">
            Canal Online (Mercado Pago / Stripe WhatsApp) e PDV Físico na loja de Canoinhas com comissões de atendentes
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsOnlineModalOpen(true)}
            className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-[#182333] hover:bg-[#202e42] border border-[#2b3a50] text-blue-300 text-xs font-semibold transition-all shadow-sm"
          >
            <Globe className="w-4 h-4 text-blue-400" />
            <span>+ Link Online (WhatsApp)</span>
          </button>

          <button
            onClick={() => setIsPDVModalOpen(true)}
            className="flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-semibold transition-all shadow-md shadow-emerald-950/40"
          >
            <Store className="w-4 h-4" />
            <span>+ Novo Pedido PDV (Loja)</span>
          </button>
        </div>
      </div>

      {/* Subtabs Switcher */}
      <div className="flex flex-wrap items-center gap-1.5 bg-[#0a0d14] p-1 rounded-lg border border-[#1d2433]">
        <button
          onClick={() => setActiveTab('orders')}
          className={`px-3 py-1.5 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-all ${
            activeTab === 'orders' 
              ? 'bg-[#c99738] text-black shadow-md' 
              : 'text-neutral-400 hover:text-white'
          }`}
        >
          <ShoppingBag className="w-3.5 h-3.5" />
          <span>Todos os Pedidos ({orders.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('rep_period')}
          className={`px-3 py-1.5 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-all ${
            activeTab === 'rep_period' 
              ? 'bg-[#c99738] text-black shadow-md' 
              : 'text-neutral-400 hover:text-white'
          }`}
        >
          <Calendar className="w-3.5 h-3.5" />
          <span>Relatório por Período</span>
        </button>

        <button
          onClick={() => setActiveTab('rep_attendant')}
          className={`px-3 py-1.5 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-all ${
            activeTab === 'rep_attendant' 
              ? 'bg-[#c99738] text-black shadow-md' 
              : 'text-neutral-400 hover:text-white'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>Relatório por Atendente & Comissões</span>
        </button>

        <button
          onClick={() => setActiveTab('rep_product')}
          className={`px-3 py-1.5 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-all ${
            activeTab === 'rep_product' 
              ? 'bg-[#c99738] text-black shadow-md' 
              : 'text-neutral-400 hover:text-white'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Relatório por Peça / SKU</span>
        </button>
      </div>

      {/* Quick Financial KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-[#10141d] p-3.5 rounded-xl border border-[#1e2636] flex items-center justify-between">
          <div>
            <span className="text-[11px] text-neutral-400 block font-medium">Faturamento Líquido Vendas</span>
            <span className="font-serif text-2xl font-bold text-[#f5d061]">
              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalGrossRevenue)}
            </span>
            <span className="text-[10px] text-neutral-400 block mt-0.5">Pedidos Pagos / Concluídos</span>
          </div>
          <div className="w-10 h-10 rounded-lg bg-[#c99738]/10 border border-[#c99738]/30 flex items-center justify-center text-[#c99738]">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-[#10141d] p-3.5 rounded-xl border border-[#1e2636] flex items-center justify-between">
          <div>
            <span className="text-[11px] text-neutral-400 block font-medium">PDV Físico Canoinhas</span>
            <span className="font-serif text-2xl font-bold text-emerald-400">
              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(pdvRevenue)}
            </span>
            <span className="text-[10px] text-neutral-400 block mt-0.5">Loja física no Centro</span>
          </div>
          <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Store className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-[#10141d] p-3.5 rounded-xl border border-[#1e2636] flex items-center justify-between">
          <div>
            <span className="text-[11px] text-neutral-400 block font-medium">Canal Online (WhatsApp)</span>
            <span className="font-serif text-2xl font-bold text-blue-400">
              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(onlineRevenue)}
            </span>
            <span className="text-[10px] text-neutral-400 block mt-0.5">Mercado Pago & Stripe</span>
          </div>
          <div className="w-10 h-10 rounded-lg bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
            <Globe className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-[#10141d] p-3.5 rounded-xl border border-[#1e2636] flex items-center justify-between">
          <div>
            <span className="text-[11px] text-neutral-400 block font-medium">Comissões de Atendentes</span>
            <span className="font-serif text-2xl font-bold text-amber-400">
              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalCommissionPaid)}
            </span>
            <span className="text-[10px] text-amber-300 block mt-0.5">Média de 5-6% por venda</span>
          </div>
          <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Award className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* TAB 1: ALL ORDERS LIST */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          {/* Filters Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#11141c] p-3 rounded-xl border border-[#1e2533]">
            <div className="flex items-center gap-2 flex-1">
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Buscar pedido por código, cliente ou atendente..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-[#0d1017] border border-[#232a3a] rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder-neutral-400 focus:outline-none focus:border-[#c99738]"
                />
              </div>

              <select
                value={channelFilter}
                onChange={(e) => setChannelFilter(e.target.value)}
                className="bg-[#0d1017] border border-[#232a3a] rounded-lg px-2.5 py-2 text-xs text-neutral-300 focus:outline-none focus:border-[#c99738]"
              >
                <option value="ALL">Todos os Canais</option>
                <option value="PDV_CANOINHAS">PDV Loja Canoinhas</option>
                <option value="ONLINE">Canal Online WhatsApp</option>
              </select>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-[#0d1017] border border-[#232a3a] rounded-lg px-2.5 py-2 text-xs text-neutral-300 focus:outline-none focus:border-[#c99738]"
              >
                <option value="ALL">Todos os Status</option>
                <option value="PENDENTE">Pendente</option>
                <option value="PAGO">Pago</option>
                <option value="ENVIADO">Enviado</option>
                <option value="ENTREGUE">Entregue</option>
              </select>
            </div>
          </div>

          {/* Orders Table / Cards */}
          <div className="bg-[#10141d] rounded-xl border border-[#1e2636] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#0c0f16] border-b border-[#1b2231] text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">
                  <tr>
                    <th className="py-2.5 px-4">Pedido / Data</th>
                    <th className="py-2.5 px-3">Canal</th>
                    <th className="py-2.5 px-3">Cliente</th>
                    <th className="py-2.5 px-3">Itens</th>
                    <th className="py-2.5 px-3 text-right">Valor Total</th>
                    <th className="py-2.5 px-3">Atendente / Comissão</th>
                    <th className="py-2.5 px-3 text-center">Status</th>
                    <th className="py-2.5 px-4 text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#171e2c]">
                  {filteredOrders.map(order => {
                    const statusBadge = getStatusBadge(order.orderStatus);

                    return (
                      <tr key={order.id} className="hover:bg-[#131822] transition-colors">
                        <td className="py-3 px-4">
                          <span className="font-mono text-[#c99738] font-bold block">{order.code}</span>
                          <span className="text-[10px] text-neutral-400">
                            {new Date(order.createdAt).toLocaleDateString('pt-BR')} às {new Date(order.createdAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </td>

                        <td className="py-3 px-3">
                          {order.channel === 'PDV_CANOINHAS' ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/10 border border-emerald-500/30 text-emerald-300">
                              <Store className="w-3 h-3" /> PDV Loja
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-blue-500/10 border border-blue-500/30 text-blue-300">
                              <Globe className="w-3 h-3" /> Online WhatsApp
                            </span>
                          )}
                        </td>

                        <td className="py-3 px-3">
                          <span className="font-semibold text-white block">{order.clientName}</span>
                          <span className="text-[10px] text-neutral-400">{order.clientCity}-SC • {order.clientPhone}</span>
                        </td>

                        <td className="py-3 px-3">
                          <div className="space-y-0.5">
                            {order.items.map((item, idx) => (
                              <div key={idx} className="text-[11px] text-neutral-300 truncate max-w-xs">
                                • {item.title} ({item.size})
                              </div>
                            ))}
                          </div>
                        </td>

                        <td className="py-3 px-3 text-right">
                          <span className="font-serif font-bold text-[#f0cf7e] text-xs block">
                            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(order.totalValue)}
                          </span>
                          <span className="text-[10px] text-neutral-400">
                            {order.paymentMethod.replace(/_/g, ' ')}
                          </span>
                        </td>

                        <td className="py-3 px-3">
                          <span className="font-medium text-white block">{order.curatorName.split(' ')[0]}</span>
                          <span className="text-[10px] text-amber-400 font-mono">
                            Comissão: {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(order.commissionValue)} ({order.commissionRate * 100}%)
                          </span>
                        </td>

                        <td className="py-3 px-3 text-center">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${statusBadge.bg}`}>
                            {statusBadge.label}
                          </span>
                        </td>

                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {/* Copy payment link if online */}
                            {order.whatsappPaymentLink && (
                              <button
                                onClick={() => handleCopyLink(order)}
                                className="p-1 rounded bg-[#18212e] hover:bg-[#222f42] text-blue-300 border border-[#27354b] text-[10px] flex items-center gap-1"
                                title="Copiar Link de Pagamento"
                              >
                                {copiedOrderId === order.id ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                              </button>
                            )}

                            {/* Advance status toggle */}
                            {order.orderStatus === 'PENDENTE' && (
                              <button
                                onClick={() => onUpdateOrderStatus(order.id, 'PAGO')}
                                className="px-2 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-[10px]"
                              >
                                Confirmar Pagamento
                              </button>
                            )}

                            {order.orderStatus === 'PAGO' && (
                              <button
                                onClick={() => onUpdateOrderStatus(order.id, 'ENVIADO')}
                                className="px-2 py-1 rounded bg-blue-600 hover:bg-blue-500 text-white font-medium text-[10px]"
                              >
                                Despachar Envio
                              </button>
                            )}

                            {order.orderStatus === 'ENVIADO' && (
                              <button
                                onClick={() => onUpdateOrderStatus(order.id, 'ENTREGUE')}
                                className="px-2 py-1 rounded bg-[#1f293b] hover:bg-[#2b3a52] text-neutral-200 font-medium text-[10px]"
                              >
                                Confirmar Entrega
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: RELATÓRIO POR PERÍODO */}
      {activeTab === 'rep_period' && (
        <div className="space-y-4">
          <div className="bg-[#10141d] p-4 rounded-xl border border-[#1e2636]">
            <h3 className="font-serif font-bold text-white text-base">Relatório Consolidado de Vendas por Período</h3>
            <p className="text-xs text-neutral-400 mt-0.5">Visão de receita bruta, deduções de custo de produto e lucro operacional</p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 mt-4">
              <div className="bg-[#0b0e14] p-3.5 rounded-xl border border-[#1a2333]">
                <span className="text-[11px] text-neutral-400 block">Total Vendido no Mês:</span>
                <span className="font-serif text-2xl font-bold text-[#f0cf7e]">
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalGrossRevenue)}
                </span>
                <span className="text-[10px] text-emerald-400 block mt-1">+14.8% vs período anterior</span>
              </div>

              <div className="bg-[#0b0e14] p-3.5 rounded-xl border border-[#1a2333]">
                <span className="text-[11px] text-neutral-400 block">Lucro Bruto Ravi's:</span>
                <span className="font-serif text-2xl font-bold text-emerald-400">
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalProfit)}
                </span>
                <span className="text-[10px] text-neutral-400 block mt-1">Margem consolidada de ~62%</span>
              </div>

              <div className="bg-[#0b0e14] p-3.5 rounded-xl border border-[#1a2333]">
                <span className="text-[11px] text-neutral-400 block">Ticket Médio por Venda:</span>
                <span className="font-serif text-2xl font-bold text-white">
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(
                    orders.filter(o => o.paymentStatus === 'PAGO').length > 0 
                      ? totalGrossRevenue / orders.filter(o => o.paymentStatus === 'PAGO').length 
                      : 0
                  )}
                </span>
                <span className="text-[10px] text-neutral-400 block mt-1">Loja física & Online</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: RELATÓRIO POR ATENDENTE & COMISSÕES */}
      {activeTab === 'rep_attendant' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
            {attendantStats.map((att, idx) => (
              <div key={idx} className="bg-[#10141d] p-4 rounded-xl border border-[#1e2636] flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#171f2b] text-neutral-400 border border-[#232f42]">
                      Classificação #{idx + 1}
                    </span>
                    <span className="text-xs font-mono font-bold text-amber-400">
                      {att.paidOrders} vendas pagas
                    </span>
                  </div>

                  <div className="mt-3">
                    <h4 className="font-serif font-bold text-white text-base">{att.name}</h4>
                    <span className="text-[11px] text-neutral-400">Atendimento Loja Canoinhas & Online</span>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
                    <div className="bg-[#0b0e14] p-2 rounded-lg border border-[#18202d]">
                      <span className="text-[10px] text-neutral-400 block">Total Vendido:</span>
                      <span className="font-serif font-bold text-[#f5d061]">
                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(att.revenue)}
                      </span>
                    </div>

                    <div className="bg-[#0b0e14] p-2 rounded-lg border border-[#18202d]">
                      <span className="text-[10px] text-neutral-400 block">Comissão a Pagar:</span>
                      <span className="font-mono font-bold text-emerald-400">
                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(att.commissions)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-[#18202d] mt-4 flex items-center justify-between text-xs">
                  <span className="text-neutral-400">Ticket Médio Vendedor:</span>
                  <span className="font-medium text-white font-mono">
                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(att.averageTicket)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: RELATÓRIO POR PEÇA / SKU */}
      {activeTab === 'rep_product' && (
        <div className="bg-[#10141d] rounded-xl border border-[#1e2636] overflow-hidden">
          <div className="p-3.5 border-b border-[#1e2636]">
            <h3 className="font-semibold text-white text-sm">Desempenho de Vendas por Peça (Catálogo & Photoshoot)</h3>
            <p className="text-xs text-neutral-400">Unidades vendidas, faturamento gerado, margem e estoque remanescente</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#0c0f16] border-b border-[#1b2231] text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">
                <tr>
                  <th className="py-2.5 px-4">Peça / Modelo</th>
                  <th className="py-2.5 px-3">Categoria</th>
                  <th className="py-2.5 px-3 text-center">Unidades Vendidas</th>
                  <th className="py-2.5 px-3 text-right">Faturamento</th>
                  <th className="py-2.5 px-3 text-right">Lucro Bruto</th>
                  <th className="py-2.5 px-4 text-center">Estoque Restante</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#171e2c]">
                {productSalesRanking.map((item, idx) => (
                  <tr key={idx} className="hover:bg-[#131822] transition-colors">
                    <td className="py-3 px-4 font-semibold text-white">
                      {item.title}
                    </td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded bg-[#182230] text-neutral-300 text-[10px]">
                        {item.category}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-center font-mono font-bold text-white">
                      {item.unitsSold} un.
                    </td>
                    <td className="py-3 px-3 text-right font-serif font-bold text-[#f0cf7e]">
                      {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.totalRevenue)}
                    </td>
                    <td className="py-3 px-3 text-right font-mono font-semibold text-emerald-400">
                      {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.grossProfit)}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className={`px-2 py-0.5 rounded-full font-mono text-[10px] font-bold ${
                        item.currentStock <= 1 
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40' 
                          : 'bg-[#182230] text-neutral-300'
                      }`}>
                        {item.currentStock} un.
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modals */}
      <NewOrderPDVModal
        clients={clients}
        products={products}
        isOpen={isPDVModalOpen}
        onClose={() => setIsPDVModalOpen(false)}
        onCreateOrder={onCreateOrder}
      />

      <NewOnlineOrderModal
        clients={clients}
        products={products}
        isOpen={isOnlineModalOpen}
        onClose={() => setIsOnlineModalOpen(false)}
        onCreateOrder={onCreateOrder}
      />
    </div>
  );
};
