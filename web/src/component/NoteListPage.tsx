import { useCallback, useEffect, useState } from 'react'
import { Note } from '../API.ts'
import { NoteRepository } from '../repository/NetworkNoteRepository.ts'
import { NoteCard } from './NoteCard.tsx'
import { FormActions, NoteForm } from './NoteForm.tsx'
import { Paths } from '../Paths.tsx'
import { useNavigate } from 'react-router-dom'
import './NoteListPage.module.scss'
import styles from './NoteListPage.module.scss'

interface NoteListPageProps {
  noteRepo: NoteRepository
}

export default function NoteListPage({ noteRepo }: NoteListPageProps) {
  const [notes, setNotes] = useState<Note[]>([])
  const navigate = useNavigate()

  const getAllNotes = useCallback(async () => {
    await noteRepo
      .getNotes()
      .then((data) => {
        sortNotesByUpdatedAtInDescendingOrder(data)
        setNotes(data)
      })
      .catch()
  }, [noteRepo])

  useEffect(() => {
    void getAllNotes()
  }, [getAllNotes])

  function sortNotesByUpdatedAtInDescendingOrder(notes: Note[]) {
    notes.sort((noteA, noteB) => {
      return (
        new Date(noteB.updatedAt).getTime() -
        new Date(noteA.updatedAt).getTime()
      )
    })
  }

  const onCreateNote = useCallback(
    async (note: Partial<Note>) => {
      await noteRepo.createNote(note)
      await getAllNotes()
    },
    [noteRepo, getAllNotes]
  )

  const onDeleteNote = useCallback(
    async (note: Note) => {
      if (note.id) {
        await noteRepo.deleteNote({ id: note.id })
        await getAllNotes()
      }
    },
    [noteRepo, getAllNotes]
  )

  const onUpdateNote = useCallback(
    (note: Note) => {
      if (note.id) {
        navigate(Paths.UpdatingNoteById(note.id))
      }
    },
    [navigate]
  )

  const onNoteDetail = useCallback(
    (note: Note) => {
      if (note.id) {
        navigate(Paths.NoteDetailById(note.id))
      }
    },
    [navigate]
  )

  return (
    <div className={styles.mainContainer}>
      <NoteForm
        note={null}
        action={FormActions.CREATE}
        onSubmitHandler={onCreateNote}
        onResetHandler={() => void {}}
      />
      <section className={styles.notesSection}>
        {notes.map((note, index) => (
          <div key={note.id ? note.id : index}>
            <NoteCard
              note={note}
              onUpdateHandler={onUpdateNote}
              onDeleteHandler={onDeleteNote}
              onDetailHandler={onNoteDetail}
            />
          </div>
        ))}
      </section>
    </div>
  )
}
