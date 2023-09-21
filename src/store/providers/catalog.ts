import { onValue, ref, set } from "firebase/database"
import { rdb } from "../firebase"

export function createCatalog(officeId: string, catalog: Catalogs) {
  const path = `catalogs/${officeId}`
  const catalogRef = ref(rdb, path)
  return set(catalogRef, catalog)
}

export async function loadCatalog(cb: (catalog: Catalogs) => void) {
  const catalogRef = ref(rdb, 'catalogs')
  onValue(catalogRef, (snapshot) => {
    const data = snapshot.val()
    const catalog = data as Catalogs
    cb(catalog)
  })
}
