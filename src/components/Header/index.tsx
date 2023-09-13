import { NavLink } from 'react-router-dom'
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
            <li><NavLink className={s.link} to='/catalogs'>Home</NavLink></li>
            <li><NavLink className={s.link} to='/mapper'>Mapper Tool</NavLink></li>
          </ul>
          <ul>
            <li>{user.displayName && `Welcome, ${user.displayName}`}</li>
          </ul>
        </nav>
      }
    </>
  )
};

