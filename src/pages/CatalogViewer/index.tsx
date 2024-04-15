import { useEffect, useState } from 'react'
import CatalogActionBar from '../../components/CatalogActionBar'
import FacetedSearch from '../../components/CatalogFacetSearch'
import ImportModel from '../../components/ImportModal'
import Search from '../../components/Search'
import SearchResults from '../../components/SearchResults'
import useListSelector from '../../hooks/useListSelector'
import { useCatalogSearchParamQuery, useLinkItems, useSearchCatalog } from '../../store'
import s from './catalogViewer.module.css'
import { AlertMessage } from '../../components/AlertMessage'

export default function CatalogViewer() {
  const query = useCatalogSearchParamQuery()
  const search = useSearchCatalog(query)
  const selector = useListSelector<ItemKey>([], 'recordId')
  const linkItems = useLinkItems()
  const [message, setMessage] = useState<string | null>('')

  useEffect(() => {
    selector.unSelectAll()
  }, [query])

  function handleLink() {
    const selected = selector.getSelected()
    const officeIds = selected.map(item => item.officeId)
    const uniqueOfficeIds = new Set(officeIds)
    if (officeIds.length !== uniqueOfficeIds.size) {
      setMessage('Can not select multiple items from the same office')
      return
    }

    const linkedToItem = selected.find(item => item.officeId === 'CIVA')
    if (!linkedToItem) {
      setMessage('Must select an item from CIVA')
      return
    }
    linkItems.execute(linkedToItem!, selected.filter(item => item.officeId !== 'CIVA')).then(() => {
      selector.unSelectAll()
    })
  }

  return (
    <div className={s.container}>
      <ImportModel />
      <section className={s.facets}>
        <FacetedSearch />
      </section>
      <section className={s.catalog}>
        <CatalogActionBar />
        <Search />
        <div className={s.errorMessageContainer}>
          <AlertMessage message={message} cb={() => setMessage('')} />
        </div>
        <SearchResults search={search} selector={selector} />
        {selector.count > 0 && <button aria-busy={linkItems.loading} className={s.linkSubmit} onClick={handleLink}>Link</button>}
      </section>
    </div>
  )
}