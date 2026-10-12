import { Client, Product, CondicionalBox, UnifiedMessage, AnalyticsSummary, PredictiveConversionItem, Order, WishlistItem } from '../types/crm';

export const INITIAL_CLIENTS: Client[] = [
  {
    id: 'cli-001',
    name: 'Dr. Guilherme Schramm',
    phone: '(47) 99824-1102',
    email: 'guilherme.schramm@cardio.med.br',
    instagram: '@drguilhermeschramm',
    city: 'Canoinhas',
    neighborhood: 'Centro',
    address: 'Rua Vidal Ramos, 412 - Apto 601',
    tier: 'VIP Platinum',
    sizes: {
      shirt: 'M',
      pants: '42',
      shoes: '41',
      fitPreference: 'Slim Fit',
      heightCm: 182,
      weightKg: 79
    },
    style: {
      palette: ['Tons Terrosos', 'Azul Marinho & Branco', 'Off-white', 'Areia'],
      favoriteCategories: ['Camisas de Linho', 'Blazers Desestruturados', 'Calça Chino Tech'],
      avoidItems: ['Estampas grandes', 'Golas V profundas', 'Cores fluorescentes'],
      lifestyle: 'Médico Cardiologista no Hospital Santa Cruz; jantares de negócios e fins de semana em Pomerode.',
      profession: 'Médico Cardiologista & Pecuarista'
    },
    styleTags: ['Social', 'Clássico', 'Moderno'],
    customTags: ['Comprou Camiseta Slim Preta 90d', 'Amante de Linho', 'Mala Recorrente', 'VIP Médico Canoinhas'],
    metrics: {
      totalLtv: 18940,
      ordersCount: 9,
      condicionaisCount: 11,
      condicionalConversionRate: 81.8,
      averageTicket: 2104,
      lastInteractionDate: '2026-10-10'
    },
    purchasedPieces: [
      { id: 'pp-101', title: 'Camiseta Slim Pima Preta', category: 'Polos & Malharia', color: 'Preto Ônix', fit: 'Slim Fit', date: '2026-09-12', price: 279 },
      { id: 'pp-102', title: 'Camisa Linho Puro Riviera', category: 'Camisas', color: 'Areia Natural', fit: 'Slim Fit', date: '2026-08-20', price: 589 },
      { id: 'pp-103', title: 'Blazer Desestruturado Chumbo', category: 'Blazers', color: 'Chumbo Melange', fit: 'Alfaiataria Moderna', date: '2026-07-15', price: 1290 },
      { id: 'pp-104', title: 'Calça Chino Smart Stretch Fendi', category: 'Calças', color: 'Fendi / Fumaça', fit: 'Slim Fit', date: '2026-06-04', price: 449 }
    ],
    returnedPieces: [
      { id: 'rp-101', title: 'Bermuda Linho Marinho', category: 'Calças', size: '42', reason: 'Ficou folgado na cintura', date: '2026-08-20' },
      { id: 'rp-102', title: 'Polo Tricot Gola Camiseiro', category: 'Polos & Malharia', size: 'M', reason: 'Cor não agradou (muito clara)', date: '2026-05-18' }
    ],
    timeline: [
      { id: 'tl-101', type: 'WHATSAPP', title: 'Mensagem de WhatsApp', description: 'Curador Mateus enviou fotos da nova coleção de linho italiano.', timestamp: '10/10/2026 14:28' },
      { id: 'tl-102', type: 'CONDICIONAL', title: 'Mala Condicional Despachada', description: 'Mala COND-2026-088 com 4 peças entregue no consultório via Motorista VIP.', timestamp: '10/10/2026 17:00' },
      { id: 'tl-103', type: 'PAGAMENTO', title: 'Pagamento Pix Confirmado', description: 'Liquidação de R$ 868,00 referente à compra de peças da mala anterior.', timestamp: '15/09/2026 18:45' },
      { id: 'tl-104', type: 'VISITA_LOJA', title: 'Visita à Loja Física Ravi\'s', description: 'Dr. Guilherme tomou café na loja e experimentou calçados na arara central.', timestamp: '22/08/2026 16:30' },
      { id: 'tl-105', type: 'NOTA_CURADOR', title: 'Observação do Curador Mateus', description: 'Anotação: Gosta de mangas dobradas no estilo italiano, não mandar peças sintéticas.', timestamp: '10/08/2026 11:20' }
    ],
    curatorNotes: [
      'Prefere tecidos naturais (100% linho ou algodão pima peruano).',
      'Costuma pedir mala na quinta-feira à tarde para experimentar no fim de semana.',
      'Gosta de dobrar as mangas de camisa no estilo italiano clássico.',
      'A esposa Mariana frequentemente opina nas peças para eventos de gala.'
    ],
    preferredCurator: 'Mateus (Consultor Sênior)',
    createdAt: '2025-04-12'
  },
  {
    id: 'cli-002',
    name: 'Rodrigo Silveira',
    phone: '(47) 99742-8833',
    email: 'rodrigo@agroflorestal.com.br',
    instagram: '@rodrigo.silveira_agro',
    city: 'Canoinhas',
    neighborhood: 'Marcílio Dias',
    address: 'Rodovia SC-477, Km 14 - Fazenda Boa Vista',
    tier: 'VIP Ouro',
    sizes: {
      shirt: 'G',
      pants: '44',
      shoes: '42',
      fitPreference: 'Regular Fit',
      heightCm: 186,
      weightKg: 88
    },
    style: {
      palette: ['Verde Oliva', 'Marrom Café', 'Bege Fendi', 'Preto'],
      favoriteCategories: ['Jaquetas de Camurça/Couro', 'Botas Chelsea & Loafers', 'Polos Tricot'],
      avoidItems: ['Modelagens muito justas (Skinny)', 'Gola alta justa'],
      lifestyle: 'Produtor rural de grãos e silvicultura; transita entre o campo e reuniões com tradings em Curitiba.',
      profession: 'Produtor Rural e Empresário Florestal'
    },
    styleTags: ['Rústico Chic', 'Clássico', 'Casual'],
    customTags: ['Produtor Rural Planalto', 'Ticket Alto', 'Pagamento Imediato Pix'],
    metrics: {
      totalLtv: 14320,
      ordersCount: 6,
      condicionaisCount: 7,
      condicionalConversionRate: 85.7,
      averageTicket: 2386,
      lastInteractionDate: '2026-10-11'
    },
    purchasedPieces: [
      { id: 'pp-201', title: 'Jaqueta Bomber Camurça Conhaque', category: 'Blazers', color: 'Conhaque Queimado', fit: 'Regular Fit', date: '2026-08-10', price: 1650 },
      { id: 'pp-202', title: 'Polo Tricot Gola Camiseiro Nero', category: 'Polos & Malharia', color: 'Preto Ônix', fit: 'Regular Fit', date: '2026-07-22', price: 399 },
      { id: 'pp-203', title: 'Calça Chino Smart Stretch Fendi', category: 'Calças', color: 'Fendi', fit: 'Regular Fit', date: '2026-06-11', price: 449 }
    ],
    returnedPieces: [
      { id: 'rp-201', title: 'Camisa Linho Riviera', category: 'Camisas', size: 'G', reason: 'Ficou apertado nos ombros', date: '2026-07-22' }
    ],
    timeline: [
      { id: 'tl-201', type: 'WHATSAPP', title: 'Mensagem WhatsApp Recebida', description: 'Rodrigo avisou que o motorista entregou a caixa na sede da fazenda.', timestamp: '11/10/2026 15:10' },
      { id: 'tl-202', type: 'CONDICIONAL', title: 'Mala Condicional Enviada', description: 'Mala COND-2026-089 despachada com peças de inverno e jaqueta de camurça.', timestamp: '11/10/2026 14:00' },
      { id: 'tl-203', type: 'PAGAMENTO', title: 'Pix Recebido', description: 'Pagamento de R$ 2.049,00 à vista via Pix.', timestamp: '10/08/2026 17:30' }
    ],
    curatorNotes: [
      'Gosta de peças resistentes e nobres que aguentem transitar da fazenda à cidade.',
      'Pede mala condicional a cada início de estação (Outono/Inverno é seu forte).',
      'Paga sempre à vista via Pix na mesma hora do fechamento.'
    ],
    preferredCurator: 'Mateus (Consultor Sênior)',
    createdAt: '2025-06-18'
  },
  {
    id: 'cli-003',
    name: 'Bruno Becker',
    phone: '(47) 99185-3344',
    email: 'bruno.becker@beckeradv.com.br',
    instagram: '@brunobecker.adv',
    city: 'Canoinhas',
    neighborhood: 'Centro',
    address: 'Rua Getúlio Vargas, 185 - Sala 302',
    tier: 'VIP Ouro',
    sizes: {
      shirt: 'M',
      pants: '40',
      shoes: '40',
      fitPreference: 'Alfaiataria Moderna',
      heightCm: 178,
      weightKg: 73
    },
    style: {
      palette: ['Chumbo', 'Azul Petróleo', 'Cinza Mescla', 'Branco Puro'],
      favoriteCategories: ['Costumes & Blazers', 'Camisas Maquinetadas', 'Sapatos Derby Couro'],
      avoidItems: ['Bermudas em condicional', 'Camisetas estampadas'],
      lifestyle: 'Advogado empresarial com sustentações orais no TJSC em Florianópolis.',
      profession: 'Advogado Tributarista'
    },
    styleTags: ['Social', 'Clássico'],
    customTags: ['Advocacia Tributária', 'Alfaiataria Exclusiva', 'Eventos Formais'],
    metrics: {
      totalLtv: 11250,
      ordersCount: 5,
      condicionaisCount: 6,
      condicionalConversionRate: 83.3,
      averageTicket: 2250,
      lastInteractionDate: '2026-10-09'
    },
    purchasedPieces: [
      { id: 'pp-301', title: 'Blazer Desestruturado Alfaiataria Chumbo', category: 'Blazers', color: 'Chumbo Melange', fit: 'Alfaiataria Moderna', date: '2026-08-14', price: 1290 },
      { id: 'pp-302', title: 'Loafer Gravata Couro Pelica Mocca', category: 'Calçados', color: 'Mocca Escuro', fit: 'Alfaiataria Moderna', date: '2026-08-14', price: 780 }
    ],
    returnedPieces: [
      { id: 'rp-301', title: 'Calça Jeans Slim', category: 'Calças', size: '40', reason: 'Estilo não se adequa a audiências', date: '2026-05-10' }
    ],
    timeline: [
      { id: 'tl-301', type: 'CONDICIONAL', title: 'Mala em Separação', description: 'Curadora Juliana montou a mala COND-2026-090 para retirada na loja.', timestamp: '11/10/2026 18:00' },
      { id: 'tl-302', type: 'EMAIL', title: 'Catálogo de Alfaiataria Enviado', description: 'Lookbook de lãs frias enviado para bruno.becker@beckeradv.com.br.', timestamp: '09/10/2026 10:15' }
    ],
    curatorNotes: [
      'Prioriza caimento impecável de ombros e colarinho italiano estruturado.',
      'Valoriza abotoaduras e forros de alfaiataria diferenciados.'
    ],
    preferredCurator: 'Juliana (Consultora VIP)',
    createdAt: '2025-08-04'
  },
  {
    id: 'cli-004',
    name: 'Lucas Werlang',
    phone: '(47) 98841-5511',
    email: 'lucas@werlangdesign.com.br',
    instagram: '@lucaswerlang_arq',
    city: 'Três Barras',
    neighborhood: 'Jardim América',
    address: 'Av. Rigesa, 890 - Casa 12',
    tier: 'Recorrente',
    sizes: {
      shirt: 'P',
      pants: '38',
      shoes: '39',
      fitPreference: 'Longline',
      heightCm: 174,
      weightKg: 65
    },
    style: {
      palette: ['Preto Total', 'Off-white', 'Cinza Concreto', 'Verde Musgo'],
      favoriteCategories: ['Camisetas Longline Pima', 'Calça Alfaiataria Cropped', 'Sneakers Minimalistas'],
      avoidItems: ['Xadrez tradicional', 'Polo com brasão bordado'],
      lifestyle: 'Arquiteto contemporâneo; frequenta canteiros de obras de alto padrão e galerias de arte.',
      profession: 'Arquiteto & Designer'
    },
    styleTags: ['Moderno', 'Minimalista', 'Urbano'],
    customTags: ['Comprou Camiseta Slim Preta 90d', 'Design & Arquitetura', 'Cápsula Monocromática'],
    metrics: {
      totalLtv: 7680,
      ordersCount: 4,
      condicionaisCount: 5,
      condicionalConversionRate: 60.0,
      averageTicket: 1536,
      lastInteractionDate: '2026-10-08'
    },
    purchasedPieces: [
      { id: 'pp-401', title: 'Camiseta Heavyweight Algodão Pima Off-White', category: 'Polos & Malharia', color: 'Off-White', fit: 'Longline', date: '2026-10-09', price: 279 },
      { id: 'pp-402', title: 'Camiseta Slim Pima Preta', category: 'Polos & Malharia', color: 'Preto Ônix', fit: 'Slim Fit', date: '2026-09-02', price: 279 },
      { id: 'pp-403', title: 'Polo Tricot Gola Camiseiro Nero', category: 'Polos & Malharia', color: 'Preto Ônix', fit: 'Longline', date: '2026-10-09', price: 399 }
    ],
    returnedPieces: [
      { id: 'rp-401', title: 'Camisa Linho Riviera', category: 'Camisas', size: 'P', reason: 'Já possui similar no closet', date: '2026-10-09' }
    ],
    timeline: [
      { id: 'tl-401', type: 'INSTAGRAM', title: 'Direct do Instagram', description: 'Lucas perguntou no @ravispremium sobre novas peças em tom concreto.', timestamp: '10/10/2026 19:40' },
      { id: 'tl-402', type: 'CONDICIONAL', title: 'Fechamento de Mala Realizado', description: 'Compra de 2 peças concluída e retirada das peças devolvidas.', timestamp: '09/10/2026 14:30' }
    ],
    curatorNotes: [
      'Gosta de silhuetas alongadas e minimalismo escandinavo.',
      'Sempre atento a lançamentos de edições ultra-limitadas.'
    ],
    preferredCurator: 'Juliana (Consultora VIP)',
    createdAt: '2025-11-20'
  },
  {
    id: 'cli-005',
    name: 'Tiago Zaniolo',
    phone: '(47) 99612-9900',
    email: 'tiago@zaniolomadeiras.com.br',
    city: 'Canoinhas',
    neighborhood: 'Industrial',
    address: 'Rua Frei Menandro Kamps, 1200',
    tier: 'Novo Cliente',
    sizes: {
      shirt: 'GG',
      pants: '46',
      shoes: '43',
      fitPreference: 'Regular Fit',
      heightCm: 184,
      weightKg: 95
    },
    style: {
      palette: ['Azul Marinho', 'Vinho/Bordô', 'Preto', 'Cáqui'],
      favoriteCategories: ['Polos Estruturadas', 'Jeans Premium Elastano', 'Camisas Algodão Egípcio'],
      avoidItems: ['Peças justas', 'Gola padre'],
      lifestyle: 'Diretor industrial madeireiro; prefere conforto sem abrir mão de presença executiva.',
      profession: 'Diretor Industrial'
    },
    styleTags: ['Clássico', 'Casual'],
    customTags: ['Indicação Dr Guilherme', 'Setor Madeireiro', 'Novo Lead'],
    metrics: {
      totalLtv: 3890,
      ordersCount: 1,
      condicionaisCount: 2,
      condicionalConversionRate: 50.0,
      averageTicket: 1945,
      lastInteractionDate: '2026-10-07'
    },
    purchasedPieces: [
      { id: 'pp-501', title: 'Polo Pima Marinho Tradicional', category: 'Polos & Malharia', color: 'Azul Marinho', fit: 'Regular Fit', date: '2026-08-20', price: 349 }
    ],
    returnedPieces: [
      { id: 'rp-501', title: 'Camisa Linho Riviera', category: 'Camisas', size: 'GG', reason: 'Ficou apertado no peito', date: '2026-08-20' }
    ],
    timeline: [
      { id: 'tl-501', type: 'WHATSAPP', title: 'Primeiro Contato WhatsApp', description: 'Tiago entrou em contato pedindo informações sobre mala de teste.', timestamp: '07/10/2026 11:45' }
    ],
    curatorNotes: [
      'Veio por indicação do Dr. Guilherme Schramm.',
      'Prefere que as camisas tenham elastano para maior mobilidade.'
    ],
    preferredCurator: 'Mateus (Consultor Sênior)',
    createdAt: '2026-08-15'
  }
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-001',
    code: 'RAV-LNH-01',
    title: 'Camisa Linho Puro Riviera',
    category: 'Camisas',
    price: 589,
    costPrice: 220,
    material: '100% Linho Francês Lavado',
    color: 'Areia Natural',
    fitType: 'Slim Fit',
    limitedEditionCount: 24,
    description: 'Modelagem sob medida italiana, toque macio com resina aeróbica e botões de madrepérola natural.',
    tag: 'Edição Limitada 24 Peças',
    imageAccent: '#D2B48C',
    imageUrl: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=600&q=80',
    stockBySize: {
      P: { total: 4, reserved: 1, available: 3 },
      M: { total: 8, reserved: 3, available: 5 },
      G: { total: 8, reserved: 2, available: 6 },
      GG: { total: 4, reserved: 0, available: 4 },
      XG: { total: 0, reserved: 0, available: 0 }
    }
  },
  {
    id: 'prod-002',
    code: 'RAV-BLZ-04',
    title: 'Blazer Desestruturado Alfaiataria Chumbo',
    category: 'Blazers',
    price: 1290,
    costPrice: 510,
    material: 'Lã Fria Tropical 120s com Seda',
    color: 'Chumbo Melange',
    fitType: 'Alfaiataria Moderna',
    limitedEditionCount: 16,
    description: 'Sem forro rígido, corte napolitano que acompanha o corpo sem restringir movimentos. Ideal para o clima de Canoinhas.',
    tag: 'Exclusividade Ravi\'s',
    imageAccent: '#374151',
    imageUrl: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=600&q=80',
    stockBySize: {
      P: { total: 3, reserved: 1, available: 2 },
      M: { total: 6, reserved: 2, available: 4 },
      G: { total: 5, reserved: 2, available: 3 },
      GG: { total: 2, reserved: 1, available: 1 },
      XG: { total: 0, reserved: 0, available: 0 }
    }
  },
  {
    id: 'prod-003',
    code: 'RAV-CHN-02',
    title: 'Calça Chino Smart Stretch Fendi',
    category: 'Calças',
    price: 449,
    costPrice: 175,
    material: 'Algodão Acetinado com 4% Elastano',
    color: 'Fendi / Fumaça',
    fitType: 'Slim Fit',
    limitedEditionCount: 30,
    description: 'Cós anatômico invisível com bolso embutido para smartphone e costura alfaiatada dupla.',
    tag: 'Best-Seller Condicional',
    imageAccent: '#78716C',
    imageUrl: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=600&q=80',
    stockBySize: {
      '38': { total: 4, reserved: 0, available: 4 },
      '40': { total: 6, reserved: 2, available: 4 },
      '42': { total: 10, reserved: 4, available: 6 },
      '44': { total: 6, reserved: 2, available: 4 },
      '46': { total: 4, reserved: 1, available: 3 },
      '48': { total: 0, reserved: 0, available: 0 }
    }
  },
  {
    id: 'prod-004',
    code: 'RAV-POL-07',
    title: 'Polo Tricot Gola Camiseiro Nero',
    category: 'Polos & Malharia',
    price: 399,
    costPrice: 145,
    material: 'Algodão Pima Peruano com Viscose Nobre',
    color: 'Preto Ônix',
    fitType: 'Slim Fit',
    limitedEditionCount: 20,
    description: 'Trama em ponto milano estruturado. O caimento de uma camisa com o conforto do tricot premium.',
    tag: 'Cápsula Noturna',
    imageAccent: '#18181B',
    imageUrl: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&w=600&q=80',
    stockBySize: {
      P: { total: 4, reserved: 1, available: 3 },
      M: { total: 7, reserved: 2, available: 5 },
      G: { total: 6, reserved: 1, available: 5 },
      GG: { total: 3, reserved: 0, available: 3 },
      XG: { total: 0, reserved: 0, available: 0 }
    }
  },
  {
    id: 'prod-005',
    code: 'RAV-JQT-01',
    title: 'Jaqueta Bomber Camurça Conhaque',
    category: 'Blazers',
    price: 1650,
    costPrice: 680,
    material: 'Couro Pelica Camurçado Amaciado',
    color: 'Conhaque Queimado',
    fitType: 'Regular Fit',
    limitedEditionCount: 12,
    description: 'Peça de alta durabilidade com zíper metálico italiano YKK escovado e forro em cetim jacquard.',
    tag: 'Edição Ouro 12 Unidades',
    imageAccent: '#9A3412',
    imageUrl: 'https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?auto=format&fit=crop&w=600&q=80',
    stockBySize: {
      P: { total: 2, reserved: 0, available: 2 },
      M: { total: 4, reserved: 1, available: 3 },
      G: { total: 4, reserved: 2, available: 2 },
      GG: { total: 2, reserved: 0, available: 2 },
      XG: { total: 0, reserved: 0, available: 0 }
    }
  },
  {
    id: 'prod-006',
    code: 'RAV-LOA-03',
    title: 'Loafer Gravata Couro Pelica Mocca',
    category: 'Calçados',
    price: 780,
    costPrice: 320,
    material: 'Couro Bovino Integral Flor com Solado em Couro',
    color: 'Mocca Escuro',
    fitType: 'Regular Fit',
    limitedEditionCount: 18,
    description: 'Construção Goodyear welted flexível, palmilha de memória e vira italiana costurada à mão.',
    tag: 'Calçado de Alfaiataria',
    imageAccent: '#451A03',
    imageUrl: 'https://images.unsplash.com/photo-1533867617858-e7b97e060509?auto=format&fit=crop&w=600&q=80',
    stockBySize: {
      '39': { total: 2, reserved: 0, available: 2 },
      '40': { total: 4, reserved: 1, available: 3 },
      '41': { total: 6, reserved: 2, available: 4 },
      '42': { total: 4, reserved: 1, available: 3 },
      '43': { total: 2, reserved: 0, available: 2 },
      '44': { total: 0, reserved: 0, available: 0 }
    }
  },
  {
    id: 'prod-007',
    code: 'RAV-TSH-09',
    title: 'Camiseta Heavyweight Algodão Peruano Off-White',
    category: 'Polos & Malharia',
    price: 279,
    costPrice: 95,
    material: '100% Algodão Pima 240g/m²',
    color: 'Off-White Puro',
    fitType: 'Longline',
    limitedEditionCount: 35,
    description: 'Gola canelada de 2.5cm que não laceia, toque sedoso e gramatura encorpada que não marca o corpo.',
    tag: 'Essencial Premium',
    imageAccent: '#F5F5F4',
    imageUrl: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=600&q=80',
    stockBySize: {
      P: { total: 2, reserved: 1, available: 1 },
      M: { total: 3, reserved: 1, available: 2 },
      G: { total: 2, reserved: 0, available: 2 },
      GG: { total: 1, reserved: 0, available: 1 },
      XG: { total: 0, reserved: 0, available: 0 }
    }
  },
  {
    id: 'prod-008',
    code: 'RAV-CSL-01',
    title: 'Camiseta Slim Fit Algodão Egípcio Nero',
    category: 'Camiseta Slim',
    price: 320,
    costPrice: 110,
    material: '100% Algodão Egípcio Giza 88',
    color: 'Preto Ônix',
    fitType: 'Slim Fit',
    limitedEditionCount: 6,
    description: 'Toque sedoso com caimento milimetricamente ajustado no tórax e braços. Fotografia editorial no Centro Histórico de Canoinhas.',
    tag: 'Edição Limitada 6 Unidades',
    imageAccent: '#18181B',
    imageUrl: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=600&q=80',
    photoshootSource: 'Photoshoot do Pomelli - Editorial Inverno Canoinhas',
    stockBySize: {
      P: { total: 2, reserved: 1, available: 1 },
      M: { total: 3, reserved: 1, available: 2 },
      G: { total: 1, reserved: 0, available: 1 },
      GG: { total: 1, reserved: 0, available: 1 }
    }
  },
  {
    id: 'prod-009',
    code: 'RAV-CLG-02',
    title: 'Camiseta Longline Heavyweight Areia',
    category: 'Camiseta Longline',
    price: 340,
    costPrice: 120,
    material: 'Algodão Pima 260g/m² com Barra Curvada',
    color: 'Areia Natural',
    fitType: 'Longline',
    limitedEditionCount: 5,
    description: 'Barra arredondada alongada que não sobe ao sentar. Peça ícone para sobreposição com tricô ou jaqueta.',
    tag: 'Últimas Peças',
    imageAccent: '#D2B48C',
    imageUrl: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=600&q=80',
    photoshootSource: 'Photoshoot do Pomelli - Estúdio Canoinhas',
    stockBySize: {
      P: { total: 1, reserved: 0, available: 1 },
      M: { total: 2, reserved: 1, available: 1 },
      G: { total: 2, reserved: 0, available: 2 },
      GG: { total: 1, reserved: 0, available: 1 }
    }
  },
  {
    id: 'prod-010',
    code: 'RAV-TRC-05',
    title: 'Tricô Gola Alta Ponto Milano Chumbo',
    category: 'Tricô',
    price: 680,
    costPrice: 260,
    material: 'Lã Merino Extrafina com Cashmere Blend',
    color: 'Chumbo Melange',
    fitType: 'Slim Fit',
    limitedEditionCount: 4,
    description: 'Trama encorpada anti-pilling com gola alta estruturada. Peça pensada para o rigor do inverno no Planalto Norte catarinense.',
    tag: 'Exclusividade Ravi\'s 4 Unidades',
    imageAccent: '#374151',
    imageUrl: 'https://images.unsplash.com/photo-1614975058789-41316d0e2e9c?auto=format&fit=crop&w=600&q=80',
    photoshootSource: 'Photoshoot do Pomelli - Fazenda Marcílio Dias',
    stockBySize: {
      P: { total: 1, reserved: 0, available: 1 },
      M: { total: 2, reserved: 1, available: 1 },
      G: { total: 1, reserved: 0, available: 1 },
      GG: { total: 1, reserved: 0, available: 1 }
    }
  },
  {
    id: 'prod-011',
    code: 'RAV-SBT-01',
    title: 'Sobretudo Lã Batida Italiana Camel',
    category: 'Sobretudo',
    price: 2190,
    costPrice: 890,
    material: 'Lã Pura Toscana 550g/m² com Forro Cupro',
    color: 'Camel / Caramelo Nobre',
    fitType: 'Alfaiataria Moderna',
    limitedEditionCount: 3,
    description: 'Corte reto imponente com lapela ampla e botões em chifre genuíno. Apenas 3 unidades confeccionadas sob medida.',
    tag: 'Edição Rara 3 Unidades',
    imageAccent: '#C28B53',
    imageUrl: 'https://images.unsplash.com/photo-1544923246-77307dd654cb?auto=format&fit=crop&w=600&q=80',
    photoshootSource: 'Photoshoot do Pomelli - Locação Externa Canoinhas',
    stockBySize: {
      P: { total: 1, reserved: 0, available: 1 },
      M: { total: 1, reserved: 1, available: 0 }, // ÚLTIMA UNIDADE / RESERVADA!
      G: { total: 1, reserved: 0, available: 1 }
    }
  },
  {
    id: 'prod-012',
    code: 'RAV-CCH-08',
    title: 'Cachecol 100% Cashmere & Lã Merino Carvão',
    category: 'Cachecol',
    price: 490,
    costPrice: 180,
    material: '100% Cashmere com Acabamento Franjado Italiano',
    color: 'Carvão / Nero',
    fitType: 'Regular Fit',
    limitedEditionCount: 5,
    description: 'Toque ultramacio que não pinica no pescoço. Indispensável para composições com casacos e ternos em dias gelados.',
    tag: 'Acessório Nobre',
    imageAccent: '#1F2937',
    imageUrl: 'https://images.unsplash.com/photo-1608256246200-53e635b5b65f?auto=format&fit=crop&w=600&q=80',
    photoshootSource: 'Photoshoot do Pomelli - Estúdio Canoinhas',
    stockBySize: {
      'Único': { total: 3, reserved: 1, available: 2 }
    }
  },
  {
    id: 'prod-013',
    code: 'RAV-CAL-14',
    title: 'Calça Alfaiataria Sartorial Smart Stretch Nero',
    category: 'Calça',
    price: 520,
    costPrice: 195,
    material: 'Lã Tropical com 5% Elastano e Bolso Smartphone',
    color: 'Preto Ônix',
    fitType: 'Slim Fit',
    limitedEditionCount: 8,
    description: 'Costura inglesa dupla, cós com ajuste interno e caimento sem sobras de barra para usar com loafer ou tênis minimalista.',
    tag: 'Best-Seller Loja Física',
    imageAccent: '#111827',
    imageUrl: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?auto=format&fit=crop&w=600&q=80',
    photoshootSource: 'Photoshoot do Pomelli - Loja Canoinhas',
    stockBySize: {
      '38': { total: 1, reserved: 0, available: 1 },
      '40': { total: 2, reserved: 1, available: 1 },
      '42': { total: 3, reserved: 1, available: 2 },
      '44': { total: 2, reserved: 0, available: 2 }
    }
  }
];

export const INITIAL_CONDICIONAIS: CondicionalBox[] = [
  {
    id: 'cond-101',
    code: 'COND-2026-088',
    clientId: 'cli-001',
    clientName: 'Dr. Guilherme Schramm',
    clientPhone: '(47) 99824-1102',
    clientAddress: 'Rua Vidal Ramos, 412 - Apto 601, Centro - Canoinhas',
    curatorName: 'Mateus (Consultor Sênior)',
    status: 'EM_TESTE',
    totalValue: 3107,
    soldValue: 0,
    createdAt: '2026-10-09T14:30:00Z',
    sentAt: '2026-10-09T17:00:00Z',
    testDurationDays: 7,
    deadlineDate: '2026-10-16T17:00:00Z',
    daysRemaining: 4,
    hoursRemaining: 96,
    deliveryMethod: 'Entrega VIP Motorista Ravi\'s',
    notes: 'Mala cápsula: foco em linho areia e blazer chumbo para congresso médico na serra.',
    confirmationToken: 'conf-schramm-088',
    isConfirmedByClient: true,
    confirmedAt: '2026-10-09T17:15:00Z',
    items: [
      {
        id: 'ci-101-1',
        productId: 'prod-001',
        productCode: 'RAV-LNH-01',
        title: 'Camisa Linho Puro Riviera',
        category: 'Camisas',
        size: 'M',
        price: 589,
        material: '100% Linho Francês',
        color: 'Areia Natural',
        imageUrl: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=600&q=80',
        status: 'PENDENTE'
      },
      {
        id: 'ci-101-2',
        productId: 'prod-002',
        productCode: 'RAV-BLZ-04',
        title: 'Blazer Desestruturado Alfaiataria Chumbo',
        category: 'Blazers',
        size: 'M',
        price: 1290,
        material: 'Lã Fria Tropical 120s',
        color: 'Chumbo Melange',
        imageUrl: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=600&q=80',
        status: 'PENDENTE'
      },
      {
        id: 'ci-101-3',
        productId: 'prod-003',
        productCode: 'RAV-CHN-02',
        title: 'Calça Chino Smart Stretch Fendi',
        category: 'Calças',
        size: '42',
        price: 449,
        material: 'Algodão Acetinado com Elastano',
        color: 'Fendi',
        imageUrl: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=600&q=80',
        status: 'PENDENTE'
      },
      {
        id: 'ci-101-4',
        productId: 'prod-006',
        productCode: 'RAV-LOA-03',
        title: 'Loafer Gravata Couro Pelica Mocca',
        category: 'Calçados',
        size: '41',
        price: 780,
        material: 'Couro Bovino Integral Flor',
        color: 'Mocca Escuro',
        imageUrl: 'https://images.unsplash.com/photo-1533867617858-e7b97e060509?auto=format&fit=crop&w=600&q=80',
        status: 'PENDENTE'
      }
    ],
    whatsappLog: [
      {
        messageType: 'Notificação de Mala Enviada + Lookbook & Link Confirmação',
        sentAt: '2026-10-09T17:05:00Z',
        status: 'LIDO',
        previewSnippet: 'Sua mala exclusiva Ravi\'s chegou! Veja o lookbook e confirme o recebimento...'
      },
      {
        messageType: 'Lembrete Automático Dia 3 (Consultoria de Prova)',
        sentAt: '2026-10-12T10:00:00Z',
        status: 'ENTREGUE',
        previewSnippet: 'Olá Dr. Guilherme! Passando para ver como ficaram os caimentos do linho e do blazer...'
      }
    ],
    reminders: {
      day3Sent: true,
      day3SentAt: '2026-10-12T10:00:00Z',
      day6Sent: false,
      curatorAlertSent: false
    }
  },
  {
    id: 'cond-102',
    code: 'COND-2026-089',
    clientId: 'cli-002',
    clientName: 'Rodrigo Silveira',
    clientPhone: '(47) 99742-8833',
    clientAddress: 'Rodovia SC-477, Km 14 - Fazenda Boa Vista, Marcílio Dias',
    curatorName: 'Mateus (Consultor Sênior)',
    status: 'ENVIADO',
    totalValue: 3088,
    soldValue: 0,
    createdAt: '2026-10-12T08:30:00Z',
    sentAt: '2026-10-12T10:30:00Z',
    testDurationDays: 7,
    deadlineDate: '2026-10-19T10:30:00Z',
    daysRemaining: 7,
    hoursRemaining: 168,
    deliveryMethod: 'Entrega VIP Motorista Ravi\'s',
    notes: 'Rodrigo pediu peças quentes e elegantes para viagem técnica ao Paraná. Jaqueta conhaque inclusa.',
    confirmationToken: 'conf-silveira-089',
    isConfirmedByClient: false,
    items: [
      {
        id: 'ci-102-1',
        productId: 'prod-005',
        productCode: 'RAV-JQT-01',
        title: 'Jaqueta Bomber Camurça Conhaque',
        category: 'Blazers',
        size: 'G',
        price: 1650,
        imageUrl: 'https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?auto=format&fit=crop&w=600&q=80',
        status: 'PENDENTE'
      },
      {
        id: 'ci-102-2',
        productId: 'prod-001',
        productCode: 'RAV-LNH-01',
        title: 'Camisa Linho Puro Riviera',
        category: 'Camisas',
        size: 'G',
        price: 589,
        imageUrl: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=600&q=80',
        status: 'PENDENTE'
      },
      {
        id: 'ci-102-3',
        productId: 'prod-003',
        productCode: 'RAV-CHN-02',
        title: 'Calça Chino Smart Stretch Fendi',
        category: 'Calças',
        size: '44',
        price: 449,
        imageUrl: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=600&q=80',
        status: 'PENDENTE'
      },
      {
        id: 'ci-102-4',
        productId: 'prod-004',
        productCode: 'RAV-POL-07',
        title: 'Polo Tricot Gola Camiseiro Nero',
        category: 'Polos & Malharia',
        size: 'G',
        price: 399,
        imageUrl: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&w=600&q=80',
        status: 'PENDENTE'
      }
    ],
    whatsappLog: [
      {
        messageType: 'Notificação de Mala Despachada com Motorista Ravi\'s',
        sentAt: '2026-10-12T10:35:00Z',
        status: 'LIDO',
        previewSnippet: 'Motorista Ravi\'s a caminho com a sua seleção de inverno exclusiva...'
      }
    ],
    reminders: {
      day3Sent: false,
      day6Sent: false,
      curatorAlertSent: false
    }
  },
  {
    id: 'cond-103',
    code: 'COND-2026-090',
    clientId: 'cli-003',
    clientName: 'Bruno Becker',
    clientPhone: '(47) 99185-3344',
    clientAddress: 'Rua Getúlio Vargas, 185 - Sala 302, Centro - Canoinhas',
    curatorName: 'Juliana (Consultora VIP)',
    status: 'AGENDADO',
    scheduledForDate: '2026-10-13T14:00:00Z',
    totalValue: 2519,
    soldValue: 0,
    createdAt: '2026-10-12T09:00:00Z',
    testDurationDays: 7,
    deadlineDate: '2026-10-20T18:00:00Z',
    daysRemaining: 7,
    hoursRemaining: 168,
    deliveryMethod: 'Retirada na Loja Canoinhas',
    notes: 'Mala agendada para retirada amanhã: peças para audiência solene no TJSC.',
    confirmationToken: 'conf-becker-090',
    isConfirmedByClient: true,
    items: [
      {
        id: 'ci-103-1',
        productId: 'prod-002',
        productCode: 'RAV-BLZ-04',
        title: 'Blazer Desestruturado Alfaiataria Chumbo',
        category: 'Blazers',
        size: 'M',
        price: 1290,
        imageUrl: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=600&q=80',
        status: 'PENDENTE'
      },
      {
        id: 'ci-103-2',
        productId: 'prod-006',
        productCode: 'RAV-LOA-03',
        title: 'Loafer Gravata Couro Pelica Mocca',
        category: 'Calçados',
        size: '40',
        price: 780,
        imageUrl: 'https://images.unsplash.com/photo-1533867617858-e7b97e060509?auto=format&fit=crop&w=600&q=80',
        status: 'PENDENTE'
      },
      {
        id: 'ci-103-3',
        productId: 'prod-003',
        productCode: 'RAV-CHN-02',
        title: 'Calça Chino Smart Stretch Fendi',
        category: 'Calças',
        size: '40',
        price: 449,
        imageUrl: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=600&q=80',
        status: 'PENDENTE'
      }
    ],
    whatsappLog: [
      {
        messageType: 'Agendamento Confirmado: Retirada na Loja Canoinhas',
        sentAt: '2026-10-12T09:15:00Z',
        status: 'LIDO',
        previewSnippet: 'Sua seleção para audiência está separada na loja para retirada amanhã às 14h!'
      }
    ],
    reminders: {
      day3Sent: false,
      day6Sent: false,
      curatorAlertSent: false
    }
  },
  {
    id: 'cond-105',
    code: 'COND-2026-091',
    clientId: 'cli-005',
    clientName: 'Tiago Zaniolo',
    clientPhone: '(47) 99612-9900',
    clientAddress: 'Rua Frei Menandro Kamps, 1200, Industrial - Canoinhas',
    curatorName: 'Mateus (Consultor Sênior)',
    status: 'RASCUNHO',
    totalValue: 1267,
    soldValue: 0,
    createdAt: '2026-10-12T11:00:00Z',
    testDurationDays: 7,
    deadlineDate: '2026-10-19T11:00:00Z',
    daysRemaining: 7,
    hoursRemaining: 168,
    deliveryMethod: 'Entrega VIP Motorista Ravi\'s',
    notes: 'Curador Mateus selecionando camisas GG e calças 46 com elastano para novo cliente industrial.',
    confirmationToken: 'conf-zaniolo-091',
    isConfirmedByClient: false,
    items: [
      {
        id: 'ci-105-1',
        productId: 'prod-001',
        productCode: 'RAV-LNH-01',
        title: 'Camisa Linho Puro Riviera',
        category: 'Camisas',
        size: 'GG',
        price: 589,
        imageUrl: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=600&q=80',
        status: 'PENDENTE'
      },
      {
        id: 'ci-105-2',
        productId: 'prod-007',
        productCode: 'RAV-TSH-09',
        title: 'Camiseta Heavyweight Algodão Peruano Off-White',
        category: 'Polos & Malharia',
        size: 'GG',
        price: 279,
        imageUrl: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=600&q=80',
        status: 'PENDENTE'
      },
      {
        id: 'ci-105-3',
        productId: 'prod-004',
        productCode: 'RAV-POL-07',
        title: 'Polo Tricot Gola Camiseiro Nero',
        category: 'Polos & Malharia',
        size: 'GG',
        price: 399,
        imageUrl: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&w=600&q=80',
        status: 'PENDENTE'
      }
    ],
    whatsappLog: [],
    reminders: {
      day3Sent: false,
      day6Sent: false,
      curatorAlertSent: false
    }
  },
  {
    id: 'cond-104',
    code: 'COND-2026-087',
    clientId: 'cli-004',
    clientName: 'Lucas Werlang',
    clientPhone: '(47) 98841-5511',
    clientAddress: 'Av. Rigesa, 890 - Casa 12, Três Barras',
    curatorName: 'Juliana (Consultora VIP)',
    status: 'FINALIZADO',
    finalOutcome: 'COMPRADO_PARCIAL',
    totalValue: 1267,
    soldValue: 978,
    createdAt: '2026-10-02T11:00:00Z',
    sentAt: '2026-10-02T15:00:00Z',
    testDurationDays: 7,
    deadlineDate: '2026-10-09T15:00:00Z',
    daysRemaining: 0,
    hoursRemaining: 0,
    deliveryMethod: 'Sedex Express Planalto Norte',
    notes: 'Cliente comprou Camiseta Heavyweight Off-White e Polo Tricot Nero. Devolveu a Camisa de Linho porque já possuía similar.',
    confirmationToken: 'conf-werlang-087',
    isConfirmedByClient: true,
    items: [
      {
        id: 'ci-104-1',
        productId: 'prod-007',
        productCode: 'RAV-TSH-09',
        title: 'Camiseta Heavyweight Algodão Peruano Off-White',
        category: 'Polos & Malharia',
        size: 'P',
        price: 279,
        imageUrl: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=600&q=80',
        status: 'COMPRADA'
      },
      {
        id: 'ci-104-2',
        productId: 'prod-004',
        productCode: 'RAV-POL-07',
        title: 'Polo Tricot Gola Camiseiro Nero',
        category: 'Polos & Malharia',
        size: 'P',
        price: 399,
        imageUrl: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&w=600&q=80',
        status: 'COMPRADA'
      },
      {
        id: 'ci-104-3',
        productId: 'prod-001',
        productCode: 'RAV-LNH-01',
        title: 'Camisa Linho Puro Riviera',
        category: 'Camisas',
        size: 'P',
        price: 589,
        imageUrl: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=600&q=80',
        status: 'DEVOLVIDA',
        returnReasonCategory: 'ESTILO',
        returnReason: 'Já possui similar no closet'
      }
    ],
    whatsappLog: [
      {
        messageType: 'Fechamento Pix Realizado com Sucesso (R$ 678,00)',
        sentAt: '2026-10-09T14:30:00Z',
        status: 'LIDO',
        previewSnippet: 'Pagamento confirmado! O saldo de peças já foi recolhido pelo motorista.'
      }
    ],
    reminders: {
      day3Sent: true,
      day6Sent: true,
      curatorAlertSent: true
    }
  }
];

export const PREDICTIVE_INTELLIGENCE_DATA: PredictiveConversionItem[] = [
  {
    id: 'pred-1',
    productId: 'prod-001',
    productTitle: 'Camisa Linho Puro Riviera',
    productCategory: 'Camisas',
    imageUrl: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=600&q=80',
    clientProfileType: 'Médicos & Pecuaristas (40+ anos, Caimento Slim/Regular, Paleta Terrosa)',
    conversionRate: 95.2,
    totalSent: 28,
    totalKept: 26,
    primaryReturnReason: 'Tamanho (Ficou apertado no peito em clientes acima de 90kg)',
    recommendationScore: 98,
    rationale: 'Peça de maior conversão para o público tradicional de Canoinhas. Quando enviada com Blazer Chumbo ou Chino Fendi, converte o conjunto completo em 87% das malas.'
  },
  {
    id: 'pred-2',
    productId: 'prod-003',
    productTitle: 'Calça Chino Smart Stretch Fendi',
    productCategory: 'Calças',
    imageUrl: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=600&q=80',
    clientProfileType: 'Empresários do Agronegócio & Indústria (Uso diário campo/cidade)',
    conversionRate: 91.4,
    totalSent: 35,
    totalKept: 32,
    primaryReturnReason: 'Estilo (Cliente preferia jeans escuro tradicional)',
    recommendationScore: 95,
    rationale: 'O elastano de 4% e cós anatômico eliminam a principal objeção masculina de desconforto. Menor taxa de devolução de toda a loja.'
  },
  {
    id: 'pred-3',
    productId: 'prod-002',
    productTitle: 'Blazer Desestruturado Alfaiataria Chumbo',
    productCategory: 'Blazers',
    imageUrl: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=600&q=80',
    clientProfileType: 'Advogados & Executivos Financeiros (Eventos formais e tribunais)',
    conversionRate: 88.9,
    totalSent: 21,
    totalKept: 19,
    primaryReturnReason: 'Tamanho (Ajuste fino de comprimento de manga)',
    recommendationScore: 92,
    rationale: 'Corte napolitano sem forro rígido agrada homens que odeiam terno tradicional. Ticket alto com margem excepcional.'
  },
  {
    id: 'pred-4',
    productId: 'prod-007',
    productTitle: 'Camiseta Heavyweight Algodão Peruano Off-White',
    productCategory: 'Polos & Malharia',
    imageUrl: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=600&q=80',
    clientProfileType: 'Arquitetos, Designers & Jovens Executivos (Longline, Minimalista)',
    conversionRate: 93.8,
    totalSent: 32,
    totalKept: 30,
    primaryReturnReason: 'Preço (Comparação inicial com camisetas comuns antes de tocar no Pima)',
    recommendationScore: 94,
    rationale: 'Porta de entrada com taxa de retenção altíssima. 72% dos clientes que ficam com esta peça pedem nova mala em 45 dias.'
  },
  {
    id: 'pred-5',
    productId: 'prod-006',
    productTitle: 'Loafer Gravata Couro Pelica Mocca',
    productCategory: 'Calçados',
    imageUrl: 'https://images.unsplash.com/photo-1533867617858-e7b97e060509?auto=format&fit=crop&w=600&q=80',
    clientProfileType: 'Clientes VIP Platinum com LTV > R$ 10.000',
    conversionRate: 82.5,
    totalSent: 16,
    totalKept: 13,
    primaryReturnReason: 'Tamanho (Calce justo no peito do pé)',
    recommendationScore: 86,
    rationale: 'Converte prioritariamente quando o cliente já possui calça chino ou bermuda de linho no closet.'
  },
  {
    id: 'pred-6',
    productId: 'prod-005',
    productTitle: 'Jaqueta Bomber Camurça Conhaque',
    productCategory: 'Blazers',
    imageUrl: 'https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?auto=format&fit=crop&w=600&q=80',
    clientProfileType: 'Grandes Produtores e Clientes de Inverno na Serra',
    conversionRate: 78.6,
    totalSent: 14,
    totalKept: 11,
    primaryReturnReason: 'Preço (R$ 1.650 avaliado contra prioridades do mês)',
    recommendationScore: 81,
    rationale: 'Maior agregador de ticket médio. Converte 92% quando o cliente tem viagens agendadas para Gramado, Pomerode ou Curitiba.'
  }
];

export const INITIAL_MESSAGES: UnifiedMessage[] = [
  {
    id: 'msg-001',
    channel: 'WHATSAPP',
    clientId: 'cli-001',
    clientName: 'Dr. Guilherme Schramm',
    clientPhone: '(47) 99824-1102',
    sender: 'CLIENT',
    content: 'Mateus, recebi a mala aqui no consultório! A camisa de linho areia ficou perfeita no ombro. Vou provar o blazer com calma hoje à noite em casa.',
    timestamp: '14:28',
    read: true,
    linkedCondicionalId: 'cond-101'
  },
  {
    id: 'msg-002',
    channel: 'WHATSAPP',
    clientId: 'cli-001',
    clientName: 'Dr. Guilherme Schramm',
    clientPhone: '(47) 99824-1102',
    sender: 'CURATOR',
    content: 'Excelente, Dr. Guilherme! O caimento napolitano desse blazer fica impecável sem forro para o clima de Canoinhas. Fique à vontade para testar até amanhã!',
    timestamp: '14:32',
    read: true,
    linkedCondicionalId: 'cond-101'
  },
  {
    id: 'msg-003',
    channel: 'WHATSAPP',
    clientId: 'cli-002',
    clientName: 'Rodrigo Silveira',
    clientPhone: '(47) 99742-8833',
    sender: 'CLIENT',
    content: 'Boa tarde, pessoal da Ravi\'s! O motorista já entregou a caixa aqui na sede da fazenda. A jaqueta conhaque é sensacional.',
    timestamp: '15:10',
    read: false,
    linkedCondicionalId: 'cond-102'
  },
  {
    id: 'msg-004',
    channel: 'INSTAGRAM',
    clientId: 'cli-004',
    clientName: 'Lucas Werlang',
    clientPhone: '(47) 98841-5511',
    sender: 'CLIENT',
    content: 'Vi no feed a nova coleção minimalista em tons de concreto. Tem alguma peça P disponível para incluir no meu próximo condicional?',
    timestamp: 'Ontem',
    read: true
  },
  {
    id: 'msg-005',
    channel: 'WHATSAPP',
    clientId: 'cli-005',
    clientName: 'Tiago Zaniolo',
    clientPhone: '(47) 99612-9900',
    sender: 'CLIENT',
    content: 'Olá! O Guilherme me falou muito bem do serviço de condicional de vocês. Como faço para receber uma mala de teste com camisas GG?',
    timestamp: '11:45',
    read: false
  }
];

export const INITIAL_ANALYTICS: AnalyticsSummary = {
  condicionalConversionRate: 72.8,
  totalInTransitValue: 24714,
  activeCondicionaisCount: 3,
  monthlyRevenue: {
    condicional: 68400,
    store: 42100,
    ecommerce: 19800
  },
  returnReasonsBreakdown: [
    { reason: 'Tamanho apertado/folgado no ombro', percentage: 42, count: 18 },
    { reason: 'Já possui peça com tom similar no closet', percentage: 28, count: 12 },
    { reason: 'Estilo/Ocasião não priorizado agora', percentage: 18, count: 8 },
    { reason: 'Sensibilidade a preço', percentage: 12, count: 5 }
  ],
  topSelectedItems: [
    { title: 'Camisa Linho Puro Riviera', selections: 28, conversionRate: 85.7 },
    { title: 'Blazer Desestruturado Alfaiataria', selections: 19, conversionRate: 78.9 },
    { title: 'Calça Chino Smart Stretch Fendi', selections: 34, conversionRate: 88.2 },
    { title: 'Loafer Gravata Pelica Mocca', selections: 14, conversionRate: 71.4 },
    { title: 'Polo Tricot Gola Camiseiro Nero', selections: 22, conversionRate: 68.2 }
  ],
  curatorPerformance: [
    { name: 'Mateus (Consultor Sênior)', boxesSent: 26, conversionRate: 80.7, revenue: 58900 },
    { name: 'Juliana (Consultora VIP)', boxesSent: 18, conversionRate: 72.2, revenue: 39400 },
    { name: 'Ravi (Curador-Chefe / Especialista)', boxesSent: 12, conversionRate: 91.6, revenue: 32000 }
  ]
};

export const POMELI_PHOTOSHOOT_BATCH: Product[] = [
  {
    id: 'prod-pom-01',
    code: 'POM-TRC-01',
    title: 'Tricô Ponto Trançado Irlandês Caramelo',
    category: 'Tricô',
    price: 740,
    costPrice: 280,
    material: 'Lã Merino 100% com Ponto Cable Knit',
    color: 'Caramelo Tostado',
    fitType: 'Regular Fit',
    limitedEditionCount: 3,
    description: 'Ensaio fotográfico Pomelli realizado no casarão histórico de Canoinhas. Trama texturizada pesada para frio intenso.',
    tag: 'Photoshoot Pomelli Exclusivo',
    imageAccent: '#92400E',
    imageUrl: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=600&q=80',
    photoshootSource: 'Photoshoot do Pomelli - Coleção Inverno 2026',
    stockBySize: {
      P: { total: 1, reserved: 0, available: 1 },
      M: { total: 1, reserved: 0, available: 1 },
      G: { total: 1, reserved: 0, available: 1 }
    }
  },
  {
    id: 'prod-pom-02',
    code: 'POM-SBT-02',
    title: 'Sobretudo Estruturado Chumbo Melange',
    category: 'Sobretudo',
    price: 2490,
    costPrice: 950,
    material: 'Lã Batida 600g/m² com Seda e Forro Jacquard',
    color: 'Chumbo Melange',
    fitType: 'Alfaiataria Moderna',
    limitedEditionCount: 2,
    description: 'Apenas 2 peças em todo o Brasil. Ensaio nas brumas matinais de Marcílio Dias fotografado pela equipe Pomelli.',
    tag: 'Raridade 2 Unidades',
    imageAccent: '#374151',
    imageUrl: 'https://images.unsplash.com/photo-1544923246-77307dd654cb?auto=format&fit=crop&w=600&q=80',
    photoshootSource: 'Photoshoot do Pomelli - Coleção Inverno 2026',
    stockBySize: {
      M: { total: 1, reserved: 0, available: 1 },
      G: { total: 1, reserved: 0, available: 1 }
    }
  },
  {
    id: 'prod-pom-03',
    code: 'POM-CCH-03',
    title: 'Cachecol Jacquard Geométrico Nero & Areia',
    category: 'Cachecol',
    price: 460,
    costPrice: 160,
    material: 'Cashmere & Seda Pura com Franjas Torcidas',
    color: 'Nero / Areia',
    fitType: 'Regular Fit',
    limitedEditionCount: 3,
    description: 'Peça de destaque no editorial de moda masculina da Ravi\'s. Combina perfeitamente com sobretudo ou jaqueta de camurça.',
    tag: 'Acessório Edição Pomelli',
    imageAccent: '#27272A',
    imageUrl: 'https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?auto=format&fit=crop&w=600&q=80',
    photoshootSource: 'Photoshoot do Pomelli - Coleção Inverno 2026',
    stockBySize: {
      'Único': { total: 3, reserved: 0, available: 3 }
    }
  }
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'ord-101',
    code: 'PED-2026-101',
    channel: 'ONLINE',
    clientId: 'cli-001',
    clientName: 'Dr. Guilherme Schramm',
    clientPhone: '(47) 99824-1102',
    clientCity: 'Canoinhas',
    curatorId: 'cur-01',
    curatorName: 'Mateus (Consultor Sênior)',
    commissionRate: 0.05,
    commissionValue: 50.00,
    items: [
      {
        id: 'oi-101-1',
        productId: 'prod-010',
        productCode: 'RAV-TRC-05',
        title: 'Tricô Gola Alta Ponto Milano Chumbo',
        category: 'Tricô',
        size: 'M',
        color: 'Chumbo Melange',
        quantity: 1,
        unitPrice: 680,
        costPrice: 260,
        subtotal: 680,
        imageUrl: 'https://images.unsplash.com/photo-1614975058789-41316d0e2e9c?auto=format&fit=crop&w=600&q=80'
      },
      {
        id: 'oi-101-2',
        productId: 'prod-008',
        productCode: 'RAV-CSL-01',
        title: 'Camiseta Slim Fit Algodão Egípcio Nero',
        category: 'Camiseta Slim',
        size: 'M',
        color: 'Preto Ônix',
        quantity: 1,
        unitPrice: 320,
        costPrice: 110,
        subtotal: 320,
        imageUrl: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=600&q=80'
      }
    ],
    subtotal: 1000,
    discount: 0,
    shippingFee: 0,
    totalValue: 1000,
    grossProfit: 630,
    paymentMethod: 'MERCADO_PAGO_LINK',
    paymentStatus: 'PAGO',
    orderStatus: 'ENTREGUE',
    whatsappPaymentLink: 'https://mpago.la/ravis/ped-2026-101',
    createdAt: '2026-10-10T14:20:00Z',
    paidAt: '2026-10-10T14:28:00Z',
    deliveredAt: '2026-10-11T11:00:00Z',
    notes: 'Cliente pagou pelo link do Mercado Pago recebido no WhatsApp. Entrega motorista Ravi\'s.'
  },
  {
    id: 'ord-102',
    code: 'PED-2026-102',
    channel: 'PDV_CANOINHAS',
    clientId: 'cli-002',
    clientName: 'Rodrigo Silveira',
    clientPhone: '(47) 99742-8833',
    clientCity: 'Canoinhas',
    curatorId: 'cur-01',
    curatorName: 'Mateus (Consultor Sênior)',
    commissionRate: 0.06,
    commissionValue: 162.60,
    items: [
      {
        id: 'oi-102-1',
        productId: 'prod-011',
        productCode: 'RAV-SBT-01',
        title: 'Sobretudo Lã Batida Italiana Camel',
        category: 'Sobretudo',
        size: 'G',
        color: 'Camel Nobre',
        quantity: 1,
        unitPrice: 2190,
        costPrice: 890,
        subtotal: 2190,
        imageUrl: 'https://images.unsplash.com/photo-1544923246-77307dd654cb?auto=format&fit=crop&w=600&q=80'
      },
      {
        id: 'oi-102-2',
        productId: 'prod-013',
        productCode: 'RAV-CAL-14',
        title: 'Calça Alfaiataria Sartorial Smart Stretch Nero',
        category: 'Calça',
        size: '44',
        color: 'Preto Ônix',
        quantity: 1,
        unitPrice: 520,
        costPrice: 195,
        subtotal: 520,
        imageUrl: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?auto=format&fit=crop&w=600&q=80'
      }
    ],
    subtotal: 2710,
    discount: 0,
    shippingFee: 0,
    totalValue: 2710,
    grossProfit: 1625,
    paymentMethod: 'CARTAO_MAQUININHA_PDV',
    paymentStatus: 'PAGO',
    orderStatus: 'ENTREGUE',
    createdAt: '2026-10-11T16:45:00Z',
    paidAt: '2026-10-11T16:50:00Z',
    deliveredAt: '2026-10-11T16:55:00Z',
    notes: 'Venda presencial na loja do Centro. Atendente Mateus auxiliou na prova e ajuste de barra.'
  },
  {
    id: 'ord-103',
    code: 'PED-2026-103',
    channel: 'ONLINE',
    clientId: 'cli-004',
    clientName: 'Lucas Werlang',
    clientPhone: '(47) 98841-5511',
    clientCity: 'Três Barras',
    curatorId: 'cur-02',
    curatorName: 'Juliana (Consultora VIP)',
    commissionRate: 0.05,
    commissionValue: 41.50,
    items: [
      {
        id: 'oi-103-1',
        productId: 'prod-009',
        productCode: 'RAV-CLG-02',
        title: 'Camiseta Longline Heavyweight Areia',
        category: 'Camiseta Longline',
        size: 'M',
        color: 'Areia Natural',
        quantity: 1,
        unitPrice: 340,
        costPrice: 120,
        subtotal: 340,
        imageUrl: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=600&q=80'
      },
      {
        id: 'oi-103-2',
        productId: 'prod-012',
        productCode: 'RAV-CCH-08',
        title: 'Cachecol 100% Cashmere & Lã Merino Carvão',
        category: 'Cachecol',
        size: 'Único',
        color: 'Carvão / Nero',
        quantity: 1,
        unitPrice: 490,
        costPrice: 180,
        subtotal: 490,
        imageUrl: 'https://images.unsplash.com/photo-1608256246200-53e635b5b65f?auto=format&fit=crop&w=600&q=80'
      }
    ],
    subtotal: 830,
    discount: 0,
    shippingFee: 0,
    totalValue: 830,
    grossProfit: 530,
    paymentMethod: 'STRIPE_CARD',
    paymentStatus: 'PAGO',
    orderStatus: 'ENVIADO',
    whatsappPaymentLink: 'https://buy.stripe.com/ravis_ped-103',
    createdAt: '2026-10-12T09:15:00Z',
    paidAt: '2026-10-12T09:25:00Z',
    notes: 'Pedido online enviado via Sedex Express para Três Barras.'
  },
  {
    id: 'ord-104',
    code: 'PED-2026-104',
    channel: 'ONLINE',
    clientId: 'cli-005',
    clientName: 'Tiago Zaniolo',
    clientPhone: '(47) 99612-9900',
    clientCity: 'Canoinhas',
    curatorId: 'cur-01',
    curatorName: 'Mateus (Consultor Sênior)',
    commissionRate: 0.05,
    commissionValue: 34.00,
    items: [
      {
        id: 'oi-104-1',
        productId: 'prod-010',
        productCode: 'RAV-TRC-05',
        title: 'Tricô Gola Alta Ponto Milano Chumbo',
        category: 'Tricô',
        size: 'GG',
        color: 'Chumbo Melange',
        quantity: 1,
        unitPrice: 680,
        costPrice: 260,
        subtotal: 680,
        imageUrl: 'https://images.unsplash.com/photo-1614975058789-41316d0e2e9c?auto=format&fit=crop&w=600&q=80'
      }
    ],
    subtotal: 680,
    discount: 0,
    shippingFee: 0,
    totalValue: 680,
    grossProfit: 420,
    paymentMethod: 'MERCADO_PAGO_LINK',
    paymentStatus: 'PENDENTE',
    orderStatus: 'PENDENTE',
    whatsappPaymentLink: 'https://mpago.la/ravis/ped-2026-104-zaniolo',
    createdAt: '2026-10-12T11:30:00Z',
    notes: 'Link de pagamento Mercado Pago gerado e enviado via WhatsApp pelo curador Mateus.'
  }
];

export const INITIAL_WISHLISTS: WishlistItem[] = [
  {
    id: 'wish-01',
    clientId: 'cli-001',
    clientName: 'Dr. Guilherme Schramm',
    clientPhone: '(47) 99824-1102',
    clientInstagram: '@drguilhermeschramm',
    categoryRequested: 'Sobretudo',
    preferredColor: 'Camel / Caramelo',
    preferredSize: 'M',
    maxBudget: 2500,
    notes: 'Dr. Guilherme aguarda sobretudo de lã italiana para congresso em Gramado/RS. Quer peça clássica sem ombreiras rígidas.',
    status: 'PECA_CHEGOU_AVISAR',
    matchedProductId: 'prod-011',
    matchedProductTitle: 'Sobretudo Lã Batida Italiana Camel',
    matchedProductImage: 'https://images.unsplash.com/photo-1544923246-77307dd654cb?auto=format&fit=crop&w=600&q=80',
    createdAt: '2026-09-20T10:00:00Z',
    notifiedAt: '2026-10-12T10:30:00Z'
  },
  {
    id: 'wish-02',
    clientId: 'cli-002',
    clientName: 'Rodrigo Silveira',
    clientPhone: '(47) 99742-8833',
    clientInstagram: '@rodrigo.silveira_agro',
    categoryRequested: 'Cachecol',
    preferredColor: 'Carvão / Nero',
    preferredSize: 'Único',
    maxBudget: 600,
    notes: 'Quer cachecol macio de cashmere que não irrite a pele, para usar em dias de geada no campo.',
    status: 'PECA_CHEGOU_AVISAR',
    matchedProductId: 'prod-012',
    matchedProductTitle: 'Cachecol 100% Cashmere & Lã Merino Carvão',
    matchedProductImage: 'https://images.unsplash.com/photo-1608256246200-53e635b5b65f?auto=format&fit=crop&w=600&q=80',
    createdAt: '2026-09-28T14:15:00Z',
    notifiedAt: '2026-10-12T09:00:00Z'
  },
  {
    id: 'wish-03',
    clientId: 'cli-003',
    clientName: 'Bruno Becker',
    clientPhone: '(47) 99185-3344',
    clientInstagram: '@brunobecker.adv',
    categoryRequested: 'Camiseta Slim',
    preferredColor: 'Preto Ônix',
    preferredSize: 'M',
    maxBudget: 350,
    notes: 'Camiseta slim preta de algodão egípcio para usar sob blazer desestruturado em sextas-feiras informais.',
    status: 'PECA_CHEGOU_AVISAR',
    matchedProductId: 'prod-008',
    matchedProductTitle: 'Camiseta Slim Fit Algodão Egípcio Nero',
    matchedProductImage: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=600&q=80',
    createdAt: '2026-10-01T11:00:00Z'
  },
  {
    id: 'wish-04',
    clientId: 'cli-004',
    clientName: 'Lucas Werlang',
    clientPhone: '(47) 98841-5511',
    categoryRequested: 'Tricô',
    preferredColor: 'Terracota / Pinhão',
    preferredSize: 'G',
    maxBudget: 750,
    notes: 'Tricô pesado com textura rústica elegante para passeios de fim de semana.',
    status: 'AGUARDANDO_CURADORIA',
    createdAt: '2026-10-08T16:00:00Z'
  }
];
