import React, { useState } from 'react';
import { ScheduledMessage, Client, MessageChannel } from '../../types/crm';
import { 
  X, 
  Clock, 
  Calendar, 
  Send, 
  Trash2, 
  CheckCircle2, 
  AlertCircle,
  MessageSquare,
  User,
  Plus
} from 'lucide-react';

interface ScheduledMessagesModalProps {
  isOpen: boolean;
  onClose: () => void;
  scheduledMessages: ScheduledMessage[];
  clients: Client[];
  onAddScheduledMessage: (newMsg: Omit<ScheduledMessage, 'id' | 'createdAt' | 'status'>) => void;
  onCancelScheduledMessage: (id: string) => void;
  onTriggerNowScheduledMessage: (id: string) => void;
  preSelectedClientId?: string;
}

export const ScheduledMessagesModal: React.FC<ScheduledMessagesModalProps> = ({
  isOpen,
  onClose,
  scheduledMessages,
  clients,
  onAddScheduledMessage,
  onCancelScheduledMessage,
  onTriggerNowScheduledMessage,
  preSelectedClientId
}) => {
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [selectedClientId, setSelectedClientId] = useState(preSelectedClientId || clients[0]?.id || '');
  const [channel, setChannel] = useState<MessageChannel>('WHATSAPP');
  const [content, setContent] = useState('');
  const [scheduleDate, setScheduleDate] = useState(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(9, 30, 0, 0);
    return tomorrow.toISOString().slice(0, 16);
  });
  const [creatorName, setCreatorName] = useState('Matheus (Consultor Sênior)');

  if (!isOpen) return null;

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || !selectedClientId) return;

    const targetClient = clients.find(c => c.id === selectedClientId);
    if (!targetClient) return;

    onAddScheduledMessage({
      clientId: targetClient.id,
      clientName: targetClient.name,
      clientPhone: targetClient.phone,
      channel,
      content: content.trim(),
      scheduledFor: scheduleDate,
      creatorName
    });

    setContent('');
    setIsCreatingNew(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="bg-[#10141d] border border-[#232b3d] rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[#1f2637] flex items-center justify-between bg-[#141924]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-[#c99738]">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                Mensagens Agendadas
                <span className="text-xs bg-[#1f2637] text-neutral-300 px-2 py-0.5 rounded-full font-normal">
                  {scheduledMessages.filter(m => m.status === 'PENDENTE').length} pendente(s)
                </span>
              </h2>
              <p className="text-xs text-neutral-400">
                Disparos programados com respeito à janela comercial (08:30 - 19:30)
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

        {/* Content */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5 flex-1">
          {/* Action to Toggle Create */}
          {!isCreatingNew ? (
            <button
              onClick={() => setIsCreatingNew(true)}
              className="w-full py-3 px-4 rounded-xl border border-dashed border-[#2a354c] hover:border-[#c99738]/60 bg-[#141924]/50 hover:bg-[#141924] text-xs font-semibold text-[#c99738] flex items-center justify-center gap-2 transition-all group"
            >
              <Plus className="w-4 h-4 group-hover:scale-110 transition-transform" />
              <span>Agendar Nova Mensagem Personalizada</span>
            </button>
          ) : (
            /* Creation Form */
            <form onSubmit={handleCreateSubmit} className="p-4 rounded-xl bg-[#141924] border border-[#28334a] space-y-4">
              <div className="flex items-center justify-between border-b border-[#222a3a] pb-2">
                <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-[#c99738]" />
                  <span>Novo Agendamento</span>
                </span>
                <button
                  type="button"
                  onClick={() => setIsCreatingNew(false)}
                  className="text-xs text-neutral-400 hover:text-white"
                >
                  Cancelar
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] text-neutral-300 font-medium mb-1">
                    Destinatário (Cliente Ravi's)
                  </label>
                  <select
                    value={selectedClientId}
                    onChange={(e) => setSelectedClientId(e.target.value)}
                    className="w-full bg-[#0c0e12] border border-[#232b3d] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#c99738]"
                  >
                    {clients.map(c => (
                      <option key={c.id} value={c.id}>
                        {c.name} ({c.phone}) - {c.sizes.shirt}/{c.sizes.pants}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] text-neutral-300 font-medium mb-1">
                    Canal de Disparo
                  </label>
                  <select
                    value={channel}
                    onChange={(e) => setChannel(e.target.value as MessageChannel)}
                    className="w-full bg-[#0c0e12] border border-[#232b3d] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#c99738]"
                  >
                    <option value="WHATSAPP">WhatsApp Business (Evolution API)</option>
                    <option value="INSTAGRAM">Instagram Direct (Graph API)</option>
                    <option value="EMAIL">E-mail VIP</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] text-neutral-300 font-medium mb-1">
                    Data e Horário do Disparo
                  </label>
                  <input
                    type="datetime-local"
                    value={scheduleDate}
                    onChange={(e) => setScheduleDate(e.target.value)}
                    className="w-full bg-[#0c0e12] border border-[#232b3d] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#c99738]"
                  />
                  <span className="text-[10px] text-neutral-500 mt-0.5 block">
                    Horário de Canoinhas-SC (08:30 às 19:30)
                  </span>
                </div>

                <div>
                  <label className="block text-[11px] text-neutral-300 font-medium mb-1">
                    Atendente / Curador Responsável
                  </label>
                  <select
                    value={creatorName}
                    onChange={(e) => setCreatorName(e.target.value)}
                    className="w-full bg-[#0c0e12] border border-[#232b3d] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#c99738]"
                  >
                    <option value="Matheus (Consultor Sênior)">Matheus (Consultor Sênior)</option>
                    <option value="Juliana (Consultora VIP)">Juliana (Consultora VIP)</option>
                    <option value="Ravi (Curador-Chefe)">Ravi (Curador-Chefe)</option>
                    <option value="Camila (Stylist VIP)">Camila (Stylist VIP)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] text-neutral-300 font-medium mb-1">
                  Texto da Mensagem
                </label>
                <textarea
                  rows={3}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Ex: Olá, Dr. Guilherme! Nosso motorista passará hoje às 17h para recolher as peças da mala..."
                  className="w-full bg-[#0c0e12] border border-[#232b3d] rounded-lg p-2.5 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-[#c99738]"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setIsCreatingNew(false)}
                  className="px-3 py-2 rounded-lg bg-[#1a202c] hover:bg-[#252d3d] text-xs text-neutral-300 font-medium"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-gradient-to-r from-[#c99738] to-[#b07d24] text-black text-xs font-bold hover:brightness-110 flex items-center gap-1.5"
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Confirmar Agendamento</span>
                </button>
              </div>
            </form>
          )}

          {/* List of Scheduled Messages */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
              Fila de Disparos Programados
            </h3>

            {scheduledMessages.length === 0 ? (
              <div className="text-center py-8 bg-[#141924]/40 border border-[#1f2637] rounded-xl text-neutral-500 text-xs">
                Nenhuma mensagem agendada no momento.
              </div>
            ) : (
              scheduledMessages.map((msg) => {
                const isPending = msg.status === 'PENDENTE';
                const formattedDate = new Date(msg.scheduledFor).toLocaleString('pt-BR', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                });

                return (
                  <div
                    key={msg.id}
                    className={`p-3.5 rounded-xl border transition-all ${
                      isPending 
                        ? 'bg-[#141924] border-[#222a3b]' 
                        : msg.status === 'DISPARADO'
                        ? 'bg-[#0f151b] border-emerald-900/30 opacity-75'
                        : 'bg-[#121216] border-neutral-800/40 opacity-50'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase ${
                          msg.channel === 'WHATSAPP'
                            ? 'bg-emerald-950/60 text-emerald-400 border-emerald-800/40'
                            : msg.channel === 'INSTAGRAM'
                            ? 'bg-pink-950/60 text-pink-400 border-pink-800/40'
                            : 'bg-blue-950/60 text-blue-400 border-blue-800/40'
                        }`}>
                          {msg.channel}
                        </span>

                        <span className="text-xs font-semibold text-white">
                          {msg.clientName}
                        </span>

                        <span className="text-[11px] text-neutral-400">
                          {msg.clientPhone}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <span className={`text-[10px] px-2 py-0.5 rounded font-semibold ${
                          msg.status === 'PENDENTE'
                            ? 'bg-amber-950/60 text-amber-300 border border-amber-800/40'
                            : msg.status === 'DISPARADO'
                            ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800/40'
                            : 'bg-neutral-800 text-neutral-400 border border-neutral-700'
                        }`}>
                          {msg.status}
                        </span>
                      </div>
                    </div>

                    <p className="text-xs text-neutral-300 bg-[#0c0e12] p-2.5 rounded-lg border border-[#1b2230] mb-2.5 font-sans leading-relaxed">
                      "{msg.content}"
                    </p>

                    <div className="flex items-center justify-between text-[11px] text-neutral-400 pt-1 border-t border-[#1a2130]">
                      <div className="flex items-center gap-2">
                        <span className="flex items-center gap-1 text-amber-400 font-medium">
                          <Clock className="w-3 h-3" />
                          <span>Previsto para: {formattedDate}</span>
                        </span>
                        <span className="text-neutral-500">•</span>
                        <span>Por: {msg.creatorName}</span>
                      </div>

                      {isPending && (
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => onTriggerNowScheduledMessage(msg.id)}
                            className="px-2.5 py-1 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/30 rounded-md text-[11px] font-semibold flex items-center gap-1 transition-colors"
                            title="Disparar mensagem imediatamente"
                          >
                            <Send className="w-3 h-3" />
                            <span>Disparar Agora</span>
                          </button>
                          <button
                            onClick={() => onCancelScheduledMessage(msg.id)}
                            className="p-1 hover:bg-rose-950/40 text-neutral-400 hover:text-rose-400 rounded transition-colors"
                            title="Cancelar agendamento"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-3.5 sm:p-4 border-t border-[#1f2637] bg-[#141924] flex items-center justify-between text-xs text-neutral-400">
          <div className="flex items-center gap-1.5 text-neutral-400">
            <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
            <span>Fila gerenciada com BullMQ & Redis Upstash (Worker em segundo plano)</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-[#1a202c] hover:bg-[#252d3d] text-white font-medium transition-colors"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
