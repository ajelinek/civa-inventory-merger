import { onValue, ref, set } from "firebase/database"
import { rdb } from "../firebase"

export function createCatalog(officeId: string, catalog: Catalogs, metadata: OfficeCatalogMetadata) {
  const path = `catalogs/${officeId}`
  const catalogRef = ref(rdb, path)
  return set(catalogRef, catalog)
}

let catalog: Catalogs = {}
let searcher: unknown = undefined
export async function loadCatalog(cb: (time: Date) => void) {
  const catalogRef = ref(rdb, 'catalogs')
  onValue(catalogRef, (snapshot) => {
    const data = snapshot.val()
    catalog = data as Catalogs
    //Setup Searcher
    cb(new Date())
  })
}