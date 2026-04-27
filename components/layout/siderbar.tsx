'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { authClient } from '@/lib/auth-client'  
import {
  Home,
  LogOut,
  MessageCircle,
  PanelBottom,
  ShoppingBag,
  SquareArrowOutUpRight,
  User,
  Users,
} from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function Sidebar() {
  const router = useRouter()

  async function signOut() {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push('/')
          router.refresh()
        },
      },
    })
  }

  return (
    <>
      {/* SIDEBAR DESKTOP */}
      <div className='flex w-full flex-col bg-muted/40'>
        <aside className='fixed inset-y-0 left-0 z-10 hidden w-20 bg-primary sm:flex flex-col'>
          <nav className='flex flex-col items-center gap-4 px-2 py-5'>
            <TooltipProvider>
              <Link
                href='/inicio'
                className='flex h-9 w-9 shrink-0 items-center justify-center bg-background text-primary-foreground rounded-full'
              >
                <Avatar className='h-5 w-5'>
                  <AvatarImage src='/logo.png' />
                  <AvatarFallback>RU</AvatarFallback>
                </Avatar>
              </Link>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link
                    href='/inicio'
                    className='flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-primary-foreground/80 hover:text-primary-foreground'
                  >
                    <Home className='h-5 w-5' />
                    <span className='sr-only'>Início</span>
                  </Link>
                </TooltipTrigger>
                <TooltipContent side='right'>Início</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Link
                    href='/feed'
                    className='flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-primary-foreground/80 hover:text-primary-foreground'
                  >
                    <SquareArrowOutUpRight className='h-5 w-5' />
                    <span className='sr-only'>Feed</span>
                  </Link>
                </TooltipTrigger>
                <TooltipContent side='right'>Feed</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Link
                    href='#'
                    className='flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-primary-foreground/80 hover:text-primary-foreground'
                  >
                    <MessageCircle className='h-5 w-5' />
                    <span className='sr-only'>Negociações</span>
                  </Link>
                </TooltipTrigger>
                <TooltipContent side='right'>Negociações</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Link
                    href='#'
                    className='flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-primary-foreground/80 hover:text-primary-foreground'
                  >
                    <ShoppingBag className='h-5 w-5' />
                    <span className='sr-only'>Pedidos</span>
                  </Link>
                </TooltipTrigger>
                <TooltipContent side='right'>Pedidos</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Link
                    href='/perfil'
                    className='flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-primary-foreground/80 hover:text-primary-foreground'
                  >
                    <User className='h-5 w-5' />
                    <span className='sr-only'>Perfil</span>
                  </Link>
                </TooltipTrigger>
                <TooltipContent side='right'>Perfil</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </nav>

          <nav className='mt-auto flex flex-col items-center gap-4 px-2 py-5'>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={signOut}
                    className='flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-primary-foreground/80 hover:text-primary-foreground cursor-pointer'
                  >
                    <LogOut className='h-5 w-5 ' />
                    <span className='sr-only'>Sair</span>
                  </button>
                </TooltipTrigger>
                <TooltipContent side='right'>Sair</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </nav>
        </aside>

        {/* SIDEBAR MOBILE */}
        <div className='sm:hidden flex flex-col sm:gap-4  sm:py-4 sm:pl-14'>
          <header
            className='sticky top-0 z-30 flex h-14 items-center px-4 bg-primary gap-4 
          sm:static sm:h-auto sm:bg-transparent sm:px-6
          '
          >
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  size='icon'
                  variant='outline'
                  className='sm:hidden text-primary-foreground/80 hover:text-primary-foreground'
                >
                  <PanelBottom className='w-5 h-5' />
                  <span className='sr-only'>Abrir / fechar menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent
                side='left'
                className='sm:max-w-xs bg-primary [&>button]:text-primary-foreground/80 [&>button]:hover:text-primary-foreground'
              >
                <nav className='grid gap-6 text-lg font-medium '>
                  <Link
                    href='/inicio'
                    className='flex items-center  gap-4 px-2.5 text-primary-foreground/80 hover:text-primary-foreground'
                    prefetch={false}
                  >
                    <div className='flex h-10 w-10 mt-3 px-2.5 bg-background rounded-full items-center justify-center text-primary-foreground md:text-base gap-2'>
                      <Avatar className='h-5 w-5'>
                        <AvatarImage src='/logo.png' />
                        <AvatarFallback>RU</AvatarFallback>
                      </Avatar>
                    </div>
                    <span className='flex items-center gap-4 mt-2 px-2.5 text-primary-foreground/80 hover:text-primary-foreground'>
                      ReUse!
                    </span>
                  </Link>
                  <Link
                    href='/inicio'
                    className='flex items-center gap-4 px-2.5 text-primary-foreground/80 hover:text-primary-foreground'
                    prefetch={false}
                  >
                    <Home className='h-5 w-5 transition-all' />
                    Início
                  </Link>
                  <Link
                    href='/feed'
                    className='flex items-center gap-4 px-2.5 text-primary-foreground/80 hover:text-primary-foreground'
                    prefetch={false}
                  >
                    <SquareArrowOutUpRight className='h-5 w-5 transition-all' />
                    Feed
                  </Link>

                  <Link
                    href='#'
                    className='flex items-center gap-4 px-2.5 text-primary-foreground/80 hover:text-primary-foreground'
                    prefetch={false}
                  >
                    <Users className='h-5 w-5 transition-all' />
                    Negociações
                  </Link>

                   <Link
                    href='#'
                    className='flex items-center gap-4 px-2.5 text-primary-foreground/80 hover:text-primary-foreground'
                    prefetch={false}
                  >
                    <ShoppingBag className='h-5 w-5 transition-all' />
                    Pedidos
                  </Link>

                  <Link
                    href='/perfil'
                    className='flex items-center gap-4 px-2.5 text-primary-foreground/80 hover:text-primary-foreground'
                    prefetch={false}
                  >
                    <MessageCircle className='h-5 w-5 transition-all' />
                    Perfil
                  </Link>
                </nav>
                <nav className='mt-auto flex  gap-4 px-2 py-5 font-medium'>
                  <button
                    onClick={signOut}
                    className='flex items-center gap-4 px-2.5 text-primary-foreground/80 hover:text-primary-foreground cursor-pointer'
                  >
                    <LogOut className='h-5 w-5 transition-all' />
                    Sair
                  </button>
                </nav>
              </SheetContent>
            </Sheet>
          </header>
        </div>
      </div>
    </>
  )
}
