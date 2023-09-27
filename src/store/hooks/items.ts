import { useAsyncCallback } from "react-async-hook"
import { createInitialLinkedItem, upsertItem } from "../providers/items"

export function useUpdateClassifications() {
  throw new Error('Function not implemented.')
}

export function useUpsertItem() {
  return useAsyncCallback(upsertItem)
}

export function useCreateLinkedItem() {
  return useAsyncCallback(createInitialLinkedItem)
}

export function useLinkItems() {
  return useAsyncCallback(() => { })
}
