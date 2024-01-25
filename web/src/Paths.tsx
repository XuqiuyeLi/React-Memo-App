export const Paths = {
  Root: '/',
  UpdatingNoteById: (noteId: string) => `/notes/update/${noteId}`,
} as const
