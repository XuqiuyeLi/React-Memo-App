export const Paths = {
  Root: '/',
  NoteDetailById: (noteId: string) => `/notes/${noteId}`,
  UpdatingNoteById: (noteId: string) => `/notes/update/${noteId}`,
} as const
