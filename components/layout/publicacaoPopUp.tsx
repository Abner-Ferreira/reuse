'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2, Plus } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import z from 'zod'
import { Button } from '../ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog'
import { Field, FieldGroup, FieldLabel } from '../ui/field'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form'
import { Input } from '../ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select'
import { Textarea } from '../ui/textarea'

const postSchema = z.object({
  image: z.string().optional(),
  name: z.string().min(2, { message: 'O nome deve conter pelo menos 2 caracteres.' }),
  description: z.string().min(5, { message: 'A descrição deve conter pelo menos 5 caracteres.' }),
  category: z.string().min(5),
  stateOfConservation: z.string().min(5),
})

type PostFormValues = z.infer<typeof postSchema>

export default function PublicacaoPopUp() {
  const [open, setOpen] = useState(false)
  const router = useRouter()

  const form = useForm<PostFormValues>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      image: '',
      name: '',
      description: '',
      category: '',
      stateOfConservation: '',
    },
  })

  async function onSubmit(data: PostFormValues) {
    setOpen(false)
    console.log(data)
    // router.refresh()
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <div className='flex gap-2 items-center'>
          <Button className='w-48 flex justify-center items-center flex-row'>
            Criar publicação
            <Plus />
          </Button>
        </div>
      </DialogTrigger>

      <DialogContent className='sm:max-w-md md:max-w-lg'>
        <DialogHeader>
          <DialogTitle>Nova publicação</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className='space-y-4 pt-2'
          >
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem className='w-full my-6'>
                  <FormLabel>
                    Nome <span className='text-destructive'>*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder='Nome do produto'
                      type='text'
                      {...field}
                      // disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='description'
              render={({ field }) => (
                <FormItem className='w-full my-6'>
                  <FormLabel>
                    Descrição <span className='text-destructive'>*</span>
                  </FormLabel>
                  <FormControl className='md:h-50'>
                    <Textarea
                      placeholder='Descrição do produto'
                      rows={8}
                      maxLength={500}
                      className='resize-none'
                      {...field}
                    />
                  </FormControl>
                  <div className='flex items-center justify-between'>
                    <FormMessage />
                    <span
                      className={`text-xs ml-auto ${
                        (field.value?.length ?? 0) >= 500
                          ? 'text-destructive'
                          : 'text-muted-foreground'
                      }`}
                    >
                      {field.value?.length ?? 0}/500 caracteres
                    </span>
                  </div>
                </FormItem>
              )}
            />

            <FieldGroup className='grid w-full sm:grid-cols-2 mb-6'>
              <FormField
                control={form.control}
                name='category'
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel>
                      Categoria <span className='text-destructive'>*</span>
                    </FieldLabel>
                    <FormControl>
                      <Select {...field}>
                        <SelectTrigger
                          className={`w-full ${
                            fieldState.error
                              ? 'border-destructive focus:ring-destructive'
                              : ''
                          }`}
                        >
                          <SelectValue placeholder='Categoria' />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value='roupas'>Roupas</SelectItem>
                          <SelectItem value='sapatos'>Sapatos</SelectItem>
                          <SelectItem value='acessorios'>Acessórios</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                  </Field>
                )}
              />

              <FormField
                control={form.control}
                name='stateOfConservation'
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel>
                      Estado de conservação{' '}
                      <span className='text-destructive'>*</span>
                    </FieldLabel>
                    <FormControl>
                      <Select {...field}>
                        <SelectTrigger
                          className={`w-full ${
                            fieldState.error
                              ? 'border-destructive focus:ring-destructive'
                              : ''
                          }`}
                        >
                          <SelectValue placeholder='Estado de conservação' />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value='novo'>Novo</SelectItem>
                          <SelectItem value='seminovo'>Seminovo</SelectItem>
                          <SelectItem value='muito-usado'>
                            Muito usado
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                  </Field>
                )}
              />
            </FieldGroup>

            <div className='grid grid-cols-2 gap-2 pt-2'>
              <Button
                type='button'
                className='bg-destructive w-full hover:border-destructive'
                onClick={() => setOpen(false)}
              >
                Cancelar
              </Button>
              <Button
                type='submit'
                className='w-full'
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting ? (
                  <>
                    <Loader2 className='h-4 w-4 mr-2 animate-spin' />
                    Publicando...
                  </>
                ) : (
                  'Publicar'
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
