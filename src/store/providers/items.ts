import { ref, set, update } from "firebase/database"
import { rdb } from "../firebase"


export async function upsertItem(item: CreateItemRecordInput) {
  if (!item.classificationId) throw new Error('ClassificationId is required')
  if (!item.officeId) throw new Error('Office is required')
  if (!item.itemId) throw new Error('ItemId is required')
  if (item.subClassificationId) {
    if (!item.itemId.startsWith(item.subClassificationId)) throw new Error('ItemId must start with the sub classification id')
  } else {
    if (!item.itemId.startsWith(item.classificationId)) throw new Error('ItemId must start with the classification id')
  }
  if (!item.itemDescription) throw new Error('Description is required')
  const itemRef = ref(rdb, `catalogs/${item.officeId}/${item.recordId}`)
  await set(itemRef, item)

  if (item.linkedItems) {
    const updates = item.linkedItems.reduce((acc, itemKey) => {
      acc[`catalogs/${itemKey.officeId}/${itemKey.recordId}/classificationId`] = item.classificationId
      acc[`catalogs/${itemKey.officeId}/${itemKey.recordId}/classificationName`] = item.classificationName
      acc[`catalogs/${itemKey.officeId}/${itemKey.recordId}/subClassificationId`] = item.subClassificationId
      acc[`catalogs/${itemKey.officeId}/${itemKey.recordId}/subClassificationName`] = item.subClassificationName
      acc[`catalogs/${itemKey.officeId}/${itemKey.recordId}/itemId`] = item.itemId
      acc[`catalogs/${itemKey.officeId}/${itemKey.recordId}/itemDescription`] = item.itemDescription
      acc[`catalogs/${itemKey.officeId}/${itemKey.recordId}/status`] = item.status || 'active'
      acc[`catalogs/${itemKey.officeId}/${itemKey.recordId}/itemType`] = item.itemType
      acc[`catalogs/${itemKey.officeId}/${itemKey.recordId}/itemTypeDescription`] = item.itemTypeDescription
      acc[`catalogs/${itemKey.officeId}/${itemKey.recordId}/status`] = item.status || 'active'
      acc[`catalogs/${itemKey.officeId}/${itemKey.recordId}/classificationMappedTimestamp`] = new Date().toISOString()
      acc[`catalogs/${itemKey.officeId}/${itemKey.recordId}/itemLinkedTimestamp`] = new Date().toISOString()
      return acc
    }, {} as Record<string, string>)

    return update(ref(rdb), updates)
  }
}

export function createInitialLinkedItem(item: Partial<CreateItemRecordInput>) {
  if (!item.recordId) throw new Error('RecordId is required')
  if (!item.officeId) throw new Error('OfficeId is required')

  const itemRef = ref(rdb, `catalogs/${item.officeId}/${item.recordId}`)
  return set(itemRef, item)
}