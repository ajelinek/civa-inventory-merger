
// This is where the magic happens. We will display the current item
// we want to create search component that will search for mathing items 
// for each office. 
import { useMemo } from "react"
import useListSelector from "../../hooks/useListSelector"
import { useCatalogItem, useSearchCatalog, useStore } from "../../store"
import ItemSummary from "../ItemSummary"
import s from './itemGroup.module.css'
import { officesForSelectInput } from "../../store/selectors/offices"

export default function ItemGroup({ itemKey }: { itemKey: ItemKey }) {
  const selector = useListSelector<ItemRecord>([mainItem])

  return (
    <div className={s.container}>
      <span>main?</span><ItemSummary itemKey={itemKey} selector={selector} />
      {officeArray.map(office => {
        return (
          <MatchedOfficeItems key={office.value} officeId={office.value} searchText={mainItem.itemDescription} selector={selector} />
        )
      })}
    </div>
  )
}

type MatchedOfficeItemProps = {
  officeId: OfficeId
  searchText: string
  selector: Selector<ItemRecord>
}
function MatchedOfficeItems({ officeId, searchText, selector }: MatchedOfficeItemProps) {
  return (
    <div className={s.officeMatch}>
      <p>{officeId}</p>
      <ItemSummary itemKey={search?.page[0]} selector={selector} />
    </div>
  )
}