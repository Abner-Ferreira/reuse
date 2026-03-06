'use server'

import { auth } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { headers } from 'next/headers'
import { UTApi } from 'uploadthing/server'

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

  revalidatePath('/feed')
}

export async function pegarTodosOsProdutos() {
  return await prisma.product.findMany({
    include: {
      author: {
        select: {
          city: true,
          state: true,
          country: true,
        },
      },
    },
  })
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

const utapi = new UTApi()

export async function editarProduto(data: {
  id: string
  images: string[]
  name: string
  description: string
  category: string
  stateOfConservation: string
  imagensAntigas: string[]
}) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user?.id) throw new Error('Não autorizado')

  const produto = await prisma.product.findUnique({
    where: { id: data.id },
    select: { authorId: true },
  })

  if (!produto) throw new Error('Produto não encontrado')
  if (produto.authorId !== session.user.id) throw new Error('Sem permissão')

  const removidas = data.imagensAntigas.filter(
    url => !data.images.includes(url)
  )
  const keysParaDeletar = removidas.map(url => url.split('/').pop()!)

  if (keysParaDeletar.length > 0) {
    await utapi.deleteFiles(keysParaDeletar)
  }

  await prisma.product.update({
    where: { id: data.id },
    data: {
      images: data.images,
      name: data.name,
      description: data.description,
      category: data.category,
      stateOfConservation: data.stateOfConservation,
    },
  })

  revalidatePath('/perfil')
}

export async function excluirProduto(id: string) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user?.id) throw new Error('Não autorizado')

  const produto = await prisma.product.findUnique({
    where: { id: id },
    select: { authorId: true, images: true },
  })

  if (!produto) throw new Error('Produto não encontrado')
  if (produto.authorId !== session.user.id) throw new Error('Sem permissão')

  const keys = produto.images.map(url => url.split('/').pop()!)
  if (keys.length > 0) {
    await utapi.deleteFiles(keys)
  }

  await prisma.product.delete({
    where: { id: id },
  })

  revalidatePath('/perfil')
}
