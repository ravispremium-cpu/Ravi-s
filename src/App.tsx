/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Client, 
  Product, 
  CondicionalBox, 
  UnifiedMessage, 
  AnalyticsSummary, 
  CondicionalStatus,
  CondicionalItem,
  CondicionalFinalOutcome,
  Order,
  OrderStatus,
  WishlistItem,
  WishlistStatus,
  MessageChannel
} from './types/crm';
import { 
  INITIAL_CLIENTS, 
  INITIAL_PRODUCTS, 
  INITIAL_CONDICIONAIS, 
  INITIAL_MESSAGES, 
  INITIAL_ANALYTICS,
  INITIAL_ORDERS,
  INITIAL_WISHLISTS 
} from './data/initialData';

import { Header } from './components/layout/Header';
import { Navigation, NavTab } from './components/layout/Navigation';
import { CondicionalKanban } from './components/condicional/CondicionalKanban';
import { NewCondicionalModal } from './components/condicional/NewCondicionalModal';
import { CheckoutCondicionalModal } from './components/condicional/CheckoutCondicionalModal';
import { CondicionalDetailDrawer } from './components/condicional/CondicionalDetailDrawer';
import { WhatsAppCondicionalModal } from './components/condicional/WhatsAppCondicionalModal';
import { ClientList } from './components/clients/ClientList';
import { ClientProfile360 } from './components/clients/ClientProfile360';
import { NewClientModal } from './components/clients/NewClientModal';
import { WhatsAppImportModal } from './components/clients/WhatsAppImportModal';
import { UnifiedInbox } from './components/inbox/UnifiedInbox';
import { CatalogView } from './components/catalog/CatalogView';
import { NewProductModal } from './components/catalog/NewProductModal';
import { OrdersView } from './components/orders/OrdersView';
import { WishlistView } from './components/wishlist/WishlistView';
import { AnalyticsDashboard } from './components/analytics/AnalyticsDashboard';
import { VisionDocumentView } from './components/vision/VisionDocumentView';
import { TechnicalArchitectureView } from './components/architecture/TechnicalArchitectureView';
import { AICuratorModal } from './components/ai/AICuratorModal';
import { CuratorMobileApp } from './components/mobile/CuratorMobileApp';
import { DesignSystemWireframesView } from './components/design/DesignSystemWireframesView';
import { RoadmapDeliveryView } from './components/roadmap/RoadmapDeliveryView';

export default function App() {
  const [clients, setClients] = useState<Client[]>(INITIAL_CLIENTS);
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [condicionais, setCondicionais] = useState<CondicionalBox[]>(INITIAL_CONDICIONAIS);
  const [messages, setMessages] = useState<UnifiedMessage[]>(INITIAL_MESSAGES);
  const [analytics, setAnalytics] = useState<AnalyticsSummary>(INITIAL_ANALYTICS);
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [wishlists, setWishlists] = useState<WishlistItem[]>(INITIAL_WISHLISTS);

  const [currentTab, setCurrentTab] = useState<NavTab>('condicional');
  const [isMobileSimulator, setIsMobileSimulator] = useState<boolean>(false);

  // Selected entities for drawers / modals
  const [selectedClientIdFor360, setSelectedClientIdFor360] = useState<string | null>(null);
  const [selectedBoxForDetails, setSelectedBoxForDetails] = useState<CondicionalBox | null>(null);
  const [selectedBoxForCheckout, setSelectedBoxForCheckout] = useState<CondicionalBox | null>(null);
  const [selectedBoxForWhatsApp, setSelectedBoxForWhatsApp] = useState<CondicionalBox | null>(null);

  // Modals visibility
  const [isNewBoxModalOpen, setIsNewBoxModalOpen] = useState(false);
  const [isNewClientModalOpen, setIsNewClientModalOpen] = useState(false);
  const [isWhatsAppImportModalOpen, setIsWhatsAppImportModalOpen] = useState(false);
  const [isNewProductModalOpen, setIsNewProductModalOpen] = useState(false);
  const [isAICuratorModalOpen, setIsAICuratorModalOpen] = useState(false);

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Active condicionais count (in progress: RASCUNHO, AGENDADO, ENVIADO, EM_TESTE)
  const activeCondicionais = condicionais.filter(
    b => b.status === 'RASCUNHO' || b.status === 'AGENDADO' || b.status === 'ENVIADO' || b.status === 'EM_TESTE'
  );
  const totalInTransitValue = condicionais
    .filter(b => b.status === 'EM_TESTE' || b.status === 'ENVIADO')
    .reduce((sum, b) => sum + b.totalValue, 0);

  const unreadMessagesCount = messages.filter(m => !m.read && m.sender === 'CLIENT').length;
  const pendingOrdersCount = orders.filter(o => o.orderStatus === 'PENDENTE').length;
  const wishlistMatchesCount = wishlists.filter(w => w.status === 'PECA_CHEGOU_AVISAR').length;

  // Handle advance status of condicional box
  const handleAdvanceStatus = (boxId: string, nextStatus: CondicionalStatus) => {
    setCondicionais(prev => prev.map(box => {
      if (box.id !== boxId) return box;

      let updated = { ...box, status: nextStatus };
      if (nextStatus === 'AGENDADO') {
        updated.scheduledForDate = new Date(Date.now() + 24 * 3600 * 1000).toISOString();
        showToast(`Mala ${box.code} agendada para saída com o cliente!`);
      } else if (nextStatus === 'ENVIADO') {
        updated.sentAt = new Date().toISOString();
        showToast(`Mala ${box.code} despachada com Motorista VIP Ravi's!`);
      } else if (nextStatus === 'EM_TESTE') {
        updated.deadlineDate = new Date(Date.now() + 7 * 24 * 3600 * 1000).toISOString();
        updated.daysRemaining = 7;
        updated.hoursRemaining = 168;
        showToast(`Mala entregue ao cliente! Timer de 7 dias de prova iniciado.`);
      }
      return updated;
    }));
  };

  // Handle complete condicional checkout
  const handleCompleteCheckout = (
    boxId: string,
    updatedItems: CondicionalItem[],
    finalSoldValue: number,
    paymentMethod: string,
    outcome: CondicionalFinalOutcome
  ) => {
    const box = condicionais.find(b => b.id === boxId);
    if (!box) return;

    // Update box state
    setCondicionais(prev => prev.map(b => {
      if (b.id !== boxId) return b;
      return {
        ...b,
        status: 'FINALIZADO',
        finalOutcome: outcome,
        items: updatedItems,
        soldValue: finalSoldValue
      };
    }));

    // Identify bought and returned items
    const boughtItems = updatedItems.filter(i => i.status === 'COMPRADA');
    const returnedItems = updatedItems.filter(i => i.status === 'DEVOLVIDA');

    // Update client LTV, history and metrics
    setClients(prev => prev.map(c => {
      if (c.id !== box.clientId) return c;
      const newLtv = c.metrics.totalLtv + finalSoldValue;
      const newOrdersCount = finalSoldValue > 0 ? c.metrics.ordersCount + 1 : c.metrics.ordersCount;
      const totalCondicionais = Math.max(c.metrics.condicionaisCount, 1);
      const newConv = Math.round((newOrdersCount / totalCondicionais) * 100);

      const newPurchased = boughtItems.map((item, idx) => ({
        id: `pp-new-${Date.now()}-${idx}`,
        title: item.title,
        category: item.category,
        color: item.color || 'Padrão',
        fit: 'Sob medida',
        date: new Date().toISOString().split('T')[0],
        price: item.price
      }));

      const newReturned = returnedItems.map((item, idx) => ({
        id: `rp-new-${Date.now()}-${idx}`,
        title: item.title,
        category: item.category,
        size: item.size,
        reason: item.returnReason || item.returnReasonCategory || 'Não ajustou',
        date: new Date().toISOString().split('T')[0]
      }));

      const checkoutTimelineItem = {
        id: `tl-check-${Date.now()}`,
        type: 'CONDICIONAL' as any,
        title: `Mala ${box.code} Finalizada (${outcome === 'COMPRADO_INTEIRO' ? 'Comprada 100%' : outcome === 'COMPRADO_PARCIAL' ? 'Comprada Parcial' : 'Devolvida Total'})`,
        description: `Faturado: ${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(finalSoldValue)} via ${paymentMethod}. ${returnedItems.length} peça(s) recolhidas.`,
        timestamp: new Date().toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' })
      };

      return {
        ...c,
        metrics: {
          ...c.metrics,
          totalLtv: newLtv,
          ordersCount: newOrdersCount,
          condicionalConversionRate: newConv,
          averageTicket: newOrdersCount > 0 ? Math.round(newLtv / newOrdersCount) : c.metrics.averageTicket,
          lastInteractionDate: new Date().toISOString()
        },
        purchasedPieces: [...newPurchased, ...c.purchasedPieces],
        returnedPieces: [...newReturned, ...c.returnedPieces],
        timeline: [checkoutTimelineItem, ...(c.timeline || [])]
      };
    }));

    // Adjust product inventory: release reserved and decrement total for sold items
    setProducts(prev => prev.map(p => {
      const boxItemsForProduct = updatedItems.filter(i => i.productId === p.id);
      if (boxItemsForProduct.length === 0) return p;

      const newStockBySize = { ...p.stockBySize };
      boxItemsForProduct.forEach(item => {
        const currentSizeStock = newStockBySize[item.size];
        if (currentSizeStock) {
          if (item.status === 'COMPRADA') {
            newStockBySize[item.size] = {
              total: Math.max(0, currentSizeStock.total - 1),
              reserved: Math.max(0, currentSizeStock.reserved - 1),
              available: currentSizeStock.available
            };
          } else {
            newStockBySize[item.size] = {
              total: currentSizeStock.total,
              reserved: Math.max(0, currentSizeStock.reserved - 1),
              available: currentSizeStock.available + 1
            };
          }
        }
      });

      return {
        ...p,
        stockBySize: newStockBySize
      };
    }));

    showToast(
      finalSoldValue > 0 
        ? `Fechamento concluído com sucesso! Venda de ${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(finalSoldValue)} registrada via ${paymentMethod}.`
        : `Devolução das peças confirmada. Estoque restaurado no sistema.`
    );
  };

  // Handle create new condicional box
  const handleCreateNewBox = (newBox: CondicionalBox) => {
    setCondicionais([newBox, ...condicionais]);

    // Update inventory to reserve pieces
    setProducts(prev => prev.map(product => {
      const itemsForThisProduct = newBox.items.filter(i => i.productId === product.id);
      if (itemsForThisProduct.length === 0) return product;

      const updatedStockBySize = { ...product.stockBySize };
      itemsForThisProduct.forEach(item => {
        const sizeStock = updatedStockBySize[item.size];
        if (sizeStock) {
          updatedStockBySize[item.size] = {
            total: sizeStock.total,
            reserved: sizeStock.reserved + 1,
            available: Math.max(0, sizeStock.available - 1)
          };
        }
      });

      return {
        ...product,
        stockBySize: updatedStockBySize
      };
    }));

    // Increment client condicional count
    setClients(prev => prev.map(c => {
      if (c.id !== newBox.clientId) return c;
      const newTimelineItem = {
        id: `tl-box-${Date.now()}`,
        type: 'CONDICIONAL' as any,
        title: `Mala Condicional ${newBox.code} Criada`,
        description: `${newBox.items.length} peças selecionadas pelo curador ${newBox.curatorName}. Total: ${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(newBox.totalValue)}.`,
        timestamp: new Date().toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' })
      };

      return {
        ...c,
        metrics: {
          ...c.metrics,
          condicionaisCount: c.metrics.condicionaisCount + 1
        },
        timeline: [newTimelineItem, ...(c.timeline || [])]
      };
    }));

    showToast(`Mala ${newBox.code} montada com sucesso! Peças reservadas no estoque.`);
  };

  // Handle create new Order (PDV or Online) with AUTOMATIC STOCK DEDUCTION
  const handleCreateOrder = (newOrder: Order) => {
    setOrders(prev => [newOrder, ...prev]);

    // Automatic inventory deduction for each sold item
    setProducts(prev => prev.map(prod => {
      const itemsForProduct = newOrder.items.filter(i => i.productId === prod.id);
      if (itemsForProduct.length === 0) return prod;

      const updatedStockBySize = { ...prod.stockBySize };
      itemsForProduct.forEach(item => {
        const sizeObj = updatedStockBySize[item.size];
        if (sizeObj) {
          updatedStockBySize[item.size] = {
            total: Math.max(0, sizeObj.total - item.quantity),
            reserved: sizeObj.reserved,
            available: Math.max(0, sizeObj.available - item.quantity)
          };
        }
      });

      return {
        ...prod,
        stockBySize: updatedStockBySize
      };
    }));

    // Update client LTV and timeline if client registered
    if (newOrder.clientId && newOrder.clientId !== 'balcao' && newOrder.clientId !== 'online') {
      setClients(prev => prev.map(c => {
        if (c.id !== newOrder.clientId) return c;
        const newPurchased = newOrder.items.map((i, idx) => ({
          id: `pp-ord-${Date.now()}-${idx}`,
          title: i.title,
          category: i.category,
          color: i.color,
          fit: 'Regular Fit',
          date: new Date().toISOString().split('T')[0],
          price: i.unitPrice
        }));

        const newTimelineEvent = {
          id: `tl-ord-${Date.now()}`,
          type: 'PAGAMENTO' as any,
          title: `Pedido ${newOrder.code} (${newOrder.channel === 'PDV_CANOINHAS' ? 'PDV Loja' : 'Online'})`,
          description: `Venda de ${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(newOrder.totalValue)} finalizada via ${newOrder.paymentMethod}. Atendente: ${newOrder.curatorName}.`,
          timestamp: new Date().toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' })
        };

        return {
          ...c,
          metrics: {
            ...c.metrics,
            totalLtv: c.metrics.totalLtv + newOrder.totalValue,
            ordersCount: c.metrics.ordersCount + 1,
            lastInteractionDate: new Date().toISOString()
          },
          purchasedPieces: [...newPurchased, ...c.purchasedPieces],
          timeline: [newTimelineEvent, ...(c.timeline || [])]
        };
      }));
    }

    showToast(
      `Pedido ${newOrder.code} criado (${newOrder.channel === 'PDV_CANOINHAS' ? 'PDV Canoinhas' : 'Canal Online'})! Baixa automática efetuada no estoque.`
    );
  };

  // Handle update order status
  const handleUpdateOrderStatus = (orderId: string, newStatus: OrderStatus) => {
    setOrders(prev => prev.map(o => {
      if (o.id !== orderId) return o;
      return {
        ...o,
        orderStatus: newStatus,
        paymentStatus: newStatus === 'PAGO' || newStatus === 'ENVIADO' || newStatus === 'ENTREGUE' ? 'PAGO' : o.paymentStatus,
        paidAt: (newStatus === 'PAGO' || newStatus === 'ENVIADO' || newStatus === 'ENTREGUE') && !o.paidAt ? new Date().toISOString() : o.paidAt,
        deliveredAt: newStatus === 'ENTREGUE' && !o.deliveredAt ? new Date().toISOString() : o.deliveredAt
      };
    }));
    showToast(`Status do pedido atualizado para ${newStatus}!`);
  };

  // Handle create wishlist item
  const handleCreateWishlist = (newWish: WishlistItem) => {
    setWishlists(prev => [newWish, ...prev]);
    showToast(`Desejo de ${newWish.clientName} registrado na lista de curadoria reversa!`);
  };

  // Handle update wishlist status
  const handleUpdateWishlistStatus = (id: string, status: WishlistStatus) => {
    setWishlists(prev => prev.map(w => w.id === id ? { ...w, status, notifiedAt: new Date().toISOString() } : w));
    showToast(`Status da lista de desejos atualizado!`);
  };

  // Handle batch import from Pomelli Photoshoot
  const handleBatchImportPomelli = (imported: Product[]) => {
    setProducts(prev => {
      const existingIds = new Set(prev.map(p => p.id));
      const newlyAdded = imported.filter(p => !existingIds.has(p.id));
      return [...newlyAdded, ...prev];
    });

    // Check matches against wishlists
    setWishlists(prev => prev.map(w => {
      if (w.status === 'AGUARDANDO_CURADORIA') {
        const match = imported.find(p => 
          p.category.toLowerCase().includes(w.categoryRequested.toLowerCase()) || 
          w.categoryRequested.toLowerCase().includes(p.category.toLowerCase())
        );
        if (match) {
          return {
            ...w,
            status: 'PECA_CHEGOU_AVISAR',
            matchedProductId: match.id,
            matchedProductTitle: match.title,
            matchedProductImage: match.imageUrl
          };
        }
      }
      return w;
    }));

    showToast(`${imported.length} peças do Photoshoot do Pomelli importadas com estoque por tamanho!`);
  };

  // Handle trigger reminder
  const handleTriggerReminder = (boxId: string, reminderType: 'day3' | 'day6' | 'curatorAlert') => {
    const targetBox = condicionais.find(b => b.id === boxId);
    if (!targetBox) return;

    let reminderTitle = '';
    let reminderText = '';

    if (reminderType === 'day3') {
      reminderTitle = 'Lembrete Automático Dia 3 (Consultoria de Caimento)';
      reminderText = `Olá ${targetBox.clientName.split(' ')[0]}! Aqui é o ${targetBox.curatorName.split(' ')[0]} da Ravi's. Passando para checar se as peças serviram perfeitamente com o caimento desejado. Precisou de algum ajuste?`;
    } else if (reminderType === 'day6') {
      reminderTitle = 'Lembrete Automático Dia 6 (Aviso Prévio de Recolhimento)';
      reminderText = `Olá ${targetBox.clientName.split(' ')[0]}! Seu período de 7 dias de teste da mala ${targetBox.code} encerra amanhã. Nosso motorista pode passar no mesmo endereço para recolher as peças não escolhidas?`;
    } else {
      reminderTitle = 'Alerta Interno do Curador (Vencendo em 2 Dias)';
      reminderText = `[ALERTA CURADORIA] A mala ${targetBox.code} de ${targetBox.clientName} está a 48h do prazo de recolhimento. Fazer contato ativo.`;
    }

    setCondicionais(prev => prev.map(b => {
      if (b.id !== boxId) return b;
      const updatedReminders = { ...b.reminders };
      if (reminderType === 'day3') {
        updatedReminders.day3Sent = true;
        updatedReminders.day3SentAt = new Date().toISOString();
      } else if (reminderType === 'day6') {
        updatedReminders.day6Sent = true;
        updatedReminders.day6SentAt = new Date().toISOString();
      } else {
        updatedReminders.curatorAlertSent = true;
        updatedReminders.curatorAlertSentAt = new Date().toISOString();
      }

      const newLogEntry = {
        messageType: reminderTitle,
        sentAt: new Date().toISOString(),
        status: 'ENVIADO' as const,
        previewSnippet: reminderText
      };

      return {
        ...b,
        reminders: updatedReminders,
        whatsappLog: [newLogEntry, ...(b.whatsappLog || [])]
      };
    }));

    const newMsg: UnifiedMessage = {
      id: `msg-rem-${Date.now()}`,
      channel: 'WHATSAPP',
      clientId: targetBox.clientId,
      clientName: targetBox.clientName,
      clientPhone: targetBox.clientPhone,
      sender: 'CURATOR',
      content: reminderText,
      timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      read: true,
      linkedCondicionalId: targetBox.id
    };
    setMessages(prev => [...prev, newMsg]);

    showToast(`Lembrete disparado com sucesso para ${targetBox.clientName}!`);
  };

  // Handle client receipt confirmation
  const handleConfirmClientReceipt = (boxId: string) => {
    const targetBox = condicionais.find(b => b.id === boxId);
    if (!targetBox) return;

    setCondicionais(prev => prev.map(b => {
      if (b.id !== boxId) return b;
      return {
        ...b,
        isConfirmedByClient: true,
        confirmedAt: new Date().toISOString()
      };
    }));

    setClients(prev => prev.map(c => {
      if (c.id !== targetBox.clientId) return c;
      const confirmTimelineItem = {
        id: `tl-conf-${Date.now()}`,
        type: 'CONDICIONAL' as any,
        title: `Mala ${targetBox.code} Confirmada pelo Cliente`,
        description: `Cliente acessou o link self-service e confirmou o recebimento das peças no endereço de Canoinhas.`,
        timestamp: new Date().toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' })
      };
      return {
        ...c,
        timeline: [confirmTimelineItem, ...(c.timeline || [])]
      };
    }));

    showToast(`Cliente confirmou o recebimento da mala ${targetBox.code}!`);
  };

  // Handle WhatsApp simulation dispatch
  const handleSendWhatsAppSimulation = (boxId: string, messageText: string) => {
    const targetBox = condicionais.find(b => b.id === boxId);
    if (!targetBox) return;

    const newLogEntry = {
      messageType: 'Disparo de Seleção de Condicional com Fotos & Link',
      sentAt: new Date().toISOString(),
      status: 'ENVIADO' as const,
      previewSnippet: messageText.slice(0, 80) + '...'
    };

    setCondicionais(prev => prev.map(b => {
      if (b.id !== boxId) return b;
      return {
        ...b,
        whatsappLog: [newLogEntry, ...(b.whatsappLog || [])]
      };
    }));

    const newMsg: UnifiedMessage = {
      id: `msg-sim-${Date.now()}`,
      channel: 'WHATSAPP',
      clientId: targetBox.clientId,
      clientName: targetBox.clientName,
      clientPhone: targetBox.clientPhone,
      sender: 'CURATOR',
      content: messageText,
      timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      read: true,
      linkedCondicionalId: targetBox.id
    };
    setMessages(prev => [...prev, newMsg]);

    showToast(`WhatsApp disparado via Evolution API para ${targetBox.clientName}!`);
  };

  // Handle add client
  const handleAddClient = (newClient: Client) => {
    setClients([newClient, ...clients]);
    showToast(`Cliente ${newClient.name} cadastrado com sucesso!`);
  };

  // Handle add product
  const handleAddProduct = (newProduct: Product) => {
    setProducts([newProduct, ...products]);
    showToast(`Peça de edição limitada ${newProduct.title} adicionada ao catálogo!`);
  };

  // Handle import multiple WhatsApp clients
  const handleImportWhatsAppClients = (imported: Client[]) => {
    setClients([...imported, ...clients]);
    showToast(`${imported.length} cliente(s) importados do WhatsApp Business com sucesso!`);
  };

  // Handle inline message sending from 360 profile
  const handleSendMessageInline = (clientId: string, content: string, channel: 'WHATSAPP' | 'INSTAGRAM' | 'EMAIL') => {
    const client = clients.find(c => c.id === clientId);
    const newMsg: UnifiedMessage = {
      id: `msg-${Date.now()}`,
      channel: channel === 'EMAIL' ? 'WHATSAPP' : channel,
      clientId,
      clientName: client?.name || 'Cliente',
      clientPhone: client?.phone || '',
      sender: 'CURATOR',
      content,
      timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      read: true
    };
    setMessages(prev => [...prev, newMsg]);

    setClients(prev => prev.map(c => {
      if (c.id !== clientId) return c;
      const newTimelineItem = {
        id: `tl-msg-${Date.now()}`,
        type: channel as any,
        title: `Mensagem enviada via ${channel}`,
        description: content,
        timestamp: new Date().toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' })
      };
      return {
        ...c,
        timeline: [newTimelineItem, ...(c.timeline || [])],
        metrics: {
          ...c.metrics,
          lastInteractionDate: new Date().toISOString()
        }
      };
    }));

    showToast(`Mensagem enviada via ${channel} para ${client?.name}!`);
  };

  // Handle custom tags
  const handleAddCustomTag = (clientId: string, tag: string) => {
    setClients(prev => prev.map(c => {
      if (c.id !== clientId) return c;
      if (c.customTags.includes(tag)) return c;
      return {
        ...c,
        customTags: [...c.customTags, tag]
      };
    }));
    showToast(`Tag "${tag}" adicionada!`);
  };

  const handleRemoveCustomTag = (clientId: string, tag: string) => {
    setClients(prev => prev.map(c => {
      if (c.id !== clientId) return c;
      return {
        ...c,
        customTags: c.customTags.filter(t => t !== tag)
      };
    }));
  };

  // Handle send message from inbox / automation
  const handleSendMessage = (clientId: string, content: string, channel: MessageChannel, assignedAgent?: string) => {
    const client = clients.find(c => c.id === clientId);
    const newMsg: UnifiedMessage = {
      id: `msg-${Date.now()}`,
      channel,
      clientId,
      clientName: client?.name || 'Cliente',
      clientPhone: client?.phone || '',
      sender: assignedAgent === 'Sistema Automação' ? 'SYSTEM' : 'CURATOR',
      content,
      timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      read: true,
      assignedAgent: assignedAgent || 'Matheus (Consultor Sênior)',
      status: 'ENVIADO'
    };
    setMessages(prev => [...prev, newMsg]);

    // Update client timeline
    setClients(prev => prev.map(c => {
      if (c.id !== clientId) return c;
      const newTimelineItem = {
        id: `tl-msg-${Date.now()}`,
        type: channel as any,
        title: `Mensagem ${channel} (${assignedAgent || 'Curador'})`,
        description: content,
        timestamp: new Date().toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' })
      };
      return {
        ...c,
        timeline: [newTimelineItem, ...(c.timeline || [])],
        metrics: {
          ...c.metrics,
          lastInteractionDate: new Date().toISOString()
        }
      };
    }));

    showToast(`Mensagem enviada com sucesso para ${client?.name}!`);
  };

  const handleOpenNewCondicionalForClient = (client: Client) => {
    setSelectedClientIdFor360(client.id);
    setIsNewBoxModalOpen(true);
  };

  const selectedClient360 = clients.find(c => c.id === selectedClientIdFor360);
  const clientCondicionais = selectedClient360 
    ? condicionais.filter(b => b.clientId === selectedClient360.id) 
    : [];

  return (
    <div className="min-h-screen bg-[#0c0e12] text-neutral-100 flex flex-col font-sans selection:bg-[#c99738]/30 selection:text-white">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-4 right-4 z-50 bg-[#161c28] border border-[#c99738]/50 text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2.5 text-xs animate-in fade-in slide-in-from-top-2">
          <span className="w-2 h-2 rounded-full bg-[#c99738] animate-ping" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Header */}
      <Header
        isMobileSimulator={isMobileSimulator}
        onToggleSimulator={() => setIsMobileSimulator(!isMobileSimulator)}
        onOpenNewCondicional={() => setIsNewBoxModalOpen(true)}
        onOpenVisionDoc={() => setCurrentTab('vision')}
        onOpenArchitecture={() => setCurrentTab('architecture')}
        onOpenDesignSystem={() => setCurrentTab('design-system')}
        onOpenRoadmap={() => setCurrentTab('roadmap')}
        onOpenAICurator={() => setIsAICuratorModalOpen(true)}
        activeCondicionaisCount={activeCondicionais.length}
        totalInTransit={totalInTransitValue}
      />

      {/* Navigation Top (Desktop) */}
      <Navigation
        currentTab={currentTab}
        onSelectTab={(tab) => {
          setCurrentTab(tab);
          if (tab === 'clients') {
            setSelectedClientIdFor360(null);
          }
        }}
        activeCondicionaisCount={activeCondicionais.length}
        unreadMessagesCount={unreadMessagesCount}
        ordersCount={pendingOrdersCount}
        wishlistMatchesCount={wishlistMatchesCount}
      />

      {/* Main Workspace with Mobile Simulator Support */}
      <main className="flex-1 p-3 sm:p-5 max-w-7xl mx-auto w-full pb-20 md:pb-6">
        {isMobileSimulator ? (
          /* Mobile Simulator Frame (iPhone 15 Pro form-factor) */
          <div className="flex flex-col items-center justify-center py-2">
            <div className="text-center mb-3">
              <span className="text-xs uppercase tracking-widest text-[#c99738] font-bold">
                📱 Simulador Mobile Chão de Loja & WhatsApp
              </span>
              <p className="text-[11px] text-neutral-400">
                Experiência 100% responsiva otimizada para o consultor em movimento
              </p>
            </div>

            <div className="w-[390px] h-[810px] bg-[#0c0e12] rounded-[48px] border-[10px] border-[#252c3b] shadow-2xl overflow-hidden flex flex-col relative">
              {/* Dynamic Island */}
              <div className="h-7 bg-[#1c2230] flex items-center justify-center shrink-0">
                <div className="w-24 h-4 bg-black rounded-full" />
              </div>

              {/* Mobile Content Scrollable Area */}
              <div className="flex-1 overflow-y-auto p-3 text-xs">
                {currentTab === 'condicional' && (
                  <CondicionalKanban
                    condicionais={condicionais}
                    clients={clients}
                    products={products}
                    onAdvanceStatus={handleAdvanceStatus}
                    onOpenCheckout={(box) => setSelectedBoxForCheckout(box)}
                    onOpenDetails={(box) => setSelectedBoxForDetails(box)}
                    onOpenNewBox={() => setIsNewBoxModalOpen(true)}
                    onSendWhatsAppModal={(box) => setSelectedBoxForWhatsApp(box)}
                    onTriggerReminder={handleTriggerReminder}
                    onSelectClient={(cId) => {
                      setSelectedClientIdFor360(cId);
                      setCurrentTab('clients');
                    }}
                  />
                )}

                {currentTab === 'clients' && (
                  selectedClient360 ? (
                    <div>
                      <button
                        onClick={() => setSelectedClientIdFor360(null)}
                        className="text-xs text-[#c99738] mb-3 flex items-center gap-1 font-medium"
                      >
                        ← Voltar para lista de clientes
                      </button>
                      <ClientProfile360
                        client={selectedClient360}
                        clientCondicionais={clientCondicionais}
                        clientMessages={messages.filter(m => m.clientId === selectedClient360.id)}
                        onOpenNewBoxForClient={handleOpenNewCondicionalForClient}
                        onSendWhatsApp={(phone) => {
                          const clean = phone.replace(/\D/g, '');
                          window.open(`https://wa.me/55${clean}`, '_blank');
                        }}
                        onSendMessageInline={handleSendMessageInline}
                        onAddCuratorNote={(clientId, note) => {
                          setClients(prev => prev.map(c => c.id === clientId ? { ...c, curatorNotes: [...c.curatorNotes, note] } : c));
                          showToast('Nota adicionada!');
                        }}
                        onAddCustomTag={handleAddCustomTag}
                        onRemoveCustomTag={handleRemoveCustomTag}
                      />
                    </div>
                  ) : (
                    <ClientList
                      clients={clients}
                      selectedClientId={selectedClientIdFor360}
                      onSelectClient={(c) => setSelectedClientIdFor360(c.id)}
                      onOpenNewClientModal={() => setIsNewClientModalOpen(true)}
                      onOpenWhatsAppImportModal={() => setIsWhatsAppImportModalOpen(true)}
                      onOpenNewCondicionalForClient={handleOpenNewCondicionalForClient}
                    />
                  )
                )}

                {currentTab === 'orders' && (
                  <OrdersView
                    orders={orders}
                    clients={clients}
                    products={products}
                    onCreateOrder={handleCreateOrder}
                    onUpdateOrderStatus={handleUpdateOrderStatus}
                  />
                )}

                {currentTab === 'catalog' && (
                  <CatalogView
                    products={products}
                    onOpenNewProductModal={() => setIsNewProductModalOpen(true)}
                    onOpenNewCondicional={() => setIsNewBoxModalOpen(true)}
                    onBatchImportPomelli={handleBatchImportPomelli}
                  />
                )}

                {currentTab === 'wishlist' && (
                  <WishlistView
                    wishlists={wishlists}
                    clients={clients}
                    products={products}
                    onCreateWishlist={handleCreateWishlist}
                    onUpdateWishlistStatus={handleUpdateWishlistStatus}
                    onOpenCondicionalForClient={handleOpenNewCondicionalForClient}
                  />
                )}

                {currentTab === 'inbox' && (
                  <UnifiedInbox
                    messages={messages}
                    clients={clients}
                    condicionais={condicionais}
                    products={products}
                    onSendMessage={handleSendMessage}
                    onOpenCondicionalForClient={handleOpenNewCondicionalForClient}
                    onSelectClientFor360={(clientId) => {
                      setSelectedClientIdFor360(clientId);
                      setCurrentTab('clients');
                    }}
                    onOpenVisionDoc={() => setCurrentTab('vision')}
                  />
                )}

                {currentTab === 'analytics' && (
                  <AnalyticsDashboard
                    analytics={analytics}
                    condicionais={condicionais}
                    clients={clients}
                    products={products}
                  />
                )}

                {currentTab === 'curator-app' && (
                  <CuratorMobileApp
                    clients={clients}
                    products={products}
                    condicionais={condicionais}
                    onOpenCondicionalForClient={handleOpenNewCondicionalForClient}
                    onCreateCondicionalBox={handleCreateNewBox}
                    onAdvanceCondicionalStatus={handleAdvanceStatus}
                  />
                )}

                {currentTab === 'vision' && (
                  <VisionDocumentView />
                )}

                {currentTab === 'architecture' && (
                  <TechnicalArchitectureView />
                )}

                {currentTab === 'design-system' && (
                  <DesignSystemWireframesView />
                )}

                {currentTab === 'roadmap' && (
                  <RoadmapDeliveryView />
                )}
              </div>
            </div>
          </div>
        ) : (
          /* Normal Full Desktop/Tablet View */
          <div>
            {currentTab === 'condicional' && (
              <CondicionalKanban
                condicionais={condicionais}
                clients={clients}
                products={products}
                onAdvanceStatus={handleAdvanceStatus}
                onOpenCheckout={(box) => setSelectedBoxForCheckout(box)}
                onOpenDetails={(box) => setSelectedBoxForDetails(box)}
                onOpenNewBox={() => setIsNewBoxModalOpen(true)}
                onSendWhatsAppModal={(box) => setSelectedBoxForWhatsApp(box)}
                onTriggerReminder={handleTriggerReminder}
                onSelectClient={(cId) => {
                  setSelectedClientIdFor360(cId);
                  setCurrentTab('clients');
                }}
              />
            )}

            {currentTab === 'clients' && (
              selectedClient360 ? (
                <div className="space-y-4">
                  <button
                    onClick={() => setSelectedClientIdFor360(null)}
                    className="text-xs text-[#c99738] hover:underline flex items-center gap-1 font-medium"
                  >
                    ← Voltar para lista de clientes
                  </button>
                  <ClientProfile360
                    client={selectedClient360}
                    clientCondicionais={clientCondicionais}
                    clientMessages={messages.filter(m => m.clientId === selectedClient360.id)}
                    onOpenNewBoxForClient={handleOpenNewCondicionalForClient}
                    onSendWhatsApp={(phone) => {
                      const clean = phone.replace(/\D/g, '');
                      window.open(`https://wa.me/55${clean}`, '_blank');
                    }}
                    onSendMessageInline={handleSendMessageInline}
                    onAddCuratorNote={(clientId, note) => {
                      setClients(prev => prev.map(c => c.id === clientId ? { ...c, curatorNotes: [...c.curatorNotes, note] } : c));
                      showToast('Nota de curadoria registrada.');
                    }}
                    onAddCustomTag={handleAddCustomTag}
                    onRemoveCustomTag={handleRemoveCustomTag}
                  />
                </div>
              ) : (
                <ClientList
                  clients={clients}
                  selectedClientId={selectedClientIdFor360}
                  onSelectClient={(c) => setSelectedClientIdFor360(c.id)}
                  onOpenNewClientModal={() => setIsNewClientModalOpen(true)}
                  onOpenWhatsAppImportModal={() => setIsWhatsAppImportModalOpen(true)}
                  onOpenNewCondicionalForClient={handleOpenNewCondicionalForClient}
                />
              )
            )}

            {currentTab === 'orders' && (
              <OrdersView
                orders={orders}
                clients={clients}
                products={products}
                onCreateOrder={handleCreateOrder}
                onUpdateOrderStatus={handleUpdateOrderStatus}
              />
            )}

            {currentTab === 'catalog' && (
              <CatalogView
                products={products}
                onOpenNewProductModal={() => setIsNewProductModalOpen(true)}
                onOpenNewCondicional={() => setIsNewBoxModalOpen(true)}
                onBatchImportPomelli={handleBatchImportPomelli}
              />
            )}

            {currentTab === 'wishlist' && (
              <WishlistView
                wishlists={wishlists}
                clients={clients}
                products={products}
                onCreateWishlist={handleCreateWishlist}
                onUpdateWishlistStatus={handleUpdateWishlistStatus}
                onOpenCondicionalForClient={handleOpenNewCondicionalForClient}
              />
            )}

            {currentTab === 'inbox' && (
              <UnifiedInbox
                messages={messages}
                clients={clients}
                condicionais={condicionais}
                products={products}
                onSendMessage={handleSendMessage}
                onOpenCondicionalForClient={handleOpenNewCondicionalForClient}
                onSelectClientFor360={(clientId) => {
                  setSelectedClientIdFor360(clientId);
                  setCurrentTab('clients');
                }}
                onOpenVisionDoc={() => setCurrentTab('vision')}
              />
            )}

            {currentTab === 'analytics' && (
              <AnalyticsDashboard
                analytics={analytics}
                condicionais={condicionais}
                clients={clients}
                products={products}
              />
            )}

            {currentTab === 'curator-app' && (
              <div className="py-2 flex flex-col items-center">
                <div className="text-center mb-4">
                  <span className="text-xs uppercase tracking-widest text-[#c99738] font-bold">
                    📱 App Mobile do Curador & Atendente (PWA Offline-First)
                  </span>
                  <p className="text-[11px] text-neutral-400">
                    Otimizado para chão de loja em Canoinhas-SC, scanner de SKU, câmera de lookbook e PDV rápido
                  </p>
                </div>
                <CuratorMobileApp
                  clients={clients}
                  products={products}
                  condicionais={condicionais}
                  onOpenCondicionalForClient={handleOpenNewCondicionalForClient}
                  onCreateCondicionalBox={handleCreateNewBox}
                  onAdvanceCondicionalStatus={handleAdvanceStatus}
                />
              </div>
            )}

            {currentTab === 'vision' && (
              <VisionDocumentView />
            )}

            {currentTab === 'architecture' && (
              <TechnicalArchitectureView />
            )}

            {currentTab === 'design-system' && (
              <DesignSystemWireframesView />
            )}

            {currentTab === 'roadmap' && (
              <RoadmapDeliveryView />
            )}
          </div>
        )}
      </main>

      {/* Modals & Drawers */}
      <NewCondicionalModal
        clients={clients}
        products={products}
        isOpen={isNewBoxModalOpen}
        onClose={() => setIsNewBoxModalOpen(false)}
        onCreateBox={handleCreateNewBox}
      />

      <CheckoutCondicionalModal
        box={selectedBoxForCheckout}
        isOpen={!!selectedBoxForCheckout}
        onClose={() => setSelectedBoxForCheckout(null)}
        onCompleteCheckout={handleCompleteCheckout}
      />

      <CondicionalDetailDrawer
        box={selectedBoxForDetails}
        isOpen={!!selectedBoxForDetails}
        onClose={() => setSelectedBoxForDetails(null)}
        onOpenCheckout={(b) => setSelectedBoxForCheckout(b)}
        onAdvanceStatus={handleAdvanceStatus}
        onSendWhatsAppModal={(b) => setSelectedBoxForWhatsApp(b)}
        onTriggerReminder={handleTriggerReminder}
        onConfirmClientReceipt={handleConfirmClientReceipt}
      />

      <WhatsAppCondicionalModal
        box={selectedBoxForWhatsApp}
        isOpen={!!selectedBoxForWhatsApp}
        onClose={() => setSelectedBoxForWhatsApp(null)}
        onSendSimulation={handleSendWhatsAppSimulation}
        onConfirmClientReceipt={handleConfirmClientReceipt}
      />

      <NewClientModal
        isOpen={isNewClientModalOpen}
        onClose={() => setIsNewClientModalOpen(false)}
        onAddClient={handleAddClient}
      />

      <WhatsAppImportModal
        isOpen={isWhatsAppImportModalOpen}
        onClose={() => setIsWhatsAppImportModalOpen(false)}
        onImportClients={handleImportWhatsAppClients}
      />

      <NewProductModal
        isOpen={isNewProductModalOpen}
        onClose={() => setIsNewProductModalOpen(false)}
        onAddProduct={handleAddProduct}
      />

      <AICuratorModal
        clients={clients}
        products={products}
        isOpen={isAICuratorModalOpen}
        onClose={() => setIsAICuratorModalOpen(false)}
        onSelectCapsuleForBox={(client, productIds) => {
          setSelectedClientIdFor360(client.id);
          setIsNewBoxModalOpen(true);
        }}
      />
    </div>
  );
}
