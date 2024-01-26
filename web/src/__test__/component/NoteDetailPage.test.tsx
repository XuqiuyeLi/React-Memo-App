import { expect, vi } from 'vitest'
import SpyStubNoteRepo from '../repository/SpyStubNoteRepo.ts'
import { act, render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { Paths } from '../../Paths.tsx'
import { NoteDetailPage } from '../../component/NoteDetailPage.tsx'
import { userEvent } from '@testing-library/user-event'

const mocks = vi.hoisted(() => {
  return {
    useParams: vi.fn().mockReturnValue({ noteId: '999' }),
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

describe('NoteDetailPage', () => {
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
              path={Paths.NoteDetailById(':noteId')}
              element={<NoteDetailPage noteRepo={noteRepo} />}
            />
          </Routes>
        </MemoryRouter>
      )
    })
  }

  beforeEach(() => {
    spyStubNoteRepo = new SpyStubNoteRepo()
  })

  test('will show the note by :noteId from repo', async () => {
    spyStubNoteRepo.getNote_return_value = {
      __typename: 'Note',
      id: '999',
      title: 'French Dinner',
      content: 'Reserve a date and course',
      createdAt: '',
      updatedAt: '',
    }

    await renderComponent(Paths.NoteDetailById('999'), spyStubNoteRepo)

    expect(spyStubNoteRepo.getNote_was_called).toBeTruthy()
    expect(spyStubNoteRepo.getNote_arg_id).toBe('999')
    expect(screen.getByText('French Dinner')).toBeInTheDocument()
    expect(screen.getByText('Reserve a date and course')).toBeInTheDocument()
  })

  test('user clicks on back to home, will be redirected to / path', async () => {
    await renderComponent(Paths.NoteDetailById('1'), spyStubNoteRepo)

    const backToHomeButton = screen.getByRole('button', {
      name: 'Back To Home',
    })
    await userEvent.click(backToHomeButton)

    expect(mocks.useNavigate).toHaveBeenCalledWith('/')
  })
})
