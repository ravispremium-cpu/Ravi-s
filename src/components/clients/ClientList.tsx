import React, { useState } from 'react';
import { Client, StyleTag } from '../../types/crm';
import { 
  Users, 
  Search, 
  Plus, 
  Filter, 
  ChevronRight, 
  Phone, 
  MapPin, 
  Ruler, 
  TrendingUp,
  Sparkles,
  ShoppingBag,
  Download,
  Instagram,
  Tag
} from 'lucide-react';

interface ClientListProps {
  clients: Client[];
  selectedClientId: string | null;
  onSelectClient: (client: Client) => void;
  onOpenNewClientModal: () => void;
  onOpenWhatsAppImportModal: () => void;
  onOpenNewCondicionalForClient: (client: Client) => void;
}

export const ClientList: React.FC<ClientListProps> = ({
  clients,
  selectedClientId,
  onSelectClient,
  onOpenNewClientModal,
  onOpenWhatsAppImportModal,
  onOpenNewCondicionalForClient
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [tierFilter, setTierFilter] = useState('ALL');
  const [sizeFilter, setSizeFilter] = useState('ALL');
  const [styleTagFilter, setStyleTagFilter] = useState('ALL');
  const [activeSegmentFilter, setActiveSegmentFilter] = useState<string>('ALL');

  // Pre-configured dynamic segment presets requested by user
  const dynamicSegments = [
    { id: 'ALL', label: 'Todos os Clientes' },
    { id: 'SLIM_PRETA_90D', label: '🔥 Camiseta Slim Preta (90d)' },
    { id: 'HIGH_TICKET', label: '💎 Ticket Médio > R$ 2.000' },
    { id: 'ALFAIATARIA_SOCIAL', label: '👔 Estilo Social / Alfaiataria' },
    { id: 'CANOINHAS_CENTRO', label: '📍 Canoinhas - Centro' },
    { id: 'MODERNO_MINIMALISTA', label: '✨ Moderno & Minimalista' }
  ];

  const filteredClients = clients.filter(c => {
    // Busca rápida por nome, telefone ou @ do Instagram
    const term = searchTerm.toLowerCase();
    const matchesSearch = 
      c.name.toLowerCase().includes(term) ||
      c.phone.includes(term) ||
      (c.instagram && c.instagram.toLowerCase().includes(term)) ||
      c.city.toLowerCase().includes(term) ||
      c.style.profession.toLowerCase().includes(term);

    const matchesTier = tierFilter === 'ALL' || c.tier === tierFilter;
    const matchesSize = sizeFilter === 'ALL' || c.sizes.shirt === sizeFilter;
    const matchesStyleTag = styleTagFilter === 'ALL' || c.styleTags.includes(styleTagFilter as StyleTag);

    // Dynamic Segmentation Filter
    let matchesSegment = true;
    if (activeSegmentFilter === 'SLIM_PRETA_90D') {
      matchesSegment = c.customTags.some(t => t.includes('Camiseta Slim Preta') || t.includes('90d')) ||
        (c.purchasedPieces || []).some(p => p.title.toLowerCase().includes('preta') || p.fit === 'Slim Fit');
    } else if (activeSegmentFilter === 'HIGH_TICKET') {
      matchesSegment = c.metrics.averageTicket >= 2000;
    } else if (activeSegmentFilter === 'ALFAIATARIA_SOCIAL') {
      matchesSegment = c.styleTags.includes('Social') || c.styleTags.includes('Clássico');
    } else if (activeSegmentFilter === 'CANOINHAS_CENTRO') {
      matchesSegment = c.city.toLowerCase().includes('canoinhas') && c.neighborhood.toLowerCase().includes('centro');
    } else if (activeSegmentFilter === 'MODERNO_MINIMALISTA') {
      matchesSegment = c.styleTags.includes('Moderno') || c.styleTags.includes('Minimalista');
    }

    return matchesSearch && matchesTier && matchesSize && matchesStyleTag && matchesSegment;
  });

  return (
    <div className="space-y-4">
      {/* Top Search & Actions Bar */}
      <div className="bg-[#11141c] p-4 rounded-2xl border border-[#1e2533] space-y-3">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          {/* Quick Search across Name, Phone, @Instagram */}
          <div className="relative flex-1 max-w-lg">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Busca rápida por Nome, WhatsApp (ex: 99824) ou @ do Instagram..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#0d1017] border border-[#232a3a] rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-neutral-400 focus:outline-none focus:border-[#c99738]"
            />
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={onOpenWhatsAppImportModal}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-950/60 hover:bg-emerald-900/60 border border-emerald-600/50 text-emerald-300 text-xs font-medium transition-colors"
              title="Importar agenda de contatos do WhatsApp Business"
            >
              <Phone className="w-3.5 h-3.5 text-emerald-400" />
              <span>Importar do WhatsApp</span>
            </button>

            <button
              onClick={onOpenNewClientModal}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-[#c99738] to-[#b3822b] hover:from-[#d6a544] hover:to-[#be8d35] text-black font-semibold text-xs shadow-md shadow-[#c99738]/20 transition-all"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>Cadastrar Cliente VIP</span>
            </button>
          </div>
        </div>

        {/* Dynamic Segment Buttons Strip */}
        <div className="flex items-center gap-2 overflow-x-auto pt-2 border-t border-[#1b2230] scrollbar-none">
          <span className="text-[10px] uppercase font-bold text-neutral-400 shrink-0 flex items-center gap-1">
            <Tag className="w-3 h-3 text-[#c99738]" /> Segmentação Dinâmica:
          </span>

          {dynamicSegments.map(seg => {
            const isActive = activeSegmentFilter === seg.id;
            return (
              <button
                key={seg.id}
                onClick={() => setActiveSegmentFilter(seg.id)}
                className={`px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-[#c99738] text-black font-semibold shadow-xs'
                    : 'bg-[#151a24] text-neutral-400 hover:text-white hover:bg-[#1a212e]'
                }`}
              >
                {seg.label}
              </button>
            );
          })}
        </div>

        {/* Filters dropdown row */}
        <div className="flex items-center gap-2 overflow-x-auto text-xs pt-1">
          <select
            value={tierFilter}
            onChange={(e) => setTierFilter(e.target.value)}
            className="bg-[#0d1017] border border-[#232a3a] rounded-lg px-2.5 py-1.5 text-neutral-300 focus:outline-none focus:border-[#c99738]"
          >
            <option value="ALL">Todos os Tiers</option>
            <option value="VIP Platinum">VIP Platinum</option>
            <option value="VIP Ouro">VIP Ouro</option>
            <option value="Recorrente">Recorrente</option>
            <option value="Novo Cliente">Novo Cliente</option>
          </select>

          <select
            value={sizeFilter}
            onChange={(e) => setSizeFilter(e.target.value)}
            className="bg-[#0d1017] border border-[#232a3a] rounded-lg px-2.5 py-1.5 text-neutral-300 focus:outline-none focus:border-[#c99738]"
          >
            <option value="ALL">Tamanho Camisa</option>
            <option value="P">Tamanho P</option>
            <option value="M">Tamanho M</option>
            <option value="G">Tamanho G</option>
            <option value="GG">Tamanho GG</option>
          </select>

          <select
            value={styleTagFilter}
            onChange={(e) => setStyleTagFilter(e.target.value)}
            className="bg-[#0d1017] border border-[#232a3a] rounded-lg px-2.5 py-1.5 text-neutral-300 focus:outline-none focus:border-[#c99738]"
          >
            <option value="ALL">Estilo Pessoal</option>
            <option value="Clássico">Clássico</option>
            <option value="Moderno">Moderno</option>
            <option value="Casual">Casual</option>
            <option value="Social">Social</option>
            <option value="Minimalista">Minimalista</option>
            <option value="Rústico Chic">Rústico Chic</option>
          </select>

          <span className="text-neutral-400 text-xs ml-auto font-mono">
            {filteredClients.length} cliente(s) encontrado(s)
          </span>
        </div>
      </div>

      {/* Clients Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredClients.map(client => {
          const isSelected = selectedClientId === client.id;

          return (
            <div
              key={client.id}
              onClick={() => onSelectClient(client)}
              className={`rounded-2xl border transition-all p-4 cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? 'bg-[#151c27] border-[#c99738] shadow-xl shadow-[#c99738]/10'
                  : 'bg-[#10141d] border-[#1e2535] hover:border-[#2f3b52] hover:bg-[#131722]'
              }`}
            >
              <div>
                {/* Header */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-11 h-11 rounded-xl bg-[#171e2c] border border-[#29354a] flex items-center justify-center text-white font-serif font-bold text-sm">
                      {client.name.split(' ').map(n => n[0]).slice(0, 2).join('')}
                    </div>
                    <div>
                      <h3 className="font-semibold text-white text-xs hover:text-[#c99738] transition-colors">{client.name}</h3>
                      <span className="text-[11px] text-neutral-400 block truncate max-w-[170px]">{client.style.profession}</span>
                    </div>
                  </div>

                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                    client.tier === 'VIP Platinum'
                      ? 'bg-amber-400/20 text-amber-300 border border-amber-400/40'
                      : client.tier === 'VIP Ouro'
                      ? 'bg-amber-950/40 text-amber-400 border border-amber-600/40'
                      : 'bg-[#1b2230] text-neutral-300'
                  }`}>
                    {client.tier}
                  </span>
                </div>

                {/* Contact & City Info */}
                <div className="flex items-center justify-between text-xs text-neutral-400 mt-2.5 pt-2 border-t border-[#171e2a]">
                  <div className="flex items-center gap-1.5 text-neutral-300">
                    <Phone className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>{client.phone}</span>
                  </div>

                  {client.instagram && (
                    <div className="flex items-center gap-1 text-pink-300">
                      <Instagram className="w-3 h-3 text-pink-400" />
                      <span>{client.instagram}</span>
                    </div>
                  )}
                </div>

                {/* Sizes Row */}
                <div className="grid grid-cols-3 gap-1.5 bg-[#0b0e14] p-2 rounded-xl border border-[#192130] mt-2.5 text-center">
                  <div>
                    <span className="text-[9px] text-neutral-400 block">Camisa</span>
                    <span className="font-mono text-xs font-bold text-[#f5d061]">{client.sizes.shirt}</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-neutral-400 block">Calça</span>
                    <span className="font-mono text-xs font-bold text-[#f5d061]">{client.sizes.pants}</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-neutral-400 block">Sapato</span>
                    <span className="font-mono text-xs font-bold text-[#f5d061]">{client.sizes.shoes}</span>
                  </div>
                </div>

                {/* Style tags & Caimento */}
                <div className="flex items-center justify-between text-[11px] mt-2.5">
                  <span className="text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-800/40 font-medium">
                    {client.sizes.fitPreference}
                  </span>
                  <div className="flex items-center gap-1">
                    {client.styleTags.slice(0, 2).map((st, sIdx) => (
                      <span key={sIdx} className="text-[10px] text-neutral-400 bg-[#161c27] px-1.5 py-0.5 rounded">
                        {st}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bottom Metrics & Action */}
              <div className="mt-3 pt-3 border-t border-[#1a2130] flex items-center justify-between text-xs">
                <div>
                  <span className="text-[10px] text-neutral-400 block">LTV Gasto:</span>
                  <span className="font-mono font-bold text-amber-300">
                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(client.metrics.totalLtv)}
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] text-emerald-400 font-semibold bg-emerald-950/40 px-1.5 py-0.5 rounded border border-emerald-800/40">
                    {client.metrics.condicionalConversionRate}% conv.
                  </span>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenNewCondicionalForClient(client);
                    }}
                    className="p-1.5 rounded-lg bg-[#1c2433] hover:bg-[#273347] text-[#c99738] transition-colors"
                    title="Montar Mala para este Cliente"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
