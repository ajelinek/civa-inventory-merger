import { useStore } from '../../store'
import { useLogout } from '../../store/auth'
import s from './header.module.css'

export default function Header() {
  const user = useStore(state => state.user)
  const logout = useLogout()
  return (
    <header className={s.header}>
      <h1 className={s.title}>CIVA - Inventory Catalog</h1>
      {user && <button className={s.logout} onClick={() => logout.execute()}>Logout</button>}
    </header>
  )
};

