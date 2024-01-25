import NetworkNoteRepository from './NetworkNoteRepository.ts'
import { expect, vi } from 'vitest'
import { CreateNoteInput } from '../API.ts'

const mocks = vi.hoisted(() => {
    return {
        graphql: vi.fn(),
        createNote: vi.fn(),
    }
})

vi.mock('aws-amplify/api', () => ({
    generateClient: vi.fn().mockReturnValue({
        graphql: mocks.graphql,
    }),
}))

vi.mock('../graphql/mutations.ts', async (importOriginal) => {
    const mod = await importOriginal<typeof import('../graphql/mutations.ts')>()
    return {
        ...mod,
        createNote: mocks.createNote,
    }
})

describe('NetworkNoteRepository', () => {
    let networkNoteRepo: NetworkNoteRepository
    beforeEach(() => {
        networkNoteRepo = new NetworkNoteRepository()
    })
    test('createNote will call amplify client with correct parameters', async () => {
        const note: CreateNoteInput = {
            title: 'Sunday Board Game Night',
            content: 'bring meat and wine',
        }

        await networkNoteRepo.createNote(note)

        expect(mocks.graphql).toHaveBeenCalledWith({
            query: mocks.createNote,
            variables: {
                input: note,
            },
        })
    })
})