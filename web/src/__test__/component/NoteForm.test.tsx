import { render, screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { expect, vi, test } from 'vitest'
import { FormActions, NoteForm } from '../../component/NoteForm.tsx'
import { Note } from '../../API.ts'

describe('NoteForm', () => {
  const mockOnSubmitHandler = vi.fn().mockImplementation(() => Promise<void>)
  const mockOnResetHandler = vi.fn()

  describe('create note form', () => {
    beforeEach(() => {
      render(
        <NoteForm
          note={null}
          action={FormActions.CREATE}
          onSubmitHandler={mockOnSubmitHandler}
          onResetHandler={mockOnResetHandler}
        />
      )
    })
    test('show only Create Memo button if form is to create note', () => {
      const createMemoButton = screen.getByRole('button', {
        name: 'Create Memo',
      })
      const updateMemoButton = screen.queryByRole('button', {
        name: 'Update Memo',
      })
      const cancelButton = screen.queryByRole('button', { name: 'Cancel' })

      expect(createMemoButton).toBeInTheDocument()
      expect(updateMemoButton).not.toBeInTheDocument()
      expect(cancelButton).not.toBeInTheDocument()
    })

    test(
      'when user input title, content and clicks on Create Memo, ' +
        'onSubmitHandler is called and input fields are cleared',
      async () => {
        await submitNote('test-title', 'test-content', 'Create Memo')

        const titleInput = screen.getByRole('textbox', { name: 'title' })
        const contentTextbox = screen.getByRole('textbox', { name: 'content' })

        expect(mockOnSubmitHandler).toHaveBeenCalled()
        expect(titleInput).toHaveValue('')
        expect(contentTextbox).toHaveValue('')
      }
    )
  })

  describe('update note form', () => {
    const mockedNote: Note = {
      __typename: 'Note',
      id: '1',
      title: 'Chinese New Year',
      content: 'Book flight ticket and buy clothes',
      createdAt: '',
      updatedAt: '',
    }

    beforeEach(() => {
      render(
        <NoteForm
          note={mockedNote}
          action={FormActions.UPDATE}
          onSubmitHandler={mockOnSubmitHandler}
          onResetHandler={mockOnResetHandler}
        />
      )
    })

    test('show Update Memo and Cancel button if form is to update note', () => {
      const createMemoButton = screen.queryByRole('button', {
        name: 'Create Memo',
      })
      const updateMemoButton = screen.getByRole('button', {
        name: 'Update Memo',
      })
      const cancelButton = screen.getByRole('button', { name: 'Cancel' })

      expect(createMemoButton).not.toBeInTheDocument()
      expect(updateMemoButton).toBeInTheDocument()
      expect(cancelButton).toBeInTheDocument()
    })

    test('show the original note title and content in the form fields', () => {
      const titleInput = screen.getByRole('textbox', { name: 'title' })
      const contentTextbox = screen.getByRole('textbox', {
        name: 'content',
      })

      expect(titleInput).toHaveValue(mockedNote.title)
      expect(contentTextbox).toHaveValue(mockedNote.content)
    })

    test('when user input title, content and clicks on Update Memo, onSubmitHandler is called', async () => {
      await submitNote(
        'Board Game Night',
        'Decide which game to play',
        'Update Memo'
      )

      expect(mockOnSubmitHandler).toHaveBeenCalled()
    })

    test('when user clicks on Cancel, onResetHandler is called', async () => {
      await submitNote('test-title', 'test-content', 'Cancel')

      expect(mockOnResetHandler).toHaveBeenCalled()
    })
  })

  async function submitNote(
    title: string,
    content: string,
    buttonName: string
  ) {
    const titleInput = screen.getByRole('textbox', { name: 'title' })
    const contentTextbox = screen.getByRole('textbox', { name: 'content' })
    const button = screen.getByRole('button', { name: buttonName })

    await userEvent.type(titleInput, title)
    await userEvent.type(contentTextbox, content)
    await userEvent.click(button)
  }
})
