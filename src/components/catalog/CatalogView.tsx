import React, { useState } from 'react';
import { Product, ProductCategory } from '../../types/crm';
import { PomelliPhotoshootImportModal } from './PomelliPhotoshootImportModal';
import { 
  Layers, 
  Search, 
  Plus, 
  Tag, 
  AlertTriangle, 
  CheckCircle2, 
  Sparkles,
  Scissors,
  Package,
  Camera,
  Lock,
  Flame,
  TrendingUp,
  Percent,
  Check
} from 'lucide-react';

interface CatalogViewProps {
  products: Product[];
  onOpenNewProductModal: () => void;
  onOpenNewCondicional: () => void;
  onBatchImportPomelli?: (imported: Product[]) => void;
}

export const CatalogView: React.FC<CatalogViewProps> = ({
  products,
  onOpenNewProductModal,
  onOpenNewCondicional,
  onBatchImportPomelli
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [isPomelliModalOpen, setIsPomelliModalOpen] = useState(false);

  const categoriesList: { id: string; label: string }[] = [
    { id: 'ALL', label: 'Todas as Peças' },
    { id: 'Camiseta Slim', label: 'Camiseta Slim' },
    { id: 'Camiseta Longline', label: 'Camiseta Longline' },
    { id: 'Tricô', label: 'Tricô & Malharia' },
    { id: 'Sobretudo', label: 'Sobretudo & Casacos' },
    { id: 'Cachecol', label: 'Cachecol & Acessórios' },
    { id: 'Calça', label: 'Calça de Alfaiataria' },
    { id: 'Camisas', label: 'Camisas Linho' },
    { id: 'Blazers', label: 'Blazers Napolitanos' },
    { id: 'Calçados', label: 'Calçados & Loafers' }
  ];

  const filteredProducts = products.filter(p => {
    const matchesSearch = 
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.material.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.color.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = categoryFilter === 'ALL' || p.category === categoryFilter;

    return matchesSearch && matchesCategory;
  });

  // Calculate stock KPIs
  const totalStockUnits = products.reduce((acc, p) => 
    acc + Object.values(p.stockBySize).reduce((sAcc, s) => sAcc + s.total, 0), 0
  );
  const totalReservedUnits = products.reduce((acc, p) => 
    acc + Object.values(p.stockBySize).reduce((sAcc, s) => sAcc + s.reserved, 0), 0
  );
  const totalAvailableUnits = products.reduce((acc, p) => 
    acc + Object.values(p.stockBySize).reduce((sAcc, s) => sAcc + s.available, 0), 0
  );

  // Critical stock counts
  const lastUnitsCount = products.filter(p => {
    const avail = Object.values(p.stockBySize).reduce((acc, s) => acc + s.available, 0);
    return avail === 1;
  }).length;

  const lowStockCount = products.filter(p => {
    const avail = Object.values(p.stockBySize).reduce((acc, s) => acc + s.available, 0);
    return avail > 1 && avail <= 3;
  }).length;

  const handleImportPomelliProducts = (imported: Product[]) => {
    if (onBatchImportPomelli) {
      onBatchImportPomelli(imported);
    }
  };

  return (
    <div className="space-y-4">
      {/* Top Banner & Quick KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-[#11141c] p-3.5 rounded-xl border border-[#1e2533] flex items-center justify-between">
          <div>
            <span className="text-[11px] text-neutral-400 block font-medium">Acervo Total de Peças</span>
            <span className="font-serif text-2xl font-bold text-white">{totalStockUnits} un.</span>
            <span className="text-[10px] text-neutral-400 block mt-0.5">{products.length} modelos exclusivos</span>
          </div>
          <div className="w-10 h-10 rounded-lg bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
            <Layers className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-[#11141c] p-3.5 rounded-xl border border-[#1e2533] flex items-center justify-between">
          <div>
            <span className="text-[11px] text-neutral-400 block font-medium">Bloqueado em Condicional</span>
            <span className="font-serif text-2xl font-bold text-amber-400">{totalReservedUnits} un.</span>
            <span className="text-[10px] text-amber-300 block mt-0.5">🔒 Em prova nos lares</span>
          </div>
          <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Lock className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-[#11141c] p-3.5 rounded-xl border border-[#1e2533] flex items-center justify-between">
          <div>
            <span className="text-[11px] text-neutral-400 block font-medium">Última Unidade (Alerta Crítico)</span>
            <span className="font-serif text-2xl font-bold text-rose-400">{lastUnitsCount} modelos</span>
            <span className="text-[10px] text-rose-300 block mt-0.5">🔴 Apenas 1 no estoque</span>
          </div>
          <div className="w-10 h-10 rounded-lg bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
            <Flame className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-[#11141c] p-3.5 rounded-xl border border-[#1e2533] flex items-center justify-between">
          <div>
            <span className="text-[11px] text-neutral-400 block font-medium">Disponível Pronta Entrega</span>
            <span className="font-serif text-2xl font-bold text-emerald-400">{totalAvailableUnits} un.</span>
            <span className="text-[10px] text-neutral-400 block mt-0.5">Loja física & E-commerce</span>
          </div>
          <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Top Search, Category Filter and Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#11141c] p-3 rounded-xl border border-[#1e2533]">
        <div className="flex items-center gap-2 flex-1">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar por código, título, tecido nobre, cor ou photoshoot..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#0d1017] border border-[#232a3a] rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder-neutral-400 focus:outline-none focus:border-[#c99738]"
            />
          </div>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-[#0d1017] border border-[#232a3a] rounded-lg px-2.5 py-2 text-xs text-neutral-300 focus:outline-none focus:border-[#c99738]"
          >
            {categoriesList.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.label}</option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          {/* Photoshoot Pomelli Import Button */}
          <button
            onClick={() => setIsPomelliModalOpen(true)}
            className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-[#182333] hover:bg-[#202e42] border border-[#2b3a50] text-[#f0cf7e] text-xs font-semibold transition-all shadow-sm"
            title="Importar fotografias e peças do Photoshoot do Pomelli"
          >
            <Camera className="w-4 h-4 text-[#c99738]" />
            <span>Photoshoot do Pomelli</span>
          </button>

          <button
            onClick={onOpenNewProductModal}
            className="flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-lg bg-gradient-to-r from-[#c99738] to-[#b3822b] hover:from-[#d6a544] hover:to-[#be8d35] text-black text-xs font-semibold transition-all shadow-md shadow-[#c99738]/20"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>+ Cadastrar Peça</span>
          </button>
        </div>
      </div>

      {/* Category Pills Filter */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
        {categoriesList.map(cat => (
          <button
            key={cat.id}
            onClick={() => setCategoryFilter(cat.id)}
            className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-all ${
              categoryFilter === cat.id
                ? 'bg-[#c99738] text-black font-semibold shadow-sm'
                : 'bg-[#10141d] text-neutral-400 hover:text-white border border-[#1e2533]'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Catalog Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredProducts.map(product => {
          // Calculate totals
          const totalStock = Object.values(product.stockBySize).reduce((acc, s) => acc + s.total, 0);
          const reservedStock = Object.values(product.stockBySize).reduce((acc, s) => acc + s.reserved, 0);
          const availableStock = Object.values(product.stockBySize).reduce((acc, s) => acc + s.available, 0);

          // Profit margin
          const margin = product.price > 0 
            ? Math.round(((product.price - product.costPrice) / product.price) * 100) 
            : 0;

          // Critical Stock flags
          const isLastUnit = availableStock === 1;
          const isLowStock = availableStock > 1 && availableStock <= 2;
          const isSoldOut = availableStock === 0 && reservedStock === 0;

          return (
            <div 
              key={product.id}
              className={`bg-[#10141d] rounded-2xl border transition-all p-4 flex flex-col justify-between shadow-md group ${
                isLastUnit 
                  ? 'border-rose-700/60 shadow-rose-950/20' 
                  : isLowStock 
                  ? 'border-amber-600/50' 
                  : 'border-[#1f2637] hover:border-[#2f3b52]'
              }`}
            >
              <div>
                {/* Header Tag and Critical Badges */}
                <div className="flex items-center justify-between text-xs gap-1">
                  <span className="font-mono text-neutral-400 font-medium">{product.code}</span>
                  
                  <div className="flex items-center gap-1">
                    {isLastUnit && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/20 border border-rose-500/50 text-rose-300 flex items-center gap-1 animate-pulse">
                        <Flame className="w-3 h-3" /> ÚLTIMA UNIDADE
                      </span>
                    )}

                    {isLowStock && !isLastUnit && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 border border-amber-500/40 text-amber-300 flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" /> ESTOQUE BAIXO
                      </span>
                    )}

                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#1a2332] border border-[#27354c] text-neutral-300">
                      {product.category}
                    </span>
                  </div>
                </div>

                {/* Photo Thumbnail + Title */}
                <div className="mt-3 flex gap-3">
                  <div className="w-20 h-24 rounded-xl bg-[#18202e] overflow-hidden shrink-0 border border-[#242f42] relative">
                    {product.imageUrl ? (
                      <img 
                        src={product.imageUrl} 
                        alt={product.title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-neutral-500">
                        <Package className="w-6 h-6" />
                      </div>
                    )}
                    {reservedStock > 0 && (
                      <span className="absolute bottom-1 right-1 px-1.5 py-0.2 rounded bg-black/80 font-mono text-[9px] text-amber-300 flex items-center gap-0.5" title="Reservado em condicional">
                        <Lock className="w-2.5 h-2.5" /> {reservedStock}
                      </span>
                    )}
                  </div>

                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <h3 className="font-serif font-bold text-white text-sm line-clamp-1 group-hover:text-[#c99738] transition-colors">
                        {product.title}
                      </h3>
                      <p className="text-[11px] text-neutral-400 mt-0.5 truncate">{product.material}</p>
                      <p className="text-[10px] text-amber-300/90 font-medium mt-0.5">Cor: {product.color} • {product.fitType}</p>
                    </div>

                    {product.photoshootSource && (
                      <span className="inline-flex items-center gap-1 text-[9px] text-neutral-400 font-mono bg-[#151c27] px-1.5 py-0.5 rounded border border-[#212c3f] truncate">
                        <Camera className="w-2.5 h-2.5 text-[#c99738]" />
                        <span className="truncate">{product.photoshootSource.split(' - ')[0]}</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Pricing & Gross Margin */}
                <div className="bg-[#0c0f16] p-2.5 rounded-xl border border-[#1b2332] mt-3 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-[10px] text-neutral-400 block">Preço de Venda:</span>
                    <span className="font-serif font-bold text-[#f0cf7e] text-sm">
                      {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.price)}
                    </span>
                  </div>

                  <div className="text-center">
                    <span className="text-[10px] text-neutral-400 block">Custo Unitário:</span>
                    <span className="font-mono text-neutral-300 text-xs">
                      {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.costPrice)}
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] text-neutral-400 block">Margem Bruta:</span>
                    <span className="font-mono font-bold text-emerald-400 text-xs">
                      {margin}% ({new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.price - product.costPrice)})
                    </span>
                  </div>
                </div>

                {/* Stock Matrix by Size (Strictly limited 1-3 units per SKU) */}
                <div className="mt-3 space-y-1.5">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-medium text-neutral-300">Grade & Estoque por Tamanho:</span>
                    <div className="flex items-center gap-2 text-[10px]">
                      <span className="text-emerald-400 font-mono">{availableStock} disp.</span>
                      {reservedStock > 0 && <span className="text-amber-400 font-mono">({reservedStock} em teste)</span>}
                    </div>
                  </div>

                  <div className="grid grid-cols-4 sm:grid-cols-5 gap-1.5">
                    {Object.entries(product.stockBySize).map(([size, stock]) => {
                      const isZero = stock.available === 0 && stock.reserved === 0;
                      const hasReserved = stock.reserved > 0;
                      const isSingle = stock.available === 1;

                      return (
                        <div 
                          key={size}
                          className={`p-1.5 rounded-lg border text-center transition-all ${
                            isZero 
                              ? 'bg-[#0d1017] border-[#181f2b] opacity-40 text-neutral-500'
                              : isSingle
                              ? 'bg-rose-950/30 border-rose-800/40 text-rose-300'
                              : hasReserved
                              ? 'bg-[#181f2d] border-amber-600/40 text-amber-200'
                              : 'bg-[#131722] border-[#222c3d] text-neutral-200'
                          }`}
                        >
                          <span className="block font-bold font-mono text-[11px]">{size}</span>
                          <span className="block text-[9px] font-mono mt-0.5">
                            {stock.available > 0 ? (
                              <span className="text-emerald-400 font-semibold">{stock.available} un</span>
                            ) : hasReserved ? (
                              <span className="text-amber-400 font-medium">🔒 {stock.reserved}</span>
                            ) : (
                              '0'
                            )}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-[#1a2333] mt-3 flex items-center justify-between gap-2">
                <span className="text-[10px] text-neutral-400 font-mono">
                  {totalStock} un. produzidas
                </span>

                <button
                  type="button"
                  onClick={onOpenNewCondicional}
                  disabled={availableStock === 0}
                  className="px-3 py-1.5 rounded-lg bg-[#182333] hover:bg-[#223147] text-[#f0cf7e] border border-[#2a384e] text-xs font-semibold flex items-center gap-1.5 transition-all disabled:opacity-40"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Enviar em Mala</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Pomelli Import Modal */}
      <PomelliPhotoshootImportModal
        isOpen={isPomelliModalOpen}
        onClose={() => setIsPomelliModalOpen(false)}
        onImportProducts={handleImportPomelliProducts}
      />
    </div>
  );
};
