// components/layout/excluirProdutoButton.tsx
'use client'

import { excluirProduto } from '@/actions/products'
import { useRouter } from 'next/navigation'
import { Trash } from 'lucide-react'
import { Button } from '../ui/button'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '../ui/alert-dialog'

export default function ExcluirProdutoButton({ id }: { id: string }) {
  const router = useRouter()

  async function handleExcluir() {
    await excluirProduto(id)
    router.refresh()
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant='destructive'>
          <Trash />
          Excluir
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent size='sm'>
        <AlertDialogHeader>
          <AlertDialogMedia className='bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive'>
            <Trash />
          </AlertDialogMedia>
          <AlertDialogTitle>Deletar produto?</AlertDialogTitle>
          <AlertDialogDescription>
            Isso irá deletar permanentemente o produto, sumindo do seu histórico
            e do feed de publicações para todos os usuários.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel variant='outline'>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            variant='destructive'
            onClick={handleExcluir}
          >
            Deletar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}