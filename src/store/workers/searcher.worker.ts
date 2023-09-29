import Fuse from 'fuse.js'
import { removeStopwords } from 'stopword'

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
  'classificationMappedTimestamp' |
  'itemLinkedTimestamp' |
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
  const { itemKeys, results } = basicSearch(query, searcher)
  const matchedCatalogs = new Set(itemKeys.map(item => item.officeId)).size
  const matchedRecords = itemKeys.length
  const keyWords = identifyKeyWords(results, query)
  return { itemKeys, matchedCatalogs, matchedRecords, keyWords }
}

function basicSearch(query: CatalogQuery, searcher: Fuse<SearchItem>, limit: number = 1000) {
  const results = searcher.search(buildLogicalQuery(query), { limit })
  const itemKeys = results
    .filter(i => {
      if (query.excludeMapped === true && i.item?.classificationMappedTimestamp) return false
      if (query.excludeLinked === true && i.item?.itemLinkedTimestamp) return false
      return true
    })
    .map(result => ({
      recordId: result.item.recordId,
      officeId: result.item.officeId
    }))
  return { itemKeys, results }
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

  if (query.searchText) logicalQuery.$and.push({ searchString: query.searchText })
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
