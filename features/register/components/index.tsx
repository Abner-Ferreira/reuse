'use client'

import { SelectField } from '@/components/layout/selectField'
import { Button } from '@/components/ui/button'
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field'
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
import z from 'zod'
import { Country, State, City } from 'country-state-city'

const registerSchema = z
  .object({
    name: z
      .string()
      .min(3, { message: 'O nome deve ter pelo menos 3 caracteres' }),
    email: z.email({ message: 'Email inválido' }),
    country: z.string().min(1, 'Selecione um país'),
    state: z.string().min(1, 'Selecione um estado'),
    city: z.string().min(1, 'Selecione uma cidade'),
    password: z
      .string()
      .min(8, { message: 'A senha deve ter pelo menos 8 caracteres' }),
    confirmPassword: z.string().min(8, {
      message: 'A confirmação de senha deve ter pelo menos 8 caracteres',
    }),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: 'As senhas não coincidem',
    path: ['confirmPassword'],
  })

type RegisterFormValues = z.infer<typeof registerSchema>

export default function Register() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowconfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      country: '',
      state: '',
      city: '',
      password: '',
      confirmPassword: '',
    },
  })

  const selectedCountry = form.watch('country')
  const selectedState = form.watch('state')

  const countries = Country.getAllCountries()
  const states = selectedCountry
    ? State.getStatesOfCountry(selectedCountry)
    : []
  const cities =
    selectedCountry && selectedState
      ? City.getCitiesOfState(selectedCountry, selectedState)
      : []

  async function onSubmit(formData: RegisterFormValues) {
    const countryFullName = Country.getCountryByCode(selectedCountry)?.name
    await authClient.signUp.email(
      {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        country: `${countryFullName}-${formData.country}`,
        state: formData.state,
        city: formData.city,
        callbackURL: '/inicio',
      },
      {
        onRequest: ctx => {},
        onSuccess: ctx => {
          console.log('CADASTRADO: ', ctx.response.statusText)
          router.replace('/inicio')
        },
        onError: ctx => {
          console.log(ctx.error.message)
        },
      }
    )
  }

  return (
    <>
      <main className='grid grid-cols-[50%_50%] h-screen overflow-hidden px-20 py-10'>
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
                CADASTRE-SE
              </h1>

              {/* Nome Completo */}
              <FormField
                control={form.control}
                name='name'
                render={({ field }) => (
                  <FormItem className='w-[60%] my-6'>
                    <FormLabel>
                      Nome completo <span className='text-destructive'>*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder='João da Silva'
                        type='text'
                        {...field}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Email */}
              <FormField
                control={form.control}
                name='email'
                render={({ field }) => (
                  <FormItem className='w-[60%] mb-6'>
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

              <FieldGroup className='grid max-w-[60%] grid-cols-3 mb-6'>
                {/* País */}
                <FormField
                  control={form.control}
                  name='country'
                  render={({ field }) => (
                    <Field>
                      <FieldLabel>
                        País <span className="text-destructive">*</span>
                        </FieldLabel>
                      <FormControl>
                        <SelectField
                          placeholder='País'
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
                    </Field>
                  )}
                />

                {/* Estado */}
                <FormField
                  control={form.control}
                  name='state'
                  render={({ field }) => (
                    <Field>
                      <FieldLabel>
                        Estado <span className="text-destructive">*</span>
                        </FieldLabel>
                      <FormControl>
                        <SelectField
                          placeholder='Estado'
                          listOfStatesAndCities={states}
                          value={field.value}
                          onChange={val => {
                            field.onChange(val)
                            form.setValue('city', '')
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </Field>
                  )}
                />

                {/* Cidade */}
                <FormField
                  control={form.control}
                  name='city'
                  render={({ field }) => (
                    <Field>
                      <FieldLabel>
                        Cidade <span className="text-destructive">*</span>
                        </FieldLabel>
                      <FormControl>
                        <SelectField
                          placeholder='Cidade'
                          listOfStatesAndCities={cities}
                          value={field.value}
                          onChange={field.onChange}
                        />
                      </FormControl>
                      <FormMessage />
                    </Field>
                  )}
                />
              </FieldGroup>

              <FormField
                control={form.control}
                name='password'
                render={({ field }) => (
                  <FormItem className='w-[60%] mb-6'>
                    <FormLabel>
                      Senha <span className="text-destructive">*</span>
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
              <FormField
                control={form.control}
                name='confirmPassword'
                render={({ field }) => (
                  <FormItem className='w-[60%] mb-6'>
                    <FormLabel>
                      Confirme a senha <span className="text-destructive">*</span>
                      </FormLabel>
                    <FormControl>
                      <div className='relative'>
                        <Input
                          placeholder='••••••••'
                          type={showConfirmPassword ? 'text' : 'password'}
                          {...field}
                          disabled={isLoading}
                        />
                        <Button
                          type='button'
                          variant='ghost'
                          size='sm'
                          className='absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent'
                          onClick={() =>
                            setShowconfirmPassword(!showConfirmPassword)
                          }
                          disabled={isLoading}
                        >
                          {showConfirmPassword ? (
                            <EyeOff className='h-4 w-4 text-muted-foreground' />
                          ) : (
                            <Eye className='h-4 w-4 text-muted-foreground' />
                          )}
                          <span className='sr-only'>
                            {showConfirmPassword
                              ? 'Esconder senha'
                              : 'Mostrar senha'}
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
                    Cadastrando...
                  </>
                ) : (
                  'Cadastrar'
                )}
              </Button>
            </form>
          </Form>

          <p className='font-semibold text-xl '>
            Já possui conta?{' '}
            <Link
              className='text-(--details) hover:underline'
              href='/'
              target='_self'
            >
              Faça seu login!
            </Link>
          </p>
        </div>
        <div className='relative'>
          <Image
            src='/register.png'
            alt='Register image'
            fill
            className='object-contain'
          />
        </div>
      </main>
    </>
  )
}
