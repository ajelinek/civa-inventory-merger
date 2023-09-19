import { useAsync, useAsyncCallback } from "react-async-hook"
import { storeWorker, useStore } from ".."
import { loadCatalog } from "../providers/catalog"
import { proxy } from "comlink"

export function useFileImport() {
  const email = useStore.getState().user?.email ?? 'unknown'
  return useAsyncCallback(async (file: File) => {
    return storeWorker.processImportFile(file, email)
  })
}

export function useInitializeCatalog() {
  return useAsync(async () =>
    loadCatalog(proxy((time: Date) =>
      useStore.setState({ catalogLastUpdateTimestamp: time }))
    ), [])
}

export function useSearchCatalog(query: CatalogQuery) {
  return useAsync(async () => {
    return []
  }, [])
}

