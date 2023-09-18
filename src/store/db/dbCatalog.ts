import { ref, set } from "firebase/database"
import { rdb } from "../firebase"

export async function insertCatalog(officeId: string, catalog: Catalogs) {
  const path = `catalogs/${officeId}`
  const catalogRef = ref(rdb, path)
  await set(catalogRef, catalog)
  return true
}