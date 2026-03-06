import { Toaster } from '@/components/ui/sonner'
import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'ReUse! | Troque roupas, sapatos e acessórios',
  description:
    'ReUse! é a plataforma de troca de roupas, sapatos e acessórios. Dê uma nova vida às suas peças e encontre o que você procura sem gastar nada. Sustentabilidade e estilo em um só lugar.',
  keywords: [
    'troca de roupas',
    'trocar roupas',
    'brechó online',
    'troca de sapatos',
    'troca de acessórios',
    'moda sustentável',
    'economia circular',
    'ReUse',
  ],
  openGraph: {
    title: 'ReUse! | Troque roupas, sapatos e acessórios',
    description:
      'Dê uma nova vida às suas peças e encontre o que você procura sem gastar nada.',
    type: 'website',
    locale: 'pt_BR',
  },
  icons: {
    icon: '/logo.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='pt-br'>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased overflow-x-hidden`}
      >
        {children}
        <Toaster
          position='top-center'
          toastOptions={{
            classNames: {
              success: '!bg-primary !text-primary-foreground !border-primary',
              error: '!bg-destructive !text-white !border-destructive',
            },
          }}
        />
      </body>
    </html>
  )
}
