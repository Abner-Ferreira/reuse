import { salvarBiografia } from '@/actions/profile'
import { BiografiaField } from '@/components/layout/biografiaField'
import { LocalizacaoPopUp } from '@/components/layout/localizacaoPopUp'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { auth } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { ShoppingCart, Star } from 'lucide-react'
import { headers } from 'next/headers'

export default async function Perfil() {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  const user = await prisma.user.findUnique({
    where: { id: session?.user.id },
    select: { bio: true },
  })

  return (
    <main className='h-screen flex flex-col justify-center items-center '>
      <section className=' h-[40%] w-[70%] flex flex-col justify-evenly items-center'>
        <div>
          <Avatar className='h-30 w-30 '>
            <AvatarImage
              src={session?.user.image ?? ''}
              referrerPolicy='no-referrer'
            />
            <AvatarFallback className='text-4xl bg-primary text-(--text-white)'>
              {session?.user.name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </div>
        <h1 className='text-2xl font-semibold'>{session?.user.name}</h1>
        <div className='w-[50%]'>
          <BiografiaField
            initialBiografia={user?.bio ?? null}
            onSave={salvarBiografia}
          />
        </div>
        <div className='w-[50%] flex justify-between items-center h-10 mt-6 px-4'>
          <div className='flex gap-2 items-center'>
            <LocalizacaoPopUp
              currentLocation={{
                country: session?.user.country,
                state: session?.user.state,
                city: session?.user.city,
              }}
            />
          </div>
          <div className='flex gap-2 items-center'>
            <ShoppingCart className='h-5 w-5' />6 itens
          </div>
          <div className='flex gap-2 items-center'>
            <Star className='h-5 w-5' />
            4.5
          </div>
        </div>
      </section>
      
    </main>
  )
}
