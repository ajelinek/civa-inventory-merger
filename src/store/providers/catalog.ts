import { onValue, ref, set } from "firebase/database"
import { rdb } from "../firebase"
import Fuse from 'fuse.js'

export function createCatalog(officeId: string, catalog: Catalogs, metadata: OfficeCatalogMetadata) {
  const path = `catalogs/${officeId}`
  const catalogRef = ref(rdb, path)
  return set(catalogRef, catalog)
}

let catalog: Catalogs = {}
let searcher: Fuse<ItemRecord>
export async function loadCatalog(cb: (time: Date) => void) {
  const catalogRef = ref(rdb, 'catalogs')
  onValue(catalogRef, (snapshot) => {
    const data = snapshot.val()
    catalog = data as Catalogs
    //Setup Searcher
    searcher = new Fuse<ItemRecord>(mergeCatalogs(catalog), {
      keys: ['itemId', 'officeAbbreviationId', 'classificationId', 'classificationName', 'subClassificationId', 'subClassificationName', 'itemId', 'itemDescription', 'definition', 'itemType', 'itemTypeDescription', 'mapped'],
      threshold: 0.5,
      // ignoreLocation: true,
      minMatchCharLength: 2,
      shouldSort: true,
      includeScore: true,
      includeMatches: true,
      useExtendedSearch: true,
    })
    cb(new Date())
  })
}

export function queryCatalog(query: CatalogQuery) {
  if (!query.searchText) return []
  const results = searcher.search(query.searchText, { limit: 500 })
  console.log("🚀 ~ file: catalog.ts:33 ~ queryCatalog ~ results:", results)
  return results
}


function mergeCatalogs(catalogs: Catalogs) {
  const merged = Object.values(catalogs).reduce((acc, catalog) => {
    acc = [...acc, ...Object.values(catalog)]
    return acc
  }, [] as ItemRecord[])
  return merged
}