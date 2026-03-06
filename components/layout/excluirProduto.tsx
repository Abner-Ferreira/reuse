'use client'

import { excluirProduto } from '@/actions/products'
import { Trash } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
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
import { Button } from '../ui/button'

export default function ExcluirProdutoButton({ id }: { id: string }) {
  const router = useRouter()

  async function handleExcluir() {
    try {
      await excluirProduto(id)
      toast.success('Produto excluído com sucesso!')
    } catch (error) {
      toast.success('Erro ao excluir o produto.')
    }
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
          <AlertDialogAction variant='destructive' onClick={handleExcluir}>
            Deletar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
