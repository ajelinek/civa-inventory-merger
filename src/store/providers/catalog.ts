import { onValue, ref, set } from "firebase/database"
import { rdb } from "../firebase"
import Fuse from 'fuse.js'

export function createCatalog(officeId: string, catalog: Catalogs) {
  const path = `catalogs/${officeId}`
  const catalogRef = ref(rdb, path)
  return set(catalogRef, catalog)
}

export async function loadCatalog(cb: (catalog: Catalogs, searcher: Fuse<ItemRecord>) => void) {
  const catalogRef = ref(rdb, 'catalogs')
  onValue(catalogRef, (snapshot) => {
    const data = snapshot.val()
    const catalog = data as Catalogs
    //Setup Searcher
    const searcher = new Fuse<ItemRecord>(mergeCatalogs(catalog), {
      keys: ['itemId', 'officeAbbreviationId', 'classificationId', 'classificationName', 'subClassificationId', 'subClassificationName', 'itemId', 'itemDescription', 'definition', 'itemType', 'itemTypeDescription', 'mapped'],
      threshold: 0.5,
      // ignoreLocation: true,
      minMatchCharLength: 2,
      shouldSort: true,
      includeScore: true,
      includeMatches: true,
      useExtendedSearch: true,
    })

    cb(catalog, searcher)
  })
}

export function queryCatalog(query: CatalogQuery | undefined, searcher: Fuse<ItemRecord>): Promise<CatalogQueryResult> {
  return new Promise((resolve) => {
    if (!query || !query.searchText) {
      resolve({
        items: [],
        matchedCatalogs: 0,
        matchedRecords: 0,
        keyWords: []
      })
      return
    }

    const results = searcher.search(query.searchText, { limit: 500 })
    const items = results.map(result => result.item)
    const matchedCatalogs = new Set(items.map(item => item.officeId)).size
    const matchedRecords = results.length

    resolve({
      items,
      matchedCatalogs,
      matchedRecords,
      keyWords: []
    })
  })
}

function mergeCatalogs(catalogs: Catalogs) {
  const merged = Object.values(catalogs).reduce((acc, catalog) => {
    acc = [...acc, ...Object.values(catalog)]
    return acc
  }, [] as ItemRecord[])
  return merged
}