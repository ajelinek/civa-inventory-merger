import { proxy } from "comlink"
import { useAsync } from "react-async-hook"
import { storeWorker, useStore } from ".."

export function useOrgSettings() {
  function setOrg(org: Org) {
    console.log("🚀 ~ file: org.ts:7 ~ setOrg ~ org:", org)
    useStore.setState({ org })
  }

  return useAsync(async () => storeWorker.fetchOrgSettings(proxy(setOrg)), [])
}

export function useUpdateOrgClassifications() {

}

export function useUpdateOrgOffices() {

}