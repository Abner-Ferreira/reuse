import PublicacaoPopUp from '@/components/layout/publicacaoPopUp'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'

export default function Feed() {

  return (
    <main className='flex flex-col w- h-screen bg-accent p-5'>
      <div className='self-end'>
        <PublicacaoPopUp />
      </div>
      <div>teste</div>
    </main>
  )
}
