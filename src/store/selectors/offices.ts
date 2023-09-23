export function officesForSelectInput(offices: Offices) {
  const officeKeys = Object.keys(offices) as OfficeId[]
  return officeKeys.map((key) => {
    return { value: key, label: `${key} - ${offices[key].name}` }
  })
}