import { generateClient } from 'aws-amplify/api'
import { createNote, deleteNote, updateNote } from '../graphql/mutations.ts'
import {
  type CreateNoteInput,
  DeleteNoteInput,
  Note,
  UpdateNoteInput,
} from '../API.ts'
import { getNote, listNotes } from '../graphql/queries.ts'

export interface NoteRepository {
  getNotes(): Promise<Note[]>
  getNote(id: string): Promise<Note | null | undefined>
  createNote(note: CreateNoteInput): Promise<void>
  deleteNote(note: DeleteNoteInput): Promise<void>
  updateNote(note: UpdateNoteInput): Promise<void>
}

export default class NetworkNoteRepository implements NoteRepository {
  client = generateClient()
  async getNotes(): Promise<Note[]> {
    const notesData = await this.client.graphql({
      query: listNotes,
      variables: {
        limit: 30,
      },
    })
    return Promise.resolve(notesData.data.listNotes.items)
  }
  async getNote(id: string): Promise<Note | null | undefined> {
    const noteData = await this.client.graphql({
      query: getNote,
      variables: { id: id },
    })
    return Promise.resolve(noteData.data.getNote)
  }
  async createNote(note: CreateNoteInput): Promise<void> {
    await this.client.graphql({
      query: createNote,
      variables: {
        input: note,
      },
    })
  }
  async deleteNote(note: DeleteNoteInput): Promise<void> {
    await this.client.graphql({
      query: deleteNote,
      variables: {
        input: note,
      },
    })
  }

  async updateNote(note: UpdateNoteInput): Promise<void> {
    await this.client.graphql({
      query: updateNote,
      variables: {
        input: note,
      },
    })
  }
}
