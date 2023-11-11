import { useEffect } from "react"
import { useSearchParamsListToggle } from "../../hooks/searchParams"
import { useCatalogSearchParamQuery, useSearchCatalog } from "../../store"
import Search from "../Search"
import SearchResults from "../SearchResults"
import s from './unMatchedSearch.module.css'
import { useOfficeIds } from "../../store/selectors/offices"

type UnmatchedSearchProps = {
  officeIds: OfficeId[]
  initialSearchString: string
  selector: Selector<ItemKey>
}
export default function UnmatchedSearch({ officeIds, initialSearchString, selector }: UnmatchedSearchProps) {
  const allOfficeIds = useOfficeIds(['CIVA'])
  const query = useCatalogSearchParamQuery({
    officeIds: officeIds,
    searchText: initialSearchString,
    excludeLinked: true,
    excludeInactive: true,
  })
  const search = useSearchCatalog(query)
  const officeIdsParam = useSearchParamsListToggle('o')

  useEffect(() => { selector?.unSelectAll() }, [query])
  useEffect(() => { officeIdsParam.addAll(officeIds) }, [officeIds])


  return (
    <div>
      <div className={s.officeSelectContainer}>
        {allOfficeIds.map((officeId) =>
          <div key={officeId} className={s.officeSelect}>
            <input type='checkbox'
              onChange={() => officeIdsParam.toggle(officeId)}
              checked={officeIdsParam.isSelected(officeId)}
            />
            <span className={s.officeId}>{officeId}</span>
          </div>
        )}
      </div>
      <Search />
      <SearchResults search={search} selector={selector} />
    </div>
  )
}