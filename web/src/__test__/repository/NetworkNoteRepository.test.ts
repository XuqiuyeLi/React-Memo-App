import NetworkNoteRepository from '../../repository/NetworkNoteRepository.ts'
import { expect, vi } from 'vitest'
import { CreateNoteInput, UpdateNoteInput } from '../../API.ts'

const mocks = vi.hoisted(() => {
  return {
    graphql: vi.fn(),
    listNotes: vi.fn(),
    getNote: vi.fn(),
    createNote: vi.fn(),
    deleteNote: vi.fn(),
    updateNote: vi.fn(),
  }
})

vi.mock('aws-amplify/api', () => ({
  generateClient: vi.fn().mockReturnValue({
    graphql: mocks.graphql,
  }),
}))

vi.mock('../../graphql/queries.ts', () => {
  return {
    listNotes: mocks.listNotes,
    getNote: mocks.getNote,
  }
})

vi.mock('../../graphql/mutations.ts', async (importOriginal) => {
  const mod =
    await importOriginal<typeof import('../../graphql/mutations.ts')>()
  return {
    ...mod,
    createNote: mocks.createNote,
    deleteNote: mocks.deleteNote,
    updateNote: mocks.updateNote,
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

  test('getNotes will return all notes saves in db', async () => {
    const mockedNotes = [
      {
        title: 'Chinese New Year',
        content: 'Book flight ticket and buy clothes',
      },
      { title: 'Tennis camp', content: 'Decide a day and book hotel' },
      { title: 'Board game night', content: 'Bring meat and wine' },
    ]
    mocks.graphql.mockResolvedValue({
      data: { listNotes: { items: mockedNotes } },
    })

    const notes = await networkNoteRepo.getNotes()

    expect(notes).toStrictEqual(mockedNotes)
    expect(mocks.graphql).toHaveBeenCalledWith({
      query: mocks.listNotes,
      variables: {
        limit: 30,
      },
    })
  })

  test('getNote will get a specific note if existed', async () => {
    const mockedNote = {
      id: '1',
      title: 'Chinese New Year',
      content: 'Book flight ticket and buy clothes',
    }

    mocks.graphql.mockResolvedValue({
      data: { getNote: mockedNote },
    })

    const note = await networkNoteRepo.getNote('1')

    expect(note).toStrictEqual(mockedNote)
    expect(mocks.graphql).toHaveBeenCalledWith({
      query: mocks.getNote,
      variables: { id: '1' },
    })
  })

  test('deleteNote will delete a note saved in aws amplify', async () => {
    const mockedDeleteNoteInput = { id: '1' }
    await networkNoteRepo.deleteNote(mockedDeleteNoteInput)

    expect(mocks.graphql).toHaveBeenCalledWith({
      query: mocks.deleteNote,
      variables: {
        input: mockedDeleteNoteInput,
      },
    })
  })

  test('updateNote will update an existing note and save to db', async () => {
    const mockedUpdateNoteInput: UpdateNoteInput = {
      id: '1',
      title: 'updated title',
      content: 'updated content',
    }
    await networkNoteRepo.updateNote(mockedUpdateNoteInput)

    expect(mocks.graphql).toHaveBeenCalledWith({
      query: mocks.updateNote,
      variables: {
        input: mockedUpdateNoteInput,
      },
    })
  })
})
