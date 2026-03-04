'use client'

import { Button } from '@/components/ui/button'
import { Field, FieldGroup, FieldLabel, FieldSet } from '@/components/ui/field'
import { Textarea } from '@/components/ui/textarea'
import { Check, Pencil, X } from 'lucide-react'
import { useState } from 'react'

interface BiografiaFieldProps {
  initialBiografia?: string | null
  onSave?: (biografia: string) => Promise<void>
}

export function BiografiaField({
  initialBiografia,
  onSave,
}: BiografiaFieldProps) {
  const [isEditing, setIsEditing] = useState(!initialBiografia)
  const [biografia, setBiografia] = useState(initialBiografia ?? '')
  const [draft, setDraft] = useState(initialBiografia ?? '')
  const [isSaving, setIsSaving] = useState(false)

  const handleEdit = () => {
    setDraft(biografia)
    setIsEditing(true)
  }

  const handleCancel = () => {
    setDraft(biografia)
    setIsEditing(false)
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      await onSave?.(draft)
      setBiografia(draft)
      setIsEditing(false)
    } catch (err) {
      console.error('Erro ao salvar biografia:', err)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <FieldSet className='w-full'>
      <FieldGroup>
        <Field>
          <div className='flex items-center justify-between mb-1'>
            <FieldLabel htmlFor='biografia'>Biografia</FieldLabel>

            {/* Botão Editar — só aparece quando não está editando e já há texto */}
            {!isEditing && biografia && (
              <Button
                variant='ghost'
                size='sm'
                onClick={handleEdit}
                className='h-7 gap-1 text-muted-foreground hover:text-foreground'
              >
                <Pencil className='h-3.5 w-3.5' />
                Editar
              </Button>
            )}
          </div>

          {isEditing ? (
            <>
              <Textarea
                id='biografia'
                value={draft}
                onChange={e => setDraft(e.target.value)}
                placeholder='Fale um pouco mais sobre você...'
                rows={4}
                className='resize-none'
              />

              <div className='flex justify-end gap-2 mt-2'>
                {/* Cancelar — só aparece se já existia uma biografia salva */}
                {biografia && (
                  <Button
                    variant='ghost'
                    size='sm'
                    onClick={handleCancel}
                    className='gap-1'
                  >
                    <X className='h-3.5 w-3.5' />
                    Cancelar
                  </Button>
                )}

                <Button
                  size='sm'
                  onClick={handleSave}
                  disabled={isSaving || draft.trim() === ''}
                  className='gap-1'
                >
                  <Check className='h-3.5 w-3.5' />
                  {isSaving ? 'Salvando...' : 'Salvar'}
                </Button>
              </div>
            </>
          ) : (
            // Modo visualização
            <p className='text-sm text-muted-foreground whitespace-pre-wrap rounded-md border border-transparent px-1 py-2 min-h-24'>
              {biografia || (
                <span className='italic'>
                  Nenhuma biografia cadastrada.{' '}
                  <button
                    onClick={handleEdit}
                    className='underline underline-offset-2 hover:text-foreground transition-colors'
                  >
                    Adicionar uma agora
                  </button>
                </span>
              )}
            </p>
          )}
        </Field>
      </FieldGroup>
    </FieldSet>
  )
}
