import React, { useState } from 'react';
import { CondicionalBox } from '../../types/crm';
import { 
  X, 
  MessageCircle, 
  Send, 
  ExternalLink, 
  Copy, 
  Check, 
  Smartphone, 
  Sparkles, 
  CheckCheck,
  ShieldCheck,
  Clock,
  Image as ImageIcon
} from 'lucide-react';

interface WhatsAppCondicionalModalProps {
  box: CondicionalBox | null;
  isOpen: boolean;
  onClose: () => void;
  onSendSimulation: (boxId: string, messageText: string) => void;
  onConfirmClientReceipt?: (boxId: string) => void;
}

export const WhatsAppCondicionalModal: React.FC<WhatsAppCondicionalModalProps> = ({
  box,
  isOpen,
  onClose,
  onSendSimulation,
  onConfirmClientReceipt
}) => {
  const [copiedText, setCopiedText] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [sentSuccess, setSentSuccess] = useState(false);

  if (!isOpen || !box) return null;

  const confirmationUrl = `https://ravispremium.com.br/condicional/confirmar/${box.confirmationToken}`;

  // Formatted luxury WhatsApp copy with itemized capsule and photos description
  const formattedMessage = `Olá, ${box.clientName.split(' ')[0]}! Tudo bem? 👔✨

Aqui é o *${box.curatorName}*, curador da *Ravi's Premium* em Canoinhas.

Sua *Mala de Condicional VIP (${box.code})* foi montada exclusivamente com base no seu perfil e medidas. Segue a relação das peças selecionadas:

${box.items.map((item, idx) => `• *${item.title}* (Tam. ${item.size}) — ${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.price)}`).join('\n')}

💰 *Valor total da seleção:* ${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(box.totalValue)}
📦 *Prazo de prova em casa:* ${box.testDurationDays || 7} dias no conforto do seu lar.
🚗 *Entrega:* ${box.deliveryMethod}

📸 *Confira as fotos em alta resolução de cada look e confirme o recebimento no link:*
👉 ${confirmationUrl}

Qualquer dúvida sobre combinações, caimento ou ajuste, estou 100% à sua disposição por aqui!`;

  const handleCopyMessage = () => {
    navigator.clipboard?.writeText(formattedMessage);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2000);
  };

  const handleCopyLink = () => {
    navigator.clipboard?.writeText(confirmationUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleSendViaEvolutionAPI = () => {
    setIsSending(true);
    setTimeout(() => {
      setIsSending(false);
      setSentSuccess(true);
      onSendSimulation(box.id, formattedMessage);
      setTimeout(() => {
        setSentSuccess(false);
        onClose();
      }, 1500);
    }, 900);
  };

  const handleOpenWhatsAppWeb = () => {
    const cleanPhone = box.clientPhone.replace(/\D/g, '');
    const encoded = encodeURIComponent(formattedMessage);
    window.open(`https://wa.me/55${cleanPhone}?text=${encoded}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-sm overflow-y-auto">
      <div className="bg-[#0f131c] border border-[#273247] w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-5 py-4 border-b border-[#212a3b] bg-[#141924] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <MessageCircle className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-semibold text-white">Disparo WhatsApp Business & Confirmação</h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 border border-emerald-500/30 text-emerald-300">
                  Evolution API Integrada
                </span>
              </div>
              <p className="text-xs text-neutral-400">
                Envio automático da seleção com fotos, itens e link único de confirmação do cliente
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

        {/* Content Body */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1 text-xs">
          {/* Recipient summary */}
          <div className="bg-[#141924] p-3.5 rounded-xl border border-[#20293b] flex flex-wrap items-center justify-between gap-3">
            <div>
              <span className="text-neutral-400 text-[11px] block">Destinatário VIP:</span>
              <span className="font-semibold text-white text-sm">{box.clientName}</span>
              <span className="text-neutral-400 text-xs ml-2 font-mono">{box.clientPhone}</span>
            </div>
            <div className="text-right">
              <span className="text-neutral-400 text-[11px] block">Mala Selecionada:</span>
              <span className="font-mono text-[#c99738] font-bold">{box.code}</span>
              <span className="text-neutral-300 text-xs ml-2">({box.items.length} peças • {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(box.totalValue)})</span>
            </div>
          </div>

          {/* Lookbook Gallery of Items with Photos */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-neutral-300">
              <span className="font-semibold flex items-center gap-1.5 text-xs text-white">
                <ImageIcon className="w-4 h-4 text-[#c99738]" />
                <span>Fotos das Peças Anexadas à Mensagem ({box.items.length})</span>
              </span>
              <span className="text-[11px] text-neutral-400">Enviadas em carrossel HD</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {box.items.map((item, idx) => (
                <div key={idx} className="bg-[#121622] rounded-xl border border-[#212b3d] overflow-hidden group">
                  <div className="h-28 w-full bg-[#1b2230] relative overflow-hidden">
                    {item.imageUrl ? (
                      <img 
                        src={item.imageUrl} 
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-neutral-500">
                        <ImageIcon className="w-8 h-8" />
                      </div>
                    )}
                    <span className="absolute top-1.5 right-1.5 px-1.5 py-0.5 rounded bg-black/75 text-[10px] font-mono text-amber-300 border border-white/10">
                      Tam {item.size}
                    </span>
                  </div>
                  <div className="p-2">
                    <p className="font-medium text-white text-[11px] truncate">{item.title}</p>
                    <p className="text-[#f0cf7e] font-semibold text-[11px]">
                      {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.price)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Interactive Confirmation Link Preview */}
          <div className="bg-[#0b0e15] p-3.5 rounded-xl border border-dashed border-[#2b374c] space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-neutral-300 font-semibold flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Link Exclusivo de Confirmação do Cliente (Self-Service)</span>
              </span>
              <button
                type="button"
                onClick={handleCopyLink}
                className="flex items-center gap-1 text-[11px] text-emerald-400 hover:text-emerald-300"
              >
                {copiedLink ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedLink ? 'Copiado!' : 'Copiar Link'}</span>
              </button>
            </div>
            
            <div className="flex items-center justify-between bg-[#141924] px-3 py-2 rounded-lg border border-[#1e2738] font-mono text-[11px] text-neutral-300 overflow-x-auto">
              <span className="truncate mr-2">{confirmationUrl}</span>
              <span className={`px-2 py-0.5 rounded text-[10px] font-semibold shrink-0 ${
                box.isConfirmedByClient 
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' 
                  : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
              }`}>
                {box.isConfirmedByClient ? '✓ Confirmado pelo Cliente' : 'Aguardando Confirmação'}
              </span>
            </div>

            {/* Client action simulator */}
            {!box.isConfirmedByClient && onConfirmClientReceipt && (
              <div className="pt-1 flex items-center justify-between text-[11px] text-neutral-400">
                <span>Simular confirmação automática pelo cliente:</span>
                <button
                  type="button"
                  onClick={() => onConfirmClientReceipt(box.id)}
                  className="px-2.5 py-1 rounded bg-[#1e2738] hover:bg-[#28354c] text-emerald-300 border border-emerald-500/30 text-[11px] font-medium"
                >
                  Simular Clique no Link & Confirmação
                </button>
              </div>
            )}
          </div>

          {/* Formatted Message Preview */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-neutral-300 text-xs">Prévia do WhatsApp Formatado:</span>
              <button
                type="button"
                onClick={handleCopyMessage}
                className="flex items-center gap-1 text-[11px] text-neutral-400 hover:text-white"
              >
                {copiedText ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedText ? 'Copiado!' : 'Copiar Texto Completo'}</span>
              </button>
            </div>

            <div className="bg-[#0b141a] p-4 rounded-xl border border-[#1f2c34] font-sans text-xs text-neutral-200 whitespace-pre-line leading-relaxed shadow-inner max-h-48 overflow-y-auto">
              {formattedMessage}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-5 py-3.5 border-t border-[#1f2636] bg-[#141924] flex flex-wrap items-center justify-between gap-2.5">
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyMessage}
              className="px-3 py-2 rounded-lg bg-[#192130] hover:bg-[#212b3e] text-neutral-300 text-xs font-medium border border-[#273449] flex items-center gap-1.5 transition-colors"
            >
              {copiedText ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              <span>{copiedText ? 'Texto Copiado' : 'Copiar Texto'}</span>
            </button>

            <button
              onClick={handleOpenWhatsAppWeb}
              className="px-3 py-2 rounded-lg bg-[#192130] hover:bg-[#212b3e] text-emerald-400 text-xs font-medium border border-[#273449] flex items-center gap-1.5 transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Abrir WhatsApp Web</span>
            </button>
          </div>

          <button
            onClick={handleSendViaEvolutionAPI}
            disabled={isSending || sentSuccess}
            className={`px-5 py-2.5 rounded-lg text-xs font-semibold flex items-center gap-2 shadow-lg transition-all ${
              sentSuccess 
                ? 'bg-emerald-600 text-white' 
                : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-emerald-950/40'
            }`}
          >
            {isSending ? (
              <>
                <Clock className="w-4 h-4 animate-spin" />
                <span>Disparando via API...</span>
              </>
            ) : sentSuccess ? (
              <>
                <CheckCheck className="w-4 h-4" />
                <span>Mensagem & Fotos Disparadas com Sucesso!</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>Disparar WhatsApp Automático</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
