import { useMemo } from 'react'
import { AlertMessage } from '../../components/AlertMessage'
import { ClassificationSelector, SubClassificationSelector } from '../../components/CommonInputFields/selectors'
import ItemSummary from '../../components/ItemSummary'
import Search from '../../components/Search'
import { useSearchParam } from '../../hooks/searchParams'
import useListSelector from '../../hooks/useListSelector'
import { useCatalogSearchParamQuery, useClassificationUpdate, useSearchCatalog, useStore } from '../../store'
import s from './mapper.module.css'

export default function Mapper() {
  const classification = useSearchParam('c')
  const subClassification = useSearchParam('cs')
  const classificationId = classification.value || ''
  const subClassificationId = subClassification.value || ''

  const mapFromSelector = useListSelector<ItemRecord>([], 'recordId')
  const mappedSelector = useListSelector<ItemRecord>([], 'recordId')
  const classifications = useStore(state => state.org?.classifications)
  const classificationUpdates = useClassificationUpdate()
  const query = useCatalogSearchParamQuery()
  const search = useSearchCatalog(query)

  const mappedQuery = useMemo(() => {
    if (!classificationId || !subClassificationId) return
    return {
      classificationIds: [classificationId],
      subClassificationIds: [subClassificationId],
    }
  }, [classificationId, subClassificationId])
  const mappedResult = useSearchCatalog(mappedQuery)

  async function handleUpdateClassifications() {
    if (!classifications || !classificationId || !subClassificationId) return

    await classificationUpdates.execute({
      classificationId,
      subClassificationId,
      classificationName: classifications?.[classificationId].name,
      subClassificationName: classifications?.[classificationId]?.subClassifications?.[subClassificationId]?.name,
      items: mapFromSelector.getSelected()
    })
    mapFromSelector.unSelectAll()
  }


  return (
    <div className={s.container}>
      <AlertMessage message={classificationUpdates.error?.message} />
      {/* <MapperInstructions /> */}

      <section className={s.mappings}>
        <div className={s.column}>
          <h3>Mappings</h3>
          <div className={s.classifications}>
            <ClassificationSelector value={classificationId} onChange={e => classification.setValue(e.target.value)} />
            <SubClassificationSelector value={subClassificationId} onChange={e => subClassification.setValue(e.target.value)} classification={classificationId} />
          </div>
          <h3>Mapped</h3>
          {mappedResult.status === 'searching' && <div aria-busy={true}></div>}
          {mappedResult.status === 'searched' && mappedResult.result?.matchedRecords === 0 && <p>No Results Found</p>}
          {mappedResult.status === 'searched' && mappedResult.page &&
            mappedResult.page.map((r: ItemRecord) => <ItemSummary key={r.itemId} item={r} selector={mappedSelector} />)
          }
        </div>
        <div className={s.column}>
          <div className={s.searchMapping} >
            <h3>Suggested Mappings</h3>
            <Search keyWords={mappedResult.result?.keyWords || []} />
            <button
              aria-busy={classificationUpdates.loading}
              onClick={handleUpdateClassifications} >
              Map Selected (<span>{mapFromSelector.count}</span>)
            </button>
          </div>
          {search?.result?.matchedRecords}
          {search?.status === 'searching' && <div className={s.loading} aria-busy={true}>Searching...</div>}
          {(search?.status === 'searched' && search?.result?.matchedRecords === 0) && <p>No Results Found</p>}
          {(search?.page) &&
            search?.page.map(r =>
              <ItemSummary key={r.officeId + r.itemId} item={r} selector={mapFromSelector} />
            )}
        </div>
      </section>
    </div>
  )
}