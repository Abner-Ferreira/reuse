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
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { FcGoogle } from 'react-icons/fc'
import z from 'zod'

const loginSchema = z.object({
  email: z.email({ message: 'Email inválido' }),
  password: z
    .string()
    .min(8, { message: 'A senha deve ter pelo menos 8 caracteres' }),
})

type LoginFormValues = z.infer<typeof loginSchema>

export default function Login() {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  async function onSubmit(formData: LoginFormValues) {
    await authClient.signIn.email(
      {
        email: formData.email,
        password: formData.password,
        callbackURL: '/inicio',
      },
      {
        onRequest: ctx => {},
        onSuccess: ctx => {
          console.log('LOGADO: ', ctx.response.statusText)
          router.replace('/inicio')
        },
        onError: ctx => {
          console.log('ERRO AO LOGAR CONTA')
          console.log(ctx)
        },
      }
    )
  }

  async function handleSignInWithGoogle() {
    await authClient.signIn.social({
      provider: 'google',
      callbackURL: '/inicio',
    })
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
              LOGIN
            </h1>
            <FormField
              control={form.control}
              name='email'
              render={({ field }) => (
                <FormItem className='w-[60%] my-6'>
                  <FormLabel>
                    Email <span className='text-destructive'>*</span>
                  </FormLabel>
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
            <FormField
              control={form.control}
              name='password'
              render={({ field }) => (
                <FormItem className='w-[60%] mb-6'>
                  <FormLabel>
                    Senha <span className='text-destructive'>*</span>
                  </FormLabel>
                  <FormControl>
                    <div className='relative'>
                      <Input
                        placeholder='••••••••'
                        type={showPassword ? 'text' : 'password'}
                        {...field}
                        disabled={isLoading}
                      />
                      <Button
                        type='button'
                        variant='ghost'
                        size='sm'
                        className='absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent'
                        onClick={() => setShowPassword(!showPassword)}
                        disabled={isLoading}
                      >
                        {showPassword ? (
                          <EyeOff className='h-4 w-4 text-muted-foreground' />
                        ) : (
                          <Eye className='h-4 w-4 text-muted-foreground' />
                        )}
                        <span className='sr-only'>
                          {showPassword ? 'Esconder senha' : 'Mostrar senha'}
                        </span>
                      </Button>
                    </div>
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
                  Entrando...
                </>
              ) : (
                'Entrar'
              )}
            </Button>
          </form>
        </Form>

        <div className='w-[60%] flex justify-center items-center'>
          <div className='bg-dark h-px w-full mr-2'></div>
          <p>ou</p>
          <div className='bg-dark h-px w-full ml-2'></div>
        </div>

        <Button
          className='w-[60%] text-dark border border-dark my-5 bg-transparent'
          onClick={handleSignInWithGoogle}
        >
          <FcGoogle size={24} />
          Entrar com Google
        </Button>

        <p className='font-semibold text-xl '>
          Não possui conta?{' '}
          <Link
            className='text-(--details) hover:underline'
            href='/cadastre-se'
            target='_self'
          >
            Cadastre-se!
          </Link>
        </p>

        <Link
          className='text-(--details) text-md mt-10 hover:underline'
          href='/esqueceu-a-senha'
          target='_self'
        >
          Esqueceu sua senha?
        </Link>
      </div>
      <div className='relative'>
        <Image
          src='/login.png'
          alt='Login image'
          fill
          className='object-contain'
        />
      </div>
    </main>
  )
}
