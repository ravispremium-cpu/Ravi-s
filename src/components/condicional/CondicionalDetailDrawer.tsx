import React from 'react';
import { CondicionalBox, CondicionalStatus } from '../../types/crm';
import { 
  X, 
  MapPin, 
  Phone, 
  User, 
  Clock, 
  Truck, 
  MessageCircle, 
  CheckCircle2, 
  RotateCcw, 
  FileText,
  Calendar,
  AlertCircle,
  Copy,
  Check,
  ExternalLink,
  ShieldCheck,
  Bell,
  Lock,
  Tag
} from 'lucide-react';

interface CondicionalDetailDrawerProps {
  box: CondicionalBox | null;
  isOpen: boolean;
  onClose: () => void;
  onOpenCheckout: (box: CondicionalBox) => void;
  onAdvanceStatus: (boxId: string, nextStatus: CondicionalStatus) => void;
  onSendWhatsAppModal: (box: CondicionalBox) => void;
  onTriggerReminder?: (boxId: string, reminderType: 'day3' | 'day6' | 'curatorAlert') => void;
  onConfirmClientReceipt?: (boxId: string) => void;
}

export const CondicionalDetailDrawer: React.FC<CondicionalDetailDrawerProps> = ({
  box,
  isOpen,
  onClose,
  onOpenCheckout,
  onAdvanceStatus,
  onSendWhatsAppModal,
  onTriggerReminder,
  onConfirmClientReceipt
}) => {
  const [copiedLink, setCopiedLink] = React.useState(false);

  if (!isOpen || !box) return null;

  const confirmationUrl = `https://ravispremium.com.br/condicional/confirmar/${box.confirmationToken}`;

  const handleCopyLink = () => {
    navigator.clipboard?.writeText(confirmationUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/75 backdrop-blur-xs">
      <div className="w-full max-w-lg bg-[#11141c] border-l border-[#222a3a] h-full flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-5 py-4 border-b border-[#1f2636] bg-[#141924] flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs text-[#c99738] font-bold">{box.code}</span>
              <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-[#1c2433] text-neutral-300 border border-[#283449]">
                {box.status.replace('_', ' ')}
              </span>
              {box.isConfirmedByClient && (
                <span className="px-1.5 py-0.2 rounded text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  Confirmada pelo Cliente
                </span>
              )}
            </div>
            <h2 className="text-base font-serif font-bold text-white mt-1">{box.clientName}</h2>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-[#1b2230] text-neutral-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1 text-xs text-neutral-300">
          {/* Destination & Contact */}
          <div className="bg-[#141923] p-3.5 rounded-xl border border-[#212b3b] space-y-2">
            <span className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider block">Entrega & Curador</span>
            <div className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-[#c99738] shrink-0 mt-0.5" />
              <div>
                <span className="text-white font-medium block">{box.clientAddress}</span>
                <span className="text-neutral-400 text-[11px]">{box.deliveryMethod}</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-[#1d2432] text-[11px]">
              <div className="flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-neutral-400" />
                <span className="text-neutral-300">{box.clientPhone}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-[#c99738]" />
                <span className="text-neutral-300">{box.curatorName}</span>
              </div>
            </div>
          </div>

          {/* Timeline & SLA de Condicional */}
          <div className="bg-[#141923] p-3.5 rounded-xl border border-[#212b3b] space-y-2">
            <span className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider block">
              SLA de Prova (Padrão 7 Dias)
            </span>
            
            <div className="space-y-2 border-l-2 border-[#242d3e] pl-3 ml-1 text-[11px]">
              <div>
                <span className="text-neutral-400 block">Mala Montada (Rascunho):</span>
                <span className="text-white font-medium">
                  {new Date(box.createdAt).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' })}
                </span>
              </div>

              {box.sentAt && (
                <div>
                  <span className="text-neutral-400 block">Despachada / A Caminho:</span>
                  <span className="text-white font-medium">
                    {new Date(box.sentAt).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' })}
                  </span>
                </div>
              )}

              <div>
                <span className="text-neutral-400 block">Prazo Limite para Prova e Recolhimento:</span>
                <span className="text-amber-300 font-medium">
                  {new Date(box.deadlineDate).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' })}
                  {' '}({box.daysRemaining !== undefined ? `${box.daysRemaining} dias restantes` : `${box.hoursRemaining}h restantes`})
                </span>
              </div>
            </div>
          </div>

          {/* Unique Confirmation Link */}
          <div className="bg-[#0b0e14] p-3 rounded-xl border border-[#20293b] space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Link de Confirmação do Cliente</span>
              </span>
              <button
                type="button"
                onClick={handleCopyLink}
                className="text-[11px] text-[#c99738] hover:text-[#e0ad45] flex items-center gap-1"
              >
                {copiedLink ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copiedLink ? 'Copiado!' : 'Copiar Link'}</span>
              </button>
            </div>
            
            <div className="font-mono text-[10px] text-neutral-400 bg-[#121622] p-2 rounded border border-[#1b2333] truncate">
              {confirmationUrl}
            </div>

            {!box.isConfirmedByClient && onConfirmClientReceipt && (
              <button
                type="button"
                onClick={() => onConfirmClientReceipt(box.id)}
                className="w-full py-1 rounded bg-[#182333] hover:bg-[#202e42] text-emerald-300 border border-emerald-500/30 text-[11px] font-medium"
              >
                Simular Confirmação pelo Cliente
              </button>
            )}
          </div>

          {/* Lembretes Automáticos Status */}
          <div className="bg-[#141923] p-3.5 rounded-xl border border-[#212b3b] space-y-2">
            <span className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider block">
              Automação de Lembretes da Mala
            </span>

            <div className="grid grid-cols-3 gap-2 text-center text-[10px]">
              <div className={`p-2 rounded-lg border ${
                box.reminders?.day3Sent 
                  ? 'bg-emerald-950/40 border-emerald-700/50 text-emerald-300' 
                  : 'bg-[#0d1017] border-[#1d2534] text-neutral-400'
              }`}>
                <span className="font-bold block">Dia 3 (Prova)</span>
                <span className="text-[9px]">{box.reminders?.day3Sent ? '✓ Enviado' : 'Pendente'}</span>
              </div>

              <div className={`p-2 rounded-lg border ${
                box.reminders?.day6Sent 
                  ? 'bg-emerald-950/40 border-emerald-700/50 text-emerald-300' 
                  : 'bg-[#0d1017] border-[#1d2534] text-neutral-400'
              }`}>
                <span className="font-bold block">Dia 6 (Aviso)</span>
                <span className="text-[9px]">{box.reminders?.day6Sent ? '✓ Enviado' : 'Pendente'}</span>
              </div>

              <div className={`p-2 rounded-lg border ${
                box.reminders?.curatorAlertSent 
                  ? 'bg-purple-950/40 border-purple-700/50 text-purple-300' 
                  : 'bg-[#0d1017] border-[#1d2534] text-neutral-400'
              }`}>
                <span className="font-bold block">Curador (48h)</span>
                <span className="text-[9px]">{box.reminders?.curatorAlertSent ? '✓ Alertado' : 'Pendente'}</span>
              </div>
            </div>
          </div>

          {/* Items in Box with Photos */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">
                Peças Selecionadas ({box.items.length})
              </span>
              <span className="font-semibold text-[#f0cf7e]">
                Total: {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(box.totalValue)}
              </span>
            </div>

            <div className="space-y-2">
              {box.items.map(item => (
                <div key={item.id} className="p-2.5 rounded-xl bg-[#0e1219] border border-[#1d2534] flex items-center justify-between gap-2.5">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-lg bg-[#18202d] overflow-hidden shrink-0 border border-[#273449]">
                      {item.imageUrl ? (
                        <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-neutral-500">
                          <Tag className="w-4 h-4" />
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono text-[10px] text-neutral-400">{item.productCode}</span>
                        <span className="text-white font-medium">{item.title}</span>
                        <span className="px-1.5 py-0.2 rounded bg-[#171e2c] text-amber-300 font-mono text-[10px]">
                          Tam {item.size}
                        </span>
                      </div>
                      <div className="text-[10px] text-neutral-400">
                        {item.material || item.category}
                      </div>
                      {item.returnReason && (
                        <div className="text-[10px] text-amber-400 mt-0.5">
                          Devolução ({item.returnReasonCategory || 'MOTIVO'}): {item.returnReason}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="font-semibold text-neutral-200 block">
                      {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.price)}
                    </span>
                    <span className={`text-[10px] font-medium ${
                      item.status === 'COMPRADA' ? 'text-emerald-400' : item.status === 'DEVOLVIDA' ? 'text-neutral-400' : 'text-amber-400'
                    }`}>
                      {item.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Notes */}
          {box.notes && (
            <div className="bg-[#141923] p-3 rounded-lg border border-[#202838] text-[11px]">
              <span className="text-neutral-400 font-medium block mb-1">Notas do Curador:</span>
              <p className="text-neutral-200 italic">"{box.notes}"</p>
            </div>
          )}

          {/* WhatsApp Logs */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider block">Histórico WhatsApp API</span>
            {box.whatsappLog.length === 0 ? (
              <p className="text-neutral-400 italic text-[11px]">Nenhuma notificação disparada automaticamente ainda.</p>
            ) : (
              box.whatsappLog.map((log, idx) => (
                <div key={idx} className="p-2 rounded bg-[#0d1017] border border-[#1b2230] flex items-center justify-between text-[11px]">
                  <div className="flex items-center gap-1.5 text-neutral-300">
                    <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{log.messageType}</span>
                  </div>
                  <span className="text-[10px] text-neutral-400">{log.status}</span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-[#1f2636] bg-[#141924] flex items-center gap-2">
          <button
            onClick={() => onSendWhatsAppModal(box)}
            className="p-2 rounded-lg bg-[#1a222e] hover:bg-[#232c3b] border border-[#283447] text-emerald-400 transition-colors"
            title="Abrir Disparo WhatsApp"
          >
            <MessageCircle className="w-4 h-4" />
          </button>

          {box.status === 'RASCUNHO' && (
            <button
              onClick={() => onAdvanceStatus(box.id, 'AGENDADO')}
              className="flex-1 py-2 px-3 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-md transition-all text-center"
            >
              Agendar Saída da Mala
            </button>
          )}

          {box.status === 'AGENDADO' && (
            <button
              onClick={() => onAdvanceStatus(box.id, 'ENVIADO')}
              className="flex-1 py-2 px-3 rounded-lg bg-[#c99738] hover:bg-[#d8a542] text-black font-semibold text-xs shadow-md transition-all text-center"
            >
              Despachar com Motorista VIP Ravi's
            </button>
          )}

          {box.status === 'ENVIADO' && (
            <button
              onClick={() => onAdvanceStatus(box.id, 'EM_TESTE')}
              className="flex-1 py-2 px-3 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs shadow-md transition-all text-center"
            >
              Confirmar Entrega (Iniciar 7 Dias de Prova)
            </button>
          )}

          {box.status === 'EM_TESTE' && (
            <button
              onClick={() => {
                onClose();
                onOpenCheckout(box);
              }}
              className="flex-1 py-2 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs shadow-md shadow-emerald-950/40 transition-all text-center"
            >
              Realizar Fechamento / Compras
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
