import { nanoid } from 'nanoid'
import { AlertMessage } from '../../components/AlertMessage'
import { ClassificationSelector, SubClassificationSelector } from '../../components/CommonInputFields/selectors'
import LinkedItemsList from '../../components/LinkedItemsList'
import { UnMatchedDisplay } from '../../components/UnMatchedDisplay'
import { useSearchParam } from '../../hooks/searchParams'
import useListSelector from '../../hooks/useListSelector'
import { useCatalogItem, useCatalogSearchCallback, useCreateLinkedItem, useLinkItems, useStore } from '../../store'
import { officesForSelectInput, useMatchedOfficeIds, useOfficeIds } from '../../store/selectors/offices'
import s from './linker.module.css'
import { useState } from 'react'
import { Link } from 'react-router-dom'
export default function LinkerPage() {
  const offices = useStore(state => state.org?.offices)!
  const officeArray = officesForSelectInput(offices)
  const classification = useSearchParam('mc')
  const subClassification = useSearchParam('msc')
  const comparisonCount = useSearchParam('cc')
  const linkItems = useLinkItems()
  const { comparingText, search } = useCatalogSearchCallback()

  function handleStartComparison(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    search.execute({
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
        {comparingText}
        {search.loading && <div>Loading...</div>}
        {search.status === 'success' &&
          search.result?.itemKeys.map((item) =>
            <ItemGroup key={item.recordId}
              itemKey={item}
              matchedItemKeys={search.result?.matchedItemKeys?.[item.recordId]}
            />)}
      </section>
    </div>
  )
}

type ItemGroupProps = { itemKey: ItemKey, matchedItemKeys: ItemKey[] | undefined }
function ItemGroup({ itemKey, matchedItemKeys = [] }: ItemGroupProps) {
  const selector = useListSelector<ItemKey>(matchedItemKeys, 'recordId')
  const createItem = useCreateLinkedItem()
  const [recordId, setRecordId] = useState<RecordId>('')
  const itemToDisplay: ItemKey = recordId ? { recordId, officeId: 'CIVA' } : itemKey
  const item = useCatalogItem(itemToDisplay)
  const itemTitle = `${item?.officeId} - ${item?.itemDescription}`

  async function handelCreateItem() {
    const recordId = nanoid(8)
    setRecordId(recordId)
    await createItem.execute({
      recordId,
      officeId: 'CIVA',
      classificationId: item?.classificationId || '',
      subClassificationId: item?.subClassificationId || '',
      classificationName: item?.classificationName || '',
      subClassificationName: item?.subClassificationName || '',
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
  }

  const officeIds = useOfficeIds(['CIVA'])
  const unMatchedOfficeIds = useMatchedOfficeIds(matchedItemKeys, officeIds)

  return (
    <div key={itemKey.recordId} className={s.group}>
      <div className={s.matchedToItem}>
        {recordId
          ? <Link to={`/item/${recordId}/CIVA`}><p className={s.matchedToItemTitle}>{itemTitle}</p></Link>
          : <p className={s.matchedToItemTitle}>{itemTitle}</p>
        }
        <AlertMessage message={createItem.error?.message} />
      </div>
      <LinkedItemsList itemKeys={matchedItemKeys} selector={selector} />
      <UnMatchedDisplay unMatchedOfficeIds={unMatchedOfficeIds} />
      {!recordId && <button className={s.linkButton} aria-busy={createItem.loading} disabled={!!recordId} onClick={() => handelCreateItem()}>
        Create CIVA Item & Link {selector.getSelected().length ? `(${selector.getSelected().length})` : ''}
      </button>}
    </div>
  )

}

