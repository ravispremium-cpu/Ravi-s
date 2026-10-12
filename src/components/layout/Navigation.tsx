import React from 'react';
import { 
  Briefcase, 
  Users, 
  MessageSquare, 
  Layers, 
  BarChart3, 
  BookOpen,
  ShoppingBag,
  Heart,
  Smartphone,
  Palette,
  Calendar
} from 'lucide-react';

export type NavTab = 'condicional' | 'clients' | 'orders' | 'catalog' | 'wishlist' | 'inbox' | 'analytics' | 'curator-app' | 'vision' | 'architecture' | 'design-system' | 'roadmap';

interface NavigationProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  activeCondicionaisCount: number;
  unreadMessagesCount: number;
  ordersCount?: number;
  wishlistMatchesCount?: number;
}

export const Navigation: React.FC<NavigationProps> = ({
  currentTab,
  onSelectTab,
  activeCondicionaisCount,
  unreadMessagesCount,
  ordersCount,
  wishlistMatchesCount
}) => {
  const tabs = [
    {
      id: 'condicional' as NavTab,
      label: 'Mala Condicional',
      sublabel: 'Pipeline & Prazos',
      icon: Briefcase,
      badge: activeCondicionaisCount > 0 ? activeCondicionaisCount : undefined,
      badgeColor: 'bg-amber-500 text-black'
    },
    {
      id: 'clients' as NavTab,
      label: 'Clientes 360°',
      sublabel: 'Medidas & Estilo',
      icon: Users
    },
    {
      id: 'orders' as NavTab,
      label: 'Pedidos & PDV',
      sublabel: 'Online & Loja Física',
      icon: ShoppingBag,
      badge: ordersCount !== undefined && ordersCount > 0 ? ordersCount : undefined,
      badgeColor: 'bg-emerald-500 text-black'
    },
    {
      id: 'catalog' as NavTab,
      label: 'Catálogo & Estoque',
      sublabel: '1-3 Unidades por SKU',
      icon: Layers
    },
    {
      id: 'wishlist' as NavTab,
      label: 'Lista de Desejos',
      sublabel: 'Curadoria Reversa',
      icon: Heart,
      badge: wishlistMatchesCount !== undefined && wishlistMatchesCount > 0 ? wishlistMatchesCount : undefined,
      badgeColor: 'bg-rose-500 text-white'
    },
    {
      id: 'inbox' as NavTab,
      label: 'Atendimento & Automação',
      sublabel: 'Inbox, Gatilhos & LGPD',
      icon: MessageSquare,
      badge: unreadMessagesCount > 0 ? unreadMessagesCount : undefined,
      badgeColor: 'bg-emerald-500 text-black'
    },
    {
      id: 'analytics' as NavTab,
      label: 'Métricas de Moda',
      sublabel: 'Conversão & Vendas',
      icon: BarChart3
    },
    {
      id: 'curator-app' as NavTab,
      label: 'App do Curador',
      sublabel: 'PWA Offline-First',
      icon: Smartphone,
      badge: 'PWA',
      badgeColor: 'bg-emerald-500 text-black'
    },
    {
      id: 'vision' as NavTab,
      label: 'Documento Visão',
      sublabel: 'Personas & MVP',
      icon: BookOpen
    },
    {
      id: 'architecture' as NavTab,
      label: 'Arquitetura Técnica',
      sublabel: 'Next.js, RBAC & Cloud',
      icon: Layers
    },
    {
      id: 'design-system' as NavTab,
      label: 'Design System',
      sublabel: 'Tokens & Wireframes',
      icon: Palette
    },
    {
      id: 'roadmap' as NavTab,
      label: 'Roadmap & Sprints',
      sublabel: 'MVP ao Rollout 30d',
      icon: Calendar,
      badge: '6 Sprints',
      badgeColor: 'bg-[#C9A227] text-black font-semibold'
    }
  ];

  return (
    <>
      {/* Desktop & Tablet Top Navigation Tabs */}
      <nav className="border-b border-[#1d222d] bg-[#0f1218] px-4 hidden md:block">
        <div className="max-w-7xl mx-auto flex items-center gap-1 overflow-x-auto py-1.5 scrollbar-none">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = currentTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onSelectTab(tab.id)}
                className={`flex items-center gap-2.5 px-4 py-2.5 rounded-lg text-sm font-medium transition-all relative ${
                  isActive
                    ? 'bg-[#1c222e] text-[#f3dfa2] border border-[#353f52] shadow-sm'
                    : 'text-neutral-400 hover:text-neutral-200 hover:bg-[#151922]'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-[#c99738]' : 'text-neutral-400'}`} />
                <div className="text-left">
                  <div className="leading-tight">{tab.label}</div>
                  <div className="text-[10px] text-neutral-400 font-normal leading-tight">{tab.sublabel}</div>
                </div>

                {tab.badge !== undefined && (
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ml-1 ${tab.badgeColor}`}>
                    {tab.badge}
                  </span>
                )}

                {isActive && (
                  <div className="absolute bottom-0 left-3 right-3 h-0.5 bg-[#c99738] rounded-full" />
                )}
              </button>
            );
          })}
        </div>
      </nav>

      {/* Mobile Fixed Bottom Navigation Bar (Thumb Friendly) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#0e1117]/98 backdrop-blur border-t border-[#202633] px-1 py-1.5">
        <div className="grid grid-cols-5 gap-1">
          {tabs.slice(0, 5).map((tab) => {
            const Icon = tab.icon;
            const isActive = currentTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onSelectTab(tab.id)}
                className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-lg relative transition-all ${
                  isActive ? 'text-[#e5c158]' : 'text-neutral-400'
                }`}
              >
                <div className="relative">
                  <Icon className={`w-5 h-5 ${isActive ? 'text-[#c99738]' : 'text-neutral-400'}`} />
                  {tab.badge !== undefined && (
                    <span className={`absolute -top-1.5 -right-2 text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center ${tab.badgeColor}`}>
                      {tab.badge}
                    </span>
                  )}
                </div>
                <span className="text-[10px] mt-1 font-medium truncate max-w-full">
                  {tab.id === 'condicional' ? 'Mala' : tab.id === 'clients' ? 'Clientes' : tab.id === 'inbox' ? 'Inbox' : tab.id === 'catalog' ? 'Peças' : 'Métricas'}
                </span>
                {isActive && (
                  <div className="w-4 h-0.5 bg-[#c99738] rounded-full mt-0.5" />
                )}
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
};
