import { Note } from '../API.ts'
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

interface NoteCardProps {
  note: Note
  onUpdateHandler: (note: Note) => void
  onDeleteHandler: (note: Note) => Promise<void>
}

export function NoteCard({
  note,
  onUpdateHandler,
  onDeleteHandler,
}: NoteCardProps) {
  return (
    <div>
      <div data-testid="note-title">{note.title}</div>
      <div data-testid="note-content">
        <Markdown remarkPlugins={[remarkGfm]}>{note.content}</Markdown>
      </div>
      <button type="submit" onClick={() => void onUpdateHandler(note)}>
        Update
      </button>
      <button type="submit" onClick={() => void onDeleteHandler(note)}>
        Delete
      </button>
    </div>
  )
}
