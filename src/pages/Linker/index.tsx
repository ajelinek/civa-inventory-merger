import { useMemo } from 'react'
import { AlertMessage } from '../../components/AlertMessage'
import ItemSummary from '../../components/ItemSummary'
import useListSelector from '../../hooks/useListSelector'
import { useCatalogItem, useLinkItems, useSearchCatalog, useStore } from '../../store'
import { officesForSelectInput } from '../../store/selectors/offices'
import s from './linker.module.css'
export default function LinkerPage() {
  const offices = useStore(state => state.org?.offices)!
  const selector = useListSelector<ItemRecord>([], 'recordId')
  const officeArray = officesForSelectInput(offices)
  // const classification = useSearchParam('mc') 
  // const subClassification = useSearchParam('msc')
  const linkItems = useLinkItems()
  const query = useMemo<CatalogQuery>(() => {
    return {
      searchType: 'comparison',
      excludeLinked: true,
      officeIds: officeArray.map(office => office.value).filter(o => o !== 'CIVA'),
    }
  }, [])

  const itemGroup = useSearchCatalog(query)
  console.log("🚀 ~ file: index.tsx:22 ~ LinkerPage ~ itemGroup:", itemGroup)

  return (
    <div className={s.container}>
      <h1>Linker Page</h1>
      <AlertMessage message={linkItems.error?.message} />

      {/* <div className={s.classifications}>
        <ClassificationSelector value={classification.value || ''} onChange={e => classification.setValue(e.target.value)} />
        <SubClassificationSelector
          classification={classification.value || ''}
          value={subClassification.value || ''}
          onChange={e => subClassification.setValue(e.target.value)} />
      </div> */}

      <section className={s.groups}>
        {itemGroup.status !== 'searched' && <div>Loading...</div>}
        {itemGroup.status === 'searched' && itemGroup.page?.length === 0 && <div>No items found</div>}
        {(itemGroup.status === 'searched' && itemGroup.page?.length || 0 > 0) &&
          itemGroup.page?.map((item) => {
            return (
              <div key={item.recordId} className={s.group}>
                <LinkItemTitle itemKey={item} />
                <div className={s.matched}>
                  {itemGroup?.matchedItemKeys?.[item.recordId].map((matchedItemKey) =>
                    <>
                      {!matchedItemKey.recordId && <p>{matchedItemKey.officeId} - No match found</p>}
                      {matchedItemKey.recordId}
                      {matchedItemKey.recordId && <ItemSummary itemKey={matchedItemKey} selector={selector} />}
                    </>
                  )}
                </div>
              </div>
            )
          })}
      </section>
    </div>
  )
}

function LinkItemTitle({ itemKey }: { itemKey: ItemKey }) {
  const item = useCatalogItem(itemKey)

  return (
    <div className={s.matchedToItem}>
      <p className={s.title}>{item?.itemDescription}</p>
    </div>
  )
}

