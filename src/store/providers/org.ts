import { classifications, offices, itemTypes } from "../const"

interface SettingsCallback {
  offices: Offices
  classifications: Classifications
  subClassifications: SubClassifications
  itemTypes: ItemTypes
}
export function fetchOrgSettings(cb: (org: SettingsCallback) => void) {
  // const orgRef = ref(rdb, 'org')
  // onValue(orgRef, (snapshot) => {
  //   const data = snapshot.val() as Org
  //   cb(data.offices, data.classifications)
  // })

  const subClassifications = Object.keys(classifications).reduce((acc, key) => {
    const classification = classifications[key]
    acc = { ...acc, ...classification.subClassifications }
    return acc
  }, {} as SubClassifications)

  cb({ offices, classifications, subClassifications, itemTypes })
}