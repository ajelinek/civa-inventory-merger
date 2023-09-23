import { useEffect, useMemo, useState } from 'react'
import { AlertMessage } from '../../components/AlertMessage'
import { ClassificationSelector, SubClassificationSelector } from '../../components/CommonInputFields/selectors'
import Search from '../../components/Search'
import SearchResults from '../../components/SearchResults'
import { useSearchParam } from '../../hooks/searchParams'
import useListSelector from '../../hooks/useListSelector'
import { useCatalogSearchParamQuery, useClassificationUpdate, useSearchCatalog, useStore } from '../../store'
import s from './mapper.module.css'

export default function Mapper() {
  const classification = useSearchParam('mc')
  const subClassification = useSearchParam('msc')
  const searchTerm = useSearchParam('st')
  const classificationId = classification.value || ''
  const subClassificationId = subClassification.value || ''

  const mapFromSelector = useListSelector<ItemRecord>([], 'recordId')
  const mappedSelector = useListSelector<ItemRecord>([], 'recordId')
  const classifications = useStore(state => state.org?.classifications)
  const classificationUpdates = useClassificationUpdate()
  const query = useCatalogSearchParamQuery()
  const search = useSearchCatalog(query)
  const [formError, setFormError] = useState('')

  const mappedQuery = useMemo(() => {
    if (!classificationId || !subClassificationId) return
    return {
      classificationIds: [classificationId],
      subClassificationIds: [subClassificationId],
    }
  }, [classificationId, subClassificationId])

  useEffect(() => {
    if (!subClassification.value) return
    const name = classifications?.[classificationId]?.subClassifications?.[subClassification.value].name
    name && searchTerm.setValue(name)
  }, [subClassification.value])
  const mappedResult = useSearchCatalog(mappedQuery)

  async function handleUpdateClassifications() {
    if (!classifications || !classificationId || !subClassificationId) {
      setFormError('Please select a classification and sub classification')
      return
    }

    await classificationUpdates.execute({
      classificationId,
      subClassificationId,
      classificationName: classifications?.[classificationId].name,
      subClassificationName: classifications?.[classificationId]?.subClassifications?.[subClassificationId]?.name,
      items: mapFromSelector.getSelected()
    })
    mapFromSelector.unSelectAll()
    setFormError('')
  }


  return (
    <div className={s.container}>
      <AlertMessage message={classificationUpdates.error?.message || formError} />
      {/* <MapperInstructions /> */}

      <section className={s.mappings}>
        <div className={s.column}>
          <h3>Mappings</h3>
          <div className={s.classifications}>
            <ClassificationSelector value={classificationId} onChange={e => classification.setValue(e.target.value)} />
            <SubClassificationSelector
              classification={classificationId}
              value={subClassificationId}
              onChange={e => subClassification.setValue(e.target.value)} />
          </div>
          <h3>Mapped</h3>
          <SearchResults search={mappedResult} selector={mappedSelector} />
        </div>
        <div className={s.column}>
          <div className={s.searchMapping} >
            <h3>Suggested Mappings</h3>
            <Search
              keyWords={mappedResult.result?.keyWords || []}
              excludeLinkedDefault={true}
              excludeMappedDefault={true}
            />
            <button
              className={s.mapButton}
              aria-busy={classificationUpdates.loading}
              onClick={handleUpdateClassifications} >
              Map Selected (<span>{mapFromSelector.count}</span>)
            </button>
          </div>
          <SearchResults search={search} selector={mapFromSelector} />
        </div>
      </section>
    </div>
  )
}