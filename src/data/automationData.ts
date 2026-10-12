import { 
  ApprovedTemplate, 
  QuickReply, 
  AutomationRule, 
  AutomationLog, 
  ScheduledMessage, 
  Campaign, 
  MessageChannel 
} from '../types/crm';

export const CURATORS_LIST: string[] = [
  'Matheus (Consultor Sênior)',
  'Juliana (Consultora VIP)',
  'Ravi (Curador-Chefe)',
  'Camila (Stylist VIP)',
  'Não Atribuído'
];

export const APPROVED_TEMPLATES: ApprovedTemplate[] = [
  {
    id: 'tmpl-onboarding',
    name: '👋 Boas-vindas & Coleta de Tamanho (Onboarding)',
    category: 'ONBOARDING',
    metaStatus: 'APROVADO_META',
    variables: ['{nome}', '{cidade}'],
    text: `Olá, {nome}! Seja muito bem-vindo à Ravi's Premium de Canoinhas-SC. ✨

Nosso modelo de atendimento é baseado em curadoria pessoal exclusiva. Para prepararmos seleções perfeitas para você:
1. Qual seu tamanho habitual de camisa/camiseta (P, M, G ou GG)?
2. Qual caimento prefere (Slim Fit, Regular ou Longline)?
3. Você prefere provar as peças no conforto da sua casa pelo nosso serviço de Mala Condicional ou tomar um café em nossa loja física?

Aguardamos seu retorno para montar seu closet inteligente!`
  },
  {
    id: 'tmpl-mala-caminho',
    name: '📦 Mala Condicional a Caminho (Motorista VIP)',
    category: 'CONDICIONAL',
    metaStatus: 'APROVADO_META',
    variables: ['{nome}', '{tamanho_camisa}', '{quantidade_pecas}'],
    text: `Olá, {nome}! Tudo bem?

Sua mala exclusiva de curadoria Ravi's Premium foi montada pelo curador responsável e já está a caminho com nosso motorista VIP em Canoinhas.

Separamos {quantidade_pecas} peças impecáveis no seu tamanho {tamanho_camisa}. Você tem 7 dias para provar tudo com calma na frente do seu espelho, combinando com suas roupas.

Aproveite a experiência! Qualquer dúvida sobre caimentos ou ajustes, estamos à disposição aqui no WhatsApp.`
  },
  {
    id: 'tmpl-d3-reminder',
    name: '⏳ Lembrete D+3: Teste em Domicílio em Andamento',
    category: 'CONDICIONAL',
    metaStatus: 'APROVADO_META',
    variables: ['{nome}'],
    text: `Olá, {nome}! Passando para saber como você está e se já conseguiu experimentar as peças da mala Ravi's. 👔

Hoje é o 3º dia do seu período de teste em domicílio. Ficou com alguma dúvida sobre tecidos, caimento dos ombros ou combinações com o seu curador?

Lembrando que você pode ficar com as peças que amar e nosso motorista retira o restante sem nenhum custo!`
  },
  {
    id: 'tmpl-aniversario',
    name: '🎂 Homenagem de Aniversário VIP Ravi\'s',
    category: 'ANIVERSARIO',
    metaStatus: 'APROVADO_META',
    variables: ['{nome}', '{mes}'],
    text: `Parabéns, {nome}! Toda a equipe da Ravi's Premium deseja um ano extraordinário, repleto de conquistas e muita elegância! 🥂

Neste mês especial do seu aniversário, preparamos uma homenagem de curadoria:
✨ 15% OFF de cortesia na sua próxima compra ou
✨ Uma peça cortesia na montagem da sua mala condicional de aniversário.

Gostaria que o nosso curador montasse uma seleção especial para você comemorar em grande estilo?`
  },
  {
    id: 'tmpl-reativacao-60d',
    name: '✨ Reativação de Closet (60+ dias sem compra)',
    category: 'REATIVACAO',
    metaStatus: 'APROVADO_META',
    variables: ['{nome}', '{tamanho_camisa}', '{estilo}'],
    text: `Olá, {nome}! Sentimos sua falta aqui na Ravi's Premium.

Acabamos de receber novidades de edição limitada (apenas 1 a 3 peças por modelo) que combinam perfeitamente com seu estilo {estilo} e no seu tamanho exato {tamanho_camisa}.

Gostaria de receber uma seleção exclusiva na sua casa em Canoinhas sem compromisso essa semana? Responda 'SIM' e nós cuidamos de tudo!`
  },
  {
    id: 'tmpl-drop-catalogo',
    name: '🔥 Drop Exclusivo: Nova Peça no Seu Tamanho',
    category: 'DROP_CATALOGO',
    metaStatus: 'APROVADO_META',
    variables: ['{nome}', '{titulo_peca}', '{tamanho}'],
    text: `Olá, {nome}! O curador separou uma novidade antes de abrirmos para a loja física.

Chegou uma nova unidade exclusiva de {titulo_peca} no seu tamanho {tamanho}. Pela raridade do lote (pouquíssimas unidades para Santa Catarina), lembramos imediatamente do seu perfil.

Podemos incluir essa peça na sua mala condicional desta semana ou reservar para você provar na loja?`
  },
  {
    id: 'tmpl-fechamento-pix',
    name: '💳 Fechamento de Condicional & Chave Pix',
    category: 'COBRANCA',
    metaStatus: 'APROVADO_META',
    variables: ['{nome}', '{valor_total}'],
    text: `Excelente escolha, {nome}! Confirmamos o fechamento das suas peças selecionadas no valor de {valor_total}.

Segue a chave Pix oficial da Ravi's Premium:
🔑 Chave Pix CNPJ: 48.912.345/0001-90
Razão Social: Ravi's Premium Vestuário Masculino Ltda
Banco: Cora SCD

Nosso motorista VIP passará hoje para recolher as peças devolvidas. Agradecemos pela confiança na nossa curadoria!`
  }
];

export const QUICK_REPLIES: QuickReply[] = [
  {
    id: 'qr-tamanho',
    shortcut: '/tamanho',
    title: 'Medidas & Caimento Pessoal',
    category: 'ATENDIMENTO',
    content: 'Para refinarmos sua curadoria exclusiva Ravi\'s, qual é o seu tamanho de camisa (P/M/G/GG) e calça (38 a 46)? Você prefere modelagem Slim Fit ou Longline?'
  },
  {
    id: 'qr-condicional',
    shortcut: '/condicional',
    title: 'Como funciona o Condicional Ravi\'s',
    category: 'CONDICIONAL',
    content: 'O serviço de Mala Condicional funciona assim: nosso curador monta uma seleção de até 6 peças alinhadas ao seu perfil, entregamos na sua casa ou consultório em Canoinhas sem custo e você tem 7 dias para provar com calma. Você só paga o que decidir manter!'
  },
  {
    id: 'qr-pix',
    shortcut: '/pix',
    title: 'Chave Pix Oficial Ravi\'s',
    category: 'PAGAMENTO',
    content: 'Chave Pix Oficial (CNPJ): 48.912.345/0001-90 | Ravi\'s Premium Vestuário Masculino Ltda | Banco Cora. Assim que efetuar, por gentileza nos envie o comprovante.'
  },
  {
    id: 'qr-horario',
    shortcut: '/horario',
    title: 'Horário & Local Loja Canoinhas',
    category: 'LOJA',
    content: 'Nossa loja conceito fica na Rua Vidal Ramos, 450, Centro de Canoinhas-SC. Atendimento de Seg a Sex das 08:30 às 19:30 e Sábados das 08:30 às 13:00. Venha tomar um café conosco!'
  },
  {
    id: 'qr-catalogo',
    shortcut: '/catalogo',
    title: 'Link da Coleção Limitada do Mês',
    category: 'ATENDIMENTO',
    content: 'Você pode conferir a prévia do lookbook exclusivo da nossa coleção de edição limitada em: https://ravispremium.com.br/curadoria-mes'
  },
  {
    id: 'qr-entrega',
    shortcut: '/entrega',
    title: 'Modalidades de Entrega Canoinhas & Região',
    category: 'CONDICIONAL',
    content: 'Temos 3 opções: (1) Entrega VIP com Motorista Ravi\'s na sua porta em Canoinhas/Três Barras; (2) Retirada e prova na sala privativa da loja; (3) Envio expresso para Mafra e Porto União.'
  }
];

export const DEFAULT_AUTOMATION_RULES: AutomationRule[] = [
  {
    id: 'auto-01',
    key: 'NOVO_CLIENTE',
    name: '1. Novo Cliente (Onboarding & Coleta de Medidas)',
    description: 'Assim que um lead ou cliente é cadastrado, envia mensagem acolhedora solicitando tamanho (P/M/G) e caimento (Slim/Longline). Ao responder, o sistema atualiza o perfil 360°.',
    trigger: 'Cadastro de novo cliente ou 1º contato WhatsApp',
    condition: 'Cliente com perfil de medidas incompleto e opt-in ativo',
    action: 'Dispara WhatsApp amigável com perguntas de tamanho e estilo pessoal',
    channel: 'WHATSAPP',
    isActive: true,
    totalExecutions: 48,
    successRate: 97.9,
    lastExecutedAt: 'Hoje às 11:20',
    templateText: `Olá, {nome}! Bem-vindo à Ravi's Premium. Para montarmos curadorias sob medida: qual seu tamanho de camisa (P/M/G) e caimento favorito (Slim/Longline)?`
  },
  {
    id: 'auto-02',
    key: 'CONDICIONAL_D3',
    name: '2. Condicional em Teste D+3 (Lembrete & Check de Caimento)',
    description: 'Quando a mala de condicional atinge 72 horas em teste com o cliente, envia lembrete educado oferecendo auxílio do curador e lembrando o prazo de 7 dias.',
    trigger: 'Mala atinge 3 dias (72h) no status EM_TESTE',
    condition: 'Mala em teste ativa, cliente em Canoinhas/Região, sem finalização prévia',
    action: 'Dispara WhatsApp com checklist das peças e link da mala condicional',
    channel: 'WHATSAPP',
    isActive: true,
    totalExecutions: 82,
    successRate: 98.8,
    lastExecutedAt: 'Ontem às 15:30',
    templateText: `Olá, {nome}! Como estão os caimentos das peças da sua mala Ravi's? Hoje é o 3º dia do seu período de 7 dias. Qualquer dúvida, estamos por aqui!`
  },
  {
    id: 'auto-03',
    key: 'ANIVERSARIANTE',
    name: '3. Aniversariante do Mês (Homenagem & Curadoria Especial)',
    description: 'No primeiro dia útil do mês do aniversário do cliente (ou na semana da data), dispara mensagem parabenizando com benefício exclusivo ou peça cortesia.',
    trigger: 'Chegada do mês de aniversário do cliente',
    condition: 'Data de aniversário cadastrada, opt-in LGPD ativo, cliente ativo',
    action: 'Dispara WhatsApp personalizado com presente de curadoria e convite',
    channel: 'WHATSAPP',
    isActive: true,
    totalExecutions: 29,
    successRate: 96.5,
    lastExecutedAt: '01/10/2026 às 09:00',
    templateText: `Parabéns, {nome}! A Ravi's preparou uma homenagem exclusiva no mês do seu aniversário: 15% de cortesia na sua próxima mala condicional!`
  },
  {
    id: 'auto-04',
    key: 'REATIVACAO_60D',
    name: '4. Reativação de Cliente Inativo (60+ Dias sem Compra)',
    description: 'Identifica clientes de alto valor ou recorrentes que não interagem ou compram há mais de 60 dias, e envia novidades selecionadas no tamanho exato dele.',
    trigger: 'Recência de compra superior a 60 dias',
    condition: 'Cliente com compras anteriores, sem condicional em aberto, sem opt-out',
    action: 'Dispara mensagem de reativação com as últimas novidades no tamanho do cliente',
    channel: 'WHATSAPP',
    isActive: true,
    totalExecutions: 37,
    successRate: 94.6,
    lastExecutedAt: '08/10/2026 às 14:15',
    templateText: `Olá, {nome}! Sentimos sua falta. Chegaram novos tricôs e camisas slim no seu tamanho {tamanho_camisa}. Quer receber uma mala em casa?`
  },
  {
    id: 'auto-05',
    key: 'DROP_NOVA_PECA',
    name: '5. Drop / Nova Peça no Catálogo (Match Inteligente de Perfil)',
    description: 'Ao cadastrar uma nova peça limitada no catálogo (ex: Tricô Irlandês ou Camisa Linho), localiza automaticamente clientes compatíveis (tamanho + estilo) e dispara no WhatsApp.',
    trigger: 'Cadastro de novo produto de edição limitada',
    condition: 'Match de tamanho da peça com perfil do cliente + estilo compatível',
    action: 'Dispara mensagem VIP com foto da peça e convite antecipado de reserva',
    channel: 'WHATSAPP',
    isActive: true,
    totalExecutions: 64,
    successRate: 98.4,
    lastExecutedAt: 'Hoje às 10:05',
    templateText: `Olá, {nome}! Chegou uma peça exclusiva de {titulo_peca} no seu tamanho exato. Reservamos uma prévia para sua mala condicional antes de ir à loja.`
  }
];

export const INITIAL_AUTOMATION_LOGS: AutomationLog[] = [
  {
    id: 'log-01',
    automationKey: 'DROP_NOVA_PECA',
    automationName: 'Drop / Nova Peça no Catálogo',
    clientId: 'cli-001',
    clientName: 'Dr. Guilherme Schramm',
    channel: 'WHATSAPP',
    status: 'SUCESSO',
    executedAt: 'Hoje às 10:05',
    details: 'Match com Camisa Linho Puro Areia (Tamanho M / Slim Fit). Disparo Evolution API concluído.',
    messagePreview: 'Olá, Dr. Guilherme! Chegou uma peça exclusiva de Camisa Linho Riviera Areia no seu tamanho M...'
  },
  {
    id: 'log-02',
    automationKey: 'CONDICIONAL_D3',
    automationName: 'Condicional em Teste D+3',
    clientId: 'cli-002',
    clientName: 'Rodrigo Silveira',
    channel: 'WHATSAPP',
    status: 'SUCESSO',
    executedAt: 'Ontem às 15:30',
    details: 'Mala COND-2026-088 atingiu 72h em teste. Disparado lembrete de experimentação com sucesso.',
    messagePreview: 'Olá, Rodrigo! Passando para checar como estão ficando as peças em você. Hoje é o 3º dia...'
  },
  {
    id: 'log-03',
    automationKey: 'NOVO_CLIENTE',
    automationName: 'Novo Cliente (Onboarding)',
    clientId: 'cli-005',
    clientName: 'Tiago Zaniolo',
    channel: 'WHATSAPP',
    status: 'SUCESSO',
    executedAt: 'Hoje às 11:46',
    details: 'Primeiro contato recebido via WhatsApp. Disparado formulário de medidas e estilo.',
    messagePreview: 'Olá, Tiago! Seja bem-vindo à Ravi\'s Premium. Qual seu tamanho habitual de camisa...'
  },
  {
    id: 'log-04',
    automationKey: 'REATIVACAO_60D',
    automationName: 'Reativação de Cliente Inativo',
    clientId: 'cli-004',
    clientName: 'Lucas Werlang',
    channel: 'WHATSAPP',
    status: 'SUCESSO',
    executedAt: '08/10/2026 às 14:15',
    details: 'Cliente sem compras há 63 dias. Disparada seleção de peças urbanas no tamanho P.',
    messagePreview: 'Olá, Lucas! Sentimos sua falta. Chegaram novos tricôs e polos no tamanho P...'
  },
  {
    id: 'log-05',
    automationKey: 'ANIVERSARIANTE',
    automationName: 'Aniversariante do Mês',
    clientId: 'cli-003',
    clientName: 'Marcelo Portes',
    channel: 'WHATSAPP',
    status: 'SUCESSO',
    executedAt: '01/10/2026 às 09:00',
    details: 'Aniversariante de Outubro identificado. Disparado voucher com 15% de cortesia.',
    messagePreview: 'Parabéns, Marcelo! Toda a equipe da Ravi\'s Premium deseja um ano extraordinário...'
  }
];

export const INITIAL_SCHEDULED_MESSAGES: ScheduledMessage[] = [
  {
    id: 'sch-001',
    clientId: 'cli-001',
    clientName: 'Dr. Guilherme Schramm',
    clientPhone: '(47) 99824-1102',
    channel: 'WHATSAPP',
    content: 'Olá, Dr. Guilherme! Nosso motorista passará às 17h para retirar o blazer e confirmar a compra da camisa de linho. Um abraço!',
    scheduledFor: '2026-10-13T17:00:00',
    status: 'PENDENTE',
    creatorName: 'Matheus (Consultor Sênior)',
    createdAt: '2026-10-12T10:30:00'
  },
  {
    id: 'sch-002',
    clientId: 'cli-002',
    clientName: 'Rodrigo Silveira',
    clientPhone: '(47) 99742-8833',
    channel: 'WHATSAPP',
    content: 'Boa tarde, Rodrigo! Passando para agendar a visita do motorista na fazenda para recolhimento e fechamento das peças da mala.',
    scheduledFor: '2026-10-14T09:30:00',
    status: 'PENDENTE',
    creatorName: 'Ravi (Curador-Chefe)',
    createdAt: '2026-10-12T11:15:00'
  }
];

export const INITIAL_CAMPAIGNS: Campaign[] = [
  {
    id: 'camp-01',
    name: 'Drop Outono/Inverno - Alfaiataria & Tricôs Canoinhas',
    targetFilter: {
      size: 'M',
      style: 'Clássico',
      city: 'Canoinhas'
    },
    channel: 'WHATSAPP',
    templateMessage: `Olá, {nome}! O frio do Planalto Norte chegou e a Ravi's separou uma curadoria especial de tricôs de merino e blazers sem forro no seu tamanho {tamanho_camisa}. Gostaria de receber uma mala em domicílio para provar?`,
    eligibleCount: 14,
    status: 'DISPARADA',
    createdAt: '2026-10-05',
    respectsBusinessHours: true,
    respectsLgpd: true,
    stats: {
      sent: 14,
      delivered: 14,
      read: 13,
      replied: 8,
      converted: 6
    }
  },
  {
    id: 'camp-02',
    name: 'Camisetas Slim Pima - Reposição Exclusiva',
    targetFilter: {
      size: 'P',
      style: 'Moderno'
    },
    channel: 'WHATSAPP',
    templateMessage: `Olá, {nome}! Chegaram pouquíssimas unidades da Camiseta Slim em Algodão Pima Peruano nas cores Off-White e Preto Ônix. Como sabemos que você usa tamanho {tamanho_camisa}, reservamos a oportunidade de inclusão na sua mala condicional desta semana!`,
    eligibleCount: 9,
    status: 'DISPARADA',
    createdAt: '2026-10-09',
    respectsBusinessHours: true,
    respectsLgpd: true,
    stats: {
      sent: 9,
      delivered: 9,
      read: 9,
      replied: 5,
      converted: 4
    }
  }
];
