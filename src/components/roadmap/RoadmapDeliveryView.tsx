import React, { useState } from 'react';
import { 
  Calendar, 
  CheckCircle2, 
  Clock, 
  TrendingUp, 
  TrendingDown, 
  Target, 
  MapPin, 
  ShieldCheck, 
  Smartphone, 
  MessageSquare, 
  Layers, 
  Store, 
  Zap, 
  Copy, 
  Check, 
  ChevronRight, 
  FileText, 
  AlertTriangle,
  Play,
  RotateCcw,
  Sparkles,
  Users
} from 'lucide-react';
import { 
  ROADMAP_SPRINTS, 
  PRODUCT_SUCCESS_METRICS, 
  ROLLOUT_PLAN, 
  RoadmapSprint, 
  AcceptanceCriterion 
} from '../../data/roadmapData';

export function RoadmapDeliveryView() {
  const [activeTab, setActiveTab] = useState<'sprints' | 'criteria' | 'metrics' | 'rollout'>('sprints');
  const [selectedSprintId, setSelectedSprintId] = useState<string>('sprint-1-2');
  const [filterRole, setFilterRole] = useState<'ALL' | 'CURADOR' | 'GESTOR' | 'TECH'>('ALL');
  const [copiedSection, setCopiedSection] = useState<string | null>(null);
  
  // Interactive criterion test simulator state
  const [simulatingCriterionId, setSimulatingCriterionId] = useState<string | null>(null);
  const [testResults, setTestResults] = useState<Record<string, { status: 'idle' | 'running' | 'passed'; logs: string[] }>>({});

  const selectedSprint = ROADMAP_SPRINTS.find(s => s.id === selectedSprintId) || ROADMAP_SPRINTS[0];

  const handleCopyText = (text: string, sectionKey: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(sectionKey);
    setTimeout(() => setCopiedSection(null), 2500);
  };

  const handleRunTestSimulation = (criterion: AcceptanceCriterion) => {
    setSimulatingCriterionId(criterion.id);
    setTestResults(prev => ({
      ...prev,
      [criterion.id]: {
        status: 'running',
        logs: [
          `[INIT] Iniciando teste automatizado para ${criterion.id}...`,
          `[MOCK] Contexto: Loja Canoinhas - SC | Curador Conectado`,
          `[ACTION] Executando cenário: ${criterion.testScenario.slice(0, 60)}...`
        ]
      }
    }));

    setTimeout(() => {
      setTestResults(prev => ({
        ...prev,
        [criterion.id]: {
          status: 'passed',
          logs: [
            `[INIT] Iniciando teste automatizado para ${criterion.id}...`,
            `[MOCK] Contexto: Loja Canoinhas - SC | Curador Conectado`,
            `[ACTION] Executando cenário: ${criterion.testScenario.slice(0, 60)}...`,
            `[ASSERTION] Verificando resultado esperado: ${criterion.expectedOutcome.slice(0, 70)}...`,
            `[SUCCESS] 200 OK — Critério de aceite validado com 100% de conformidade!`
          ]
        }
      }));
      setSimulatingCriterionId(null);
    }, 1100);
  };

  const handleResetTests = () => {
    setTestResults({});
  };

  // Generate full markdown specification export
  const getFullMarkdownRoadmap = () => {
    let md = `# ROADMAP DE ENTREGA — RAVIS CRM (RAVI'S PREMIUM MENSWEAR)\n`;
    md += `*Planejamento Estratégico em Sprints de 2 Semanas com Metodologia Ágil e Piloto Canoinhas*\n\n`;
    
    md += `## 1. VISÃO GERAL DAS SPRINTS\n\n`;
    ROADMAP_SPRINTS.forEach(s => {
      md += `### ${s.title} (${s.targetTimeline})\n`;
      md += `- **Fase:** ${s.phase}\n`;
      md += `- **Duração:** ${s.durationWeeks} semanas\n`;
      md += `- **Resumo:** ${s.summary}\n`;
      md += `- **Módulos:** ${s.modulesIncluded.join(', ')}\n\n`;
      md += `#### Critérios de Aceite Testáveis:\n`;
      s.acceptanceCriteria.forEach(ac => {
        md += `  - **[${ac.id}] ${ac.criterion}**\n`;
        md += `    - *Cenário:* ${ac.testScenario}\n`;
        md += `    - *Resultado Esperado:* ${ac.expectedOutcome}\n`;
      });
      md += `\n`;
    });

    md += `## 2. MÉTRICAS DE SUCESSO DO PRODUTO (KPIs)\n\n`;
    PRODUCT_SUCCESS_METRICS.forEach(m => {
      md += `### ${m.metricName} (${m.targetDirection === 'increase' ? '▲ Aumento' : '▼ Redução'})\n`;
      md += `- Linha de Base Atual: ${m.baseline}\n`;
      md += `- Meta MVP (30 dias): ${m.targetMVP}\n`;
      md += `- Meta Escala (90 dias): ${m.targetScale}\n`;
      md += `- Impacto no Negócio: ${m.businessImpact}\n\n`;
    });

    md += `## 3. PLANO DE ROLLOUT — LOJA CANOINHAS - SC\n\n`;
    ROLLOUT_PLAN.forEach(p => {
      md += `### Fase ${p.phaseNumber}: ${p.name} (${p.period})\n`;
      md += `- **Escopo:** ${p.scope} (${p.curatorsCount} curador(es))\n`;
      md += `- **Atividades:**\n`;
      p.activities.forEach(a => md += `  - ${a}\n`);
      md += `- **Critérios de Saída (Gates):**\n`;
      p.exitCriteria.forEach(e => md += `  - [x] ${e}\n`);
      md += `\n`;
    });

    return md;
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Top Banner / Hero */}
      <div className="bg-gradient-to-r from-[#141416] via-[#1A1A1C] to-[#121214] border border-[#C9A227]/30 rounded-2xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#C9A227]/5 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
        
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C9A227]/15 border border-[#C9A227]/30 text-xs font-medium text-[#C9A227]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Cronograma Oficial de Lançamento & Sprints Ágeis</span>
            </div>
            
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-serif text-[#EDE6D6] tracking-tight">
              Roadmap de Entrega & Plano de Rollout <span className="text-[#C9A227]">Ravi's CRM</span>
            </h1>
            
            <p className="text-sm sm:text-base text-neutral-300 font-sans leading-relaxed">
              Ciclo de desenvolvimento planejado em sprints de 2 semanas, partindo do 
              <strong className="text-[#C9A227]"> MVP Fundação (4 semanas)</strong> com mala condicional e WhatsApp, até o 
              <strong className="text-emerald-400"> App Mobile Offline-First</strong>. Inclui critérios de aceite testáveis e rollout controlado de 30 dias na loja de Canoinhas - SC.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2 text-xs text-neutral-400">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-[#C9A227]" />
                <strong>12 Semanas Totais</strong> (6 Sprints)
              </span>
              <span className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#C9A227]" />
                <strong>Piloto Inicial:</strong> Loja Física Canoinhas
              </span>
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <strong>17 Critérios de Aceite</strong> com Testes
              </span>
            </div>
          </div>

          {/* Quick Action Button for Full Markdown Export */}
          <div className="shrink-0 flex flex-col gap-2.5">
            <button
              onClick={() => handleCopyText(getFullMarkdownRoadmap(), 'full-plan')}
              className="px-4 py-3 rounded-xl bg-gradient-to-r from-[#C9A227] to-[#A07C1C] hover:from-[#d8b030] hover:to-[#b58e23] text-black font-semibold text-xs tracking-wider uppercase transition-all shadow-lg flex items-center justify-center gap-2"
            >
              {copiedSection === 'full-plan' ? (
                <>
                  <Check className="w-4 h-4 text-black" />
                  <span>Copiado com Sucesso!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-black" />
                  <span>Copiar Especificação (.MD)</span>
                </>
              )}
            </button>
            <span className="text-[11px] text-center text-neutral-400">
              Exportar para Jira, Notion ou Documentação
            </span>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 border-b border-[#2D2D2E] pb-3 overflow-x-auto scrollbar-none">
        <button
          onClick={() => setActiveTab('sprints')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            activeTab === 'sprints'
              ? 'bg-[#C9A227] text-black shadow-md font-semibold'
              : 'text-neutral-300 hover:text-[#EDE6D6] hover:bg-[#1A1A1A]'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Sprints & Entregas (1 a 6)</span>
          <span className="text-xs px-1.5 py-0.2 rounded-full bg-black/20 font-mono">
            {ROADMAP_SPRINTS.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('criteria')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            activeTab === 'criteria'
              ? 'bg-[#C9A227] text-black shadow-md font-semibold'
              : 'text-neutral-300 hover:text-[#EDE6D6] hover:bg-[#1A1A1A]'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Critérios de Aceite Testáveis</span>
          <span className="text-xs px-1.5 py-0.2 rounded-full bg-black/20 font-mono">
            17
          </span>
        </button>

        <button
          onClick={() => setActiveTab('metrics')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            activeTab === 'metrics'
              ? 'bg-[#C9A227] text-black shadow-md font-semibold'
              : 'text-neutral-300 hover:text-[#EDE6D6] hover:bg-[#1A1A1A]'
          }`}
        >
          <Target className="w-4 h-4" />
          <span>Métricas de Sucesso (KPIs)</span>
          <span className="text-xs px-1.5 py-0.2 rounded-full bg-black/20 font-mono">
            {PRODUCT_SUCCESS_METRICS.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('rollout')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            activeTab === 'rollout'
              ? 'bg-[#C9A227] text-black shadow-md font-semibold'
              : 'text-neutral-300 hover:text-[#EDE6D6] hover:bg-[#1A1A1A]'
          }`}
        >
          <Store className="w-4 h-4" />
          <span>Plano de Rollout (Canoinhas 30d)</span>
          <span className="text-xs px-1.5 py-0.2 rounded-full bg-black/20 font-mono">
            3 Fases
          </span>
        </button>
      </div>

      {/* TAB 1: SPRINTS & TIMELINE */}
      {activeTab === 'sprints' && (
        <div className="space-y-6">
          {/* Sprints Horizontal Progress Stepper */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {ROADMAP_SPRINTS.map((sprint) => {
              const isSelected = sprint.id === selectedSprintId;
              const isMVP = sprint.id === 'sprint-1-2';
              return (
                <button
                  key={sprint.id}
                  onClick={() => setSelectedSprintId(sprint.id)}
                  className={`p-4 rounded-xl border text-left transition-all relative overflow-hidden flex flex-col justify-between ${
                    isSelected
                      ? 'bg-[#1E1E22] border-[#C9A227] shadow-lg shadow-[#C9A227]/10'
                      : 'bg-[#141416] border-[#262628] hover:border-[#38383B] hover:bg-[#18181A]'
                  }`}
                >
                  {isMVP && (
                    <div className="absolute top-0 right-0 bg-[#C9A227] text-black text-[9px] font-bold px-2 py-0.5 rounded-bl">
                      MVP CRÍTICO
                    </div>
                  )}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className={`text-xs font-semibold ${isSelected ? 'text-[#C9A227]' : 'text-neutral-400'}`}>
                        {sprint.badge.split('(')[0].trim()}
                      </span>
                      <span className="text-[10px] text-neutral-400">
                        {sprint.durationWeeks} sem
                      </span>
                    </div>
                    <div className="text-sm font-medium text-[#EDE6D6] line-clamp-1">
                      {sprint.title.split(':')[1]?.trim() || sprint.title}
                    </div>
                  </div>

                  <div className="mt-3 flex items-center justify-between pt-2 border-t border-[#262628] text-[11px] text-neutral-400">
                    <span>{sprint.acceptanceCriteria.length} critérios</span>
                    <span className="text-emerald-400">✓ Definido</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Selected Sprint Detailed Card */}
          <div className="bg-[#141416] border border-[#2D2D2E] rounded-2xl p-6 sm:p-8 space-y-6">
            {/* Header info */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#262628]">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#C9A227]/20 border border-[#C9A227]/40 text-[#C9A227]">
                    {selectedSprint.badge}
                  </span>
                  <span className="text-xs text-neutral-400 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-neutral-400" />
                    {selectedSprint.targetTimeline} ({selectedSprint.durationWeeks} semanas de ciclo)
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-serif text-[#EDE6D6]">
                  {selectedSprint.title}
                </h2>
                <p className="text-sm text-neutral-300 mt-2 max-w-3xl leading-relaxed">
                  {selectedSprint.summary}
                </p>
              </div>

              <div className="shrink-0 flex items-center gap-2">
                <button
                  onClick={() => {
                    setActiveTab('criteria');
                  }}
                  className="px-4 py-2 rounded-lg bg-[#1F1F23] hover:bg-[#28282D] border border-[#3A3A3D] text-xs font-medium text-[#EDE6D6] flex items-center gap-2 transition-colors"
                >
                  <ShieldCheck className="w-4 h-4 text-[#C9A227]" />
                  <span>Ver Todos os Critérios ({selectedSprint.acceptanceCriteria.length})</span>
                </button>
              </div>
            </div>

            {/* Modules and Deliverables Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Modules Included */}
              <div className="bg-[#19191C] border border-[#262628] rounded-xl p-5 space-y-3">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-[#C9A227] flex items-center gap-2">
                  <Layers className="w-4 h-4" />
                  <span>Módulos de Negócio Entregues nesta Sprint</span>
                </h3>
                <ul className="space-y-2.5">
                  {selectedSprint.modulesIncluded.map((mod, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-xs text-neutral-200">
                      <CheckCircle2 className="w-4 h-4 text-[#C9A227] shrink-0 mt-0.5" />
                      <span>{mod}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Technical Deliverables */}
              <div className="bg-[#19191C] border border-[#262628] rounded-xl p-5 space-y-3">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-blue-400 flex items-center gap-2">
                  <Zap className="w-4 h-4" />
                  <span>Entregáveis Técnicos & Arquitetura</span>
                </h3>
                <ul className="space-y-2.5">
                  {selectedSprint.deliverablesTech.map((tech, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-xs text-neutral-300">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0 mt-1.5" />
                      <span>{tech}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Testable Acceptance Criteria for this sprint */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-serif text-[#EDE6D6] flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Critérios de Aceite Testáveis para Aprovação da Sprint</span>
                </h3>
                <span className="text-xs text-neutral-400">
                  Garante que o desenvolvimento cumpre rigorosamente os requisitos
                </span>
              </div>

              <div className="space-y-3">
                {selectedSprint.acceptanceCriteria.map((criterion) => {
                  const testState = testResults[criterion.id];
                  const isSimulating = simulatingCriterionId === criterion.id;

                  return (
                    <div
                      key={criterion.id}
                      className="bg-[#18181B] border border-[#2A2A2E] rounded-xl p-4 sm:p-5 space-y-3"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="flex items-center gap-2.5">
                          <span className="px-2 py-0.5 rounded bg-[#C9A227]/20 border border-[#C9A227]/40 text-[#C9A227] text-xs font-mono font-bold">
                            {criterion.id}
                          </span>
                          <h4 className="text-sm font-medium text-[#EDE6D6]">
                            {criterion.criterion}
                          </h4>
                        </div>

                        {/* Interactive Test Simulator Button */}
                        <div className="flex items-center gap-2">
                          {testState?.status === 'passed' ? (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-medium">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Aprovado em Teste</span>
                            </span>
                          ) : (
                            <button
                              onClick={() => handleRunTestSimulation(criterion)}
                              disabled={isSimulating}
                              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#242429] hover:bg-[#2F2F36] border border-[#3A3A42] text-xs font-medium text-neutral-200 transition-colors disabled:opacity-50"
                            >
                              {isSimulating ? (
                                <>
                                  <div className="w-3 h-3 border-2 border-[#C9A227] border-t-transparent rounded-full animate-spin" />
                                  <span>Simulando Teste...</span>
                                </>
                              ) : (
                                <>
                                  <Play className="w-3 h-3 text-[#C9A227]" />
                                  <span>Executar Teste de Aceite</span>
                                </>
                              )}
                            </button>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                        <div className="bg-[#121214] p-3 rounded-lg border border-[#222225]">
                          <span className="text-[#C9A227] font-semibold block mb-1">
                            Cenário de Teste:
                          </span>
                          <p className="text-neutral-300 leading-relaxed font-mono">
                            {criterion.testScenario}
                          </p>
                        </div>

                        <div className="bg-[#121214] p-3 rounded-lg border border-[#222225]">
                          <span className="text-emerald-400 font-semibold block mb-1">
                            Resultado Esperado:
                          </span>
                          <p className="text-neutral-300 leading-relaxed font-mono">
                            {criterion.expectedOutcome}
                          </p>
                        </div>
                      </div>

                      {/* Execution simulation log output */}
                      {testState && (
                        <div className="bg-black/40 border border-[#2D2D33] rounded-lg p-3 font-mono text-[11px] text-neutral-300 space-y-1">
                          {testState.logs.map((log, lIdx) => (
                            <div key={lIdx} className={log.includes('SUCCESS') ? 'text-emerald-400 font-bold' : log.includes('ASSERTION') ? 'text-[#C9A227]' : 'text-neutral-400'}>
                              {log}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Risk, Mitigation & Business Impact */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-[#262628]">
              <div className="bg-amber-950/20 border border-amber-900/30 rounded-xl p-4 flex items-start gap-3">
                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div className="text-xs space-y-1">
                  <span className="font-semibold text-amber-300 block">
                    Gestão de Riscos & Mitigação
                  </span>
                  <p className="text-neutral-300 leading-relaxed">
                    {selectedSprint.risksAndMitigation}
                  </p>
                </div>
              </div>

              <div className="bg-emerald-950/20 border border-emerald-900/30 rounded-xl p-4 flex items-start gap-3">
                <TrendingUp className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div className="text-xs space-y-1">
                  <span className="font-semibold text-emerald-300 block">
                    Impacto nos KPIs da Ravi's
                  </span>
                  <ul className="space-y-1 text-neutral-300">
                    {selectedSprint.kpiImpact.map((kpi, kIdx) => (
                      <li key={kIdx} className="flex items-center gap-1.5">
                        <span className="text-emerald-400">✓</span>
                        <span>{kpi}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: ACCEPTANCE CRITERIA MATRIX */}
      {activeTab === 'criteria' && (
        <div className="bg-[#141416] border border-[#2D2D2E] rounded-2xl p-6 sm:p-8 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#262628]">
            <div>
              <h2 className="text-xl font-serif text-[#EDE6D6] flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <span>Matriz de Critérios de Aceite Testáveis (17 Requisitos)</span>
              </h2>
              <p className="text-xs text-neutral-400 mt-1">
                Critérios objetivos e automatizáveis que definem o término bem-sucedido de cada sprint
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleResetTests}
                className="px-3 py-1.5 rounded-lg bg-[#1F1F23] hover:bg-[#28282D] text-xs text-neutral-300 flex items-center gap-1.5 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Resetar Simulações</span>
              </button>

              <button
                onClick={() => {
                  ROADMAP_SPRINTS.flatMap(s => s.acceptanceCriteria).forEach(c => {
                    handleRunTestSimulation(c);
                  });
                }}
                className="px-3 py-1.5 rounded-lg bg-[#C9A227] hover:bg-[#d8b030] text-xs font-semibold text-black flex items-center gap-1.5 transition-colors"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Executar Todos (17)</span>
              </button>
            </div>
          </div>

          {/* List grouped by Sprint */}
          <div className="space-y-6">
            {ROADMAP_SPRINTS.map((sprint) => (
              <div key={sprint.id} className="space-y-3">
                <div className="flex items-center justify-between border-b border-[#262628] pb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#C9A227]" />
                    <h3 className="text-sm font-semibold text-[#EDE6D6]">
                      {sprint.title}
                    </h3>
                  </div>
                  <span className="text-xs text-neutral-400">
                    {sprint.acceptanceCriteria.length} critérios
                  </span>
                </div>

                <div className="space-y-3">
                  {sprint.acceptanceCriteria.map((criterion) => {
                    const testState = testResults[criterion.id];
                    const isSimulating = simulatingCriterionId === criterion.id;

                    return (
                      <div
                        key={criterion.id}
                        className="bg-[#18181B] border border-[#262628] rounded-xl p-4 hover:border-[#38383D] transition-colors space-y-3"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 rounded bg-[#C9A227]/20 border border-[#C9A227]/40 text-[#C9A227] text-xs font-mono font-bold">
                              {criterion.id}
                            </span>
                            <span className="text-xs font-semibold text-neutral-200">
                              {criterion.criterion}
                            </span>
                          </div>

                          <button
                            onClick={() => handleRunTestSimulation(criterion)}
                            disabled={isSimulating}
                            className={`text-xs px-2.5 py-1 rounded flex items-center gap-1.5 transition-colors ${
                              testState?.status === 'passed'
                                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                : 'bg-[#222226] text-neutral-300 hover:bg-[#2A2A30] border border-[#333338]'
                            }`}
                          >
                            {testState?.status === 'passed' ? (
                              <>
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                                <span>Aprovado</span>
                              </>
                            ) : isSimulating ? (
                              <span>Simulando...</span>
                            ) : (
                              <>
                                <Play className="w-3 h-3 text-[#C9A227]" />
                                <span>Testar</span>
                              </>
                            )}
                          </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-mono">
                          <div className="bg-[#121214] p-2.5 rounded border border-[#222225]">
                            <span className="text-[#C9A227] block text-[11px] mb-1">Cenário:</span>
                            <span className="text-neutral-300">{criterion.testScenario}</span>
                          </div>
                          <div className="bg-[#121214] p-2.5 rounded border border-[#222225]">
                            <span className="text-emerald-400 block text-[11px] mb-1">Resultado Esperado:</span>
                            <span className="text-neutral-300">{criterion.expectedOutcome}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: PRODUCT SUCCESS METRICS */}
      {activeTab === 'metrics' && (
        <div className="space-y-6">
          <div className="bg-[#141416] border border-[#2D2D2E] rounded-2xl p-6 sm:p-8 space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#262628]">
              <div>
                <h2 className="text-xl font-serif text-[#EDE6D6] flex items-center gap-2">
                  <Target className="w-5 h-5 text-[#C9A227]" />
                  <span>Métricas de Sucesso do Produto (KPIs Oficiais)</span>
                </h2>
                <p className="text-xs text-neutral-300 mt-1 max-w-2xl leading-relaxed">
                  Metas quantitativas alinhadas às 4 diretrizes estratégicas da Ravi's: 
                  <strong className="text-[#C9A227]"> taxa de conversão aumenta</strong>, 
                  <strong className="text-emerald-400"> tempo de montagem diminui</strong>, 
                  <strong className="text-blue-400"> tempo de atendimento diminui</strong> e 
                  <strong className="text-amber-300"> ticket médio aumenta</strong>.
                </p>
              </div>

              <div className="text-right text-xs text-neutral-400">
                <span className="block text-neutral-200 font-medium">Ciclo de Avaliação</span>
                <span>Canoinhas - SC | 30 a 90 dias</span>
              </div>
            </div>

            {/* Metric KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {PRODUCT_SUCCESS_METRICS.map((metric) => {
                const isIncrease = metric.targetDirection === 'increase';

                return (
                  <div
                    key={metric.id}
                    className="bg-[#19191C] border border-[#262628] rounded-xl p-5 flex flex-col justify-between hover:border-[#3A3A3E] transition-all space-y-4"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-[#C9A227]/15 text-[#C9A227] font-semibold">
                          {metric.id}
                        </span>
                        <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded ${
                          isIncrease ? 'bg-emerald-500/15 text-emerald-400' : 'bg-blue-500/15 text-blue-400'
                        }`}>
                          {isIncrease ? (
                            <>
                              <TrendingUp className="w-3.5 h-3.5" />
                              <span>Meta: Aumentar</span>
                            </>
                          ) : (
                            <>
                              <TrendingDown className="w-3.5 h-3.5" />
                              <span>Meta: Reduzir</span>
                            </>
                          )}
                        </span>
                      </div>

                      <h3 className="text-sm font-semibold text-[#EDE6D6] leading-snug">
                        {metric.metricName}
                      </h3>
                      <p className="text-[11px] text-neutral-400 mt-0.5">
                        {metric.unit}
                      </p>
                    </div>

                    {/* Progress Comparison */}
                    <div className="bg-[#121214] p-3 rounded-lg border border-[#222225] space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-neutral-400">Linha de Base Atual:</span>
                        <strong className="text-neutral-300 font-mono">{metric.baseline}</strong>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-[#C9A227]">Meta MVP (30d):</span>
                        <strong className="text-[#C9A227] font-mono">{metric.targetMVP}</strong>
                      </div>
                      <div className="flex items-center justify-between text-xs border-t border-[#222225] pt-1.5">
                        <span className="text-emerald-400">Meta Escala (90d):</span>
                        <strong className="text-emerald-400 font-mono font-bold">{metric.targetScale}</strong>
                      </div>
                    </div>

                    <div className="space-y-1.5 text-xs">
                      <span className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider block">
                        Impacto Comercial:
                      </span>
                      <p className="text-neutral-300 leading-relaxed text-[11px]">
                        {metric.businessImpact}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-[#222225] text-[10px] text-neutral-400">
                      <strong>Como Medir:</strong> {metric.measurementMethod}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: ROLLOUT PLAN (CANOINHAS 30 DAYS) */}
      {activeTab === 'rollout' && (
        <div className="space-y-6">
          <div className="bg-[#141416] border border-[#2D2D2E] rounded-2xl p-6 sm:p-8 space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#262628]">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-xs font-medium text-emerald-400 mb-2">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>Loja Piloto Canoinhas - Santa Catarina</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-serif text-[#EDE6D6]">
                  Plano de Rollout & Adoção Operacional Gradual
                </h2>
                <p className="text-sm text-neutral-300 mt-2 max-w-3xl leading-relaxed">
                  Estratégia de implantação sem fricção: primeiro na loja física de 
                  <strong> Canoinhas com 1 curador-chave durante 30 dias</strong> de calibração fina, 
                  expandindo em seguida para a equipe completa e para atendimento regional do Planalto Norte catarinense.
                </p>
              </div>

              <div className="bg-[#18181C] border border-[#2A2A2E] rounded-xl p-4 text-center">
                <span className="text-2xl font-serif text-[#C9A227] block font-bold">30 Dias</span>
                <span className="text-[11px] text-neutral-400">Piloto Exclusivo Canoinhas</span>
              </div>
            </div>

            {/* Phases Roadmap */}
            <div className="space-y-6">
              {ROLLOUT_PLAN.map((phase) => (
                <div
                  key={phase.phaseNumber}
                  className="bg-[#19191C] border border-[#262628] rounded-xl p-6 hover:border-[#38383D] transition-colors space-y-5"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-[#262628]">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-[#C9A227]/20 border border-[#C9A227]/40 text-[#C9A227] flex items-center justify-center font-bold text-sm font-serif">
                        {phase.phaseNumber}
                      </div>
                      <div>
                        <h3 className="text-base font-semibold text-[#EDE6D6]">
                          {phase.name}
                        </h3>
                        <span className="text-xs text-neutral-400 flex items-center gap-2">
                          <Clock className="w-3.5 h-3.5 text-[#C9A227]" />
                          <span>{phase.period}</span>
                          <span>•</span>
                          <Users className="w-3.5 h-3.5 text-blue-400" />
                          <span>{phase.curatorsCount} Curador(es)</span>
                        </span>
                      </div>
                    </div>

                    <div className="text-xs text-neutral-300 px-3 py-1 rounded bg-[#222226] border border-[#2D2D33] self-start md:self-auto">
                      <strong>Localização:</strong> {phase.location}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Key Activities */}
                    <div className="space-y-2.5">
                      <h4 className="text-xs font-semibold uppercase tracking-wider text-[#C9A227] flex items-center gap-1.5">
                        <ChevronRight className="w-3.5 h-3.5" />
                        <span>Atividades & Rotinas Operacionais</span>
                      </h4>
                      <ul className="space-y-2">
                        {phase.activities.map((act, aIdx) => (
                          <li key={aIdx} className="flex items-start gap-2 text-xs text-neutral-300">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#C9A227] shrink-0 mt-1.5" />
                            <span>{act}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Exit Criteria / Gates */}
                    <div className="space-y-2.5">
                      <h4 className="text-xs font-semibold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Critérios de Saída para Próxima Fase (Gates)</span>
                      </h4>
                      <ul className="space-y-2">
                        {phase.exitCriteria.map((exit, eIdx) => (
                          <li key={eIdx} className="flex items-start gap-2 text-xs text-neutral-200 bg-[#121214] p-2 rounded border border-[#222225]">
                            <span className="text-emerald-400 font-bold shrink-0">✓</span>
                            <span>{exit}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* 30-Day Calendar Breakdown for Canoinhas */}
            <div className="bg-[#121214] border border-[#242428] rounded-xl p-5 space-y-4">
              <h3 className="text-sm font-semibold text-[#EDE6D6] flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#C9A227]" />
                <span>Cronograma Detalhado dos Primeiros 30 Dias (Loja Canoinhas)</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                <div className="p-3 rounded-lg bg-[#18181C] border border-[#262628] space-y-1">
                  <strong className="text-[#C9A227] block">Semana 1: Onboarding</strong>
                  <p className="text-neutral-300">
                    Deploy do MVP, importação dos 30 clientes mais assíduos e treinamento de 2h com o curador principal.
                  </p>
                </div>

                <div className="p-3 rounded-lg bg-[#18181C] border border-[#262628] space-y-1">
                  <strong className="text-[#C9A227] block">Semana 2: Primeiras Malas</strong>
                  <p className="text-neutral-300">
                    Despacho das primeiras 10 malas pelo sistema com reserva automática e validação dos envios de WhatsApp.
                  </p>
                </div>

                <div className="p-3 rounded-lg bg-[#18181C] border border-[#262628] space-y-1">
                  <strong className="text-[#C9A227] block">Semana 3: Calibração de UX</strong>
                  <p className="text-neutral-300">
                    Ajustes de tempo de devolução, refinamento dos motivos de troca e validação de peças com maior giro.
                  </p>
                </div>

                <div className="p-3 rounded-lg bg-[#18181C] border border-[#262628] space-y-1">
                  <strong className="text-emerald-400 block">Semana 4: Retrospectiva</strong>
                  <p className="text-neutral-300">
                    Auditoria de 40+ malas concluídas, medição do NPS do curador e liberação da Sprint 3 (PDV e Pagamentos).
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
