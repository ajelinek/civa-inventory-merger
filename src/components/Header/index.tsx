import { Link } from 'react-router-dom'
import { useStore } from '../../store'
import { useLogout } from '../../store/auth'
import s from './header.module.css'

export default function Header() {
  const user = useStore(state => state.user)
  const logout = useLogout()
  return (
    <>
      <header className={s.header}>
        <h1 className={s.title}>CIVA - Inventory Catalog</h1>
        {user &&
          <button className={s.logout} onClick={() => logout.execute()}>Logout</button>
        }
      </header>
      {user &&
        <nav className={s.nav}>
          <ul>
            <li><Link to='/catalogs'>Home</Link></li>
            <li><Link to='/mapper'>Mapper Tool</Link></li>
          </ul>
          <ul>
            {user.displayName && `Welcome, ${user.displayName}`}
          </ul>
        </nav>
      }
    </>
  )
};

