import s from './alertMessage.module.css'

export function AlertMessage({ message }: { message: string | null | undefined }) {
  if (!message) return null

  return (
    <article className={s.container}>
      <p className={s.message} role="alert">
        {message}
      </p>
    </article>
  )
}