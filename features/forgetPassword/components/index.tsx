'use client'

import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { authClient } from '@/lib/auth-client'
import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowRight, Eye, EyeOff, Loader2 } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { FcGoogle } from 'react-icons/fc'
import z from 'zod'

const forgetSchema = z.object({
  email: z.email({ message: 'Email inválido' }),

})

type ForgetFormValues = z.infer<typeof forgetSchema>

export default function ForgetPassword() {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const form = useForm<ForgetFormValues>({
    resolver: zodResolver(forgetSchema),
    defaultValues: {
      email: '',
    },
  })

  async function onSubmit(formData: ForgetFormValues) {
    
  }


  
  return (
    <main className='grid grid-cols-[30%_70%] h-screen overflow-hidden px-20 py-10'>
      <div className='flex items-center justify-center flex-col'>
        <Form {...form}>
          <form
            className='flex items-center justify-center flex-col w-full'
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <Image
              src='/logo-completo.png'
              alt='Logo image'
              height={50}
              width={200}
            />

            <h1 className='font-bold font-poppins text-3xl text-(--details) uppercase'>
              ESQUECEU A SENHA?
            </h1>
            <FormField
              control={form.control}
              name='email'
              render={({ field }) => (
                <FormItem className='w-[60%] my-6'>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='seu@email.com'
                      type='email'
                      {...field}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
           

            <Button
              type='submit'
              className='w-[60%] my-5'
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? (
                <>
                  <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                  Enviando...
                </>
              ) : (
                'Enviar e-mail de recuperação'
              )}
            </Button>
          </form>
          <button
            onClick={() => router.back()}
            className="flex flex-row justify-center items-center w-[60%] my-5 px-6 py-3 bg-accent text-accent-foreground rounded-lg font-medium cursor-pointer  "
          >
            Voltar <ArrowRight className="ml-3 h-5"/>
          </button>
        </Form>

     
      </div>
        <div className='relative'>
          <Image
            src='/forgot-password.png'
            alt='Forgot image'
            fill
            className='object-contain'
          />
        </div>
    </main>
  )
}
