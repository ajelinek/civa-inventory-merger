import s from './alertMessage.module.css'

export function AlertMessage({ message, cb }: { message: string | null | undefined, cb?: () => void }) {
  if (!message) return null

  return (
    <article className={s.container} onClick={() => cb && cb()}>
      <p className={s.message} role="alert">
        {message}
      </p>
      {cb && <p className={s.close} >close</p>}
    </article>
  )
}