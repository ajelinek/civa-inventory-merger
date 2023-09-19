import { Outlet, useNavigate } from 'react-router-dom'
import Header from '../../components/Header'
import { useAuthorizedUser, useStore } from '../../store'
import { useEffect } from 'react'

export default function App() {
  useAuthorizedUser()
  const user = useStore(state => state.user)
  const nav = useNavigate()

  useEffect(() => {
    if (!user) nav('/')
  }, [user])

  if (user === undefined) return (<div aria-busy={true}>Loading...</div>)

  return (
    <main >
      <Header />
      <Outlet />
    </main>
  )
}
