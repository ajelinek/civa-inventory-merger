import { useNavigate } from 'react-router-dom'
import { AlertMessage } from '../../components/AlertMessage'
import useFormManagement from '../../hooks/userFormManagement'
import s from './home.module.css'
import { FaCat, FaDog } from 'react-icons/fa6'
import { useLogin, useStore } from '../../store'
import { useEffect } from 'react'

export default function Home() {
  const nav = useNavigate()
  const user = useStore(state => state.user)
  const login = useLogin()
  const form = useFormManagement<Creds, unknown>({ email: '', password: '' }, (creds) => {
    login.execute(creds.email, creds.password)
  })

  useEffect(() => { if (user) nav('/catalogs?o=CIVA') }, [user])

  return (
    <div className={`${s.container}`}>
      <div className={s.hero}>
        <h2 className={s.title}>
          <FaCat className={s.iconLeft} />
          Welcome
          <FaDog className={s.iconRight} style={{ transform: 'scaleX(-1)' }} />
        </h2>
        <form onSubmit={form.onSubmit}>
          <AlertMessage message={login.error?.message} />

          <fieldset>
            <label htmlFor="email">Email</label>
            <input type="text" id="email" name="email" onChange={form.onChange} />
            <label htmlFor="password">Password</label>
            <input type="password" id="password" name="password" onChange={form.onChange} />
          </fieldset>
          <button type="submit" aria-busy={login.loading}>Login</button>
        </form>
      </div>
    </div>
  )

}