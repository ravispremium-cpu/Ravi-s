import React, { useState } from 'react';
import { Client, Product, Order, OrderItem, PaymentMethod } from '../../types/crm';
import { 
  X, 
  Store, 
  User, 
  ShoppingBag, 
  Plus, 
  Trash2, 
  Percent, 
  CreditCard, 
  QrCode, 
  Receipt, 
  Banknote, 
  CheckCircle2, 
  AlertCircle,
  Package,
  Sparkles
} from 'lucide-react';

interface NewOrderPDVModalProps {
  clients: Client[];
  products: Product[];
  isOpen: boolean;
  onClose: () => void;
  onCreateOrder: (order: Order) => void;
}

export const NewOrderPDVModal: React.FC<NewOrderPDVModalProps> = ({
  clients,
  products,
  isOpen,
  onClose,
  onCreateOrder
}) => {
  const [selectedClientId, setSelectedClientId] = useState<string>(clients[0]?.id || '');
  const [curatorName, setCuratorName] = useState<string>('Mateus (Consultor Sênior)');
  const [commissionRate, setCommissionRate] = useState<number>(0.06); // 6% comissão
  const [orderItems, setOrderItems] = useState<
    { product: Product; size: string; quantity: number }[]
  >([]);
  const [discount, setDiscount] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('CARTAO_MAQUININHA_PDV');
  const [notes, setNotes] = useState<string>('');

  if (!isOpen) return null;

  const currentClient = clients.find(c => c.id === selectedClientId) || clients[0];

  const handleAddItem = (product: Product, size: string) => {
    const stockObj = product.stockBySize[size];
    if (!stockObj || stockObj.available <= 0) {
      alert(`Peça indisponível no tamanho ${size}.`);
      return;
    }

    const existingIndex = orderItems.findIndex(i => i.product.id === product.id && i.size === size);
    if (existingIndex >= 0) {
      const currentQty = orderItems[existingIndex].quantity;
      if (currentQty >= stockObj.available) {
        alert(`Estoque máximo atingido para o tamanho ${size} (${stockObj.available} unidades disponíveis).`);
        return;
      }
      const updated = [...orderItems];
      updated[existingIndex].quantity += 1;
      setOrderItems(updated);
    } else {
      setOrderItems([...orderItems, { product, size, quantity: 1 }]);
    }
  };

  const handleRemoveItem = (index: number) => {
    setOrderItems(orderItems.filter((_, idx) => idx !== index));
  };

  const subtotal = orderItems.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
  const totalValue = Math.max(0, subtotal - discount);
  const totalCost = orderItems.reduce((acc, item) => acc + (item.product.costPrice * item.quantity), 0);
  const grossProfit = totalValue - totalCost;
  const commissionValue = Math.round(totalValue * commissionRate);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (orderItems.length === 0) {
      alert('Adicione ao menos uma peça ao pedido do PDV.');
      return;
    }

    const items: OrderItem[] = orderItems.map((entry, idx) => ({
      id: `oi-${Date.now()}-${idx}`,
      productId: entry.product.id,
      productCode: entry.product.code,
      title: entry.product.title,
      category: entry.product.category,
      size: entry.size,
      color: entry.product.color,
      quantity: entry.quantity,
      unitPrice: entry.product.price,
      costPrice: entry.product.costPrice,
      subtotal: entry.product.price * entry.quantity,
      imageUrl: entry.product.imageUrl
    }));

    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      code: `PDV-2026-${Math.floor(100 + Math.random() * 900)}`,
      channel: 'PDV_CANOINHAS',
      clientId: currentClient?.id || 'balcao',
      clientName: currentClient?.name || 'Cliente Balcão Canoinhas',
      clientPhone: currentClient?.phone || '(47) Loja Física',
      clientCity: currentClient?.city || 'Canoinhas',
      curatorId: curatorName.includes('Mateus') ? 'cur-01' : curatorName.includes('Juliana') ? 'cur-02' : 'cur-03',
      curatorName,
      commissionRate,
      commissionValue,
      items,
      subtotal,
      discount,
      shippingFee: 0,
      totalValue,
      grossProfit,
      paymentMethod,
      paymentStatus: 'PAGO',
      orderStatus: 'ENTREGUE', // Retirada imediata no PDV
      createdAt: new Date().toISOString(),
      paidAt: new Date().toISOString(),
      deliveredAt: new Date().toISOString(),
      notes: notes || 'Venda concluída no balcão da loja de Canoinhas.'
    };

    onCreateOrder(newOrder);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-sm overflow-y-auto">
      <div className="bg-[#10141d] border border-[#273245] w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-5 py-4 border-b border-[#212a3b] bg-[#141924] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <Store className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-semibold text-white">PDV Físico — Frente de Caixa Canoinhas</h2>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  Baixa Imediata no Estoque
                </span>
              </div>
              <p className="text-xs text-neutral-400">
                Atendimento presencial no Centro de Canoinhas com comissão de atendente vinculada
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg bg-[#1a212e] text-neutral-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Form */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1 text-xs">
          {/* Top Selection: Client & Attendant */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-[#141923] p-3.5 rounded-xl border border-[#20293b]">
            <div>
              <label className="text-[11px] font-semibold text-neutral-300 block mb-1">
                Cliente Comprador:
              </label>
              <select
                value={selectedClientId}
                onChange={(e) => setSelectedClientId(e.target.value)}
                className="w-full bg-[#0d1017] border border-[#273245] rounded-lg px-2.5 py-2 text-white text-xs focus:outline-none focus:border-[#c99738]"
              >
                {clients.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.name} — {c.tier} ({c.city})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-neutral-300 block mb-1">
                Atendente / Consultor Vinculado:
              </label>
              <select
                value={curatorName}
                onChange={(e) => setCuratorName(e.target.value)}
                className="w-full bg-[#0d1017] border border-[#273245] rounded-lg px-2.5 py-2 text-white text-xs focus:outline-none focus:border-[#c99738]"
              >
                <option value="Mateus (Consultor Sênior)">Mateus (Consultor Sênior)</option>
                <option value="Juliana (Consultora VIP)">Juliana (Consultora VIP)</option>
                <option value="Ravi (Curador-Chefe)">Ravi (Curador-Chefe)</option>
              </select>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-neutral-300 block mb-1">
                Comissão do Atendente:
              </label>
              <div className="flex items-center gap-2">
                <select
                  value={commissionRate}
                  onChange={(e) => setCommissionRate(Number(e.target.value))}
                  className="bg-[#0d1017] border border-[#273245] rounded-lg px-2.5 py-2 text-amber-300 font-mono text-xs focus:outline-none focus:border-[#c99738]"
                >
                  <option value={0.04}>4% (Padrão balcão)</option>
                  <option value={0.06}>6% (Consultoria de estilo)</option>
                  <option value={0.08}>8% (Meta batida VIP)</option>
                </select>
                <span className="text-neutral-400 text-[11px] font-mono">
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(commissionValue)}
                </span>
              </div>
            </div>
          </div>

          {/* Product Quick Picker */}
          <div className="space-y-2">
            <span className="font-semibold text-white text-xs flex items-center gap-1.5">
              <ShoppingBag className="w-4 h-4 text-[#c99738]" />
              <span>Adicionar Peças do Catálogo (Selecione o tamanho disponível):</span>
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 max-h-48 overflow-y-auto p-1">
              {products.map(prod => {
                const totalAvail = Object.values(prod.stockBySize).reduce((acc, s) => acc + s.available, 0);

                return (
                  <div key={prod.id} className="bg-[#121620] p-2.5 rounded-xl border border-[#222a3b] flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between text-[10px]">
                        <span className="font-mono text-neutral-400">{prod.code}</span>
                        <span className="text-emerald-400 font-mono font-medium">{totalAvail} un. disp.</span>
                      </div>
                      <h4 className="font-semibold text-white text-xs mt-0.5 truncate">{prod.title}</h4>
                      <p className="text-[10px] text-neutral-400 truncate">{prod.material}</p>
                    </div>

                    <div className="mt-2 pt-2 border-t border-[#1b2332] flex items-center justify-between">
                      <span className="font-serif font-bold text-[#f0cf7e] text-xs">
                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(prod.price)}
                      </span>

                      {/* Sizes buttons */}
                      <div className="flex flex-wrap items-center gap-1">
                        {Object.entries(prod.stockBySize).map(([size, st]) => (
                          <button
                            key={size}
                            type="button"
                            disabled={st.available <= 0}
                            onClick={() => handleAddItem(prod, size)}
                            className="px-2 py-0.5 rounded bg-[#1c2536] hover:bg-[#253247] text-[10px] font-mono font-bold text-neutral-200 border border-[#28354c] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                            title={`${st.available} disponíveis no tam ${size}`}
                          >
                            +{size}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Cart Items Table */}
          <div className="bg-[#0b0e14] p-3.5 rounded-xl border border-[#1e2637] space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-white text-xs">
                Itens no Carrinho do PDV ({orderItems.reduce((acc, i) => acc + i.quantity, 0)} un.)
              </span>
              <span className="text-neutral-400 text-xs">
                Subtotal: <strong className="text-white">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(subtotal)}</strong>
              </span>
            </div>

            {orderItems.length === 0 ? (
              <div className="text-center py-4 text-neutral-400 text-xs border border-dashed border-[#1a2130] rounded-lg">
                Nenhuma peça adicionada. Clique nas opções de tamanho acima.
              </div>
            ) : (
              <div className="space-y-1.5 max-h-36 overflow-y-auto">
                {orderItems.map((entry, idx) => (
                  <div key={idx} className="flex items-center justify-between bg-[#121620] px-3 py-1.5 rounded-lg border border-[#202838]">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[10px] text-neutral-400">{entry.product.code}</span>
                      <span className="text-white font-medium">{entry.product.title}</span>
                      <span className="px-1.5 py-0.2 rounded bg-[#1c2433] text-amber-300 font-mono text-[10px]">
                        Tam {entry.size}
                      </span>
                      <span className="text-neutral-400 text-[11px] font-mono">x{entry.quantity}</span>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="font-semibold text-[#f0cf7e]">
                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(entry.product.price * entry.quantity)}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemoveItem(idx)}
                        className="text-neutral-400 hover:text-red-400 transition-colors p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Payment Method & Totals */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 bg-[#0b0e14] p-3.5 rounded-xl border border-[#20293b]">
            <div className="space-y-2">
              <span className="text-[11px] font-semibold text-neutral-300 block">Forma de Pagamento no Caixa:</span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('CARTAO_MAQUININHA_PDV')}
                  className={`p-2 rounded-lg border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                    paymentMethod === 'CARTAO_MAQUININHA_PDV'
                      ? 'bg-blue-950/70 border-blue-500 text-blue-300'
                      : 'bg-[#121620] border-[#202838] text-neutral-400 hover:text-white'
                  }`}
                >
                  <CreditCard className="w-3.5 h-3.5" />
                  <span>Maquininha Cartão</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('PIX')}
                  className={`p-2 rounded-lg border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                    paymentMethod === 'PIX'
                      ? 'bg-emerald-950/70 border-emerald-500 text-emerald-300'
                      : 'bg-[#121620] border-[#202838] text-neutral-400 hover:text-white'
                  }`}
                >
                  <QrCode className="w-3.5 h-3.5" />
                  <span>Pix Balcão</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('DINHEIRO')}
                  className={`p-2 rounded-lg border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                    paymentMethod === 'DINHEIRO'
                      ? 'bg-amber-950/70 border-amber-500 text-amber-300'
                      : 'bg-[#121620] border-[#202838] text-neutral-400 hover:text-white'
                  }`}
                >
                  <Banknote className="w-3.5 h-3.5" />
                  <span>Dinheiro em Espécie</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('MERCADO_PAGO_LINK')}
                  className={`p-2 rounded-lg border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                    paymentMethod === 'MERCADO_PAGO_LINK'
                      ? 'bg-purple-950/70 border-purple-500 text-purple-300'
                      : 'bg-[#121620] border-[#202838] text-neutral-400 hover:text-white'
                  }`}
                >
                  <Receipt className="w-3.5 h-3.5" />
                  <span>Conta VIP Ravi's</span>
                </button>
              </div>
            </div>

            {/* Financial Summary */}
            <div className="space-y-2 bg-[#121620] p-3 rounded-lg border border-[#1b2332]">
              <div className="flex items-center justify-between text-xs">
                <span className="text-neutral-400">Subtotal:</span>
                <span className="text-neutral-200 font-mono">
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(subtotal)}
                </span>
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="text-neutral-400">Desconto Comercial:</span>
                <input
                  type="number"
                  min="0"
                  value={discount}
                  onChange={(e) => setDiscount(Number(e.target.value) || 0)}
                  className="w-24 bg-[#0a0d14] border border-[#232c3d] rounded px-2 py-0.5 text-right font-mono text-xs text-white focus:outline-none focus:border-[#c99738]"
                />
              </div>

              <div className="flex items-center justify-between text-xs pt-1 border-t border-[#1a2130]">
                <span className="text-neutral-400">Comissão de {curatorName.split(' ')[0]}:</span>
                <span className="text-amber-400 font-mono font-medium">
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(commissionValue)}
                </span>
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="text-neutral-400">Lucro Bruto Ravi's:</span>
                <span className="text-emerald-400 font-mono font-medium">
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(grossProfit)}
                </span>
              </div>

              <div className="pt-2 border-t border-[#1f293b] flex items-center justify-between">
                <span className="font-semibold text-white text-sm">Total do Pedido:</span>
                <span className="font-serif text-lg font-bold text-[#f5d061]">
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalValue)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3.5 border-t border-[#20293b] bg-[#141924] flex items-center justify-between">
          <span className="text-xs text-neutral-400">
            A conclusão deste pedido dá baixa automática no estoque de cada peça vendida.
          </span>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 rounded-lg bg-[#18212e] text-neutral-300 hover:text-white transition-colors"
            >
              Cancelar
            </button>

            <button
              type="button"
              onClick={handleSubmit}
              className="px-5 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs shadow-lg shadow-emerald-950/40 flex items-center gap-2 transition-all"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Concluir Venda PDV & Emitir Comprovante</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
