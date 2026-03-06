'use client'

import { useState, lazy, Suspense } from 'react'
import { Map, X, Loader2, AlertCircle, SlidersHorizontal } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Slider } from '@/components/ui/slider'
import { useGeocoding, Product } from '@/hooks/useGeocoding'

const ProductMap = lazy(() => import('./mapaProduto'))

interface MapModalProps {
  products: Product[]
  currentUserLocation: string
}

export default function MapaPopUp({ products, currentUserLocation }: MapModalProps) {
  const [open, setOpen] = useState(false)
  const [radiusKm, setRadiusKm] = useState(50)

  const { pins, userCoords, isLoading, error } = useGeocoding({
    products,
    currentUserLocation,
    radiusKm,
  })

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        variant='outline'
        className='gap-2 text-accent hover:bg-orange-50 hover:text-accent hover:underline transition-all'
      >
        <Map className='h-4 w-4' />
        Ver mapa
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className='max-w-4xl w-full p-0 overflow-hidden rounded-xl gap-0'>
          {/* Header */}
          <DialogHeader className='px-6 py-4 border-b bg-white'>
            <div className='flex items-center justify-between'>
              <div>
                <DialogTitle className='text-base font-semibold text-gray-900'>
                  Itens próximos a você
                </DialogTitle>
                <p className='text-xs text-gray-400 mt-0.5'>{currentUserLocation}</p>
              </div>
            </div>

            {/* Controle de raio */}
            <div className='mt-3 flex items-center gap-4'>
              <div className='flex items-center gap-2 text-xs text-gray-500'>
                <SlidersHorizontal className='h-3.5 w-3.5' />
                <span>Raio de busca:</span>
                <span className='font-semibold text-accent'>{radiusKm} km</span>
              </div>
              <Slider
                value={[radiusKm]}
                onValueChange={([val]) => setRadiusKm(val)}
                min={5}
                max={200}
                step={5}
                className='flex-1 max-w-xs'
              />
              <div className='text-xs text-gray-400'>
                {isLoading ? (
                  <span className='flex items-center gap-1'>
                    <Loader2 className='h-3 w-3 animate-spin' /> Carregando...
                  </span>
                ) : (
                  <span>
                    {pins.length} {pins.length === 1 ? 'local encontrado' : 'locais encontrados'}
                  </span>
                )}
              </div>
            </div>
          </DialogHeader>

          {/* Mapa */}
          <div className='relative h-125 bg-gray-100'>
            {isLoading && (
              <div className='absolute inset-0 z-10 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm gap-3'>
                <Loader2 className='h-8 w-8 animate-spin text-accent' />
                <p className='text-sm text-gray-500'>Buscando itens próximos...</p>
              </div>
            )}

            {error && (
              <div className='absolute inset-0 z-10 flex flex-col items-center justify-center gap-3'>
                <AlertCircle className='h-8 w-8 text-red-400' />
                <p className='text-sm text-gray-500'>{error}</p>
                <Button variant='outline' size='sm' onClick={() => setOpen(false)}>
                  Fechar
                </Button>
              </div>
            )}

            {!error && (
              <Suspense
                fallback={
                  <div className='flex h-full items-center justify-center'>
                    <Loader2 className='h-6 w-6 animate-spin text-accent' />
                  </div>
                }
              >
                <ProductMap
                  pins={pins}
                  userCoords={userCoords}
                  currentUserLocation={currentUserLocation}
                />
              </Suspense>
            )}
          </div>

          {/* Lista lateral de itens encontrados */}
          {pins.length > 0 && (
            <div className='border-t bg-gray-50 px-6 py-3 flex gap-3 overflow-x-auto'>
              {pins.map((pin, i) => (
                <div
                  key={i}
                  className='shrink-0 bg-white rounded-lg border border-gray-100 px-3 py-2 text-xs shadow-sm min-w-35'
                >
                  <p className='font-medium text-gray-700 truncate'>
                    {pin.products[0].localization}
                  </p>
                  {pin.distanceKm !== undefined && (
                    <p className='text-accent mt-0.5'>
                      {pin.distanceKm < 1 ? '< 1' : pin.distanceKm.toFixed(1)} km
                    </p>
                  )}
                  <p className='text-gray-400 mt-0.5'>
                    {pin.products.length} {pin.products.length === 1 ? 'item' : 'itens'}
                  </p>
                </div>
              ))}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}