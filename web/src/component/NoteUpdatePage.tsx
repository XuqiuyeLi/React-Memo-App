import { useNavigate, useParams } from 'react-router-dom'
import { NoteRepository } from '../repository/NetworkNoteRepository.ts'
import { useCallback, useEffect, useState } from 'react'
import { Note } from '../API.ts'
import { FormActions, NoteForm } from './NoteForm.tsx'
import { Paths } from '../Paths.tsx'

interface NoteUpdateProps {
  noteRepo: NoteRepository
}
export default function NoteUpdatePage({ noteRepo }: NoteUpdateProps) {
  const { noteId } = useParams()
  const [note, setNote] = useState<Note | null | undefined>(undefined)
  const navigate = useNavigate()

  const getNote = useCallback(async () => {
    if (noteId) {
      await noteRepo
        .getNote(noteId)
        .then((data) => {
          setNote(data)
        })
        .catch()
    }
  }, [noteId, noteRepo])

  useEffect(() => {
    void getNote()
  }, [getNote])

  const onUpdateNote = useCallback(
    async (newNote: Partial<Note>) => {
      if (noteId) {
        await noteRepo
          .updateNote({
            id: noteId,
            title: newNote.title,
            content: newNote.content,
          })
          .then(() => {
            navigate(Paths.Root)
          })
          .catch((error) => {
            console.log(error)
          })
      }
    },
    [navigate, noteId, noteRepo]
  )

  const onFormReset = useCallback(() => {
    navigate(Paths.Root)
  }, [navigate])

  return (
    <div>
      <NoteForm
        note={note}
        action={FormActions.UPDATE}
        onSubmitHandler={onUpdateNote}
        onResetHandler={onFormReset}
      />
    </div>
  )
}
