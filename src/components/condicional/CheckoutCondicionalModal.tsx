import React, { useState } from 'react';
import { CondicionalBox, CondicionalItem, ReturnReasonCategory, CondicionalFinalOutcome } from '../../types/crm';
import { 
  X, 
  ShoppingBag, 
  RotateCcw, 
  CheckCircle2, 
  QrCode, 
  MessageCircle, 
  Copy, 
  Check, 
  CreditCard,
  Send,
  AlertTriangle,
  Receipt,
  Lock,
  Tag
} from 'lucide-react';

interface CheckoutCondicionalModalProps {
  box: CondicionalBox | null;
  isOpen: boolean;
  onClose: () => void;
  onCompleteCheckout: (
    boxId: string, 
    updatedItems: CondicionalItem[], 
    finalSoldValue: number, 
    paymentMethod: string,
    outcome: CondicionalFinalOutcome
  ) => void;
}

export const CheckoutCondicionalModal: React.FC<CheckoutCondicionalModalProps> = ({
  box,
  isOpen,
  onClose,
  onCompleteCheckout
}) => {
  if (!isOpen || !box) return null;

  // Initialize item statuses: default to all bought or keep original
  const [itemStatuses, setItemStatuses] = useState<
    Record<string, { 
      status: 'COMPRADA' | 'DEVOLVIDA'; 
      category?: ReturnReasonCategory; 
      reason?: string;
      customNote?: string;
    }>
  >(() => {
    const initial: Record<string, { 
      status: 'COMPRADA' | 'DEVOLVIDA'; 
      category?: ReturnReasonCategory; 
      reason?: string;
      customNote?: string;
    }> = {};

    box.items.forEach(item => {
      initial[item.id] = {
        status: item.status === 'DEVOLVIDA' ? 'DEVOLVIDA' : 'COMPRADA',
        category: item.returnReasonCategory || 'ESTILO',
        reason: item.returnReason || 'Não combinou com estilo pessoal'
      };
    });
    return initial;
  });

  const [paymentMethod, setPaymentMethod] = useState<'PIX' | 'CARTAO' | 'FATURADO_VIP'>('PIX');
  const [copiedPix, setCopiedPix] = useState(false);

  // Toggle item status
  const handleToggleStatus = (itemId: string, newStatus: 'COMPRADA' | 'DEVOLVIDA') => {
    setItemStatuses(prev => ({
      ...prev,
      [itemId]: {
        ...prev[itemId],
        status: newStatus
      }
    }));
  };

  const handleReasonCategoryChange = (itemId: string, category: ReturnReasonCategory) => {
    let defaultReason = 'Apertado no tórax / ombro';
    if (category === 'ESTILO') defaultReason = 'Não combinou com estilo pessoal';
    if (category === 'PRECO') defaultReason = 'Preço acima do orçamento atual';
    if (category === 'OUTRO') defaultReason = 'Já possui peça idêntica no armário';

    setItemStatuses(prev => ({
      ...prev,
      [itemId]: {
        ...prev[itemId],
        category,
        reason: defaultReason
      }
    }));
  };

  const handleReasonDetailChange = (itemId: string, reason: string) => {
    setItemStatuses(prev => ({
      ...prev,
      [itemId]: {
        ...prev[itemId],
        reason
      }
    }));
  };

  // Calculate sold value
  const boughtItems = box.items.filter(item => itemStatuses[item.id]?.status === 'COMPRADA');
  const returnedItems = box.items.filter(item => itemStatuses[item.id]?.status === 'DEVOLVIDA');
  const finalSoldValue = boughtItems.reduce((acc, item) => acc + item.price, 0);

  const pixKey = "financeiro@ravispremium.com.br";

  const handleCopyPix = () => {
    navigator.clipboard?.writeText(pixKey);
    setCopiedPix(true);
    setTimeout(() => setCopiedPix(false), 2000);
  };

  // Determine outcome
  const getOutcome = (): CondicionalFinalOutcome => {
    if (boughtItems.length === box.items.length) return 'COMPRADO_INTEIRO';
    if (boughtItems.length > 0) return 'COMPRADO_PARCIAL';
    return 'DEVOLVIDO_TOTAL';
  };

  const handleFinish = () => {
    const updatedItems: CondicionalItem[] = box.items.map(item => {
      const current = itemStatuses[item.id];
      return {
        ...item,
        status: current.status,
        returnReasonCategory: current.status === 'DEVOLVIDA' ? current.category : undefined,
        returnReason: current.status === 'DEVOLVIDA' ? current.reason : undefined
      };
    });

    const outcome = getOutcome();
    onCompleteCheckout(box.id, updatedItems, finalSoldValue, paymentMethod, outcome);
    onClose();
  };

  const conversionPercentage = box.items.length > 0 
    ? Math.round((boughtItems.length / box.items.length) * 100) 
    : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-sm overflow-y-auto">
      <div className="bg-[#10141d] border border-[#273245] w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-5 py-4 border-b border-[#212a3b] bg-[#141924] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-semibold text-white">Fechamento de Mala Condicional</h2>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#1d2738] text-neutral-300 font-mono">
                  {box.code}
                </span>
              </div>
              <p className="text-xs text-neutral-400">
                {box.clientName} • Registro de compras vs devoluções categorizadas
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

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1 text-xs">
          <div className="bg-[#141a24] p-3 rounded-xl border border-[#20293b] flex items-center justify-between">
            <span className="text-neutral-300">
              Marque o destino de cada peça enviada para abastecer a inteligência de curadoria da Ravi's:
            </span>
            <div className="text-right">
              <span className="text-[11px] text-neutral-400 block">Conversão da Mala:</span>
              <span className="font-serif font-bold text-sm text-emerald-400">{conversionPercentage}%</span>
            </div>
          </div>

          {/* Items Decision List */}
          <div className="space-y-3">
            {box.items.map(item => {
              const state = itemStatuses[item.id] || { status: 'COMPRADA', category: 'ESTILO', reason: '' };
              const isBought = state.status === 'COMPRADA';

              return (
                <div 
                  key={item.id}
                  className={`p-3.5 rounded-xl border transition-all ${
                    isBought 
                      ? 'bg-[#121c17] border-emerald-700/60 shadow-sm' 
                      : 'bg-[#13161c] border-[#222a3b]'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                    <div className="flex items-center gap-2.5">
                      <div className="w-10 h-10 rounded-lg bg-[#1a2230] overflow-hidden shrink-0 border border-[#273449]">
                        {item.imageUrl ? (
                          <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-neutral-500">
                            <ShoppingBag className="w-4 h-4" />
                          </div>
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono text-neutral-400 text-[10px]">{item.productCode}</span>
                          <span className="font-semibold text-white text-xs">{item.title}</span>
                          <span className="px-1.5 py-0.2 rounded bg-[#1c2433] text-amber-300 font-mono text-[10px]">
                            Tam {item.size}
                          </span>
                        </div>
                        <div className="text-neutral-400 text-[11px] mt-0.5">
                          Valor: <strong className="text-neutral-200">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.price)}</strong>
                        </div>
                      </div>
                    </div>

                    {/* Status Toggles */}
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleToggleStatus(item.id, 'COMPRADA')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
                          isBought 
                            ? 'bg-emerald-600 text-white shadow-md shadow-emerald-950/40' 
                            : 'bg-[#1b2230] text-neutral-400 hover:text-white'
                        }`}
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Ficou com a Peça</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleToggleStatus(item.id, 'DEVOLVIDA')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
                          !isBought 
                            ? 'bg-neutral-700 text-neutral-200 shadow-md' 
                            : 'bg-[#1b2230] text-neutral-400 hover:text-white'
                        }`}
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Devolver Peça</span>
                      </button>
                    </div>
                  </div>

                  {/* Return Reason Breakdown (Strictly meeting Requirement 4: TAMANHO, ESTILO, PRECO, OUTRO) */}
                  {!isBought && (
                    <div className="mt-3 pt-2.5 border-t border-[#1e2533] space-y-2 bg-[#0d1017] p-2.5 rounded-lg">
                      <div className="flex items-center gap-2">
                        <span className="text-amber-400 font-semibold text-[11px] flex items-center gap-1">
                          <AlertTriangle className="w-3.5 h-3.5" />
                          <span>Motivo da Devolução (Inteligência de Curadoria):</span>
                        </span>
                      </div>

                      {/* Category Pills */}
                      <div className="flex flex-wrap items-center gap-1.5">
                        {(['TAMANHO', 'ESTILO', 'PRECO', 'OUTRO'] as ReturnReasonCategory[]).map(cat => (
                          <button
                            key={cat}
                            type="button"
                            onClick={() => handleReasonCategoryChange(item.id, cat)}
                            className={`px-2.5 py-1 rounded-md text-[10px] font-bold transition-all ${
                              state.category === cat 
                                ? 'bg-amber-500 text-black shadow-sm' 
                                : 'bg-[#18212e] text-neutral-400 hover:text-white border border-[#242f40]'
                            }`}
                          >
                            {cat === 'TAMANHO' ? '📏 TAMANHO' : cat === 'ESTILO' ? '🎨 ESTILO / GOSTO' : cat === 'PRECO' ? '💰 PREÇO' : '📦 OUTRO'}
                          </button>
                        ))}
                      </div>

                      {/* Specific Sub-reason dropdown */}
                      <div className="pt-1">
                        <select
                          value={state.reason}
                          onChange={(e) => handleReasonDetailChange(item.id, e.target.value)}
                          className="w-full bg-[#11151e] border border-[#273245] rounded-lg px-2.5 py-1.5 text-neutral-200 text-xs focus:outline-none focus:border-[#c99738]"
                        >
                          {state.category === 'TAMANHO' && (
                            <>
                              <option value="Apertado no tórax / ombro">Apertado no tórax / ombros</option>
                              <option value="Caimento folgado / largo">Caimento folgado / largo demais</option>
                              <option value="Comprimento longo de manga/barra">Comprimento longo (manga ou barra)</option>
                              <option value="Calçado apertou no peito do pé">Calçado apertou no peito do pé</option>
                            </>
                          )}
                          {state.category === 'ESTILO' && (
                            <>
                              <option value="Não combinou com estilo pessoal">Não combinou com seu estilo pessoal</option>
                              <option value="Cor não harmonizou com o guarda-roupa">Cor não harmonizou com o guarda-roupa</option>
                              <option value="Achou formal demais para sua rotina">Achou formal demais para a rotina</option>
                              <option value="Achou casual demais para a ocasião">Achou casual demais para a ocasião</option>
                              <option value="Textura ou toque do tecido não agradou">Textura ou toque do tecido não agradou</option>
                            </>
                          )}
                          {state.category === 'PRECO' && (
                            <>
                              <option value="Preço acima do orçamento atual">Preço acima do orçamento planejado</option>
                              <option value="Priorizou outra peça da mala">Priorizou outra peça da mesma mala</option>
                            </>
                          )}
                          {state.category === 'OUTRO' && (
                            <>
                              <option value="Já possui peça idêntica no armário">Já possui peça similar / idêntica</option>
                              <option value="Evento cancelado ou reprogramado">Evento cancelado ou reprogramado</option>
                            </>
                          )}
                        </select>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Financial Summary & Payment Method */}
          <div className="bg-[#0b0e14] p-4 rounded-xl border border-[#20293a] space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="text-neutral-400">Total Enviado na Mala:</span>
              <span className="text-neutral-300 font-mono line-through">
                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(box.totalValue)}
              </span>
            </div>

            <div className="flex items-center justify-between text-xs">
              <span className="text-neutral-400">Peças a Recolher pelo Motorista ({returnedItems.length}):</span>
              <span className="text-neutral-400 font-mono">
                - {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(box.totalValue - finalSoldValue)}
              </span>
            </div>

            <div className="pt-2 border-t border-[#1b2333] flex items-center justify-between">
              <div>
                <span className="font-semibold text-white text-sm">Total a Faturar ({boughtItems.length} peças):</span>
                <span className="block text-[11px] text-emerald-400 font-medium">
                  Desfecho: {getOutcome() === 'COMPRADO_INTEIRO' ? 'Comprado 100% (Mala Completa)' : getOutcome() === 'COMPRADO_PARCIAL' ? 'Comprado Parcial' : 'Devolução Total'}
                </span>
              </div>
              <span className="font-serif text-xl font-bold text-[#f5d061]">
                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(finalSoldValue)}
              </span>
            </div>

            {/* Payment Method Selector */}
            {finalSoldValue > 0 && (
              <div className="pt-3 border-t border-[#1b2333] space-y-2">
                <span className="text-neutral-400 text-[11px] block font-semibold uppercase tracking-wider">
                  Forma de Pagamento em Canoinhas:
                </span>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('PIX')}
                    className={`py-2 px-2.5 rounded-lg border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                      paymentMethod === 'PIX'
                        ? 'bg-emerald-950/70 border-emerald-500 text-emerald-300'
                        : 'bg-[#121620] border-[#222a3a] text-neutral-400 hover:text-white'
                    }`}
                  >
                    <QrCode className="w-3.5 h-3.5" />
                    <span>Pix Imediato</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('CARTAO')}
                    className={`py-2 px-2.5 rounded-lg border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                      paymentMethod === 'CARTAO'
                        ? 'bg-blue-950/70 border-blue-500 text-blue-300'
                        : 'bg-[#121620] border-[#222a3a] text-neutral-400 hover:text-white'
                    }`}
                  >
                    <CreditCard className="w-3.5 h-3.5" />
                    <span>Cartão / Link</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('FATURADO_VIP')}
                    className={`py-2 px-2.5 rounded-lg border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                      paymentMethod === 'FATURADO_VIP'
                        ? 'bg-[#c99738]/20 border-[#c99738] text-[#f0cf7e]'
                        : 'bg-[#121620] border-[#222a3a] text-neutral-400 hover:text-white'
                    }`}
                  >
                    <Receipt className="w-3.5 h-3.5" />
                    <span>Conta VIP Ravi's</span>
                  </button>
                </div>

                {paymentMethod === 'PIX' && (
                  <div className="bg-[#101915] p-2.5 rounded-lg border border-emerald-800/40 flex items-center justify-between text-[11px] text-emerald-300">
                    <div>
                      <span className="block text-neutral-400 text-[10px]">Chave Pix Oficial da Loja:</span>
                      <span className="font-mono font-bold text-white">{pixKey}</span>
                    </div>
                    <button
                      type="button"
                      onClick={handleCopyPix}
                      className="px-2 py-1 rounded bg-emerald-800/50 hover:bg-emerald-700/60 text-white font-medium flex items-center gap-1"
                    >
                      {copiedPix ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedPix ? 'Copiada' : 'Copiar'}</span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3.5 border-t border-[#20293b] bg-[#141924] flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-3.5 py-2 rounded-lg bg-[#18212e] text-neutral-300 hover:text-white transition-colors"
          >
            Cancelar
          </button>

          <button
            type="button"
            onClick={handleFinish}
            className="px-5 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs shadow-lg shadow-emerald-950/40 flex items-center gap-2 transition-all"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Confirmar Fechamento & Dar Baixa no Estoque</span>
          </button>
        </div>
      </div>
    </div>
  );
};
