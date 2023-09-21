import { useAsync, useAsyncCallback } from "react-async-hook"
import { useStore } from ".."
import { loadCatalog } from "../providers/catalog"
import { processImportFile } from "../providers/import"
import Searcher from "../workers/searcher.worker?worker"
import { useEffect, useRef } from "react"

export function useFileImport() {
  const email = useStore.getState().user?.email ?? 'unknown'
  return useAsyncCallback(async (file: File) => {
    return processImportFile(file, email)
  })
}

export function useInitializeCatalog() {
  return useAsync(async () => loadCatalog(catalog => useStore.setState({ catalog })), [])
}

export function useSearchCatalog(query: CatalogQuery | undefined | null) {
  const searcher = useRef<Worker>()
  useEffect(() => {
    searcher.current = new Searcher()

    return


  }, [query])

}


