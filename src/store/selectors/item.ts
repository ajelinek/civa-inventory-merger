import { useStore } from ".."

type ItemCompositeKey = Pick<ItemRecord, 'officeAbbreviationId' | 'subClassificationId' | 'itemId'>
export const itemRecordId = (item: ItemCompositeKey) => `${item.officeAbbreviationId}-${item.itemId}`

export function getItemRecordsById(ids: string[]) {
  const catalog = useStore.getState().catalog
  return ids.map((id) => catalog[id])
}