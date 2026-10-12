export interface VisionSection {
  id: string;
  title: string;
  badge: string;
  summary: string;
  content: string[];
}

export const RAVIS_VISION_DOCUMENT = {
  title: "Documento de Visão Estratégica & Arquitetura de Produto: Ravis CRM",
  subtitle: "O Primeiro CRM Vertical do Brasil Nativo em Curadoria de Moda Masculina Premium e Experiência de Condicional",
  brand: "Ravi's Premium",
  location: "Canoinhas - Santa Catarina & Região do Planalto Norte",
  version: "1.0 - MVP Foundation",
  executiveSummary: `A Ravi's Premium opera em um nicho de altíssimo valor percebido: a moda masculina premium em cidades-polo regionais como Canoinhas e o Planalto Norte Catarinense. O público-alvo — médicos, empresários do agronegócio e da indústria madeireira, advogados e executivos — possui alto poder aquisitivo, mas escassez severa de tempo e forte aversão ao atrito da compra física tradicional (estacionamento, fila de provador, atendimento genérico) ou da incerteza do e-commerce comum.

O modelo vencedor da Ravi's baseia-se em três pilares: (1) Curadoria pessoal de edições limitadas e tecidos nobres; (2) O serviço de CONDICIONAL VIP (levar uma mala selecionada sob medida para o cliente experimentar em casa ou no consultório); e (3) Relacionamento hiperpersonalizado via WhatsApp.

CRMs tradicionais de mercado falham catastroficamente nesse modelo:
• Salesforce é burocrático, excessivamente complexo e desconectado da realidade ágil do atendente no chão de loja.
• HubSpot é excelente em funis inbound de SaaS B2B, mas seu CRM não entende estoque físico, tamanhos de vestuário e nem o ciclo reverso de condicional.
• Zoho oferece módulos dispersos com interface rígida, sem a sofisticação estética exigida pelo luxo e sem suporte nativo a mala de peças sob consignação doméstica.

O Ravis CRM surge como a resposta definitiva: absorve a força de pipeline do Salesforce, o inbox unificado e intuitivo do HubSpot e a modularidade enxuta do Zoho — superando todos ao construir NATIVAMENTE em torno do ciclo do Condicional e do perfil antropométrico 360° do homem Ravi's.`,

  benchmarks: [
    {
      platform: "Salesforce Sales Cloud",
      strengths: "Automação avançada, estágios rígidos de pipeline e relatórios granulares.",
      weaknesses: "Altíssimo custo, interface corporativa hostil no smartphone, nenhuma noção nativa de provador em domicílio ou reserva de estoque físico.",
      ravisAdvantage: "Pipeline kanban desenhado especificamente para o ciclo de Condicional (Montagem → Saída → Em Teste com timer 48h → Fechamento), operável em 1 clique pelo celular do curador."
    },
    {
      platform: "HubSpot CRM",
      strengths: "Inbox unificado agradável, timeline de interações e facilidade de adoção.",
      weaknesses: "Focado em leads de internet B2B. Não armazena grade de tamanhos (P/M, caimento slim/longline, calça 42), nem calcula conversão de peças provadas vs compradas.",
      ravisAdvantage: "Inbox Omnichannel (WhatsApp Business API + Instagram Direct) com templates instantâneos de status da mala, validação de tamanhos do cliente e disparo de links Pix diretos."
    },
    {
      platform: "Zoho CRM",
      strengths: "Modularidade, flexibilidade de campos customizados e custo acessível.",
      weaknesses: "UX fragmentada, baixa fluidez mobile, ausência de inteligência estética para combinação de looks ou prevenção de ruptura de estoque exclusivo.",
      ravisAdvantage: "Gestão de estoque limitada em tempo real com segregação de 'Peças em Estoque' vs 'Peças em Trânsito na Casa do Cliente', impedindo que itens exclusivos sejam prometidos em duplicidade."
    }
  ],

  personas: [
    {
      role: "Curador & Consultor de Estilo (Chão de Loja e WhatsApp)",
      name: "Mateus, 29 anos",
      context: "Atua na loja física no Centro de Canoinhas e gerencia uma carteira ativa de mais de 80 clientes fiéis via WhatsApp.",
      pains: [
        "Anotar em caderninho ou bloco de notas quem levou qual peça para experimentar e perder o controle de peças que sumiram ou estão há dias na rua.",
        "Ter que lembrar de cabeça o tamanho de camisa, calça e estilo que cada cliente prefere na hora de montar a mala de novidades.",
        "Cobrar o retorno da mala sem parecer invasivo ou inconveniente."
      ],
      solutionWithRavis: [
        "Montador visual de mala no celular em 60 segundos com filtro automático apenas nas peças disponíveis no tamanho exato do cliente.",
        "Timer automático regressivo de 48h de teste com lembrete amigável via WhatsApp no tom premium da marca.",
        "Ficha 360° com caimento predileto (ex: Slim Fit, Linho, tons terrosos) e notas secretas do consultor."
      ]
    },
    {
      role: "Gestor & Sócio-Proprietário da Ravi's Premium",
      name: "Ravi / Diretor Comercial, 38 anos",
      context: "Supervisiona as operações da marca em Canoinhas, compras de coleções limitadas e resultados financeiros.",
      pains: [
        "Falta de visibilidade do capital em mercadorias parado na rua em condicionais ativas (risco de perda e depreciação).",
        "Dificuldade de saber qual curador tem a maior taxa de conversão e quais peças geram maior fechamento.",
        "Vender no e-commerce ou na loja física uma peça exclusiva que já estava na mala de um cliente em teste."
      ],
      solutionWithRavis: [
        "Dashboard gerencial com 'Total em Condicional na Rua (R$)', taxa de conversão por vendedor e motivos de recusa.",
        "Bloqueio automático de estoque: peça na mala fica com status 'Reservada' até devolução ou compra.",
        "Previsão de faturamento baseada no histórico de conversão da carteira."
      ]
    },
    {
      role: "Cliente Ravi's Premium (Comprador Final)",
      name: "Dr. Guilherme, 44 anos (Médico Cardiologista / Produtor Rural em Canoinhas)",
      context: "Rotina intensa entre plantões, fazenda e eventos sociais. Valoriza estar impecavelmente vestido com peças de bom corte, mas odeia ir ao shopping.",
      pains: [
        "Não ter tempo de garimpar roupas em araras ou enfrentar fila de provador.",
        "Receber malas com roupas em tamanhos errados ou modelos berrantes que não combinam com seu estilo sóbrio e elegante.",
        "Constrangimento se demorar para responder sobre as peças que não serviram."
      ],
      solutionWithRavis: [
        "Recebe em sua residência ou consultório uma seleção cirúrgica de 5 a 8 peças que parecem ter sido feitas sob encomenda para suas medidas.",
        "Experimenta com tranquilidade à noite ou no fim de semana junto à sua família.",
        "Paga instantaneamente via Pix somente pelas peças escolhidas e o motorista da Ravi's recolhe o restante com agendamento pontual."
      ]
    }
  ],

  valueProposition: {
    headline: "Transforme a conveniência do Condicional na maior alavanca de LTV da moda masculina premium.",
    pillars: [
      {
        title: "Curadoria de Alta Precisão (Zero Desperdício)",
        description: "O sistema cruza o perfil antropométrico (P/M/G, calça 42, caimento slim ou alfaiataria desestruturada) com o inventário disponível, garantindo que nenhuma mala saia com peças incompatíveis."
      },
      {
        title: "Ciclo de Condicional Blindado",
        description: "Controle ponta a ponta dos 4 estágios: Seleção Montada → Caixa Enviada → Em Teste (com contador de 48h) → Comprada/Devolvida, eliminando perdas e esquecimentos."
      },
      {
        title: "Omnichannel com WhatsApp Nativo",
        description: "Centraliza o diálogo do WhatsApp Business e Instagram Direct diretamente na timeline do cliente, com templates elegantes de lembrete de teste e checkout Pix."
      },
      {
        title: "Inteligência de Coleções Limitadas",
        description: "Métricas de quais tecidos, cortes e cores mais convertem em Canoinhas e região, orientando compras futuras e maximizando a margem líquida."
      }
    ]
  },

  mvpScope: {
    phase1: {
      phaseName: "Fase 1: MVP Operacional (Escopo Atual Entregue)",
      deliverables: [
        "Perfil do Cliente 360° completo: medidas antropométricas, caimentos (Slim, Regular, Longline), paleta preferida, histórico de compras e LTV.",
        "Módulo de Condicional Kanban com 5 estados rastreáveis e timer de horas restantes.",
        "Montador Inteligente de Mala de Condicional com validação de estoque e tamanho do cliente.",
        "Módulo de Checkout de Condicional (seleção de peças compradas vs devolvidas com motivo e geração de valor).",
        "Catálogo de Edições Limitadas com estoque por tamanho segregando 'Disponível' vs 'Reservado em Condicional'.",
        "Inbox Unificado WhatsApp/Instagram Direct com templates de mensagem de alta conversão.",
        "Dashboard com métricas-chave de moda masculina: conversão de condicional, canal de receita e ranking de consultores."
      ]
    },
    phase2: {
      phaseName: "Fase 2: Escala & Automação Inteligente (Próximos 90 dias)",
      deliverables: [
        "Integração oficial via Webhooks diretos da Meta Cloud API (WhatsApp Business oficial).",
        "Tags RFID e leitura de QR Code na etiqueta para montagem da mala por bipagem rápida no chão de loja.",
        "Rastreamento de motorista próprio em Canoinhas com link para o cliente acompanhar a entrega da mala.",
        "Checkout de pagamento transparente via Pix Dinâmico e link de cartão com split de comissões para o consultor."
      ]
    },
    phase3: {
      phaseName: "Fase 3: Expansão Multiloja & Franquias",
      deliverables: [
        "Gestão multi-unidade para lojas em outras cidades de Santa Catarina (Mafra, Porto União, Joinville).",
        "Módulo de clube de assinatura de curadoria periódica (ex: 'Ravi's Club - 1 mala a cada 45 dias').",
        "Visão 3D/Espelho virtual assistido por IA generativa para visualização de caimento prévio."
      ]
    }
  }
};
