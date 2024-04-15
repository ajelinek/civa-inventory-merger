import { useAsyncCallback } from "react-async-hook"
import { activeItems, inactiveItems, linkItems, markItemProcessed, massItemUpdates, unlinkItems, upsertItem } from "../providers/items"

export function useUpsertItem() {
  return useAsyncCallback(upsertItem)
}

export function useLinkItems() {
  return useAsyncCallback(linkItems)
}

export function useUnLinkItems() {
  return useAsyncCallback(unlinkItems)
}

export function useInactivateItems() {
  return useAsyncCallback(inactiveItems)
}

export function useActivateItems() {
  return useAsyncCallback(activeItems)
}

export function useMarkedProcessed() {
  return useAsyncCallback(markItemProcessed)
}

export function useMassItemUpdates() {
  return useAsyncCallback(massItemUpdates)
}