import Fuse from 'fuse.js'

let searcher: Fuse<ItemRecord> | null = null

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

function load(catalog: Catalogs) {
  searcher = new Fuse<ItemRecord>(mergeCatalogs(catalog), {
    keys: ['itemId', 'officeAbbreviationId', 'classificationId', 'classificationName', 'subClassificationId', 'subClassificationName', 'itemId', 'itemDescription', 'definition', 'itemType', 'itemTypeDescription', 'mapped'],
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

function mergeCatalogs(catalogs: Catalogs) {
  const merged = Object.values(catalogs).reduce((acc, catalog) => {
    acc = [...acc, ...Object.values(catalog)]
    return acc
  }, [] as ItemRecord[])
  return merged
}

function search(query: CatalogQuery) {
  if (!searcher) throw new Error('Searcher not initialized')

  if (!query || !query.searchText) {
    postMessage({ type: 'searched', payload: [] })
    return
  }

  const results = searcher.search(query.searchText)
  const items = results.map(result => ({
    itemId: result.item.itemId,
    officeId: result.item.officeId
  }))
  const matchedCatalogs = new Set(items.map(item => item.officeId)).size
  const matchedRecords = results.length

  postMessage({
    type: 'searched',
    payload: {
      items,
      matchedCatalogs,
      matchedRecords,
      keyWords: []
    }
  })
}