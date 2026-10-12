// @ts-nocheck
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando Seed do Banco PostgreSQL - Ravi\'s CRM...');

  // 1. Usuários e Equipe
  const raviAdmin = await prisma.user.upsert({
    where: { email: 'ravi@ravispremium.com.br' },
    update: {},
    create: {
      id: 'c0000000-0000-0000-0000-000000000001',
      name: 'Ravi Pomelli',
      email: 'ravi@ravispremium.com.br',
      phone: '(47) 99800-0001',
      role: 'ADMIN',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
      commissionRate: 0.0000,
    },
  });

  const mateusCurador = await prisma.user.upsert({
    where: { email: 'mateus@ravispremium.com.br' },
    update: {},
    create: {
      id: 'c0000000-0000-0000-0000-000000000002',
      name: 'Mateus Silva (Consultor Sênior)',
      email: 'mateus@ravispremium.com.br',
      phone: '(47) 99824-0002',
      role: 'CURADOR',
      avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
      commissionRate: 0.0500,
    },
  });

  const julianaAtendente = await prisma.user.upsert({
    where: { email: 'juliana@ravispremium.com.br' },
    update: {},
    create: {
      id: 'c0000000-0000-0000-0000-000000000003',
      name: 'Juliana Ramos (Atendente PDV)',
      email: 'juliana@ravispremium.com.br',
      phone: '(47) 99824-0003',
      role: 'ATENDENTE',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      commissionRate: 0.0300,
    },
  });

  console.log('✅ Usuários criados (ADMIN, CURADOR, ATENDENTE)');

  // 2. Tags de Segmentação
  const tagLinho = await prisma.tag.upsert({
    where: { name: 'Amante de Linho' },
    update: {},
    create: {
      id: 't0000000-0000-0000-0000-000000000001',
      name: 'Amante de Linho',
      category: 'ESTILO',
      color: '#D4AF37',
      description: 'Clientes com preferência comprovada por linho puro',
    },
  });

  const tagMedico = await prisma.tag.upsert({
    where: { name: 'VIP Médico Canoinhas' },
    update: {},
    create: {
      id: 't0000000-0000-0000-0000-000000000002',
      name: 'VIP Médico Canoinhas',
      category: 'VIP',
      color: '#E5C158',
      description: 'Médicos e cirurgiões dos hospitais Santa Cruz e Unimed',
    },
  });

  const tagAgro = await prisma.tag.upsert({
    where: { name: 'Produtor Rural Planalto' },
    update: {},
    create: {
      id: 't0000000-0000-0000-0000-000000000003',
      name: 'Produtor Rural Planalto',
      category: 'REGIAO',
      color: '#4ADE80',
      description: 'Produtores de grãos e silvicultura do Planalto Norte SC',
    },
  });

  // 3. Clientes (3 Clientes Reais do CRM)
  const drGuilherme = await prisma.customer.upsert({
    where: { phone: '+5547998241102' },
    update: {},
    create: {
      id: 'a0000000-0000-0000-0000-000000000001',
      name: 'Dr. Guilherme Schramm',
      phone: '+5547998241102',
      email: 'guilherme.schramm@cardio.med.br',
      instagram: '@drguilhermeschramm',
      city: 'Canoinhas',
      neighborhood: 'Centro',
      address: 'Rua Vidal Ramos, 412 - Apto 601',
      tier: 'VIP Platinum',
      lgpdConsent: 'OPT_IN',
      birthDate: new Date('1984-11-20'),
      lastPurchaseDate: new Date('2026-09-12'),
      curatorId: mateusCurador.id,
      styleProfile: {
        create: {
          id: 's0000000-0000-0000-0000-000000000001',
          shirtSize: 'M',
          pantsSize: '42',
          shoesSize: '41',
          fitPreference: 'SLIM_FIT',
          heightCm: 182,
          weightKg: 79,
          colorPalette: ['Tons Terrosos', 'Azul Marinho', 'Off-white', 'Areia Natural'],
          favoriteCategories: ['Camisas de Linho', 'Blazers Desestruturados', 'Calça Chino Tech'],
          avoidItems: ['Estampas grandes', 'Golas V profundas', 'Cores fluorescentes'],
          lifestyle: 'Médico Cardiologista no Hospital Santa Cruz; jantares em Pomerode.',
          profession: 'Médico Cardiologista & Pecuarista',
          curatorObservations: 'Prefere tecidos 100% naturais. Mangas sempre dobradas no estilo italiano.',
        },
      },
      tags: {
        create: [
          { tagId: tagLinho.id, assignedById: mateusCurador.id },
          { tagId: tagMedico.id, assignedById: mateusCurador.id },
        ],
      },
    },
  });

  const rodrigoSilveira = await prisma.customer.upsert({
    where: { phone: '+5547997428833' },
    update: {},
    create: {
      id: 'a0000000-0000-0000-0000-000000000002',
      name: 'Rodrigo Silveira',
      phone: '+5547997428833',
      email: 'rodrigo@agroflorestal.com.br',
      instagram: '@rodrigo.silveira_agro',
      city: 'Canoinhas',
      neighborhood: 'Marcílio Dias',
      address: 'Rodovia SC-477, Km 14 - Fazenda Boa Vista',
      tier: 'VIP Ouro',
      lgpdConsent: 'OPT_IN',
      birthDate: new Date('1979-06-15'),
      lastPurchaseDate: new Date('2026-08-04'),
      curatorId: mateusCurador.id,
      styleProfile: {
        create: {
          id: 's0000000-0000-0000-0000-000000000002',
          shirtSize: 'G',
          pantsSize: '44',
          shoesSize: '42',
          fitPreference: 'REGULAR_FIT',
          heightCm: 186,
          weightKg: 88,
          colorPalette: ['Verde Oliva', 'Marrom Café', 'Bege Fendi', 'Preto'],
          favoriteCategories: ['Jaquetas de Camurça/Couro', 'Botas Chelsea & Loafers', 'Polos Tricot'],
          avoidItems: ['Modelagens Skinny', 'Gola alta justa'],
          lifestyle: 'Produtor rural de grãos e silvicultura; viagens a Curitiba.',
          profession: 'Produtor Rural e Empresário Florestal',
          curatorObservations: 'Caimento clássico imponente. Pagamentos instantâneos via Pix.',
        },
      },
      tags: {
        create: [
          { tagId: tagAgro.id, assignedById: mateusCurador.id },
        ],
      },
    },
  });

  const drCarlos = await prisma.customer.upsert({
    where: { phone: '+5547999152344' },
    update: {},
    create: {
      id: 'a0000000-0000-0000-0000-000000000003',
      name: 'Dr. Carlos Eduardo Guimarães',
      phone: '+5547999152344',
      email: 'carlos.guimaraes@tributario.adv.br',
      instagram: '@carloseduardo.adv',
      city: 'Canoinhas',
      neighborhood: 'Centro',
      address: 'Rua Major Vieira, 890 - Sala 402',
      tier: 'VIP Black',
      lgpdConsent: 'OPT_IN',
      birthDate: new Date('1981-03-28'),
      lastPurchaseDate: new Date('2026-07-29'),
      curatorId: mateusCurador.id,
      styleProfile: {
        create: {
          id: 's0000000-0000-0000-0000-000000000003',
          shirtSize: 'M',
          pantsSize: '40',
          shoesSize: '40',
          fitPreference: 'ALFAIATARIA_MODERNA',
          heightCm: 177,
          weightKg: 74,
          colorPalette: ['Chumbo Melange', 'Preto Ônix', 'Azul Petróleo'],
          favoriteCategories: ['Sobretudos de Lã', 'Tricôs Italianos', 'Alfaiataria sob medida'],
          avoidItems: ['Bermudas estampadas', 'Polos casuais'],
          lifestyle: 'Advogado e sócio de banca jurídica tributária no centro de Canoinhas.',
          profession: 'Advogado Tributarista',
          curatorObservations: 'Extremamente criterioso com tecidos. Sobretudo e lã fria.',
        },
      },
    },
  });

  console.log('✅ 3 Clientes criados com Perfis de Estilo e Tags');

  // 4. Catálogo: 8 Produtos Selecionados Ravi's
  const p1 = await prisma.product.upsert({
    where: { code: 'RAV-CSL-01' },
    update: {},
    create: {
      id: 'p0000000-0000-0000-0000-000000000001',
      code: 'RAV-CSL-01',
      name: 'Camiseta Slim Algodão Egípcio',
      slug: 'camiseta-slim-algodao-egipcio',
      category: 'Camiseta Slim',
      description: 'Toque sedoso incomparável, costura reforçada ombro a ombro e caimento justo.',
      material: '100% Algodão Egípcio Giza 88',
      basePrice: 289.00,
      costPrice: 110.00,
      photos: ['https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800'],
      variants: {
        create: [
          { id: 'v0000000-0000-0000-0000-000000000001', sku: 'RAV-CSL-01-M-PRT', size: 'M', color: 'Preto Ônix', colorHex: '#1A1A1A', barcode: '7891001000011', stock: 2, reservedStock: 1, minStockAlert: 1, isLimitedEdition: true },
          { id: 'v0000000-0000-0000-0000-000000000002', sku: 'RAV-CSL-01-G-PRT', size: 'G', color: 'Preto Ônix', colorHex: '#1A1A1A', barcode: '7891001000012', stock: 3, reservedStock: 0, minStockAlert: 1, isLimitedEdition: true },
        ],
      },
    },
  });

  const p2 = await prisma.product.upsert({
    where: { code: 'RAV-CLG-02' },
    update: {},
    create: {
      id: 'p0000000-0000-0000-0000-000000000002',
      code: 'RAV-CLG-02',
      name: 'Camiseta Longline Urban Minimalist',
      slug: 'camiseta-longline-urban-minimalist',
      category: 'Camiseta Longline',
      description: 'Barra alongada assimétrica e caimento fluido para sobreposições contemporâneas.',
      material: '96% Algodão Pima Peruano, 4% Elastano',
      basePrice: 320.00,
      costPrice: 125.00,
      photos: ['https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=800'],
      variants: {
        create: [
          { id: 'v0000000-0000-0000-0000-000000000003', sku: 'RAV-CLG-02-M-OFF', size: 'M', color: 'Off-white Areia', colorHex: '#F5F5F0', barcode: '7891001000021', stock: 1, reservedStock: 0, minStockAlert: 1, isLimitedEdition: true },
        ],
      },
    },
  });

  const p3 = await prisma.product.upsert({
    where: { code: 'RAV-TRC-03' },
    update: {},
    create: {
      id: 'p0000000-0000-0000-0000-000000000003',
      code: 'RAV-TRC-03',
      name: 'Tricô Modal Canelado Italiano',
      slug: 'trico-modal-canelado-italiano',
      category: 'Tricô',
      description: 'Estrutura em ponto canelado com fio térmico respirável para o clima do Planalto.',
      material: '60% Fibra Modal, 40% Fio Acrílico Antipilling',
      basePrice: 490.00,
      costPrice: 195.00,
      photos: ['https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=800'],
      variants: {
        create: [
          { id: 'v0000000-0000-0000-0000-000000000004', sku: 'RAV-TRC-03-M-PRT', size: 'M', color: 'Preto Clássico', colorHex: '#1F1F1F', barcode: '7891001000031', stock: 2, reservedStock: 1, minStockAlert: 1, isLimitedEdition: true },
          { id: 'v0000000-0000-0000-0000-000000000005', sku: 'RAV-TRC-03-G-OLV', size: 'G', color: 'Verde Militar', colorHex: '#4B5320', barcode: '7891001000032', stock: 2, reservedStock: 0, minStockAlert: 1, isLimitedEdition: true },
        ],
      },
    },
  });

  const p4 = await prisma.product.upsert({
    where: { code: 'RAV-SBT-04' },
    update: {},
    create: {
      id: 'p0000000-0000-0000-0000-000000000004',
      code: 'RAV-SBT-04',
      name: 'Sobretudo Lã Batida Clássico',
      slug: 'sobretudo-la-batida-classico',
      category: 'Sobretudo',
      description: 'Peça de alta alfaiataria com forro acetinado jacquard Ravi\'s e abotoamento duplo.',
      material: '85% Lã Batida Natural, 15% Poliamida Térmica',
      basePrice: 1690.00,
      costPrice: 680.00,
      photos: ['https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=800'],
      variants: {
        create: [
          { id: 'v0000000-0000-0000-0000-000000000006', sku: 'RAV-SBT-04-M-CHM', size: 'M', color: 'Chumbo Escuro', colorHex: '#333333', barcode: '7891001000041', stock: 1, reservedStock: 0, minStockAlert: 1, isLimitedEdition: true },
          { id: 'v0000000-0000-0000-0000-000000000007', sku: 'RAV-SBT-04-G-CAM', size: 'G', color: 'Camel Real', colorHex: '#C19A6B', barcode: '7891001000042', stock: 1, reservedStock: 0, minStockAlert: 1, isLimitedEdition: true },
        ],
      },
    },
  });

  const p5 = await prisma.product.upsert({
    where: { code: 'RAV-CCH-05' },
    update: {},
    create: {
      id: 'p0000000-0000-0000-0000-000000000005',
      code: 'RAV-CCH-05',
      name: 'Cachecol Lã Merino Tartan Canoinhas',
      slug: 'cachecol-la-merino-tartan',
      category: 'Cachecol',
      description: 'Acabamento em franja manual e toque aveludado sem pinicar.',
      material: '100% Lã Merino Australiana Extrafina',
      basePrice: 260.00,
      costPrice: 95.00,
      photos: ['https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=800'],
      variants: {
        create: [
          { id: 'v0000000-0000-0000-0000-000000000008', sku: 'RAV-CCH-05-U-TRT', size: 'ÚNICO', color: 'Tartan Verde & Marrom', colorHex: '#556B2F', barcode: '7891001000051', stock: 3, reservedStock: 0, minStockAlert: 1, isLimitedEdition: true },
        ],
      },
    },
  });

  const p6 = await prisma.product.upsert({
    where: { code: 'RAV-CAL-06' },
    update: {},
    create: {
      id: 'p0000000-0000-0000-0000-000000000006',
      code: 'RAV-CAL-06',
      name: 'Calça Alfaiataria Chino Tech',
      slug: 'calca-alfaiataria-chino-tech',
      category: 'Calça',
      description: 'Cós com elástico interno invisível, tecido com tecnologia anti-amassamento.',
      material: '97% Sarja de Algodão Nobre, 3% Spandex',
      basePrice: 480.00,
      costPrice: 180.00,
      photos: ['https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=800'],
      variants: {
        create: [
          { id: 'v0000000-0000-0000-0000-000000000009', sku: 'RAV-CAL-06-42-FND', size: '42', color: 'Fendi Cinza', colorHex: '#8A867D', barcode: '7891001000061', stock: 2, reservedStock: 1, minStockAlert: 1, isLimitedEdition: true },
          { id: 'v0000000-0000-0000-0000-000000000010', sku: 'RAV-CAL-06-44-MRN', size: '44', color: 'Marrom Café', colorHex: '#4A3728', barcode: '7891001000062', stock: 2, reservedStock: 0, minStockAlert: 1, isLimitedEdition: true },
        ],
      },
    },
  });

  const p7 = await prisma.product.upsert({
    where: { code: 'RAV-LNH-07' },
    update: {},
    create: {
      id: 'p0000000-0000-0000-0000-000000000007',
      code: 'RAV-LNH-07',
      name: 'Camisa Linho Puro Riviera',
      slug: 'camisa-linho-puro-riviera',
      category: 'Camisa de Linho',
      description: 'Colarinho italiano semi-aberto e botões em madrepérola natural gravados a laser.',
      material: '100% Linho Francês Lavado',
      basePrice: 590.00,
      costPrice: 220.00,
      photos: ['https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800'],
      variants: {
        create: [
          { id: 'v0000000-0000-0000-0000-000000000011', sku: 'RAV-LNH-07-M-ARA', size: 'M', color: 'Areia Natural', colorHex: '#E8D8C8', barcode: '7891001000071', stock: 2, reservedStock: 0, minStockAlert: 1, isLimitedEdition: true },
        ],
      },
    },
  });

  const p8 = await prisma.product.upsert({
    where: { code: 'RAV-BLZ-08' },
    update: {},
    create: {
      id: 'p0000000-0000-0000-0000-000000000008',
      code: 'RAV-BLZ-08',
      name: 'Blazer Desestruturado Chumbo',
      slug: 'blazer-desestruturado-chumbo',
      category: 'Blazer',
      description: 'Sem ombreiras rígidas, peso ultraleve e acabamento meia-forra para conforto dinâmico.',
      material: 'Lã Fria Tropical Super 120s',
      basePrice: 1390.00,
      costPrice: 540.00,
      photos: ['https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800'],
      variants: {
        create: [
          { id: 'v0000000-0000-0000-0000-000000000012', sku: 'RAV-BLZ-08-48-CHM', size: '48', color: 'Chumbo Melange', colorHex: '#48494B', barcode: '7891001000081', stock: 1, reservedStock: 0, minStockAlert: 1, isLimitedEdition: true },
        ],
      },
    },
  });

  console.log('✅ 8 Produtos e Variantes com unidades limitadas criados');

  // 5. Mala Condicional de Exemplo: COND-2026-088
  const condicionalBox = await prisma.conditionalBox.upsert({
    where: { boxCode: 'COND-2026-088' },
    update: {},
    create: {
      id: 'b0000000-0000-0000-0000-000000000001',
      boxCode: 'COND-2026-088',
      customerId: drGuilherme.id,
      curatorId: mateusCurador.id,
      status: 'EM_TESTE',
      dataEnvio: new Date(Date.now() - 24 * 3600 * 1000),
      prazoDias: 3,
      dataLimite: new Date(Date.now() + 48 * 3600 * 1000),
      valorTotal: 1849.00,
      valorComprado: 769.00,
      deliveryType: 'MOTORISTA_VIP',
      addressDelivery: 'Rua Vidal Ramos, 412 - Apto 601 (Portaria VIP)',
      observation: 'Mala com seleção exclusiva para prova prévia de congresso médico.',
      boxPhotoUrl: 'https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=400',
      items: {
        create: [
          {
            id: 'i0000000-0000-0000-0000-000000000001',
            variantId: 'v0000000-0000-0000-0000-000000000001',
            priceSnapshot: 289.00,
            status: 'COMPRADO',
            feedbackRating: 5,
            clientFeedback: 'Caimento impecável nos ombros e tecido extremamente sedoso.',
            decidedAt: new Date(Date.now() - 3 * 3600 * 1000),
          },
          {
            id: 'i0000000-0000-0000-0000-000000000002',
            variantId: 'v0000000-0000-0000-0000-000000000009',
            priceSnapshot: 480.00,
            status: 'COMPRADO',
            feedbackRating: 5,
            clientFeedback: 'O elástico invisível do cós é genial para o dia a dia do consultório.',
            decidedAt: new Date(Date.now() - 3 * 3600 * 1000),
          },
          {
            id: 'i0000000-0000-0000-0000-000000000003',
            variantId: 'v0000000-0000-0000-0000-000000000011',
            priceSnapshot: 590.00,
            status: 'DEVOLVIDO',
            motivoDevolucao: 'Ficou folgado na cintura; prefere modelagem Slim alfaiataria com pences',
            feedbackRating: 4,
            clientFeedback: 'Gostei da cor Areia, mas na cintura sobrou tecido.',
            decidedAt: new Date(Date.now() - 5 * 3600 * 1000),
          },
          {
            id: 'i0000000-0000-0000-0000-000000000004',
            variantId: 'v0000000-0000-0000-0000-000000000004',
            priceSnapshot: 490.00,
            status: 'EM_EXPERIMENTACAO',
          },
        ],
      },
    },
  });

  // 6. Pedido e Pagamento Pix correspondente aos 2 itens comprados
  const order = await prisma.order.upsert({
    where: { orderNumber: 'PED-2026-1042' },
    update: {},
    create: {
      id: 'o0000000-0000-0000-0000-000000000001',
      orderNumber: 'PED-2026-1042',
      customerId: drGuilherme.id,
      attendantId: mateusCurador.id,
      channel: 'ONLINE_WHATSAPP',
      status: 'PAGO',
      totalAmount: 769.00,
      discountAmount: 0.00,
      commissionRate: 0.0500,
      commissionAmount: 38.45,
      conditionalBoxId: condicionalBox.id,
      paymentLink: 'https://mpago.la/pos/ravis/76900',
      notes: 'Conversão de 2 peças da mala condicional COND-2026-088. Pago via Pix dinâmico.',
      items: {
        create: [
          { variantId: 'v0000000-0000-0000-0000-000000000001', quantity: 1, unitPrice: 289.00, total: 289.00 },
          { variantId: 'v0000000-0000-0000-0000-000000000009', quantity: 1, unitPrice: 480.00, total: 480.00 },
        ],
      },
      payments: {
        create: {
          id: 'py000000-0000-0000-0000-000000000001',
          conditionalBoxId: condicionalBox.id,
          method: 'PIX',
          status: 'APROVADO',
          amount: 769.00,
          installments: 1,
          transactionId: 'MP-PIX-9843210492',
          paidAt: new Date(Date.now() - 2 * 3600 * 1000),
        },
      },
    },
  });

  console.log('✅ Mala Condicional COND-2026-088 e Pedido PED-2026-1042 criados');
  console.log('🚀 Seed concluído com sucesso!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
