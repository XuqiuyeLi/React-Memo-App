import { Paths } from './Paths.tsx'
import { NoteRepository } from './repository/NetworkNoteRepository.ts'
import { RouteObject } from 'react-router-dom'
import NoteListPage from './component/NoteListPage.tsx'
import NoteUpdatePage from './component/NoteUpdatePage.tsx'
import AppLayout from './AppLayout.tsx'
import { NoteDetailPage } from './component/NoteDetailPage.tsx'

export function makeRoutes(noteRepo: NoteRepository): RouteObject[] {
  return [
    {
      path: Paths.Root,
      element: <AppLayout />,
      children: [
        {
          path: Paths.Root,
          element: <NoteListPage noteRepo={noteRepo} />,
        },
        {
          path: Paths.NoteDetailById(':noteId'),
          element: <NoteDetailPage noteRepo={noteRepo} />,
        },
        {
          path: Paths.UpdatingNoteById(':noteId'),
          element: <NoteUpdatePage noteRepo={noteRepo} />,
        },
      ],
    },
  ]
}
