import BuscarForm from '@/components/layout/buscarForm'
import MapaPopUp from '@/components/layout/mapaPopUp'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'

export default async function Inicio() {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  const products = [
  { id: '1', name: 'Jaqueta jeans', localization: 'Osasco-SP, Brasil' },
  { id: '2', name: 'Tênis Nike', localization: 'Cotia-SP, Brasil' },
]

  return (
    <main className='h-screen flex flex-col p-5'>
      {/* <h3>Usuario logado: {session?.user.name}</h3> */}
      <BuscarForm />
      <section className='bg-foreground/10'>
        <div className='flex justify-between items-center'>
          <h2 className='text-2xl text-(--text-gray)'>Itens próximos</h2>
          <MapaPopUp
            products={products}
            currentUserLocation={`${session?.user.city}, ${session?.user.state} - ${session?.user.country?.split('-')[0]}`} // vem do usuário logado
          />
          {/* <span className='underline text-accent text-xl'>Ver mapa</span> */}
        </div>
      </section>
    </main>
  )
}
