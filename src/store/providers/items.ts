import { ref, set } from "firebase/database"
import { rdb } from "../firebase"


export function createItem(item: CreateItemRecordInput) {
  if (!item.classificationId) throw new Error('ClassificationId is required')
  if (!item.subClassificationId) throw new Error('Sub-classification is required')
  if (!item.officeId) throw new Error('Office is required')
  if (!item.itemId) throw new Error('ItemId is required')
  if (!(item.itemId.startsWith(item.subClassificationId))) throw new Error('Item Id must start with sub-classification id')
  if (!item.itemDescription) throw new Error('Description is required')
  const itemRef = ref(rdb, `catalogs/${item.officeId}/${item.itemId}`)
  return set(itemRef, item)
}