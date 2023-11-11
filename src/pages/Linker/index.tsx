import { nanoid } from 'nanoid'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { AlertMessage } from '../../components/AlertMessage'
import { ClassificationSelector, SubClassificationSelector } from '../../components/CommonInputFields/selectors'
import LinkedItemsList from '../../components/LinkedItemsList'
import { OfficeIdsDisplay } from '../../components/OfficeIdDisplay'
import { useSearchParam } from '../../hooks/searchParams'
import useListSelector from '../../hooks/useListSelector'
import { useCatalogItem, useCatalogSearchCallback, useInactivateItems, useLinkItems, useStore } from '../../store'
import { officesForSelectInput, useMatchedOfficeIds, useOfficeIds } from '../../store/selectors/offices'
import s from './linker.module.css'

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
      excludeInactive: true,
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
        <button className={s.submitButton} type="submit" disabled={search.loading} aria-busy={search.loading}>Start Comparison</button>
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
  const linkItems = useLinkItems()
  const inactivate = useInactivateItems()
  const [inactive, setInactive] = useState(false)
  const itemToDisplay: ItemKey = itemKey
  const item = useCatalogItem(itemToDisplay)
  const itemTitle = `${item?.officeId}-${item?.itemId} ${item?.itemDescription}`

  async function handelInactivateItem() {
    const itemKeys = selector?.getSelected() || []
    itemKeys.push(itemKey)
    await inactivate.execute(itemKeys)
    setInactive(true)
    selector.unSelectAll()
  }

  async function handelCreateItem() {
    linkItems.execute(itemKey, selector.getSelected())
    selector.unSelectAll()
  }

  const officeIds = useOfficeIds(['CIVA'])
  const unMatchedOfficeIds = useMatchedOfficeIds(matchedItemKeys, officeIds)

  return (
    <div key={itemKey.recordId} className={s.group}>
      <div className={s.matchedToItem}>
        <Link to={`/item/${itemKey.recordId}/CIVA`}>
          <p className={`${s.matchedToItemTitle} ${inactive ? s.inactiveTitle : ''}`}>{itemTitle}</p>
        </Link>
        <AlertMessage message={linkItems.error?.message} />
      </div>
      <LinkedItemsList itemKeys={matchedItemKeys} selector={selector} />
      <OfficeIdsDisplay label="Unmatched Offices:" officeIds={unMatchedOfficeIds} />
      <div className={s.actionButtons}>
        <button className={s.linkButton} aria-busy={linkItems.loading} onClick={() => handelCreateItem()}>
          Link {selector.getSelected().length ? `(${selector.getSelected().length})` : ''} to CIVA
        </button>
        <button className={s.inactivateButton} aria-busy={inactivate.loading} onClick={() => handelInactivateItem()}>
          Inactivate CIVA & {selector.getSelected().length ? `(${selector.getSelected().length})` : ''} selected
        </button>
      </div>
    </div>
  )
}

