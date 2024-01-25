import { expect, vi } from 'vitest'
import { act, render, screen } from '@testing-library/react'
import NoteUpdatePage from '../../component/NoteUpdatePage.tsx'
import SpyStubNoteRepo from '../repository/SpyStubNoteRepo.ts'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { Paths } from '../../Paths.tsx'
import { userEvent } from '@testing-library/user-event'

const mocks = vi.hoisted(() => {
  return {
    useParams: vi.fn().mockReturnValue({ noteId: '1' }),
    useNavigate: vi.fn(),
  }
})
vi.mock('react-router-dom', async () => {
  const mod = await vi.importActual('react-router-dom')
  return {
    ...mod,
    useParams: mocks.useParams,
    useNavigate: () => mocks.useNavigate,
  }
})

describe('NoteUpdatePage', () => {
  let spyStubNoteRepo: SpyStubNoteRepo

  async function renderComponent(
    initialURL: string,
    noteRepo: SpyStubNoteRepo
  ) {
    await act(async () => {
      render(
        <MemoryRouter initialEntries={[initialURL]}>
          <Routes>
            <Route
              path={Paths.UpdatingNoteById(':noteId')}
              element={<NoteUpdatePage noteRepo={noteRepo} />}
            />
          </Routes>
        </MemoryRouter>
      )
    })
  }

  beforeEach(() => {
    spyStubNoteRepo = new SpyStubNoteRepo()
  })

  test('user can see an existing note fetched by id', async () => {
    spyStubNoteRepo.getNote_return_value = {
      __typename: 'Note',
      id: '1',
      title: 'Chinese New Year',
      content: 'Book flight ticket and buy clothes',
      createdAt: '',
      updatedAt: '',
    }

    await renderComponent(Paths.UpdatingNoteById('1'), spyStubNoteRepo)

    const titleInput = await screen.findByRole('textbox', { name: 'title' })
    const contentTextbox = await screen.findByRole('textbox', {
      name: 'content',
    })

    expect(spyStubNoteRepo.getNote_was_called).toBeTruthy()
    expect(spyStubNoteRepo.getNote_arg_id).toBe('1')
    expect(titleInput).toHaveValue('Chinese New Year')
    expect(contentTextbox).toHaveValue('Book flight ticket and buy clothes')
  })

  test('user can edit the original note, when Update Memo is clicked, redirect to NoteListPage', async () => {
    spyStubNoteRepo.getNote_return_value = {
      __typename: 'Note',
      id: '1',
      title: 'test-title',
      content: 'test-content',
      createdAt: '',
      updatedAt: '',
    }

    await renderComponent(Paths.UpdatingNoteById('1'), spyStubNoteRepo)

    const titleInput = screen.getByRole('textbox', { name: 'title' })
    const contentTextbox = screen.getByRole('textbox', { name: 'content' })
    const updateButton = screen.getByRole('button', { name: 'Update Memo' })

    await userEvent.clear(titleInput)
    await userEvent.type(titleInput, 'updated-title')
    await userEvent.clear(contentTextbox)
    await userEvent.type(contentTextbox, 'updated-content')
    await userEvent.click(updateButton)

    expect(spyStubNoteRepo.updateNote_was_called).toBeTruthy()
    expect(spyStubNoteRepo.updateNote_arg_note).toStrictEqual({
      id: '1',
      title: 'updated-title',
      content: 'updated-content',
    })
    expect(mocks.useNavigate).toHaveBeenCalledWith('/')
  })
})
