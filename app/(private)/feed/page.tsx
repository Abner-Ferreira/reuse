'use client'

import {
  pegarProdutosPorUsuario,
  pegarTodosOsProdutos,
} from '@/actions/products'
import PublicacaoPopUp from '@/components/layout/publicacaoPopUp'
import { Badge, conservationColor } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Tabs,
  TabsContent,
  TabsList,
  tabsListVariants,
  TabsTrigger,
} from '@/components/ui/tabs'
import { Filter } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'

interface Product {
  id: string
  name: string
  description: string
  category: string
  stateOfConservation: string
  images: string[]
  authorId: string
}

export default function Feed() {
  const [produtos, setProdutos] = useState<Product[]>([])
  const [activeTab, setActiveTab] = useState('Todas')

  useEffect(() => {
    pegarTodosOsProdutos().then(data => setProdutos(data))
  }, [])

  const produtosFiltrados =
    activeTab === 'Todas'
      ? produtos
      : produtos.filter(p => p.category === activeTab)

  return (
    <main className='flex flex-col w-full h-screen p-5'>
      <div className='self-end'>
        <PublicacaoPopUp type='criar'/>
      </div>

      <Tabs defaultValue='Todas' onValueChange={setActiveTab} className='mt-5'>
        <TabsList variant='line'>
          <TabsTrigger value='Todas'>Todas as publicações</TabsTrigger>
          <TabsTrigger value='Roupas'>Roupas</TabsTrigger>
          <TabsTrigger value='Sapatos'>Sapatos</TabsTrigger>
          <TabsTrigger value='Acessórios'>Acessórios</TabsTrigger>
        </TabsList>

        <section className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-10 w-full h-full mt-10'>
          {produtosFiltrados.map(product => (
            <Card
              key={product.id}
              className='relative mx-auto w-full max-w-sm pt-0 flex flex-col h-105'
            >
              <div className='absolute inset-0 z-30 aspect-video' />
              <Badge
                className={`absolute self-end m-2 z-40 ${conservationColor[product.stateOfConservation]}`}
              >
                {product.stateOfConservation}
              </Badge>
              <img
                src={product.images[0]}
                alt='Event cover'
                className='relative z-20 aspect-video w-full object-contain'
              />
              <CardHeader className='flex-1'>
                <CardAction>
                  <Badge variant={'secondary'}>{product.category}</Badge>
                </CardAction>
                <CardTitle className='line-clamp-2' title={product.name}>
                  {product.name}
                </CardTitle>
                <CardDescription className='line-clamp-2 overflow-hidden'>
                  {product.description}
                </CardDescription>
              </CardHeader>
              <CardFooter className='flex flex-row justify-evenly items-center'>
                <Button className='w-[40%]'>
                  <Link href={`/produtos/${product.id}`}>Ver produto</Link>
                </Button>
                <Button className='w-[40%]' variant={'outline'}>
                  <Link href={`/produtos/${product.id}`}>Abrir chat</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </section>
      </Tabs>
    </main>
  )
}
