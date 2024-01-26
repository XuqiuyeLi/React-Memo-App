import NetworkNoteRepository from './repository/NetworkNoteRepository.ts'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { makeRoutes } from './Routes.tsx'
import type { Router } from '@remix-run/router'
import './App.scss'

export default function App() {
  const noteRepo = new NetworkNoteRepository()
  const router: Router = createBrowserRouter(makeRoutes(noteRepo))
  return <RouterProvider router={router} />
}
