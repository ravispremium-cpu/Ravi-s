import React from 'react';
import { CondicionalBox, CondicionalStatus } from '../../types/crm';
import { 
  Clock, 
  MapPin, 
  User, 
  Phone, 
  ChevronRight, 
  CheckCircle2, 
  ArrowRight, 
  MessageCircle, 
  ShoppingBag,
  AlertTriangle,
  RotateCcw,
  Send,
  Calendar,
  ShieldCheck,
  Bell,
  CheckCheck
} from 'lucide-react';

interface CondicionalCardProps {
  box: CondicionalBox;
  onAdvanceStatus: (boxId: string, nextStatus: CondicionalStatus) => void;
  onOpenCheckout: (box: CondicionalBox) => void;
  onOpenDetails: (box: CondicionalBox) => void;
  onSendWhatsAppModal: (box: CondicionalBox) => void;
  onTriggerReminder?: (boxId: string, reminderType: 'day3' | 'day6' | 'curatorAlert') => void;
}

export const CondicionalCard: React.FC<CondicionalCardProps> = ({
  box,
  onAdvanceStatus,
  onOpenCheckout,
  onOpenDetails,
  onSendWhatsAppModal,
  onTriggerReminder
}) => {
  const getStatusBadge = (status: CondicionalStatus) => {
    switch (status) {
      case 'RASCUNHO':
        return {
          label: 'Rascunho da Mala',
          bg: 'bg-neutral-800/80 border-neutral-700 text-neutral-300',
          dot: 'bg-neutral-400'
        };
      case 'AGENDADO':
        return {
          label: 'Saída Agendada',
          bg: 'bg-indigo-950/70 border-indigo-700/50 text-indigo-300',
          dot: 'bg-indigo-400'
        };
      case 'ENVIADO':
        return {
          label: 'Em Rota VIP / Loja',
          bg: 'bg-blue-950/70 border-blue-700/50 text-blue-300',
          dot: 'bg-blue-400 animate-pulse'
        };
      case 'EM_TESTE':
        return {
          label: 'Em Teste (7 Dias)',
          bg: 'bg-amber-950/70 border-amber-600/50 text-amber-300',
          dot: 'bg-amber-400 animate-ping'
        };
      case 'FINALIZADO':
        const isBought = box.finalOutcome === 'COMPRADO_INTEIRO' || box.finalOutcome === 'COMPRADO_PARCIAL' || (box.soldValue && box.soldValue > 0);
        return {
          label: isBought ? 'Comprada / Faturada' : 'Devolução Concluída',
          bg: isBought ? 'bg-emerald-950/70 border-emerald-700/50 text-emerald-300' : 'bg-neutral-900 border-neutral-700 text-neutral-400',
          dot: isBought ? 'bg-emerald-400' : 'bg-neutral-500'
        };
    }
  };

  const badge = getStatusBadge(box.status);
  const isUrgent = box.status === 'EM_TESTE' && (box.daysRemaining <= 2 || box.hoursRemaining <= 48);

  const nextStatusMap: Record<CondicionalStatus, CondicionalStatus | null> = {
    'RASCUNHO': 'AGENDADO',
    'AGENDADO': 'ENVIADO',
    'ENVIADO': 'EM_TESTE',
    'EM_TESTE': null, // Next is checkout modal
    'FINALIZADO': null
  };

  const nextStatusLabel: Record<CondicionalStatus, string> = {
    'RASCUNHO': 'Agendar Saída',
    'AGENDADO': 'Despachar Mala',
    'ENVIADO': 'Confirmar Entrega',
    'EM_TESTE': 'Realizar Fechamento',
    'FINALIZADO': 'Concluído'
  };

  const nextStatus = nextStatusMap[box.status];

  return (
    <div className={`rounded-xl border transition-all duration-200 bg-[#12161f] hover:bg-[#151a24] ${
      isUrgent 
        ? 'border-amber-500/60 shadow-lg shadow-amber-950/30' 
        : 'border-[#222938] hover:border-[#2f394e]'
    } p-3.5 flex flex-col gap-3 group`}>
      {/* Top row: Code + Status + Timer */}
      <div className="flex items-center justify-between text-xs">
        <span className="font-mono text-neutral-400 font-medium tracking-wide">
          {box.code}
        </span>

        <div className="flex items-center gap-1.5">
          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border ${badge.bg}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${badge.dot}`} />
            {badge.label}
          </span>
        </div>
      </div>

      {/* Client info & Address */}
      <div className="cursor-pointer" onClick={() => onOpenDetails(box)}>
        <div className="flex items-center justify-between">
          <h4 className="font-serif font-bold text-white text-sm group-hover:text-[#c99738] transition-colors">
            {box.clientName}
          </h4>
          <span className="font-serif font-bold text-[#f5d061] text-xs">
            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(
              box.status === 'FINALIZADO' && box.soldValue > 0 ? box.soldValue : box.totalValue
            )}
          </span>
        </div>

        <div className="flex items-center gap-1 text-[11px] text-neutral-400 mt-1">
          <MapPin className="w-3 h-3 text-[#c99738] shrink-0" />
          <span className="truncate">{box.clientAddress}</span>
        </div>

        <div className="flex items-center justify-between text-[11px] text-neutral-400 mt-1">
          <span className="text-[10px]">{box.deliveryMethod.split(' ')[0]} {box.deliveryMethod.split(' ')[1]}</span>
          <span className="text-neutral-400 text-[10px]">{box.curatorName.split(' ')[0]}</span>
        </div>
      </div>

      {/* Selected Items preview with thumbnail pills */}
      <div className="flex flex-wrap gap-1.5 pt-1 border-t border-[#1a2130]">
        {box.items.slice(0, 3).map((item, idx) => (
          <span 
            key={idx}
            className="px-2 py-0.5 rounded-md bg-[#18202d] border border-[#232f42] text-[10px] text-neutral-300 flex items-center gap-1"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#c99738]" />
            <span className="truncate max-w-[120px]">{item.title}</span>
            <span className="text-[#f5d061] font-mono font-bold">({item.size})</span>
          </span>
        ))}
        {box.items.length > 3 && (
          <span className="px-1.5 py-0.5 rounded-md bg-[#18202d] text-[10px] text-neutral-400 font-mono">
            +{box.items.length - 3}
          </span>
        )}
      </div>

      {/* Reminders SLA row (Day 3 & Day 6 & Curator alert status) */}
      {box.status === 'EM_TESTE' && (
        <div className="bg-[#0b0e14] p-2 rounded-lg border border-[#1b2332] space-y-1.5 text-[10px]">
          <div className="flex items-center justify-between text-neutral-400">
            <span className="flex items-center gap-1 text-amber-300 font-medium">
              <Clock className="w-3 h-3" />
              <span>
                {box.daysRemaining !== undefined ? `${box.daysRemaining}d restantes` : `${box.hoursRemaining}h`}
              </span>
            </span>

            {/* Client confirmation status badge */}
            <span className={`px-1.5 py-0.2 rounded font-mono ${
              box.isConfirmedByClient 
                ? 'text-emerald-400 bg-emerald-500/10' 
                : 'text-amber-400 bg-amber-500/10'
            }`}>
              {box.isConfirmedByClient ? '✓ Recebimento Confirmado' : 'Aguardando Link'}
            </span>
          </div>

          {/* D3 and D6 badges */}
          <div className="flex items-center justify-between pt-1 border-t border-[#171f2b]">
            <div className="flex items-center gap-1.5">
              <span 
                title="Lembrete Dia 3: Prova & Dúvidas"
                className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                  box.reminders?.day3Sent 
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' 
                    : 'bg-[#182230] text-neutral-400'
                }`}
              >
                D3: {box.reminders?.day3Sent ? '✓ Enviado' : 'Pendente'}
              </span>

              <span 
                title="Lembrete Dia 6: Retirada Próxima"
                className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                  box.reminders?.day6Sent 
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' 
                    : 'bg-[#182230] text-neutral-400'
                }`}
              >
                D6: {box.reminders?.day6Sent ? '✓ Enviado' : 'Pendente'}
              </span>
            </div>

            {/* Quick reminder action */}
            {onTriggerReminder && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  if (!box.reminders?.day3Sent) {
                    onTriggerReminder(box.id, 'day3');
                  } else if (!box.reminders?.day6Sent) {
                    onTriggerReminder(box.id, 'day6');
                  } else {
                    onTriggerReminder(box.id, 'curatorAlert');
                  }
                }}
                className="text-[#c99738] hover:text-[#d6a544] flex items-center gap-0.5"
                title="Disparar próximo lembrete automático"
              >
                <Bell className="w-2.5 h-2.5" />
                <span>Lembrar</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Bottom Actions Row */}
      <div className="pt-2 border-t border-[#1b2332] flex items-center justify-between gap-1.5">
        <div className="flex items-center gap-1">
          {/* WhatsApp Modal Trigger */}
          <button
            onClick={() => onSendWhatsAppModal(box)}
            className="p-1.5 rounded-lg bg-[#182230] hover:bg-[#222f42] text-emerald-400 border border-[#253347] transition-colors"
            title="Enviar WhatsApp com Fotos e Link de Confirmação"
          >
            <MessageCircle className="w-3.5 h-3.5" />
          </button>

          {/* Details Drawer */}
          <button
            onClick={() => onOpenDetails(box)}
            className="p-1.5 rounded-lg bg-[#182230] hover:bg-[#222f42] text-neutral-300 border border-[#253347] transition-colors text-xs"
            title="Ver Detalhes da Mala"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* State transition triggers */}
        {nextStatus && (
          <button
            onClick={() => onAdvanceStatus(box.id, nextStatus)}
            className="px-2.5 py-1 rounded-lg bg-[#1f293b] hover:bg-[#2a3850] text-neutral-200 hover:text-white text-[11px] font-medium flex items-center gap-1 transition-colors border border-[#2e3b52]"
          >
            <span>{nextStatusLabel[box.status]}</span>
            <ArrowRight className="w-3 h-3 text-[#c99738]" />
          </button>
        )}

        {box.status === 'EM_TESTE' && (
          <button
            onClick={() => onOpenCheckout(box)}
            className="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-semibold flex items-center gap-1 shadow-md shadow-emerald-950/40 transition-all"
          >
            <ShoppingBag className="w-3 h-3" />
            <span>Fechamento</span>
          </button>
        )}

        {box.status === 'FINALIZADO' && (
          <span className="text-[10px] text-neutral-400 font-mono">
            {box.finalOutcome === 'COMPRADO_INTEIRO' ? 'Comprado 100%' : box.finalOutcome === 'COMPRADO_PARCIAL' ? 'Comprado Parcial' : 'Devolvido Total'}
          </span>
        )}
      </div>
    </div>
  );
};
