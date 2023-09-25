import { useAsyncCallback } from "react-async-hook"
import { createItem } from "../providers/items"

export function useUpdateClassifications() {
  throw new Error('Function not implemented.')
}

export function useUpsertItem() {
  return useAsyncCallback(createItem)
}

export function useLinkItems() {
  return useAsyncCallback(() => { })
}
