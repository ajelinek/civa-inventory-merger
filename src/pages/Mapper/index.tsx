import MiniSearch, { SearchResult } from 'minisearch'
import { useEffect, useMemo, useState } from 'react'
import { AlertMessage } from '../../components/AlertMessage'
import { ClassificationSelector, SubClassificationSelector } from '../../components/CommonInputFields/selectors'
import ItemSummary from '../../components/ItemSummary'
import useListSelector from '../../hooks/useListSelector'
import { useStore } from '../../store'
import { useAllCatalogsQuery } from '../../store/catalog'
import { updateClassifications } from '../../store/db/item'
import s from './mapper.module.css'
import Search from '../../components/Search'
import { getClassificationNames } from '../../store/selectors/classifications'

export default function Mapper() {
  const dataState = useAllCatalogsQuery()
  const [classificationId, setClassification] = useState<string>('')
  const [subClassificationId, setSubClassification] = useState<string>('')
  const [mappedResult, setMappedResult] = useState<ItemRecord[]>([])
  const [suggestedResult, setSuggestedResult] = useState<SearchResult[]>([])
  const mapFromSelector = useListSelector<ItemRecord>([], 'itemId')
  const mappedSelector = useListSelector<ItemRecord>([], 'itemId')
  const classifications = useStore(state => state.classifications)
  const catalog = useStore(state => state.catalog)
  const classificationUpdates = updateClassifications()

  useEffect(() => {
    if (!(dataState.loading === false && classificationId && subClassificationId)) return
    const results = Object.values(catalog).filter(c =>
      c.classificationId === classificationId && c.subClassificationId === subClassificationId
    )
    setMappedResult(results)
  }, [classificationId, subClassificationId, classificationUpdates.result, classificationUpdates.loading])

  const automaticSearchStrings = useMemo(() => {
    const tokens = mappedResult.map(r => r.itemDescription)
    const { classificationName, subClassificationName } = getClassificationNames(classificationId, subClassificationId)
    if (classificationName) tokens.push(classificationName)
    if (subClassificationName) tokens.push(subClassificationName)
    return tokens
  }, [mappedResult, classificationId, subClassificationId])


  if (dataState.loading) return <div>Loading...</div>

  async function handleUpdateClassifications() {
    await classificationUpdates.execute({
      classificationId,
      subClassificationId,
      classificationName: classifications[classificationId].name,
      subClassificationName: classifications[classificationId]?.subClassifications?.[subClassificationId]?.name,
      items: mapFromSelector.getSelected()
    })
    mapFromSelector.unSelectAll()
  }


  return (
    <div className={s.container}>
      <AlertMessage message={dataState.error} />
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
          {mappedResult.map(r => <ItemSummary key={r.itemId} itemId={r.itemId} selector={mappedSelector} />)}
        </div>
        <div className={s.column}>
          <div className={s.searchMapping}>
            <h3>Suggested Mappings</h3>
            <Search
              automaticSearchStrings={automaticSearchStrings}
              onSearch={(r) => {
                setSuggestedResult(r)
              }}
            />
            <button
              aria-busy={classificationUpdates.loading}
              onClick={handleUpdateClassifications} >
              Map Selected (<span>{mapFromSelector.count}</span>)
            </button>
          </div>
          {suggestedResult.map(r =>
            <>
              {/* {r.score} */}
              <ItemSummary key={r.id} itemId={r.id} selector={mapFromSelector} />
            </>)}
        </div>
      </section>
    </div>
  )
}