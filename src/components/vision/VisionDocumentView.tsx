import React, { useState } from 'react';
import { RAVIS_VISION_DOCUMENT } from '../../data/visionDocument';
import { 
  BookOpen, 
  Check, 
  Copy, 
  Users, 
  Layers, 
  Award, 
  ShieldCheck, 
  ChevronRight, 
  Sparkles,
  ArrowRight,
  TrendingUp,
  MapPin,
  Clock,
  Briefcase
} from 'lucide-react';

export const VisionDocumentView: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'BENCHMARKS' | 'PERSONAS' | 'VALUE_PROP' | 'MVP_SCOPE'>('OVERVIEW');

  const doc = RAVIS_VISION_DOCUMENT;

  const handleCopyFullDoc = () => {
    const fullText = `
${doc.title}
${doc.subtitle}
Marca: ${doc.brand} | Localização: ${doc.location}
Versão: ${doc.version}

1. SUMÁRIO EXECUTIVO & DIAGNÓSTICO
${doc.executiveSummary}

2. BENCHMARK COMPARATIVO
${doc.benchmarks.map(b => `• ${b.platform}:\n  Pontos Fortes: ${b.strengths}\n  Falhas Críticas no Varejo de Moda: ${b.weaknesses}\n  Vantagem Ravis CRM: ${b.ravisAdvantage}\n`).join('\n')}

3. PERSONAS
${doc.personas.map(p => `• ${p.role} (${p.name}):\n  Contexto: ${p.context}\n  Dores: ${p.pains.join('; ')}\n  Solução Ravis CRM: ${p.solutionWithRavis.join('; ')}\n`).join('\n')}

4. PROPOSTA DE VALOR ÚNICA (UVP)
${doc.valueProposition.headline}
${doc.valueProposition.pillars.map(pill => `- ${pill.title}: ${pill.description}`).join('\n')}

5. ESCOPO DE MVP & ROADMAP
Fase 1 (MVP Atual):
${doc.mvpScope.phase1.deliverables.map(d => `[x] ${d}`).join('\n')}

Fase 2 (Escala & Automação):
${doc.mvpScope.phase2.deliverables.map(d => `[ ] ${d}`).join('\n')}

Fase 3 (Multiloja):
${doc.mvpScope.phase3.deliverables.map(d => `[ ] ${d}`).join('\n')}
    `.trim();

    navigator.clipboard?.writeText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-5">
      {/* Document Header Card */}
      <div className="bg-[#10141d] rounded-2xl border border-[#222a3b] p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#c99738]/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#c99738]/20 border border-[#c99738]/40 text-[#f5d061] uppercase tracking-wider">
                Documento de Visão Estratégica
              </span>
              <span className="text-xs text-neutral-400">Versão {doc.version}</span>
            </div>

            <h1 className="text-xl sm:text-2xl font-serif font-bold text-white tracking-tight">
              {doc.title}
            </h1>
            <p className="text-xs sm:text-sm text-neutral-300 mt-1 max-w-3xl leading-relaxed">
              {doc.subtitle}
            </p>

            <div className="flex items-center gap-2 text-xs text-neutral-400 mt-3">
              <MapPin className="w-3.5 h-3.5 text-[#c99738]" />
              <span>{doc.location}</span>
              <span>•</span>
              <span className="text-neutral-300">Marca: <strong>{doc.brand}</strong></span>
            </div>
          </div>

          <button
            onClick={handleCopyFullDoc}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#171e2c] hover:bg-[#20293b] border border-[#2a364d] text-neutral-200 text-xs font-medium transition-all shrink-0 self-start md:self-center"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
                <span className="text-emerald-400">Texto Copiado!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 text-[#c99738]" />
                <span>Copiar Documento Completo</span>
              </>
            )}
          </button>
        </div>

        {/* Navigation Sub-Tabs */}
        <div className="flex items-center gap-2 mt-6 pt-4 border-t border-[#1c2434] overflow-x-auto">
          {[
            { id: 'OVERVIEW', label: '1. Sumário Executivo' },
            { id: 'BENCHMARKS', label: '2. Benchmarks (Salesforce/HubSpot/Zoho)' },
            { id: 'PERSONAS', label: '3. Personas Detalhadas' },
            { id: 'VALUE_PROP', label: '4. Proposta de Valor' },
            { id: 'MVP_SCOPE', label: '5. Escopo de MVP' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                activeTab === tab.id
                  ? 'bg-[#c99738] text-black font-semibold'
                  : 'bg-[#141823] text-neutral-400 hover:text-white hover:bg-[#1a2130]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab 1: Executive Summary */}
      {activeTab === 'OVERVIEW' && (
        <div className="bg-[#10141d] rounded-2xl border border-[#222a3b] p-6 space-y-4 text-xs leading-relaxed text-neutral-300">
          <h2 className="text-sm font-semibold text-white uppercase tracking-wider flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-[#c99738]" />
            <span>Sumário Executivo & Diagnóstico do Varejo em Canoinhas-SC</span>
          </h2>

          <div className="bg-[#0b0e14] p-4 rounded-xl border border-[#1b2332] space-y-3">
            <p className="text-neutral-200 text-xs sm:text-sm leading-relaxed">
              {doc.executiveSummary}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
            <div className="bg-[#141924] p-3.5 rounded-xl border border-[#20293b]">
              <span className="text-[#c99738] font-bold text-xs uppercase tracking-wider block mb-1">
                O Problema Central
              </span>
              <p className="text-neutral-300 text-[11px]">
                O homem de alto padrão do Planalto Norte (médicos, produtores de soja e diretores industriais) não tem tempo nem paciência para garimpar araras na loja física, mas demanda peças exclusivas com caimento impecável.
              </p>
            </div>

            <div className="bg-[#141924] p-3.5 rounded-xl border border-[#20293b]">
              <span className="text-emerald-400 font-bold text-xs uppercase tracking-wider block mb-1">
                A Solução Diferencial
              </span>
              <p className="text-neutral-300 text-[11px]">
                O serviço de mala de condicional VIP: curadoria montada com precisão de tamanho e estilo levada na residência com 48h para prova e fechamento instantâneo via WhatsApp.
              </p>
            </div>

            <div className="bg-[#141924] p-3.5 rounded-xl border border-[#20293b]">
              <span className="text-amber-400 font-bold text-xs uppercase tracking-wider block mb-1">
                O Porquê do Ravis CRM
              </span>
              <p className="text-neutral-300 text-[11px]">
                Nenhum CRM genérico do mundo controla reserva de estoque físico por tamanho, contagem regressiva de mala na casa do cliente e check-in reverso de peças mantidas vs devolvidas.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Benchmarks */}
      {activeTab === 'BENCHMARKS' && (
        <div className="bg-[#10141d] rounded-2xl border border-[#222a3b] p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-[#1c2434] pb-3">
            <h2 className="text-sm font-semibold text-white uppercase tracking-wider flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#c99738]" />
              <span>Matriz Comparativa Técnica de Benchmark</span>
            </h2>
            <span className="text-xs text-neutral-400">Absorver os gigantes & superar no nicho</span>
          </div>

          <div className="space-y-3.5">
            {doc.benchmarks.map((bench, idx) => (
              <div key={idx} className="bg-[#0b0e14] rounded-xl border border-[#1b2332] p-4 text-xs space-y-2.5">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white font-serif">{bench.platform}</h3>
                  <span className="text-[10px] uppercase font-bold text-neutral-400 bg-[#161c27] px-2 py-0.5 rounded">
                    Benchmark {idx + 1}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="bg-[#121620] p-2.5 rounded-lg border border-[#1f2738]">
                    <span className="text-emerald-400 font-semibold block text-[11px]">O que absorvemos (Pontos Fortes):</span>
                    <p className="text-neutral-300 mt-1">{bench.strengths}</p>
                  </div>

                  <div className="bg-[#121620] p-2.5 rounded-lg border border-[#1f2738]">
                    <span className="text-red-400 font-semibold block text-[11px]">Onde eles falham na moda:</span>
                    <p className="text-neutral-400 mt-1">{bench.weaknesses}</p>
                  </div>
                </div>

                <div className="bg-[#18221b] p-3 rounded-lg border border-emerald-700/40 text-neutral-200">
                  <span className="font-bold text-emerald-300 block text-[11px] uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#c99738]" />
                    <span>Diferencial Superior Exclusivo do Ravis CRM:</span>
                  </span>
                  <p className="mt-1 text-neutral-100">{bench.ravisAdvantage}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Personas */}
      {activeTab === 'PERSONAS' && (
        <div className="bg-[#10141d] rounded-2xl border border-[#222a3b] p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-[#1c2434] pb-3">
            <h2 className="text-sm font-semibold text-white uppercase tracking-wider flex items-center gap-2">
              <Users className="w-4 h-4 text-[#c99738]" />
              <span>Personas Centrais do Ecossistema Ravi's Premium</span>
            </h2>
            <span className="text-xs text-neutral-400">Curador • Gestor • Cliente</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {doc.personas.map((persona, idx) => (
              <div key={idx} className="bg-[#0b0e14] rounded-xl border border-[#1b2332] p-4 flex flex-col justify-between text-xs space-y-3">
                <div>
                  <div className="w-8 h-8 rounded-lg bg-[#18202d] border border-[#273449] flex items-center justify-center text-[#c99738] font-bold text-xs mb-2">
                    0{idx + 1}
                  </div>
                  <h3 className="font-serif font-bold text-white text-sm">{persona.name}</h3>
                  <span className="text-amber-400 text-[11px] font-medium block mt-0.5">{persona.role}</span>
                  <p className="text-neutral-400 text-[11px] mt-1.5 italic">"{persona.context}"</p>

                  <div className="mt-3 pt-3 border-t border-[#171f2d] space-y-1.5">
                    <span className="text-red-400 font-semibold block text-[11px]">Dores Principais:</span>
                    <ul className="space-y-1 text-neutral-300 text-[11px]">
                      {persona.pains.map((pain, pIdx) => (
                        <li key={pIdx} className="flex items-start gap-1.5">
                          <span className="text-red-400 shrink-0">•</span>
                          <span>{pain}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="pt-3 border-t border-[#171f2d] space-y-1.5 bg-[#121822] p-2.5 rounded-lg border border-[#1e2738]">
                  <span className="text-emerald-400 font-semibold block text-[11px]">Solução Entregue pelo Ravis CRM:</span>
                  <ul className="space-y-1 text-neutral-200 text-[11px]">
                    {persona.solutionWithRavis.map((sol, sIdx) => (
                      <li key={sIdx} className="flex items-start gap-1.5">
                        <Check className="w-3 h-3 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{sol}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Value Proposition */}
      {activeTab === 'VALUE_PROP' && (
        <div className="bg-[#10141d] rounded-2xl border border-[#222a3b] p-6 space-y-5 text-xs">
          <div className="border-b border-[#1c2434] pb-3">
            <span className="text-neutral-400 text-[11px] uppercase tracking-wider block">Proposta de Valor Única (UVP)</span>
            <h2 className="text-base sm:text-lg font-serif font-bold text-[#f5d061] mt-1">
              "{doc.valueProposition.headline}"
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {doc.valueProposition.pillars.map((pillar, idx) => (
              <div key={idx} className="bg-[#0b0e14] p-4 rounded-xl border border-[#1b2332] space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-md bg-[#c99738]/20 text-[#c99738] flex items-center justify-center font-bold text-xs">
                    {idx + 1}
                  </div>
                  <h3 className="font-semibold text-white text-xs">{pillar.title}</h3>
                </div>
                <p className="text-neutral-300 leading-relaxed text-[11px]">
                  {pillar.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 5: MVP Scope */}
      {activeTab === 'MVP_SCOPE' && (
        <div className="bg-[#10141d] rounded-2xl border border-[#222a3b] p-6 space-y-5 text-xs">
          <div className="border-b border-[#1c2434] pb-3">
            <h2 className="text-sm font-semibold text-white uppercase tracking-wider flex items-center gap-2">
              <Award className="w-4 h-4 text-[#c99738]" />
              <span>Escopo de MVP & Evolução Roadmap</span>
            </h2>
          </div>

          <div className="space-y-4">
            {/* Phase 1 */}
            <div className="bg-[#0b0e14] p-4 rounded-xl border border-emerald-700/40 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-emerald-400 text-xs flex items-center gap-1.5">
                  <Check className="w-4 h-4" />
                  {doc.mvpScope.phase1.phaseName}
                </span>
                <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 text-[10px] font-bold">
                  100% OPERACIONAL
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-neutral-300 text-[11px] pt-1">
                {doc.mvpScope.phase1.deliverables.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-2 bg-[#121620] p-2 rounded-lg border border-[#1b2332]">
                    <span className="text-emerald-400 font-bold shrink-0">✓</span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Phase 2 */}
            <div className="bg-[#0b0e14] p-4 rounded-xl border border-[#20293b] space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-amber-300 text-xs flex items-center gap-1.5">
                  <Clock className="w-4 h-4" />
                  {doc.mvpScope.phase2.phaseName}
                </span>
                <span className="px-2 py-0.5 rounded bg-amber-950/60 text-amber-300 text-[10px] font-bold">
                  PLANEJADO
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-neutral-400 text-[11px] pt-1">
                {doc.mvpScope.phase2.deliverables.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-2 bg-[#121620] p-2 rounded-lg border border-[#1b2332]">
                    <span className="text-amber-400 font-bold shrink-0">○</span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Phase 3 */}
            <div className="bg-[#0b0e14] p-4 rounded-xl border border-[#20293b] space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-indigo-300 text-xs flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4" />
                  {doc.mvpScope.phase3.phaseName}
                </span>
                <span className="px-2 py-0.5 rounded bg-indigo-950/60 text-indigo-300 text-[10px] font-bold">
                  FUTURO
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-neutral-400 text-[11px] pt-1">
                {doc.mvpScope.phase3.deliverables.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-2 bg-[#121620] p-2 rounded-lg border border-[#1b2332]">
                    <span className="text-indigo-400 font-bold shrink-0">○</span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
