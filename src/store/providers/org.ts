import { classifications, offices } from "../const"

export function fetchOrgSettings(cb: (org: Org) => void) {
  // const orgRef = ref(rdb, 'org')
  // onValue(orgRef, (snapshot) => {
  //   const data = snapshot.val() as Org
  //   cb(data.offices, data.classifications)
  // })

  cb({ offices, classifications })
}