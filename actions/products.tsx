'use server'

import { auth } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { headers } from 'next/headers'

export async function salvarPublicacao(data: {
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
      
    }
  })
}
