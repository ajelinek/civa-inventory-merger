import { useRouteError } from "react-router-dom"
import s from './errorpage.module.css'

export default function ErrorPage() {
  const error: any = useRouteError()
  console.error(error)

  return (
    <div className={`${s.container} container-fluid`}>
      <div>
        <h1>Oops!</h1>
        <p>Sorry, an unexpected error has occurred.</p>
        <p>
          <i>{error?.statusText || error?.message}</i>
        </p>
      </div>
    </div>
  )
}