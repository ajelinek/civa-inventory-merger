import { sort } from "fast-sort"
import { useStore } from ".."
import { useMemo } from "react"

export function officesForSelectInput(offices: Offices) {
  const officeKeys = Object.keys(offices) as OfficeId[]
  const sorted = useMemo(() => {
    const s = sort(officeKeys).asc()
    return s.map((key) => {
      return { value: key, label: `${key} - ${offices[key].name}` }
    })
  }, [officeKeys])

  return sorted
}

export function useOfficeIds(excludeOfficeIds?: OfficeId[]) {
  const offices = useStore(state => state.org?.offices)
  const officeIds = useMemo(() => {
    const ids = Object.keys(offices || {}) as OfficeId[]
    return ids.filter(id => !excludeOfficeIds?.includes(id))
  }, [offices])
  return officeIds
}

export function useMatchedOfficeIds(keyItems: ItemKey[], officeIds: OfficeId[]) {
  return useMemo(() => {
    return officeIds.filter(officeId => {
      const matched = keyItems?.find(keyItem => keyItem.officeId === officeId)
      return !matched
    })
  }, [officeIds, keyItems])
}