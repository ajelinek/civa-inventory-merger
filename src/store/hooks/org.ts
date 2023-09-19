import { proxy } from "comlink"
import { useAsync } from "react-async-hook"
import { storeWorker, useStore } from ".."

export function useOrgSettings() {
  return useAsync(async () => proxy(
    storeWorker.fetchOrgSettings((org) => useStore.setState({ org }))
  ), [])
}

export function useUpdateOrgClassifications() {

}

export function useUpdateOrgOffices() {

}