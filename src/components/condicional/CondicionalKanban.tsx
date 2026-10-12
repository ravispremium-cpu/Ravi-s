import React, { useState } from 'react';
import { CondicionalBox, CondicionalStatus, Client, Product } from '../../types/crm';
import { CondicionalCard } from './CondicionalCard';
import { CondicionalIntelligenceView } from './CondicionalIntelligenceView';
import { 
  Package, 
  Search, 
  Filter, 
  Plus, 
  Layers, 
  Clock, 
  CheckCircle, 
  Truck, 
  Sparkles, 
  RotateCcw,
  Calendar,
  BrainCircuit,
  Bell,
  Send,
  ShieldCheck,
  AlertTriangle
} from 'lucide-react';

interface CondicionalKanbanProps {
  condicionais: CondicionalBox[];
  clients: Client[];
  products: Product[];
  onAdvanceStatus: (boxId: string, nextStatus: CondicionalStatus) => void;
  onOpenCheckout: (box: CondicionalBox) => void;
  onOpenDetails: (box: CondicionalBox) => void;
  onOpenNewBox: () => void;
  onSendWhatsAppModal: (box: CondicionalBox) => void;
  onTriggerReminder?: (boxId: string, reminderType: 'day3' | 'day6' | 'curatorAlert') => void;
  onSelectClient?: (clientId: string) => void;
}

export const CondicionalKanban: React.FC<CondicionalKanbanProps> = ({
  condicionais,
  clients,
  products,
  onAdvanceStatus,
  onOpenCheckout,
  onOpenDetails,
  onOpenNewBox,
  onSendWhatsAppModal,
  onTriggerReminder,
  onSelectClient
}) => {
  const [activeModuleView, setActiveModuleView] = useState<'kanban' | 'intelligence' | 'reminders'>('kanban');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCuratorFilter, setSelectedCuratorFilter] = useState('ALL');

  // Available status columns strictly following Requirement 5:
  // RASCUNHO -> AGENDADO -> ENVIADO -> EM_TESTE -> FINALIZADO
  const columns: { id: CondicionalStatus; title: string; subtitle: string; icon: any; color: string }[] = [
    {
      id: 'RASCUNHO',
      title: '1. Rascunho',
      subtitle: 'Curador monta seleção de peças',
      icon: Layers,
      color: 'border-neutral-700/60 text-neutral-400'
    },
    {
      id: 'AGENDADO',
      title: '2. Agendado',
      subtitle: 'Data programada p/ saída ou retirada',
      icon: Calendar,
      color: 'border-indigo-600/40 text-indigo-400'
    },
    {
      id: 'ENVIADO',
      title: '3. Enviado',
      subtitle: 'Retirada na loja ou motorista VIP',
      icon: Truck,
      color: 'border-blue-600/40 text-blue-400'
    },
    {
      id: 'EM_TESTE',
      title: '4. Em Teste (7d)',
      subtitle: 'Cliente provando em domicílio',
      icon: Clock,
      color: 'border-amber-600/40 text-amber-400'
    },
    {
      id: 'FINALIZADO',
      title: '5. Finalizado',
      subtitle: 'Comprado (parcial/total) ou Devolvido',
      icon: CheckCircle,
      color: 'border-emerald-600/40 text-emerald-400'
    }
  ];

  // Filter boxes
  const filteredBoxes = condicionais.filter(box => {
    const matchesSearch = 
      box.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      box.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      box.clientAddress.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCurator = selectedCuratorFilter === 'ALL' || box.curatorName.includes(selectedCuratorFilter);

    return matchesSearch && matchesCurator;
  });

  // Calculate totals
  const totalValueInTesting = condicionais
    .filter(b => b.status === 'EM_TESTE' || b.status === 'ENVIADO')
    .reduce((sum, b) => sum + b.totalValue, 0);

  const boxesInTestingCount = condicionais.filter(b => b.status === 'EM_TESTE').length;
  const boxesExpiringSoon = condicionais.filter(b => b.status === 'EM_TESTE' && (b.daysRemaining <= 2 || b.hoursRemaining <= 48)).length;

  return (
    <div className="space-y-4">
      {/* Top Navigation & Sub-views */}
      <div className="bg-[#11141c] p-3 rounded-xl border border-[#1e2533] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* View Switcher */}
        <div className="flex items-center gap-1.5 bg-[#0a0d14] p-1 rounded-lg border border-[#1d2433]">
          <button
            onClick={() => setActiveModuleView('kanban')}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-all ${
              activeModuleView === 'kanban' 
                ? 'bg-[#c99738] text-black shadow-md' 
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Pipeline Kanban (5 Estados)</span>
          </button>

          <button
            onClick={() => setActiveModuleView('intelligence')}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-all ${
              activeModuleView === 'intelligence' 
                ? 'bg-[#c99738] text-black shadow-md' 
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <BrainCircuit className="w-3.5 h-3.5" />
            <span>Inteligência & Conversão Preditiva</span>
          </button>

          <button
            onClick={() => setActiveModuleView('reminders')}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-all relative ${
              activeModuleView === 'reminders' 
                ? 'bg-[#c99738] text-black shadow-md' 
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Bell className="w-3.5 h-3.5" />
            <span>Automação de Lembretes & SLAs</span>
            {boxesExpiringSoon > 0 && (
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping absolute -top-0.5 -right-0.5" />
            )}
          </button>
        </div>

        {/* Global Action Button */}
        <button
          onClick={onOpenNewBox}
          className="flex items-center justify-center gap-2 px-3.5 py-2 rounded-lg bg-gradient-to-r from-[#c99738] to-[#b3822b] hover:from-[#d6a544] hover:to-[#be8d35] text-black font-semibold text-xs transition-all shadow-md shadow-[#c99738]/20 shrink-0"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Montar Nova Mala de Condicional</span>
        </button>
      </div>

      {/* VIEW 1: KANBAN BOARD */}
      {activeModuleView === 'kanban' && (
        <div className="space-y-4">
          {/* Top Filter and Search Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#11141c] p-3 rounded-xl border border-[#1e2533]">
            <div className="flex items-center gap-2 flex-1">
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Buscar cliente, código (ex: COND-2026) ou endereço..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-[#0d1017] border border-[#232a3a] rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder-neutral-400 focus:outline-none focus:border-[#c99738]"
                />
              </div>

              <select
                value={selectedCuratorFilter}
                onChange={(e) => setSelectedCuratorFilter(e.target.value)}
                className="bg-[#0d1017] border border-[#232a3a] rounded-lg px-2.5 py-2 text-xs text-neutral-300 focus:outline-none focus:border-[#c99738]"
              >
                <option value="ALL">Todos os Curadores</option>
                <option value="Mateus">Mateus (Consultor)</option>
                <option value="Juliana">Juliana (Consultora VIP)</option>
                <option value="Ravi">Ravi (Curador-Chefe)</option>
              </select>
            </div>

            <div className="flex items-center gap-3 text-xs text-neutral-300">
              <span className="text-neutral-400">Em Teste/Trânsito:</span>
              <span className="font-serif font-bold text-[#f5d061]">
                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalValueInTesting)}
              </span>
              <span className="px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[11px] font-mono font-medium">
                {boxesInTestingCount} malas ativas
              </span>
            </div>
          </div>

          {/* Kanban Board Columns - 5 Pipeline Stages */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3.5 items-start">
            {columns.map(col => {
              const colBoxes = filteredBoxes.filter(b => b.status === col.id);
              const ColIcon = col.icon;
              const colTotalValue = colBoxes.reduce((acc, curr) => 
                acc + (col.id === 'FINALIZADO' && curr.soldValue > 0 ? curr.soldValue : curr.totalValue), 0
              );

              return (
                <div 
                  key={col.id} 
                  className="bg-[#0e1219] rounded-xl border border-[#1b2230] p-3 flex flex-col gap-3 min-h-[500px]"
                >
                  {/* Column Header */}
                  <div className="border-b border-[#1c2331] pb-2.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 font-semibold text-xs text-white">
                        <ColIcon className={`w-3.5 h-3.5 ${col.color}`} />
                        <span>{col.title}</span>
                      </div>
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-[#171d27] text-neutral-300 border border-[#242c3d]">
                        {colBoxes.length}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-neutral-400 mt-1">
                      <span>{col.subtitle}</span>
                      {colTotalValue > 0 && (
                        <span className="text-neutral-300 font-mono font-medium">
                          {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(colTotalValue)}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Cards List */}
                  <div className="flex flex-col gap-3 flex-1">
                    {colBoxes.length === 0 ? (
                      <div className="h-32 flex flex-col items-center justify-center text-center text-neutral-400 text-xs border border-dashed border-[#1a212e] rounded-lg p-3">
                        <span>Nenhuma mala nesta etapa</span>
                      </div>
                    ) : (
                      colBoxes.map(box => (
                        <CondicionalCard
                          key={box.id}
                          box={box}
                          onAdvanceStatus={onAdvanceStatus}
                          onOpenCheckout={onOpenCheckout}
                          onOpenDetails={onOpenDetails}
                          onSendWhatsAppModal={onSendWhatsAppModal}
                          onTriggerReminder={onTriggerReminder}
                        />
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* VIEW 2: INTELIGÊNCIA & CONVERSÃO PREDITIVA */}
      {activeModuleView === 'intelligence' && (
        <CondicionalIntelligenceView
          clients={clients}
          products={products}
          condicionais={condicionais}
          onSelectClient={onSelectClient}
        />
      )}

      {/* VIEW 3: CENTRAL DE AUTOMAÇÃO DE LEMBRETES & SLAS */}
      {activeModuleView === 'reminders' && (
        <div className="space-y-4">
          <div className="bg-[#11141c] p-4 rounded-xl border border-[#1e2533]">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-white text-base flex items-center gap-2">
                  <Bell className="w-5 h-5 text-amber-400" />
                  <span>Central de Lembretes Automáticos & SLA de Prova</span>
                </h3>
                <p className="text-xs text-neutral-400 mt-0.5">
                  Regras de disparo automático: Dia 3 (consultoria de caimento), Dia 6 (aviso de recolhimento) e Alerta ao Curador (vencendo em 2 dias)
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
            {/* Rule 1: Day 3 */}
            <div className="bg-[#10141d] p-4 rounded-xl border border-[#1e2636] space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/10 border border-blue-500/30 text-blue-300">
                  Lembrete Dia 3 (72h)
                </span>
                <Clock className="w-4 h-4 text-blue-400" />
              </div>
              <h4 className="font-semibold text-white text-sm">Consultoria de Prova & Dúvidas</h4>
              <p className="text-xs text-neutral-300 leading-relaxed bg-[#0c0f16] p-2.5 rounded-lg border border-[#18202d] italic">
                "Olá Dr. Guilherme! Passando para ver como ficaram os caimentos do linho e do blazer. Precisou de algum ajuste de alfaiataria em Canoinhas?"
              </p>
              <div className="text-[11px] text-neutral-400 flex items-center justify-between pt-2 border-t border-[#18202d]">
                <span>Público: Malas em teste há 3 dias</span>
                <span className="text-emerald-400 font-medium">Automação Ativa</span>
              </div>
            </div>

            {/* Rule 2: Day 6 */}
            <div className="bg-[#10141d] p-4 rounded-xl border border-[#1e2636] space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 border border-amber-500/30 text-amber-300">
                  Lembrete Dia 6 (144h)
                </span>
                <AlertTriangle className="w-4 h-4 text-amber-400" />
              </div>
              <h4 className="font-semibold text-white text-sm">Aviso de Recolhimento do Motorista</h4>
              <p className="text-xs text-neutral-300 leading-relaxed bg-[#0c0f16] p-2.5 rounded-lg border border-[#18202d] italic">
                "Olá Rodrigo! Seu período de prova da seleção Ravi's encerra amanhã. Qual horário prefere que nosso motorista passe na fazenda para recolher?"
              </p>
              <div className="text-[11px] text-neutral-400 flex items-center justify-between pt-2 border-t border-[#18202d]">
                <span>Público: 24h antes do prazo final</span>
                <span className="text-emerald-400 font-medium">Automação Ativa</span>
              </div>
            </div>

            {/* Rule 3: Curator Alert */}
            <div className="bg-[#10141d] p-4 rounded-xl border border-[#1e2636] space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-500/10 border border-purple-500/30 text-purple-300">
                  Alerta Interno do Curador
                </span>
                <ShieldCheck className="w-4 h-4 text-purple-400" />
              </div>
              <h4 className="font-semibold text-white text-sm">Mala Vencendo em 2 Dias</h4>
              <p className="text-xs text-neutral-300 leading-relaxed bg-[#0c0f16] p-2.5 rounded-lg border border-[#18202d] italic">
                "Notificação push para Mateus/Juliana: Mala COND-2026-088 de Bruno Becker atinge 5 dias de prova. Fazer contato ativo para fechar."
              </p>
              <div className="text-[11px] text-neutral-400 flex items-center justify-between pt-2 border-t border-[#18202d]">
                <span>Canal: Push App Móvel + WhatsApp</span>
                <span className="text-emerald-400 font-medium">SLA Implacável</span>
              </div>
            </div>
          </div>

          {/* Active Malas Tracking List for Reminders */}
          <div className="bg-[#10141d] rounded-xl border border-[#1e2636] overflow-hidden">
            <div className="p-3.5 border-b border-[#1e2636] flex items-center justify-between">
              <h4 className="font-semibold text-white text-sm">Status Atual de Lembretes por Mala Ativa</h4>
              <span className="text-xs text-neutral-400">Total: {condicionais.filter(b => b.status === 'EM_TESTE').length} malas em teste</span>
            </div>

            <div className="divide-y divide-[#18202d]">
              {condicionais.filter(b => b.status === 'EM_TESTE').map(box => (
                <div key={box.id} className="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[#c99738] font-bold">{box.code}</span>
                      <span className="font-semibold text-white">{box.clientName}</span>
                      <span className="text-neutral-400">({box.curatorName})</span>
                    </div>
                    <div className="text-[11px] text-neutral-400 mt-0.5">
                      Prazo: {box.daysRemaining} dias restantes ({box.hoursRemaining}h) • {box.items.length} peças ({new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(box.totalValue)})
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* D3 button */}
                    <button
                      type="button"
                      onClick={() => onTriggerReminder && onTriggerReminder(box.id, 'day3')}
                      className={`px-2.5 py-1 rounded text-[11px] font-medium border transition-colors ${
                        box.reminders?.day3Sent
                          ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                          : 'bg-[#18212e] text-neutral-300 border-[#253245] hover:text-white'
                      }`}
                    >
                      {box.reminders?.day3Sent ? '✓ D3 Enviado' : 'Disparar D3'}
                    </button>

                    {/* D6 button */}
                    <button
                      type="button"
                      onClick={() => onTriggerReminder && onTriggerReminder(box.id, 'day6')}
                      className={`px-2.5 py-1 rounded text-[11px] font-medium border transition-colors ${
                        box.reminders?.day6Sent
                          ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                          : 'bg-[#18212e] text-neutral-300 border-[#253245] hover:text-white'
                      }`}
                    >
                      {box.reminders?.day6Sent ? '✓ D6 Enviado' : 'Disparar D6'}
                    </button>

                    {/* Curator alert button */}
                    <button
                      type="button"
                      onClick={() => onTriggerReminder && onTriggerReminder(box.id, 'curatorAlert')}
                      className={`px-2.5 py-1 rounded text-[11px] font-medium border transition-colors ${
                        box.reminders?.curatorAlertSent
                          ? 'bg-purple-500/10 text-purple-300 border-purple-500/30'
                          : 'bg-[#18212e] text-neutral-300 border-[#253245] hover:text-white'
                      }`}
                    >
                      {box.reminders?.curatorAlertSent ? '✓ Curador Alertado' : 'Alertar Curador (48h)'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
