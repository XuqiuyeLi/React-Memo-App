import {useRef} from 'react'
import {type CreateNoteInput} from '../API.ts'
import {NoteRepository} from '../repository/NetworkNoteRepository.ts'

interface NoteListProps {
    noteRepo: NoteRepository
}

export default function NoteListPage({ noteRepo }: NoteListProps) {
    const titleRef = useRef<HTMLInputElement | null>(null)
    const contentRef = useRef<HTMLTextAreaElement | null>(null)

    async function handleCreateNoteOnSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()
        if (titleRef.current && contentRef.current) {
            const note: CreateNoteInput = {
                title: titleRef.current.value,
                content: contentRef.current.value,
            }
            await noteRepo.createNote(note).then().catch()
        }
    }

    return (
        <div className="main">
            <h1>MEMO</h1>
            <form onSubmit={(event) => handleCreateNoteOnSubmit(event)}>
                <input
                    ref={titleRef}
                    aria-label="title"
                    placeholder="Memo Title"
                    type="text"
                />
                <textarea ref={contentRef} aria-label="content" placeholder="Content" />
                <button type="submit">
                    Create Memo
                </button>
            </form>
        </div>
    )
}