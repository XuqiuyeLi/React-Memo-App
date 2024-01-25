import '@testing-library/jest-dom'
import {fireEvent, render, screen} from '@testing-library/react'
import {expect, test} from 'vitest'
import Memo from "./NoteListPage.tsx"
import {userEvent} from '@testing-library/user-event'
import SpyStubNoteRepo from "../repository/SpyStubNoteRepository.ts"

describe('App', () => {
    let spyStubNoteRepo: SpyStubNoteRepo

    beforeEach(() => {
        spyStubNoteRepo = new SpyStubNoteRepo()
        render(<Memo noteRepo={spyStubNoteRepo}/>)
    })
    test('renders header', async () => {
        const header = await screen.findByText('MEMO')
        expect(header).toBeInTheDocument()
    })

    test('user can input title and content to create a note', async () => {
        const titleInput = screen.getByRole('textbox', {name: 'title'})
        const contentTextbox = screen.getByRole('textbox', {name: 'content'})
        const button = screen.getByRole('button', {name: 'Create Memo'})

        await userEvent.type(titleInput, 'Sunday Shopping List')
        await userEvent.type(contentTextbox, 'apples, beef, ice-cream')
        fireEvent.click(button)

        expect(spyStubNoteRepo.createNote_was_called).toBeTruthy()
        expect(spyStubNoteRepo.createNote_arg_note).toStrictEqual({
            title: 'Sunday Shopping List',
            content: 'apples, beef, ice-cream'
        })
    })
})