import React, { useState, useMemo } from 'react';
import { Client, Campaign, CampaignFilter, MessageChannel } from '../../types/crm';
import { 
  X, 
  Send, 
  Users, 
  Sparkles, 
  Filter, 
  ShieldCheck, 
  Clock, 
  Calendar, 
  CheckCircle2, 
  AlertTriangle,
  Layers,
  MessageSquare
} from 'lucide-react';

interface CampaignCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  clients: Client[];
  onCreateCampaign: (campaign: Campaign) => void;
}

export const CampaignCreateModal: React.FC<CampaignCreateModalProps> = ({
  isOpen,
  onClose,
  clients,
  onCreateCampaign
}) => {
  if (!isOpen) return null;

  const [campaignName, setCampaignName] = useState('');
  const [channel, setChannel] = useState<MessageChannel | 'MULTICANAL'>('WHATSAPP');
  const [filterSize, setFilterSize] = useState<string>('TODOS');
  const [filterStyle, setFilterStyle] = useState<string>('TODOS');
  const [filterHistory, setFilterHistory] = useState<string>('TODOS');
  const [filterCity, setFilterCity] = useState<string>('TODOS');
  const [respectsLgpd, setRespectsLgpd] = useState<boolean>(true);
  const [respectsBusinessHours, setRespectsBusinessHours] = useState<boolean>(true);
  
  const [messageTemplate, setMessageTemplate] = useState(
    `Olá, {nome}! Tudo bem? A Ravi's separou uma curadoria de edição limitada pensada exclusivamente para você no tamanho {tamanho_camisa} e estilo {estilo}. Gostaria de receber uma mala condicional sem custo em sua casa esta semana?`
  );

  // Dynamic eligible client matching
  const eligibleClients = useMemo(() => {
    return clients.filter(c => {
      // LGPD check
      if (respectsLgpd && c.lgpdConsent === 'OPT_OUT') return false;

      // Size check
      if (filterSize !== 'TODOS' && c.sizes.shirt !== filterSize) return false;

      // Style check
      if (filterStyle !== 'TODOS' && !c.styleTags.includes(filterStyle as any)) return false;

      // City check
      if (filterCity !== 'TODOS' && c.city !== filterCity) return false;

      // History check
      if (filterHistory === 'VIP_HIGH_LTV' && c.metrics.totalLtv < 3000) return false;
      if (filterHistory === 'INATIVO_60D' && c.metrics.ordersCount > 0 && c.metrics.condicionalConversionRate < 50) return false;
      if (filterHistory === 'ALTA_CONVERSAO' && c.metrics.condicionalConversionRate < 70) return false;

      return true;
    });
  }, [clients, filterSize, filterStyle, filterHistory, filterCity, respectsLgpd]);

  const handleAddVariable = (variable: string) => {
    setMessageTemplate(prev => prev + ` ${variable}`);
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!campaignName.trim() || eligibleClients.length === 0) return;

    const newCampaign: Campaign = {
      id: `camp-${Date.now()}`,
      name: campaignName.trim(),
      targetFilter: {
        size: filterSize !== 'TODOS' ? filterSize : undefined,
        style: filterStyle !== 'TODOS' ? filterStyle : undefined,
        history: filterHistory !== 'TODOS' ? filterHistory : undefined,
        city: filterCity !== 'TODOS' ? filterCity : undefined
      },
      channel,
      templateMessage: messageTemplate,
      eligibleCount: eligibleClients.length,
      status: 'DISPARADA',
      createdAt: new Date().toISOString().slice(0, 10),
      respectsBusinessHours,
      respectsLgpd,
      stats: {
        sent: eligibleClients.length,
        delivered: eligibleClients.length,
        read: Math.round(eligibleClients.length * 0.95),
        replied: Math.round(eligibleClients.length * 0.45),
        converted: Math.round(eligibleClients.length * 0.3)
      }
    };

    onCreateCampaign(newCampaign);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-sm animate-in fade-in">
      <div className="bg-[#10141d] border border-[#232b3d] rounded-2xl w-full max-w-3xl flex flex-col shadow-2xl overflow-hidden max-h-[92vh]">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[#1f2637] flex items-center justify-between bg-[#141924]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-[#c99738]">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                Nova Campanha com Segmentação Inteligente
              </h2>
              <p className="text-xs text-neutral-400">
                Disparos em lote para WhatsApp Business & Instagram com proteção anti-ban e LGPD
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-[#1a202c] hover:bg-[#252d3d] text-neutral-400 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleCreateSubmit} className="p-4 sm:p-6 overflow-y-auto space-y-5 flex-1">
          {/* Campaign Name & Channel */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-neutral-300 mb-1">
                Nome da Campanha
              </label>
              <input
                type="text"
                value={campaignName}
                onChange={(e) => setCampaignName(e.target.value)}
                placeholder="Ex: Drop Tricôs Inverno Canoinhas - Tamanho M"
                className="w-full bg-[#0c0e12] border border-[#232b3d] rounded-xl px-3 py-2.5 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-[#c99738]"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1">
                Canal de Disparo
              </label>
              <select
                value={channel}
                onChange={(e) => setChannel(e.target.value as any)}
                className="w-full bg-[#0c0e12] border border-[#232b3d] rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-[#c99738]"
              >
                <option value="WHATSAPP">WhatsApp Business API</option>
                <option value="INSTAGRAM">Instagram Direct</option>
                <option value="MULTICANAL">Multicanal (WhatsApp + Direct)</option>
              </select>
            </div>
          </div>

          {/* Segmentation Filters */}
          <div className="bg-[#141924] border border-[#222a3b] rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <Filter className="w-3.5 h-3.5 text-[#c99738]" />
                <span>Segmentação de Moda & Comportamento</span>
              </span>
              <span className="text-xs bg-[#c99738]/10 text-[#c99738] font-bold px-2.5 py-1 rounded-full border border-[#c99738]/30 flex items-center gap-1">
                <Users className="w-3.5 h-3.5" />
                <span>{eligibleClients.length} cliente(s) selecionado(s)</span>
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div>
                <label className="block text-[11px] text-neutral-400 font-medium mb-1">
                  Tamanho de Camisa
                </label>
                <select
                  value={filterSize}
                  onChange={(e) => setFilterSize(e.target.value)}
                  className="w-full bg-[#0c0e12] border border-[#232b3d] rounded-lg px-2.5 py-2 text-xs text-white focus:outline-none focus:border-[#c99738]"
                >
                  <option value="TODOS">Todos os Tamanhos</option>
                  <option value="P">Tamanho P</option>
                  <option value="M">Tamanho M</option>
                  <option value="G">Tamanho G</option>
                  <option value="GG">Tamanho GG</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] text-neutral-400 font-medium mb-1">
                  Estilo Pessoal
                </label>
                <select
                  value={filterStyle}
                  onChange={(e) => setFilterStyle(e.target.value)}
                  className="w-full bg-[#0c0e12] border border-[#232b3d] rounded-lg px-2.5 py-2 text-xs text-white focus:outline-none focus:border-[#c99738]"
                >
                  <option value="TODOS">Todos os Estilos</option>
                  <option value="Clássico">Clássico</option>
                  <option value="Moderno">Moderno</option>
                  <option value="Casual">Casual</option>
                  <option value="Social">Social</option>
                  <option value="Minimalista">Minimalista</option>
                  <option value="Urbano">Urbano</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] text-neutral-400 font-medium mb-1">
                  Histórico & Recência
                </label>
                <select
                  value={filterHistory}
                  onChange={(e) => setFilterHistory(e.target.value)}
                  className="w-full bg-[#0c0e12] border border-[#232b3d] rounded-lg px-2.5 py-2 text-xs text-white focus:outline-none focus:border-[#c99738]"
                >
                  <option value="TODOS">Todos os Clientes</option>
                  <option value="VIP_HIGH_LTV">LTV Alto (&gt; R$ 3.000)</option>
                  <option value="ALTA_CONVERSAO">Alta Conversão Condicional (&gt; 70%)</option>
                  <option value="INATIVO_60D">Inativo há 60+ dias</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] text-neutral-400 font-medium mb-1">
                  Localização
                </label>
                <select
                  value={filterCity}
                  onChange={(e) => setFilterCity(e.target.value)}
                  className="w-full bg-[#0c0e12] border border-[#232b3d] rounded-lg px-2.5 py-2 text-xs text-white focus:outline-none focus:border-[#c99738]"
                >
                  <option value="TODOS">Todas as Cidades</option>
                  <option value="Canoinhas">Canoinhas-SC</option>
                  <option value="Três Barras">Três Barras-SC</option>
                  <option value="Mafra">Mafra-SC</option>
                  <option value="Porto União">Porto União-SC</option>
                </select>
              </div>
            </div>

            {/* Preview of Eligible Clients */}
            <div className="pt-2 border-t border-[#1f2637]">
              <span className="text-[11px] text-neutral-400 block mb-1">
                Amostra de Clientes Elegíveis:
              </span>
              <div className="flex flex-wrap gap-1.5 max-h-20 overflow-y-auto">
                {eligibleClients.map(c => (
                  <span
                    key={c.id}
                    className="text-[10px] bg-[#0c0e12] text-neutral-300 px-2 py-0.5 rounded border border-[#222a3b] flex items-center gap-1"
                  >
                    <span>{c.name.split(' ')[0]}</span>
                    <span className="text-amber-400">({c.sizes.shirt})</span>
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Template Editor */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-neutral-300">
                Texto da Mensagem com Tags Dinâmicas
              </label>
              <div className="flex items-center gap-1">
                <span className="text-[10px] text-neutral-500">Inserir tag:</span>
                <button
                  type="button"
                  onClick={() => handleAddVariable('{nome}')}
                  className="text-[10px] bg-[#1a202c] hover:bg-[#252d3d] text-amber-400 px-1.5 py-0.5 rounded border border-neutral-700"
                >
                  {'{nome}'}
                </button>
                <button
                  type="button"
                  onClick={() => handleAddVariable('{tamanho_camisa}')}
                  className="text-[10px] bg-[#1a202c] hover:bg-[#252d3d] text-amber-400 px-1.5 py-0.5 rounded border border-neutral-700"
                >
                  {'{tamanho_camisa}'}
                </button>
                <button
                  type="button"
                  onClick={() => handleAddVariable('{estilo}')}
                  className="text-[10px] bg-[#1a202c] hover:bg-[#252d3d] text-amber-400 px-1.5 py-0.5 rounded border border-neutral-700"
                >
                  {'{estilo}'}
                </button>
                <button
                  type="button"
                  onClick={() => handleAddVariable('{cidade}')}
                  className="text-[10px] bg-[#1a202c] hover:bg-[#252d3d] text-amber-400 px-1.5 py-0.5 rounded border border-neutral-700"
                >
                  {'{cidade}'}
                </button>
              </div>
            </div>

            <textarea
              rows={4}
              value={messageTemplate}
              onChange={(e) => setMessageTemplate(e.target.value)}
              className="w-full bg-[#0c0e12] border border-[#232b3d] rounded-xl p-3 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-[#c99738] leading-relaxed font-sans"
              required
            />
          </div>

          {/* Compliance & Business Hours Checks */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <label className="flex items-start gap-2.5 p-3 rounded-xl bg-[#141924] border border-[#222a3b] cursor-pointer">
              <input
                type="checkbox"
                checked={respectsLgpd}
                onChange={(e) => setRespectsLgpd(e.target.checked)}
                className="mt-0.5 rounded border-neutral-700 text-[#c99738] focus:ring-0"
              />
              <div className="text-xs">
                <span className="font-semibold text-white flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Controle LGPD & Opt-in</span>
                </span>
                <p className="text-[11px] text-neutral-400 mt-0.5">
                  Ignora clientes com Opt-out e inclui mensagem de cancelamento ao final.
                </p>
              </div>
            </label>

            <label className="flex items-start gap-2.5 p-3 rounded-xl bg-[#141924] border border-[#222a3b] cursor-pointer">
              <input
                type="checkbox"
                checked={respectsBusinessHours}
                onChange={(e) => setRespectsBusinessHours(e.target.checked)}
                className="mt-0.5 rounded border-neutral-700 text-[#c99738] focus:ring-0"
              />
              <div className="text-xs">
                <span className="font-semibold text-white flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                  <span>Janela Comercial (08:30 - 19:30)</span>
                </span>
                <p className="text-[11px] text-neutral-400 mt-0.5">
                  Dispara com intervalo aleatório de 3 a 7s para evitar bloqueio Meta/WhatsApp.
                </p>
              </div>
            </label>
          </div>

          {/* Form Actions */}
          <div className="pt-3 border-t border-[#1f2637] flex items-center justify-between">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-[#1a202c] hover:bg-[#252d3d] text-xs font-medium text-neutral-300 transition-colors"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={eligibleClients.length === 0}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#c99738] to-[#b07d24] text-black text-xs font-bold hover:brightness-110 flex items-center gap-2 transition-all shadow-lg shadow-amber-950/40 disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5 fill-black" />
              <span>Disparar Campanha ({eligibleClients.length} Leads)</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
