import React, { useState } from 'react';
import { AutomationRule, Client, Product, MessageChannel } from '../../types/crm';
import { 
  X, 
  Sparkles, 
  Zap, 
  CheckCircle2, 
  Send, 
  Clock, 
  ShieldCheck, 
  User, 
  Layers, 
  AlertTriangle,
  Play
} from 'lucide-react';

interface AutomationTestModalProps {
  isOpen: boolean;
  onClose: () => void;
  automationRule: AutomationRule | null;
  clients: Client[];
  products: Product[];
  onExecuteTest: (
    rule: AutomationRule,
    targetClient: Client,
    generatedMessage: string,
    channel: MessageChannel
  ) => void;
}

export const AutomationTestModal: React.FC<AutomationTestModalProps> = ({
  isOpen,
  onClose,
  automationRule,
  clients,
  products,
  onExecuteTest
}) => {
  if (!isOpen || !automationRule) return null;

  const [selectedClientId, setSelectedClientId] = useState<string>(clients[0]?.id || '');
  const [selectedProductId, setSelectedProductId] = useState<string>(products[0]?.id || '');
  const [isExecuting, setIsExecuting] = useState(false);
  const [executionResult, setExecutionResult] = useState<string | null>(null);

  const selectedClient = clients.find(c => c.id === selectedClientId) || clients[0];
  const selectedProduct = products.find(p => p.id === selectedProductId) || products[0];

  // Helper to replace placeholders
  const generatePersonalizedMessage = () => {
    if (!selectedClient) return automationRule.templateText;

    const firstName = selectedClient.name.split(' ')[0];
    let text = automationRule.templateText
      .replace(/{nome}/g, firstName)
      .replace(/{cidade}/g, selectedClient.city || 'Canoinhas')
      .replace(/{tamanho_camisa}/g, selectedClient.sizes.shirt)
      .replace(/{tamanho}/g, selectedClient.sizes.shirt)
      .replace(/{estilo}/g, selectedClient.styleTags[0] || 'Moderno')
      .replace(/{titulo_peca}/g, selectedProduct?.title || 'Camisa Linho Riviera')
      .replace(/{quantidade_pecas}/g, '4')
      .replace(/{mes}/g, 'Outubro')
      .replace(/{valor_total}/g, 'R$ 840,00');

    return text;
  };

  const previewMessage = generatePersonalizedMessage();

  const handleRunExecution = () => {
    if (!selectedClient) return;
    setIsExecuting(true);

    setTimeout(() => {
      onExecuteTest(
        automationRule,
        selectedClient,
        previewMessage,
        (automationRule.channel === 'MULTICANAL' ? 'WHATSAPP' : automationRule.channel) as MessageChannel
      );
      setIsExecuting(false);
      setExecutionResult(`Disparo simulado com sucesso para ${selectedClient.name}! Mensagem inserida no inbox e log registrado.`);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-sm animate-in fade-in">
      <div className="bg-[#10141d] border border-[#232b3d] rounded-2xl w-full max-w-xl flex flex-col shadow-2xl overflow-hidden max-h-[92vh]">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[#1f2637] flex items-center justify-between bg-[#141924]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-[#c99738]">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                Simulador & Teste de Automação
              </h2>
              <p className="text-xs text-neutral-400">
                {automationRule.name}
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

        {/* Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4">
          {/* Target Client Selector */}
          <div>
            <label className="block text-xs font-semibold text-neutral-300 mb-1.5 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-[#c99738]" />
              <span>Cliente Alvo para o Teste</span>
            </label>
            <select
              value={selectedClientId}
              onChange={(e) => {
                setSelectedClientId(e.target.value);
                setExecutionResult(null);
              }}
              className="w-full bg-[#0c0e12] border border-[#232b3d] rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-[#c99738]"
            >
              {clients.map(c => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.phone}) • Camisa: {c.sizes.shirt} • Calça: {c.sizes.pants} • Estilo: {c.styleTags.join(', ')}
                </option>
              ))}
            </select>
          </div>

          {/* Conditional Product Selector for Drop / Catalog Match */}
          {automationRule.key === 'DROP_NOVA_PECA' && (
            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1.5 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-[#c99738]" />
                <span>Peça Limitada Recém-Cadastrada (Gatilho de Drop)</span>
              </label>
              <select
                value={selectedProductId}
                onChange={(e) => {
                  setSelectedProductId(e.target.value);
                  setExecutionResult(null);
                }}
                className="w-full bg-[#0c0e12] border border-[#232b3d] rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-[#c99738]"
              >
                {products.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.title} (R$ {p.price}) • {p.category} • {p.tag}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Pipeline Checks Simulation */}
          <div className="bg-[#141924] border border-[#222a3b] rounded-xl p-3.5 space-y-2">
            <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider block">
              Validações de Regra de Negócio (Engine Execution)
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
              <div className="flex items-center gap-1.5 text-emerald-400 bg-emerald-950/40 p-2 rounded-lg border border-emerald-900/30">
                <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                <span>Consentimento LGPD: <strong>{selectedClient?.lgpdConsent || 'OPT_IN'}</strong></span>
              </div>
              <div className="flex items-center gap-1.5 text-emerald-400 bg-emerald-950/40 p-2 rounded-lg border border-emerald-900/30">
                <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                <span>Janela Comercial: <strong>Permitida (08:30-19:30)</strong></span>
              </div>
              <div className="flex items-center gap-1.5 text-neutral-300 bg-[#0c0e12] p-2 rounded-lg border border-[#1f2637]">
                <Clock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>Gatilho: <strong>{automationRule.trigger}</strong></span>
              </div>
              <div className="flex items-center gap-1.5 text-neutral-300 bg-[#0c0e12] p-2 rounded-lg border border-[#1f2637]">
                <Sparkles className="w-3.5 h-3.5 text-[#c99738] shrink-0" />
                <span>Canal: <strong>{automationRule.channel} (Evolution API)</strong></span>
              </div>
            </div>
          </div>

          {/* Generated Message Preview */}
          <div>
            <label className="block text-xs font-semibold text-neutral-300 mb-1.5 flex items-center justify-between">
              <span>Mensagem Personalizada Gerada (WhatsApp Preview)</span>
              <span className="text-[10px] text-[#c99738] font-normal">Variáveis substituídas</span>
            </label>
            <div className="p-3.5 rounded-xl bg-[#0c0e12] border border-[#222a3b] text-xs text-neutral-200 font-sans leading-relaxed relative">
              <div className="absolute top-2 right-2 flex items-center gap-1 text-[10px] bg-emerald-950 text-emerald-400 px-2 py-0.5 rounded border border-emerald-800/40">
                WhatsApp Preview
              </div>
              <p className="whitespace-pre-line pt-2">
                {previewMessage}
              </p>
            </div>
          </div>

          {/* Execution Result Banner */}
          {executionResult && (
            <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-800/50 text-emerald-300 text-xs flex items-center gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{executionResult}</span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#1f2637] bg-[#141924] flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-[#1a202c] hover:bg-[#252d3d] text-xs font-medium text-neutral-300 transition-colors"
          >
            Fechar
          </button>

          <button
            onClick={handleRunExecution}
            disabled={isExecuting}
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#c99738] to-[#b07d24] text-black text-xs font-bold hover:brightness-110 flex items-center gap-2 transition-all shadow-lg shadow-amber-950/30 disabled:opacity-50"
          >
            {isExecuting ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                <span>Simulando Disparo...</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-black" />
                <span>Executar Disparo de Teste Agora</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
