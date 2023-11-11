import { ref, set, update } from "firebase/database"
import { rdb } from "../firebase"
import { useStore } from ".."


export async function upsertItem(item: CreateItemRecordInput) {
  if (item.status === 'inactive') return inactiveItems([{ officeId: item.officeId, recordId: item.recordId }, ...item.linkedItems || []])

  if (!item.classificationId) throw new Error('ClassificationId is required')
  if (item.officeId !== 'CIVA') throw new Error('Only CIVA items can be created/updated')
  if (!item.itemId) throw new Error('ItemId is required')

  if (item.subClassificationId) {
    if (!item.itemId.startsWith(item.subClassificationId)) throw new Error('ItemId must start with the sub classification id')
  } else {
    if (!item.itemId.startsWith(item.classificationId)) throw new Error('ItemId must start with the classification id')
  }

  if (!item.itemDescription) throw new Error('Description is required')
  const itemRef = ref(rdb, `catalogs/${item.officeId}/${item.recordId}`)
  await set(itemRef, item)
}

export function multipleItemLink(linkUpdates: LinkedItemUpdates) {
  const updates = linkUpdates.reduce((acc, linkUpdate) => {
    acc[`catalogs/${linkUpdate.linkTo.officeId}/${linkUpdate.linkTo.recordId}/linkedItems`] = linkUpdate.linkedItems
    return acc
  }, {} as Record<string, any>)
  return update(ref(rdb), updates)
}

export function linkItems(linkToItemId: ItemKey, linkedItemKeys: ItemKey[]) {
  const currentItems = useStore.getState().catalog?.[linkToItemId.officeId][linkToItemId.recordId].linkedItems || []
  const newItems = addItemKeyToLinkedItems(currentItems, linkedItemKeys)

  const updates = linkedItemKeys.reduce((acc, itemKey) => {
    acc[`catalogs/${itemKey.officeId}/${itemKey.recordId}/itemLinkedTo`] = linkToItemId
    return acc
  }, {} as Record<string, any>)
  updates[`catalogs/${linkToItemId.officeId}/${linkToItemId.recordId}/linkedItems`] = newItems

  return update(ref(rdb), updates)
}

export function unlinkItems(linkToItemId: ItemKey, removeItemKeys: ItemKey[]) {
  const currentItems = useStore.getState().catalog?.[linkToItemId.officeId][linkToItemId.recordId].linkedItems || []
  const newItems = removeItemKeyFromLinkedItems(currentItems, removeItemKeys.map(k => k.officeId))

  const updates = removeItemKeys.reduce((acc, itemKey) => {
    acc[`catalogs/${itemKey.officeId}/${itemKey.recordId}/itemLinkedTo`] = null
    return acc
  }, {} as Record<string, any>)
  updates[`catalogs/${linkToItemId.officeId}/${linkToItemId.recordId}/linkedItems`] = newItems

  return update(ref(rdb), updates)
}

export function inactiveItems(itemKeys: ItemKey[]) {
  const updates = itemKeys.reduce((acc, itemKey) => {
    acc[`catalogs/${itemKey.officeId}/${itemKey.recordId}/status`] = 'inactive'
    return acc
  }, {} as Record<string, any>)

  return update(ref(rdb), updates)
}

export function removeItemKeyFromLinkedItems(linkedItems: ItemKey[], officeId: OfficeId[]) {
  return linkedItems.filter(itemKey => !officeId.includes(itemKey.officeId))
}

export function addItemKeyToLinkedItems(linkedItems: ItemKey[], itemKeys: ItemKey[]) {
  return [...removeItemKeyFromLinkedItems(linkedItems, itemKeys.map(k => k.officeId)), ...itemKeys]
}