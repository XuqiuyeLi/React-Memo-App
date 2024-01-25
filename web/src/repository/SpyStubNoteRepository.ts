import { NoteRepository } from './NetworkNoteRepository.ts'
import { CreateNoteInput } from '../API.ts'

export default class SpyStubNoteRepo implements NoteRepository {
    createNote_was_called = false
    createNote_arg_note: CreateNoteInput = { title: '', content: '' }

    createNote(note: CreateNoteInput): Promise<void> {
        this.createNote_was_called = true
        this.createNote_arg_note = note
        return Promise.resolve()
    }
}