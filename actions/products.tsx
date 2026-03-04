'use server'

import { auth } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { headers } from 'next/headers'

export async function salvarProduto(data: {
  image?: string
  name: string
  description: string
  category: string
  stateOfConservation: string
}) {
  const session = await auth.api.getSession({ headers: await headers() })

  if (!session?.user?.id) throw new Error('Não autorizado')

  await prisma.product.create({
    data: {
      name: data.name,
      description: data.description,
      category: data.category,
      stateOfConservation: data.stateOfConservation,
      authorId: session.user.id,
    },
  })
}

export async function pegarTodosOsProdutos() {
  return await prisma.product.findMany()
}

export async function pegarProdutosPorUsuario(userId: string) {
  return await prisma.product.findMany({
    where: { authorId: userId },
    // select: { id: true, name: true, category: true },
  })
}
export async function pegarProdutosPorCategoria(categoria: string) {
  return await prisma.product.findMany({
    where: { category: categoria },
    // select: { id: true, name: true, category: true },
  })
}
