/**
 * Design Tokens & Wireframes Reference for Ravis CRM
 * Ravi's Premium Menswear (Canoinhas - SC)
 */

export interface DesignTokenGroup {
  category: string;
  description: string;
  tokens: {
    name: string;
    value: string;
    usage: string;
    sample?: string;
  }[];
}

export const RAVIS_DESIGN_TOKENS: DesignTokenGroup[] = [
  {
    category: 'Paleta de Cores (Cores Principais & Semânticas)',
    description: 'Fundo preto profundo e carvão, com detalhes champanhe dourado para máxima sofisticação e conforto ocular contínuo do atendente.',
    tokens: [
      { name: 'color-bg-deep', value: '#0F0F10', usage: 'Fundo principal da aplicação (Dark Theme profundo)', sample: '#0F0F10' },
      { name: 'color-bg-charcoal', value: '#1A1A1A', usage: 'Superfícies de cards elevados, sidebars e containers', sample: '#1A1A1A' },
      { name: 'color-bg-surface-elevated', value: '#242424', usage: 'Camada de modais flutuantes, popovers e tooltips', sample: '#242424' },
      { name: 'color-border-subtle', value: '#2D2D2E', usage: 'Divisores e bordas discretas com contraste de 3:1', sample: '#2D2D2E' },
      { name: 'color-gold-champagne', value: '#C9A227', usage: 'Acentos primários, CTAs nobres, status de destaque e branding', sample: '#C9A227' },
      { name: 'color-gold-hover', value: '#DFC053', usage: 'Estado hover em botões dourados e ícones ativos', sample: '#DFC053' },
      { name: 'color-gold-dim', value: '#C9A22726', usage: 'Fundo translúcido para badges de alta prioridade e foco', sample: 'rgba(201,162,39,0.15)' },
      { name: 'color-cream-neutral', value: '#EDE6D6', usage: 'Tipografia primária e ícones principais (conforto de leitura)', sample: '#EDE6D6' },
      { name: 'color-text-muted', value: '#9E998E', usage: 'Textos secundários, legendas, metadados e atalhos de teclado', sample: '#9E998E' },
      { name: 'color-status-success', value: '#2EB886', usage: 'Condicional comprado, pagamento aprovado, estoque íntegro', sample: '#2EB886' },
      { name: 'color-status-warning', value: '#E5A93C', usage: 'Prazo 48h expirando, alerta de condicional pendente', sample: '#E5A93C' },
      { name: 'color-status-danger', value: '#E65050', usage: 'Prazo estourado, item devolvido ou rejeitado', sample: '#E65050' },
      { name: 'color-status-info', value: '#3E82F7', usage: 'WhatsApp integrado, webhooks ativos e sincronização PWA', sample: '#3E82F7' }
    ]
  },
  {
    category: 'Tipografia (Hierarquia & Contrastes)',
    description: 'Equilíbrio entre a alta alfaiataria (Cormorant Garamond / Playfair Display) e a velocidade analítica (Inter / Public Sans).',
    tokens: [
      { name: 'font-family-serif', value: 'Cormorant Garamond, Playfair Display, serif', usage: 'Títulos de tela H1/H2, nomes de peças de luxo e números VIP' },
      { name: 'font-family-sans', value: 'Inter, Public Sans, system-ui, sans-serif', usage: 'Corpo de texto, formulários, métricas analíticas e feeds de chat' },
      { name: 'font-family-mono', value: 'JetBrains Mono, ui-monospace, monospace', usage: 'Códigos SKU, chips de comando [Cmd+K], números de rastreio' },
      { name: 'text-hero', value: '32px / 1.15 / font-semibold / tracking-tight', usage: 'Títulos de impacto do CRM e métricas de faturamento' },
      { name: 'text-title', value: '20px / 1.25 / font-medium / tracking-normal', usage: 'Subseções principais, cabeçalhos de gaveta e modais' },
      { name: 'text-body', value: '14px / 1.5 / font-normal', usage: 'Leitura principal de mensagens, histórico e notas de curadoria' },
      { name: 'text-caption', value: '11px / 1.4 / font-medium / tracking-wider', usage: 'Atalhos de teclado, tags de tamanho, badges de status' }
    ]
  },
  {
    category: 'Espaçamento & Grid (8pt Grid System)',
    description: 'Ritmo vertical rigoroso derivado do sistema Linear/Raycast com densidade otimizada para trabalho ágil.',
    tokens: [
      { name: 'space-xs', value: '4px', usage: 'Micro gaps entre ícone e badge' },
      { name: 'space-sm', value: '8px', usage: 'Espaçamento padrão entre tags e itens compactos' },
      { name: 'space-md', value: '12px', usage: 'Padding interno de botões e campos de input' },
      { name: 'space-lg', value: '16px', usage: 'Padding interno de cards de produtos e mensagens' },
      { name: 'space-xl', value: '24px', usage: 'Separação entre seções analíticas e colunas do Kanban' },
      { name: 'space-2xl', value: '32px', usage: 'Margens globais de viewport desktop' }
    ]
  },
  {
    category: 'Elevação, Raios & Sombras',
    description: 'Bordas finas com acabamento de joalheria e sombras sutis para sensação tátil dark luxury.',
    tokens: [
      { name: 'radius-sm', value: '6px', usage: 'Chips de tamanho, tags de categoria, teclas [K]' },
      { name: 'radius-md', value: '10px', usage: 'Inputs, botões primários e cards secundários' },
      { name: 'radius-lg', value: '16px', usage: 'Cards do kanban, painel do cliente 360 e modais' },
      { name: 'radius-full', value: '9999px', usage: 'Avatares e badges de status de entrega' },
      { name: 'shadow-card', value: '0 4px 20px -2px rgba(0, 0, 0, 0.7)', usage: 'Cards destacados e peças flutuantes arrastadas' },
      { name: 'shadow-gold-glow', value: '0 0 24px rgba(201, 162, 39, 0.22)', usage: 'Botão de enviar mala VIP e status de cliente Diamante' }
    ]
  }
];

export interface WireframeScreenDefinition {
  id: string;
  name: string;
  purpose: string;
  viewport: 'Desktop & Tablet' | 'Mobile Curador (PWA)' | 'Híbrido Responsivo';
  uxInspirations: string;
  keyShortcuts: string[];
  zones: {
    zone: string;
    description: string;
    elements: string[];
  }[];
  userJourney: string;
}

export const WIREFRAME_SCREENS: WireframeScreenDefinition[] = [
  {
    id: 'login',
    name: '1. Tela de Login & Autenticação Segura (Atendente & Gestor)',
    purpose: 'Acesso ultrarrápido com biometria no mobile ou NextAuth com credenciais e papel RBAC definido (ADMIN, CURADOR, ATENDENTE).',
    viewport: 'Híbrido Responsivo',
    uxInspirations: 'Linear Login / Vercel Dark SSO',
    keyShortcuts: ['Enter: Entrar', 'Tab: Próximo campo', 'Esc: Limpar'],
    zones: [
      {
        zone: 'Hero Header de Marca',
        description: 'Monograma Ravi’s em dourado champanhe com badge Canoinhas - SC e subtítulo institucional.',
        elements: ['Logo R em champanhe reluzente', 'Título serifado Cormorant Garamond', 'Indicador de Ambiente Seguro SSL 256-bit']
      },
      {
        zone: 'Formulário de Entrada',
        description: 'Inputs de alto contraste (#1A1A1A) com foco dourado sem distrações.',
        elements: ['E-mail ou Telefone do Consultor', 'Senha com alternador de visibilidade', 'Seleção rápida de perfil (Demo / 1-Click)']
      },
      {
        zone: 'Acesso Chão de Loja Mobile',
        description: 'Opção de entrada rápida via PIN de 4 dígitos ou Biometria (FaceID) para atendentes com luvas ou na correria da loja.',
        elements: ['Botão "Entrar com FaceID / PIN"', 'Lembrar sessão por 30 dias', 'Rodapé de conformidade LGPD']
      }
    ],
    userJourney: 'O curador abre o app no smartphone da loja, autentica em 1 segundo e vai direto para a tela "Hoje" com os atendimentos e condicionais agendados.'
  },
  {
    id: 'dashboard',
    name: '2. Dashboard do Gestor (Cockpit Executivo & Analytics)',
    purpose: 'Visão macro do negócio para tomadas de decisão ágeis sobre conversão de condicionais, faturamento em trânsito e peças com alto índice de devolução.',
    viewport: 'Desktop & Tablet',
    uxInspirations: 'Raycast Insights + Stripe Financial Dashboard',
    keyShortcuts: ['1-4: Alternar Período (7D, 30D, 90D, Ano)', 'Cmd+E: Exportar Relatório', 'R: Atualizar Dados'],
    zones: [
      {
        zone: 'Barra de KPIs Principais',
        description: '4 cartões de alto impacto com tipografia serifada para números e deltas de crescimento.',
        elements: [
          'Faturamento Mensal (ex: R$ 84.500, +18.4%)',
          'Taxa de Conversão da Mala Condicional (74.8% — benchmark 50%)',
          'Ticket Médio por Condicional (R$ 1.840)',
          'Capital em Trânsito nas Malas (R$ 38.600 em 14 clientes)'
        ]
      },
      {
        zone: 'Gráfico de Desempenho e Comparativo',
        description: 'Gráfico de barras e linhas com contraste dark de vendas vs devoluções ao longo das semanas.',
        elements: ['Filtros dinâmicos (Dia / Semana / Mês)', 'Taxa de compra por curador', 'Visualizador de horário de pico de WhatsApp']
      },
      {
        zone: 'Análise Crítica de Peças & Motivos de Devolução',
        description: 'Top Peças Selecionadas vs Top Peças Compradas + Pareto de motivos de devolução (caimento, tamanho, estilo).',
        elements: ['Ranking de peças campeãs de conversão', 'Alertas de grade desfalcada', 'Métricas de LTV e Churn de clientes VIP']
      }
    ],
    userJourney: 'O gestor da Ravi’s analisa de manhã quais malas foram devolvidas ontem, o faturamento gerado e quais tamanhos precisam de reposição imediata na alfaiataria.'
  },
  {
    id: 'inbox',
    name: '3. Inbox Unificado de Atendimento & Automação',
    purpose: 'Centralizar conversas de WhatsApp Business, Instagram Direct e E-mail em uma única fila organizada com respostas rápidas e automações inteligentes.',
    viewport: 'Híbrido Responsivo',
    uxInspirations: 'HubSpot Conversations + Superhuman Keyboard-First',
    keyShortcuts: ['J/K: Navegar conversas', 'R: Responder', 'Cmd+Enter: Disparar', 'T: Inserir Template'],
    zones: [
      {
        zone: 'Fila Unificada Multicanal',
        description: 'Lista de chats com ícone de canal, foto do cliente, badge VIP, tempo de espera e status de atribuição.',
        elements: ['Filtro WhatsApp / Instagram / E-mail', 'Filtro Não lidos / Minhas conversas', 'SLA timer de resposta (tempo de espera)']
      },
      {
        zone: 'Thread de Conversa Elegante',
        description: 'Balões em carvão e champanhe com suporte a envio de fotos de looks, cards de produtos interativos e áudio.',
        elements: ['Histórico completo com carimbo de hora', 'Status de envio/leitura', 'Cards de produtos embutidos na conversa']
      },
      {
        zone: 'Barra de Ação Rápida & Curadoria',
        description: 'Campo de digitação com templates pré-aprovados, respostas rápidas, emojis de moda e atalho para criar Mala Condicional.',
        elements: ['Templates ("Qual seu tamanho?", "Lembrete 3 dias")', 'Botão "+ Montar Mala Condicional"', 'Agendamento de mensagem para horário comercial']
      },
      {
        zone: 'Painel Contextual Direito (Sidecard 360)',
        description: 'Mini-perfil do cliente ao lado do chat com tamanhos (camisa, calça, sapato), ticket médio e mala ativa.',
        elements: ['Medidas corporais do cliente', 'Marcas favoritas (Ricardo Almeida, Aramis)', 'Histórico de compras recentes']
      }
    ],
    userJourney: 'Cliente manda foto de um evento no Instagram. O atendente responde pelo inbox, consulta medidas na lateral e clica em "+ Montar Mala" sem sair da conversa.'
  },
  {
    id: 'profile360',
    name: '4. Perfil do Cliente 360° (Alfaiataria & Medidas)',
    purpose: 'Ficha completa de inteligência de estilo com medidas anatômicas milimétricas, histórico de condicionais e linha do tempo de interações.',
    viewport: 'Desktop & Tablet',
    uxInspirations: 'Linear Issue Detail + Luxury Clienteling Passport',
    keyShortcuts: ['Cmd+N: Nova Mala', 'E: Editar Medidas', 'W: Abrir WhatsApp', 'Esc: Voltar à Lista'],
    zones: [
      {
        zone: 'Header com Status de Fidelidade',
        description: 'Foto do cliente, nome de prestígio, profissão, selo VIP (Diamante/Ouro), LTV acumulado e data da última visita.',
        elements: ['Badge VIP Canoinhas', 'Telefone com 1-click WhatsApp', 'Endereço residencial e comercial para motorista']
      },
      {
        zone: 'Grade de Medidas & Preferências de Caimento',
        description: 'Ficha técnica visual: Camisa (colarinho/tórax), Calça (cintura/barra), Sapato, caimento (Slim/Regular) e cores preferidas.',
        elements: ['Tags de tamanho em dourado', 'Cores favoritas vs Cores rejeitadas', 'Alergias a tecidos ou exigências de barra']
      },
      {
        zone: 'Histórico de Condicionais & Peças Compradas',
        description: 'Galeria visual com fotos de tudo que o cliente já comprou na loja e o que devolveu com o respectivo motivo.',
        elements: ['Cards de peças adquiridas', 'Lista de devoluções com motivos', 'Taxa pessoal de conversão de mala (ex: 85%)']
      },
      {
        zone: 'Timeline Unificada',
        description: 'Linha do tempo cronológica com reuniões, provas de roupa, disparos de WhatsApp e aniversários.',
        elements: ['Registro de compras', 'Visitas de motorista', 'Notas privadas do curador ("Prefere atendimento às terças à tarde")']
      }
    ],
    userJourney: 'O curador recebe a visita do Dr. Carlos. Abre o 360°, confere que ele veste camisa 3 e calça 42 slim, e já separa peças antes dele pedir.'
  },
  {
    id: 'selection',
    name: '5. Montagem de Seleção de Condicional (Drag-and-Drop)',
    purpose: 'A tela mais crítica do curador: montar a mala perfeita arrastando peças do catálogo com recomendação visual de tamanho compatível.',
    viewport: 'Híbrido Responsivo',
    uxInspirations: 'Linear Project Board + Figma Canvas + Shopify POS Collection',
    keyShortcuts: ['Drag: Arraste de peças', 'Cmd+Enter: Finalizar e Despachar', 'F: Filtrar por tamanho do cliente', 'C: Limpar seleção'],
    zones: [
      {
        zone: 'Painel Esquerdo: Catálogo Filtrado por Perfil',
        description: 'Grade de produtos disponíveis em estoque filtrados automaticamente pelo tamanho exato do cliente selecionado.',
        elements: ['Filtro inteligente de tamanho (ex: G e 42)', 'Badge de unidades em estoque (ex: 1 restante)', 'Busca rápida por SKU ou categoria']
      },
      {
        zone: 'Painel Central: Mala Virtual do Cliente (Mala Condicional)',
        description: 'Zona de drop visual onde as peças são organizadas por looks completos (Camisa + Calça + Sapato + Acessório).',
        elements: ['Dropzone interativa', 'Contador de peças (meta: 4 a 8 peças)', 'Somatório de valor total da mala (em R$)']
      },
      {
        zone: 'Painel Direito: Resumo de Despacho & Ações',
        description: 'Definição de prazo (padrão 48h ou 7 dias), seleção de motorista ou retirada em loja, e geração automática de mensagem.',
        elements: ['Seletor de prazo com timer', 'Botão "Fotografar Caixa"', 'Botão principal champanhe "Despachar & Notificar WhatsApp"']
      }
    ],
    userJourney: 'Curador escolhe Rodrigo Silveira, arrasta 5 peças compatíveis em 30 segundos, gera a mala #MC-2024-001 e avisa o motorista com rota pronta.'
  },
  {
    id: 'catalog',
    name: '6. Catálogo & Gestão de Estoque Limitado (1 a 3 Peças/SKU)',
    purpose: 'Controle cirúrgico de peças de alta rotação e estoque enxuto com rastreio de peças que estão fisicamente na loja vs na rua com clientes.',
    viewport: 'Desktop & Tablet',
    uxInspirations: 'Linear Table View + StockX Realtime Inventory',
    keyShortcuts: ['N: Nova Peça', 'S: Scanner de Código', 'I: Importar Lote Pomelli', 'Cmd+F: Buscar SKU'],
    zones: [
      {
        zone: 'Barra de Status de Estoque',
        description: 'Resumo com peças disponíveis, peças em condicional (na rua) e alertas de reposição urgente.',
        elements: ['Total de SKUs únicos', 'Valor em estoque loja', 'Valor em domicílio', 'Peças com última unidade']
      },
      {
        zone: 'Grade / Tabela de Produtos com Variantes',
        description: 'Cards elegantes com fotos em alta definição, tamanhos disponíveis, preços e botão rápido de adicionar a condicional.',
        elements: ['Foto do tecido/peça', 'Tags de tamanho em estoque', 'Indicador visual: "Em Loja" ou "Em Condicional com Dr. Guilherme"']
      },
      {
        zone: 'Modal de Entrada Rápida & Integração Pomelli',
        description: 'Cadastro express com foto, marca, composição do tecido e geração de código de barras para etiqueta física.',
        elements: ['Upload de fotos', 'Definição de preço de custo e venda', 'Impressão de etiquetas de gôndola']
      }
    ],
    userJourney: 'Chega uma nova caixa de linho. O atendente bip o código ou clica em Nova Peça, cadastra 2 unidades e as disponibiliza imediatamente no CRM.'
  },
  {
    id: 'orders',
    name: '7. Pedidos & PDV Simplificado',
    purpose: 'Finalização de vendas originadas de malas condicionais ou atendimento balcão físico, com baixa automática de estoque e emissão de comprovante.',
    viewport: 'Híbrido Responsivo',
    uxInspirations: 'Square POS Dark + Stripe Invoicing',
    keyShortcuts: ['P: Novo Pedido', 'Space: Finalizar Pix', 'Cmd+P: Imprimir Recibo'],
    zones: [
      {
        zone: 'Lista de Pedidos Recentes',
        description: 'Histórico com status (Pendente, Pago, Entregue), canal de origem e método de pagamento.',
        elements: ['Filtro por data e status', 'Origem: Mala Condicional vs Balcão', 'Total faturado no dia']
      },
      {
        zone: 'PDV Express Chão de Loja',
        description: 'Interface de toque rápido para adicionar peças com scanner ou busca, selecionar cliente e gerar QR Code Pix dinâmico.',
        elements: ['Carrinho de compras minimalista', 'Cálculo de desconto do curador', 'Gerador de QR Code Pix imediato']
      },
      {
        zone: 'Recibo & Notificação pós-venda',
        description: 'Comprovante com identidade da Ravi’s disparado automaticamente para o WhatsApp do cliente.',
        elements: ['PDF do recibo estilizado', 'Mensagem de agradecimento com dicas de conservação da alfaiataria']
      }
    ],
    userJourney: 'Cliente decide ficar com 2 camisas da mala. O curador dá check nos itens no celular, cliente paga via Pix e o recibo chega no WhatsApp dele.'
  }
];

export const NAVIGATION_FLOW_STEPS = [
  {
    step: 1,
    title: 'Descoberta ou Atendimento',
    trigger: 'Cliente entra em contato pelo WhatsApp/Instagram ou visita a loja',
    screen: 'Inbox Unificado / Perfil 360°',
    outcome: 'Identificação de tamanho, estilo, ocasião de uso e histórico de compras anteriores.'
  },
  {
    step: 2,
    title: 'Curadoria & Montagem da Mala',
    trigger: 'Curador aciona "Montar Mala Condicional" com filtro de tamanho automático',
    screen: 'Montagem de Seleção (Drag & Drop)',
    outcome: '4 a 8 peças selecionadas, foto da caixa registrada e prazo de teste configurado.'
  },
  {
    step: 3,
    title: 'Despacho & Acompanhamento',
    trigger: 'Mala enviada com Motorista VIP Ravi’s para o escritório ou residência',
    screen: 'Kanban da Condicional / PWA Mobile',
    outcome: 'Disparo de WhatsApp com aviso de saída, timer de 48h a 7 dias ativado e tracking no CRM.'
  },
  {
    step: 4,
    title: 'Experimentação & Lembretes',
    trigger: 'Gatilho de automação aos 3 dias de teste sem retorno',
    screen: 'Automações & Inbox',
    outcome: 'Atendente recebe sugestão de mensagem cordial para checar se o caimento ficou perfeito.'
  },
  {
    step: 5,
    title: 'Check-in de Retirada & Checkout',
    trigger: 'Motorista retira as peças ou cliente avisa quais peças vai comprar',
    screen: 'Modal de Checkout / PDV Simplificado',
    outcome: 'Separação de itens comprados vs devolvidos (com motivo registrado), pagamento Pix/Cartão e baixa de estoque.'
  },
  {
    step: 6,
    title: 'Alimentação do LTV & Reativação',
    trigger: 'Venda computada no perfil do cliente',
    screen: 'Dashboard do Gestor & Perfil 360°',
    outcome: 'LTV atualizado, sugestões de nova mala agendada para 60 dias ou próxima coleção.'
  }
];
