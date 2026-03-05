'use server'

import { auth } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { headers } from 'next/headers'

export async function salvarProduto(data: {
  images: string[]
  name: string
  description: string
  category: string
  stateOfConservation: string
}) {
  const session = await auth.api.getSession({ headers: await headers() })

  if (!session?.user?.id) throw new Error('Não autorizado')

  await prisma.product.create({
    data: {
      images: data.images,
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
  })
}
export async function pegarProdutosPorCategoria(categoria: string) {
  return await prisma.product.findMany({
    where: { category: categoria },
  })
}

export async function pegarProdutoPorID(id: string) {
  return await prisma.product.findUnique({
    where: { id: id },
    include: {
      author: {
        select: {
          name: true,
          image: true,
          city: true,
          state: true,
          country: true,
        },
      },
    },
  })
}
