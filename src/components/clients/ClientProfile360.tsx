import React, { useState } from 'react';
import { 
  Client, 
  CondicionalBox, 
  UnifiedMessage, 
  StyleTag,
  PurchasedPieceHistory,
  ReturnedPieceHistory,
  ClientTimelineEvent 
} from '../../types/crm';
import { 
  User, 
  MapPin, 
  Phone, 
  Mail, 
  Instagram, 
  TrendingUp, 
  Briefcase, 
  Ruler, 
  Palette, 
  Calendar, 
  Plus, 
  MessageSquare, 
  CheckCircle2, 
  Clock, 
  RotateCcw,
  Sparkles,
  ShoppingBag,
  Send,
  Tag,
  History,
  CheckCheck,
  ExternalLink,
  ChevronRight,
  Trash2,
  Edit3
} from 'lucide-react';

interface ClientProfile360Props {
  client: Client;
  clientCondicionais: CondicionalBox[];
  clientMessages: UnifiedMessage[];
  onOpenNewBoxForClient: (client: Client) => void;
  onSendWhatsApp: (phone: string, clientName: string) => void;
  onSendMessageInline: (clientId: string, content: string, channel: 'WHATSAPP' | 'INSTAGRAM' | 'EMAIL') => void;
  onAddCuratorNote: (clientId: string, note: string) => void;
  onAddCustomTag: (clientId: string, tag: string) => void;
  onRemoveCustomTag: (clientId: string, tag: string) => void;
}

export const ClientProfile360: React.FC<ClientProfile360Props> = ({
  client,
  clientCondicionais,
  clientMessages,
  onOpenNewBoxForClient,
  onSendWhatsApp,
  onSendMessageInline,
  onAddCuratorNote,
  onAddCustomTag,
  onRemoveCustomTag
}) => {
  const [activeTab, setActiveTab] = useState<'MODA' | 'HISTORICO' | 'TIMELINE' | 'CONVERSAS' | 'NOTAS'>('MODA');
  const [newNote, setNewNote] = useState('');
  const [newCustomTag, setNewCustomTag] = useState('');
  const [inlineMessage, setInlineMessage] = useState('');
  const [activeChannel, setActiveChannel] = useState<'WHATSAPP' | 'INSTAGRAM' | 'EMAIL'>('WHATSAPP');

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim()) return;
    onAddCuratorNote(client.id, newNote.trim());
    setNewNote('');
  };

  const handleAddTag = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCustomTag.trim()) return;
    onAddCustomTag(client.id, newCustomTag.trim());
    setNewCustomTag('');
  };

  const handleSendInlineMsg = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inlineMessage.trim()) return;
    onSendMessageInline(client.id, inlineMessage.trim(), activeChannel);
    setInlineMessage('');
  };

  const cleanPhone = client.phone.replace(/\D/g, '');

  const getTierBadge = (tier: Client['tier']) => {
    switch (tier) {
      case 'VIP Platinum':
        return 'bg-gradient-to-r from-amber-400 to-amber-600 text-black font-bold';
      case 'VIP Ouro':
        return 'bg-amber-950/80 border border-amber-500/50 text-amber-300 font-semibold';
      case 'Recorrente':
        return 'bg-blue-950/80 border border-blue-500/50 text-blue-300';
      default:
        return 'bg-neutral-800 text-neutral-300';
    }
  };

  const totalSpent = client.metrics.totalLtv;
  const totalBoughtCount = client.purchasedPieces?.length || 0;
  const totalReturnedCount = client.returnedPieces?.length || 0;

  return (
    <div className="space-y-4">
      {/* Client Master Card */}
      <div className="bg-[#10141d] rounded-2xl border border-[#222a3b] p-5 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          {/* Identity & Basic Info */}
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#1d2433] via-[#141a26] to-[#0a0d13] border border-[#2c374d] flex items-center justify-center text-white font-serif text-2xl font-bold shadow-inner">
              {client.name.split(' ').map(n => n[0]).slice(0, 2).join('')}
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="text-xl font-serif font-bold text-white tracking-wide">{client.name}</h1>
                <span className={`text-[11px] px-2.5 py-0.5 rounded-full ${getTierBadge(client.tier)}`}>
                  {client.tier}
                </span>
                <span className="text-[11px] text-[#c99738] bg-[#1a212e] px-2 py-0.5 rounded border border-[#283549]">
                  Curador: {client.preferredCurator}
                </span>
              </div>

              {/* Basic Data: Phone, Instagram, Email, Address in Canoinhas-SC */}
              <div className="flex flex-wrap items-center gap-3 text-xs text-neutral-300">
                <span className="flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-emerald-400" />
                  <strong>{client.phone}</strong>
                </span>

                {client.instagram && (
                  <span className="flex items-center gap-1.5 text-pink-300">
                    <Instagram className="w-3.5 h-3.5 text-pink-400" />
                    <strong>{client.instagram}</strong>
                  </span>
                )}

                <span className="flex items-center gap-1.5 text-neutral-400">
                  <Mail className="w-3.5 h-3.5 text-blue-400" />
                  <span>{client.email}</span>
                </span>
              </div>

              <div className="flex items-center gap-2 text-xs text-neutral-400 pt-0.5">
                <MapPin className="w-3.5 h-3.5 text-[#c99738] shrink-0" />
                <span className="text-neutral-300">{client.address}, {client.neighborhood} — {client.city}-SC</span>
                <span>•</span>
                <span className="text-neutral-400">{client.style.profession}</span>
              </div>

              {/* Style tags & Dynamic Segment Tags */}
              <div className="flex flex-wrap items-center gap-1.5 pt-2">
                <span className="text-[10px] uppercase font-bold text-neutral-400">Estilo:</span>
                {client.styleTags.map((tag, idx) => (
                  <span key={idx} className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-emerald-950/40 text-emerald-300 border border-emerald-800/40">
                    {tag}
                  </span>
                ))}

                <span className="text-neutral-600 mx-1">|</span>

                <span className="text-[10px] uppercase font-bold text-neutral-400">Segmentos:</span>
                {client.customTags.map((ctag, idx) => (
                  <span key={idx} className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-[#17202e] text-[#f5d061] border border-[#26344a] flex items-center gap-1">
                    <span>{ctag}</span>
                    <button
                      onClick={() => onRemoveCustomTag(client.id, ctag)}
                      className="text-neutral-400 hover:text-red-400"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex items-center gap-2 self-start md:self-center shrink-0">
            <a
              href={`https://wa.me/55${cleanPhone}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-950/60 hover:bg-emerald-900/60 border border-emerald-600/50 text-emerald-300 text-xs font-medium transition-colors"
              title="Abrir no WhatsApp Oficial"
            >
              <Phone className="w-3.5 h-3.5 text-emerald-400" />
              <span>WhatsApp Web</span>
              <ExternalLink className="w-3 h-3 text-emerald-400 ml-0.5" />
            </a>

            <button
              onClick={() => onOpenNewBoxForClient(client)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-[#c99738] to-[#b3822b] hover:from-[#d8a542] hover:to-[#be8d35] text-black text-xs font-semibold shadow-md shadow-[#c99738]/20 transition-all"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>Montar Mala Condicional</span>
            </button>
          </div>
        </div>

        {/* 4 Essential Retail Fashion Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5 pt-4 border-t border-[#1d2536]">
          <div className="bg-[#0b0e14] p-3 rounded-xl border border-[#1a2231]">
            <span className="text-neutral-400 text-[11px] block">LTV Total (Gasto):</span>
            <span className="font-serif text-base font-bold text-[#f5d061]">
              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalSpent)}
            </span>
          </div>

          <div className="bg-[#0b0e14] p-3 rounded-xl border border-[#1a2231]">
            <span className="text-neutral-400 text-[11px] block">Conversão de Condicional:</span>
            <div className="flex items-center gap-1.5">
              <span className="font-mono text-base font-bold text-emerald-400">
                {client.metrics.condicionalConversionRate}%
              </span>
              <span className="text-[10px] text-neutral-400">({client.metrics.ordersCount} de {client.metrics.condicionaisCount} malas)</span>
            </div>
          </div>

          <div className="bg-[#0b0e14] p-3 rounded-xl border border-[#1a2231]">
            <span className="text-neutral-400 text-[11px] block">Ticket Médio por Mala:</span>
            <span className="font-mono text-base font-semibold text-neutral-200">
              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(client.metrics.averageTicket)}
            </span>
          </div>

          <div className="bg-[#0b0e14] p-3 rounded-xl border border-[#1a2231]">
            <span className="text-neutral-400 text-[11px] block">Última Interação:</span>
            <span className="text-xs font-medium text-neutral-300">
              {new Date(client.metrics.lastInteractionDate).toLocaleDateString('pt-BR')}
            </span>
          </div>
        </div>

        {/* Profile 360 Sub-Navigation Tabs */}
        <div className="flex items-center gap-1.5 mt-5 pt-3 border-t border-[#1d2536] overflow-x-auto">
          {[
            { id: 'MODA', label: '1. Perfil de Moda & Medidas', icon: Ruler },
            { id: 'HISTORICO', label: `2. Histórico Peças & Condicionais (${totalBoughtCount} compradas)`, icon: ShoppingBag },
            { id: 'TIMELINE', label: `3. Linha do Tempo (${client.timeline?.length || 0})`, icon: History },
            { id: 'CONVERSAS', label: `4. Conversas Unificadas (${clientMessages.length})`, icon: MessageSquare },
            { id: 'NOTAS', label: `5. Notas do Curador & Tags (${client.curatorNotes.length})`, icon: Edit3 }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-[#1e2536] text-[#f5d061] border border-[#344158] font-semibold'
                    : 'bg-[#121620] text-neutral-400 hover:text-white hover:bg-[#181d28]'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#c99738]' : 'text-neutral-400'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* TAB 1: PERFIL DE MODA & ANTROPOMETRIA */}
      {activeTab === 'MODA' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Antropometria & Caimentos */}
          <div className="bg-[#10141d] rounded-2xl border border-[#222a3b] p-5 space-y-4">
            <div className="flex items-center gap-2 border-b border-[#1c2434] pb-3">
              <Ruler className="w-4 h-4 text-[#c99738]" />
              <h3 className="font-semibold text-xs text-white uppercase tracking-wider">Ficha Antropométrica & Caimento</h3>
            </div>

            <div className="grid grid-cols-3 gap-2.5">
              <div className="bg-[#0b0e14] p-3 rounded-xl border border-[#1a2231] text-center">
                <span className="text-neutral-400 text-[10px] block">Camisa / Blazer</span>
                <span className="text-xl font-bold text-[#f5d061] font-mono">Tam {client.sizes.shirt}</span>
              </div>

              <div className="bg-[#0b0e14] p-3 rounded-xl border border-[#1a2231] text-center">
                <span className="text-neutral-400 text-[10px] block">Calça / Bermuda</span>
                <span className="text-xl font-bold text-[#f5d061] font-mono">Tam {client.sizes.pants}</span>
              </div>

              <div className="bg-[#0b0e14] p-3 rounded-xl border border-[#1a2231] text-center">
                <span className="text-neutral-400 text-[10px] block">Sapato / Loafer</span>
                <span className="text-xl font-bold text-[#f5d061] font-mono">Nº {client.sizes.shoes}</span>
              </div>
            </div>

            <div className="bg-[#141924] p-3.5 rounded-xl border border-[#20293a] space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-neutral-400">Caimento Predileto:</span>
                <span className="font-semibold text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-800/40">
                  {client.sizes.fitPreference}
                </span>
              </div>
              {client.sizes.heightCm && (
                <div className="flex items-center justify-between text-neutral-300">
                  <span className="text-neutral-400">Altura Estimada:</span>
                  <span>{client.sizes.heightCm} cm</span>
                </div>
              )}
              {client.sizes.weightKg && (
                <div className="flex items-center justify-between text-neutral-300">
                  <span className="text-neutral-400">Peso Estimado:</span>
                  <span>{client.sizes.weightKg} kg</span>
                </div>
              )}
            </div>
          </div>

          {/* DNA de Estilo & Peças Favoritas */}
          <div className="bg-[#10141d] rounded-2xl border border-[#222a3b] p-5 space-y-4">
            <div className="flex items-center gap-2 border-b border-[#1c2434] pb-3">
              <Palette className="w-4 h-4 text-[#c99738]" />
              <h3 className="font-semibold text-xs text-white uppercase tracking-wider">DNA Estético & Peças Preferidas</h3>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <span className="text-neutral-400 text-[11px] block mb-1">Paleta de Cores Preferida:</span>
                <div className="flex flex-wrap gap-1.5">
                  {client.style.palette.map((p, idx) => (
                    <span key={idx} className="px-2.5 py-1 rounded-md bg-[#161c28] border border-[#252f44] text-neutral-200 text-xs">
                      {p}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <span className="text-neutral-400 text-[11px] block mb-1">Tipos de Peça que Mais Compra:</span>
                <div className="flex flex-wrap gap-1.5">
                  {client.style.favoriteCategories.map((c, idx) => (
                    <span key={idx} className="px-2.5 py-1 rounded-md bg-amber-950/30 border border-amber-700/40 text-amber-300 text-xs font-medium">
                      {c}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <span className="text-neutral-400 text-[11px] block mb-1">Peças a Evitar no Condicional:</span>
                <div className="flex flex-wrap gap-1.5">
                  {client.style.avoidItems.map((a, idx) => (
                    <span key={idx} className="px-2.5 py-1 rounded-md bg-red-950/30 border border-red-800/40 text-red-300 text-xs">
                      ✕ {a}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-2 border-t border-[#1c2434]">
                <span className="text-neutral-400 text-[11px] block">Rotina Social & Estilo de Vida:</span>
                <p className="text-neutral-200 text-xs mt-0.5 italic">"{client.style.lifestyle}"</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: HISTÓRICO COMPLETO DE COMPRAS & CONDICIONAIS */}
      {activeTab === 'HISTORICO' && (
        <div className="space-y-4">
          {/* Peças Compradas vs Devolvidas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Peças Compradas */}
            <div className="bg-[#10141d] rounded-2xl border border-[#222a3b] p-5 space-y-3">
              <div className="flex items-center justify-between border-b border-[#1c2434] pb-2">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <h3 className="font-semibold text-xs text-white uppercase tracking-wider">
                    Peças Compradas / No Guarda-Roupa ({client.purchasedPieces?.length || 0})
                  </h3>
                </div>
                <span className="text-xs text-emerald-400 font-mono font-bold">
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(
                    (client.purchasedPieces || []).reduce((acc, p) => acc + p.price, 0)
                  )}
                </span>
              </div>

              <div className="space-y-2 max-h-72 overflow-y-auto">
                {(!client.purchasedPieces || client.purchasedPieces.length === 0) ? (
                  <p className="text-neutral-400 text-xs py-4 text-center">Nenhuma peça faturada ainda.</p>
                ) : (
                  client.purchasedPieces.map(piece => (
                    <div key={piece.id} className="p-2.5 rounded-xl bg-[#0b0e14] border border-[#1b2332] flex items-center justify-between text-xs">
                      <div>
                        <span className="font-semibold text-white block">{piece.title}</span>
                        <span className="text-[11px] text-neutral-400">
                          {piece.category} • {piece.color} • {piece.fit}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="font-serif font-bold text-[#f5d061] block">
                          {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(piece.price)}
                        </span>
                        <span className="text-[10px] text-neutral-400 font-mono">
                          {new Date(piece.date).toLocaleDateString('pt-BR')}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Peças Devolvidas com Motivo */}
            <div className="bg-[#10141d] rounded-2xl border border-[#222a3b] p-5 space-y-3">
              <div className="flex items-center justify-between border-b border-[#1c2434] pb-2">
                <div className="flex items-center gap-2">
                  <RotateCcw className="w-4 h-4 text-amber-400" />
                  <h3 className="font-semibold text-xs text-white uppercase tracking-wider">
                    Peças Devolvidas & Motivos ({client.returnedPieces?.length || 0})
                  </h3>
                </div>
                <span className="text-[11px] text-neutral-400">Inteligência de Fit</span>
              </div>

              <div className="space-y-2 max-h-72 overflow-y-auto">
                {(!client.returnedPieces || client.returnedPieces.length === 0) ? (
                  <p className="text-neutral-400 text-xs py-4 text-center">Nenhuma peça devolvida com registro.</p>
                ) : (
                  client.returnedPieces.map(rp => (
                    <div key={rp.id} className="p-2.5 rounded-xl bg-[#0b0e14] border border-[#1b2332] flex items-center justify-between text-xs">
                      <div>
                        <span className="font-semibold text-white block">{rp.title}</span>
                        <span className="text-[11px] text-amber-300 font-medium">
                          Motivo: {rp.reason}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="px-1.5 py-0.5 rounded bg-[#171e2c] text-neutral-300 font-mono text-[10px] block">
                          Tam {rp.size}
                        </span>
                        <span className="text-[10px] text-neutral-400 font-mono mt-0.5 block">
                          {new Date(rp.date).toLocaleDateString('pt-BR')}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Malas Condicionais Enviadas */}
          <div className="bg-[#10141d] rounded-2xl border border-[#222a3b] p-5 space-y-3">
            <div className="flex items-center justify-between border-b border-[#1c2434] pb-2">
              <div className="flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-[#c99738]" />
                <h3 className="font-semibold text-xs text-white uppercase tracking-wider">
                  Histórico de Malas Condicionais Solicitadas ({clientCondicionais.length})
                </h3>
              </div>
            </div>

            <div className="space-y-2">
              {clientCondicionais.map(box => (
                <div key={box.id} className="p-3 rounded-xl bg-[#0b0e14] border border-[#1b2333] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs text-[#c99738] font-bold">{box.code}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-[#171e2c] text-neutral-200 border border-[#252f40]">
                        {box.status.replace('_', ' ')}
                      </span>
                      <span className="text-neutral-400 text-[11px]">
                        {new Date(box.createdAt).toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                    <div className="text-neutral-300 mt-1">
                      {box.items.length} peças enviadas ({box.items.map(i => i.title).join(', ')})
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-neutral-400 block text-[11px]">
                      Valor Total: {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(box.totalValue)}
                    </span>
                    {box.soldValue > 0 && (
                      <span className="font-bold text-emerald-400 block text-xs">
                        Faturado: {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(box.soldValue)}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: LINHA DO TEMPO DE INTERAÇÕES OMNICHANNEL */}
      {activeTab === 'TIMELINE' && (
        <div className="bg-[#10141d] rounded-2xl border border-[#222a3b] p-5 space-y-4">
          <div className="border-b border-[#1c2434] pb-3">
            <h3 className="font-semibold text-xs text-white uppercase tracking-wider flex items-center gap-2">
              <History className="w-4 h-4 text-[#c99738]" />
              <span>Linha do Tempo Completa de Interações com {client.name}</span>
            </h3>
            <p className="text-xs text-neutral-400 mt-0.5">
              Rastreamento cronológico de mensagens, malas, compras e visitas à loja física em Canoinhas
            </p>
          </div>

          <div className="relative pl-6 space-y-4 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#20293b]">
            {(client.timeline || []).map((event) => {
              const getTypeIcon = () => {
                switch (event.type) {
                  case 'WHATSAPP': return <Phone className="w-3.5 h-3.5 text-emerald-400" />;
                  case 'INSTAGRAM': return <Instagram className="w-3.5 h-3.5 text-pink-400" />;
                  case 'CONDICIONAL': return <Briefcase className="w-3.5 h-3.5 text-[#c99738]" />;
                  case 'PAGAMENTO': return <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />;
                  case 'VISITA_LOJA': return <User className="w-3.5 h-3.5 text-blue-400" />;
                  case 'EMAIL': return <Mail className="w-3.5 h-3.5 text-indigo-400" />;
                  default: return <Sparkles className="w-3.5 h-3.5 text-amber-400" />;
                }
              };

              return (
                <div key={event.id} className="relative group">
                  <span className="absolute -left-6 top-1 w-5 h-5 rounded-full bg-[#121620] border border-[#2a364d] flex items-center justify-center">
                    {getTypeIcon()}
                  </span>

                  <div className="bg-[#0b0e14] p-3.5 rounded-xl border border-[#1b2332] space-y-1 text-xs">
                    <div className="flex items-center justify-between">
                      <strong className="text-white text-xs font-medium">{event.title}</strong>
                      <span className="text-[10px] text-neutral-400 font-mono">{event.timestamp}</span>
                    </div>
                    <p className="text-neutral-300 text-[11px] leading-relaxed">{event.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 4: CONVERSAS UNIFICADAS VINCULADAS AO PERFIL */}
      {activeTab === 'CONVERSAS' && (
        <div className="bg-[#10141d] rounded-2xl border border-[#222a3b] p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-[#1c2434] pb-3">
            <div>
              <h3 className="font-semibold text-xs text-white uppercase tracking-wider flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-[#c99738]" />
                <span>Conversas Unificadas Diretas: WhatsApp / Instagram / E-mail</span>
              </h3>
              <p className="text-xs text-neutral-400 mt-0.5">
                Responda diretamente do perfil 360° sem trocar de tela
              </p>
            </div>

            {/* Channel Switcher */}
            <div className="flex items-center gap-1 bg-[#0b0e14] p-1 rounded-lg border border-[#1d2535] text-[11px]">
              <button
                type="button"
                onClick={() => setActiveChannel('WHATSAPP')}
                className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                  activeChannel === 'WHATSAPP' ? 'bg-emerald-950 text-emerald-300' : 'text-neutral-400'
                }`}
              >
                WhatsApp
              </button>
              <button
                type="button"
                onClick={() => setActiveChannel('INSTAGRAM')}
                className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                  activeChannel === 'INSTAGRAM' ? 'bg-pink-950 text-pink-300' : 'text-neutral-400'
                }`}
              >
                Instagram Direct
              </button>
              <button
                type="button"
                onClick={() => setActiveChannel('EMAIL')}
                className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                  activeChannel === 'EMAIL' ? 'bg-blue-950 text-blue-300' : 'text-neutral-400'
                }`}
              >
                E-mail
              </button>
            </div>
          </div>

          {/* Messages Feed */}
          <div className="bg-[#0b0e14] p-4 rounded-xl border border-[#1b2332] max-h-72 overflow-y-auto space-y-3">
            {clientMessages.length === 0 ? (
              <p className="text-neutral-400 text-xs py-6 text-center">Nenhuma conversa registrada neste canal ainda.</p>
            ) : (
              clientMessages.map(msg => {
                const isCurator = msg.sender === 'CURATOR';
                return (
                  <div key={msg.id} className={`flex flex-col ${isCurator ? 'items-end' : 'items-start'}`}>
                    <div className={`max-w-[80%] rounded-2xl p-3 text-xs leading-relaxed ${
                      isCurator
                        ? 'bg-gradient-to-br from-[#1b2536] to-[#141d2c] border border-[#2b3952] text-neutral-100 rounded-br-xs'
                        : 'bg-[#161a22] border border-[#222836] text-neutral-200 rounded-bl-xs'
                    }`}>
                      <p>{msg.content}</p>
                      <div className="flex items-center justify-end gap-1 text-[10px] text-neutral-400 mt-1">
                        <span>{msg.timestamp}</span>
                        {isCurator && <CheckCheck className="w-3 h-3 text-emerald-400" />}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Inline Reply Input */}
          <form onSubmit={handleSendInlineMsg} className="flex gap-2">
            <input
              type="text"
              placeholder={`Enviar mensagem no ${activeChannel} para ${client.name}...`}
              value={inlineMessage}
              onChange={(e) => setInlineMessage(e.target.value)}
              className="flex-1 bg-[#0b0e14] border border-[#263145] rounded-xl px-4 py-2.5 text-xs text-white placeholder-neutral-400 focus:outline-none focus:border-[#c99738]"
            />
            <button
              type="submit"
              disabled={!inlineMessage.trim()}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white font-medium text-xs shadow-md shadow-emerald-950/40 disabled:opacity-40 transition-all flex items-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Enviar</span>
            </button>
          </form>
        </div>
      )}

      {/* TAB 5: NOTAS DO CURADOR & TAGS DINÂMICAS */}
      {activeTab === 'NOTAS' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Observações Pessoais do Curador */}
          <div className="bg-[#10141d] rounded-2xl border border-[#222a3b] p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-[#1c2434] pb-2">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#c99738]" />
                <h3 className="font-semibold text-xs text-white uppercase tracking-wider">
                  Observações Pessoais do Curador
                </h3>
              </div>
              <span className="text-[10px] text-neutral-400 font-mono">Privado do Time</span>
            </div>

            <div className="space-y-2 max-h-60 overflow-y-auto">
              {client.curatorNotes.map((note, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-[#0b0e14] border border-[#1b2332] text-xs text-neutral-300 flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#c99738] shrink-0 mt-1.5" />
                  <span className="leading-relaxed">{note}</span>
                </div>
              ))}
            </div>

            <form onSubmit={handleAddNote} className="flex gap-2 pt-2">
              <input
                type="text"
                placeholder="Ex: Gosta de peças escuras, evita estampas, gola padre..."
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                className="flex-1 bg-[#0b0e14] border border-[#263145] rounded-xl px-3 py-2 text-xs text-white placeholder-neutral-400 focus:outline-none focus:border-[#c99738]"
              />
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-[#1a2230] hover:bg-[#232e42] border border-[#29364d] text-neutral-200 text-xs font-medium"
              >
                Anotar
              </button>
            </form>
          </div>

          {/* Sistema de Tags & Segmentação */}
          <div className="bg-[#10141d] rounded-2xl border border-[#222a3b] p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-[#1c2434] pb-2">
              <div className="flex items-center gap-2">
                <Tag className="w-4 h-4 text-[#c99738]" />
                <h3 className="font-semibold text-xs text-white uppercase tracking-wider">
                  Tags & Segmentações Dinâmicas
                </h3>
              </div>
              <span className="text-[10px] text-neutral-400">Públicos-Alvo</span>
            </div>

            <div className="space-y-2">
              <span className="text-neutral-400 text-[11px] block">Tags Ativas Vinculadas:</span>
              <div className="flex flex-wrap gap-2">
                {client.customTags.map((tag, idx) => (
                  <span key={idx} className="px-3 py-1.5 rounded-lg text-xs font-medium bg-[#131b26] border border-[#243347] text-[#f5d061] flex items-center gap-2">
                    <span>{tag}</span>
                    <button
                      onClick={() => onRemoveCustomTag(client.id, tag)}
                      className="text-neutral-400 hover:text-red-400 font-bold"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <form onSubmit={handleAddTag} className="flex gap-2 pt-3 border-t border-[#1a2230]">
              <input
                type="text"
                placeholder="Ex: Comprou Camiseta Slim Preta 90d..."
                value={newCustomTag}
                onChange={(e) => setNewCustomTag(e.target.value)}
                className="flex-1 bg-[#0b0e14] border border-[#263145] rounded-xl px-3 py-2 text-xs text-white placeholder-neutral-400 focus:outline-none focus:border-[#c99738]"
              />
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#c99738] to-[#b3822b] text-black font-semibold text-xs shadow-md"
              >
                + Adicionar Tag
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
