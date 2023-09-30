
type ItemCompositeKey = Pick<ItemRecord, 'officeId' | 'subClassificationId' | 'itemId'>
export const itemRecordId = (item: ItemCompositeKey) => `${item.officeId}-${item.itemId}`

export const getItem = (itemKey: ItemKey, catalog: Catalogs) => {
  return catalog[itemKey.officeId][itemKey.recordId]
}
