import { Outlet } from 'react-router-dom'
import GlobalHeader from './component/GlobalHeader.tsx'

export default function AppLayout() {
  return (
    <>
      <GlobalHeader />
      <div>
        <Outlet />
      </div>
    </>
  )
}
