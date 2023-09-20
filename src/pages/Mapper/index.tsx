import { useState } from 'react'
import { AlertMessage } from '../../components/AlertMessage'
import { ClassificationSelector, SubClassificationSelector } from '../../components/CommonInputFields/selectors'
import ItemSummary from '../../components/ItemSummary'
import Search from '../../components/Search'
import useListSelector from '../../hooks/useListSelector'
import { useSearchCatalog, useStore } from '../../store'
import { updateClassifications } from '../../store/db/item'
import s from './mapper.module.css'

export default function Mapper() {
  const [classificationId, setClassification] = useState<string>('')
  const [subClassificationId, setSubClassification] = useState<string>('')
  const mapFromSelector = useListSelector<ItemRecord>([], 'recordId')
  const mappedSelector = useListSelector<ItemRecord>([], 'recordId')
  const classifications = useStore(state => state.org?.classifications)
  const classificationUpdates = updateClassifications()
  const [query, setQuery] = useState<CatalogQuery>()
  const search = useSearchCatalog(query)
  const mappedResult = useSearchCatalog(null)

  // const automaticSearchStrings = useMemo(() => {
  //   const tokens = mappedResult.result?.map(r => r.itemDescription)
  //   const { classificationName, subClassificationName } = getClassificationNames(classificationId, subClassificationId)
  //   if (classificationName) tokens.push(classificationName)
  //   if (subClassificationName) tokens.push(subClassificationName)
  //   return tokens
  // }, [mappedResult, classificationId, subClassificationId])


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
            <ClassificationSelector value={classificationId} onChange={e => setClassification(e.target.value)} />
            <SubClassificationSelector value={subClassificationId} onChange={e => setSubClassification(e.target.value)} classification={classificationId} />
          </div>
          <h3>Mapped</h3>
          {mappedResult.loading ? <div aria-busy={true}></div>
            : mappedResult.result?.items.map((r: ItemRecord) => <ItemSummary key={r.itemId} item={r} selector={mappedSelector} />)
          }
        </div>
        <div className={s.column}>
          <div className={s.searchMapping} >
            <h3>Suggested Mappings</h3>
            <Search
              autoTokens={mappedResult.result?.keyWords || []}
              onSearch={(r) => {
                setQuery(r)
              }}
            />
            <button
              aria-busy={classificationUpdates.loading}
              onClick={handleUpdateClassifications} >
              Map Selected (<span>{mapFromSelector.count}</span>)
            </button>
          </div>

          {search?.loading
            ? <div aria-busy={true}></div>
            : search?.result?.items.map(r =>
              <ItemSummary key={r.officeId + r.itemId} item={r} selector={mapFromSelector} />
            )}
        </div>
      </section>
    </div>
  )
}