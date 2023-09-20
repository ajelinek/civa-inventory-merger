import { useAsync, useAsyncCallback } from "react-async-hook"
import { storeWorker, useStore } from ".."
import { proxy } from "comlink"

export function useFileImport() {
  const email = useStore.getState().user?.email ?? 'unknown'
  return useAsyncCallback(async (file: File) => {
    return storeWorker.processImportFile(file, email)
  })
}

export function useInitializeCatalog() {
  function setTime(time: Date) {
    useStore.setState({ catalogLastUpdateTimestamp: time })
  }
  return useAsync(async () => storeWorker.loadCatalog(proxy(setTime)), [])
}

export function useSearchCatalog(query: CatalogQuery | undefined | null) {
  return useAsync(async () => {
    if (!query) return {
      items: [],
      matchedCatalogs: 0,
      matchedRecords: 0,
      keyWords: []
    } as CatalogQueryResult

    return storeWorker.queryCatalog(query)
  }, [query])
}

