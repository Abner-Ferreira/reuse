'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2, Plus, X } from 'lucide-react'
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
import { salvarProduto } from '@/actions/products'
import { Dropzone, DropzoneContent, DropzoneEmptyState } from '../ui/dropzone'
import { useUploadThing } from '@/lib/uploadthing'

const postSchema = z.object({
  images: z
    .array(z.instanceof(File))
    .min(1, { message: 'Selecione pelo menos 1 imagem.' })
    .max(5, { message: 'Máximo de 5 imagens.' }),
  name: z
    .string()
    .min(2, { message: 'O nome deve conter pelo menos 2 caracteres.' }),
  description: z
    .string()
    .min(5, { message: 'A descrição deve conter pelo menos 5 caracteres.' }),
  category: z.string(),
  stateOfConservation: z.string(),
})

type PostFormValues = z.infer<typeof postSchema>


export default function PublicacaoPopUp() {
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { startUpload } = useUploadThing('productImages')

  // const {} = useUploadThing()

  const form = useForm<PostFormValues>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      images: [],
      name: '',
      // description: '',
      category: undefined,
      stateOfConservation: undefined,
    },
  })

  async function onSubmit(data: PostFormValues) {
    // 1. Faz upload dos arquivos
    const uploaded = await startUpload(data.images)
    if (!uploaded) throw new Error('Erro no upload')

    // 2. Pega as URLs retornadas
    const imageUrls = uploaded.map(file => file.url)

    // 3. Salva no banco com as URLs
    await salvarProduto({ ...data, images: imageUrls })

    router.refresh()
    setOpen(false)
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
              name='images'
              render={({ field }) => (
                <FormItem className='w-full my-6'>
                  <FormLabel>
                    Imagens <span className='text-destructive'>*</span>
                  </FormLabel>
                  <FormControl>
                    <Dropzone
                      accept={{ 'image/*': [] }}
                      maxFiles={5}
                      maxSize={1024 * 1024}
                      minSize={1024}
                      onDrop={newFiles => {
                        const updated = [...field.value, ...newFiles].slice(
                          0,
                          5
                        )
                        field.onChange(updated)
                      }}
                      src={field.value.length > 0 ? field.value : undefined}
                    >
                      <DropzoneEmptyState />
                      <DropzoneContent>
                        {field.value.length > 0 && (
                          <div className='grid grid-cols-5 gap-2 w-full'>
                            {field.value.map((file: File, index: number) => (
                              <div
                                key={index}
                                className='relative aspect-square rounded-lg overflow-hidden border border-border'
                              >
                                <img
                                  src={URL.createObjectURL(file)}
                                  alt={`Imagem ${index + 1}`}
                                  className='h-full w-full object-cover'
                                />
                                {index === 0 && (
                                  <span className='absolute bottom-1 left-1 text-[10px] font-semibold bg-black/60 text-white rounded px-1 py-0.5'>
                                    Capa
                                  </span>
                                )}
                                <button
                                  type='button'
                                  onClick={e => {
                                    e.stopPropagation()
                                    field.onChange(
                                      field.value.filter(
                                        (_: File, i: number) => i !== index
                                      )
                                    )
                                  }}
                                  className='absolute top-1 right-1 rounded-full bg-black/60 p-0.5 text-white hover:bg-destructive transition-colors'
                                >
                                  <X className='h-3 w-3' />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </DropzoneContent>
                    </Dropzone>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

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
                      disabled={isLoading}
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
                      disabled={isLoading}
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
                  <FormItem>
                    <FormLabel>
                      Categoria <span className='text-destructive'>*</span>
                    </FormLabel>
                    <Select
                      {...field}
                      onValueChange={field.onChange}
                      disabled={isLoading}
                    >
                      <SelectTrigger
                        className={`w-full ${fieldState.error ? 'border-destructive' : ''}`}
                      >
                        <SelectValue placeholder='Categoria' />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='Roupas'>Roupas</SelectItem>
                        <SelectItem value='Sapatos'>Sapatos</SelectItem>
                        <SelectItem value='Acessórios'>Acessórios</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='stateOfConservation'
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel>
                      Estado de conservação{' '}
                      <span className='text-destructive'>*</span>
                    </FormLabel>
                    <Select
                      {...field}
                      onValueChange={field.onChange}
                      disabled={isLoading}
                    >
                      <SelectTrigger
                        className={`w-full ${fieldState.error ? 'border-destructive' : ''}`}
                      >
                        <SelectValue placeholder='Estado de conservação' />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='Novo'>Novo</SelectItem>
                        <SelectItem value='Seminovo'>Seminovo</SelectItem>
                        <SelectItem value='Muito usado'>Muito usado</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </FieldGroup>

            <div className='grid grid-cols-2 gap-2 pt-2'>
              <Button
                type='button'
                className='bg-destructive w-full hover:border-destructive'
                onClick={() => {
                  setOpen(false)
                  form.clearErrors()
                }}
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
