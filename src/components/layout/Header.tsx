import React from 'react';
import { 
  Package, 
  Smartphone, 
  Monitor, 
  FileText, 
  Sparkles, 
  Plus, 
  MapPin, 
  ShieldCheck,
  TrendingUp,
  Clock,
  Calendar
} from 'lucide-react';

interface HeaderProps {
  isMobileSimulator: boolean;
  onToggleSimulator: () => void;
  onOpenNewCondicional: () => void;
  onOpenVisionDoc: () => void;
  onOpenArchitecture: () => void;
  onOpenDesignSystem?: () => void;
  onOpenRoadmap?: () => void;
  onOpenAICurator: () => void;
  activeCondicionaisCount: number;
  totalInTransit: number;
}

export const Header: React.FC<HeaderProps> = ({
  isMobileSimulator,
  onToggleSimulator,
  onOpenNewCondicional,
  onOpenVisionDoc,
  onOpenArchitecture,
  onOpenDesignSystem,
  onOpenRoadmap,
  onOpenAICurator,
  activeCondicionaisCount,
  totalInTransit
}) => {
  return (
    <header className="border-b border-[#222733] bg-[#0c0e12]/95 backdrop-blur sticky top-0 z-40 px-4 py-3">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Brand identity */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#c99738] via-[#a87424] to-[#754e12] flex items-center justify-center shadow-lg shadow-[#c99738]/20 border border-[#e5c158]/30">
              <span className="font-serif font-bold text-black text-xl tracking-tighter">R</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif font-bold text-lg text-white tracking-wide">RAVI'S</span>
                <span className="text-xs uppercase tracking-widest text-[#c99738] font-semibold border-l border-[#2e3544] pl-2">CRM PREMIUM</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-neutral-400">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-[#c99738]" /> Canoinhas - SC
                </span>
                <span>•</span>
                <span className="text-neutral-400">Curadoria & Condicional Masculino</span>
              </div>
            </div>
          </div>

          {/* Quick simulator toggle for small screens */}
          <button
            onClick={onToggleSimulator}
            className="md:hidden flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#181d26] border border-[#272f3d] text-xs text-neutral-200"
            title="Alternar visão"
          >
            {isMobileSimulator ? (
              <Monitor className="w-3.5 h-3.5 text-[#c99738]" />
            ) : (
              <Smartphone className="w-3.5 h-3.5 text-[#c99738]" />
            )}
            <span>{isMobileSimulator ? 'Full' : 'Mobile'}</span>
          </button>
        </div>

        {/* Live Indicator Metrics */}
        <div className="hidden lg:flex items-center gap-4 text-xs bg-[#12161f] border border-[#1f2633] px-3.5 py-2 rounded-xl">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            <span className="text-neutral-400">Condicionais na Rua:</span>
            <span className="font-semibold text-white">{activeCondicionaisCount} malas</span>
          </div>
          <span className="text-neutral-700">|</span>
          <div className="flex items-center gap-1.5">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-neutral-400">Em Trânsito:</span>
            <span className="font-semibold text-amber-300">
              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalInTransit)}
            </span>
          </div>
          <span className="text-neutral-700">|</span>
          <div className="flex items-center gap-1.5 text-neutral-400">
            <Clock className="w-3.5 h-3.5 text-[#c99738]" />
            <span>Prazo Médio: <strong className="text-neutral-200 font-medium">48h</strong></span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
          <button
            onClick={onOpenVisionDoc}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#151a24] hover:bg-[#1c2230] border border-[#293242] text-xs font-medium text-neutral-200 transition-colors shrink-0"
          >
            <FileText className="w-3.5 h-3.5 text-[#c99738]" />
            <span>Doc de Visão</span>
          </button>

          <button
            onClick={onOpenArchitecture}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#131a26] hover:bg-[#1c2536] border border-[#233247] text-xs font-medium text-blue-300 transition-colors shrink-0"
          >
            <Package className="w-3.5 h-3.5 text-blue-400" />
            <span>Arquitetura Técnica</span>
          </button>

          {onOpenDesignSystem && (
            <button
              onClick={onOpenDesignSystem}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1a1710] hover:bg-[#252014] border border-[#C9A227]/40 text-xs font-medium text-[#C9A227] transition-colors shrink-0"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#C9A227]" />
              <span>Design System</span>
            </button>
          )}

          {onOpenRoadmap && (
            <button
              onClick={onOpenRoadmap}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#141b16] hover:bg-[#1b261e] border border-emerald-500/40 text-xs font-medium text-emerald-400 transition-colors shrink-0"
            >
              <Calendar className="w-3.5 h-3.5 text-emerald-400" />
              <span>Roadmap 30d</span>
            </button>
          )}

          <button
            onClick={onOpenAICurator}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#191e2b] hover:bg-[#202738] border border-[#2f3a4e] text-xs font-medium text-amber-200 transition-colors shrink-0"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#c99738]" />
            <span>Curadoria IA</span>
          </button>

          <button
            onClick={onToggleSimulator}
            className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#141822] hover:bg-[#1a202c] border border-[#262e3d] text-xs font-medium text-neutral-300 transition-colors shrink-0"
            title="Simular visualização de celular (ideal para atendentes no chão de loja)"
          >
            {isMobileSimulator ? (
              <>
                <Monitor className="w-3.5 h-3.5 text-[#c99738]" />
                <span>Modo Desktop</span>
              </>
            ) : (
              <>
                <Smartphone className="w-3.5 h-3.5 text-[#c99738]" />
                <span>Simulador Mobile</span>
              </>
            )}
          </button>

          <button
            onClick={onOpenNewCondicional}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-[#c99738] to-[#ab7c2a] hover:from-[#d8a542] hover:to-[#be8c34] text-black font-semibold text-xs transition-all shadow-md shadow-[#c99738]/20 shrink-0"
          >
            <Plus className="w-3.5 h-3.5 stroke-[3]" />
            <span>Nova Mala</span>
          </button>
        </div>
      </div>
    </header>
  );
};
