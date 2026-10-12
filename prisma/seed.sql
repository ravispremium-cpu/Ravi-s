-- ============================================================================
-- SEED DATA SQL: Ravi's CRM - PostgreSQL
-- Clientes VIP de Canoinhas-SC, Catálogo de Luxo Pomelli & Mala Condicional Real
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. USUÁRIOS E EQUIPE (ADMIN, CURADOR, ATENDENTE)
-- ----------------------------------------------------------------------------
INSERT INTO "User" ("id", "name", "email", "passwordHash", "phone", "role", "avatarUrl", "commissionRate", "createdAt", "updatedAt")
VALUES
  ('c0000000-0000-0000-0000-000000000001', 'Ravi Pomelli', 'ravi@ravispremium.com.br', '$2a$12$e8x/k...', '(47) 99800-0001', 'ADMIN', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150', 0.0000, NOW(), NOW()),
  ('c0000000-0000-0000-0000-000000000002', 'Mateus Silva (Consultor Sênior)', 'mateus@ravispremium.com.br', '$2a$12$e8x/k...', '(47) 99824-0002', 'CURADOR', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150', 0.0500, NOW(), NOW()),
  ('c0000000-0000-0000-0000-000000000003', 'Juliana Ramos (Atendente PDV)', 'juliana@ravispremium.com.br', '$2a$12$e8x/k...', '(47) 99824-0003', 'ATENDENTE', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150', 0.0300, NOW(), NOW())
ON CONFLICT ("id") DO NOTHING;

-- ----------------------------------------------------------------------------
-- 2. TAGS DE SEGMENTAÇÃO
-- ----------------------------------------------------------------------------
INSERT INTO "Tag" ("id", "name", "category", "color", "description", "createdAt", "updatedAt")
VALUES
  ('t0000000-0000-0000-0000-000000000001', 'Amante de Linho', 'ESTILO', '#D4AF37', 'Clientes com preferência comprovada por peças de linho puro', NOW(), NOW()),
  ('t0000000-0000-0000-0000-000000000002', 'VIP Médico Canoinhas', 'VIP', '#E5C158', 'Médicos e cirurgiões dos hospitais Santa Cruz e Unimed', NOW(), NOW()),
  ('t0000000-0000-0000-0000-000000000003', 'Produtor Rural Planalto', 'REGIAO', '#4ADE80', 'Produtores de grãos e silvicultura do Planalto Norte SC', NOW(), NOW()),
  ('t0000000-0000-0000-0000-000000000004', 'Ticket Alto', 'COMPORTAMENTO', '#F59E0B', 'Histórico de compras acima de R$ 2.000 por atendimento', NOW(), NOW()),
  ('t0000000-0000-0000-0000-000000000005', 'Mala Recorrente', 'COMPORTAMENTO', '#38BDF8', 'Recebe mala condicional mensalmente em casa ou consultório', NOW(), NOW()),
  ('t0000000-0000-0000-0000-000000000006', 'Alfaiataria Clássica', 'ESTILO', '#A855F7', 'Advogados e empresários que priorizam ternos e blazers', NOW(), NOW())
ON CONFLICT ("id") DO NOTHING;

-- ----------------------------------------------------------------------------
-- 3. CLIENTES (3 CLIENTES REAIS DO CRM RAVI'S)
-- ----------------------------------------------------------------------------
INSERT INTO "Customer" (
  "id", "name", "phone", "email", "instagram", "city", "neighborhood", "address", 
  "tier", "lgpdConsent", "lgpdConsentDate", "birthDate", "lastPurchaseDate", "curatorId", "createdAt", "updatedAt"
)
VALUES
  (
    'a0000000-0000-0000-0000-000000000001', 
    'Dr. Guilherme Schramm', 
    '+5547998241102', 
    'guilherme.schramm@cardio.med.br', 
    '@drguilhermeschramm', 
    'Canoinhas', 
    'Centro', 
    'Rua Vidal Ramos, 412 - Apto 601', 
    'VIP Platinum', 
    'OPT_IN', 
    NOW() - INTERVAL '120 days', 
    '1984-11-20', 
    '2026-09-12', 
    'c0000000-0000-0000-0000-000000000002', 
    NOW() - INTERVAL '300 days', 
    NOW()
  ),
  (
    'a0000000-0000-0000-0000-000000000002', 
    'Rodrigo Silveira', 
    '+5547997428833', 
    'rodrigo@agroflorestal.com.br', 
    '@rodrigo.silveira_agro', 
    'Canoinhas', 
    'Marcílio Dias', 
    'Rodovia SC-477, Km 14 - Fazenda Boa Vista', 
    'VIP Ouro', 
    'OPT_IN', 
    NOW() - INTERVAL '90 days', 
    '1979-06-15', 
    '2026-08-04', 
    'c0000000-0000-0000-0000-000000000002', 
    NOW() - INTERVAL '210 days', 
    NOW()
  ),
  (
    'a0000000-0000-0000-0000-000000000003', 
    'Dr. Carlos Eduardo Guimarães', 
    '+5547999152344', 
    'carlos.guimaraes@tributario.adv.br', 
    '@carloseduardo.adv', 
    'Canoinhas', 
    'Centro', 
    'Rua Major Vieira, 890 - Sala 402', 
    'VIP Black', 
    'OPT_IN', 
    NOW() - INTERVAL '150 days', 
    '1981-03-28', 
    '2026-07-29', 
    'c0000000-0000-0000-0000-000000000002', 
    NOW() - INTERVAL '400 days', 
    NOW()
  )
ON CONFLICT ("id") DO NOTHING;

-- ----------------------------------------------------------------------------
-- 4. PERFIL DE ESTILO E ANTROPOMETRIA (StyleProfile)
-- ----------------------------------------------------------------------------
INSERT INTO "StyleProfile" (
  "id", "customerId", "shirtSize", "pantsSize", "shoesSize", "fitPreference", "heightCm", "weightKg",
  "colorPalette", "favoriteCategories", "avoidItems", "lifestyle", "profession", "curatorObservations", "createdAt", "updatedAt"
)
VALUES
  (
    's0000000-0000-0000-0000-000000000001',
    'a0000000-0000-0000-0000-000000000001',
    'M',
    '42',
    '41',
    'SLIM_FIT',
    182,
    79,
    ARRAY['Tons Terrosos', 'Azul Marinho', 'Off-white', 'Areia Natural'],
    ARRAY['Camisas de Linho', 'Blazers Desestruturados', 'Calça Chino Tech'],
    ARRAY['Estampas grandes', 'Golas V profundas', 'Cores fluorescentes'],
    'Médico Cardiologista no Hospital Santa Cruz; jantares e finais de semana em Pomerode.',
    'Médico Cardiologista & Pecuarista',
    'Prefere tecidos naturais (100% linho ou algodão pima). Gosta de mangas dobradas no estilo italiano.',
    NOW(),
    NOW()
  ),
  (
    's0000000-0000-0000-0000-000000000002',
    'a0000000-0000-0000-0000-000000000002',
    'G',
    '44',
    '42',
    'REGULAR_FIT',
    186,
    88,
    ARRAY['Verde Oliva', 'Marrom Café', 'Bege Fendi', 'Preto'],
    ARRAY['Jaquetas de Camurça/Couro', 'Botas Chelsea & Loafers', 'Polos Tricot'],
    ARRAY['Modelagens Skinny', 'Gola alta justa'],
    'Produtor rural de grãos e silvicultura; transita entre o campo e reuniões com tradings em Curitiba.',
    'Produtor Rural e Empresário Florestal',
    'Gosta de caimento confortável com presença marcante. Paga Pix à vista na hora da entrega.',
    NOW(),
    NOW()
  ),
  (
    's0000000-0000-0000-0000-000000000003',
    'a0000000-0000-0000-0000-000000000003',
    'M',
    '40',
    '40',
    'ALFAIATARIA_MODERNA',
    177,
    74,
    ARRAY['Chumbo Melange', 'Preto Ônix', 'Azul Petróleo', 'Cinza Claro'],
    ARRAY['Sobretudos de Lã', 'Tricôs Italianos', 'Alfaiataria sob medida'],
    ARRAY['Bermudas estampadas', 'Polos casuais'],
    'Advogado e sócio de banca jurídica tributária no centro de Canoinhas.',
    'Advogado Tributarista',
    'Extremamente exigente com costuras e forros. Foco total em sobriedade e sofisticação.',
    NOW(),
    NOW()
  )
ON CONFLICT ("id") DO NOTHING;

-- Vínculo de Tags dos Clientes
INSERT INTO "CustomerTag" ("id", "customerId", "tagId", "assignedById", "assignedAt")
VALUES
  ('ct000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', 't0000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000002', NOW()),
  ('ct000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000001', 't0000000-0000-0000-0000-000000000002', 'c0000000-0000-0000-0000-000000000002', NOW()),
  ('ct000000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000001', 't0000000-0000-0000-0000-000000000005', 'c0000000-0000-0000-0000-000000000002', NOW()),
  ('ct000000-0000-0000-0000-000000000004', 'a0000000-0000-0000-0000-000000000002', 't0000000-0000-0000-0000-000000000003', 'c0000000-0000-0000-0000-000000000002', NOW()),
  ('ct000000-0000-0000-0000-000000000005', 'a0000000-0000-0000-0000-000000000002', 't0000000-0000-0000-0000-000000000004', 'c0000000-0000-0000-0000-000000000002', NOW()),
  ('ct000000-0000-0000-0000-000000000006', 'a0000000-0000-0000-0000-000000000003', 't0000000-0000-0000-0000-000000000006', 'c0000000-0000-0000-0000-000000000002', NOW())
ON CONFLICT ("id") DO NOTHING;

-- ----------------------------------------------------------------------------
-- 5. CATÁLOGO DE PRODUTOS (8 PEÇAS SELECIONADAS RAVI'S PREMIUM)
-- Importado do Photoshoot oficial do Pomelli com custos e preços
-- ----------------------------------------------------------------------------
INSERT INTO "Product" (
  "id", "code", "name", "slug", "category", "description", "material", 
  "basePrice", "costPrice", "photos", "active", "createdAt", "updatedAt"
)
VALUES
  (
    'p0000000-0000-0000-0000-000000000001',
    'RAV-CSL-01',
    'Camiseta Slim Algodão Egípcio',
    'camiseta-slim-algodao-egipcio',
    'Camiseta Slim',
    'Toque sedoso incomparável, costura reforçada ombro a ombro e caimento justo ao tórax com máxima liberdade.',
    '100% Algodão Egípcio Giza 88',
    289.00,
    110.00,
    ARRAY['https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800', 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800'],
    true,
    NOW(),
    NOW()
  ),
  (
    'p0000000-0000-0000-0000-000000000002',
    'RAV-CLG-02',
    'Camiseta Longline Urban Minimalist',
    'camiseta-longline-urban-minimalist',
    'Camiseta Longline',
    'Barra alongada assimétrica e caimento fluido para sobreposições modernas sob casacos e jaquetas.',
    '96% Algodão Pima Peruano, 4% Elastano',
    320.00,
    125.00,
    ARRAY['https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=800'],
    true,
    NOW(),
    NOW()
  ),
  (
    'p0000000-0000-0000-0000-000000000003',
    'RAV-TRC-03',
    'Tricô Modal Canelado Italiano',
    'trico-modal-canelado-italiano',
    'Tricô',
    'Estrutura em ponto canelado com fio térmico respirável. Ideal para o clima frio do Planalto Norte catarinense.',
    '60% Fibra Modal, 40% Fio Acrílico Antipilling',
    490.00,
    195.00,
    ARRAY['https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=800'],
    true,
    NOW(),
    NOW()
  ),
  (
    'p0000000-0000-0000-0000-000000000004',
    'RAV-SBT-04',
    'Sobretudo Lã Batida Clássico',
    'sobretudo-la-batida-classico',
    'Sobretudo',
    'Peça de alta alfaiataria com forro acetinado jacquard Ravi''s, abotoamento duplo e bolsos embutidos.',
    '85% Lã Batida Natural, 15% Poliamida Térmica',
    1690.00,
    680.00,
    ARRAY['https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=800'],
    true,
    NOW(),
    NOW()
  ),
  (
    'p0000000-0000-0000-0000-000000000005',
    'RAV-CCH-05',
    'Cachecol Lã Merino Tartan Canoinhas',
    'cachecol-la-merino-tartan',
    'Cachecol',
    'Acabamento em franja manual e toque aveludado sem pinicar o pescoço. Padrão tartan exclusivo de inverno.',
    '100% Lã Merino Australiana Extrafina',
    260.00,
    95.00,
    ARRAY['https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=800'],
    true,
    NOW(),
    NOW()
  ),
  (
    'p0000000-0000-0000-0000-000000000006',
    'RAV-CAL-06',
    'Calça Alfaiataria Chino Tech',
    'calca-alfaiataria-chino-tech',
    'Calça',
    'Cós com elástico interno invisível, tecido com tecnologia anti-amassamento e modelagem cenoura moderna.',
    '97% Sarja de Algodão Nobre, 3% Spandex',
    480.00,
    180.00,
    ARRAY['https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=800'],
    true,
    NOW(),
    NOW()
  ),
  (
    'p0000000-0000-0000-0000-000000000007',
    'RAV-LNH-07',
    'Camisa Linho Puro Riviera',
    'camisa-linho-puro-riviera',
    'Camisa de Linho',
    'Colarinho italiano semi-aberto e botões em madrepérola natural gravados a laser.',
    '100% Linho Francês Lavado',
    590.00,
    220.00,
    ARRAY['https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800'],
    true,
    NOW(),
    NOW()
  ),
  (
    'p0000000-0000-0000-0000-000000000008',
    'RAV-BLZ-08',
    'Blazer Desestruturado Chumbo',
    'blazer-desestruturado-chumbo',
    'Blazer',
    'Sem ombreiras rígidas, peso ultraleve e acabamento meia-forra para conforto dinâmico em viagens de negócios.',
    'Lã Fria Tropical Super 120s',
    1390.00,
    540.00,
    ARRAY['https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800'],
    true,
    NOW(),
    NOW()
  )
ON CONFLICT ("id") DO NOTHING;

-- ----------------------------------------------------------------------------
-- 6. VARIANTES DE PRODUTO (SKUs LIMITADOS: 1 A 3 UNIDADES POR SKU)
-- ----------------------------------------------------------------------------
INSERT INTO "ProductVariant" (
  "id", "productId", "sku", "size", "color", "colorHex", "barcode", "stock", "reservedStock", "minStockAlert", "isLimitedEdition", "createdAt", "updatedAt"
)
VALUES
  -- RAV-CSL-01: Camiseta Slim Egípcia
  ('v0000000-0000-0000-0000-000000000001', 'p0000000-0000-0000-0000-000000000001', 'RAV-CSL-01-M-PRT', 'M', 'Preto Ônix', '#1A1A1A', '7891001000011', 2, 1, 1, true, NOW(), NOW()),
  ('v0000000-0000-0000-0000-000000000002', 'p0000000-0000-0000-0000-000000000001', 'RAV-CSL-01-G-PRT', 'G', 'Preto Ônix', '#1A1A1A', '7891001000012', 3, 0, 1, true, NOW(), NOW()),

  -- RAV-CLG-02: Camiseta Longline
  ('v0000000-0000-0000-0000-000000000003', 'p0000000-0000-0000-0000-000000000002', 'RAV-CLG-02-M-OFF', 'M', 'Off-white Areia', '#F5F5F0', '7891001000021', 1, 0, 1, true, NOW(), NOW()),

  -- RAV-TRC-03: Tricô Modal Canelado
  ('v0000000-0000-0000-0000-000000000004', 'p0000000-0000-0000-0000-000000000003', 'RAV-TRC-03-M-PRT', 'M', 'Preto Clássico', '#1F1F1F', '7891001000031', 2, 1, 1, true, NOW(), NOW()),
  ('v0000000-0000-0000-0000-000000000005', 'p0000000-0000-0000-0000-000000000003', 'RAV-TRC-03-G-OLV', 'G', 'Verde Militar', '#4B5320', '7891001000032', 2, 0, 1, true, NOW(), NOW()),

  -- RAV-SBT-04: Sobretudo Lã Batida (Exclusividade Máxima: 1 unidade M, 1 unidade G)
  ('v0000000-0000-0000-0000-000000000006', 'p0000000-0000-0000-0000-000000000004', 'RAV-SBT-04-M-CHM', 'M', 'Chumbo Escuro', '#333333', '7891001000041', 1, 0, 1, true, NOW(), NOW()),
  ('v0000000-0000-0000-0000-000000000007', 'p0000000-0000-0000-0000-000000000004', 'RAV-SBT-04-G-CAM', 'G', 'Camel Real', '#C19A6B', '7891001000042', 1, 0, 1, true, NOW(), NOW()),

  -- RAV-CCH-05: Cachecol Lã Merino
  ('v0000000-0000-0000-0000-000000000008', 'p0000000-0000-0000-0000-000000000005', 'RAV-CCH-05-U-TRT', 'ÚNICO', 'Tartan Verde & Marrom', '#556B2F', '7891001000051', 3, 0, 1, true, NOW(), NOW()),

  -- RAV-CAL-06: Calça Alfaiataria Chino Tech
  ('v0000000-0000-0000-0000-000000000009', 'p0000000-0000-0000-0000-000000000006', 'RAV-CAL-06-42-FND', '42', 'Fendi Cinza', '#8A867D', '7891001000061', 2, 1, 1, true, NOW(), NOW()),
  ('v0000000-0000-0000-0000-000000000010', 'p0000000-0000-0000-0000-000000000006', 'RAV-CAL-06-44-MRN', '44', 'Marrom Café', '#4A3728', '7891001000062', 2, 0, 1, true, NOW(), NOW()),

  -- RAV-LNH-07: Camisa Linho Puro Riviera
  ('v0000000-0000-0000-0000-000000000011', 'p0000000-0000-0000-0000-000000000007', 'RAV-LNH-07-M-ARA', 'M', 'Areia Natural', '#E8D8C8', '7891001000071', 2, 0, 1, true, NOW(), NOW()),

  -- RAV-BLZ-08: Blazer Desestruturado
  ('v0000000-0000-0000-0000-000000000012', 'p0000000-0000-0000-0000-000000000008', 'RAV-BLZ-08-48-CHM', '48', 'Chumbo Melange', '#48494B', '7891001000081', 1, 0, 1, true, NOW(), NOW())
ON CONFLICT ("id") DO NOTHING;

-- ----------------------------------------------------------------------------
-- 7. EXEMPLO REAL DE MALA CONDICIONAL (COND-2026-088)
-- Cliente: Dr. Guilherme Schramm | Curador: Mateus | 4 Peças sob Prova
-- ----------------------------------------------------------------------------
INSERT INTO "ConditionalBox" (
  "id", "boxCode", "customerId", "curatorId", "status", "dataEnvio", "dataDevolucao",
  "prazoDias", "dataLimite", "valorTotal", "valorComprado", "deliveryType", "addressDelivery",
  "observation", "boxPhotoUrl", "createdAt", "updatedAt"
)
VALUES
  (
    'b0000000-0000-0000-0000-000000000001',
    'COND-2026-088',
    'a0000000-0000-0000-0000-000000000001',
    'c0000000-0000-0000-0000-000000000002',
    'EM_TESTE',
    NOW() - INTERVAL '1 day',
    NULL,
    3,
    NOW() + INTERVAL '2 days',
    1849.00,
    769.00,
    'MOTORISTA_VIP',
    'Rua Vidal Ramos, 412 - Apto 601 (Entregue na portaria com o zelador)',
    'Mala selecionada para prova prévia de congresso médico. Cliente adora golas estruturadas.',
    'https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=400',
    NOW() - INTERVAL '1 day',
    NOW()
  )
ON CONFLICT ("id") DO NOTHING;

-- ----------------------------------------------------------------------------
-- ITENS DA MALA COND-2026-088
-- 2 Comprados (R$ 769), 1 Devolvido (R$ 590), 1 em Teste (R$ 490)
-- ----------------------------------------------------------------------------
INSERT INTO "ConditionalItem" (
  "id", "conditionalBoxId", "variantId", "priceSnapshot", "status", "motivoDevolucao", "feedbackRating", "clientFeedback", "decidedAt", "createdAt", "updatedAt"
)
VALUES
  -- Item 1: Camiseta Slim Egípcia M Preto -> COMPRADO
  (
    'i0000000-0000-0000-0000-000000000001',
    'b0000000-0000-0000-0000-000000000001',
    'v0000000-0000-0000-0000-000000000001',
    289.00,
    'COMPRADO',
    NULL,
    5,
    'Caimento impecável nos ombros e tecido extremamente leve.',
    NOW() - INTERVAL '3 hours',
    NOW() - INTERVAL '1 day',
    NOW()
  ),
  -- Item 2: Calça Chino Tech 42 Fendi -> COMPRADO
  (
    'i0000000-0000-0000-0000-000000000002',
    'b0000000-0000-0000-0000-000000000001',
    'v0000000-0000-0000-0000-000000000009',
    480.00,
    'COMPRADO',
    NULL,
    5,
    'O elástico invisível do cós é genial para o dia a dia do consultório.',
    NOW() - INTERVAL '3 hours',
    NOW() - INTERVAL '1 day',
    NOW()
  ),
  -- Item 3: Camisa Linho Riviera M Areia -> DEVOLVIDO
  (
    'i0000000-0000-0000-0000-000000000003',
    'b0000000-0000-0000-0000-000000000001',
    'v0000000-0000-0000-0000-000000000011',
    590.00,
    'DEVOLVIDO',
    'Ficou folgado na cintura; prefere modelagem Slim alfaiataria com pences',
    4,
    'Gostei da cor Areia, mas a cintura sobrou tecido.',
    NOW() - INTERVAL '5 hours',
    NOW() - INTERVAL '1 day',
    NOW()
  ),
  -- Item 4: Tricô Modal Canelado M Preto -> EM_EXPERIMENTACAO
  (
    'i0000000-0000-0000-0000-000000000004',
    'b0000000-0000-0000-0000-000000000001',
    'v0000000-0000-0000-0000-000000000004',
    490.00,
    'EM_EXPERIMENTACAO',
    NULL,
    NULL,
    NULL,
    NULL,
    NOW() - INTERVAL '1 day',
    NOW()
  )
ON CONFLICT ("id") DO NOTHING;

-- ----------------------------------------------------------------------------
-- 8. PEDIDO GERADO E PAGAMENTO (FATURAMENTO DAS PEÇAS COMPRADAS)
-- ----------------------------------------------------------------------------
INSERT INTO "Order" (
  "id", "orderNumber", "customerId", "attendantId", "channel", "status", "totalAmount", 
  "discountAmount", "commissionRate", "commissionAmount", "conditionalBoxId", "paymentLink", "notes", "createdAt", "updatedAt"
)
VALUES
  (
    'o0000000-0000-0000-0000-000000000001',
    'PED-2026-1042',
    'a0000000-0000-0000-0000-000000000001',
    'c0000000-0000-0000-0000-000000000002',
    'ONLINE_WHATSAPP',
    'PAGO',
    769.00,
    0.00,
    0.0500,
    38.45,
    'b0000000-0000-0000-0000-000000000001',
    'https://mpago.la/pos/ravis/76900',
    'Conversão de 2 peças da mala condicional COND-2026-088. Pago via Pix dinâmico.',
    NOW() - INTERVAL '2 hours',
    NOW()
  )
ON CONFLICT ("id") DO NOTHING;

INSERT INTO "OrderItem" ("id", "orderId", "variantId", "quantity", "unitPrice", "discount", "total", "createdAt", "updatedAt")
VALUES
  ('oi000000-0000-0000-0000-000000000001', 'o0000000-0000-0000-0000-000000000001', 'v0000000-0000-0000-0000-000000000001', 1, 289.00, 0.00, 289.00, NOW(), NOW()),
  ('oi000000-0000-0000-0000-000000000002', 'o0000000-0000-0000-0000-000000000001', 'v0000000-0000-0000-0000-000000000009', 1, 480.00, 0.00, 480.00, NOW(), NOW())
ON CONFLICT ("id") DO NOTHING;

INSERT INTO "Payment" (
  "id", "orderId", "conditionalBoxId", "method", "status", "amount", "installments", "transactionId", "gatewayResponse", "paidAt", "createdAt", "updatedAt"
)
VALUES
  (
    'py000000-0000-0000-0000-000000000001',
    'o0000000-0000-0000-0000-000000000001',
    'b0000000-0000-0000-0000-000000000001',
    'PIX',
    'APROVADO',
    769.00,
    1,
    'MP-PIX-9843210492',
    '{"status": "approved", "bank": "Banco do Brasil", "endToEndId": "E00000000202610121400"}',
    NOW() - INTERVAL '2 hours',
    NOW() - INTERVAL '2 hours',
    NOW()
  )
ON CONFLICT ("id") DO NOTHING;

-- ----------------------------------------------------------------------------
-- 9. MOVIMENTAÇÕES DE ESTOQUE (KARDEX AUDITADO)
-- ----------------------------------------------------------------------------
INSERT INTO "InventoryMovement" (
  "id", "variantId", "type", "quantity", "previousStock", "newStock", "reason", "orderId", "conditionalBoxId", "createdById", "createdAt"
)
VALUES
  -- Reserva inicial de 4 peças para envio da mala
  ('m0000000-0000-0000-0000-000000000001', 'v0000000-0000-0000-0000-000000000001', 'RESERVA_CONDICIONAL', -1, 3, 2, 'Reserva para envio da mala COND-2026-088', NULL, 'b0000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000002', NOW() - INTERVAL '1 day'),
  ('m0000000-0000-0000-0000-000000000002', 'v0000000-0000-0000-0000-000000000009', 'RESERVA_CONDICIONAL', -1, 3, 2, 'Reserva para envio da mala COND-2026-088', NULL, 'b0000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000002', NOW() - INTERVAL '1 day'),
  ('m0000000-0000-0000-0000-000000000003', 'v0000000-0000-0000-0000-000000000011', 'RESERVA_CONDICIONAL', -1, 2, 1, 'Reserva para envio da mala COND-2026-088', NULL, 'b0000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000002', NOW() - INTERVAL '1 day'),
  -- Baixa definitiva dos 2 itens comprados
  ('m0000000-0000-0000-0000-000000000004', 'v0000000-0000-0000-0000-000000000001', 'SAIDA_VENDA', -1, 2, 2, 'Baixa definitiva faturamento pedido PED-2026-1042', 'o0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000002', NOW() - INTERVAL '2 hours'),
  ('m0000000-0000-0000-0000-000000000005', 'v0000000-0000-0000-0000-000000000009', 'SAIDA_VENDA', -1, 2, 2, 'Baixa definitiva faturamento pedido PED-2026-1042', 'o0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000002', NOW() - INTERVAL '2 hours'),
  -- Retorno ao estoque disponível do item devolvido
  ('m0000000-0000-0000-0000-000000000006', 'v0000000-0000-0000-0000-000000000011', 'DEVOLUCAO', 1, 1, 2, 'Devolução formal da peça com reintegração física ao estoque', NULL, 'b0000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000002', NOW() - INTERVAL '4 hours')
ON CONFLICT ("id") DO NOTHING;

-- ----------------------------------------------------------------------------
-- 10. LINHA DO TEMPO (INTERACTION TIMELINE 360°)
-- ----------------------------------------------------------------------------
INSERT INTO "Interaction" ("id", "customerId", "userId", "type", "title", "description", "metadata", "timestamp", "createdAt")
VALUES
  ('it000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000002', 'CONDICIONAL', 'Mala COND-2026-088 Despachada', 'Mala com 4 peças entregue no consultório via Motorista VIP.', '{"boxCode": "COND-2026-088", "itemsCount": 4}', NOW() - INTERVAL '1 day', NOW()),
  ('it000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000002', 'WHATSAPP', 'Lembrete de Prova D+1 Enviado', 'Mensagem enviada perguntando se as peças serviram bem.', '{"template": "CONDICIONAL_LEMBRETE"}', NOW() - INTERVAL '18 hours', NOW()),
  ('it000000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000002', 'PAGAMENTO', 'Pagamento Pix Confirmado (R$ 769,00)', 'Liquidação de 2 peças: Camiseta Slim Egípcia e Calça Chino Tech.', '{"orderId": "o0000000-0000-0000-0000-000000000001", "pixId": "MP-PIX-9843210492"}', NOW() - INTERVAL '2 hours', NOW())
ON CONFLICT ("id") DO NOTHING;

-- ----------------------------------------------------------------------------
-- 11. AUTOMAÇÕES PRÉ-CONFIGURADAS DE MODA (5 REGRAS)
-- ----------------------------------------------------------------------------
INSERT INTO "Automation" ("id", "name", "key", "triggerEvent", "channel", "active", "delayMinutes", "conditions", "actionConfig", "executionsCount", "successRate", "createdAt", "updatedAt")
VALUES
  ('au000000-0000-0000-0000-000000000001', 'Novo Cliente: Onboarding & Tamanho', 'NOVO_CLIENTE', 'CLIENT_CREATED', 'WHATSAPP', true, 10, '{"optIn": true}', '{"template": "QUAL_SEU_TAMANHO"}', 184, 96.20, NOW(), NOW()),
  ('au000000-0000-0000-0000-000000000002', 'Condicional em Teste D+3: Lembrete', 'CONDICIONAL_D3', 'CONDICIONAL_TRIAL_D3', 'WHATSAPP', true, 0, '{"status": "EM_TESTE", "daysElapsed": 3}', '{"template": "LEMBRETE_CONDICIONAL_D3"}', 92, 100.00, NOW(), NOW()),
  ('au000000-0000-0000-0000-000000000003', 'Aniversariante do Mês: Seleção Especial', 'ANIVERSARIANTE', 'CUSTOMER_BIRTHDAY_MONTH', 'WHATSAPP', true, 60, '{"isBirthdayMonth": true, "optIn": true}', '{"template": "ANIVERSARIO_VIP"}', 47, 91.50, NOW(), NOW()),
  ('au000000-0000-0000-0000-000000000004', 'Reativação 60 Dias sem Compras', 'REATIVACAO_60D', 'INACTIVE_60_DAYS', 'WHATSAPP', true, 120, '{"daysSinceLastPurchase": 60}', '{"template": "REATIVACAO_NOVIDADES"}', 68, 88.00, NOW(), NOW()),
  ('au000000-0000-0000-0000-000000000005', 'Novo Drop no Catálogo: Match de Estilo', 'NOVO_DROP', 'CATALOG_PRODUCT_ADDED', 'WHATSAPP', true, 15, '{"matchCategory": true, "matchSize": true}', '{"template": "DROP_VIP_COMPATIVEL"}', 230, 94.80, NOW(), NOW())
ON CONFLICT ("id") DO NOTHING;

-- ----------------------------------------------------------------------------
-- 12. LISTA DE DESEJO (WISHLIST)
-- ----------------------------------------------------------------------------
INSERT INTO "Wishlist" ("id", "customerId", "variantId", "desiredCategory", "desiredSize", "desiredColor", "status", "priority", "notes", "createdAt", "updatedAt")
VALUES
  ('w000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', 'v0000000-0000-0000-0000-000000000006', 'Sobretudo Lã Italiana', 'M', 'Chumbo Escuro', 'DESEJADO', 5, 'Avisar imediatamente quando o tecido de lã italiana chegar para prova', NOW(), NOW()),
  ('w000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000002', 'v0000000-0000-0000-0000-000000000007', 'Sobretudo Camel Real', 'G', 'Camel', 'DESEJADO', 4, 'Cliente pediu para reservar caso haja reposição', NOW(), NOW())
ON CONFLICT ("id") DO NOTHING;
