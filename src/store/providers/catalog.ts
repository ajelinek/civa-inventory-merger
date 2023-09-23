import { onValue, ref, set, update } from "firebase/database"
import { rdb } from "../firebase"

export function createCatalog(officeId: string, catalog: Catalog) {
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

export async function updateClassifications(updateInput: UpdateClassificationInput) {
  const updates = updateInput.items.reduce((acc, item) => {
    acc[`catalogs/${item.officeId}/${item.recordId}/classificationId`] = updateInput.classificationId
    acc[`catalogs/${item.officeId}/${item.recordId}/classificationName`] = updateInput.classificationName
    acc[`catalogs/${item.officeId}/${item.recordId}/subClassificationId`] = updateInput.subClassificationId || ''
    acc[`catalogs/${item.officeId}/${item.recordId}/subClassificationName`] = updateInput.subClassificationName || ''
    acc[`catalogs/${item.officeId}/${item.recordId}/classificationMappedTimestamp`] = new Date().toISOString()
    return acc
  }, {} as Record<string, string>)

  return update(ref(rdb), updates)

}