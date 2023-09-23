import { useAsync } from "react-async-hook"
import { useStore } from ".."
import { fetchOrgSettings } from "../providers/org"

export function useOrgSettings() {
  return useAsync(async () => fetchOrgSettings((r) => useStore.setState({
    org: {
      offices: r.offices,
      classifications: r.classifications,
    },
    subClassifications: r.subClassifications
  })), [])
}

export function useUpdateOrgClassifications() {

}

export function useUpdateOrgOffices() {

}