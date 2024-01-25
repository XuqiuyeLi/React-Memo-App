import { generateClient } from 'aws-amplify/api'
import { createNote, deleteNote } from '../graphql/mutations.ts'
import { type CreateNoteInput, DeleteNoteInput, Note } from '../API.ts'
import { listNotes } from '../graphql/queries.ts'

export interface NoteRepository {
  createNote(note: CreateNoteInput): Promise<void>
  getNotes(): Promise<Note[]>
  deleteNote(note: DeleteNoteInput): Promise<void>
}

export default class NetworkNoteRepository implements NoteRepository {
  client = generateClient()
  async createNote(note: CreateNoteInput): Promise<void> {
    await this.client.graphql({
      query: createNote,
      variables: {
        input: note,
      },
    })
  }
  async getNotes(): Promise<Note[]> {
    const notesData = await this.client.graphql({
      query: listNotes,
    })
    return Promise.resolve(notesData.data.listNotes.items)
  }

  async deleteNote(note: DeleteNoteInput): Promise<void> {
    await this.client.graphql({
      query: deleteNote,
      variables: {
        input: note,
      },
    })
  }
}
