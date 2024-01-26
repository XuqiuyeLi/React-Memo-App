import { Note } from '../API.ts'
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import './NoteCard.module.scss'
import styles from './NoteCard.module.scss'

interface NoteCardProps {
  note: Note
  onUpdateHandler: (note: Note) => void
  onDeleteHandler: (note: Note) => Promise<void>
  onDetailHandler: (note: Note) => void
}

export function NoteCard({
  note,
  onUpdateHandler,
  onDeleteHandler,
  onDetailHandler,
}: NoteCardProps) {
  return (
    <div className={styles.noteCard}>
      <div className={styles.description}>
        <div data-testid="note-title" className={styles.noteTitle}>
          {note.title}
        </div>
        <div data-testid="note-content">
          <Markdown className={styles.noteContent} remarkPlugins={[remarkGfm]}>
            {note.content}
          </Markdown>
        </div>
      </div>
      <div className={styles.cardActionButtons}>
        <button
          className={styles.noteCardButton}
          type="submit"
          onClick={() => void onUpdateHandler(note)}
        >
          Update
        </button>
        <button
          className={styles.noteCardButton}
          type="submit"
          onClick={() => void onDeleteHandler(note)}
        >
          Delete
        </button>
        <button
          className={styles.detailButton}
          type="submit"
          onClick={() => void onDetailHandler(note)}
        >
          See More Details
        </button>
      </div>
    </div>
  )
}
