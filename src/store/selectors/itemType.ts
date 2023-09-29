export function itemTypesForSelectInput(itemTypes: ItemTypes) {
  const itemTypeKeys = Object.keys(itemTypes) as ItemTypeId[]
  return itemTypeKeys.map((key) => {
    return { value: key, label: `${key} - ${itemTypes[key].name}` }
  })
}