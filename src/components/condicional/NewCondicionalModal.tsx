import React, { useState } from 'react';
import { Client, Product, CondicionalBox, CondicionalItem } from '../../types/crm';
import { 
  X, 
  Sparkles, 
  User, 
  Package, 
  Check, 
  AlertCircle, 
  MapPin, 
  Clock, 
  Truck,
  Plus,
  Trash2,
  Tag,
  GripVertical,
  Lock,
  ArrowRight,
  Image as ImageIcon
} from 'lucide-react';

interface NewCondicionalModalProps {
  clients: Client[];
  products: Product[];
  isOpen: boolean;
  onClose: () => void;
  onCreateBox: (newBox: CondicionalBox) => void;
}

export const NewCondicionalModal: React.FC<NewCondicionalModalProps> = ({
  clients,
  products,
  isOpen,
  onClose,
  onCreateBox
}) => {
  const [selectedClientId, setSelectedClientId] = useState<string>(clients[0]?.id || '');
  const [filterBySizeOnly, setFilterBySizeOnly] = useState<boolean>(true);
  const [selectedProductEntries, setSelectedProductEntries] = useState<
    { product: Product; size: string }[]
  >([]);
  const [deliveryMethod, setDeliveryMethod] = useState<'Entrega VIP Motorista Ravi\'s' | 'Retirada na Loja Canoinhas' | 'Sedex Express Planalto Norte'>('Entrega VIP Motorista Ravi\'s');
  const [curatorName, setCuratorName] = useState<string>('Mateus (Consultor Sênior)');
  const [notes, setNotes] = useState<string>('');
  const [testDays, setTestDays] = useState<number>(7); // Requirement: padrão 7 dias
  const [isDragOver, setIsDragOver] = useState<boolean>(false);

  if (!isOpen) return null;

  const currentClient = clients.find(c => c.id === selectedClientId) || clients[0];

  // Helper to get client size for a category
  const getClientSizeForProduct = (category: Product['category']) => {
    if (!currentClient) return 'M';
    if (
      category === 'Camisas' || 
      category === 'Blazers' || 
      category === 'Polos & Malharia' ||
      category === 'Camiseta Slim' ||
      category === 'Camiseta Longline' ||
      category === 'Tricô' ||
      category === 'Sobretudo'
    ) {
      return currentClient.sizes.shirt;
    }
    if (category === 'Cachecol') {
      return 'Único';
    }
    if (category === 'Calças' || category === 'Calça') {
      return currentClient.sizes.pants;
    }
    if (category === 'Calçados') {
      return currentClient.sizes.shoes;
    }
    return 'M';
  };

  // Add piece to box
  const handleAddProduct = (product: Product, sizeToUse: string) => {
    const stockInfo = product.stockBySize[sizeToUse];
    if (!stockInfo || stockInfo.available <= 0) {
      alert(`Aviso: Peça indisponível no tamanho ${sizeToUse}. Todas as unidades estão reservadas ou esgotadas.`);
      return;
    }

    // Check if already in box with this size
    const alreadyAdded = selectedProductEntries.some(
      entry => entry.product.id === product.id && entry.size === sizeToUse
    );

    if (alreadyAdded) {
      return;
    }

    setSelectedProductEntries([...selectedProductEntries, { product, size: sizeToUse }]);
  };

  const handleRemoveProduct = (index: number) => {
    setSelectedProductEntries(selectedProductEntries.filter((_, i) => i !== index));
  };

  // Drag and Drop handlers
  const handleDragStart = (e: React.DragEvent, product: Product, size: string) => {
    e.dataTransfer.setData('text/plain', JSON.stringify({ productId: product.id, size }));
    e.dataTransfer.effectAllowed = 'copy';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
    if (!isDragOver) setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    try {
      const data = JSON.parse(e.dataTransfer.getData('text/plain'));
      if (data && data.productId) {
        const prod = products.find(p => p.id === data.productId);
        if (prod) {
          handleAddProduct(prod, data.size || getClientSizeForProduct(prod.category));
        }
      }
    } catch (err) {
      console.error('Drag drop error:', err);
    }
  };

  const totalValue = selectedProductEntries.reduce((acc, entry) => acc + entry.product.price, 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentClient) return;
    if (selectedProductEntries.length === 0) {
      alert('Selecione ao menos 1 peça para compor a mala de condicional.');
      return;
    }

    const items: CondicionalItem[] = selectedProductEntries.map((entry, idx) => ({
      id: `ci-${Date.now()}-${idx}`,
      productId: entry.product.id,
      productCode: entry.product.code,
      title: entry.product.title,
      category: entry.product.category,
      size: entry.size,
      price: entry.product.price,
      imageUrl: entry.product.imageUrl,
      material: entry.product.material,
      color: entry.product.color,
      status: 'PENDENTE'
    }));

    const deadline = new Date(Date.now() + testDays * 24 * 60 * 60 * 1000).toISOString();
    const token = `conf-${currentClient.name.toLowerCase().replace(/[^a-z0-9]/g, '')}-${Math.floor(100 + Math.random() * 900)}`;

    const newBox: CondicionalBox = {
      id: `cond-${Date.now()}`,
      code: `COND-2026-${Math.floor(100 + Math.random() * 900)}`,
      clientId: currentClient.id,
      clientName: currentClient.name,
      clientPhone: currentClient.phone,
      clientAddress: `${currentClient.address}, ${currentClient.neighborhood} - ${currentClient.city}`,
      curatorName,
      status: 'RASCUNHO', // Requirement: Estados iniciam em RASCUNHO (curador monta seleção)
      items,
      totalValue,
      soldValue: 0,
      createdAt: new Date().toISOString(),
      testDurationDays: testDays,
      deadlineDate: deadline,
      daysRemaining: testDays,
      hoursRemaining: testDays * 24,
      deliveryMethod,
      notes: notes || `Curadoria sob medida para ${currentClient.name} (${currentClient.style.lifestyle}).`,
      confirmationToken: token,
      isConfirmedByClient: false,
      whatsappLog: [],
      reminders: {
        day3Sent: false,
        day6Sent: false,
        curatorAlertSent: false
      }
    };

    onCreateBox(newBox);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-sm overflow-y-auto">
      <div className="bg-[#10141d] border border-[#263145] w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-5 py-4 border-b border-[#212a3b] bg-[#141924] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#c99738]/20 border border-[#c99738]/40 flex items-center justify-center text-[#c99738]">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-semibold text-white">Montador de Mala Condicional VIP</h2>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#c99738]/20 text-[#c99738] border border-[#c99738]/40">
                  Estado: Rascunho & Reserva de Estoque
                </span>
              </div>
              <p className="text-xs text-neutral-400">
                Arraste as peças do catálogo para a mala ou adicione com 1 clique no tamanho exato do cliente
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

        {/* Form Body */}
        <div className="p-5 overflow-y-auto space-y-5 flex-1 text-xs">
          {/* Step 1: Client Selection & 360 Profile Summary */}
          <div className="bg-[#141923] p-4 rounded-xl border border-[#20293a] space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <label className="font-semibold text-neutral-200 flex items-center gap-1.5">
                <User className="w-4 h-4 text-[#c99738]" />
                <span>1. Cliente Ravi's (Perfil 360° Carregado):</span>
              </label>

              <select
                value={selectedClientId}
                onChange={(e) => setSelectedClientId(e.target.value)}
                className="bg-[#0b0e14] border border-[#283449] rounded-lg px-3 py-2 text-white font-medium focus:outline-none focus:border-[#c99738]"
              >
                {clients.map(client => (
                  <option key={client.id} value={client.id}>
                    {client.name} — {client.tier} ({client.city})
                  </option>
                ))}
              </select>
            </div>

            {/* Anthropometric & Style Card */}
            {currentClient && (
              <div className="bg-[#0b0e14] p-3 rounded-lg border border-[#1b2333] grid grid-cols-2 sm:grid-cols-4 gap-3 text-neutral-300">
                <div>
                  <span className="text-neutral-400 block text-[11px]">Camisa / Blazer:</span>
                  <span className="font-semibold text-[#f0cf7e] text-sm">Tam {currentClient.sizes.shirt}</span>
                </div>
                <div>
                  <span className="text-neutral-400 block text-[11px]">Calça / Bermuda:</span>
                  <span className="font-semibold text-[#f0cf7e] text-sm">Tam {currentClient.sizes.pants}</span>
                </div>
                <div>
                  <span className="text-neutral-400 block text-[11px]">Calçado / Sapato:</span>
                  <span className="font-semibold text-[#f0cf7e] text-sm">Nº {currentClient.sizes.shoes}</span>
                </div>
                <div>
                  <span className="text-neutral-400 block text-[11px]">Caimento Preferido:</span>
                  <span className="font-semibold text-emerald-400 text-xs">{currentClient.sizes.fitPreference}</span>
                </div>
                <div className="col-span-2 sm:col-span-4 pt-1 border-t border-[#192231] flex flex-wrap items-center gap-2 text-[11px]">
                  <span className="text-neutral-400">Paleta Favorita:</span>
                  {currentClient.style.palette.map((color, idx) => (
                    <span key={idx} className="px-2 py-0.5 rounded bg-[#171e2c] border border-[#253045] text-neutral-200">
                      {color}
                    </span>
                  ))}
                  <span className="text-neutral-400 ml-2">Taxa Conversão Histórica:</span>
                  <strong className="text-emerald-400">
                    {currentClient.metrics.condicionalConversionRate}%
                  </strong>
                </div>
              </div>
            )}
          </div>

          {/* Step 2: Catalog Drag & Drop Source with Client Size Auto-Match */}
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <label className="font-semibold text-neutral-200 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-[#c99738]" />
                <span>2. Catálogo Limitado (Arraste a peça ou clique em + Adicionar):</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer bg-[#171d29] px-2.5 py-1 rounded-lg border border-[#273244] text-[11px] text-neutral-300">
                <input
                  type="checkbox"
                  checked={filterBySizeOnly}
                  onChange={(e) => setFilterBySizeOnly(e.target.checked)}
                  className="rounded accent-[#c99738]"
                />
                <span>Auto-sugerir no tamanho exato do cliente ({currentClient?.sizes.shirt} / {currentClient?.sizes.pants} / {currentClient?.sizes.shoes})</span>
              </label>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 max-h-60 overflow-y-auto p-1">
              {products.map(product => {
                const targetSize = getClientSizeForProduct(product.category);
                const stockObj = product.stockBySize[targetSize];
                const availableCount = stockObj ? stockObj.available : 0;
                const reservedCount = stockObj ? stockObj.reserved : 0;
                const isSelected = selectedProductEntries.some(
                  entry => entry.product.id === product.id && entry.size === targetSize
                );

                return (
                  <div 
                    key={product.id}
                    draggable={availableCount > 0 && !isSelected}
                    onDragStart={(e) => handleDragStart(e, product, targetSize)}
                    className={`p-2.5 rounded-xl border transition-all flex flex-col justify-between cursor-grab active:cursor-grabbing ${
                      isSelected 
                        ? 'bg-[#18231c] border-emerald-600/60 shadow-sm opacity-90' 
                        : availableCount > 0
                        ? 'bg-[#121620] border-[#222a3b] hover:border-[#35435c] hover:bg-[#151b27]'
                        : 'bg-[#0e1117] border-[#1a202c] opacity-50'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-mono text-neutral-400">{product.code}</span>
                        <div className="flex items-center gap-1">
                          {reservedCount > 0 && (
                            <span className="text-amber-400 font-mono text-[10px] flex items-center gap-0.5" title="Peças bloqueadas em outros condicionais">
                              <Lock className="w-2.5 h-2.5" /> {reservedCount} res.
                            </span>
                          )}
                          <span className="text-emerald-400 font-mono text-[10px]">
                            {availableCount > 0 ? `${availableCount} disp.` : 'Esgotado'}
                          </span>
                        </div>
                      </div>

                      {/* Photo Thumbnail + Title */}
                      <div className="flex items-center gap-2 mt-1.5">
                        <div className="w-12 h-12 rounded-lg bg-[#1a2230] overflow-hidden shrink-0 border border-[#273449]">
                          <img 
                            src={product.imageUrl} 
                            alt={product.title} 
                            className="w-full h-full object-cover" 
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-white text-xs truncate">{product.title}</div>
                          <div className="text-[10px] text-neutral-400 truncate">{product.material}</div>
                          <div className="text-[10px] text-[#c99738]">{product.category} • Tam {targetSize}</div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-[#1c2433] mt-2">
                      <span className="font-semibold text-[#f0cf7e] text-xs">
                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.price)}
                      </span>

                      {isSelected ? (
                        <span className="flex items-center gap-1 text-[11px] text-emerald-400 font-medium">
                          <Check className="w-3.5 h-3.5" /> Na Mala ({targetSize})
                        </span>
                      ) : (
                        <button
                          type="button"
                          disabled={availableCount <= 0}
                          onClick={() => handleAddProduct(product, targetSize)}
                          className="px-2.5 py-1 rounded bg-[#1e2636] hover:bg-[#283348] border border-[#2d3a52] text-white text-[11px] font-medium flex items-center gap-1 disabled:opacity-40"
                        >
                          <Plus className="w-3 h-3 text-[#c99738]" /> Add ({targetSize})
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Step 3: Interactive DropZone & Live Total Value */}
          <div 
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`p-3.5 rounded-xl border transition-all space-y-2.5 ${
              isDragOver 
                ? 'bg-[#18231c] border-emerald-500 border-dashed scale-[1.01]' 
                : 'bg-[#0b0e14] border-[#1e2637]'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-semibold text-white flex items-center gap-2">
                <Package className="w-4 h-4 text-[#c99738]" />
                <span>3. Peças na Mala Condicional ({selectedProductEntries.length})</span>
                <span className="text-[10px] text-neutral-400 font-normal hidden sm:inline">(ou arraste peças aqui)</span>
              </span>
              <div className="text-right">
                <span className="text-neutral-400 text-[11px] mr-2">Valor Total em Trânsito:</span>
                <span className="font-serif text-base font-bold text-[#f5d061]">
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalValue)}
                </span>
              </div>
            </div>

            {selectedProductEntries.length === 0 ? (
              <div className="text-center py-6 text-neutral-400 text-xs border border-dashed border-[#1a2130] rounded-xl flex flex-col items-center justify-center gap-1.5">
                <GripVertical className="w-5 h-5 text-neutral-500" />
                <span className="font-medium text-neutral-300">Nenhuma peça adicionada ainda.</span>
                <span className="text-[11px] text-neutral-400">Arraste as peças do catálogo acima para esta área ou clique em "+ Add".</span>
              </div>
            ) : (
              <div className="space-y-1.5 max-h-40 overflow-y-auto">
                {selectedProductEntries.map((entry, idx) => (
                  <div key={idx} className="flex items-center justify-between bg-[#121620] px-3 py-2 rounded-lg border border-[#202838]">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-md bg-[#18202d] overflow-hidden shrink-0 border border-[#273449]">
                        <img 
                          src={entry.product.imageUrl} 
                          alt={entry.product.title} 
                          className="w-full h-full object-cover" 
                        />
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono text-[10px] text-neutral-400">{entry.product.code}</span>
                          <span className="text-white font-medium">{entry.product.title}</span>
                          <span className="px-1.5 py-0.2 rounded bg-[#1c2433] text-amber-300 font-mono text-[10px]">
                            Tam {entry.size}
                          </span>
                        </div>
                        <span className="text-[10px] text-neutral-400">{entry.product.material}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="font-semibold text-[#f0cf7e]">
                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(entry.product.price)}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemoveProduct(idx)}
                        className="text-neutral-400 hover:text-red-400 transition-colors p-1"
                        title="Remover peça"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Step 4: Dispatch Details & Options */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-neutral-300 font-medium block mb-1">Método de Envio em Canoinhas:</label>
              <select
                value={deliveryMethod}
                onChange={(e: any) => setDeliveryMethod(e.target.value)}
                className="w-full bg-[#141923] border border-[#273245] rounded-lg px-2.5 py-2 text-white focus:outline-none focus:border-[#c99738]"
              >
                <option value="Entrega VIP Motorista Ravi's">Entrega VIP Motorista Ravi's (Canoinhas/Três Barras)</option>
                <option value="Retirada na Loja Canoinhas">Retirada na Loja Física (Centro Canoinhas)</option>
                <option value="Sedex Express Planalto Norte">Sedex Express (Mafra / Porto União)</option>
              </select>
            </div>

            <div>
              <label className="text-neutral-300 font-medium block mb-1">Prazo de Prova em Casa (Padrão 7 dias):</label>
              <select
                value={testDays}
                onChange={(e) => setTestDays(Number(e.target.value))}
                className="w-full bg-[#141923] border border-[#273245] rounded-lg px-2.5 py-2 text-white focus:outline-none focus:border-[#c99738]"
              >
                <option value={3}>3 dias (Ajuste rápido de evento)</option>
                <option value={5}>5 dias (Meio de semana)</option>
                <option value={7}>7 dias (Padrão Oficial Ravi's Premium)</option>
                <option value={10}>10 dias (Cliente VIP Platinum estendido)</option>
              </select>
            </div>

            <div>
              <label className="text-neutral-300 font-medium block mb-1">Curador Responsável:</label>
              <select
                value={curatorName}
                onChange={(e) => setCuratorName(e.target.value)}
                className="w-full bg-[#141923] border border-[#273245] rounded-lg px-2.5 py-2 text-white focus:outline-none focus:border-[#c99738]"
              >
                <option value="Mateus (Consultor Sênior)">Mateus (Consultor Sênior)</option>
                <option value="Juliana (Consultora VIP)">Juliana (Consultora VIP)</option>
                <option value="Ravi (Curador-Chefe)">Ravi (Curador-Chefe)</option>
              </select>
            </div>
          </div>

          {/* Curatorial Notes */}
          <div>
            <label className="text-neutral-300 font-medium block mb-1">Observações da Seleção de Peças:</label>
            <input
              type="text"
              placeholder="Ex: Peças para evento de posse e casamento diurno. Foco em linho e blazer desestruturado."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-[#141923] border border-[#273245] rounded-lg px-3 py-2 text-white placeholder-neutral-500 focus:outline-none focus:border-[#c99738]"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3.5 border-t border-[#20293b] bg-[#141924] flex items-center justify-between">
          <div className="text-neutral-400 text-xs">
            {selectedProductEntries.length} {selectedProductEntries.length === 1 ? 'peça selecionada' : 'peças selecionadas'} • Bloqueio de estoque automático ativado
          </div>

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
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-[#c99738] to-[#b3822b] hover:from-[#d6a544] hover:to-[#be8d35] text-black font-semibold shadow-md shadow-[#c99738]/20 flex items-center gap-1.5 transition-all"
            >
              <Package className="w-4 h-4" />
              <span>Salvar Seleção em Rascunho</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
