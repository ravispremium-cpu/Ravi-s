import React, { useState } from 'react';
import { Client, Product, Order, OrderItem, PaymentMethod } from '../../types/crm';
import { 
  X, 
  Globe, 
  User, 
  ShoppingBag, 
  Plus, 
  Trash2, 
  Link2, 
  Copy, 
  Check, 
  MessageCircle, 
  CheckCircle2, 
  ExternalLink,
  ShieldCheck,
  Send
} from 'lucide-react';

interface NewOnlineOrderModalProps {
  clients: Client[];
  products: Product[];
  isOpen: boolean;
  onClose: () => void;
  onCreateOrder: (order: Order) => void;
}

export const NewOnlineOrderModal: React.FC<NewOnlineOrderModalProps> = ({
  clients,
  products,
  isOpen,
  onClose,
  onCreateOrder
}) => {
  const [selectedClientId, setSelectedClientId] = useState<string>(clients[0]?.id || '');
  const [curatorName, setCuratorName] = useState<string>('Mateus (Consultor Sênior)');
  const [gateway, setGateway] = useState<'MERCADO_PAGO_LINK' | 'STRIPE_CARD'>('MERCADO_PAGO_LINK');
  const [orderItems, setOrderItems] = useState<
    { product: Product; size: string; quantity: number }[]
  >([]);
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedMessage, setCopiedMessage] = useState(false);

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
        alert(`Estoque máximo atingido para o tamanho ${size}.`);
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
  const totalCost = orderItems.reduce((acc, item) => acc + (item.product.costPrice * item.quantity), 0);
  const grossProfit = subtotal - totalCost;
  const commissionValue = Math.round(subtotal * 0.05); // 5% comissão online

  const generatedLink = gateway === 'MERCADO_PAGO_LINK' 
    ? `https://mpago.la/ravis/${currentClient?.id || 'pedido'}-${Math.floor(100 + Math.random() * 900)}` 
    : `https://buy.stripe.com/ravis_online_${Math.floor(100 + Math.random() * 900)}`;

  const whatsappMessage = `Olá, ${currentClient?.name.split(' ')[0]}! Tudo bem? 👔✨

Aqui é o *${curatorName.split(' ')[0]}* da *Ravi's Premium*.

Seu pedido online exclusivo foi gerado com sucesso:
${orderItems.map(i => `• *${i.product.title}* (Tam. ${i.size}) — ${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(i.product.price)}`).join('\n')}

💰 *Total do Pedido:* ${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(subtotal)}

🔒 *Link Seguro de Pagamento (${gateway === 'MERCADO_PAGO_LINK' ? 'Mercado Pago Pix/Cartão' : 'Stripe Internacional'}):*
👉 ${generatedLink}

Assim que o pagamento for confirmado no link acima, despacharemos seu pacote com todo o carinho e exclusividade!`;

  const handleCopyLink = () => {
    navigator.clipboard?.writeText(generatedLink);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleCopyMessage = () => {
    navigator.clipboard?.writeText(whatsappMessage);
    setCopiedMessage(true);
    setTimeout(() => setCopiedMessage(false), 2000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (orderItems.length === 0) {
      alert('Adicione ao menos uma peça ao pedido online.');
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
      code: `ONL-2026-${Math.floor(100 + Math.random() * 900)}`,
      channel: 'ONLINE',
      clientId: currentClient?.id || 'online',
      clientName: currentClient?.name || 'Cliente Online',
      clientPhone: currentClient?.phone || '',
      clientCity: currentClient?.city || 'Canoinhas',
      curatorId: curatorName.includes('Mateus') ? 'cur-01' : curatorName.includes('Juliana') ? 'cur-02' : 'cur-03',
      curatorName,
      commissionRate: 0.05,
      commissionValue,
      items,
      subtotal,
      discount: 0,
      shippingFee: 0,
      totalValue: subtotal,
      grossProfit,
      paymentMethod: gateway,
      paymentStatus: 'PENDENTE',
      orderStatus: 'PENDENTE',
      whatsappPaymentLink: generatedLink,
      createdAt: new Date().toISOString(),
      notes: `Link gerado via ${gateway === 'MERCADO_PAGO_LINK' ? 'Mercado Pago' : 'Stripe'} e enviado ao cliente.`
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
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-500/40 flex items-center justify-center text-blue-400">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-semibold text-white">Canal Online — Gerador de Link Mercado Pago & Stripe</h2>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/20 text-blue-300 border border-blue-500/40">
                  Integração WhatsApp
                </span>
              </div>
              <p className="text-xs text-neutral-400">
                Gere link de pagamento seguro com checkout transparente para envio imediato no WhatsApp do cliente
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
          {/* Top Selection: Client, Curator & Gateway */}
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
                    {c.name} ({c.phone})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-neutral-300 block mb-1">
                Atendente Vinculado (Comissão 5%):
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
                Gateway de Pagamento:
              </label>
              <select
                value={gateway}
                onChange={(e: any) => setGateway(e.target.value)}
                className="w-full bg-[#0d1017] border border-[#273245] rounded-lg px-2.5 py-2 text-blue-300 font-semibold text-xs focus:outline-none focus:border-[#c99738]"
              >
                <option value="MERCADO_PAGO_LINK">Mercado Pago (Pix & Cartão BR)</option>
                <option value="STRIPE_CARD">Stripe Checkout (Cartão Internacional)</option>
              </select>
            </div>
          </div>

          {/* Product Quick Picker */}
          <div className="space-y-2">
            <span className="font-semibold text-white text-xs flex items-center gap-1.5">
              <ShoppingBag className="w-4 h-4 text-[#c99738]" />
              <span>Adicionar Peças do Catálogo ao Pedido Online:</span>
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

                      <div className="flex flex-wrap items-center gap-1">
                        {Object.entries(prod.stockBySize).map(([size, st]) => (
                          <button
                            key={size}
                            type="button"
                            disabled={st.available <= 0}
                            onClick={() => handleAddItem(prod, size)}
                            className="px-2 py-0.5 rounded bg-[#1c2536] hover:bg-[#253247] text-[10px] font-mono font-bold text-neutral-200 border border-[#28354c] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
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
                Itens no Pedido Online ({orderItems.reduce((acc, i) => acc + i.quantity, 0)} un.)
              </span>
              <span className="text-neutral-400 text-xs">
                Total: <strong className="font-serif text-[#f0cf7e] text-sm">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(subtotal)}</strong>
              </span>
            </div>

            {orderItems.length === 0 ? (
              <div className="text-center py-4 text-neutral-400 text-xs border border-dashed border-[#1a2130] rounded-lg">
                Nenhuma peça selecionada para o pedido online.
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

          {/* Generated Link and WhatsApp Message Preview */}
          <div className="bg-[#0b0e14] p-3.5 rounded-xl border border-[#20293b] space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-white text-xs flex items-center gap-1.5">
                <Link2 className="w-4 h-4 text-blue-400" />
                <span>Link de Pagamento Seguro Gerado:</span>
              </span>
              <button
                type="button"
                onClick={handleCopyLink}
                className="text-blue-400 hover:text-blue-300 flex items-center gap-1 text-[11px]"
              >
                {copiedLink ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedLink ? 'Copiado!' : 'Copiar Link'}</span>
              </button>
            </div>

            <div className="bg-[#121622] p-2 rounded-lg border border-[#1e273a] font-mono text-[11px] text-blue-300 truncate">
              {generatedLink}
            </div>

            {/* WhatsApp Text Preview */}
            <div className="pt-2 border-t border-[#182130]">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] font-semibold text-neutral-400 flex items-center gap-1">
                  <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Mensagem Pronta para WhatsApp:</span>
                </span>
                <button
                  type="button"
                  onClick={handleCopyMessage}
                  className="text-emerald-400 hover:text-emerald-300 flex items-center gap-1 text-[11px]"
                >
                  {copiedMessage ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedMessage ? 'Copiado!' : 'Copiar Mensagem'}</span>
                </button>
              </div>

              <div className="bg-[#0d141a] p-3 rounded-xl border border-[#1b2b35] text-neutral-200 whitespace-pre-line text-[11px] leading-relaxed max-h-36 overflow-y-auto">
                {whatsappMessage}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3.5 border-t border-[#20293b] bg-[#141924] flex items-center justify-between">
          <span className="text-xs text-neutral-400">
            O pedido ficará como PENDENTE até o webhook confirmar o pagamento no gateway.
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
              className="px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs shadow-lg shadow-blue-950/40 flex items-center gap-2 transition-all"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Gerar Pedido Online & Reservar Peças</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
