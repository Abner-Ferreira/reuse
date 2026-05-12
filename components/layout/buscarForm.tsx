'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import { useForm } from 'react-hook-form'
import z from 'zod'
import { Button } from '../ui/button'
import { Form, FormControl, FormField, FormItem, FormMessage } from '../ui/form'
import { Input } from '../ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select'

const searchSchema = z.object({
  name: z.string().optional(),
  category: z.string().optional(),
  localization: z.string().optional(),
  stateOfConservation: z.string().optional(),
})

export type SearchFormValues = z.infer<typeof searchSchema>

interface BuscarFormProps {
  onSearch: (data: {
    name: string
    localization: string
    category: string
    stateOfConservation: string
  }) => void
}

export default function BuscarForm({ onSearch }: BuscarFormProps) {
  const form = useForm<SearchFormValues>({
    resolver: zodResolver(searchSchema),
    defaultValues: {
      name: '',
      category: 'todas',
      localization: '',
      stateOfConservation: 'todos',
    },
  })

  async function onSubmit(formData: SearchFormValues) {
    onSearch({
      name: formData.name || '',
      localization: formData.localization || '',
      category: formData.category || 'todas',
      stateOfConservation: formData.stateOfConservation || 'todos',
    })
  }

  function limparBusca() {
    form.reset({
      name: '',
      category: 'todas',
      localization: '',
      stateOfConservation: 'todos',
    })

    onSearch({
      name: '',
      localization: '',
      category: 'todas',
      stateOfConservation: 'todos',
    })
  }

  return (
    <section className='flex w-full flex-col'>
      <h1 className='text-lg font-normal text-(--text-gray)'>Buscar</h1>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className='mt-5 grid grid-cols-1 gap-3 md:grid-cols-5 lg:gap-6'>
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder='Nome' type='text' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='category'
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className='w-full'>
                    <SelectValue placeholder='Categoria' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='todas'>Todas</SelectItem>
                    <SelectItem value='roupas'>Roupas</SelectItem>
                    <SelectItem value='sapatos'>Sapatos</SelectItem>
                    <SelectItem value='acessórios'>Acessórios</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />

            <FormField
              control={form.control}
              name='localization'
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder='Localização' type='text' {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='stateOfConservation'
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className='w-full'>
                    <SelectValue placeholder='Estado de conservação' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='todos'>Todos</SelectItem>
                    <SelectItem value='novo'>Novo</SelectItem>
                    <SelectItem value='seminovo'>Seminovo</SelectItem>
                    <SelectItem value='muito-usado'>Muito usado</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />

            <div className='flex gap-2'>
              <Button type='submit' className='w-full'>
                {form.formState.isSubmitting ? (
                  <>
                    <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                    Buscando...
                  </>
                ) : (
                  'Buscar'
                )}
              </Button>

              <Button type='button' variant='outline' onClick={limparBusca}>
                Limpar
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </section>
  )
}