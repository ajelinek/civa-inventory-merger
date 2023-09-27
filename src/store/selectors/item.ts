
type ItemCompositeKey = Pick<ItemRecord, 'officeId' | 'subClassificationId' | 'itemId'>
export const itemRecordId = (item: ItemCompositeKey) => `${item.officeId}-${item.itemId}`
