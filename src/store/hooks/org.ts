import { useAsync } from "react-async-hook"
import { useStore } from ".."
import { fetchOrgSettings } from "../providers/org"

export function useOrgSettings() {
  return useAsync(async () => fetchOrgSettings((org) => useStore.setState({ org })), [])
}

export function useUpdateOrgClassifications() {

}

export function useUpdateOrgOffices() {

}