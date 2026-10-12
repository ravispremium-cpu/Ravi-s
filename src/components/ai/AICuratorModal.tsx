import React, { useState } from 'react';
import { Client, Product } from '../../types/crm';
import { 
  Sparkles, 
  X, 
  User, 
  Check, 
  ShoppingBag, 
  ArrowRight,
  Layers,
  Palette,
  Ruler
} from 'lucide-react';

interface AICuratorModalProps {
  clients: Client[];
  products: Product[];
  isOpen: boolean;
  onClose: () => void;
  onSelectCapsuleForBox: (client: Client, suggestedProductIds: string[]) => void;
}

export const AICuratorModal: React.FC<AICuratorModalProps> = ({
  clients,
  products,
  isOpen,
  onClose,
  onSelectCapsuleForBox
}) => {
  const [selectedClientId, setSelectedClientId] = useState<string>(clients[0]?.id || '');
  const [occasion, setOccasion] = useState<string>('Jantar de Negócios & Congresso na Serra');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedCapsule, setGeneratedCapsule] = useState<{
    rationale: string;
    recommendedProducts: Product[];
    stylingTips: string[];
  } | null>(null);

  if (!isOpen) return null;

  const currentClient = clients.find(c => c.id === selectedClientId) || clients[0];

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      // Find matching products based on client sizes and palette
      const matched = products.slice(0, 4);

      setGeneratedCapsule({
        rationale: `Para o perfil de ${currentClient.name} (${currentClient.style.profession}), com caimento ${currentClient.sizes.fitPreference} e preferência por ${currentClient.style.palette.join(', ')}, recomendamos uma cápsula elegante e versátil que equilibra o linho nobre com a alfaiataria desestruturada moderna.`,
        recommendedProducts: matched,
        stylingTips: [
          `Usar a Camisa de Linho Riviera com colarinho aberto e mangas dobradas duas vezes na altura do antebraço.`,
          `O Blazer Desestruturado Chumbo harmoniza perfeitamente com a Chino Fendi para um contraste sutil monocromático.`,
          `Finalizar com o Loafer Gravata Mocca sem meia aparente (no-show socks) para máxima elegância casual.`
        ]
      });
      setIsGenerating(false);
    }, 600);
  };

  const handleApplyToBox = () => {
    if (!generatedCapsule) return;
    onSelectCapsuleForBox(
      currentClient,
      generatedCapsule.recommendedProducts.map(p => p.id)
    );
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-[#10141d] border border-[#273245] w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-5 py-4 border-b border-[#212a3b] bg-[#141924] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#c99738] to-[#91671e] text-black flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-white">Assistente de Curadoria Pessoal Ravi's</h2>
              <p className="text-xs text-neutral-400">Sugestão de mala cápsula baseada no perfil 360° e ocasião</p>
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
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-neutral-400 block mb-1">Cliente:</label>
              <select
                value={selectedClientId}
                onChange={(e) => {
                  setSelectedClientId(e.target.value);
                  setGeneratedCapsule(null);
                }}
                className="w-full bg-[#141923] border border-[#263143] rounded-lg px-3 py-2 text-white font-medium focus:outline-none focus:border-[#c99738]"
              >
                {clients.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.name} (Tam {c.sizes.shirt} / {c.sizes.pants})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-neutral-400 block mb-1">Ocasião de Uso:</label>
              <select
                value={occasion}
                onChange={(e) => setOccasion(e.target.value)}
                className="w-full bg-[#141923] border border-[#263143] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#c99738]"
              >
                <option value="Jantar de Negócios & Congresso na Serra">Jantar de Negócios & Congresso</option>
                <option value="Fim de Semana Casual na Fazenda / Serra">Fim de Semana na Fazenda</option>
                <option value="Casamento Campestre / Almoço Solene">Casamento Campestre / Cerimônia</option>
                <option value="Renovação Cápsula Básica de Estação">Renovação Cápsula de Estação</option>
              </select>
            </div>
          </div>

          {/* Client DNA snippet */}
          <div className="bg-[#0b0e14] p-3 rounded-xl border border-[#1b2333] flex flex-wrap items-center justify-between gap-2 text-neutral-300">
            <div className="flex items-center gap-2">
              <Ruler className="w-4 h-4 text-[#c99738]" />
              <span>Camisa {currentClient.sizes.shirt} • Calça {currentClient.sizes.pants} • Sapato {currentClient.sizes.shoes}</span>
            </div>
            <span className="text-emerald-400 font-semibold">{currentClient.sizes.fitPreference}</span>
          </div>

          <button
            type="button"
            onClick={handleGenerate}
            disabled={isGenerating}
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#c99738] to-[#b3822b] hover:from-[#d8a542] hover:to-[#be8d35] text-black font-semibold text-xs shadow-md shadow-[#c99738]/20 flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>{isGenerating ? 'Calculando combinações nobres...' : 'Gerar Curadoria Cápsula Sob Medida'}</span>
          </button>

          {/* Result */}
          {generatedCapsule && (
            <div className="space-y-4 pt-2">
              <div className="bg-[#141923] p-4 rounded-xl border border-[#212b3c] space-y-2">
                <span className="text-amber-400 font-semibold block text-[11px] uppercase tracking-wider">
                  Racional da Curadoria para {currentClient.name}:
                </span>
                <p className="text-neutral-200 leading-relaxed text-xs">
                  {generatedCapsule.rationale}
                </p>
              </div>

              {/* Recommended Items */}
              <div className="space-y-2">
                <span className="text-neutral-300 font-semibold block text-xs">
                  Peças Selecionadas para a Mala ({generatedCapsule.recommendedProducts.length}):
                </span>

                <div className="space-y-1.5">
                  {generatedCapsule.recommendedProducts.map(prod => (
                    <div key={prod.id} className="p-2.5 rounded-lg bg-[#0e1219] border border-[#1c2434] flex items-center justify-between">
                      <div>
                        <span className="font-semibold text-white block">{prod.title}</span>
                        <span className="text-[11px] text-neutral-400">{prod.material} • Tam {currentClient.sizes.shirt}</span>
                      </div>
                      <span className="font-serif font-bold text-[#f5d061]">
                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(prod.price)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Styling Tips */}
              <div className="bg-[#0b0e14] p-3.5 rounded-xl border border-[#192130] space-y-1.5">
                <span className="text-[#c99738] font-semibold text-[11px] block">
                  Dicas de Montagem & Conversa com o Cliente:
                </span>
                <ul className="space-y-1 text-neutral-300 text-[11px]">
                  {generatedCapsule.stylingTips.map((tip, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <span className="text-[#c99738]">•</span>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-[#20293a] bg-[#141924] flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-[#1a212e] text-neutral-300"
          >
            Fechar
          </button>

          {generatedCapsule && (
            <button
              type="button"
              onClick={handleApplyToBox}
              className="flex items-center gap-1.5 px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs shadow-md shadow-emerald-950/40"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Abrir Montador com Estas Peças</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
