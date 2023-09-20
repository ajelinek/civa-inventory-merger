import { useAsync, useAsyncCallback } from "react-async-hook"
import { useStore } from ".."
import { loadCatalog, queryCatalog } from "../providers/catalog"
import { processImportFile } from "../providers/import"
import { useEffect, useState } from "react"

export function useFileImport() {
  const email = useStore.getState().user?.email ?? 'unknown'
  return useAsyncCallback(async (file: File) => {
    return processImportFile(file, email)
  })
}

export function useInitializeCatalog() {
  function setData(catalog: Catalogs, catalogSearcher: CatalogSearcher) {
    useStore.setState({ catalogSearcher, catalog })
  }
  return useAsync(async () => loadCatalog(setData), [])
}

export function useSearchCatalog(query: CatalogQuery | undefined | null) {
  console.log("🚀 ~ file: catalog.ts:21 ~ useSearchCatalog ~ query:", query)
  const searcher = useStore(state => state.catalogSearcher)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(query?.pageSize || 500)
  const [results, setResults] = useState([])
  const [displayPages, setDisplayPages] = useState([])
  const [totalPages, setTotalPages] = useState(0)
  const [loading, setLoading] = useState(false)
  const [items, setItems] = useState<ItemRecord[]>([])

  useEffect(() => {
    if (!query) return
    setLoading(true)
    queryCatalog(query, searcher).then((r) => {
      setItems(r.items)
      setLoading(false)
    })

  }, [query])

  return {
    loading,
    items,
    keyWords: [],
  }
}


