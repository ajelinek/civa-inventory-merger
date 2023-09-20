import { useAsync, useAsyncCallback } from "react-async-hook"
import { useStore } from ".."
import { loadCatalog, queryCatalog } from "../providers/catalog"
import { processImportFile } from "../providers/import"

export function useFileImport() {
  const email = useStore.getState().user?.email ?? 'unknown'
  return useAsyncCallback(async (file: File) => {
    return processImportFile(file, email)
  })
}

export function useInitializeCatalog() {
  function setData(catalog: Catalogs, catalogSearcher: CatalogSearcher) {
    // useStore.setState({ catalogSearcher, catalog })
  }
  return useAsync(async () => loadCatalog(setData), [])
}

export function useSearchCatalog(query: CatalogQuery | undefined | null) {
  console.log("🚀 ~ file: catalog.ts:21 ~ useSearchCatalog ~ query:", query)
  const searcher = useStore(state => state.catalogSearcher)

  return useAsync(async () => {
    if (!query) return null
    return queryCatalog(query, searcher)

  }, [query])
}


