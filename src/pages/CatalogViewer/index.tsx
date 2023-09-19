import dayjs from 'dayjs'
import { Outlet } from 'react-router-dom'
import CatalogActionBar from '../../components/CatalogActionBar'
import ImportModel from '../../components/ImportModal'
import { useStore } from '../../store'
import s from './catalogViewer.module.css'

export default function CatalogViewer() {
  const lastUpdateTime = useStore(state => state.catalogLastUpdateTimestamp)

  return (
    <div className={s.container}>
      <ImportModel />
      <section className={s.facets}>
        <h3>Facets</h3>
      </section>
      <section className={s.catalog}>
        <CatalogActionBar />
        <Outlet />
        <p>{lastUpdateTime ? dayjs(lastUpdateTime).format() : ''}</p>
      </section>
    </div>
  )
}