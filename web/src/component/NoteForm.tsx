import { Note } from '../API.ts'
import React, { useEffect, useRef, useState } from 'react'
import './NoteForm.module.scss'
import styles from './NoteForm.module.scss'

export enum FormActions {
  CREATE = 'Create Memo',
  UPDATE = 'Update Memo',
}

interface NoteFormProps {
  note: Note | null | undefined
  action: FormActions
  onSubmitHandler: (note: Partial<Note>) => Promise<void>
  onResetHandler: () => void
}

interface OriginalNote {
  title: string
  content: string
}

export function NoteForm({
  note,
  action,
  onSubmitHandler,
  onResetHandler,
}: NoteFormProps) {
  const titleRef = useRef<HTMLInputElement | null>(null)
  const contentRef = useRef<HTMLTextAreaElement | null>(null)
  const [originalNote, setOriginalNote] = useState<OriginalNote>()

  useEffect(() => {
    const originalTitle: string = note?.title ? note.title : ''
    const originalContent: string = note?.content ? note.content : ''
    setOriginalNote({ title: originalTitle, content: originalContent })
  }, [note])

  async function handleFormOnSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (titleRef.current && contentRef.current) {
      const note = {
        title: titleRef.current?.value,
        content: contentRef.current?.value,
      }
      titleRef.current.value = ''
      contentRef.current.value = ''
      await onSubmitHandler(note)
    }
  }

  return (
    <div>
      <form
        onSubmit={(event) => void handleFormOnSubmit(event)}
        onReset={onResetHandler}
      >
        <input
          className={styles.formInput}
          ref={titleRef}
          aria-label="title"
          placeholder="Memo Title"
          defaultValue={originalNote?.title}
          type="text"
        />
        <textarea
          className={styles.formInput}
          rows={10}
          ref={contentRef}
          aria-label="content"
          placeholder="Content"
          defaultValue={originalNote?.content}
        />
        {action === FormActions.CREATE && (
          <button
            type="submit"
            className={`${styles.formButton} ${styles.createMemoButton}`}
          >
            {FormActions.CREATE}
          </button>
        )}
        {action === FormActions.UPDATE && (
          <div>
            <button
              type="submit"
              className={`${styles.formButton} ${styles.updateMemoButton}`}
            >
              {FormActions.UPDATE}
            </button>
            <button
              type="reset"
              className={`${styles.formButton} ${styles.cancelButton}`}
            >
              Cancel
            </button>
          </div>
        )}
      </form>
    </div>
  )
}
