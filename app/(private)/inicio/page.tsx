'use client'

import { pegarTodosOsProdutos } from '@/actions/products'
import { pegarLocalizacaoUsuario } from '@/actions/profile'
import BuscarForm from '@/components/layout/buscarForm'
import MapaPopUp from '@/components/layout/mapaPopUp'
import { Product } from '@/hooks/useGeocoding'
import { useEffect, useState } from 'react'

interface ProdutoPrisma {
  id: string
  name: string
  images: string[]
  category: string
  stateOfConservation: string
  author: {
    city: string | null
    state: string | null
    country: string | null
  }
}

export default function Inicio() {
  const [produtos, setProdutos] = useState<ProdutoPrisma[]>([])
  const [localizacao, setLocalizacao] = useState<string | null>(null)

  useEffect(() => {
    pegarTodosOsProdutos().then(data => setProdutos(data as ProdutoPrisma[]))
    pegarLocalizacaoUsuario().then(data => setLocalizacao(data))
  }, [])

  const produtosParaMapa: Product[] = produtos.map(p => ({
    id: p.id,
    name: p.name,
    city: p.author?.city ?? null,
    state: p.author?.state ?? null,
    country: p.author?.country ?? null,
    category: p.category,
    stateOfConservation: p.stateOfConservation,
    imageUrl: p.images[0],
  }))

  return (
    <main className='h-screen flex flex-col p-5'>
      <BuscarForm />
      <section className='bg-foreground/10'>
        <div className='flex justify-between items-center'>
          <h2 className='text-2xl text-(--text-gray)'>Itens próximos</h2>
          {localizacao && (
            <MapaPopUp
              products={produtosParaMapa}
              currentUserLocation={localizacao}
            />
          )}
        </div>
      </section>
    </main>
  )
}