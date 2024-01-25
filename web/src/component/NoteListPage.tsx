import React, { useCallback, useEffect, useRef, useState } from 'react'
import { type CreateNoteInput, Note } from '../API.ts'
import { NoteRepository } from '../repository/NetworkNoteRepository.ts'

interface NoteListPageProps {
  noteRepo: NoteRepository
}

export default function NoteListPage({ noteRepo }: NoteListPageProps) {
  const titleRef = useRef<HTMLInputElement | null>(null)
  const contentRef = useRef<HTMLTextAreaElement | null>(null)
  const [notes, setNotes] = useState<Note[]>([])

  const getAllNotes = useCallback(async () => {
    await noteRepo
      .getNotes()
      .then((data) => {
        sortNotesByUpdatedAtInDescendingOrder(data)
        setNotes(data)
      })
      .catch()
  }, [noteRepo])

  useEffect(() => {
    void getAllNotes()
  }, [getAllNotes])

  async function handleCreateNoteOnSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault()
    if (titleRef.current && contentRef.current) {
      const note: CreateNoteInput = {
        title: titleRef.current.value,
        content: contentRef.current.value,
      }
      await noteRepo.createNote(note).then().catch()
      await getAllNotes()
    }
  }

  function sortNotesByUpdatedAtInDescendingOrder(notes: Note[]) {
    notes.sort((noteA, noteB) => {
      return (
        new Date(noteB.updatedAt).getTime() -
        new Date(noteA.updatedAt).getTime()
      )
    })
  }

  return (
    <div className="main">
      <h1>MEMO</h1>
      <form onSubmit={(event) => void handleCreateNoteOnSubmit(event)}>
        <input
          ref={titleRef}
          aria-label="title"
          placeholder="Memo Title"
          type="text"
        />
        <textarea ref={contentRef} aria-label="content" placeholder="Content" />
        <button type="submit">Create Memo</button>
      </form>
      {notes.map((note, index) => (
        <div key={note.id ? note.id : index}>
          <p data-testid="note-title">{note.title}</p>
          <p data-testid="note-content">{note.content}</p>
        </div>
      ))}
    </div>
  )
}
