import { useMemo, useState } from 'react'
import { AlertMessage } from '../../components/AlertMessage'
import ItemSummary from '../../components/ItemSummary'
import useListSelector from '../../hooks/useListSelector'
import { useCatalogItem, useLinkItems, useSearchCatalog, useStore } from '../../store'
import { officesForSelectInput } from '../../store/selectors/offices'
import s from './linker.module.css'
import { ClassificationSelector, SubClassificationSelector } from '../../components/CommonInputFields/selectors'
import { useSearchParam } from '../../hooks/searchParams'
export default function LinkerPage() {
  const offices = useStore(state => state.org?.offices)!
  const selector = useListSelector<ItemRecord>([], 'recordId')
  const officeArray = officesForSelectInput(offices)
  const classification = useSearchParam('mc')
  const subClassification = useSearchParam('msc')
  const comparisonCount = useSearchParam('cc')
  const [query, setQuery] = useState<CatalogQuery>()
  const linkItems = useLinkItems()
  const itemGroup = useSearchCatalog(query)

  function handleStartComparison(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setQuery({
      searchType: 'comparison',
      classificationIds: classification.value ? [classification.value] : undefined,
      subClassificationIds: subClassification.value ? [subClassification.value] : undefined,
      excludeLinked: true,
      comparisonCount: Number(comparisonCount.value) || 10,
      officeIds: officeArray.map(office => office.value).filter(o => o !== 'CIVA'),
    })
  }


  return (
    <div className={s.container}>
      <h1>Linker Page</h1>
      <AlertMessage message={linkItems.error?.message} />

      <form className={s.form} onSubmit={handleStartComparison}>

        <ClassificationSelector value={classification.value || ''} onChange={e => classification.setValue(e.target.value)} />
        <SubClassificationSelector
          classification={classification.value || ''}
          value={subClassification.value || ''}
          onChange={e => subClassification.setValue(e.target.value)} />

        <fieldset className={s.compareCount}>
          <label htmlFor="compareCount">Compare Count</label>
          <select id="compareCount" name="compareCount" value={comparisonCount.value || '10'} onChange={e => comparisonCount.setValue(e.target.value)}>
            <option value={5}>{5}</option>
            <option value={10}>{10}</option>
            <option value={15}>{15}</option>
            <option value={20}>{20}</option>
            <option value={25}>{25}</option>
            <option value={30}>{30}</option>
            <option value={35}>{35}</option>
            <option value={40}>{40}</option>
            <option value={45}>{45}</option>
            <option value={50}>{50}</option>
          </select>
        </fieldset>
        <button className={s.submitButton} type="submit" aria-busy={linkItems.loading}>Start Comparison</button>
      </form>

      <section className={s.groups}>
        {itemGroup.comparingText}
        {(itemGroup.status !== 'searched' && query) && <div>Loading...</div>}
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
      <p className={s.title}>{item?.officeId} - {item?.itemDescription}</p>
    </div>
  )
}

