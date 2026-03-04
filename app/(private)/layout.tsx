export const dynamic = "force-dynamic"

import Sidebar from '@/components/layout/siderbar'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'

export default async function PrivateLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  })


  if (!session) {
    redirect('/')
  }

  return (
    <div className='h-dvh w-dvw'>
      <Sidebar />
      <div className='sm:ml-20 sm:mr-3.5 md:px-20 md:py-10'>{children}</div>
    </div>
  )
}
