import { sort } from 'fast-sort'
import Fuse from 'fuse.js'
import { removeStopwords } from 'stopword'
import { calculateLinkItemTotals } from '../selectors/item'

let searcher: Fuse<SearchItem> | null = null
let catalogs: Catalogs | null = null
let offices: Offices | null = null

onmessage = (event: MessageEvent<SearcherMessage>) => {
  switch (event.data.type) {
    case 'load':
      load(event.data.payload)
      break
    case 'search':
      search(event.data.payload)
      break
  }
}

interface loadProps {
  catalogs: Catalogs
  offices: Offices
}
function load(payload: loadProps) {
  catalogs = payload.catalogs
  offices = payload.offices
  searcher = new Fuse<SearchItem>(mergeCatalogs(payload.catalogs), {
    keys: ['searchString', 'classificationId', 'subClassificationId', 'officeId', 'itemId', 'classificationMappedTimestamp', 'itemLinkedTimestamp', 'recordId'],
    threshold: 0.5,
    ignoreLocation: true,
    minMatchCharLength: 2,
    shouldSort: true,
    includeScore: true,
    includeMatches: true,
    useExtendedSearch: true,
  })

  postMessage({ type: 'loaded' })
}

type SearchItem = Pick<ItemRecord,
  'classificationId' |
  'subClassificationId' |
  'officeId' |
  'itemId' |
  'recordId' |
  'originalItemId'
> & {
  searchString: string
}

function mergeCatalogs(inCatalogs: Catalogs) {
  const merged = Object.values(inCatalogs).reduce((acc, catalog: Catalog) => {
    acc = [
      ...acc,
      ...Object.values(catalog).map((item: ItemRecord) => ({
        searchString: `${item.classificationName} ${item.subClassificationName} ${item.itemDescription} ${item.definition} ${item.originalItemId}`,
        classificationId: item.classificationId,
        subClassificationId: item.subClassificationId,
        officeId: item.officeId,
        itemId: item.itemId,
        originalItemId: item.originalItemId,
        recordId: item.recordId,
        classificationMappedTimestamp: item.classificationMappedTimestamp,
        itemLinkedTimestamp: item.itemLinkedTimestamp
      }))]
    return acc
  }, [] as SearchItem[])
  return merged
}

function search(query: CatalogQuery) {
  if (!searcher) throw new Error('Searcher not initialized')

  if (!query) {
    postMessage({ type: 'searched', payload: [] })
    return
  }
  const payload = query.searchType === 'comparison' ? comparisonSearch(query, searcher) : generalSearch(query, searcher)
  postMessage({ type: 'searched', payload })
}

function comparisonSearch(query: CatalogQuery, searcher: Fuse<SearchItem>) {
  if (!offices) throw new Error('Offices not loaded')
  const { itemKeys } = basicSearch(query, searcher, query.comparisonCount)

  const officeIds = Object.keys(offices).filter(officeId => officeId !== 'CIVA') as OfficeId[]
  const matchedItemKeys = itemKeys.reduce((acc, itemKey, index) => {
    const searchText = catalogs?.[itemKey.officeId]?.[itemKey.recordId]?.itemDescription
    postMessage({ type: 'compare-status', payload: { text: `(${index + 1} of ${query.comparisonCount}) - Searching For ${searchText}  ` } })
    const officeMatches = officeIds.map(officeId => {
      const query = { officeIds: [officeId], searchText, excludeLinked: true }
      const officeResult = basicSearch(query, searcher, 1)

      return {
        recordId: officeResult?.itemKeys?.[0]?.recordId,
        officeId: officeId
      }
    }).filter(item => item.recordId) as ItemKey[]
    return { ...acc, [itemKey.recordId]: officeMatches }
  }, {} as MatchedItemKeys)

  return { itemKeys, matchedItemKeys }
}

function generalSearch(query: CatalogQuery, searcher: Fuse<SearchItem>) {
  const { itemKeys, results, matchedRecords } = basicSearch(query, searcher)
  const matchedCatalogs = new Set(itemKeys.map(item => item.officeId)).size
  const keyWords = identifyKeyWords(results, query)
  return { itemKeys, matchedCatalogs, matchedRecords, keyWords }
}

function basicSearch(query: CatalogQuery, searcher: Fuse<SearchItem>, limit: number = 100) {
  console.log("🚀 ~ file: searcher.worker.ts:114 ~ basicSearch ~ query:", query)
  const results = searcher.search(buildLogicalQuery(query))
  const filtered = filterResultsByQueryOptions(results, query)
  const matchedRecords = filtered.length
  const sortArray = query.sort?.map(sort => ({ [sort.direction]: (r: Fuse.FuseResult<SearchItem>) => getField(r.item, sort.field) })) ?? []
  //@ts-ignore
  const itemKeys = sort(filtered).by(sortArray)
    .slice(0, limit)
    .map(result => ({
      recordId: result.item.recordId,
      officeId: result.item.officeId
    }))
  return { itemKeys, results, matchedRecords }
}

function filterResultsByQueryOptions(results: Fuse.FuseResult<SearchItem>[], query: CatalogQuery) {
  if (!catalogs) throw new Error('Catalogs not loaded')
  if (!offices) throw new Error('Offices not loaded')

  return results.filter(result => {
    const item = catalogs?.[result.item.officeId]?.[result.item.recordId]
    const officeCount = Object.keys(offices!).length - 1 //exclude CIVA
    const costs = calculateLinkItemTotals(item?.linkedItems ?? [], catalogs!)

    if (!item) return false
    if (query.excludeMapped === true && item.classificationMappedTimestamp) return false
    if (query.excludeLinked === true && item.itemLinkedTimestamp) return false
    if (query.excludeInactive === true && item.status === 'inactive') return false
    if (query.missingOfficeIds === true && item.linkedItems?.length === officeCount) return false

    if (query.unitPriceLow && (item.unitPrice ?? 0) < query.unitPriceLow) return false
    if (query.unitPriceHigh && (item.unitPrice ?? 0) > query.unitPriceHigh) return false
    if (query.dispensingFeeLow && (item.dispensingFee ?? 0) < query.dispensingFeeLow) return false
    if (query.dispensingFeeHigh && (item.dispensingFee ?? 0) > query.dispensingFeeHigh) return false
    if (query.markUpPercentageLow && (item.markUpPercentage ?? 0) < query.markUpPercentageLow) return false
    if (query.markUpPercentageHigh && (item.markUpPercentage ?? 0) > query.markUpPercentageHigh) return false
    if (query.unitPriceVarianceLow && (costs.unitPriceVariance ?? 0) < query.unitPriceVarianceLow) return false
    if (query.unitPriceVarianceHigh && (costs.unitPriceVariance ?? 0) > query.unitPriceVarianceHigh) return false
    if (query.dispensingFeeVarianceLow && (costs.dispensingFeeVariance ?? 0) < query.dispensingFeeVarianceLow) return false
    if (query.dispensingFeeVarianceHigh && (costs.dispensingFeeVariance ?? 0) > query.dispensingFeeVarianceHigh) return false
    return true
  })
}


function identifyKeyWords(results: Fuse.FuseResult<SearchItem>[], query: CatalogQuery) {
  const tokens = new Set<string>()
  results.forEach(r => {
    r.item.searchString.split(' ')
      .filter(token => token.length > 2)
      .forEach(token => {
        tokens.add(token.toLocaleLowerCase())
      })
  })

  query.classificationNames?.forEach(name => name.split(' ').forEach(token => tokens.add(token.toLocaleLowerCase())))
  query.subClassificationNames?.forEach(name => name.split(' ').forEach(token => tokens.add(token.toLocaleLowerCase())))

  return removeStopwords(Array.from(tokens))
}

function buildLogicalQuery(query: CatalogQuery): Fuse.Expression {
  const logicalQuery = { $and: [] as Fuse.Expression[] }

  if (query.keyWords?.length || 0 > 0) {
    const autoTokens = query.keyWords?.map(token => ({ searchString: `'${token}` }))
    logicalQuery.$and.push({ $or: autoTokens })
  }

  if (query.searchText) {
    logicalQuery.$and.push({
      $or: [
        { searchString: query.searchText },
        { itemId: `'${query.searchText}` },
        { originalItemId: `'${query.searchText}` }
      ]
    })
  }
  if (query.classificationIds?.length ?? 0 > 0) {
    const classificationIds = query.classificationIds?.map(cId => ({ classificationId: `="${cId}"` }))
    logicalQuery.$and.push({ $or: classificationIds })
  }
  if (query.subClassificationIds?.length ?? 0 > 0) {
    const subClassificationIds = query.subClassificationIds?.map(scId => ({ subClassificationId: `="${scId}"` }))
    logicalQuery.$and.push({ $or: subClassificationIds })
  }

  if (query.officeIds?.length ?? 0 > 0) {
    const officeIds = query.officeIds?.map(oId => ({ officeId: `="${oId}"` }))
    logicalQuery.$and.push({ $or: officeIds })
  }

  return logicalQuery
}

function getField(item: SearchItem, field: string): any {
  const cost = calculateLinkItemTotals(catalogs?.[item.officeId]?.[item.recordId]?.linkedItems ?? [], catalogs!)
  const itemRecord = catalogs?.[item.officeId]?.[item.recordId]
  if (field === 'unitPrice') return itemRecord?.unitPrice
  if (field === 'dispensingFee') return itemRecord?.dispensingFee
  if (field === 'classificationName') return itemRecord?.classificationName
  if (field === 'subClassificationName') return itemRecord?.subClassificationName
  if (field === 'markUpPercentage') return itemRecord?.markUpPercentage
  if (field === 'lastUpdateTimestamp') return itemRecord?.lastUpdateTimestamp
  if (field === 'unitPriceVariance') return cost.unitPriceVariance
  if (field === 'dispensingFeeVariance') return cost.dispensingFeeVariance
}

