import { sort } from "fast-sort"

export function officesForSelectInput(offices: Offices) {
  const officeKeys = Object.keys(offices) as OfficeId[]
  const sorted = sort(officeKeys).asc()
  return sorted.map((key) => {
    return { value: key, label: `${key} - ${offices[key].name}` }
  })
}