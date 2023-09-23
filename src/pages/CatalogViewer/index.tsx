import CatalogActionBar from '../../components/CatalogActionBar'
import FacetedSearch from '../../components/CatalogFacetSearch'
import ImportModel from '../../components/ImportModal'
import Search from '../../components/Search'
import SearchResults from '../../components/SearchResults'
import useListSelector from '../../hooks/useListSelector'
import { useCatalogSearchParamQuery, useSearchCatalog } from '../../store'
import s from './catalogViewer.module.css'

export default function CatalogViewer() {
  const query = useCatalogSearchParamQuery()
  const search = useSearchCatalog(query)
  const selector = useListSelector<ItemRecord>([], 'recordId')

  return (
    <div className={s.container}>
      <ImportModel />
      <section className={s.facets}>
        <FacetedSearch />
      </section>
      <section className={s.catalog}>
        <CatalogActionBar />
        <Search />
        <SearchResults search={search} selector={selector} />
      </section>
    </div>
  )
}