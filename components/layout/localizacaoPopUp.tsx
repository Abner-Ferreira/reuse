'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import z from 'zod'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import { SelectField } from '@/components/layout/selectField'
import { MapPin, Loader2 } from 'lucide-react'
import { Country, State, City } from 'country-state-city'
import { salvarLocalizacao } from '@/actions/profile'

const locationSchema = z.object({
  country: z.string().min(1, 'Selecione um país'),
  state: z.string().min(1, 'Selecione um estado'),
  city: z.string().min(1, 'Selecione uma cidade'),
})

type LocationFormValues = z.infer<typeof locationSchema>

interface Props {
  currentLocation?: {
    country?: string | null
    state?: string | null
    city?: string | null
  }
}

export function LocalizacaoPopUp({ currentLocation }: Props) {
  const [open, setOpen] = useState(false)
  const router = useRouter()

  const hasLocation = currentLocation?.city && currentLocation?.state && currentLocation?.country

  const form = useForm<LocationFormValues>({
    resolver: zodResolver(locationSchema),
    defaultValues: {
      country: currentLocation?.country ?? '',
      state: currentLocation?.state ?? '',
      city: currentLocation?.city ?? '',
    },
  })

  const selectedCountry = form.watch('country')
  const selectedState = form.watch('state')

  const countries = Country.getAllCountries()
  const states = selectedCountry ? State.getStatesOfCountry(selectedCountry) : []
  const cities = selectedCountry && selectedState ? City.getCitiesOfState(selectedCountry, selectedState) : []

  async function onSubmit(data: LocationFormValues) {
    await salvarLocalizacao(data)
    setOpen(false)
    router.refresh()
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <div className='flex gap-2 items-center cursor-pointer'>
          <MapPin className='h-5 w-5' />
          {hasLocation
            ? `${currentLocation.city}, ${currentLocation.state} - ${currentLocation.country?.split('-')[0]}`
            : (
              <span className='text-muted-foreground hover:text-foreground underline underline-offset-2 text-sm transition-colors'>
                Inserir localização
              </span>
            )}
        </div>
      </DialogTrigger>

      <DialogContent className='sm:max-w-md'>
        <DialogHeader>
          <DialogTitle>
            {hasLocation ? 'Alterar localização' : 'Inserir localização'}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4 pt-2'>

            <FormField
              control={form.control}
              name='country'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>País</FormLabel>
                  <FormControl>
                    <SelectField
                      placeholder='Selecione o país'
                      listOfCountries={countries}
                      value={field.value}
                      onChange={val => {
                        field.onChange(val)
                        form.setValue('state', '')
                        form.setValue('city', '')
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='state'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Estado</FormLabel>
                  <FormControl>
                    <SelectField
                      placeholder='Selecione o estado'
                      listOfStatesAndCities={states}
                      value={field.value}
                      onChange={val => {
                        field.onChange(val)
                        form.setValue('city', '')
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='city'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cidade</FormLabel>
                  <FormControl>
                    <SelectField
                      placeholder='Selecione a cidade'
                      listOfStatesAndCities={cities}
                      value={field.value}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className='grid grid-cols-2 gap-2 pt-2'>
              <Button type='button' className='bg-destructive w-full hover:border-destructive' onClick={() => setOpen(false)}>
                Cancelar
              </Button>
              <Button type='submit' className='w-full' disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting
                  ? <><Loader2 className='h-4 w-4 mr-2 animate-spin' />Salvando...</>
                  : 'Salvar'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}