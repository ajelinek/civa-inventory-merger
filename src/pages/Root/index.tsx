import { Outlet, useNavigate } from 'react-router-dom'
import Header from '../../components/Header'
import { useStore } from '../../store'
import { useEffect } from 'react'
import { useAuthorizedUser } from '../../store/auth'

export default function App() {
  useAuthorizedUser()
  const user = useStore(state => state.user)
  const nav = useNavigate()

  //if not user redirect to login using react router
  useEffect(() => {
    if (!user) nav('/')
  }, [user])

  if (user === undefined) return (<div>Loading...</div>)


  return (
    <main >
      <Header />
      <Outlet />
    </main>
  )
}
