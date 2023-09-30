import { AlertMessage } from "../../components/AlertMessage"
import { usePasswordReset } from "../../store"
import s from './passwordReset.module.css'

export default function passwordReset() {
  const passwordReset = usePasswordReset()
  function handleOnSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const email = e.currentTarget.email.value
    passwordReset.execute(email)
  }

  return (
    <div className={s.container}>
      <h1>Password Reset</h1>
      <AlertMessage message={passwordReset.error?.message} />
      <form className={s.form} onSubmit={handleOnSubmit}>
        <input type="email" name="email" placeholder="Email" />
        <button type="submit" aria-busy={passwordReset.loading}>Reset Password</button>
      </form>
    </div>
  )
}