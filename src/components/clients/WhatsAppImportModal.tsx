import React, { useState } from 'react';
import { Client, SizeShirt, SizePants, SizeShoes, FitPreference, StyleTag } from '../../types/crm';
import { 
  X, 
  Phone, 
  Check, 
  Users, 
  Upload, 
  Sparkles, 
  MessageSquare, 
  ShieldCheck,
  Search,
  CheckSquare,
  Square
} from 'lucide-react';

interface WhatsAppImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportClients: (newClients: Client[]) => void;
}

interface WhatsAppContactCandidate {
  id: string;
  name: string;
  phone: string;
  instagram?: string;
  city: string;
  suggestedProfession: string;
  suggestedSizes: {
    shirt: SizeShirt;
    pants: SizePants;
    shoes: SizeShoes;
    fit: FitPreference;
  };
  styleTags: StyleTag[];
  selected: boolean;
}

export const WhatsAppImportModal: React.FC<WhatsAppImportModalProps> = ({
  isOpen,
  onClose,
  onImportClients
}) => {
  const [candidates, setCandidates] = useState<WhatsAppContactCandidate[]>([
    {
      id: 'wa-import-1',
      name: 'Eduardo Konkel',
      phone: '(47) 99654-7812',
      instagram: '@edu_konkel',
      city: 'Canoinhas',
      suggestedProfession: 'Empresário Erva-Mateira',
      suggestedSizes: { shirt: 'G', pants: '44', shoes: '42', fit: 'Regular Fit' },
      styleTags: ['Clássico', 'Casual'],
      selected: true
    },
    {
      id: 'wa-import-2',
      name: 'Dr. Fernando Krause',
      phone: '(47) 99881-2390',
      instagram: '@drfernandokrause',
      city: 'Canoinhas',
      suggestedProfession: 'Médico Ortopedista',
      suggestedSizes: { shirt: 'M', pants: '42', shoes: '41', fit: 'Slim Fit' },
      styleTags: ['Social', 'Moderno'],
      selected: true
    },
    {
      id: 'wa-import-3',
      name: 'Vinicius Kiem',
      phone: '(47) 99712-4455',
      instagram: '@viniciuskiem_eng',
      city: 'Três Barras',
      suggestedProfession: 'Engenheiro Florestal Rigesa',
      suggestedSizes: { shirt: 'M', pants: '40', shoes: '40', fit: 'Alfaiataria Moderna' },
      styleTags: ['Moderno', 'Minimalista'],
      selected: true
    },
    {
      id: 'wa-import-4',
      name: 'Marcos Aurelio Furtado',
      phone: '(47) 99233-6789',
      instagram: '@marcos_furtado_agro',
      city: 'Mafra',
      suggestedProfession: 'Engenheiro Agrônomo',
      suggestedSizes: { shirt: 'GG', pants: '46', shoes: '43', fit: 'Regular Fit' },
      styleTags: ['Rústico Chic', 'Clássico'],
      selected: false
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [importSource, setImportSource] = useState<'API' | 'VCARD' | 'CSV'>('API');
  const [vcardText, setVcardText] = useState('');

  if (!isOpen) return null;

  const toggleSelect = (id: string) => {
    setCandidates(prev => prev.map(c => c.id === id ? { ...c, selected: !c.selected } : c));
  };

  const toggleSelectAll = () => {
    const allSelected = candidates.every(c => c.selected);
    setCandidates(prev => prev.map(c => ({ ...c, selected: !allSelected })));
  };

  const filteredCandidates = candidates.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.phone.includes(searchTerm) ||
    c.city.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedCount = candidates.filter(c => c.selected).length;

  const handleExecuteImport = () => {
    const toImport = candidates.filter(c => c.selected);
    if (toImport.length === 0) {
      alert('Selecione ao menos 1 contato para importar.');
      return;
    }

    const newClients: Client[] = toImport.map((c, idx) => ({
      id: `cli-imported-${Date.now()}-${idx}`,
      name: c.name,
      phone: c.phone,
      email: `${c.name.toLowerCase().replace(/\s+/g, '.')}@gmail.com`,
      instagram: c.instagram,
      city: c.city,
      neighborhood: 'Centro',
      address: `Rua Central, Canoinhas`,
      tier: 'Novo Cliente',
      sizes: {
        shirt: c.suggestedSizes.shirt,
        pants: c.suggestedSizes.pants,
        shoes: c.suggestedSizes.shoes,
        fitPreference: c.suggestedSizes.fit
      },
      style: {
        palette: ['Tons Terrosos', 'Preto', 'Azul Marinho'],
        favoriteCategories: ['Camisas de Linho', 'Polos Tricot'],
        avoidItems: ['Estampas chamativas'],
        lifestyle: `${c.suggestedProfession} em Canoinhas/Região.`,
        profession: c.suggestedProfession
      },
      styleTags: c.styleTags,
      customTags: ['Importado WhatsApp Business', 'Canoinhas Região', 'Novo Lead'],
      metrics: {
        totalLtv: 0,
        ordersCount: 0,
        condicionaisCount: 0,
        condicionalConversionRate: 0,
        averageTicket: 0,
        lastInteractionDate: new Date().toISOString()
      },
      purchasedPieces: [],
      returnedPieces: [],
      timeline: [
        {
          id: `tl-imp-${Date.now()}-${idx}`,
          type: 'WHATSAPP',
          title: 'Contato Importado do WhatsApp',
          description: 'Sincronizado da agenda do WhatsApp Business Ravi\'s Premium.',
          timestamp: new Date().toLocaleDateString('pt-BR')
        }
      ],
      curatorNotes: ['Contato importado via agenda do WhatsApp Business. Aguardando primeira consulta de curadoria.'],
      preferredCurator: 'Mateus (Consultor Sênior)',
      createdAt: new Date().toISOString()
    }));

    onImportClients(newClients);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-[#10141d] border border-[#273245] w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-5 py-4 border-b border-[#212a3b] bg-[#141924] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <Phone className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-white">Importar Contatos do WhatsApp Business</h2>
              <p className="text-xs text-neutral-400">Sincronize clientes de Canoinhas e crie perfis 360° automaticamente</p>
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
          {/* Source Tabs */}
          <div className="flex items-center gap-2 bg-[#0b0e14] p-1 rounded-xl border border-[#1b2332]">
            <button
              onClick={() => setImportSource('API')}
              className={`flex-1 py-1.5 rounded-lg font-medium text-xs transition-all flex items-center justify-center gap-1.5 ${
                importSource === 'API' ? 'bg-[#182230] text-[#f5d061] border border-[#26354b]' : 'text-neutral-400'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
              <span>Evolution API (Direto do WhatsApp)</span>
            </button>
            <button
              onClick={() => setImportSource('VCARD')}
              className={`flex-1 py-1.5 rounded-lg font-medium text-xs transition-all flex items-center justify-center gap-1.5 ${
                importSource === 'VCARD' ? 'bg-[#182230] text-[#f5d061] border border-[#26354b]' : 'text-neutral-400'
              }`}
            >
              <Upload className="w-3.5 h-3.5 text-[#c99738]" />
              <span>Arquivo vCard / Contatos (.vcf)</span>
            </button>
          </div>

          {importSource === 'VCARD' ? (
            <div className="space-y-2">
              <label className="text-neutral-300 font-medium block">Cole o conteúdo do arquivo .vcf ou CSV de contatos:</label>
              <textarea
                rows={5}
                value={vcardText}
                onChange={(e) => setVcardText(e.target.value)}
                placeholder="BEGIN:VCARD&#10;FN:Dr. Fernando Krause&#10;TEL;CELL:+5547998812390&#10;END:VCARD"
                className="w-full bg-[#0b0e14] border border-[#263145] rounded-xl p-3 text-xs text-white font-mono focus:outline-none focus:border-[#c99738]"
              />
            </div>
          ) : (
            <div className="space-y-3">
              {/* Search & Select All */}
              <div className="flex items-center justify-between gap-2">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Filtrar contatos detectados no WhatsApp..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-[#0b0e14] border border-[#222a3a] rounded-lg pl-9 pr-3 py-1.5 text-xs text-white placeholder-neutral-400 focus:outline-none focus:border-[#c99738]"
                  />
                </div>

                <button
                  type="button"
                  onClick={toggleSelectAll}
                  className="px-3 py-1.5 rounded-lg bg-[#141923] border border-[#263145] text-neutral-300 text-xs font-medium flex items-center gap-1.5 shrink-0"
                >
                  {candidates.every(c => c.selected) ? (
                    <CheckSquare className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <Square className="w-4 h-4 text-neutral-400" />
                  )}
                  <span>Marcar Todos</span>
                </button>
              </div>

              {/* Candidate List */}
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {filteredCandidates.map(c => (
                  <div
                    key={c.id}
                    onClick={() => toggleSelect(c.id)}
                    className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                      c.selected 
                        ? 'bg-[#131c26] border-emerald-600/60' 
                        : 'bg-[#0d1017] border-[#1d2433] opacity-60'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-5 h-5 rounded flex items-center justify-center ${
                        c.selected ? 'bg-emerald-500 text-black' : 'border border-[#2d3a50]'
                      }`}>
                        {c.selected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-white text-xs">{c.name}</span>
                          <span className="text-[10px] text-neutral-400">{c.phone}</span>
                        </div>
                        <div className="text-[11px] text-neutral-400 mt-0.5">
                          {c.suggestedProfession} • {c.city}
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] font-mono text-amber-300 bg-[#17202e] px-2 py-0.5 rounded border border-[#26344a]">
                        Tam {c.suggestedSizes.shirt} / {c.suggestedSizes.pants}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-[#20293a] bg-[#141924] flex items-center justify-between">
          <span className="text-xs text-neutral-400">
            {selectedCount} contato(s) selecionado(s)
          </span>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-[#1a212e] text-neutral-300"
            >
              Cancelar
            </button>

            <button
              type="button"
              onClick={handleExecuteImport}
              className="flex items-center gap-2 px-5 py-2 rounded-lg bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white font-semibold text-xs shadow-md shadow-emerald-950/40"
            >
              <Check className="w-4 h-4" />
              <span>Importar para o Ravis CRM ({selectedCount})</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
