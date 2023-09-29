import { sort } from "fast-sort"
import { useStore } from ".."

export function officesForSelectInput(offices: Offices) {
  const officeKeys = Object.keys(offices) as OfficeId[]
  const sorted = sort(officeKeys).asc()
  return sorted.map((key) => {
    return { value: key, label: `${key} - ${offices[key].name}` }
  })
}

export function useOfficeIds() {
  const offices = useStore(state => state.org?.offices)
  return Object.keys(offices || {}) as OfficeId[]
}