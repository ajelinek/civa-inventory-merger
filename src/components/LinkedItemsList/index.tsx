import ItemSummary from '../ItemSummary'
import s from './linkedItemList.module.css'
type props = {
  itemKeys: ItemKey[]
  selector: Selector<ItemKey>
}

export default function LinkedItemsList({ selector, itemKeys }: props) {

  return (<div className={s.matched}>
    <input type="checkbox"
      id='selectAll'
      checked={selector.isAllSelected(itemKeys)}
      onChange={() => selector.onSelectAll(itemKeys)} />
    <label className={s.selectAll} htmlFor='selectAll'>Select All</label>

    {itemKeys.map((itemKey) => <div key={itemKey.recordId}>
      {!itemKey.recordId && <p className={s.notFoundMessage}><span className={s.officeId}>{itemKey.officeId}</span> - No match found</p>}
      {itemKey.recordId && <ItemSummary itemKey={itemKey} selector={selector} />}
    </div>
    )}
  </div>)
}