import { useEffect, useMemo } from 'react'
import { useOfficeIds } from '../../store/selectors/offices'
import ItemSummary from '../ItemSummary'
import s from './linkedItemList.module.css'
import { RxDividerVertical } from 'react-icons/rx'
import Search from '../Search'
import SearchResults from '../SearchResults'
import useListSelector from '../../hooks/useListSelector'
import { useCatalogSearchParamQuery, useSearchCatalog } from '../../store'
import { useSearchParamsListToggle } from '../../hooks/searchParams'
type props = {
  itemKeys: ItemKey[]
  selector: Selector<ItemKey>
}

export default function LinkedItemsList({ selector, itemKeys }: props) {
  const officeIds = useOfficeIds().filter(officeId => officeId !== 'CIVA')
  const unMatchedOfficeIds = useMemo(() =>
    officeIds.filter(officeId => !itemKeys.find(itemKey => itemKey.officeId === officeId))
    , [officeIds, itemKeys]
  )

  return (<div className={s.matched}>
    <input type="checkbox"
      id='selectAll'
      checked={selector.isAllSelected(itemKeys)}
      onChange={() => selector.onSelectAll(itemKeys)} />
    <label className={s.selectAll} htmlFor='selectAll'>Select All</label>

    {itemKeys.map((itemKey) => <div key={itemKey.recordId}>
      {itemKey.recordId && <ItemSummary itemKey={itemKey} selector={selector} />}
    </div>
    )}

    {unMatchedOfficeIds.length > 0 &&
      <div className={s.unmatched}>
        <label className={s.notFoundOfficeLabel}>Unmatched Offices: </label>
        {unMatchedOfficeIds.map((officeId, index) =>
          <>
            <span className={s.officeId}>{officeId}</span>
            {index < unMatchedOfficeIds.length - 1 && <RxDividerVertical className={s.divider} />}
          </>
        )}
        <UnmatchedSearch officeIds={unMatchedOfficeIds} />
      </div>
    }

  </div>)
}

function UnmatchedSearch({ officeIds }: { officeIds: OfficeId[] }) {
  const query = useCatalogSearchParamQuery()
  const search = useSearchCatalog(query)
  const selector = useListSelector<ItemKey>([], 'recordId')
  const officeIdsParam = useSearchParamsListToggle('o')

  // useEffect(() => {
  //   officeIdsParam.addAll(officeIds)
  // }, [officeIds])

  useEffect(() => {
    selector.unSelectAll()
  }, [query])
  return (
    <div>
      <Search />
      <SearchResults search={search} selector={selector} />
    </div>
  )
}