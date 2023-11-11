import ItemSummary from "../ItemSummary"
import SortOrder from "../SortOrder"
import s from './searchResults.module.css'

type props = {
  search: UseSearchCatalogReturn
  selector: Selector<ItemKey>
}

export default function SearchResults({ search, selector }: props) {
  return (
    <div className={`${s.container} SearchResults-container`}>
      <SortOrder className={s.sortButton} />
      {(search?.result?.matchedRecords || 0 > 0) && <p>Showing {search.page?.length} of {search?.result?.matchedRecords} results</p>}
      {search?.status === 'searching' && <div className={s.loading} aria-busy={true}>Searching...</div>}
      {(search?.status === 'searched' && search?.result?.matchedRecords === 0) && <p>No Results Found</p>}


      {(search?.page && search.page.length && search.page.length > 0)
        ? <div className={s.itemList}>
          <input type="checkbox"
            id='selectAll'
            checked={selector.isAllSelected(search?.page || [])}
            onChange={() => selector.onSelectAll(search?.page || [])} />
          <label className={s.selectAll} htmlFor='selectAll'>Select All</label>

          {search?.page.map(r =>
            <ItemSummary key={r.recordId} itemKey={r} selector={selector} />)}
        </div>
        : null
      }
    </div>
  )

}