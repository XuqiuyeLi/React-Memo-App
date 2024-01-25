import { NoteRepository } from '../../repository/NetworkNoteRepository.ts'
import {
  CreateNoteInput,
  DeleteNoteInput,
  Note,
  UpdateNoteInput,
} from '../../API.ts'

export default class SpyStubNoteRepo implements NoteRepository {
  createNote_was_called = false
  createNote_arg_note: CreateNoteInput = { title: '', content: '' }
  getNotes_was_called = false
  getNotes_return_value: Note[] = []
  getNote_was_called = false
  getNote_arg_id = ''
  getNote_return_value: Note | null | undefined = undefined
  deleteNote_was_called = false
  deleteNote_arg_note: DeleteNoteInput = { id: '' }
  updateNote_was_called = false
  updateNote_arg_note: UpdateNoteInput = { id: '' }
  getNotes(): Promise<Note[]> {
    this.getNotes_was_called = true
    return Promise.resolve(this.getNotes_return_value)
  }

  getNote(id: string): Promise<Note | null | undefined> {
    this.getNote_was_called = true
    this.getNote_arg_id = id
    return Promise.resolve(this.getNote_return_value)
  }

  createNote(note: CreateNoteInput): Promise<void> {
    this.createNote_was_called = true
    this.createNote_arg_note = note
    return Promise.resolve()
  }

  deleteNote(note: DeleteNoteInput): Promise<void> {
    this.deleteNote_was_called = true
    this.deleteNote_arg_note = note
    return Promise.resolve()
  }

  updateNote(note: UpdateNoteInput): Promise<void> {
    this.updateNote_was_called = true
    this.updateNote_arg_note = note
    return Promise.resolve()
  }
}
