import CatalogActionBar from '../../components/CatalogActionBar'
import ImportModel from '../../components/ImportModal'
import s from './catalog.module.css'

export default function Catalog() {
  return (
    <div className={s.container}>
      <ImportModel />
      <section className={s.facets}>
        <h3>Facets</h3>
      </section>
      <section className={s.catalog}>
        <CatalogActionBar />
      </section>
    </div>
  )
}