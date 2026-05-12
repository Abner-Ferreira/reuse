'use client'

import { pegarTodosOsProdutos } from '@/actions/products'
import { pegarLocalizacaoUsuario } from '@/actions/profile'
import BuscarForm from '@/components/layout/buscarForm'
import MapaPopUp from '@/components/layout/mapaPopUp'
import { Badge, conservationColor } from '@/components/ui/badge'
import {
  Card,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Product } from '@/hooks/useGeocoding'
import { useEffect, useMemo, useState } from 'react'

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

interface SearchFilters {
  name: string
  localization: string
  category: string
  stateOfConservation: string
}

export default function Inicio() {
  const [produtos, setProdutos] = useState<ProdutoPrisma[]>([])
  const [localizacao, setLocalizacao] = useState<string | null>(null)

  const [filtros, setFiltros] = useState<SearchFilters>({
    name: '',
    localization: '',
    category: 'todas',
    stateOfConservation: 'todos',
  })

  useEffect(() => {
    async function carregarDados() {
      const [produtosData, localizacaoData] = await Promise.all([
        pegarTodosOsProdutos(),
        pegarLocalizacaoUsuario(),
      ])

      setProdutos(produtosData as ProdutoPrisma[])
      setLocalizacao(localizacaoData)
    }

    carregarDados()
  }, [])

  // Produtos próximos ao usuário
  const produtosProximos = useMemo(() => {
    if (!localizacao) return []

    const localizacaoNormalizada = localizacao.toLowerCase()

    return produtos.filter(produto => {
      const cidade = produto.author?.city?.toLowerCase()
      const estado = produto.author?.state?.toLowerCase()
      const pais = produto.author?.country?.toLowerCase()

      return (
        (cidade && localizacaoNormalizada.includes(cidade)) ||
        (estado && localizacaoNormalizada.includes(estado)) ||
        (pais && localizacaoNormalizada.includes(pais))
      )
    })
  }, [produtos, localizacao])

  // Busca/filtros
  const produtosFiltrados = useMemo(() => {
    return produtosProximos.filter(produto => {
      const matchName =
        !filtros.name ||
        produto.name
          .toLowerCase()
          .includes(filtros.name.toLowerCase())

      const matchCategory =
        filtros.category === 'todas' ||
        produto.category.toLowerCase() ===
          filtros.category.toLowerCase()

      const matchConservation =
        filtros.stateOfConservation === 'todos' ||
        produto.stateOfConservation.toLowerCase() ===
          filtros.stateOfConservation.toLowerCase()

      const localizacaoBusca =
        filtros.localization.toLowerCase()

      const matchLocation =
        !filtros.localization ||
        produto.author?.city
          ?.toLowerCase()
          .includes(localizacaoBusca) ||
        produto.author?.state
          ?.toLowerCase()
          .includes(localizacaoBusca) ||
        produto.author?.country
          ?.toLowerCase()
          .includes(localizacaoBusca)

      return (
        matchName &&
        matchCategory &&
        matchConservation &&
        matchLocation
      )
    })
  }, [produtosProximos, filtros])

  // Agrupar por categoria
  const produtosAgrupados = useMemo(() => {
    return produtosFiltrados.reduce<
      Record<string, ProdutoPrisma[]>
    >((acc, produto) => {
      if (!acc[produto.category]) {
        acc[produto.category] = []
      }

      acc[produto.category].push(produto)

      return acc
    }, {})
  }, [produtosFiltrados])

  console.log(produtosFiltrados)

  const produtosParaMapa: Product[] =
    produtosFiltrados.map(p => ({
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
    <main className='min-h-screen flex flex-col p-5'>
      <BuscarForm onSearch={setFiltros} />

      <section className='mt-8'>
        <div className='flex justify-between items-center'>
          <h2 className='text-2xl text-(--text-gray)'>
            Itens próximos
          </h2>

          {localizacao &&
            produtosFiltrados.length > 0 && (
              <MapaPopUp
                products={produtosParaMapa}
                currentUserLocation={localizacao}
              />
            )}
        </div>

        {produtosFiltrados.length === 0 ? (
          <div className='mt-6 rounded-xl border border-dashed p-10 text-center'>
            <p className='text-muted-foreground'>
              Não foi possível encontrar produtos
              com esses filtros.
            </p>
          </div>
        ) : (
          <div className='mt-8 space-y-10'>
            {Object.entries(produtosAgrupados).map(
              ([categoria, items]) => (
                <div key={categoria}>
                  <h3 className='mb-5 text-xl font-semibold capitalize'>
                    {categoria}
                  </h3>

                  <div className='grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3'>
                    {items.map(product => (
                      <Card
                        key={product.id}
                        className='relative overflow-hidden border-0 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl'
                      >
                        <Badge
                          className={`absolute right-4 top-4 z-40 text-sm px-3 py-1 ${conservationColor[product.stateOfConservation]}`}
                        >
                          {product.stateOfConservation}
                        </Badge>

                        <div className='relative h-[320px] w-full overflow-hidden'>
                          <img
                            src={product.images[0]}
                            alt={product.name}
                            className='h-full w-full object-cover transition-transform duration-300 hover:scale-105'
                          />
                        </div>

                        <CardHeader className='space-y-4 p-5'>
                          <div className='flex items-center justify-between gap-3'>
                            <CardTitle
                              className='line-clamp-1 text-xl font-semibold'
                              title={product.name}
                            >
                              {product.name}
                            </CardTitle>

                            <Badge variant='secondary'>
                              {product.category}
                            </Badge>
                          </div>
                        </CardHeader>
                      </Card>
                    ))}
                  </div>
                </div>
              )
            )}
          </div>
        )}
      </section>
    </main>
  )
}