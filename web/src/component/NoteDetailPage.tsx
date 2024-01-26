import { NoteRepository } from '../repository/NetworkNoteRepository.ts'
import { useNavigate, useParams } from 'react-router-dom'
import { useCallback, useEffect, useState } from 'react'
import { Note } from '../API.ts'
import remarkGfm from 'remark-gfm'
import Markdown from 'react-markdown'
import './NoteDetailPage.module.scss'
import styles from './NoteDetailPage.module.scss'

interface NoteDetailProps {
  noteRepo: NoteRepository
}
export function NoteDetailPage({ noteRepo }: NoteDetailProps) {
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

  function onBackButton() {
    navigate('/')
  }

  return (
    <div className={styles.container}>
      <button className={styles.backButton} onClick={onBackButton}>
        Back To Home
      </button>
      {note && (
        <div className={styles.main}>
          <h1>{note.title}</h1>
          <Markdown className={styles.noteContent} remarkPlugins={[remarkGfm]}>
            {note.content}
          </Markdown>
        </div>
      )}
    </div>
  )
}
