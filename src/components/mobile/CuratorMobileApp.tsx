import React, { useState, useEffect } from 'react';
import { 
  Client, 
  Product, 
  CondicionalBox, 
  CondicionalItem, 
  Order, 
  OrderItem 
} from '../../types/crm';
import { 
  Smartphone, 
  Wifi, 
  WifiOff, 
  RotateCw, 
  CheckCircle2, 
  Calendar, 
  User, 
  Package, 
  QrCode, 
  Camera, 
  ShoppingBag, 
  CheckSquare, 
  Plus, 
  Search, 
  ArrowRight, 
  Phone, 
  Clock, 
  DollarSign, 
  Send, 
  Trash2, 
  Sparkles, 
  Sliders, 
  Check, 
  AlertTriangle,
  ChevronRight,
  ExternalLink,
  MapPin,
  RefreshCw,
  X
} from 'lucide-react';

interface OfflineQueueItem {
  id: string;
  type: 'NOVA_MALA' | 'CHECKIN_ENTREGA' | 'CHECKIN_DEVOLUCAO' | 'VENDA_PDV';
  title: string;
  timestamp: string;
  payload: any;
}

interface CuratorMobileAppProps {
  clients: Client[];
  products: Product[];
  condicionais: CondicionalBox[];
  onOpenCondicionalForClient?: (client: Client) => void;
  onCreateCondicionalBox?: (newBox: CondicionalBox) => void;
  onCreateOrder?: (order: Order) => void;
  onAdvanceCondicionalStatus?: (boxId: string, nextStatus: any) => void;
  onCloseMobileView?: () => void;
}

export const CuratorMobileApp: React.FC<CuratorMobileAppProps> = ({
  clients,
  products,
  condicionais,
  onOpenCondicionalForClient,
  onCreateCondicionalBox,
  onCreateOrder,
  onAdvanceCondicionalStatus,
  onCloseMobileView
}) => {
  // Mobile App Navigation Tab
  const [mobileTab, setMobileTab] = useState<'hoje' | 'mala-express' | 'scanner' | 'camera' | 'checkin' | 'pdv'>('hoje');

  // Offline-First state
  const [isOnline, setIsOnline] = useState<boolean>(true);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [offlineQueue, setOfflineQueue] = useState<OfflineQueueItem[]>([
    {
      id: 'off-1',
      type: 'CHECKIN_ENTREGA',
      title: 'Entrega confirmada para Dr. Guilherme (Centro)',
      timestamp: '11:20',
      payload: { boxId: 'cond-101', signed: true }
    }
  ]);
  const [syncFeedback, setSyncFeedback] = useState<string | null>(null);

  // Mala Express state
  const [selectedClientId, setSelectedClientId] = useState<string>(clients[0]?.id || '');
  const [selectedItemsForBox, setSelectedItemsForBox] = useState<Product[]>([]);
  const [boxCreatedSuccess, setBoxCreatedSuccess] = useState<string | null>(null);

  // Scanner state
  const [scannedSku, setScannedSku] = useState<string>('RAV-LNH-01');
  const [scannedProduct, setScannedProduct] = useState<Product | null>(products[0] || null);
  const [scannerAnimation, setScannerAnimation] = useState<boolean>(true);
  const [scannerMessage, setScannerMessage] = useState<string | null>(null);

  // Camera Box Photo state
  const [capturedBoxPhoto, setCapturedBoxPhoto] = useState<string | null>(
    'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=80'
  );
  const [cameraPhotoSent, setCameraPhotoSent] = useState<boolean>(false);

  // Check-in state
  const [selectedCheckinBoxId, setSelectedCheckinBoxId] = useState<string>(condicionais[0]?.id || '');
  const [checkinStep, setCheckinStep] = useState<'ENTREGA' | 'DEVOLUCAO'>('ENTREGA');
  const [checkinSuccess, setCheckinSuccess] = useState<string | null>(null);
  const [customerSigned, setCustomerSigned] = useState<boolean>(false);

  // PDV Quick Checkout state
  const [pdvCart, setPdvCart] = useState<{ product: Product; size: string; quantity: number }[]>([
    { product: products[0] || {} as any, size: 'M', quantity: 1 }
  ]);
  const [pdvClientId, setPdvClientId] = useState<string>(clients[0]?.id || '');
  const [pdvPaymentMethod, setPdvPaymentMethod] = useState<'PIX' | 'CARTAO' | 'DINHEIRO'>('PIX');
  const [pdvOrderCompleted, setPdvOrderCompleted] = useState<string | null>(null);

  const selectedClient = clients.find(c => c.id === selectedClientId) || clients[0];
  const targetCheckinBox = condicionais.find(c => c.id === selectedCheckinBoxId) || condicionais[0];

  // Helper trigger sync
  const handleSyncQueue = () => {
    if (offlineQueue.length === 0) return;
    setIsSyncing(true);

    setTimeout(() => {
      const count = offlineQueue.length;
      setOfflineQueue([]);
      setIsSyncing(false);
      setSyncFeedback(`${count} operação(ões) sincronizadas com sucesso com o banco de dados Neon/PostgreSQL!`);
      setTimeout(() => setSyncFeedback(null), 4000);
    }, 1200);
  };

  // Add item to offline queue helper
  const addToOfflineQueue = (type: OfflineQueueItem['type'], title: string, payload: any) => {
    const newItem: OfflineQueueItem = {
      id: `off-${Date.now()}`,
      type,
      title,
      timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      payload
    };
    setOfflineQueue(prev => [newItem, ...prev]);
  };

  // Scanner manual search
  const handleScanCode = (sku: string) => {
    setScannedSku(sku);
    setScannerAnimation(true);
    const found = products.find(p => p.code.toLowerCase() === sku.toLowerCase()) || products[0];
    setScannedProduct(found);
    setScannerMessage(`Código "${sku}" identificado: ${found.title}`);
    setTimeout(() => setScannerMessage(null), 3000);
  };

  // Calculate PDV Total
  const pdvSubtotal = pdvCart.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
  const pdvCommission = Math.round(pdvSubtotal * 0.06);

  return (
    <div className="max-w-md mx-auto bg-[#0a0c10] border border-[#222a3a] rounded-3xl overflow-hidden shadow-2xl flex flex-col min-h-[760px] font-sans text-neutral-100 relative">
      {/* Phone Top Notch / Status Bar */}
      <div className="bg-[#07090d] px-5 pt-3 pb-2 flex items-center justify-between text-[11px] text-neutral-400 border-b border-[#181f2c]">
        <div className="flex items-center gap-2">
          <span className="font-bold text-white">09:41</span>
          <span className="text-[10px] bg-neutral-800 text-neutral-300 px-1.5 py-0.2 rounded font-mono">
            Ravi's PWA
          </span>
        </div>

        {/* Offline-First Connection Badge & Simulator Toggle */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setIsOnline(!isOnline);
              if (!isOnline && offlineQueue.length > 0) {
                handleSyncQueue();
              }
            }}
            className={`px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1 transition-colors ${
              isOnline 
                ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-800/50' 
                : 'bg-amber-950/80 text-amber-300 border border-amber-800/50'
            }`}
            title="Clique para simular perda de sinal no interior de Canoinhas"
          >
            {isOnline ? (
              <>
                <Wifi className="w-2.5 h-2.5 text-emerald-400" />
                <span>Online</span>
              </>
            ) : (
              <>
                <WifiOff className="w-2.5 h-2.5 text-amber-400" />
                <span>Offline (Local)</span>
              </>
            )}
          </button>

          {onCloseMobileView && (
            <button
              onClick={onCloseMobileView}
              className="text-neutral-400 hover:text-white"
              title="Voltar ao modo desktop"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Sync Banner if pending operations exist */}
      {offlineQueue.length > 0 && (
        <div className="bg-amber-950/40 border-b border-amber-800/30 px-3.5 py-1.5 flex items-center justify-between text-[11px] text-amber-200">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
            <span>{offlineQueue.length} operação(ões) salvas offline</span>
          </div>

          <button
            onClick={handleSyncQueue}
            disabled={!isOnline || isSyncing}
            className="px-2 py-0.5 rounded bg-[#c99738] text-black font-bold text-[10px] hover:brightness-110 flex items-center gap-1 disabled:opacity-40"
          >
            <RotateCw className={`w-2.5 h-2.5 ${isSyncing ? 'animate-spin' : ''}`} />
            <span>{isSyncing ? 'Sincronizando...' : 'Sincronizar'}</span>
          </button>
        </div>
      )}

      {/* Sync Success Feedback */}
      {syncFeedback && (
        <div className="bg-emerald-950/90 text-emerald-300 px-3 py-2 text-[11px] border-b border-emerald-800/50 flex items-center gap-1.5 animate-in fade-in">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          <span>{syncFeedback}</span>
        </div>
      )}

      {/* App Header */}
      <div className="bg-[#10141d] p-3.5 border-b border-[#1f2637] flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#c99738] to-[#87621e] flex items-center justify-center text-black font-serif font-black text-sm shadow-md">
            R
          </div>
          <div>
            <h1 className="text-xs font-bold text-white tracking-wide flex items-center gap-1">
              <span>RAVI'S CURADOR</span>
              <span className="text-[9px] bg-amber-500/10 text-[#c99738] px-1.5 py-0.2 rounded font-mono">
                Chão de Loja
              </span>
            </h1>
            <p className="text-[10px] text-neutral-400">Canoinhas • Atendente: Matheus Sênior</p>
          </div>
        </div>

        <div className="text-right">
          <span className="text-[9px] text-neutral-400 block">Meta do Dia</span>
          <span className="text-xs font-bold text-[#f5d061] font-mono">R$ 4.800 / 6.000</span>
        </div>
      </div>

      {/* Body Content by Tab */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* TAB 1: HOJE (Clientes do dia, Roteiro e Metas) */}
        {mobileTab === 'hoje' && (
          <div className="space-y-4">
            {/* Quick Action Grid */}
            <div className="grid grid-cols-4 gap-2 text-center text-[10px]">
              <button
                onClick={() => setMobileTab('mala-express')}
                className="p-2.5 rounded-xl bg-[#141924] border border-[#232b3d] hover:border-[#c99738]/50 flex flex-col items-center gap-1 group"
              >
                <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-[#c99738] flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Package className="w-4 h-4" />
                </div>
                <span className="font-semibold text-neutral-200">Nova Mala</span>
              </button>

              <button
                onClick={() => setMobileTab('scanner')}
                className="p-2.5 rounded-xl bg-[#141924] border border-[#232b3d] hover:border-[#c99738]/50 flex flex-col items-center gap-1 group"
              >
                <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <QrCode className="w-4 h-4" />
                </div>
                <span className="font-semibold text-neutral-200">Bipar Peça</span>
              </button>

              <button
                onClick={() => setMobileTab('camera')}
                className="p-2.5 rounded-xl bg-[#141924] border border-[#232b3d] hover:border-[#c99738]/50 flex flex-col items-center gap-1 group"
              >
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Camera className="w-4 h-4" />
                </div>
                <span className="font-semibold text-neutral-200">Foto Mala</span>
              </button>

              <button
                onClick={() => setMobileTab('pdv')}
                className="p-2.5 rounded-xl bg-[#141924] border border-[#232b3d] hover:border-[#c99738]/50 flex flex-col items-center gap-1 group"
              >
                <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <ShoppingBag className="w-4 h-4" />
                </div>
                <span className="font-semibold text-neutral-200">PDV Móvel</span>
              </button>
            </div>

            {/* Clientes e Roteiro de Hoje */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-[#c99738]" />
                  <span>Atendimentos & Visitas de Hoje</span>
                </span>
                <span className="text-[10px] text-neutral-400 font-mono">
                  3 agendados
                </span>
              </div>

              {clients.slice(0, 3).map((c, idx) => (
                <div
                  key={c.id}
                  className="p-3 rounded-xl bg-[#121620] border border-[#1f2637] flex items-center justify-between text-xs hover:border-[#c99738]/40 transition-colors"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white">{c.name}</span>
                      <span className="text-[9px] bg-[#1a202c] text-neutral-300 px-1.5 py-0.2 rounded border border-neutral-700">
                        {c.sizes.shirt} • {c.sizes.fitPreference}
                      </span>
                    </div>
                    <p className="text-[11px] text-neutral-400 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-[#c99738]" />
                      <span>{c.neighborhood}, {c.city}</span>
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      setSelectedClientId(c.id);
                      setMobileTab('mala-express');
                    }}
                    className="p-2 rounded-lg bg-amber-500/10 text-[#c99738] hover:bg-amber-500/20 text-[11px] font-bold flex items-center gap-1"
                  >
                    <span>Montar</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>

            {/* Malas em Teste que Vencem Hoje */}
            <div className="p-3.5 rounded-xl bg-[#141924] border border-[#222a3b] space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-white flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                  <span>Malas Vencendo Hoje em Canoinhas</span>
                </span>
                <span className="text-[10px] bg-amber-950 text-amber-300 px-1.5 py-0.2 rounded font-bold">
                  2 Recolhimentos
                </span>
              </div>

              <div className="p-2.5 rounded-lg bg-[#0c0e12] border border-[#1f2637] flex items-center justify-between">
                <div>
                  <span className="font-semibold text-white block">Dr. Guilherme Schramm</span>
                  <span className="text-[10px] text-neutral-400">Mala COND-2026-089 (4 peças • R$ 2.450)</span>
                </div>
                <button
                  onClick={() => {
                    setSelectedCheckinBoxId('cond-101');
                    setCheckinStep('DEVOLUCAO');
                    setMobileTab('checkin');
                  }}
                  className="px-2.5 py-1 rounded bg-[#c99738] text-black font-bold text-[10px]"
                >
                  Fazer Check-in
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: MALA EXPRESS (Montagem Arrastando Peças) */}
        {mobileTab === 'mala-express' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-[#1c2433] pb-2">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <Package className="w-3.5 h-3.5 text-[#c99738]" />
                <span>Montagem Expressa de Seleção</span>
              </span>
              <span className="text-[10px] text-neutral-400">
                {selectedItemsForBox.length} peças na caixa
              </span>
            </div>

            {/* Client Picker */}
            <div>
              <label className="block text-[11px] text-neutral-400 font-medium mb-1">
                Cliente Selecionado
              </label>
              <select
                value={selectedClientId}
                onChange={(e) => setSelectedClientId(e.target.value)}
                className="w-full bg-[#141924] border border-[#232b3d] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#c99738]"
              >
                {clients.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.sizes.shirt} • {c.sizes.fitPreference})
                  </option>
                ))}
              </select>
            </div>

            {/* Active Box Preview Banner */}
            <div className="p-3 rounded-xl bg-[#141924] border border-[#283449] space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-white">Mala em Montagem</span>
                <span className="font-mono font-bold text-[#f5d061]">
                  R$ {selectedItemsForBox.reduce((acc, i) => acc + i.price, 0).toLocaleString('pt-BR')}
                </span>
              </div>

              {selectedItemsForBox.length === 0 ? (
                <div className="p-3 text-center text-neutral-500 text-[11px] border border-dashed border-[#232b3d] rounded-lg">
                  Toque em "+" nas peças abaixo para incluir na mala do cliente.
                </div>
              ) : (
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {selectedItemsForBox.map((item, idx) => (
                    <div key={idx} className="w-16 shrink-0 relative bg-[#0c0e12] rounded-lg p-1 border border-[#232b3d]">
                      <img src={item.imageUrl} alt={item.title} className="w-full h-14 object-cover rounded" />
                      <span className="text-[9px] text-white block truncate mt-0.5 font-medium">{item.title}</span>
                      <button
                        onClick={() => setSelectedItemsForBox(prev => prev.filter((_, i) => i !== idx))}
                        className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-600 text-white flex items-center justify-center text-[10px]"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Catalog Selector */}
            <div className="space-y-2">
              <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider block">
                Catálogo (Edições Limitadas Disponíveis)
              </span>

              <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                {products.map(p => {
                  const isAdded = selectedItemsForBox.some(i => i.id === p.id);
                  return (
                    <div
                      key={p.id}
                      className="p-2 rounded-xl bg-[#121620] border border-[#1f2637] flex items-center justify-between gap-2 text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <img src={p.imageUrl} alt={p.title} className="w-10 h-10 object-cover rounded-lg shrink-0" />
                        <div>
                          <span className="font-semibold text-white block truncate max-w-[170px]">{p.title}</span>
                          <span className="text-[10px] text-neutral-400">
                            {p.category} • R$ {p.price} • {p.code}
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          if (isAdded) {
                            setSelectedItemsForBox(prev => prev.filter(i => i.id !== p.id));
                          } else {
                            setSelectedItemsForBox(prev => [...prev, p]);
                          }
                        }}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                          isAdded 
                            ? 'bg-rose-950/60 text-rose-300 border border-rose-800/40' 
                            : 'bg-gradient-to-r from-[#c99738] to-[#b07d24] text-black shadow-sm'
                        }`}
                      >
                        {isAdded ? 'Remover' : '+ Incluir'}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Confirm Dispatch Button */}
            <button
              onClick={() => {
                if (selectedItemsForBox.length === 0) return;
                addToOfflineQueue(
                  'NOVA_MALA',
                  `Nova mala montada para ${selectedClient.name} (${selectedItemsForBox.length} peças)`,
                  { clientId: selectedClient.id, items: selectedItemsForBox }
                );
                setBoxCreatedSuccess(`Mala de ${selectedClient.name} finalizada e salva com sucesso!`);
                setSelectedItemsForBox([]);
                setTimeout(() => setBoxCreatedSuccess(null), 3500);
              }}
              disabled={selectedItemsForBox.length === 0}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-[#c99738] to-[#b07d24] text-black font-bold text-xs hover:brightness-110 flex items-center justify-center gap-2 disabled:opacity-40 shadow-lg shadow-amber-950/40"
            >
              <CheckCircle2 className="w-4 h-4 fill-black" />
              <span>Concluir Seleção & Bloquear Estoque</span>
            </button>

            {boxCreatedSuccess && (
              <div className="p-3 bg-emerald-950/80 border border-emerald-800/50 text-emerald-300 rounded-xl text-xs flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{boxCreatedSuccess}</span>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: SCANNER DE PEÇA (Barcode / QR Code / SKU) */}
        {mobileTab === 'scanner' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-[#1c2433] pb-2">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <QrCode className="w-3.5 h-3.5 text-[#c99738]" />
                <span>Bipador & Leitor de Etiquetas</span>
              </span>
              <span className="text-[10px] text-emerald-400 font-mono">Laser Ativo</span>
            </div>

            {/* Simulated Camera Scanner Viewfinder */}
            <div className="relative h-44 rounded-2xl bg-black border border-[#232b3d] overflow-hidden flex flex-col items-center justify-center">
              {/* Animated Laser Line */}
              {scannerAnimation && (
                <div className="absolute w-full h-0.5 bg-rose-500 shadow-[0_0_12px_#f43f5e] animate-bounce top-1/2" />
              )}

              {/* Viewfinder Target Frame */}
              <div className="w-48 h-28 border-2 border-dashed border-[#c99738]/80 rounded-xl flex items-center justify-center">
                <span className="text-[10px] text-neutral-400 bg-black/60 px-2 py-0.5 rounded">
                  Aponte para o código de barras
                </span>
              </div>

              <div className="absolute bottom-2 text-[10px] text-neutral-500 font-mono">
                SKU Atual: {scannedSku}
              </div>
            </div>

            {/* SKU Quick Selectors for Testing in Store */}
            <div className="space-y-1.5">
              <span className="text-[10px] text-neutral-400 font-semibold block">
                Bipar Código de Amostra (Simulador):
              </span>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {products.slice(0, 4).map(p => (
                  <button
                    key={p.id}
                    onClick={() => handleScanCode(p.code)}
                    className="p-2 rounded-lg bg-[#141924] border border-[#232b3d] hover:border-[#c99738] text-left transition-colors"
                  >
                    <span className="font-mono text-[10px] text-[#c99738] block">{p.code}</span>
                    <span className="text-neutral-200 block truncate text-[11px] font-medium">{p.title}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Scanned Product Card */}
            {scannedProduct && (
              <div className="p-3.5 rounded-2xl bg-[#121620] border border-[#2a354c] space-y-2.5">
                <div className="flex items-center gap-3">
                  <img
                    src={scannedProduct.imageUrl}
                    alt={scannedProduct.title}
                    className="w-12 h-12 object-cover rounded-xl border border-[#232b3d]"
                  />
                  <div>
                    <h4 className="font-bold text-xs text-white">{scannedProduct.title}</h4>
                    <span className="text-[11px] text-[#f5d061] font-mono font-bold">
                      R$ {scannedProduct.price} • {scannedProduct.category}
                    </span>
                    <span className="text-[10px] text-neutral-400 block mt-0.5">
                      Edição Limitada (Restam 2 unidades)
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1 border-t border-[#1f2637]">
                  <button
                    onClick={() => {
                      setSelectedItemsForBox(prev => [...prev, scannedProduct]);
                      setScannerMessage(`"${scannedProduct.title}" incluído na mala!`);
                      setTimeout(() => setScannerMessage(null), 2500);
                    }}
                    className="py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-[#c99738] border border-amber-500/30 text-xs font-bold"
                  >
                    + Adicionar à Mala
                  </button>

                  <button
                    onClick={() => {
                      setPdvCart(prev => [...prev, { product: scannedProduct, size: 'M', quantity: 1 }]);
                      setScannerMessage(`"${scannedProduct.title}" enviado ao PDV!`);
                      setTimeout(() => setScannerMessage(null), 2500);
                    }}
                    className="py-2 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 border border-purple-500/30 text-xs font-bold"
                  >
                    + Vender no PDV
                  </button>
                </div>
              </div>
            )}

            {scannerMessage && (
              <div className="p-2.5 bg-emerald-950/80 border border-emerald-800/50 text-emerald-300 rounded-xl text-xs flex items-center gap-1.5 animate-in fade-in">
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>{scannerMessage}</span>
              </div>
            )}
          </div>
        )}

        {/* TAB 4: CÂMERA (Fotografar Caixa & Lookbook WhatsApp) */}
        {mobileTab === 'camera' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-[#1c2433] pb-2">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <Camera className="w-3.5 h-3.5 text-[#c99738]" />
                <span>Fotografar Caixa & Enviar Lookbook</span>
              </span>
              <span className="text-[10px] text-neutral-400">Canoinhas VIP</span>
            </div>

            {/* Camera Viewfinder Preview */}
            <div className="relative rounded-2xl overflow-hidden border border-[#232b3d] bg-black shadow-lg">
              <img
                src={capturedBoxPhoto || 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=80'}
                alt="Caixa Ravi's Montada"
                className="w-full h-48 object-cover"
              />
              <div className="absolute top-2 left-2 bg-black/70 backdrop-blur px-2.5 py-1 rounded-lg border border-amber-500/30 flex items-center gap-1.5 text-[10px] text-amber-300 font-bold">
                <Sparkles className="w-3 h-3 text-[#c99738]" />
                <span>Curadoria Ravi's Premium</span>
              </div>

              <div className="absolute bottom-2 right-2 bg-black/80 px-2 py-0.5 rounded text-[10px] text-neutral-400 font-mono">
                {new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>

            {/* Photo Capture Controls */}
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => {
                  setCapturedBoxPhoto('https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&w=800&q=80');
                  setCameraPhotoSent(false);
                }}
                className="px-3 py-1.5 rounded-xl bg-[#141924] border border-[#232b3d] text-xs text-neutral-300"
              >
                Tirar Outra Foto
              </button>
            </div>

            {/* WhatsApp Dispatch Section */}
            <div className="p-3.5 rounded-2xl bg-[#121620] border border-[#222a3b] space-y-2.5 text-xs">
              <span className="font-bold text-white block">
                Disparar WhatsApp para o Cliente com Foto e Link
              </span>

              <div className="p-2.5 rounded-lg bg-[#0c0e12] border border-[#1f2637] text-[11px] text-neutral-300 space-y-1">
                <p className="font-semibold text-emerald-400">Mensagem gerada:</p>
                <p className="italic text-neutral-400 font-sans">
                  "Olá, Dr. Guilherme! Sua mala de curadoria exclusiva já está montada com nosso motorista VIP. Segue a foto da sua seleção..."
                </p>
              </div>

              <button
                onClick={() => {
                  setCameraPhotoSent(true);
                  setTimeout(() => setCameraPhotoSent(false), 4000);
                }}
                className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/40"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Enviar Foto & Link via WhatsApp</span>
              </button>
            </div>

            {cameraPhotoSent && (
              <div className="p-3 bg-emerald-950/90 border border-emerald-800/50 text-emerald-300 rounded-xl text-xs flex items-center gap-2 animate-in fade-in">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Foto da mala enviada no WhatsApp de Dr. Guilherme Schramm!</span>
              </div>
            )}
          </div>
        )}

        {/* TAB 5: CHECK-IN (Retirada & Devolução com Assinatura) */}
        {mobileTab === 'checkin' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-[#1c2433] pb-2">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <CheckSquare className="w-3.5 h-3.5 text-[#c99738]" />
                <span>Check-in de Retirada & Devolução</span>
              </span>

              {/* Step Toggle */}
              <div className="flex bg-[#141924] p-0.5 rounded-lg border border-[#232b3d] text-[10px]">
                <button
                  onClick={() => setCheckinStep('ENTREGA')}
                  className={`px-2 py-0.5 rounded font-bold ${
                    checkinStep === 'ENTREGA' ? 'bg-[#c99738] text-black' : 'text-neutral-400'
                  }`}
                >
                  Entrega
                </button>
                <button
                  onClick={() => setCheckinStep('DEVOLUCAO')}
                  className={`px-2 py-0.5 rounded font-bold ${
                    checkinStep === 'DEVOLUCAO' ? 'bg-[#c99738] text-black' : 'text-neutral-400'
                  }`}
                >
                  Devolução
                </button>
              </div>
            </div>

            {/* Select Target Condicional */}
            <div>
              <label className="block text-[11px] text-neutral-400 font-medium mb-1">
                Selecione a Mala do Cliente
              </label>
              <select
                value={selectedCheckinBoxId}
                onChange={(e) => setSelectedCheckinBoxId(e.target.value)}
                className="w-full bg-[#141924] border border-[#232b3d] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#c99738]"
              >
                {condicionais.map(b => (
                  <option key={b.id} value={b.id}>
                    {b.code} • {b.clientName} ({b.status})
                  </option>
                ))}
              </select>
            </div>

            {/* Checklist of Items */}
            {targetCheckinBox && (
              <div className="p-3.5 rounded-2xl bg-[#121620] border border-[#222a3b] space-y-2.5 text-xs">
                <div className="flex items-center justify-between border-b border-[#1f2637] pb-2">
                  <span className="font-bold text-white">
                    {checkinStep === 'ENTREGA' ? 'Conferência de Peças na Entrega' : 'Conferência de Retorno (Devolução)'}
                  </span>
                  <span className="text-[10px] text-amber-400 font-mono">
                    {targetCheckinBox.items.length} itens
                  </span>
                </div>

                <div className="space-y-1.5">
                  {targetCheckinBox.items.map(item => (
                    <div key={item.id} className="p-2 rounded-lg bg-[#0c0e12] border border-[#1f2637] flex items-center justify-between text-xs">
                      <div>
                        <span className="font-semibold text-white block">{item.title}</span>
                        <span className="text-[10px] text-neutral-400">Tam: {item.size} • R$ {item.price}</span>
                      </div>
                      <span className="text-[10px] text-emerald-400 font-bold bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800/40">
                        {item.status}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Digital Signature Simulated Box */}
                <div className="pt-2">
                  <label className="block text-[11px] text-neutral-400 font-medium mb-1 flex items-center justify-between">
                    <span>Assinatura Digital do Cliente / Motorista</span>
                    <button
                      onClick={() => setCustomerSigned(true)}
                      className="text-[10px] text-[#c99738] font-bold underline"
                    >
                      Assinar na Tela
                    </button>
                  </label>
                  <div
                    onClick={() => setCustomerSigned(true)}
                    className="h-16 rounded-xl bg-[#0c0e12] border border-dashed border-[#283448] flex items-center justify-center cursor-pointer"
                  >
                    {customerSigned ? (
                      <span className="font-serif italic text-amber-300 text-lg">Guilherme Schramm ✓</span>
                    ) : (
                      <span className="text-[11px] text-neutral-600">Toque aqui para assinar</span>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => {
                    addToOfflineQueue(
                      checkinStep === 'ENTREGA' ? 'CHECKIN_ENTREGA' : 'CHECKIN_DEVOLUCAO',
                      `Check-in de ${checkinStep} da mala ${targetCheckinBox.code}`,
                      { boxId: targetCheckinBox.id, signed: customerSigned }
                    );
                    setCheckinSuccess(`Check-in de ${checkinStep} registrado com sucesso!`);
                    setCustomerSigned(false);
                    setTimeout(() => setCheckinSuccess(null), 3500);
                  }}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#c99738] to-[#b07d24] text-black font-bold text-xs flex items-center justify-center gap-1.5 shadow-md"
                >
                  <Check className="w-4 h-4 fill-black" />
                  <span>Confirmar Check-in no Sistema</span>
                </button>
              </div>
            )}

            {checkinSuccess && (
              <div className="p-3 bg-emerald-950/80 border border-emerald-800/50 text-emerald-300 rounded-xl text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{checkinSuccess}</span>
              </div>
            )}
          </div>
        )}

        {/* TAB 6: PDV RÁPIDO (Caixa Móvel no Chão de Loja) */}
        {mobileTab === 'pdv' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-[#1c2433] pb-2">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <ShoppingBag className="w-3.5 h-3.5 text-[#c99738]" />
                <span>PDV Simplificado na Palma da Mão</span>
              </span>
              <span className="text-[10px] text-[#f5d061] font-mono font-bold">
                Comissão: R$ {pdvCommission}
              </span>
            </div>

            {/* Select Customer */}
            <div>
              <label className="block text-[11px] text-neutral-400 font-medium mb-1">
                Cliente Comprador
              </label>
              <select
                value={pdvClientId}
                onChange={(e) => setPdvClientId(e.target.value)}
                className="w-full bg-[#141924] border border-[#232b3d] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#c99738]"
              >
                {clients.map(c => (
                  <option key={c.id} value={c.id}>{c.name} ({c.phone})</option>
                ))}
              </select>
            </div>

            {/* Cart Items */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-[11px] text-neutral-400">
                <span>Carrinho ({pdvCart.length} itens)</span>
                <span className="text-white font-bold font-mono">
                  Total: R$ {pdvSubtotal.toLocaleString('pt-BR')}
                </span>
              </div>

              {pdvCart.map((item, idx) => (
                <div key={idx} className="p-2.5 rounded-xl bg-[#121620] border border-[#1f2637] flex items-center justify-between text-xs">
                  <div>
                    <span className="font-semibold text-white block">{item.product.title}</span>
                    <span className="text-[10px] text-neutral-400">Tam: {item.size} • R$ {item.product.price}</span>
                  </div>

                  <button
                    onClick={() => setPdvCart(prev => prev.filter((_, i) => i !== idx))}
                    className="p-1 text-neutral-400 hover:text-rose-400"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            {/* Payment Method Selector */}
            <div className="space-y-1.5">
              <span className="text-[11px] text-neutral-400 font-medium block">
                Forma de Pagamento
              </span>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <button
                  onClick={() => setPdvPaymentMethod('PIX')}
                  className={`py-2 rounded-xl border text-center font-bold ${
                    pdvPaymentMethod === 'PIX'
                      ? 'bg-emerald-950 text-emerald-300 border-emerald-700'
                      : 'bg-[#141924] border-[#232b3d] text-neutral-400'
                  }`}
                >
                  Pix Instantâneo
                </button>

                <button
                  onClick={() => setPdvPaymentMethod('CARTAO')}
                  className={`py-2 rounded-xl border text-center font-bold ${
                    pdvPaymentMethod === 'CARTAO'
                      ? 'bg-blue-950 text-blue-300 border-blue-700'
                      : 'bg-[#141924] border-[#232b3d] text-neutral-400'
                  }`}
                >
                  Maquininha PDV
                </button>

                <button
                  onClick={() => setPdvPaymentMethod('DINHEIRO')}
                  className={`py-2 rounded-xl border text-center font-bold ${
                    pdvPaymentMethod === 'DINHEIRO'
                      ? 'bg-amber-950 text-amber-300 border-amber-700'
                      : 'bg-[#141924] border-[#232b3d] text-neutral-400'
                  }`}
                >
                  Dinheiro
                </button>
              </div>
            </div>

            {/* Finalize Button */}
            <button
              onClick={() => {
                if (pdvCart.length === 0) return;
                addToOfflineQueue(
                  'VENDA_PDV',
                  `Venda PDV de R$ ${pdvSubtotal} concluída`,
                  { clientId: pdvClientId, cart: pdvCart, method: pdvPaymentMethod }
                );
                setPdvOrderCompleted(`Venda de R$ ${pdvSubtotal} realizada com sucesso!`);
                setPdvCart([]);
                setTimeout(() => setPdvOrderCompleted(null), 3500);
              }}
              disabled={pdvCart.length === 0}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-[#c99738] to-[#b07d24] text-black font-bold text-xs hover:brightness-110 flex items-center justify-center gap-2 shadow-lg shadow-amber-950/40 disabled:opacity-40"
            >
              <DollarSign className="w-4 h-4 stroke-[2.5]" />
              <span>Finalizar Venda (R$ {pdvSubtotal.toLocaleString('pt-BR')})</span>
            </button>

            {pdvOrderCompleted && (
              <div className="p-3 bg-emerald-950/90 border border-emerald-800/50 text-emerald-300 rounded-xl text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{pdvOrderCompleted}</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Bottom App Navigation Bar (PWA Mobile Bar) */}
      <div className="bg-[#0c0e12] border-t border-[#1c2433] grid grid-cols-6 p-1.5 text-center text-[10px]">
        <button
          onClick={() => setMobileTab('hoje')}
          className={`py-1.5 rounded-xl flex flex-col items-center gap-0.5 transition-colors ${
            mobileTab === 'hoje' ? 'text-[#c99738] font-bold' : 'text-neutral-400 hover:text-white'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Hoje</span>
        </button>

        <button
          onClick={() => setMobileTab('mala-express')}
          className={`py-1.5 rounded-xl flex flex-col items-center gap-0.5 transition-colors ${
            mobileTab === 'mala-express' ? 'text-[#c99738] font-bold' : 'text-neutral-400 hover:text-white'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>Mala</span>
        </button>

        <button
          onClick={() => setMobileTab('scanner')}
          className={`py-1.5 rounded-xl flex flex-col items-center gap-0.5 transition-colors ${
            mobileTab === 'scanner' ? 'text-[#c99738] font-bold' : 'text-neutral-400 hover:text-white'
          }`}
        >
          <QrCode className="w-4 h-4" />
          <span>Bipar</span>
        </button>

        <button
          onClick={() => setMobileTab('camera')}
          className={`py-1.5 rounded-xl flex flex-col items-center gap-0.5 transition-colors ${
            mobileTab === 'camera' ? 'text-[#c99738] font-bold' : 'text-neutral-400 hover:text-white'
          }`}
        >
          <Camera className="w-4 h-4" />
          <span>Foto</span>
        </button>

        <button
          onClick={() => setMobileTab('checkin')}
          className={`py-1.5 rounded-xl flex flex-col items-center gap-0.5 transition-colors ${
            mobileTab === 'checkin' ? 'text-[#c99738] font-bold' : 'text-neutral-400 hover:text-white'
          }`}
        >
          <CheckSquare className="w-4 h-4" />
          <span>Check-in</span>
        </button>

        <button
          onClick={() => setMobileTab('pdv')}
          className={`py-1.5 rounded-xl flex flex-col items-center gap-0.5 transition-colors ${
            mobileTab === 'pdv' ? 'text-[#c99738] font-bold' : 'text-neutral-400 hover:text-white'
          }`}
        >
          <ShoppingBag className="w-4 h-4" />
          <span>PDV</span>
        </button>
      </div>
    </div>
  );
};
