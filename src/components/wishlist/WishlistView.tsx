import React, { useState } from 'react';
import { WishlistItem, WishlistStatus, Client, Product } from '../../types/crm';
import { 
  Heart, 
  Sparkles, 
  Search, 
  Plus, 
  User, 
  Phone, 
  Instagram, 
  Check, 
  MessageCircle, 
  Package, 
  Clock, 
  CheckCheck,
  AlertCircle,
  Tag,
  ArrowRight,
  Send,
  X
} from 'lucide-react';

interface WishlistViewProps {
  wishlists: WishlistItem[];
  clients: Client[];
  products: Product[];
  onCreateWishlist: (item: WishlistItem) => void;
  onUpdateWishlistStatus: (id: string, status: WishlistStatus) => void;
  onOpenCondicionalForClient: (client: Client) => void;
}

export const WishlistView: React.FC<WishlistViewProps> = ({
  wishlists,
  clients,
  products,
  onCreateWishlist,
  onUpdateWishlistStatus,
  onOpenCondicionalForClient
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [isNewWishModalOpen, setIsNewWishModalOpen] = useState(false);
  const [notifiedId, setNotifiedId] = useState<string | null>(null);

  // New wish form state
  const [selectedClientId, setSelectedClientId] = useState<string>(clients[0]?.id || '');
  const [categoryRequested, setCategoryRequested] = useState<string>('Sobretudo');
  const [preferredColor, setPreferredColor] = useState<string>('Caramelo / Camel');
  const [preferredSize, setPreferredSize] = useState<string>('M');
  const [maxBudget, setMaxBudget] = useState<number>(2000);
  const [notes, setNotes] = useState<string>('');

  const currentClient = clients.find(c => c.id === selectedClientId) || clients[0];

  const filteredWishes = wishlists.filter(w => {
    const matchesSearch = 
      w.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      w.categoryRequested.toLowerCase().includes(searchTerm.toLowerCase()) ||
      w.preferredColor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      w.notes.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'ALL' || w.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const matchesFoundCount = wishlists.filter(w => w.status === 'PECA_CHEGOU_AVISAR').length;

  const handleNotifyWhatsApp = (wish: WishlistItem) => {
    const cleanPhone = wish.clientPhone.replace(/\D/g, '');
    const text = `Olá, ${wish.clientName.split(' ')[0]}! Tudo bem? 👔✨

Tenho uma novidade maravilhosa para você: a peça que você estava aguardando na sua *Lista de Desejos Ravi's Premium* (${wish.categoryRequested} em tom ${wish.preferredColor}, tamanho ${wish.preferredSize}) acaba de chegar na nossa curadoria exclusiva!

Separamos a unidade para você. Prefere que nosso motorista leve em uma mala de condicional VIP para você provar em casa ou quer passar na loja de Canoinhas para experimentar?`;

    window.open(`https://wa.me/55${cleanPhone}?text=${encodeURIComponent(text)}`, '_blank');
    onUpdateWishlistStatus(wish.id, 'PECA_CHEGOU_AVISAR');
    setNotifiedId(wish.id);
    setTimeout(() => setNotifiedId(null), 3000);
  };

  const handleCreateWishSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentClient) return;

    // Check if there is already a matching product in catalog
    const matched = products.find(p => 
      p.category.toLowerCase().includes(categoryRequested.toLowerCase()) ||
      categoryRequested.toLowerCase().includes(p.category.toLowerCase())
    );

    const newWish: WishlistItem = {
      id: `wish-${Date.now()}`,
      clientId: currentClient.id,
      clientName: currentClient.name,
      clientPhone: currentClient.phone,
      clientInstagram: currentClient.instagram,
      categoryRequested,
      preferredColor,
      preferredSize: preferredSize || currentClient.sizes.shirt,
      maxBudget: Number(maxBudget) || 1500,
      notes: notes || `Cliente aguarda ${categoryRequested} no tamanho ${preferredSize}.`,
      status: matched ? 'PECA_CHEGOU_AVISAR' : 'AGUARDANDO_CURADORIA',
      matchedProductId: matched?.id,
      matchedProductTitle: matched?.title,
      matchedProductImage: matched?.imageUrl,
      createdAt: new Date().toISOString()
    };

    onCreateWishlist(newWish);
    setIsNewWishModalOpen(false);
    setNotes('');
  };

  return (
    <div className="space-y-4">
      {/* Top Header */}
      <div className="bg-[#11141c] p-4 rounded-xl border border-[#1e2533] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-rose-400 fill-rose-500/20" />
            <h2 className="text-base font-semibold text-white">Lista de Desejos dos Clientes (Curadoria Reversa)</h2>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
              {matchesFoundCount} Matches Prontos para Avisar
            </span>
          </div>
          <p className="text-xs text-neutral-400 mt-0.5">
            Registre os desejos de peças que os clientes buscam e receba alertas automáticos quando a peça entrar na curadoria
          </p>
        </div>

        <button
          onClick={() => setIsNewWishModalOpen(true)}
          className="flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-lg bg-gradient-to-r from-[#c99738] to-[#b3822b] hover:from-[#d6a544] hover:to-[#be8d35] text-black text-xs font-semibold transition-all shadow-md shadow-[#c99738]/20 shrink-0"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>+ Registrar Novo Desejo</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#11141c] p-3 rounded-xl border border-[#1e2533]">
        <div className="flex items-center gap-2 flex-1">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar cliente, peça desejada, cor ou notas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#0d1017] border border-[#232a3a] rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder-neutral-400 focus:outline-none focus:border-[#c99738]"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-[#0d1017] border border-[#232a3a] rounded-lg px-2.5 py-2 text-xs text-neutral-300 focus:outline-none focus:border-[#c99738]"
          >
            <option value="ALL">Todos os Status</option>
            <option value="PECA_CHEGOU_AVISAR">Peça Chegou (Avisar Cliente)</option>
            <option value="AGUARDANDO_CURADORIA">Aguardando Curadoria</option>
            <option value="CONVERTIDO_CONDICIONAL">Convertido em Condicional</option>
          </select>
        </div>
      </div>

      {/* Wishlist Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {filteredWishes.map(wish => {
          const isMatch = wish.status === 'PECA_CHEGOU_AVISAR';
          const clientObj = clients.find(c => c.id === wish.clientId);

          return (
            <div 
              key={wish.id}
              className={`p-4 rounded-xl border transition-all flex flex-col justify-between ${
                isMatch 
                  ? 'bg-[#121c17] border-emerald-600/60 shadow-lg shadow-emerald-950/20' 
                  : 'bg-[#10141d] border-[#1e2636]'
              }`}
            >
              <div className="space-y-3">
                {/* Client info & status */}
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-serif font-bold text-white text-base">{wish.clientName}</span>
                      <span className="text-[10px] text-neutral-400 font-mono">{wish.clientPhone}</span>
                    </div>
                    {wish.clientInstagram && (
                      <span className="text-[11px] text-pink-400/90 flex items-center gap-1 mt-0.5">
                        <Instagram className="w-3 h-3" /> {wish.clientInstagram}
                      </span>
                    )}
                  </div>

                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                    isMatch 
                      ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300 animate-pulse' 
                      : 'bg-neutral-800 border-neutral-700 text-neutral-400'
                  }`}>
                    {isMatch ? '✨ PEÇA CHEGOU!' : 'Aguardando Curadoria'}
                  </span>
                </div>

                {/* Desire Details */}
                <div className="bg-[#0b0e15] p-3 rounded-xl border border-[#1a2333] grid grid-cols-3 gap-2 text-xs">
                  <div>
                    <span className="text-neutral-400 text-[10px] block">Peça Desejada:</span>
                    <span className="font-semibold text-white">{wish.categoryRequested}</span>
                  </div>

                  <div>
                    <span className="text-neutral-400 text-[10px] block">Cor & Tom:</span>
                    <span className="text-amber-300 font-medium">{wish.preferredColor}</span>
                  </div>

                  <div>
                    <span className="text-neutral-400 text-[10px] block">Tamanho:</span>
                    <span className="font-mono font-bold text-[#f0cf7e]">Tam {wish.preferredSize}</span>
                  </div>
                </div>

                {/* Notes */}
                <p className="text-xs text-neutral-300 italic bg-[#141923] p-2.5 rounded-lg border border-[#1f2838]">
                  "{wish.notes}"
                </p>

                {/* Match Box Highlight if found */}
                {wish.matchedProductTitle && (
                  <div className="bg-[#0e1713] p-3 rounded-xl border border-emerald-700/50 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      {wish.matchedProductImage && (
                        <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0 border border-emerald-600/40">
                          <img src={wish.matchedProductImage} alt="Match" className="w-full h-full object-cover" />
                        </div>
                      )}
                      <div>
                        <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider block">
                          Match Encontrado no Catálogo:
                        </span>
                        <span className="font-semibold text-white text-xs">{wish.matchedProductTitle}</span>
                      </div>
                    </div>

                    <span className="text-[10px] text-neutral-400">Pronta Entrega</span>
                  </div>
                )}
              </div>

              {/* Actions Bottom */}
              <div className="pt-3 border-t border-[#1a2333] mt-3 flex items-center justify-between gap-2">
                <span className="text-[10px] text-neutral-400">
                  Registrado em {new Date(wish.createdAt).toLocaleDateString('pt-BR')}
                </span>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleNotifyWhatsApp(wish)}
                    className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs flex items-center gap-1.5 shadow-md shadow-emerald-950/40 transition-all"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>{notifiedId === wish.id ? 'Abrindo WhatsApp...' : 'Avisar no WhatsApp'}</span>
                  </button>

                  {clientObj && (
                    <button
                      type="button"
                      onClick={() => onOpenCondicionalForClient(clientObj)}
                      className="px-3 py-1.5 rounded-lg bg-[#182333] hover:bg-[#202e42] text-[#f0cf7e] border border-[#2b3a50] text-xs font-semibold flex items-center gap-1 transition-all"
                    >
                      <Package className="w-3.5 h-3.5" />
                      <span>Montar Mala VIP</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* New Wish Modal */}
      {isNewWishModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-sm overflow-y-auto">
          <div className="bg-[#10141d] border border-[#273245] w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden flex flex-col">
            <div className="px-5 py-4 border-b border-[#212a3b] bg-[#141924] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Heart className="w-5 h-5 text-rose-400" />
                <h3 className="font-semibold text-white text-base">Registrar Desejo do Cliente</h3>
              </div>
              <button onClick={() => setIsNewWishModalOpen(false)} className="text-neutral-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateWishSubmit} className="p-5 space-y-3.5 text-xs">
              <div>
                <label className="text-neutral-300 font-medium block mb-1">Cliente:</label>
                <select
                  value={selectedClientId}
                  onChange={(e) => setSelectedClientId(e.target.value)}
                  className="w-full bg-[#0d1017] border border-[#273245] rounded-lg px-2.5 py-2 text-white text-xs focus:outline-none focus:border-[#c99738]"
                >
                  {clients.map(c => (
                    <option key={c.id} value={c.id}>{c.name} — {c.city}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-neutral-300 font-medium block mb-1">Peça / Categoria:</label>
                  <select
                    value={categoryRequested}
                    onChange={(e) => setCategoryRequested(e.target.value)}
                    className="w-full bg-[#0d1017] border border-[#273245] rounded-lg px-2.5 py-2 text-white text-xs focus:outline-none focus:border-[#c99738]"
                  >
                    <option value="Camiseta Slim">Camiseta Slim</option>
                    <option value="Camiseta Longline">Camiseta Longline</option>
                    <option value="Tricô">Tricô & Malharia</option>
                    <option value="Sobretudo">Sobretudo & Casacos</option>
                    <option value="Cachecol">Cachecol & Acessórios</option>
                    <option value="Calça">Calça de Alfaiataria</option>
                    <option value="Blazers">Blazers Napolitanos</option>
                  </select>
                </div>

                <div>
                  <label className="text-neutral-300 font-medium block mb-1">Tamanho Desejado:</label>
                  <input
                    type="text"
                    value={preferredSize}
                    onChange={(e) => setPreferredSize(e.target.value)}
                    placeholder="P, M, G, 40, 42..."
                    className="w-full bg-[#0d1017] border border-[#273245] rounded-lg px-2.5 py-2 text-white text-xs focus:outline-none focus:border-[#c99738]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-neutral-300 font-medium block mb-1">Cores Preferidas:</label>
                  <input
                    type="text"
                    value={preferredColor}
                    onChange={(e) => setPreferredColor(e.target.value)}
                    placeholder="Ex: Camel, Chumbo, Preto..."
                    className="w-full bg-[#0d1017] border border-[#273245] rounded-lg px-2.5 py-2 text-white text-xs focus:outline-none focus:border-[#c99738]"
                  />
                </div>

                <div>
                  <label className="text-neutral-300 font-medium block mb-1">Orçamento Máximo (R$):</label>
                  <input
                    type="number"
                    value={maxBudget}
                    onChange={(e) => setMaxBudget(Number(e.target.value))}
                    className="w-full bg-[#0d1017] border border-[#273245] rounded-lg px-2.5 py-2 text-white text-xs focus:outline-none focus:border-[#c99738]"
                  />
                </div>
              </div>

              <div>
                <label className="text-neutral-300 font-medium block mb-1">Detalhes e Ocasião:</label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Ex: Cliente quer sobretudo elegante para viagem à serra catarinense..."
                  className="w-full bg-[#0d1017] border border-[#273245] rounded-lg p-2.5 text-white text-xs focus:outline-none focus:border-[#c99738]"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-[#1f2636]">
                <button
                  type="button"
                  onClick={() => setIsNewWishModalOpen(false)}
                  className="px-3.5 py-2 rounded-lg bg-[#18212e] text-neutral-300 hover:text-white"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-[#c99738] hover:bg-[#d6a544] text-black font-semibold text-xs"
                >
                  Salvar Desejo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
