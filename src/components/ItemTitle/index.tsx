import { Link } from 'react-router-dom'
import { useCatalogItem } from '../../store'
import { OfficeIdsDisplay } from '../OfficeIdDisplay'

export default function ItemTitle({ s, itemKey }: { s: CSSModuleClasses, itemKey: ItemKey }) {
  const item = useCatalogItem(itemKey)
  if (!item) return null

  return (
    <div className={s.summaryTitle} >
      <Link className={`${s.title} ${item.status === 'inactive' ? s.inactiveTitle : ''}`}
        to={`/item/${itemKey.recordId}/${itemKey.officeId}`}>
        <span className={s.id}>{item.officeId}-{item.itemId}</span> - {item.itemDescription}
      </Link>
      {item.officeId === 'CIVA' && <><OfficeIdList item={item} /></>}
    </div>
  )

}

function OfficeIdList({ item }: { item: ItemRecord }) {
  const officeIds = item.linkedItems?.map(linkedItem => linkedItem.officeId) || []
  return <OfficeIdsDisplay officeIds={officeIds} />
}