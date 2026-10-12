export interface AcceptanceCriterion {
  id: string;
  criterion: string;
  testScenario: string;
  expectedOutcome: string;
}

export interface RoadmapSprint {
  id: string;
  sprintNumber: number;
  phase: string;
  durationWeeks: number;
  targetTimeline: string;
  title: string;
  badge: string;
  summary: string;
  modulesIncluded: string[];
  acceptanceCriteria: AcceptanceCriterion[];
  deliverablesTech: string[];
  kpiImpact: string[];
  risksAndMitigation: string;
}

export interface ProductSuccessMetric {
  id: string;
  metricName: string;
  targetDirection: 'increase' | 'decrease';
  baseline: string;
  targetMVP: string;
  targetScale: string;
  unit: string;
  measurementMethod: string;
  businessImpact: string;
}

export interface RolloutPhase {
  phaseNumber: number;
  name: string;
  period: string;
  scope: string;
  curatorsCount: number;
  location: string;
  activities: string[];
  exitCriteria: string[];
}

export const ROADMAP_SPRINTS: RoadmapSprint[] = [
  {
    id: 'sprint-1-2',
    sprintNumber: 1, // Represents Sprint 1–2 MVP (4 weeks)
    phase: 'MVP Fundação & Núcleo Operacional',
    durationWeeks: 4,
    targetTimeline: 'Semanas 1 a 4 (30 dias)',
    title: 'MVP: Clientes 360° + Condicional Completo + Catálogo/Estoque + WhatsApp + Login RBAC',
    badge: 'MVP Crítico (Sprints 1 e 2)',
    summary: 'Construção da espinha dorsal do modelo de negócio da Ravi\'s: perfil biométrico e de alfaiataria de clientes, fluxo ponta a ponta de malas condicionais com reserva automática de estoque físico, mensageria WhatsApp direta e controle de acesso estrito por função.',
    modulesIncluded: [
      'Clientes 360° (Medidas camisa/calça/sapato, paleta, marcas prediletas, tags VIP)',
      'Módulo Condicional Completo (Kanban 5 etapas, mala digital, timer 48h, cálculo de valor)',
      'Catálogo & Gestão de Estoque Físico com SKUs limitados (1 a 3 un)',
      'Disparo WhatsApp de Mala Condicional com fotos, preços e lembretes automáticos',
      'Autenticação & RBAC (Admin, Curador/Alfaiate, Atendente)'
    ],
    acceptanceCriteria: [
      {
        id: 'AC-01',
        criterion: 'Reserva automática de estoque no envio de condicional',
        testScenario: 'Ao adicionar 4 peças de estoque (ex: Camisa Linho Branco G) a uma nova mala de condicional e clicar em "Despachar Mala":',
        expectedOutcome: 'O status do SKU muda para "EM CONDICIONAL", a quantidade física disponível na loja decrementa imediatamente e nenhuma outra venda pode alocar a mesma peça.'
      },
      {
        id: 'AC-02',
        criterion: 'Disparo de mensagem de seleção personalizada via WhatsApp',
        testScenario: 'Ao concluir o despacho da mala para o cliente Dr. Guilherme Becker:',
        expectedOutcome: 'A API do WhatsApp envia link do lookbook ou mensagem formatada contendo a listagem das 4 peças, foto miniatura de cada item, valor individual, total em trânsito e o prazo acordado de 48h de retorno.'
      },
      {
        id: 'AC-03',
        criterion: 'Lembrete automático pré-recolhimento',
        testScenario: 'Quando o timer do condicional atinge 40 horas decorridas (8h antes do prazo final):',
        expectedOutcome: 'O sistema dispara automaticamente um gatilho de lembrete elegante via WhatsApp: "Olá Dr. Guilherme, seu curador passará amanhã às 14h para recolhimento das peças ou fechamento das suas escolhas favoritas."'
      },
      {
        id: 'AC-04',
        criterion: 'Controle de acesso estrito por papéis (RBAC)',
        testScenario: 'Usuário logado com papel "ATENDENTE" tenta excluir um cliente VIP ou editar custos de compra de produtos:',
        expectedOutcome: 'A interface oculta os campos de margem de lucro e o backend rejeita a mutação com HTTP 403 Forbidden. Apenas o "ADMIN" possui permissão financeira total.'
      },
      {
        id: 'AC-05',
        criterion: 'Devolução parcial com retorno imediato ao estoque da loja',
        testScenario: 'Cliente compra 2 peças da mala e devolve 2 peças:',
        expectedOutcome: 'As 2 peças devolvidas retornam com status "DISPONÍVEL" no estoque da loja de Canoinhas em tempo real, sem necessidade de recadastro manual.'
      }
    ],
    deliverablesTech: [
      'Schema relacional: tabelas de clients, sizes, products, stock_units, condicionais, condicional_items, users e roles',
      'API Webhooks de integração WhatsApp (Z-API / Evolution / Cloud API)',
      'Interface Kanban com drag-and-drop e badges de contagem regressiva 48h',
      'Módulo de autenticação com JWT e middleware de papéis (RBAC)'
    ],
    kpiImpact: ['Tempo de montagem de mala cai de 25 min para 5 min', 'Eliminação de perda de peças sem paradeiro'],
    risksAndMitigation: 'Risco: Curador esquecer de registrar a devolução de uma peça. Mitigação: Tela de checkout de condicional exige confirmação item a item com checkbox (Ficou vs Devolveu).'
  },
  {
    id: 'sprint-3',
    sprintNumber: 3,
    phase: 'Monetização & Ponto de Venda',
    durationWeeks: 2,
    targetTimeline: 'Semanas 5 e 6',
    title: 'Sprint 3: Pedidos, Pagamentos Omnichannel & PDV Físico Simplificado',
    badge: 'Sprint 3 (Semana 5–6)',
    summary: 'Fechamento comercial integrado. Conversão de condicional em pedido faturado em 2 cliques, geração dinâmica de QR Code Pix com webhook de conciliação bancária imediata, link de pagamento cartão e PDV simplificado de balcão para a loja física de Canoinhas.',
    modulesIncluded: [
      'Conversão direta de Condicional em Pedido (baixa de peças retidas)',
      'PDV Físico Rápido para compras em loja balcão',
      'Integração Pix Dinâmico (QR Code copiacola com confirmação instantânea)',
      'Geração de Link de Cartão de Crédito parcelado (1 a 6x sem juros)',
      'Emissão de Recibo Digital em PDF e disparo no WhatsApp com link'
    ],
    acceptanceCriteria: [
      {
        id: 'AC-06',
        criterion: 'Fechamento de condicional com conversão instantânea em pedido',
        testScenario: 'Curador marca 3 peças como "Compradas" e 1 como "Devolvida" no painel de conferência:',
        expectedOutcome: 'O pedido de venda é gerado automaticamente com os valores tabelados, o condicional é marcado como "CONVERTIDO", e o comprovante com detalhamento de itens é criado.'
      },
      {
        id: 'AC-07',
        criterion: 'Conciliação automática de Pix via Webhook',
        testScenario: 'Cliente realiza o pagamento do QR Code Pix de R$ 2.450 no aplicativo do banco:',
        expectedOutcome: 'O webhook do gateway (Mercado Pago / Asaas / EFI) recebe a notificação, altera o status do pedido para "PAGO" em menos de 3 segundos e notifica o curador na tela sem reload.'
      },
      {
        id: 'AC-08',
        criterion: 'PDV balcão com leitor de código de barras ou SKU manual',
        testScenario: 'Cliente entra na loja física, escolhe uma camisa polo e um cinto:',
        expectedOutcome: 'Atendente digita ou bipa o SKU, seleciona cliente existente (ou cliente avulso rápido) e finaliza o pedido em menos de 40 segundos.'
      }
    ],
    deliverablesTech: [
      'Módulo de Orders & Invoicing integrado ao catálogo',
      'SDK de pagamentos (Pix estático/dinâmico + Tokenização de cartão)',
      'Gerador de comprovantes PDF para mobile com branding Ravi\'s',
      'Impressão térmica rápida opcional (80mm) para balcão'
    ],
    kpiImpact: ['Aumento do ticket médio com facilidade de parcelamento', 'Redução do ciclo de faturamento de 5 dias para <24h'],
    risksAndMitigation: 'Risco: Falha de conexão de internet no cliente durante a cobrança. Mitigação: Geração de link de pagamento persistente que pode ser pago após a entrega.'
  },
  {
    id: 'sprint-4',
    sprintNumber: 4,
    phase: 'Comunicação Multicanal & Automação',
    durationWeeks: 2,
    targetTimeline: 'Semanas 7 e 8',
    title: 'Sprint 4: Inbox Unificado & Automações de Relacionamento',
    badge: 'Sprint 4 (Semana 7–8)',
    summary: 'Centralização de todas as conversas com clientes (WhatsApp oficial, Direct Instagram e canal concierge) em um único painel em tempo real, com drawer de perfil 360° embutido e gatilhos de pós-venda e aniversários.',
    modulesIncluded: [
      'Inbox Unificado (WhatsApp, Direct Instagram, Mensagens internas)',
      'Ficha Lateral 360° acoplada ao chat (ver medidas e compras sem trocar de aba)',
      'Atalhos de mensagens pré-formatadas ("Mala Pronta", "Cobrança Elegante", "Chegaram Novidades")',
      'Gatilhos de automação (Aniversário do cliente com sugestão de presente, 60 dias sem condicional)',
      'Histórico unificado de notas internas e tarefas atribuídas a cada cliente'
    ],
    acceptanceCriteria: [
      {
        id: 'AC-09',
        criterion: 'Criação de condicional a partir da tela de chat',
        testScenario: 'Curador está conversando com cliente no Inbox Unificado e clica no botão "Montar Condicional" no drawer lateral:',
        expectedOutcome: 'O modal de montagem abre pré-preenchido com o cliente atual, medidas travadas e filtros de preferências aplicados.'
      },
      {
        id: 'AC-10',
        criterion: 'Disparo de alerta de inatividade inteligente',
        testScenario: 'Cliente categorizado como VIP Platinum não realiza pedidos ou condicionais há 45 dias:',
        expectedOutcome: 'O sistema cria uma tarefa prioritária no feed do curador responsável com sugestão de abordagem e peças compatíveis com a estação.'
      },
      {
        id: 'AC-11',
        criterion: 'Sincronização bidirecional em tempo real do WhatsApp',
        testScenario: 'Cliente responde uma mensagem pelo WhatsApp no smartphone pessoal dele:',
        expectedOutcome: 'A mensagem é refletida na coluna de mensagens ativas do CRM em < 1 segundo via WebSocket, com badge de não-lido.'
      }
    ],
    deliverablesTech: [
      'WebSocket server para sincronia de mensagens em tempo real',
      'Drawer de contexto lateral ultra-rápido com cache local',
      'Motor de regras de automação cron diário (aniversários, inatividade, follow-up)'
    ],
    kpiImpact: ['Tempo de resposta no atendimento reduz de 4 horas para <15 minutos', 'Aumento de 28% no retorno de clientes inativos'],
    risksAndMitigation: 'Risco: Bloqueio de número por spam. Mitigação: Limitar envios apenas a interações personalizadas e clientes cadastrados com opt-in.'
  },
  {
    id: 'sprint-5',
    sprintNumber: 5,
    phase: 'Inteligência de Negócio & BI',
    durationWeeks: 2,
    targetTimeline: 'Semanas 9 e 10',
    title: 'Sprint 5: Analytics Avançado, Dashboards do Gestor & Curadoria Preditiva',
    badge: 'Sprint 5 (Semana 9–10)',
    summary: 'Painéis analíticos profundos para a diretoria da Ravi\'s acompanhar a performance de vendas, conversão de malas, valor do capital parado na rua, ranking de marcas e motivos recorrentes de devolução.',
    modulesIncluded: [
      'Dashboard Executivo (Faturamento, Conversão % de Condicional, LTV por cliente)',
      'Monitor de Capital em Trânsito (Mala por cliente, tempo médio de retenção)',
      'Relatório de Análise de Devoluções (Motivos: tamanho errado, caimento, tecido, preço)',
      'Curador Preditivo AI (Sugestão de looks baseada no histórico de aprovação)',
      'Exportação contábil e de estoque para DRE gerencial em Excel/CSV'
    ],
    acceptanceCriteria: [
      {
        id: 'AC-12',
        criterion: 'Cálculo exato de taxa de conversão de condicional',
        testScenario: 'No período de 30 dias foram despachadas 100 peças e o cliente comprou 78 peças:',
        expectedOutcome: 'O dashboard exibe com precisão matemática a Taxa de Conversão de Peças em 78.0% e Taxa de Conversão Financeira em R$.'
      },
      {
        id: 'AC-13',
        criterion: 'Alerta visual de capital em trânsito excedido',
        testScenario: 'O valor total de peças em mãos de clientes na cidade de Canoinhas ultrapassa o teto definido de R$ 50.000:',
        expectedOutcome: 'O dashboard exibe badge de alerta âmbar e lista as malas que estão próximas de estourar as 48 horas regulamentares.'
      },
      {
        id: 'AC-14',
        criterion: 'Agrupamento automático de motivos de devolução',
        testScenario: 'Ao registrar devoluções durante a semana, 8 clientes apontam "Caimento Largo":',
        expectedOutcome: 'O gráfico de motivos de devolução aponta "Caimento Largo" como principal detrator (42%), sugerindo ajuste nas medidas ou compra de peças Slim Fit.'
      }
    ],
    deliverablesTech: [
      'Agregadores analíticos com queries otimizadas ou materialização de métricas',
      'Biblioteca de visualização de gráficos com tema Dark Luxury (Recharts / SVG)',
      'Engine de recomendação baseada em vetores de estilo e histórico de compras'
    ],
    kpiImpact: ['Redução de devoluções por erro de modelagem em 35%', 'Visibilidade 100% clara de ROI e giro de estoque'],
    risksAndMitigation: 'Risco: Lentidão de carregamento em grandes volumes. Mitigação: Pré-cálculo noturno e paginação de dados.'
  },
  {
    id: 'sprint-6',
    sprintNumber: 6,
    phase: 'Mobilidade Total & Offline-First',
    durationWeeks: 2,
    targetTimeline: 'Semanas 11 e 12',
    title: 'Sprint 6: App Mobile do Curador & PWA Offline-First para Chão de Loja',
    badge: 'Sprint 6 (Semana 11–12)',
    summary: 'Aplicação móvel nativa/PWA desenvolvida especificamente para o curador operar no chão de loja, estoques e visitas externas em Canoinhas. Leitor de código de barras pela câmera, fotos de lookbook direto do celular e suporte a trabalho offline com sincronização em background.',
    modulesIncluded: [
      'PWA instalável no smartphone (iOS e Android com visual app-like)',
      'Leitor de SKU e código de barras via câmera traseira do smartphone',
      'Upload instantâneo de fotos reais da mala montada para o cliente',
      'IndexedDB Offline-First (criar rascunho de mala sem sinal de Wi-Fi ou 4G)',
      'Sincronização em segundo plano (Background Sync) ao restabelecer conectividade'
    ],
    acceptanceCriteria: [
      {
        id: 'AC-15',
        criterion: 'Operação de montagem de mala em modo avião (Offline)',
        testScenario: 'Curador ativa o modo avião no celular, bipou 3 peças com a câmera e clica em "Salvar Mala Rascunho":',
        expectedOutcome: 'A mala é armazenada com sucesso no IndexedDB local com indicador amarelo "Sincronização Pendente". O aplicativo não trava e não exibe erros.'
      },
      {
        id: 'AC-16',
        criterion: 'Sincronização automática com resolução de conflitos',
        testScenario: 'Curador desativa o modo avião e o celular reconecta à rede Wi-Fi da Ravi\'s:',
        expectedOutcome: 'O Service Worker detecta a conexão, envia os dados para a nuvem em background e exibe badge verde "Sincronizado".'
      },
      {
        id: 'AC-17',
        criterion: 'Leitura rápida de etiqueta de produto com a câmera',
        testScenario: 'Curador aponta a câmera para a etiqueta de uma calça de alfaiataria:',
        expectedOutcome: 'O código de barras é decodificado em menos de 400ms e a peça é inserida diretamente na mala em montagem.'
      }
    ],
    deliverablesTech: [
      'Configuração PWA com manifest.json, service worker e cache de assets',
      'Biblioteca de scanner ótico HTML5 / Barcode Detection API nativa',
      'Motor de sincronização IndexedDB com fila transacional de saída'
    ],
    kpiImpact: ['Curador ganha 100% de autonomia em visitas domiciliares', 'Zero dependência de computador desktop no estoque'],
    risksAndMitigation: 'Risco: Conflito de peça reservada por dois curadores simultaneamente offline. Mitigação: Timestamp com prioridade de quem despachou primeiro e aviso imediato ao segundo curador.'
  }
];

export const PRODUCT_SUCCESS_METRICS: ProductSuccessMetric[] = [
  {
    id: 'MTR-01',
    metricName: 'Taxa de Conversão de Condicional',
    targetDirection: 'increase',
    baseline: '52.0%',
    targetMVP: '72.0%',
    targetScale: '80.0%+',
    unit: '% de peças compradas / enviadas',
    measurementMethod: 'Somatório de peças com status "Comprado" dividido pelo total de peças despachadas nas malas condicionais em 30 dias.',
    businessImpact: 'Aumento imediato de receita sem custo adicional de aquisição de novos clientes.'
  },
  {
    id: 'MTR-02',
    metricName: 'Tempo de Montagem de Seleção',
    targetDirection: 'decrease',
    baseline: '25 min',
    targetMVP: '6 min',
    targetScale: '3 min',
    unit: 'Minutos por mala montada',
    measurementMethod: 'Tempo cronometrado entre a abertura do perfil do cliente e o clique de "Despachar Mala Condicional".',
    businessImpact: 'Curador consegue atender até 4x mais clientes de alto valor no mesmo dia.'
  },
  {
    id: 'MTR-03',
    metricName: 'Tempo de Resposta no Atendimento',
    targetDirection: 'decrease',
    baseline: '240 min (4h)',
    targetMVP: '25 min',
    targetScale: '< 10 min',
    unit: 'Tempo médio de resposta no WhatsApp',
    measurementMethod: 'Tempo decorrido entre a mensagem recebida do cliente e a primeira resposta qualificada do curador ou concierge.',
    businessImpact: 'Experiência VIP comparável a maisons de luxo internacionais; conversão no calor da intenção do cliente.'
  },
  {
    id: 'MTR-04',
    metricName: 'Ticket Médio de Venda (AOV)',
    targetDirection: 'increase',
    baseline: 'R$ 780,00',
    targetMVP: 'R$ 1.650,00',
    targetScale: 'R$ 2.400,00+',
    unit: 'Reais por pedido faturado',
    measurementMethod: 'Receita total faturada no período dividida pela quantidade de pedidos fechados.',
    businessImpact: 'Venda de looks completos (camisa + calça + sapato + blazer) ao invés de itens avulsos.'
  },
  {
    id: 'MTR-05',
    metricName: 'Índice de Retenção de Peças na Rua (Atrasos)',
    targetDirection: 'decrease',
    baseline: '18% malas atrasadas',
    targetMVP: '< 4% atrasadas',
    targetScale: '< 1.5% atrasadas',
    unit: '% malas que excedem 48h',
    measurementMethod: 'Malas com status em trânsito por mais de 48 horas divididas pelo total de malas despachadas.',
    businessImpact: 'Giro de estoque 3x mais rápido e eliminação de capital travado sem gerar receita.'
  }
];

export const ROLLOUT_PLAN: RolloutPhase[] = [
  {
    phaseNumber: 1,
    name: 'Piloto Controlado em Canoinhas (1 Curador-Chave)',
    period: 'Dias 1 a 30 (Mês 1 pós-MVP)',
    scope: 'Loja Física Ravi\'s Canoinhas - SC',
    curatorsCount: 1,
    location: 'Rua Principal / Centro Comercial Canoinhas - SC',
    activities: [
      'Deploy do MVP (Sprints 1 e 2) no ambiente de produção oficial.',
      'Treinamento prático de 2 horas com o curador principal (gestor de malas).',
      'Cadastramento dos 30 clientes mais fiéis (Dr. Guilherme, Rodrigo Silveira, etc.) com biometria completa.',
      'Operação exclusiva das malas de condicional através do sistema, sem anotações em papel ou planilhas paralelas.',
      'Ajustes diários rápidos de UX e fluxo de WhatsApp com base no feedback real do curador.'
    ],
    exitCriteria: [
      'Pelo menos 40 malas de condicional montadas e despachadas com sucesso pelo sistema.',
      'Zero perda de sincronia de estoque entre loja física e malas em domicílio.',
      'Taxa de conversão de condicional superior a 65% no período.',
      'Curador principal operando com satisfação declarada e sem bloqueios operacionais.'
    ]
  },
  {
    phaseNumber: 2,
    name: 'Expansão Interna da Equipe (Equipe Completa Canoinhas)',
    period: 'Dias 31 a 60 (Mês 2)',
    scope: 'Loja Física Canoinhas - SC (Todos os colaboradores)',
    curatorsCount: 3,
    location: 'Loja Canoinhas (Atendentes balcão + 2 Curadores externos + Gestor)',
    activities: [
      'Liberação das Sprints 3 e 4 (PDV balcão, pagamentos integrados e Inbox unificado).',
      'Treinamento da equipe de atendimento balcão para venda rápida.',
      'Ativação do link de pagamento com cartão e Pix dinâmico para os clientes.',
      'Início do uso do Inbox unificado para atendimento de WhatsApp e Direct do Instagram.',
      'Reunião semanal de análise dos motivos de devolução para calibrar as próximas compras de estoque.'
    ],
    exitCriteria: [
      '100% das vendas da loja de Canoinhas (físicas e condicionais) registradas no Ravis CRM.',
      'Tempo de resposta no WhatsApp inferior a 20 minutos durante horário comercial.',
      'Fechamento contábil e de caixa diário 100% conciliado sem discrepâncias.'
    ]
  },
  {
    phaseNumber: 3,
    name: 'Escala & Mobilidade de Campo (Curador Externo & Novas Cidades)',
    period: 'Dias 61 a 90 (Mês 3)',
    scope: 'Canoinhas + Região do Planalto Norte SC (Três Barras, Mafra, Porto União)',
    curatorsCount: 5,
    location: 'Atendimento Domiciliar Regional & Expansão',
    activities: [
      'Liberação das Sprints 5 e 6 (App Mobile Curador PWA Offline-First e Analytics Executivo).',
      'Uso de smartphones e tablets para curadoria externa em escritórios e consultórios de clientes VIP.',
      'Scanner de etiquetas de produtos via câmera e upload de fotos da mala no momento da montagem.',
      'Acompanhamento do Dashboard de BI pelo proprietário com metas automáticas de comissão por curador.'
    ],
    exitCriteria: [
      'Taxa de conversão global mantida acima de 75%.',
      'Mais de 150 clientes ativos na base com perfil de estilo preenchido.',
      'Modelo operacional documentado e pronto para replicação em futuras filiais ou franquias da Ravi\'s.'
    ]
  }
];
