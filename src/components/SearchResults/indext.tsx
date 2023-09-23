import ItemSummary from "../ItemSummary"
import s from './searchResults.module.css'

type props = {
  search: UseSearchCatalogReturn
  selector: Selector<ItemRecord>
}

export default function SearchResults({ search, selector }: props) {
  return (
    <div className={s.container}>
      {(search?.result?.matchedRecords || 0 > 0) && <p>Showing {search?.result?.matchedRecords} results</p>}
      {search?.status === 'searching' && <div className={s.loading} aria-busy={true}>Searching...</div>}
      {(search?.status === 'searched' && search?.result?.matchedRecords === 0) && <p>No Results Found</p>}
      {(search?.page) &&
        search?.page.map(r =>
          <ItemSummary key={r.officeId + r.itemId} item={r} selector={selector} />
        )}
    </div>
  )

}