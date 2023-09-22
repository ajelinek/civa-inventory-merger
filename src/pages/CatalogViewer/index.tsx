import dayjs from 'dayjs'
import CatalogActionBar from '../../components/CatalogActionBar'
import ImportModel from '../../components/ImportModal'
import { useCatalogSearchParamQuery, useStore } from '../../store'
import s from './catalogViewer.module.css'
import FacetedSearch from '../../components/CatalogFacetSearch'
import Search from '../../components/Search'

export default function CatalogViewer() {
  const lastUpdateTime = useStore(state => state.catalogLastUpdateTimestamp)
  const quey = useCatalogSearchParamQuery()
  console.log("🚀 ~ file: index.tsx:12 ~ CatalogViewer ~ quey:", quey)

  return (
    <div className={s.container}>
      <ImportModel />
      <section className={s.facets}>
        <FacetedSearch />
      </section>
      <section className={s.catalog}>
        <CatalogActionBar />
        {/* <Search /> */}
        <p>{lastUpdateTime ? dayjs(lastUpdateTime).format() : ''}</p>
      </section>
    </div>
  )
}