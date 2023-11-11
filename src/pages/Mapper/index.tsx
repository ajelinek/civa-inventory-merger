import { useEffect, useMemo, useState } from 'react'
import { AlertMessage } from '../../components/AlertMessage'
import { ClassificationSelector, OfficeSelector, SubClassificationSelector } from '../../components/CommonInputFields/selectors'
import Search from '../../components/Search'
import SearchResults from '../../components/SearchResults'
import { useSearchParam } from '../../hooks/searchParams'
import useListSelector from '../../hooks/useListSelector'
import { useCatalogSearchParamQuery, useClassificationUpdate, useSearchCatalog, useStore } from '../../store'
import s from './mapper.module.css'
import { useSearchParams } from 'react-router-dom'
import { getItem } from '../../store/selectors/item'

export default function Mapper() {
  const [_, setParams] = useSearchParams()
  const catalogs = useStore(state => state.catalog)!
  const classification = useSearchParam('mc')
  const subClassification = useSearchParam('msc')
  const officeId = useSearchParam('o')
  const searchTerm = useSearchParam('st')
  const classificationId = classification.value || ''
  const subClassificationId = subClassification.value || ''

  const mapFromSelector = useListSelector<ItemKey>([], 'recordId')
  const mappedSelector = useListSelector<ItemKey>([], 'recordId')
  const classifications = useStore(state => state.org?.classifications)
  const classificationUpdates = useClassificationUpdate()
  const query = useCatalogSearchParamQuery({
    excludeMapped: true,
    excludeInactive: true,
    officeIds: ['CIVA']
  })
  const search = useSearchCatalog(query)
  const [formError, setFormError] = useState('')

  const mappedQuery = useMemo(() => {
    if (!(officeId.value && (classificationId || subClassificationId))) return null
    const mQuery = {
      classificationIds: undefined,
      subClassificationIds: undefined,
      officeIds: undefined
    } as CatalogQuery
    if (classificationId) mQuery.classificationIds = [classificationId]
    if (subClassificationId) mQuery.subClassificationIds = [subClassificationId]
    if (officeId.value) mQuery.officeIds = [officeId.value]
    return mQuery
  }, [subClassification.value, classification.value, officeId.value])

  useEffect(() => {
    const clasName = classifications?.[classificationId]?.name
    const subClassName = classifications?.[classificationId]?.subClassifications?.[subClassificationId]?.name
    const text = subClassName || clasName || ''
    if (text) searchTerm.setValue(text)
  }, [classification.value, subClassification.value])

  const mappedResult = useSearchCatalog(mappedQuery)

  async function handleUpdateClassifications() {
    const itemKeys: ItemKey[] = []
    mapFromSelector.getSelected().forEach(itemKey => {
      itemKeys.push(itemKey)
      getItem(itemKey, catalogs)?.linkedItems?.forEach(linkedItem => {
        itemKeys.push(linkedItem)
      })
    })

    await classificationUpdates.execute({
      classificationId,
      subClassificationId,
      classificationName: classifications?.[classificationId]?.name || '',
      subClassificationName: classifications?.[classificationId]?.subClassifications?.[subClassificationId]?.name,
      items: itemKeys
    })
    mapFromSelector.unSelectAll()
    setFormError('')
  }


  return (
    <div className={s.container}>
      <AlertMessage message={classificationUpdates.error?.message || formError} />
      <section className={s.mappings}>
        <div className={s.column}>
          <h3>Mappings</h3>
          <div className={s.classifications}>
            <OfficeSelector value={'CIVA'} onChange={e => officeId.setValue(e.target.value)} disabled={true} />
            <ClassificationSelector value={classificationId} onChange={e => {
              setParams(prev => {
                prev.set('mc', e.target.value)
                prev.delete('msc')
                return prev
              })
            }} />
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
            <Search keyWords={mappedResult.result?.keyWords || []} />
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