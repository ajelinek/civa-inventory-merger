import { useMemo } from "react"
import { useParams } from "react-router-dom"
import { removeStopwords } from "stopword"
import ItemForm from "../../components/ItemForm"
import LinkedItemsList from "../../components/LinkedItemsList"
import UnmatchedSearch from "../../components/UnMatchedSearch"
import useListSelector from "../../hooks/useListSelector"
import { useCatalogItem, useLinkItems, useUnLinkItems } from "../../store"
import { useMatchedOfficeIds, useOfficeIds } from "../../store/selectors/offices"
import s from './item.module.css'

export default function ItemPage() {
  const recordId = useParams<{ recordId: string }>().recordId
  const officeId = useParams<{ officeId: string }>().officeId as OfficeId
  const linkedSelector = useListSelector<ItemKey>([], 'recordId')
  const unLinkedSelector = useListSelector<ItemKey>([], 'recordId')
  const itemKey: ItemKey | undefined = (recordId && officeId) ? { recordId, officeId } : undefined
  const item = useCatalogItem(itemKey)
  const unLinkItems = useUnLinkItems()
  const linkItems = useLinkItems()
  const officeIds = useOfficeIds(['CIVA'])
  const unMatchedOfficeIds = useMatchedOfficeIds(item?.linkedItems || [], officeIds)

  const initialSearchString = useMemo(() => {
    const tokens = new Set<string>()
    item?.itemDescription.split(' ').filter(token => token.length > 2).forEach(token => tokens.add(token.toLocaleLowerCase()))
    return removeStopwords([...tokens]).join(' ')
  }, [item?.itemDescription])

  return (
    <div className={s.container}>
      <section className={s.contentForm}>
        <h2>{itemKey ? 'Item Info' : 'New Item Info'}
          <span className={s.recordId}>{item?.recordId}</span></h2>
        <ItemForm itemKey={itemKey} />
      </section>
      <section className={s.linkedItems}>
        <h3>Linked Items</h3>
        {itemKey && <button className={s.unLinkSubmit}
          onClick={() => {
            unLinkItems.execute(itemKey, unLinkedSelector.getSelected())
            unLinkedSelector.unSelectAll()
          }}
          aria-busy={unLinkItems.loading}>
          UnLink Items {unLinkedSelector.getSelected().length > 0 && `(${unLinkedSelector.getSelected().length})`}
        </button>}

        {(item?.linkedItems?.length || 0 > 0) &&
          <LinkedItemsList selector={unLinkedSelector} itemKeys={item?.linkedItems!} />}

        <div className={s.unMatchedSearch}>
          <h3>Unlinked Items</h3>
          <UnmatchedSearch
            initialSearchString={initialSearchString}
            officeIds={unMatchedOfficeIds}
            selector={linkedSelector} />
          {itemKey && <button className={s.linkSubmit}
            onClick={() => {
              linkItems.execute(itemKey, linkedSelector.getSelected())
              linkedSelector.unSelectAll()
            }}
            aria-busy={linkItems.loading}>
            Link Items
            {linkedSelector.getSelected().length > 0 && `(${linkedSelector.getSelected().length})`}
          </button>}
        </div>
      </section>
    </div>
  )
}