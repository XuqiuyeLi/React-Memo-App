import NetworkNoteRepository from './repository/NetworkNoteRepository.ts'
import NoteListPage from "./component/NoteListPage.tsx";

export default function App() {
    const noteRepo = new NetworkNoteRepository()
    return (
        <div>
            <NoteListPage noteRepo={noteRepo} />
        </div>
    )
}
