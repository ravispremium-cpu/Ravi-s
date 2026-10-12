import React, { useState, useMemo } from 'react';
import { 
  UnifiedMessage, 
  Client, 
  CondicionalBox, 
  Product,
  MessageChannel, 
  ConversationStatus, 
  ScheduledMessage, 
  AutomationRule, 
  AutomationLog, 
  Campaign,
  QuickReply,
  ApprovedTemplate
} from '../../types/crm';
import { 
  APPROVED_TEMPLATES, 
  QUICK_REPLIES, 
  DEFAULT_AUTOMATION_RULES, 
  INITIAL_AUTOMATION_LOGS, 
  INITIAL_SCHEDULED_MESSAGES, 
  INITIAL_CAMPAIGNS,
  CURATORS_LIST 
} from '../../data/automationData';
import { ScheduledMessagesModal } from './ScheduledMessagesModal';
import { AutomationTestModal } from './AutomationTestModal';
import { CampaignCreateModal } from './CampaignCreateModal';
import { 
  MessageSquare, 
  Send, 
  Instagram, 
  Phone, 
  Package, 
  Sparkles, 
  Clock, 
  CheckCheck, 
  ExternalLink, 
  Copy, 
  Check, 
  Zap,
  User,
  ShoppingBag,
  Filter,
  Search,
  Plus,
  Play,
  RotateCcw,
  ShieldCheck,
  Calendar,
  AlertTriangle,
  ChevronDown,
  Layers,
  TrendingUp,
  Mail,
  UserCheck,
  Sliders,
  Settings,
  HelpCircle,
  Smartphone
} from 'lucide-react';

interface UnifiedInboxProps {
  messages: UnifiedMessage[];
  clients: Client[];
  condicionais: CondicionalBox[];
  products?: Product[];
  onSendMessage: (clientId: string, content: string, channel: MessageChannel, assignedAgent?: string) => void;
  onOpenCondicionalForClient: (client: Client) => void;
  onSelectClientFor360?: (clientId: string) => void;
  onOpenVisionDoc?: () => void;
}

export const UnifiedInbox: React.FC<UnifiedInboxProps> = ({
  messages,
  clients,
  condicionais,
  products = [],
  onSendMessage,
  onOpenCondicionalForClient,
  onSelectClientFor360
}) => {
  // Navigation inside the Module
  const [activeModuleTab, setActiveModuleTab] = useState<'inbox' | 'automations' | 'campaigns' | 'compliance'>('inbox');

  // Filters for Inbox
  const [selectedClientId, setSelectedClientId] = useState<string>(clients[0]?.id || '');
  const [channelFilter, setChannelFilter] = useState<'ALL' | 'WHATSAPP' | 'INSTAGRAM' | 'EMAIL'>('ALL');
  const [statusFilter, setStatusFilter] = useState<'ALL' | ConversationStatus>('ALL');
  const [curatorFilter, setCuratorFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Conversation state overrides (by client ID)
  const [conversationStatuses, setConversationStatuses] = useState<Record<string, ConversationStatus>>({
    'cli-001': 'EM_ATENDIMENTO',
    'cli-002': 'ABERTO',
    'cli-003': 'RESOLVIDO',
    'cli-004': 'EM_ATENDIMENTO',
    'cli-005': 'ABERTO'
  });

  const [conversationCurators, setConversationCurators] = useState<Record<string, string>>({
    'cli-001': 'Matheus (Consultor Sênior)',
    'cli-002': 'Juliana (Consultora VIP)',
    'cli-003': 'Ravi (Curador-Chefe)',
    'cli-004': 'Juliana (Consultora VIP)',
    'cli-005': 'Matheus (Consultor Sênior)'
  });

  // Client LGPD overrides
  const [clientLgpdOverrides, setClientLgpdOverrides] = useState<Record<string, 'OPT_IN' | 'PENDENTE' | 'OPT_OUT'>>({
    'cli-001': 'OPT_IN',
    'cli-002': 'OPT_IN',
    'cli-003': 'OPT_IN',
    'cli-004': 'OPT_IN',
    'cli-005': 'OPT_IN'
  });

  // Composer State
  const [inputText, setInputText] = useState('');
  const [replyChannel, setReplyChannel] = useState<MessageChannel>('WHATSAPP');
  const [showQuickRepliesPopover, setShowQuickRepliesPopover] = useState(false);
  const [showTemplatesPopover, setShowTemplatesPopover] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Automation Engine State
  const [automationRules, setAutomationRules] = useState<AutomationRule[]>(DEFAULT_AUTOMATION_RULES);
  const [automationLogs, setAutomationLogs] = useState<AutomationLog[]>(INITIAL_AUTOMATION_LOGS);
  const [scheduledMessages, setScheduledMessages] = useState<ScheduledMessage[]>(INITIAL_SCHEDULED_MESSAGES);
  const [campaigns, setCampaigns] = useState<Campaign[]>(INITIAL_CAMPAIGNS);

  // Modals State
  const [isScheduledModalOpen, setIsScheduledModalOpen] = useState(false);
  const [isTestModalOpen, setIsTestModalOpen] = useState(false);
  const [selectedRuleForTest, setSelectedRuleForTest] = useState<AutomationRule | null>(null);
  const [isCampaignModalOpen, setIsCampaignModalOpen] = useState(false);

  // Helper Toast
  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const selectedClient = clients.find(c => c.id === selectedClientId) || clients[0];
  const activeCondicional = condicionais.find(c => c.clientId === selectedClientId && c.status !== 'FINALIZADO');
  const currentStatus = conversationStatuses[selectedClientId] || 'ABERTO';
  const currentCurator = conversationCurators[selectedClientId] || selectedClient?.preferredCurator || 'Matheus (Consultor Sênior)';

  // Filter messages for current thread
  const currentThread = useMemo(() => {
    return messages.filter(m => m.clientId === selectedClientId);
  }, [messages, selectedClientId]);

  // Handle Send from Inbox Composer
  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !selectedClient) return;

    onSendMessage(selectedClient.id, inputText.trim(), replyChannel, currentCurator);
    setInputText('');
    setShowQuickRepliesPopover(false);
    setShowTemplatesPopover(false);
    triggerToast(`Mensagem enviada via ${replyChannel} para ${selectedClient.name}!`);
  };

  // Quick Reply insertion
  const handleSelectQuickReply = (qr: QuickReply) => {
    setInputText(qr.content);
    setShowQuickRepliesPopover(false);
  };

  // Approved Template insertion with variable replacement
  const handleSelectTemplate = (tmpl: ApprovedTemplate) => {
    if (!selectedClient) {
      setInputText(tmpl.text);
      setShowTemplatesPopover(false);
      return;
    }
    const firstName = selectedClient.name.split(' ')[0];
    const personalized = tmpl.text
      .replace(/{nome}/g, firstName)
      .replace(/{cidade}/g, selectedClient.city || 'Canoinhas')
      .replace(/{tamanho_camisa}/g, selectedClient.sizes.shirt)
      .replace(/{tamanho}/g, selectedClient.sizes.shirt)
      .replace(/{estilo}/g, selectedClient.styleTags[0] || 'Moderno')
      .replace(/{quantidade_pecas}/g, '4')
      .replace(/{titulo_peca}/g, 'Camisa Linho Riviera')
      .replace(/{mes}/g, 'Outubro')
      .replace(/{valor_total}/g, 'R$ 780,00');

    setInputText(personalized);
    setShowTemplatesPopover(false);
  };

  // Toggle Automation Rule Active/Inactive
  const handleToggleRule = (ruleId: string) => {
    setAutomationRules(prev => prev.map(r => {
      if (r.id !== ruleId) return r;
      const updated = { ...r, isActive: !r.isActive };
      triggerToast(`Automação "${r.name}" ${updated.isActive ? 'ativada' : 'pausada'}!`);
      return updated;
    }));
  };

  // Execute Automation Test
  const handleExecuteAutomationTest = (
    rule: AutomationRule,
    targetClient: Client,
    generatedMessage: string,
    channel: MessageChannel
  ) => {
    // 1. Send simulated message
    onSendMessage(targetClient.id, generatedMessage, channel, 'Sistema Automação');

    // 2. Add to execution logs
    const newLog: AutomationLog = {
      id: `log-${Date.now()}`,
      automationKey: rule.key,
      automationName: rule.name,
      clientId: targetClient.id,
      clientName: targetClient.name,
      channel,
      status: 'SUCESSO',
      executedAt: 'Agora mesmo',
      details: `Disparo automático via ${channel}. Regra: ${rule.name}`,
      messagePreview: generatedMessage.slice(0, 80) + '...'
    };
    setAutomationLogs(prev => [newLog, ...prev]);

    // 3. Update execution count
    setAutomationRules(prev => prev.map(r => r.id === rule.id ? { ...r, totalExecutions: r.totalExecutions + 1 } : r));

    triggerToast(`Gatilho "${rule.name}" disparado com sucesso para ${targetClient.name}!`);
  };

  // Scheduled message handlers
  const handleAddScheduledMessage = (newMsgData: Omit<ScheduledMessage, 'id' | 'createdAt' | 'status'>) => {
    const newMsg: ScheduledMessage = {
      ...newMsgData,
      id: `sch-${Date.now()}`,
      status: 'PENDENTE',
      createdAt: new Date().toISOString()
    };
    setScheduledMessages(prev => [newMsg, ...prev]);
    triggerToast(`Mensagem agendada para ${new Date(newMsg.scheduledFor).toLocaleDateString('pt-BR')}!`);
  };

  const handleCancelScheduledMessage = (id: string) => {
    setScheduledMessages(prev => prev.map(m => m.id === id ? { ...m, status: 'CANCELADO' } : m));
    triggerToast('Agendamento cancelado com sucesso.');
  };

  const handleTriggerNowScheduledMessage = (id: string) => {
    const target = scheduledMessages.find(m => m.id === id);
    if (!target) return;

    onSendMessage(target.clientId, target.content, target.channel, target.creatorName);
    setScheduledMessages(prev => prev.map(m => m.id === id ? { ...m, status: 'DISPARADO' } : m));
    triggerToast(`Mensagem disparada imediatamente para ${target.clientName}!`);
  };

  // Add Campaign
  const handleCreateCampaign = (camp: Campaign) => {
    setCampaigns(prev => [camp, ...prev]);
    triggerToast(`Campanha "${camp.name}" criada e disparada para ${camp.eligibleCount} cliente(s)!`);
  };

  // Filter conversations list
  const filteredClients = useMemo(() => {
    return clients.filter(c => {
      // Query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = c.name.toLowerCase().includes(q);
        const matchesPhone = c.phone.includes(q);
        const matchesInsta = c.instagram?.toLowerCase().includes(q);
        if (!matchesName && !matchesPhone && !matchesInsta) return false;
      }

      // Status filter
      if (statusFilter !== 'ALL') {
        const status = conversationStatuses[c.id] || 'ABERTO';
        if (status !== statusFilter) return false;
      }

      // Curator filter
      if (curatorFilter !== 'ALL') {
        const cur = conversationCurators[c.id] || c.preferredCurator;
        if (!cur.includes(curatorFilter)) return false;
      }

      // Channel filter check
      if (channelFilter !== 'ALL') {
        const hasMsgInChannel = messages.some(m => m.clientId === c.id && m.channel === channelFilter);
        if (!hasMsgInChannel && channelFilter === 'EMAIL' && !c.email) return false;
        if (!hasMsgInChannel && channelFilter === 'INSTAGRAM' && !c.instagram) return false;
      }

      return true;
    });
  }, [clients, searchQuery, statusFilter, curatorFilter, channelFilter, messages, conversationStatuses, conversationCurators]);

  // Clean phone for wa.me link
  const getCleanPhone = (phone: string) => phone.replace(/\D/g, '');

  return (
    <div className="space-y-4">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed top-4 right-4 z-50 bg-[#161c28] border border-[#c99738]/60 text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2.5 text-xs animate-in fade-in">
          <span className="w-2 h-2 rounded-full bg-[#c99738] animate-ping" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Module Navigation Bar */}
      <div className="bg-[#10141d] border border-[#1f2637] rounded-2xl p-3 flex flex-wrap items-center justify-between gap-3 shadow-xl">
        <div className="flex items-center gap-1.5 overflow-x-auto">
          <button
            onClick={() => setActiveModuleTab('inbox')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeModuleTab === 'inbox'
                ? 'bg-gradient-to-r from-[#c99738] to-[#b07d24] text-black shadow-md'
                : 'text-neutral-400 hover:text-white hover:bg-[#161c27]'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>Inbox Omnichannel</span>
            <span className="text-[10px] bg-black/20 text-black px-1.5 py-0.2 rounded-full font-bold">
              {messages.filter(m => !m.read).length}
            </span>
          </button>

          <button
            onClick={() => setActiveModuleTab('automations')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeModuleTab === 'automations'
                ? 'bg-gradient-to-r from-[#c99738] to-[#b07d24] text-black shadow-md'
                : 'text-neutral-400 hover:text-white hover:bg-[#161c27]'
            }`}
          >
            <Zap className="w-4 h-4" />
            <span>Motor de Automações</span>
            <span className="text-[10px] bg-emerald-950 text-emerald-400 px-1.5 py-0.2 rounded-full font-bold border border-emerald-800/40">
              5 Ativas
            </span>
          </button>

          <button
            onClick={() => setActiveModuleTab('campaigns')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeModuleTab === 'campaigns'
                ? 'bg-gradient-to-r from-[#c99738] to-[#b07d24] text-black shadow-md'
                : 'text-neutral-400 hover:text-white hover:bg-[#161c27]'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Campanhas & Segmentação</span>
          </button>

          <button
            onClick={() => setActiveModuleTab('compliance')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeModuleTab === 'compliance'
                ? 'bg-gradient-to-r from-[#c99738] to-[#b07d24] text-black shadow-md'
                : 'text-neutral-400 hover:text-white hover:bg-[#161c27]'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>LGPD & Horários Comerciais</span>
          </button>
        </div>

        {/* Global Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsScheduledModalOpen(true)}
            className="px-3 py-1.5 rounded-xl bg-[#141924] hover:bg-[#1c2333] border border-[#232b3d] text-neutral-300 hover:text-white text-xs font-medium flex items-center gap-1.5 transition-colors"
          >
            <Clock className="w-3.5 h-3.5 text-[#c99738]" />
            <span>Mensagens Agendadas ({scheduledMessages.filter(m => m.status === 'PENDENTE').length})</span>
          </button>

          {activeModuleTab === 'campaigns' && (
            <button
              onClick={() => setIsCampaignModalOpen(true)}
              className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#c99738] to-[#b07d24] text-black text-xs font-bold hover:brightness-110 flex items-center gap-1.5 shadow-md"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Nova Campanha</span>
            </button>
          )}
        </div>
      </div>

      {/* TAB 1: INBOX OMNICHANNEL */}
      {activeModuleTab === 'inbox' && (
        <div className="bg-[#10141d] rounded-2xl border border-[#222a3b] overflow-hidden flex flex-col md:flex-row h-[760px] shadow-2xl">
          {/* Left Sidebar: Conversations Queue */}
          <div className="w-full md:w-88 border-r border-[#1e2535] flex flex-col bg-[#0d1017]">
            {/* Sidebar Header & Filters */}
            <div className="p-3.5 border-b border-[#1c2332] space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-xs text-white uppercase tracking-wider flex items-center gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5 text-[#c99738]" />
                  <span>Fila Omnichannel</span>
                </span>
                <span className="text-[10px] bg-emerald-950/60 text-emerald-400 px-2 py-0.5 rounded border border-emerald-800/40 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Meta Cloud & Evolution Conectado</span>
                </span>
              </div>

              {/* Search Bar */}
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-neutral-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar por nome, WhatsApp ou @"
                  className="w-full bg-[#141924] border border-[#222a3b] rounded-lg pl-8 pr-3 py-1.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#c99738]"
                />
              </div>

              {/* Channel Filter Pills */}
              <div className="grid grid-cols-4 gap-1 bg-[#141924] p-1 rounded-lg border border-[#20293a] text-[10px]">
                <button
                  onClick={() => setChannelFilter('ALL')}
                  className={`py-1 rounded text-center font-medium transition-colors ${
                    channelFilter === 'ALL' ? 'bg-[#252f44] text-white shadow-sm' : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  Todos
                </button>
                <button
                  onClick={() => setChannelFilter('WHATSAPP')}
                  className={`py-1 rounded text-center font-medium transition-colors flex items-center justify-center gap-1 ${
                    channelFilter === 'WHATSAPP' ? 'bg-emerald-950 text-emerald-300 border border-emerald-800/40' : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  <Phone className="w-2.5 h-2.5" />
                  <span>Zap</span>
                </button>
                <button
                  onClick={() => setChannelFilter('INSTAGRAM')}
                  className={`py-1 rounded text-center font-medium transition-colors flex items-center justify-center gap-1 ${
                    channelFilter === 'INSTAGRAM' ? 'bg-pink-950 text-pink-300 border border-pink-800/40' : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  <Instagram className="w-2.5 h-2.5" />
                  <span>Direct</span>
                </button>
                <button
                  onClick={() => setChannelFilter('EMAIL')}
                  className={`py-1 rounded text-center font-medium transition-colors flex items-center justify-center gap-1 ${
                    channelFilter === 'EMAIL' ? 'bg-blue-950 text-blue-300 border border-blue-800/40' : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  <Mail className="w-2.5 h-2.5" />
                  <span>E-mail</span>
                </button>
              </div>

              {/* Secondary filters: Status and Curator */}
              <div className="grid grid-cols-2 gap-1.5 text-[11px]">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as any)}
                  className="bg-[#141924] border border-[#20293a] text-neutral-300 rounded px-2 py-1 text-[11px] focus:outline-none"
                >
                  <option value="ALL">Status: Todos</option>
                  <option value="ABERTO">Aberto</option>
                  <option value="EM_ATENDIMENTO">Em Atendimento</option>
                  <option value="AGUARDANDO_CLIENTE">Aguardando Cliente</option>
                  <option value="RESOLVIDO">Resolvido</option>
                </select>

                <select
                  value={curatorFilter}
                  onChange={(e) => setCuratorFilter(e.target.value)}
                  className="bg-[#141924] border border-[#20293a] text-neutral-300 rounded px-2 py-1 text-[11px] focus:outline-none"
                >
                  <option value="ALL">Atendente: Todos</option>
                  <option value="Matheus">Matheus</option>
                  <option value="Juliana">Juliana</option>
                  <option value="Ravi">Ravi</option>
                  <option value="Camila">Camila</option>
                </select>
              </div>
            </div>

            {/* Conversation Threads List */}
            <div className="flex-1 overflow-y-auto divide-y divide-[#171d2b]">
              {filteredClients.length === 0 ? (
                <div className="p-8 text-center text-neutral-500 text-xs">
                  Nenhuma conversa encontrada com os filtros atuais.
                </div>
              ) : (
                filteredClients.map((client) => {
                  const isSelected = client.id === selectedClientId;
                  const clientMessages = messages.filter(m => m.clientId === client.id);
                  const lastMsg = clientMessages[clientMessages.length - 1];
                  const hasUnread = clientMessages.some(m => !m.read);
                  const activeBox = condicionais.find(c => c.clientId === client.id && c.status !== 'FINALIZADO');
                  const convStatus = conversationStatuses[client.id] || 'ABERTO';
                  const assignedCur = conversationCurators[client.id] || client.preferredCurator;

                  return (
                    <button
                      key={client.id}
                      onClick={() => setSelectedClientId(client.id)}
                      className={`w-full text-left p-3 transition-all relative flex flex-col gap-1.5 ${
                        isSelected 
                          ? 'bg-[#182030] border-l-4 border-l-[#c99738]' 
                          : 'hover:bg-[#131722]'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-1">
                        <div className="flex items-center gap-1.5 truncate">
                          {/* Channel Badge */}
                          <span className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 bg-emerald-950 text-emerald-400 border border-emerald-800/40">
                            <Phone className="w-3 h-3" />
                          </span>

                          <span className={`font-semibold text-xs truncate ${isSelected ? 'text-white' : 'text-neutral-200'}`}>
                            {client.name}
                          </span>
                        </div>

                        <div className="flex items-center gap-1 shrink-0">
                          {hasUnread && (
                            <span className="w-2 h-2 rounded-full bg-[#c99738] animate-pulse" />
                          )}
                          <span className="text-[10px] text-neutral-500">
                            {lastMsg?.timestamp || 'Hoje'}
                          </span>
                        </div>
                      </div>

                      {/* Snippet */}
                      <p className="text-[11px] text-neutral-400 line-clamp-1 font-sans">
                        {lastMsg ? (
                          <>
                            <span className="text-neutral-500">{lastMsg.sender === 'CURATOR' ? 'Você: ' : ''}</span>
                            {lastMsg.content}
                          </>
                        ) : (
                          'Iniciar primeiro contato exclusivo...'
                        )}
                      </p>

                      {/* Meta Pills: Size, Status, Active Box */}
                      <div className="flex items-center flex-wrap gap-1 pt-0.5">
                        <span className="text-[9px] bg-[#111622] text-neutral-300 px-1.5 py-0.5 rounded border border-[#1f283d]">
                          {client.sizes.shirt} • {client.sizes.pants}
                        </span>

                        <span className={`text-[9px] px-1.5 py-0.5 rounded font-medium border ${
                          convStatus === 'ABERTO'
                            ? 'bg-amber-950/50 text-amber-300 border-amber-800/40'
                            : convStatus === 'EM_ATENDIMENTO'
                            ? 'bg-blue-950/50 text-blue-300 border-blue-800/40'
                            : convStatus === 'AGUARDANDO_CLIENTE'
                            ? 'bg-purple-950/50 text-purple-300 border-purple-800/40'
                            : 'bg-emerald-950/50 text-emerald-300 border-emerald-800/40'
                        }`}>
                          {convStatus === 'EM_ATENDIMENTO' ? 'Atendendo' : convStatus}
                        </span>

                        {activeBox && (
                          <span className="text-[9px] bg-amber-500/10 text-[#c99738] px-1.5 py-0.5 rounded font-bold border border-amber-500/30 flex items-center gap-0.5">
                            <Package className="w-2.5 h-2.5" />
                            <span>Mala Ativa</span>
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </div>

          {/* Center & Right: Active Conversation Workspace */}
          <div className="flex-1 flex flex-col bg-[#11151f]">
            {selectedClient ? (
              <>
                {/* Chat Top Header */}
                <div className="p-3.5 border-b border-[#1c2332] bg-[#141924] flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#c99738] to-[#87621e] text-black font-black flex items-center justify-center text-sm shadow-md">
                      {selectedClient.name.slice(0, 2).toUpperCase()}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-sm text-white">{selectedClient.name}</h3>
                        <span className="text-[10px] bg-emerald-950 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-800/40 flex items-center gap-1 font-semibold">
                          <Phone className="w-2.5 h-2.5" />
                          <span>{selectedClient.phone}</span>
                        </span>
                        {selectedClient.instagram && (
                          <span className="text-[10px] bg-pink-950 text-pink-400 px-2 py-0.5 rounded-full border border-pink-800/40 flex items-center gap-1">
                            <Instagram className="w-2.5 h-2.5" />
                            <span>{selectedClient.instagram}</span>
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2 text-[11px] text-neutral-400 mt-0.5">
                        <span>{selectedClient.city}</span>
                        <span>•</span>
                        <span>Tamanho: <strong className="text-white">{selectedClient.sizes.shirt}</strong></span>
                        <span>•</span>
                        <span>Calça: <strong className="text-white">{selectedClient.sizes.pants}</strong> ({selectedClient.sizes.fitPreference})</span>
                      </div>
                    </div>
                  </div>

                  {/* Header Actions & Selectors */}
                  <div className="flex items-center flex-wrap gap-2">
                    {/* Status Select */}
                    <div className="flex items-center gap-1 text-xs">
                      <span className="text-[10px] text-neutral-400">Status:</span>
                      <select
                        value={currentStatus}
                        onChange={(e) => {
                          const val = e.target.value as ConversationStatus;
                          setConversationStatuses(prev => ({ ...prev, [selectedClient.id]: val }));
                          triggerToast(`Status alterado para ${val}`);
                        }}
                        className="bg-[#0c0e12] border border-[#232b3d] text-xs text-white rounded-lg px-2 py-1 focus:outline-none focus:border-[#c99738]"
                      >
                        <option value="ABERTO">Aberto</option>
                        <option value="EM_ATENDIMENTO">Em Atendimento</option>
                        <option value="AGUARDANDO_CLIENTE">Aguardando Cliente</option>
                        <option value="RESOLVIDO">Resolvido</option>
                      </select>
                    </div>

                    {/* Assigned Curator Select */}
                    <div className="flex items-center gap-1 text-xs">
                      <span className="text-[10px] text-neutral-400">Atendente:</span>
                      <select
                        value={currentCurator}
                        onChange={(e) => {
                          const val = e.target.value;
                          setConversationCurators(prev => ({ ...prev, [selectedClient.id]: val }));
                          triggerToast(`Conversa atribuída a ${val}`);
                        }}
                        className="bg-[#0c0e12] border border-[#232b3d] text-xs text-white rounded-lg px-2 py-1 focus:outline-none focus:border-[#c99738]"
                      >
                        {CURATORS_LIST.map(cur => (
                          <option key={cur} value={cur}>{cur.split(' ')[0]}</option>
                        ))}
                      </select>
                    </div>

                    {/* Quick Profile 360 & Condicional Link Buttons */}
                    {onSelectClientFor360 && (
                      <button
                        onClick={() => onSelectClientFor360(selectedClient.id)}
                        className="p-1.5 rounded-lg bg-[#1a202c] hover:bg-[#252d3d] text-neutral-300 hover:text-white border border-[#232b3d] text-xs flex items-center gap-1 transition-colors"
                        title="Ver Perfil 360° Completo"
                      >
                        <User className="w-3.5 h-3.5 text-[#c99738]" />
                        <span className="hidden sm:inline">360°</span>
                      </button>
                    )}

                    <button
                      onClick={() => onOpenCondicionalForClient(selectedClient)}
                      className="p-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-[#c99738] border border-amber-500/30 text-xs font-semibold flex items-center gap-1 transition-colors"
                      title="Montar Condicional para este Cliente"
                    >
                      <Package className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Montar Mala</span>
                    </button>

                    <a
                      href={`https://wa.me/55${getCleanPhone(selectedClient.phone)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/30 text-xs flex items-center gap-1 transition-colors"
                      title="Abrir no WhatsApp Oficial"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>

                {/* Active Condicional Banner if any */}
                {activeCondicional && (
                  <div className="bg-[#19150d] border-b border-[#3b2d13] px-4 py-2 flex items-center justify-between text-xs text-amber-200">
                    <div className="flex items-center gap-2">
                      <Package className="w-4 h-4 text-[#c99738]" />
                      <span>
                        Mala Ativa <strong>{activeCondicional.code}</strong> • Status: <strong>{activeCondicional.status}</strong> ({activeCondicional.items.length} peças • R$ {activeCondicional.totalValue})
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] bg-amber-950 text-[#c99738] px-2 py-0.5 rounded border border-amber-800/40">
                        {activeCondicional.daysRemaining} dias restantes
                      </span>
                      <button
                        onClick={() => onOpenCondicionalForClient(selectedClient)}
                        className="text-[11px] underline text-[#c99738] font-bold"
                      >
                        Gerenciar Mala
                      </button>
                    </div>
                  </div>
                )}

                {/* Message Bubble Stream */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#0a0d13]">
                  {currentThread.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center p-6 text-neutral-500">
                      <MessageSquare className="w-10 h-10 text-neutral-600 mb-2 stroke-[1.5]" />
                      <p className="text-sm font-medium text-neutral-300">Nenhuma mensagem registrada ainda</p>
                      <p className="text-xs text-neutral-500 max-w-sm mt-1">
                        Use o formulário abaixo ou escolha uma Resposta Rápida (`/tamanho` ou `/condicional`) para iniciar a curadoria.
                      </p>
                    </div>
                  ) : (
                    currentThread.map((msg) => {
                      const isCurator = msg.sender === 'CURATOR';
                      const isSystem = msg.sender === 'SYSTEM';

                      if (isSystem) {
                        return (
                          <div key={msg.id} className="flex justify-center my-2">
                            <div className="bg-[#141924] border border-[#232b3d] text-neutral-400 text-[11px] px-3 py-1 rounded-full flex items-center gap-1.5 shadow-sm">
                              <Zap className="w-3 h-3 text-[#c99738]" />
                              <span>{msg.content}</span>
                              <span className="text-neutral-500">• {msg.timestamp}</span>
                            </div>
                          </div>
                        );
                      }

                      return (
                        <div
                          key={msg.id}
                          className={`flex flex-col ${isCurator ? 'items-end' : 'items-start'}`}
                        >
                          <div
                            className={`max-w-[85%] sm:max-w-[70%] rounded-2xl p-3.5 shadow-md ${
                              isCurator
                                ? 'bg-[#182030] border border-[#c99738]/30 text-neutral-100 rounded-tr-xs'
                                : 'bg-[#131722] border border-[#232b3d] text-neutral-100 rounded-tl-xs'
                            }`}
                          >
                            {/* Message Header */}
                            <div className="flex items-center justify-between gap-3 text-[10px] text-neutral-400 mb-1 border-b border-[#222a3a] pb-1">
                              <span className="font-semibold text-[#c99738] flex items-center gap-1">
                                {isCurator ? (msg.assignedAgent || 'Curador Ravi\'s') : selectedClient.name}
                              </span>

                              <span className="flex items-center gap-1 text-neutral-500">
                                {msg.channel === 'WHATSAPP' && <Phone className="w-2.5 h-2.5 text-emerald-400" />}
                                {msg.channel === 'INSTAGRAM' && <Instagram className="w-2.5 h-2.5 text-pink-400" />}
                                {msg.channel === 'EMAIL' && <Mail className="w-2.5 h-2.5 text-blue-400" />}
                                <span>{msg.timestamp}</span>
                              </span>
                            </div>

                            <p className="text-xs font-sans leading-relaxed whitespace-pre-line">
                              {msg.content}
                            </p>

                            {/* Status checks */}
                            {isCurator && (
                              <div className="flex justify-end pt-1">
                                <CheckCheck className="w-3.5 h-3.5 text-[#c99738]" />
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

                {/* Quick Action Popovers */}
                {/* 1. Quick Replies Drawer */}
                {showQuickRepliesPopover && (
                  <div className="p-3 bg-[#141924] border-t border-[#232b3d] animate-in fade-in space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white flex items-center gap-1.5">
                        <Zap className="w-3.5 h-3.5 text-[#c99738]" />
                        <span>Respostas Rápidas (Atalhos de Barra)</span>
                      </span>
                      <button
                        onClick={() => setShowQuickRepliesPopover(false)}
                        className="text-neutral-400 hover:text-white text-xs"
                      >
                        Fechar
                      </button>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {QUICK_REPLIES.map(qr => (
                        <button
                          key={qr.id}
                          onClick={() => handleSelectQuickReply(qr)}
                          className="p-2 rounded-lg bg-[#0c0e12] border border-[#232b3d] hover:border-[#c99738]/50 text-left text-xs transition-colors group"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-[#c99738] group-hover:underline">
                              {qr.shortcut}
                            </span>
                            <span className="text-[9px] text-neutral-500">
                              {qr.category}
                            </span>
                          </div>
                          <span className="text-[11px] text-neutral-300 font-medium block truncate mt-0.5">
                            {qr.title}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* 2. Templates Popover */}
                {showTemplatesPopover && (
                  <div className="p-3 bg-[#141924] border-t border-[#232b3d] animate-in fade-in space-y-2 max-h-56 overflow-y-auto">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-[#c99738]" />
                        <span>Templates Oficiais Aprovados Meta & Ravi's</span>
                      </span>
                      <button
                        onClick={() => setShowTemplatesPopover(false)}
                        className="text-neutral-400 hover:text-white text-xs"
                      >
                        Fechar
                      </button>
                    </div>

                    <div className="space-y-1.5">
                      {APPROVED_TEMPLATES.map(tmpl => (
                        <button
                          key={tmpl.id}
                          onClick={() => handleSelectTemplate(tmpl)}
                          className="w-full p-2.5 rounded-lg bg-[#0c0e12] border border-[#232b3d] hover:border-[#c99738]/50 text-left transition-colors"
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-bold text-white">
                              {tmpl.name}
                            </span>
                            <span className="text-[9px] bg-emerald-950 text-emerald-400 px-1.5 py-0.2 rounded border border-emerald-800/40">
                              {tmpl.metaStatus}
                            </span>
                          </div>
                          <p className="text-[11px] text-neutral-400 line-clamp-1 font-sans">
                            {tmpl.text}
                          </p>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Composer Footer */}
                <div className="p-3 border-t border-[#1c2332] bg-[#141924] space-y-2">
                  <div className="flex items-center justify-between">
                    {/* Channel Selector for this message */}
                    <div className="flex items-center gap-1 text-[11px]">
                      <span className="text-neutral-400 mr-1">Canal de Envio:</span>
                      <button
                        type="button"
                        onClick={() => setReplyChannel('WHATSAPP')}
                        className={`px-2 py-0.5 rounded flex items-center gap-1 font-medium transition-colors ${
                          replyChannel === 'WHATSAPP' 
                            ? 'bg-emerald-950 text-emerald-300 border border-emerald-800/50' 
                            : 'text-neutral-400 hover:text-white'
                        }`}
                      >
                        <Phone className="w-2.5 h-2.5" />
                        <span>WhatsApp</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setReplyChannel('INSTAGRAM')}
                        className={`px-2 py-0.5 rounded flex items-center gap-1 font-medium transition-colors ${
                          replyChannel === 'INSTAGRAM' 
                            ? 'bg-pink-950 text-pink-300 border border-pink-800/50' 
                            : 'text-neutral-400 hover:text-white'
                        }`}
                      >
                        <Instagram className="w-2.5 h-2.5" />
                        <span>Instagram</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setReplyChannel('EMAIL')}
                        className={`px-2 py-0.5 rounded flex items-center gap-1 font-medium transition-colors ${
                          replyChannel === 'EMAIL' 
                            ? 'bg-blue-950 text-blue-300 border border-blue-800/50' 
                            : 'text-neutral-400 hover:text-white'
                        }`}
                      >
                        <Mail className="w-2.5 h-2.5" />
                        <span>E-mail</span>
                      </button>
                    </div>

                    {/* Quick Tools */}
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => {
                          setShowQuickRepliesPopover(!showQuickRepliesPopover);
                          setShowTemplatesPopover(false);
                        }}
                        className="px-2 py-1 rounded bg-[#1c2332] hover:bg-[#252f44] text-[11px] text-neutral-300 hover:text-white flex items-center gap-1 transition-colors"
                      >
                        <Zap className="w-3 h-3 text-[#c99738]" />
                        <span>Respostas Rápidas</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setShowTemplatesPopover(!showTemplatesPopover);
                          setShowQuickRepliesPopover(false);
                        }}
                        className="px-2 py-1 rounded bg-[#1c2332] hover:bg-[#252f44] text-[11px] text-neutral-300 hover:text-white flex items-center gap-1 transition-colors"
                      >
                        <Sparkles className="w-3 h-3 text-[#c99738]" />
                        <span>Templates</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setIsScheduledModalOpen(true)}
                        className="px-2 py-1 rounded bg-[#1c2332] hover:bg-[#252f44] text-[11px] text-neutral-300 hover:text-white flex items-center gap-1 transition-colors"
                        title="Agendar Mensagem para Horário Específico"
                      >
                        <Clock className="w-3 h-3 text-amber-400" />
                        <span className="hidden sm:inline">Agendar</span>
                      </button>
                    </div>
                  </div>

                  {/* Input form */}
                  <form onSubmit={handleSend} className="flex gap-2">
                    <textarea
                      rows={2}
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSend(e);
                        }
                      }}
                      placeholder={`Escreva sua mensagem via ${replyChannel}... (Pressione Enter para enviar)`}
                      className="flex-1 bg-[#0c0e12] border border-[#232b3d] rounded-xl p-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#c99738] resize-none font-sans"
                    />

                    <button
                      type="submit"
                      disabled={!inputText.trim()}
                      className="px-4 bg-gradient-to-r from-[#c99738] to-[#b07d24] text-black font-bold text-xs rounded-xl hover:brightness-110 transition-all flex items-center justify-center gap-1.5 shadow-lg shadow-amber-950/30 disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
                    >
                      <Send className="w-3.5 h-3.5 fill-black" />
                      <span className="hidden sm:inline">Enviar</span>
                    </button>
                  </form>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-neutral-500 text-xs">
                Selecione uma conversa ao lado para visualizar e interagir.
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: MOTOR DE AUTOMAÇÕES */}
      {activeModuleTab === 'automations' && (
        <div className="space-y-5">
          {/* Automation Health & Architecture Header */}
          <div className="bg-[#10141d] border border-[#222a3b] rounded-2xl p-4 sm:p-5 shadow-xl">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#1f2637] pb-4 mb-4">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Zap className="w-5 h-5 text-[#c99738]" />
                  <span>Automações de Moda Ravi's Premium (Engine Hub)</span>
                </h3>
                <p className="text-xs text-neutral-400 mt-0.5">
                  Arquitetura inspirada no Salesforce & HubSpot, calibrada exclusivamente para Curadoria e Mala Condicional
                </p>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-xs bg-emerald-950/60 text-emerald-400 px-3 py-1 rounded-full border border-emerald-800/40 font-bold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  <span>Fila Redis BullMQ Online</span>
                </span>
              </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-[#141924] border border-[#20293a] rounded-xl p-3">
                <span className="text-[11px] text-neutral-400 block font-medium">Workflows Ativos</span>
                <span className="text-xl font-black text-white mt-0.5 block">5 de 5</span>
                <span className="text-[10px] text-emerald-400 mt-1 block">100% Operacional</span>
              </div>

              <div className="bg-[#141924] border border-[#20293a] rounded-xl p-3">
                <span className="text-[11px] text-neutral-400 block font-medium">Disparos Automatizados</span>
                <span className="text-xl font-black text-amber-400 mt-0.5 block">
                  {automationRules.reduce((acc, r) => acc + r.totalExecutions, 0)}
                </span>
                <span className="text-[10px] text-neutral-400 mt-1 block">Últimos 30 dias</span>
              </div>

              <div className="bg-[#141924] border border-[#20293a] rounded-xl p-3">
                <span className="text-[11px] text-neutral-400 block font-medium">Taxa de Sucesso</span>
                <span className="text-xl font-black text-emerald-400 mt-0.5 block">98.1%</span>
                <span className="text-[10px] text-neutral-400 mt-1 block">Anti-spam ativo</span>
              </div>

              <div className="bg-[#141924] border border-[#20293a] rounded-xl p-3">
                <span className="text-[11px] text-neutral-400 block font-medium">Janela Comercial</span>
                <span className="text-xl font-black text-[#c99738] mt-0.5 block">08:30 - 19:30</span>
                <span className="text-[10px] text-neutral-400 mt-1 block">Canoinhas-SC</span>
              </div>
            </div>
          </div>

          {/* The 5 Core Automation Cards */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-neutral-400 uppercase tracking-wider flex items-center gap-2">
              <Sliders className="w-3.5 h-3.5 text-[#c99738]" />
              <span>Regras de Automação de Curadoria</span>
            </h4>

            <div className="grid grid-cols-1 gap-3.5">
              {automationRules.map((rule) => (
                <div
                  key={rule.id}
                  className={`bg-[#10141d] border rounded-2xl p-4 sm:p-5 transition-all shadow-lg ${
                    rule.isActive ? 'border-[#232b3d]' : 'border-neutral-800/40 opacity-60'
                  }`}
                >
                  <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 text-[#c99738] flex items-center justify-center font-bold text-sm shrink-0">
                        <Zap className="w-5 h-5" />
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-sm text-white">{rule.name}</h4>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                            rule.isActive
                              ? 'bg-emerald-950/60 text-emerald-400 border-emerald-800/40'
                              : 'bg-neutral-800 text-neutral-400 border-neutral-700'
                          }`}>
                            {rule.isActive ? 'ATIVO' : 'PAUSADO'}
                          </span>
                        </div>
                        <p className="text-xs text-neutral-400 mt-0.5 max-w-2xl leading-relaxed">
                          {rule.description}
                        </p>
                      </div>
                    </div>

                    {/* Actions: Toggle and Test Button */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setSelectedRuleForTest(rule);
                          setIsTestModalOpen(true);
                        }}
                        className="px-3 py-1.5 rounded-xl bg-[#1a202c] hover:bg-[#252d3d] border border-[#2a354b] text-xs font-bold text-[#c99738] flex items-center gap-1.5 transition-colors"
                      >
                        <Play className="w-3 h-3 fill-[#c99738]" />
                        <span>Testar Disparo / Executar Agora</span>
                      </button>

                      <button
                        onClick={() => handleToggleRule(rule.id)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                          rule.isActive
                            ? 'bg-rose-950/40 hover:bg-rose-950/60 text-rose-300 border border-rose-800/40'
                            : 'bg-emerald-950/40 hover:bg-emerald-950/60 text-emerald-300 border border-emerald-800/40'
                        }`}
                      >
                        {rule.isActive ? 'Pausar' : 'Ativar'}
                      </button>
                    </div>
                  </div>

                  {/* Architecture Flow Pills */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs bg-[#0c0e12] p-3 rounded-xl border border-[#1f2637] mb-3">
                    <div>
                      <span className="text-[10px] text-neutral-500 font-bold uppercase block">⚡ Gatilho (Trigger)</span>
                      <span className="text-neutral-200 font-medium block truncate mt-0.5">{rule.trigger}</span>
                    </div>

                    <div>
                      <span className="text-[10px] text-neutral-500 font-bold uppercase block">🔍 Condição (Filter)</span>
                      <span className="text-neutral-200 font-medium block truncate mt-0.5">{rule.condition}</span>
                    </div>

                    <div>
                      <span className="text-[10px] text-neutral-500 font-bold uppercase block">📲 Ação & Canal</span>
                      <span className="text-amber-400 font-medium block truncate mt-0.5">{rule.action}</span>
                    </div>
                  </div>

                  {/* Message Template Preview & Metrics */}
                  <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] pt-2 border-t border-[#1a2130] text-neutral-400">
                    <div className="flex items-center gap-4">
                      <span>Execuções: <strong className="text-white">{rule.totalExecutions}</strong></span>
                      <span>Taxa de Sucesso: <strong className="text-emerald-400">{rule.successRate}%</strong></span>
                      <span>Último Disparo: <strong className="text-neutral-300">{rule.lastExecutedAt || 'N/A'}</strong></span>
                    </div>

                    <div className="text-[10px] text-neutral-500">
                      Canal: <strong className="text-white">{rule.channel}</strong> (WhatsApp Business & Evolution API)
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Real-time Execution Logs */}
          <div className="bg-[#10141d] border border-[#222a3b] rounded-2xl p-4 sm:p-5 shadow-xl space-y-3">
            <div className="flex items-center justify-between border-b border-[#1f2637] pb-3">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-[#c99738]" />
                <span>Logs de Execução em Tempo Real (Automation Stream)</span>
              </h4>
              <span className="text-[11px] text-neutral-400">
                {automationLogs.length} eventos registrados
              </span>
            </div>

            <div className="space-y-2 max-h-72 overflow-y-auto">
              {automationLogs.map((log) => (
                <div
                  key={log.id}
                  className="p-3 rounded-xl bg-[#0c0e12] border border-[#1f2637] flex flex-wrap items-center justify-between gap-3 text-xs"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white">{log.clientName}</span>
                        <span className="text-[10px] text-[#c99738] font-semibold bg-amber-950/40 px-2 py-0.2 rounded border border-amber-800/40">
                          {log.automationName}
                        </span>
                        <span className="text-[10px] bg-emerald-950 text-emerald-400 px-1.5 py-0.2 rounded border border-emerald-800/40">
                          {log.channel}
                        </span>
                      </div>
                      <p className="text-[11px] text-neutral-400 mt-0.5 font-sans">
                        {log.details}
                      </p>
                    </div>
                  </div>

                  <div className="text-right text-[11px] text-neutral-500">
                    <span>{log.executedAt}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: CAMPANHAS & SEGMENTAÇÃO */}
      {activeModuleTab === 'campaigns' && (
        <div className="space-y-5">
          {/* Campaigns Overview */}
          <div className="bg-[#10141d] border border-[#222a3b] rounded-2xl p-4 sm:p-5 shadow-xl">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#1f2637] pb-4 mb-4">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-[#c99738]" />
                  <span>Campanhas com Segmentação Inteligente</span>
                </h3>
                <p className="text-xs text-neutral-400 mt-0.5">
                  Disparos em lote para públicos selecionados por tamanho, estilo e histórico de compras
                </p>
              </div>

              <button
                onClick={() => setIsCampaignModalOpen(true)}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#c99738] to-[#b07d24] text-black text-xs font-bold hover:brightness-110 flex items-center gap-1.5 shadow-md"
              >
                <Plus className="w-4 h-4" />
                <span>Nova Campanha Segmentada</span>
              </button>
            </div>

            {/* Campaign Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-[#141924] border border-[#20293a] rounded-xl p-3">
                <span className="text-[11px] text-neutral-400 block font-medium">Campanhas Executadas</span>
                <span className="text-xl font-black text-white mt-0.5 block">{campaigns.length}</span>
                <span className="text-[10px] text-neutral-400 mt-1 block">100% Entregues</span>
              </div>

              <div className="bg-[#141924] border border-[#20293a] rounded-xl p-3">
                <span className="text-[11px] text-neutral-400 block font-medium">Taxa de Abertura / Leitura</span>
                <span className="text-xl font-black text-emerald-400 mt-0.5 block">94.8%</span>
                <span className="text-[10px] text-neutral-400 mt-1 block">WhatsApp Oficial</span>
              </div>

              <div className="bg-[#141924] border border-[#20293a] rounded-xl p-3">
                <span className="text-[11px] text-neutral-400 block font-medium">Taxa de Resposta</span>
                <span className="text-xl font-black text-amber-400 mt-0.5 block">56.5%</span>
                <span className="text-[10px] text-neutral-400 mt-1 block">Interações diretas</span>
              </div>

              <div className="bg-[#141924] border border-[#20293a] rounded-xl p-3">
                <span className="text-[11px] text-neutral-400 block font-medium">Conversão em Condicional</span>
                <span className="text-xl font-black text-[#c99738] mt-0.5 block">43.4%</span>
                <span className="text-[10px] text-neutral-400 mt-1 block">Malas enviadas</span>
              </div>
            </div>
          </div>

          {/* Campaigns List */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-neutral-400 uppercase tracking-wider flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-[#c99738]" />
              <span>Histórico de Campanhas</span>
            </h4>

            {campaigns.map((camp) => (
              <div
                key={camp.id}
                className="bg-[#10141d] border border-[#222a3b] rounded-2xl p-4 sm:p-5 shadow-lg space-y-3"
              >
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#1f2637] pb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/30 text-[#c99738] flex items-center justify-center font-bold">
                      <Sparkles className="w-4 h-4" />
                    </div>

                    <div>
                      <h4 className="font-bold text-sm text-white">{camp.name}</h4>
                      <div className="flex items-center gap-2 text-[11px] text-neutral-400 mt-0.5">
                        <span>Disparado em: {camp.createdAt}</span>
                        <span>•</span>
                        <span>Canal: <strong>{camp.channel}</strong></span>
                        <span>•</span>
                        <span>Destinatários: <strong className="text-amber-400">{camp.eligibleCount}</strong></span>
                      </div>
                    </div>
                  </div>

                  <span className="text-xs bg-emerald-950 text-emerald-400 px-2.5 py-1 rounded-full border border-emerald-800/40 font-bold">
                    {camp.status}
                  </span>
                </div>

                {/* Filters Pill */}
                <div className="flex items-center flex-wrap gap-1.5 text-[11px]">
                  <span className="text-neutral-500">Segmentação aplicada:</span>
                  {camp.targetFilter.size && (
                    <span className="bg-[#141924] text-neutral-300 px-2 py-0.5 rounded border border-[#222a3b]">
                      Tamanho: <strong>{camp.targetFilter.size}</strong>
                    </span>
                  )}
                  {camp.targetFilter.style && (
                    <span className="bg-[#141924] text-neutral-300 px-2 py-0.5 rounded border border-[#222a3b]">
                      Estilo: <strong>{camp.targetFilter.style}</strong>
                    </span>
                  )}
                  {camp.targetFilter.city && (
                    <span className="bg-[#141924] text-neutral-300 px-2 py-0.5 rounded border border-[#222a3b]">
                      Cidade: <strong>{camp.targetFilter.city}</strong>
                    </span>
                  )}
                </div>

                {/* Message snippet */}
                <p className="text-xs text-neutral-300 bg-[#0c0e12] p-3 rounded-xl border border-[#1f2637] font-sans leading-relaxed">
                  "{camp.templateMessage}"
                </p>

                {/* Campaign Analytics Bar */}
                {camp.stats && (
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-1 text-center text-xs">
                    <div className="bg-[#141924] p-2 rounded-lg border border-[#20293a]">
                      <span className="text-[10px] text-neutral-400 block">Enviados</span>
                      <strong className="text-white text-sm">{camp.stats.sent}</strong>
                    </div>
                    <div className="bg-[#141924] p-2 rounded-lg border border-[#20293a]">
                      <span className="text-[10px] text-neutral-400 block">Entregues</span>
                      <strong className="text-emerald-400 text-sm">{camp.stats.delivered} (100%)</strong>
                    </div>
                    <div className="bg-[#141924] p-2 rounded-lg border border-[#20293a]">
                      <span className="text-[10px] text-neutral-400 block">Lidos</span>
                      <strong className="text-[#c99738] text-sm">{camp.stats.read}</strong>
                    </div>
                    <div className="bg-[#141924] p-2 rounded-lg border border-[#20293a]">
                      <span className="text-[10px] text-neutral-400 block">Respostas</span>
                      <strong className="text-amber-400 text-sm">{camp.stats.replied}</strong>
                    </div>
                    <div className="bg-[#141924] p-2 rounded-lg border border-[#20293a]">
                      <span className="text-[10px] text-neutral-400 block">Condicionais Gerados</span>
                      <strong className="text-emerald-400 text-sm">{camp.stats.converted}</strong>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: COMPLIANCE LGPD & HORÁRIOS COMERCIAIS */}
      {activeModuleTab === 'compliance' && (
        <div className="space-y-5">
          {/* Business Hours & Anti-Ban Settings */}
          <div className="bg-[#10141d] border border-[#222a3b] rounded-2xl p-4 sm:p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#1f2637] pb-3">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Clock className="w-5 h-5 text-[#c99738]" />
                  <span>Janela de Disparo Comercial & Anti-Ban Meta</span>
                </h3>
                <p className="text-xs text-neutral-400 mt-0.5">
                  Política de proteção da marca Ravi's e respeito aos clientes em Canoinhas e Planalto Norte
                </p>
              </div>

              <div className="flex items-center gap-2 bg-emerald-950/60 text-emerald-400 px-3 py-1.5 rounded-xl border border-emerald-800/40 text-xs font-bold">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Janela Comercial Aberta (08:30 - 19:30)</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="bg-[#141924] border border-[#20293a] rounded-xl p-3.5 space-y-1">
                <span className="font-semibold text-white block">Horário Permitido de Disparos</span>
                <p className="text-[11px] text-neutral-400">
                  Segunda a Sexta: <strong>08:30 às 19:30</strong><br />
                  Sábados: <strong>08:30 às 13:00</strong><br />
                  Domingos e Feriados: <strong>Bloqueado (Fila em Espera)</strong>
                </p>
              </div>

              <div className="bg-[#141924] border border-[#20293a] rounded-xl p-3.5 space-y-1">
                <span className="font-semibold text-white block">Intervalo Randômico Anti-Bloqueio</span>
                <p className="text-[11px] text-neutral-400">
                  Delay dinâmico de <strong>3 a 7 segundos</strong> entre cada mensagem individual via Evolution API / Meta Cloud para garantir entregabilidade humana 100%.
                </p>
              </div>

              <div className="bg-[#141924] border border-[#20293a] rounded-xl p-3.5 space-y-1">
                <span className="font-semibold text-white block">Tratamento de Descadastramento (Opt-out)</span>
                <p className="text-[11px] text-neutral-400">
                  Se o cliente responder "PARAR", "SAIR" ou solicitar não receber mais contatos, o sistema altera seu status para <strong>OPT_OUT</strong> imediatamente.
                </p>
              </div>
            </div>
          </div>

          {/* Client LGPD Consent Management Table */}
          <div className="bg-[#10141d] border border-[#222a3b] rounded-2xl p-4 sm:p-5 shadow-xl space-y-3">
            <div className="flex items-center justify-between border-b border-[#1f2637] pb-3">
              <div>
                <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Base de Clientes & Consentimento LGPD (Opt-in)</span>
                </h4>
                <p className="text-[11px] text-neutral-400 mt-0.5">
                  Conformidade com a Lei Geral de Proteção de Dados (Lei nº 13.709/2018)
                </p>
              </div>
              <span className="text-xs text-neutral-400">
                {clients.length} clientes monitorados
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[#1f2637] text-neutral-400 text-[11px]">
                    <th className="pb-2 font-medium">Cliente</th>
                    <th className="pb-2 font-medium">Telefone / WhatsApp</th>
                    <th className="pb-2 font-medium">Cidade</th>
                    <th className="pb-2 font-medium">Consentimento LGPD</th>
                    <th className="pb-2 font-medium text-right">Ação</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#171d2b]">
                  {clients.map((c) => {
                    const consent = clientLgpdOverrides[c.id] || c.lgpdConsent || 'OPT_IN';

                    return (
                      <tr key={c.id} className="hover:bg-[#141924]/50">
                        <td className="py-2.5 font-semibold text-white">
                          {c.name}
                        </td>
                        <td className="py-2.5 text-neutral-300">
                          {c.phone}
                        </td>
                        <td className="py-2.5 text-neutral-400">
                          {c.city}
                        </td>
                        <td className="py-2.5">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                            consent === 'OPT_IN'
                              ? 'bg-emerald-950 text-emerald-400 border-emerald-800/40'
                              : consent === 'PENDENTE'
                              ? 'bg-amber-950 text-amber-300 border-amber-800/40'
                              : 'bg-rose-950 text-rose-300 border-rose-800/40'
                          }`}>
                            {consent === 'OPT_IN' ? 'Opt-in Confirmado' : consent}
                          </span>
                        </td>
                        <td className="py-2.5 text-right">
                          <button
                            onClick={() => {
                              const nextStatus = consent === 'OPT_IN' ? 'OPT_OUT' : 'OPT_IN';
                              setClientLgpdOverrides(prev => ({ ...prev, [c.id]: nextStatus }));
                              triggerToast(`Status LGPD de ${c.name} alterado para ${nextStatus}!`);
                            }}
                            className="text-[11px] text-[#c99738] hover:underline font-medium"
                          >
                            Alternar Consentimento
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 1: SCHEDULED MESSAGES */}
      <ScheduledMessagesModal
        isOpen={isScheduledModalOpen}
        onClose={() => setIsScheduledModalOpen(false)}
        scheduledMessages={scheduledMessages}
        clients={clients}
        onAddScheduledMessage={handleAddScheduledMessage}
        onCancelScheduledMessage={handleCancelScheduledMessage}
        onTriggerNowScheduledMessage={handleTriggerNowScheduledMessage}
        preSelectedClientId={selectedClientId}
      />

      {/* MODAL 2: AUTOMATION TEST RUNNER */}
      <AutomationTestModal
        isOpen={isTestModalOpen}
        onClose={() => setIsTestModalOpen(false)}
        automationRule={selectedRuleForTest}
        clients={clients}
        products={products}
        onExecuteTest={handleExecuteAutomationTest}
      />

      {/* MODAL 3: CAMPAIGN CREATE */}
      <CampaignCreateModal
        isOpen={isCampaignModalOpen}
        onClose={() => setIsCampaignModalOpen(false)}
        clients={clients}
        onCreateCampaign={handleCreateCampaign}
      />
    </div>
  );
};
