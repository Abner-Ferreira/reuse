'use server'

import { auth } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { pusherServer } from '@/lib/pusher'
import { headers } from 'next/headers'
import { revalidatePath } from 'next/cache'

// Cria ou retorna uma conversa existente entre comprador e vendedor
export async function criarOuPegarConversa(productId: string, sellerId: string) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user?.id) throw new Error('Não autorizado')

  const buyerId = session.user.id

  if (buyerId === sellerId) throw new Error('Você não pode negociar com você mesmo')

  // Verifica se já existe uma conversa para esse produto com esse comprador
  const existing = await prisma.conversation.findUnique({
    where: {
      productId_buyerId: { productId, buyerId },
    },
  })

  if (existing) return existing

  // Cria nova conversa
  const conversation = await prisma.conversation.create({
    data: {
      productId,
      buyerId,
      sellerId,
    },
  })

  revalidatePath('/chat')
  return conversation
}

// Envia uma mensagem
export async function enviarMensagem(conversationId: string, content: string) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user?.id) throw new Error('Não autorizado')

  // Verifica se o usuário pertence à conversa
  const conversation = await prisma.conversation.findUnique({
    where: { id: conversationId },
  })

  if (!conversation) throw new Error('Conversa não encontrada')
  if (
    conversation.buyerId !== session.user.id &&
    conversation.sellerId !== session.user.id
  ) throw new Error('Sem permissão')

  if (conversation.status === 'closed') throw new Error('Conversa encerrada')

  const message = await prisma.message.create({
    data: {
      conversationId,
      authorId: session.user.id,
      content,
    },
    include: {
      author: {
        select: { id: true, name: true, image: true },
      },
    },
  })

  // Dispara evento em tempo real via Pusher
  await pusherServer.trigger(
    `conversation-${conversationId}`,
    'new-message',
    message
  )

  return message
}

// Busca mensagens de uma conversa
export async function pegarMensagens(conversationId: string) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user?.id) throw new Error('Não autorizado')

  const conversation = await prisma.conversation.findUnique({
    where: { id: conversationId },
    include: {
      messages: {
        orderBy: { createdAt: 'asc' },
        include: {
          author: {
            select: { id: true, name: true, image: true },
          },
        },
      },
      product: {
        select: { id: true, name: true, images: true },
      },
      buyer: {
        select: { id: true, name: true, image: true },
      },
      seller: {
        select: { id: true, name: true, image: true },
      },
    },
  })

  if (!conversation) throw new Error('Conversa não encontrada')
  if (
    conversation.buyerId !== session.user.id &&
    conversation.sellerId !== session.user.id
  ) throw new Error('Sem permissão')

  return conversation
}

// Busca todas as conversas do usuário logado
export async function pegarConversas() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user?.id) throw new Error('Não autorizado')

  return await prisma.conversation.findMany({
    where: {
      OR: [
        { buyerId: session.user.id },
        { sellerId: session.user.id },
      ],
    },
    include: {
      product: {
        select: { id: true, name: true, images: true },
      },
      buyer: {
        select: { id: true, name: true, image: true },
      },
      seller: {
        select: { id: true, name: true, image: true },
      },
      messages: {
        orderBy: { createdAt: 'desc' },
        take: 1, // só a última mensagem para preview
      },
    },
    orderBy: { createdAt: 'desc' },
  })
}

// Encerra a conversa (só o vendedor pode)
export async function encerrarConversa(conversationId: string) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user?.id) throw new Error('Não autorizado')

  const conversation = await prisma.conversation.findUnique({
    where: { id: conversationId },
  })

  if (!conversation) throw new Error('Conversa não encontrada')
  if (conversation.sellerId !== session.user.id) throw new Error('Só o vendedor pode encerrar')

  await prisma.conversation.update({
    where: { id: conversationId },
    data: { status: 'closed' },
  })

  // Notifica o comprador em tempo real
  await pusherServer.trigger(
    `conversation-${conversationId}`,
    'conversation-closed',
    { conversationId }
  )

  revalidatePath('/chat')
}

// Envia avaliação após encerrar
export async function avaliarVendedor(data: {
  conversationId: string
  rating: number
  comment?: string
}) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user?.id) throw new Error('Não autorizado')

  const conversation = await prisma.conversation.findUnique({
    where: { id: data.conversationId },
  })

  if (!conversation) throw new Error('Conversa não encontrada')
  if (conversation.buyerId !== session.user.id) throw new Error('Só o comprador pode avaliar')
  if (conversation.status !== 'closed') throw new Error('A conversa precisa estar encerrada')

  const review = await prisma.review.create({
    data: {
      conversationId: data.conversationId,
      reviewerId: session.user.id,
      reviewedId: conversation.sellerId,
      rating: data.rating,
      comment: data.comment,
    },
  })

  revalidatePath('/chat')
  return review
}