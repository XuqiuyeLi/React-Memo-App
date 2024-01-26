import { act, render, screen } from '@testing-library/react'
import { expect, vi, test } from 'vitest'
import NoteListPage from '../../component/NoteListPage.tsx'
import { userEvent } from '@testing-library/user-event'
import SpyStubNoteRepo from '../repository/SpyStubNoteRepo.ts'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { Paths } from '../../Paths.tsx'

const mocks = vi.hoisted(() => {
  return {
    useNavigate: vi.fn(),
  }
})
vi.mock('react-router-dom', async () => {
  const mod = await vi.importActual('react-router-dom')
  return {
    ...mod,
    useNavigate: () => mocks.useNavigate,
  }
})

describe('NoteListPage', () => {
  let spyStubNoteRepo: SpyStubNoteRepo

  async function renderComponent(noteRepo: SpyStubNoteRepo) {
    await act(async () =>
      render(
        <MemoryRouter initialEntries={[Paths.Root]}>
          <Routes>
            <Route
              path={Paths.Root}
              element={<NoteListPage noteRepo={noteRepo} />}
            />
          </Routes>
        </MemoryRouter>
      )
    )
  }

  beforeEach(() => {
    spyStubNoteRepo = new SpyStubNoteRepo()
  })

  test('user can input title and content to create a note', async () => {
    await renderComponent(spyStubNoteRepo)

    const titleInput = screen.getByRole('textbox', { name: 'title' })
    const contentTextbox = screen.getByRole('textbox', { name: 'content' })
    const button = screen.getByRole('button', { name: 'Create Memo' })

    await userEvent.type(titleInput, 'Sunday Shopping List')
    await userEvent.type(contentTextbox, 'apples, beef, ice-cream')
    await userEvent.click(button)

    expect(spyStubNoteRepo.createNote_was_called).toBeTruthy()
    expect(spyStubNoteRepo.createNote_arg_note).toStrictEqual({
      title: 'Sunday Shopping List',
      content: 'apples, beef, ice-cream',
    })
  })

  test('user can see all notes created sorted by updatedAt descending order', async () => {
    spyStubNoteRepo.getNotes_return_value = [
      {
        __typename: 'Note',
        id: '1',
        title: 'Chinese New Year',
        content: 'Book flight ticket and buy clothes',
        createdAt: '',
        updatedAt: '2023/10/20',
      },
      {
        __typename: 'Note',
        id: '2',
        title: 'Tennis camp',
        content: 'Decide a day and book hotel',
        createdAt: '',
        updatedAt: '2024/01/20',
      },
      {
        __typename: 'Note',
        id: '3',
        title: 'Board game night',
        content: 'Bring meat and wine',
        createdAt: '',
        updatedAt: '2023/11/20',
      },
    ]
    await renderComponent(spyStubNoteRepo)

    const noteTitleElements = screen.getAllByTestId('note-title')
    const noteContentElements = screen.getAllByTestId('note-content')
    expect(noteTitleElements[0]).toHaveTextContent('Tennis camp')
    expect(noteContentElements[0]).toHaveTextContent(
      'Decide a day and book hotel'
    )
    expect(noteTitleElements[1]).toHaveTextContent('Board game night')
    expect(noteContentElements[1]).toHaveTextContent('Bring meat and wine')
    expect(noteTitleElements[2]).toHaveTextContent('Chinese New Year')
    expect(noteContentElements[2]).toHaveTextContent(
      'Book flight ticket and buy clothes'
    )
  })

  test('when user clicks delete button on a note, repo will receive the correct note to be deleted', async () => {
    spyStubNoteRepo.getNotes_return_value = [
      {
        __typename: 'Note',
        id: '1',
        title: 'Chinese New Year',
        content: 'Book flight ticket and buy clothes',
        createdAt: '',
        updatedAt: '',
      },
      {
        __typename: 'Note',
        id: '2',
        title: 'Tennis camp',
        content: 'Decide a day and book hotel',
        createdAt: '',
        updatedAt: '',
      },
    ]
    render(<NoteListPage noteRepo={spyStubNoteRepo} />)

    const deleteButtons = await screen.findAllByRole('button', {
      name: 'Delete',
    })
    await userEvent.click(deleteButtons[0])

    expect(spyStubNoteRepo.deleteNote_was_called).toBeTruthy()
    expect(spyStubNoteRepo.deleteNote_arg_note).toStrictEqual({ id: '1' })
  })

  test('when update button of a note is clicked, user will be redirected to /notes/update/{id} page', async () => {
    spyStubNoteRepo.getNotes_return_value = [
      {
        __typename: 'Note',
        id: '1',
        title: 'Chinese New Year',
        content: 'Book flight ticket and buy clothes',
        createdAt: '',
        updatedAt: '2023/11/20',
      },
      {
        __typename: 'Note',
        id: '2',
        title: 'Tennis camp',
        content: 'Decide a day and book hotel',
        createdAt: '',
        updatedAt: '2023/10/31',
      },
    ]
    await renderComponent(spyStubNoteRepo)

    const updateButtons = screen.getAllByRole('button', {
      name: 'Update',
    })
    await userEvent.click(updateButtons[0])

    expect(mocks.useNavigate).toHaveBeenCalledWith('/notes/update/1')
  })

  test('when a note is clicked, user will be redirected to /notes/{id} page', async () => {
    spyStubNoteRepo.getNotes_return_value = [
      {
        __typename: 'Note',
        id: '1',
        title: 'Chinese New Year',
        content: 'Book flight ticket and buy clothes',
        createdAt: '',
        updatedAt: '2023/11/20',
      },
      {
        __typename: 'Note',
        id: '2',
        title: 'Tennis camp',
        content: 'Decide a day and book hotel',
        createdAt: '',
        updatedAt: '2023/10/31',
      },
    ]
    await renderComponent(spyStubNoteRepo)

    const detailButtons = screen.getAllByRole('button', {
      name: 'See More Details',
    })
    await userEvent.click(detailButtons[1])

    expect(mocks.useNavigate).toHaveBeenCalledWith('/notes/2')
  })
})
