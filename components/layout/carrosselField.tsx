import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../ui/card'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '../ui/carousel'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import { Product } from '@/app/generated/prisma'

interface CarrosselProps {
  title: string
  products: Product[]
}

export default function CarrosselField({ title, products }: CarrosselProps) {
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
                <Card className='relative mx-auto w-full max-w-sm pt-0'>
                  <div className='absolute inset-0 z-30 aspect-video' />
                  <img
                    src={product.images[0]}
                    alt='Event cover'
                    className='relative z-20 aspect-video w-full object-contain'
                  />
                  <CardHeader>
                    <CardAction>
                      <Badge variant={'secondary'}>{title}</Badge>
                    </CardAction>
                    <CardTitle>{product.name}</CardTitle>
                    <CardDescription>{product.description}</CardDescription>
                  </CardHeader>
                  <CardFooter>
                    <Button className='w-full'>Editar publicação</Button>
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
