'use client'

import { pegarProdutoPorID } from '@/actions/products'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { ArrowLeft, MapPin, Tag } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

interface Author {
  name: string
  image?: string | null
  city?: string | null
  state?: string | null
  country?: string | null
}

interface Product {
  id: string
  name: string
  description: string
  category: string
  stateOfConservation: string
  images: string[]
  authorId: string
  author: Author
}

const conservationColor: Record<string, string> = {
  Novo: 'bg-primary text-primary-foreground hover:bg-primary',
  Seminovo: 'bg-muted-foreground text-[#F5F5F5] hover:bg-muted-foreground',
  'Muito usado':
    'bg-destructive text-destructive-foreground hover:bg-destructive',
}

export default function Produto() {
  const { id } = useParams()
  const router = useRouter()
  const [produto, setProduto] = useState<Product | null>(null)
  const [activeImage, setActiveImage] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const produtoId = Array.isArray(id) ? id[0] : id
    if (!produtoId) return
    pegarProdutoPorID(produtoId)
      .then(data => setProduto(data as Product))
      .finally(() => setIsLoading(false))
  }, [id])

  if (isLoading) {
    return (
      <main className='flex h-screen items-center justify-center'>
        <div className='h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent' />
      </main>
    )
  }

  if (!produto) {
    return (
      <main className='flex h-screen flex-col items-center justify-center gap-4'>
        <p className='text-muted-foreground'>Produto não encontrado.</p>
        <Button variant='outline' onClick={() => router.back()}>
          Voltar
        </Button>
      </main>
    )
  }

  const location =
    [produto.author?.city, produto.author?.state].filter(Boolean).join(', ') + ' - ' + produto.author.country ||
    'Localização desconhecida'

  return (
    <main className='min-h-screen bg-background'>
      <div className='px-4 sm:px-8 py-4 border-b'>
        <button
          onClick={() => router.back()}
          className='flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer'
        >
          <ArrowLeft className='h-4 w-4' />
          Voltar
        </button>
      </div>

      <div className='px-4 sm:px-8 py-8 max-w-6xl mx-auto'>
        <section className='flex flex-col lg:flex-row gap-8'>
          {/* Galeria */}
          <div className='w-full lg:w-[40%] flex flex-row gap-3'>
            {/* Miniaturas laterais */}
            <aside className='hidden sm:flex flex-col gap-2 w-16 lg:w-20 overflow-y-auto max-h-125'>
              {produto.images.map((image, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(i)}
                  className={`h-16 w-16 lg:h-20 lg:w-20 shrink-0 overflow-hidden rounded-lg border-2 transition-all ${
                    activeImage === i
                      ? 'border-primary'
                      : 'border-transparent opacity-50 hover:opacity-100'
                  }`}
                >
                  <img
                    src={image}
                    alt=''
                    className='h-full w-full object-cover'
                  />
                </button>
              ))}
            </aside>

            {/* Imagem principal + miniaturas horizontais */}
            <div className='flex flex-col gap-3 flex-1'>
              <div className='relative aspect-square overflow-hidden rounded-2xl bg-muted'>
                <img
                  src={produto.images[activeImage]}
                  alt={produto.name}
                  className='h-full w-full object-contain transition-opacity duration-200'
                />
              </div>

              {/* Miniaturas horizontais */}
              <div className='flex sm:hidden gap-2 overflow-x-auto pb-1'>
                {produto.images.map((image, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(i)}
                    className={`h-14 w-14 shrink-0 overflow-hidden rounded-lg border-2 transition-all ${
                      activeImage === i
                        ? 'border-primary'
                        : 'border-transparent opacity-50'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`Imagem ${produto.name.split(' ')[0]}`}
                      className='h-full w-full object-cover'
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Informações */}
          <div className='w-full lg:w-[60%] flex flex-col gap-5'>
            {/* Categoria */}
            <div className='flex items-center gap-1.5 text-muted-foreground'>
              <Tag className='h-3.5 w-3.5' />
              <span className='text-sm font-medium uppercase tracking-wide'>
                {produto.category}
              </span>
            </div>

            {/* Nome */}
            <h1 className='font-bold text-3xl sm:text-4xl lg:text-5xl text-foreground leading-tight'>
              {produto.name}
            </h1>

            <hr className='border-border' />

            {/* Descrição */}
            <p className='text-base sm:text-lg text-muted-foreground leading-relaxed text-justify'>
              {produto.description}
            </p>

            {/* Estado de conservação */}
            <p className='text-base sm:text-lg text-muted-foreground leading-relaxed text-justify'>Estado de conservação: {produto?.stateOfConservation}</p>

            <hr className='border-border' />

            {/* Vendedor */}
            <div className='flex items-center gap-3'>
              <Avatar className='h-11 w-11'>
                <AvatarImage
                  src={produto.author.image ?? ''}
                  referrerPolicy='no-referrer'
                />
                <AvatarFallback className='bg-primary text-primary-foreground'>
                  {produto.author.name?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className='flex flex-col'>
                <span className='text-sm font-semibold'>
                  {produto.author.name}
                </span>
                <div className='flex items-center gap-1 text-xs text-muted-foreground'>
                  <MapPin className='h-3 w-3' />
                  {location}
                </div>
              </div>
            </div>

            <Button size='lg' className='w-full sm:w-fit mt-2'>
              Solicitar negociação
            </Button>
          </div>
        </section>
      </div>
    </main>
  )
}
