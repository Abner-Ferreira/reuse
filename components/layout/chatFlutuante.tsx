'use client'

import {
  criarOuPegarConversa,
  enviarMensagem,
  pegarMensagens,
  encerrarConversa,
} from '@/actions/chat'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { pusherClient } from '@/lib/pusher'
import { X, Send, Minus, AlertCircle } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { toast } from 'sonner'

interface Message {
  id: string
  content: string
  authorId: string
  createdAt: Date
  author: {
    id: string
    name: string
    image?: string | null
  }
}

interface ChatFlutuanteProps {
  productId: string
  sellerId: string
  sellerName: string
  sellerImage?: string | null
  productName: string
  currentUserId: string
  pageLoc: 'produtos' | 'feed'
  isSeller: boolean // true se o usuário logado é o vendedor
}

export default function ChatFlutuante({
  productId,
  sellerId,
  sellerName,
  sellerImage,
  productName,
  currentUserId,
  isSeller,
  pageLoc,
}: ChatFlutuanteProps) {
  const [open, setOpen] = useState(false)
  const [minimized, setMinimized] = useState(false)
  const [conversationId, setConversationId] = useState<string | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [content, setContent] = useState('')
  const [status, setStatus] = useState<'active' | 'closed'>('active')
  const [isLoading, setIsLoading] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  // Scroll automático para a última mensagem
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Conecta ao Pusher quando tem conversationId
  useEffect(() => {
    if (!conversationId) return

    const channel = pusherClient.subscribe(`conversation-${conversationId}`)

    channel.bind('new-message', (message: Message) => {
      setMessages(prev => [...prev, message])
    })

    channel.bind('conversation-closed', () => {
      setStatus('closed')
      toast.info('A conversa foi encerrada pelo vendedor.')
    })

    return () => {
      pusherClient.unsubscribe(`conversation-${conversationId}`)
    }
  }, [conversationId])

  async function handleOpen() {
    setOpen(true)
    setIsLoading(true)
    try {
      const conversation = await criarOuPegarConversa(productId, sellerId)
      setConversationId(conversation.id)
      setStatus(conversation.status as 'active' | 'closed')

      const data = await pegarMensagens(conversation.id)
      setMessages(data.messages as Message[])
    } catch (error: any) {
      toast.error(error.message ?? 'Erro ao abrir o chat.')
      setOpen(false)
    } finally {
      setIsLoading(false)
    }
  }

  async function handleSend() {
    if (!content.trim() || !conversationId) return

    try {
      await enviarMensagem(conversationId, content.trim())
      setContent('')
    } catch (error) {
      toast.error('Erro ao enviar mensagem.')
    }
  }

  async function handleEncerrar() {
    if (!conversationId) return
    try {
      await encerrarConversa(conversationId)
      setStatus('closed')
      toast.success('Conversa encerrada.')
    } catch (error) {
      toast.error('Erro ao encerrar conversa.')
    }
  }

  if (!open) {
    return pageLoc === 'feed' ? (
      <Button
        className='w-[40%]' variant={'outline'}
        onClick={handleOpen}
        disabled={isSeller} // vendedor não pode abrir chat com si mesmo
      >
        Ver chat
      </Button>
    ) : (
      <Button
        size='lg'
        className='w-full sm:w-fit mt-2'
        onClick={handleOpen}
        disabled={isSeller} // vendedor não pode abrir chat com si mesmo
      >
        Solicitar negociação
      </Button>
    )

    // <Button
    //   size='lg'
    //   className='w-full sm:w-fit mt-2'
    //   onClick={handleOpen}
    //   disabled={isSeller} // vendedor não pode abrir chat com si mesmo
    // >
    //   Solicitar negociação
    // </Button>
  }

  return (
    <div className='fixed bottom-4 right-4 z-50 w-80 rounded-2xl shadow-2xl border border-border bg-background flex flex-col overflow-hidden'>
      {/* Header */}
      <div className='flex items-center justify-between px-4 py-3 bg-primary text-primary-foreground'>
        <div className='flex items-center gap-2'>
          <Avatar className='h-7 w-7'>
            <AvatarImage src={sellerImage ?? ''} />
            <AvatarFallback className='text-xs bg-primary-foreground text-primary'>
              {sellerName.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className='flex flex-col'>
            <span className='text-sm font-semibold leading-none'>
              {sellerName}
            </span>
            <span className='text-[10px] opacity-70 truncate max-w-36'>
              {productName}
            </span>
          </div>
        </div>
        <div className='flex items-center gap-1'>
          <button
            onClick={() => setMinimized(p => !p)}
            className='p-1 rounded hover:bg-primary-foreground/20 transition-colors'
          >
            <Minus className='h-4 w-4' />
          </button>
          <button
            onClick={() => setOpen(false)}
            className='p-1 rounded hover:bg-primary-foreground/20 transition-colors'
          >
            <X className='h-4 w-4' />
          </button>
        </div>
      </div>

      {!minimized && (
        <>
          {/* Status encerrado */}
          {status === 'closed' && (
            <div className='flex items-center gap-2 px-4 py-2 bg-muted text-muted-foreground text-xs'>
              <AlertCircle className='h-3.5 w-3.5' />
              Conversa encerrada
            </div>
          )}

          {/* Mensagens */}
          <div className='flex-1 h-72 overflow-y-auto px-4 py-3 flex flex-col gap-2'>
            {isLoading ? (
              <div className='flex h-full items-center justify-center'>
                <div className='h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent' />
              </div>
            ) : messages.length === 0 ? (
              <p className='text-xs text-muted-foreground text-center mt-4'>
                Nenhuma mensagem ainda. Inicie a conversa!
              </p>
            ) : (
              messages.map(msg => {
                const isMe = msg.authorId === currentUserId
                return (
                  <div
                    key={msg.id}
                    className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[75%] px-3 py-2 rounded-2xl text-sm ${
                        isMe
                          ? 'bg-primary text-primary-foreground rounded-br-sm'
                          : 'bg-muted text-foreground rounded-bl-sm'
                      }`}
                    >
                      {msg.content}
                    </div>
                  </div>
                )
              })
            )}
            <div ref={bottomRef} />
          </div>

          {/* Encerrar conversa — só para o vendedor */}
          {isSeller && status === 'active' && conversationId && (
            <div className='px-4 pb-2'>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant='outline'
                    size='sm'
                    className='w-full text-destructive border-destructive hover:bg-destructive hover:text-white'
                  >
                    Encerrar conversa
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Encerrar conversa?</AlertDialogTitle>
                    <AlertDialogDescription>
                      O comprador poderá avaliar você após o encerramento. Esta
                      ação não pode ser desfeita.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleEncerrar}
                      className='bg-destructive hover:bg-destructive/90'
                    >
                      Encerrar
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          )}

          {/* Input de mensagem */}
          <div className='flex items-center gap-2 px-4 py-3 border-t'>
            <Input
              placeholder={
                status === 'closed'
                  ? 'Conversa encerrada'
                  : 'Digite uma mensagem...'
              }
              value={content}
              onChange={e => setContent(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend()}
              disabled={status === 'closed'}
              className='text-sm'
            />
            <Button
              size='icon'
              onClick={handleSend}
              disabled={!content.trim() || status === 'closed'}
              className='shrink-0'
            >
              <Send className='h-4 w-4' />
            </Button>
          </div>
        </>
      )}
    </div>
  )
}
