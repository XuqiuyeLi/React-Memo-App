import { NoteRepository } from '../repository/NetworkNoteRepository.ts'
import { useParams } from 'react-router-dom'
import { useCallback, useEffect, useState } from 'react'
import { Note } from '../API.ts'
import styles from './NoteCard.module.scss'
import remarkGfm from 'remark-gfm'
import Markdown from 'react-markdown'

interface NoteDetailProps {
  noteRepo: NoteRepository
}
export function NoteDetailPage({ noteRepo }: NoteDetailProps) {
  const { noteId } = useParams()
  const [note, setNote] = useState<Note | null | undefined>(undefined)

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

  return (
    <div>
      <div>Back to Home</div>
      {note && (
        <div>
          <h1>{note.title}</h1>
          <Markdown className={styles.noteContent} remarkPlugins={[remarkGfm]}>
            {note.content}
          </Markdown>
        </div>
      )}
    </div>
  )
}
