import {generateClient} from 'aws-amplify/api'
import {createNote} from '../graphql/mutations.ts'
import {type CreateNoteInput} from '../API.ts'

export interface NoteRepository {
    createNote(note: CreateNoteInput): Promise<void>
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
}