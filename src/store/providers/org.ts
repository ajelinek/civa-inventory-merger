import { classifications, offices } from "../const"

export function fetchOrgSettings(cb: (org: Org) => void) {
  // const orgRef = ref(rdb, 'org')
  // onValue(orgRef, (snapshot) => {
  //   const data = snapshot.val() as Org
  //   cb(data.offices, data.classifications)
  // })

  console.log("🚀 ~ file: org.ts:11 ~ fetchOrgSettings ~ { offices, classifications }:", { offices, classifications })
  cb({ offices, classifications })
}