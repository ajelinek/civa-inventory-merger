import { useParams } from "react-router-dom"
import s from './item.module.css'
import ItemForm from "../../components/ItemForm"
import { useCatalogItem } from "../../store"
import LinkedItemsList from "../../components/LinkedItemsList"
import useListSelector from "../../hooks/useListSelector"

export default function ItemPage() {
  const recordId = useParams<{ recordId: string }>().recordId
  const officeId = useParams<{ officeId: string }>().officeId as OfficeId
  const selector = useListSelector<ItemKey>()
  const itemKey: ItemKey | undefined = (recordId && officeId) ? { recordId, officeId } : undefined
  const item = useCatalogItem(itemKey)
  console.log("🚀 ~ file: index.tsx:12 ~ ItemPage ~ item:", item)

  return (
    <div className={s.container}>
      <section className={s.contentForm}>
        <h2>{itemKey ? 'Item Info' : 'New Item Info'}</h2>
        <ItemForm itemKey={itemKey} />
      </section>
      <section className={s.linkedItems}>
        <h3>Linked Items</h3>
        {(item?.linkedItems?.length || 0 > 0) && <LinkedItemsList selector={selector} itemKeys={item?.linkedItems!} />}
      </section>
    </div>
  )
}