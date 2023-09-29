import { nanoid } from 'nanoid'
import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AlertMessage } from '../../components/AlertMessage'
import { ClassificationSelector, SubClassificationSelector } from '../../components/CommonInputFields/selectors'
import LinkedItemsList from '../../components/LinkedItemsList'
import { useSearchParam } from '../../hooks/searchParams'
import useListSelector from '../../hooks/useListSelector'
import { useCatalogItem, useCreateLinkedItem, useLinkItems, useSearchCatalog, useStore } from '../../store'
import { officesForSelectInput } from '../../store/selectors/offices'
import s from './linker.module.css'
export default function LinkerPage() {
  const offices = useStore(state => state.org?.offices)!
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
          itemGroup.page?.map((item) =>
            <ItemGroup key={item.recordId} itemGroup={itemGroup} itemKey={item} />)}
      </section>
    </div>
  )
}

type ItemGroupProps = { itemKey: ItemKey, itemGroup: UseSearchCatalogReturn }
function ItemGroup({ itemKey, itemGroup }: ItemGroupProps) {
  const matchedItemKeys = useMemo(() => itemGroup?.matchedItemKeys?.[itemKey.recordId] || [], [itemGroup, itemKey])
  const selector = useListSelector<ItemKey>([], 'recordId')
  const item = useCatalogItem(itemKey)
  const nav = useNavigate()
  const createItem = useCreateLinkedItem()

  async function handelCreateItem() {
    const recordId = nanoid(8)
    await createItem.execute({
      recordId,
      officeId: 'CIVA',
      itemDescription: item?.itemDescription || '',
      status: 'active',
      itemId: item?.itemId || '',
      itemType: item?.itemType || 'I',
      markUpPercentage: item?.markUpPercentage || null,
      minimumPrice: item?.minimumPrice || null,
      unitOfMeasure: item?.unitOfMeasure || '',
      unitPrice: item?.unitPrice || null,
      linkedItems: selector?.getSelected() || []
    })

    nav(`/item/${recordId}/CIVA`)
  }

  return (
    <div key={itemKey.recordId} className={s.group}>
      <div className={s.matchedToItem}>
        <p className={s.matchedToItemTitle}>{item?.officeId} - {item?.itemDescription}</p>
        <AlertMessage message={createItem.error?.message} />
        <button className={s.linkButton} aria-busy={createItem.loading} onClick={() => handelCreateItem()}>Create Item</button>
      </div>
      <LinkedItemsList itemKeys={matchedItemKeys} selector={selector} />
    </div>
  )

}

