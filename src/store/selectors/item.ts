
type ItemCompositeKey = Pick<ItemRecord, 'officeId' | 'itemId'>
export const itemRecordId = (item: ItemCompositeKey) => `${item.officeId}-${item.itemId.replace(/[.#$\/\[\]]/g, '_')}`

export const getItem = (itemKey: ItemKey, catalog: Catalogs) => {
  return catalog[itemKey.officeId][itemKey.recordId]
}
