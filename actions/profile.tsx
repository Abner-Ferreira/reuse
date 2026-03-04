'use server'

import { auth } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { headers } from 'next/headers'

export async function salvarBiografia(biografia: string) {
  const session = await auth.api.getSession({ headers: await headers() })

  if (!session?.user?.id) throw new Error('Não autorizado')

  await prisma.user.update({
    where: { id: session.user.id },
    data: { bio: biografia },
  })
}

export async function salvarLocalizacao(data: { country: string; state: string; city: string }) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user?.id) throw new Error('Não autorizado')

  await prisma.user.update({
    where: { id: session.user.id },
    data: { country: data.country, state: data.state, city: data.city },
  })
}


