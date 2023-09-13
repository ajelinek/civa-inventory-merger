import { useStore } from ".."

type ItemCompositeKey = Pick<ItemRecord, 'officeAbbreviationId' | 'subClassificationId' | 'itemId'>
export const itemRecordId = (item: ItemCompositeKey) => `${item.officeAbbreviationId}-${item.itemId}`

function getItemRecordsById(ids: string[]) {
  const catalog = useStore.getState().catalog
  return ids.map((id) => catalog[id])
}
/* 
Search for documents that contain "zen" and ("motorcycle" or "archery")
miniSearch.search({
  combineWith: 'AND', queries: ['zen', {
      combineWith: 'OR',
      queries: ['motorcycle', 'archery']
    }
  ]
})

// Search for documents that contain ("apple" or "pear") but not "juice" and
// not "tree"
miniSearch.search({
  combineWith: 'AND_NOT',
  queries: [
    {
      combineWith: 'OR',
      queries: ['apple', 'pear']
    },
    'juice',
    'tree'
  ]
})
*/