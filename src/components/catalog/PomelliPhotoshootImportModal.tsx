import React, { useState } from 'react';
import { Product } from '../../types/crm';
import { POMELI_PHOTOSHOOT_BATCH } from '../../data/initialData';
import { 
  X, 
  Camera, 
  Sparkles, 
  Check, 
  Layers, 
  Tag, 
  CheckCheck,
  AlertCircle,
  Download
} from 'lucide-react';

interface PomelliPhotoshootImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportProducts: (products: Product[]) => void;
}

export const PomelliPhotoshootImportModal: React.FC<PomelliPhotoshootImportModalProps> = ({
  isOpen,
  onClose,
  onImportProducts
}) => {
  const [selectedIds, setSelectedIds] = useState<string[]>(POMELI_PHOTOSHOOT_BATCH.map(p => p.id));
  const [isImporting, setIsImporting] = useState(false);
  const [importSuccess, setImportSuccess] = useState(false);

  if (!isOpen) return null;

  const handleToggleSelect = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleImport = () => {
    setIsImporting(true);
    setTimeout(() => {
      const toImport = POMELI_PHOTOSHOOT_BATCH.filter(p => selectedIds.includes(p.id));
      onImportProducts(toImport);
      setIsImporting(false);
      setImportSuccess(true);
      setTimeout(() => {
        setImportSuccess(false);
        onClose();
      }, 1200);
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-sm overflow-y-auto">
      <div className="bg-[#10141d] border border-[#273245] w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-5 py-4 border-b border-[#212a3b] bg-[#141924] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#c99738]/20 border border-[#c99738]/40 flex items-center justify-center text-[#c99738]">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-semibold text-white">Importador: Photoshoot do Pomelli</h2>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#c99738]/20 text-[#c99738] border border-[#c99738]/40">
                  Editorial Exclusivo Canoinhas
                </span>
              </div>
              <p className="text-xs text-neutral-400">
                Sincronize as fotografias editoriais de alta resolução e cadastre peças com tiragem limitada (1-3 unidades por SKU)
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
          <div className="bg-[#141923] p-3 rounded-xl border border-[#20293a] flex items-center justify-between">
            <div className="flex items-center gap-2 text-neutral-300">
              <Sparkles className="w-4 h-4 text-[#c99738]" />
              <span>Ensaio gravado na Serra e no Centro Histórico de Canoinhas pela equipe do Pomelli.</span>
            </div>
            <span className="text-xs text-amber-400 font-mono font-medium">
              {selectedIds.length} de {POMELI_PHOTOSHOOT_BATCH.length} selecionadas
            </span>
          </div>

          {/* Photoshoot Batch Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            {POMELI_PHOTOSHOOT_BATCH.map(product => {
              const isSelected = selectedIds.includes(product.id);
              const totalStock = Object.values(product.stockBySize).reduce((acc, s) => acc + s.total, 0);

              return (
                <div 
                  key={product.id}
                  onClick={() => handleToggleSelect(product.id)}
                  className={`rounded-xl border transition-all cursor-pointer overflow-hidden flex flex-col justify-between ${
                    isSelected 
                      ? 'bg-[#121c17] border-emerald-600/70 shadow-md ring-1 ring-emerald-500/40' 
                      : 'bg-[#121620] border-[#222a3b] opacity-60 hover:opacity-100'
                  }`}
                >
                  <div className="h-44 w-full bg-[#18202e] relative overflow-hidden">
                    <img 
                      src={product.imageUrl} 
                      alt={product.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform" 
                    />
                    <div className="absolute top-2 right-2">
                      <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                        isSelected ? 'bg-emerald-500 text-black shadow-md' : 'bg-black/70 text-neutral-400 border border-neutral-600'
                      }`}>
                        {isSelected ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : ''}
                      </span>
                    </div>

                    <div className="absolute bottom-2 left-2">
                      <span className="px-2 py-0.5 rounded bg-black/80 backdrop-blur-xs text-[10px] font-mono text-[#f0cf7e] border border-white/10">
                        {totalStock} un. limitadas
                      </span>
                    </div>
                  </div>

                  <div className="p-3 space-y-2 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between text-[10px] text-neutral-400">
                        <span className="font-mono">{product.code}</span>
                        <span className="text-amber-300 font-semibold">{product.category}</span>
                      </div>
                      <h4 className="font-semibold text-white text-xs mt-0.5 line-clamp-1">{product.title}</h4>
                      <p className="text-[10px] text-neutral-400 line-clamp-2 mt-1">{product.description}</p>
                    </div>

                    <div className="pt-2 border-t border-[#1b2332] flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-neutral-400 block">Preço de Venda:</span>
                        <span className="font-serif font-bold text-[#f5d061] text-xs">
                          {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.price)}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] text-neutral-400 block">Custo:</span>
                        <span className="text-neutral-300 font-mono text-[11px]">
                          {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.costPrice)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3.5 border-t border-[#20293b] bg-[#141924] flex items-center justify-between">
          <span className="text-xs text-neutral-400">
            Peças importadas entrarão com estoque exclusivo por tamanho no catálogo ativo.
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
              onClick={handleImport}
              disabled={selectedIds.length === 0 || isImporting}
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-[#c99738] to-[#b3822b] hover:from-[#d6a544] hover:to-[#be8d35] text-black font-semibold shadow-md shadow-[#c99738]/20 flex items-center gap-2 transition-all disabled:opacity-50"
            >
              {importSuccess ? (
                <>
                  <CheckCheck className="w-4 h-4" />
                  <span>Importado com Sucesso!</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>Importar {selectedIds.length} Peças Selecionadas</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
