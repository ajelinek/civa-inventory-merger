import ItemSummary from '../ItemSummary'
import s from './linkedItemList.module.css'

type props = {
  itemKeys: ItemKey[]
  selector: Selector<ItemKey>
  compact?: boolean
}

export default function LinkedItemsList({ selector, itemKeys, compact }: props) {
  return (
    <div className={`${s.matched} ${compact && s.compact}`}>
      <input type="checkbox"
        id='selectAll'
        checked={selector.isAllSelected(itemKeys)}
        onChange={() => selector.onSelectAll(itemKeys)} />
      <label className={s.selectAll} htmlFor='selectAll'>Select All</label>

      {itemKeys?.map((itemKey) => <div key={itemKey.recordId}>
        {itemKey.recordId && <ItemSummary itemKey={itemKey} selector={selector} />}
      </div>
      )}
    </div>
  )
}