import s from './notFound.module.scss'

export default function PageNotFound() {
  return (
    <div className={s.page}>
      <p className={s.status}>404</p>
      <p className={s.message}>Oh No, the page was not found</p>
      <p className={s.close}>Please navigate to the <a href={window.location.origin}>home page</a> and try again.</p>
    </div>
  )
}
