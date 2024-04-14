import { Link } from 'react-router-dom'
import { useCatalogItem } from '../../store'
import { OfficeIdsDisplay } from '../OfficeIdDisplay'
import { sort } from 'fast-sort'
import ss from './style.module.css'

export default function ItemTitle({ s, itemKey }: { s: CSSModuleClasses, itemKey: ItemKey }) {
  const item = useCatalogItem(itemKey)
  if (!item) return null

  return (
    <div className={s.summaryTitle} >
      <Link className={`${s.title} ${item.status === 'inactive' ? s.inactiveTitle + ' ' + ss.inactiveItem : ''}`}
        to={`/item/${itemKey.recordId}/${itemKey.officeId}`}>
        <span className={s.id}>{item.itemId}: </span>  {item.itemDescription}
        <span className={s.office}>  ({item.officeId}) </span>
      </Link>
      {item.officeId === 'CIVA' && <><OfficeIdList item={item} /></>}
    </div>
  )

}

function OfficeIdList({ item }: { item: ItemRecord }) {
  const officeIds = item.linkedItems?.map(linkedItem => linkedItem.officeId) || []
  const display = sort(officeIds).asc()
  return <OfficeIdsDisplay officeIds={display} />
}