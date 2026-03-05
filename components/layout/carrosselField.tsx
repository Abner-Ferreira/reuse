import { Product } from '@/app/generated/prisma'
import { Badge } from '../ui/badge'
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '../ui/card'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '../ui/carousel'
import PublicacaoPopUp from './publicacaoPopUp'

interface CarrosselProps {
  title: string
  products: Product[]
}

export default function CarrosselField({ title, products }: CarrosselProps) {
  const conservationColor: Record<string, string> = {
    Novo: 'bg-green-500 hover:bg-green-600',
    Seminovo: 'bg-yellow-500 hover:bg-yellow-600',
    'Muito usado': 'bg-red-500 hover:bg-red-600',
  }

  return (
    <>
      <h1 className='text-2xl text-(--text-gray) my-5'>{title}</h1>

      {products.length > 0 ? (
        <Carousel
          opts={{
            align: 'start',
          }}
          className='w-full'
        >
          <CarouselContent>
            {products.map((product, index) => (
              <CarouselItem
                key={index}
                className='w-full sm:basis-1/2 md:basis-1/3 xl:basis-1/5'
              >
                <Card className='relative mx-auto w-full max-w-sm pt-0 flex flex-col h-105'>
                  <div className='absolute inset-0 z-30 aspect-video' />
                  <Badge
                    className={`absolute self-end m-2 z-40 ${conservationColor[product.stateOfConservation] ?? 'bg-gray-500'}`}
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
                    <CardTitle className='line-clamp-1' title={product.name}>
                      {product.name}
                    </CardTitle>
                    <CardDescription className='line-clamp-2 overflow-hidden'>
                      {product.description}
                    </CardDescription>
                  </CardHeader>
                  <CardFooter>
                    <PublicacaoPopUp type='editar' id={product.id} images={product.images}  name={product.name} description={product.description} category={product.category} stateOfConservation={product.stateOfConservation}/>
                  </CardFooter>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      ) : (
        <div>
          <p>
            Ainda não possui{' '}
            {title.toLowerCase() === 'roupas'
              ? 'roupas publicadas'
              : `${title.toLowerCase()} publicados`}
          </p>
        </div>
      )}
    </>
  )
}
