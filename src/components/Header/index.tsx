import { NavLink } from 'react-router-dom'
import { useLogout, useStore } from '../../store'
import s from './header.module.css'
import { useState } from 'react'
import { FaSun, FaMoon } from 'react-icons/fa6'

export default function Header() {
  const user = useStore(state => state.user)
  const logout = useLogout()
  const prefersDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
  const [isDarkMode, setIsDarkMode] = useState(prefersDarkMode)

  const toggleTheme = () => {
    const page = document.getElementById('page')
    if (page) {
      if (isDarkMode) {
        page.setAttribute('data-theme', 'light')
      } else {
        page.setAttribute('data-theme', 'dark')
      }
    }
    setIsDarkMode(!isDarkMode)
  }
  return (
    <>
      <header className={s.header}>
        <h1 className={s.title}>CIVA - Inventory Catalog</h1>
        <button className={`${s.themeToggle} ${isDarkMode && s.isDarkMode}`} onClick={toggleTheme}>
          {isDarkMode && <FaSun className={s.sunIcon} />}
          {!isDarkMode && <FaMoon className={s.moonIcon} />}
        </button>
        {user &&
          <button className={s.logout} onClick={() => logout.execute()}>Logout</button>
        }

      </header>
      {user &&
        <nav className={s.nav}>
          <ul>
            <li><NavLink className={s.link} to={`/catalogs?o=CIVA&exi=true`}>Home</NavLink></li>
            <li><NavLink className={s.link} to='/mapper'>Mapper Tool</NavLink></li>
            <li><NavLink className={s.link} to='/linker'>Linker Tool</NavLink></li>
          </ul>
          <ul>
            <li>{user.displayName && `Welcome, ${user.displayName}`}</li>
          </ul>
        </nav>
      }
    </>
  )
};


