import { NoteRepository } from './NetworkNoteRepository.ts'
import { CreateNoteInput, Note } from '../API.ts'

export default class SpyStubNoteRepo implements NoteRepository {
  createNote_was_called = false
  createNote_arg_note: CreateNoteInput = { title: '', content: '' }
  getNotes_was_called = false
  getNotes_return_value: Note[] = []
  createNote(note: CreateNoteInput): Promise<void> {
    this.createNote_was_called = true
    this.createNote_arg_note = note
    return Promise.resolve()
  }

  getNotes(): Promise<Note[]> {
    this.getNotes_was_called = true
    return Promise.resolve(this.getNotes_return_value)
  }
}
