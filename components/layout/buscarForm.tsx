'use client'

import { Filter, Loader2 } from 'lucide-react'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import z from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form, FormControl, FormField, FormItem, FormMessage } from '../ui/form'
import { useState } from 'react'
import { Field } from '../ui/field'
import { SelectField } from './selectField'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select'

const searchSchema = z
  .object({
    name: z.string().optional(),
    category: z.string().optional(),
    localization: z.string().optional(),
    stateOfConservation: z.string().optional(),
  })
  .refine(data => !!data.name || !!data.localization, {
    message: 'Preencha ao menos o nome ou a localização para buscar',
    path: ['name'],
  })

type SearchFormValues = z.infer<typeof searchSchema>

export default function BuscarForm() {
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<SearchFormValues>({
    resolver: zodResolver(searchSchema),
    defaultValues: {
      name: '',
      category: undefined,
      localization: '',
      stateOfConservation: undefined,
    },
  })

  async function onSubmit(formData: SearchFormValues) {
    const params = {
      name: formData.name,
      localization: formData.localization,
      category: formData.category || 'todas',
      stateOfConservation: formData.stateOfConservation || 'todos',
    }
    form.reset()
    console.log(params)
  }
  return (
    <>
      <section className='flex flex-col w-full'>
        <h1 className='text-(--text-gray) font-normal text-lg'>Buscar</h1>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className='mt-5 grid grid-cols-2 md:grid-cols-5 gap-2 lg:gap-10 h-22'>
              <FormField
                control={form.control}
                name='name'
                render={({ field }) => (
                  <FormItem className='w-full'>
                    <FormControl>
                      <Input
                        placeholder='Nome'
                        type='text'
                        {...field}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='category'
                render={({ field }) => (
                  <Select {...field} disabled={isLoading}>
                    <SelectTrigger className='w-full'>
                      <SelectValue placeholder='Categoria' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='todas'>Todas</SelectItem>
                      <SelectItem value='roupas'>Roupas</SelectItem>
                      <SelectItem value='sapatos'>Sapatos</SelectItem>
                      <SelectItem value='acessorios'>Acessórios</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              <FormField
                control={form.control}
                name='localization'
                render={({ field }) => (
                  <FormItem className='w-full'>
                    <FormControl>
                      <Input
                        placeholder='Localização'
                        type='text'
                        {...field}
                        disabled={isLoading}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='stateOfConservation'
                render={({ field }) => (
                  <Select {...field} disabled={isLoading}>
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

              <Button
                type='submit'
                className='w-full max-h-10'
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting ? (
                  <>
                    <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                    Buscando...
                  </>
                ) : (
                  'Buscar'
                )}
              </Button>
            </div>
          </form>
        </Form>
      </section>
    </>
  )
}
