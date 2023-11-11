import { useAsyncCallback } from "react-async-hook"
import { inactiveItems, linkItems, unlinkItems, upsertItem } from "../providers/items"

export function useUpsertItem() {
  return useAsyncCallback(upsertItem)
}

// export function useCreateLinkedItem() {
//   return useAsyncCallback(createInitialLinkedItem)
// }

export function useLinkItems() {
  return useAsyncCallback(linkItems)
}

export function useUnLinkItems() {
  return useAsyncCallback(unlinkItems)
}

export function useInactivateItems() {
  return useAsyncCallback(inactiveItems)
}
