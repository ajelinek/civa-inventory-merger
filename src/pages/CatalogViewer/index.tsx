import { useMemo } from 'react'
import CatalogActionBar from '../../components/CatalogActionBar'
import FacetedSearch from '../../components/CatalogFacetSearch'
import CreateCatalogItem from '../../components/CreateCatalogItem'
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

  const selectedItem = useMemo(() => {
    if (selector.count === 1) {
      const theOne = selector.getSelected()[0]
      return theOne
    }
  }, [selector.selected])

  return (
    <div className={s.container}>
      <ImportModel />
      <CreateCatalogItem item={selectedItem} />
      <section className={s.facets}>
        <FacetedSearch />
      </section>
      <section className={s.catalog}>
        <CatalogActionBar selectedCount={selector.count} />
        <Search />
        <SearchResults search={search} selector={selector} />
      </section>
    </div>
  )
}