import { useEffect, useRef, useState } from "react"
import { useAsync, useAsyncCallback } from "react-async-hook"
import { useStore } from ".."
import { loadCatalog, updateClassifications } from "../providers/catalog"
import { processImportFile } from "../providers/import"
import Searcher from "../workers/searcher.worker?worker"

export function useFileImport() {
  const email = useStore.getState().user?.email ?? 'unknown'
  return useAsyncCallback(async (file: File) => {
    return processImportFile(file, email)
  })
}

export function useInitializeCatalog() {
  return useAsync(async () => loadCatalog(catalog => useStore.setState({ catalog })), [])
}

export function useClassificationUpdate() {
  return useAsyncCallback(updateClassifications)
}

type SearchStatus = 'initial' | 'loading' | 'loaded' | 'searching' | 'searched'
export function useSearchCatalog(query: CatalogQuery | undefined | null) {
  const searcher = useRef<Worker>()
  const catalog = useStore(state => state.catalog)
  const classifications = useStore(state => state.org?.classifications)
  const [status, setStatus] = useState<SearchStatus>('initial')
  const [result, setResult] = useState<CatalogQueryResult>()
  const [page, setPage] = useState<ItemRecord[]>()


  useEffect(() => {
    searcher.current = new Searcher()
    searcher.current.onmessage = (e) => {
      switch (e.data.type) {
        case 'loaded':
          setStatus('loaded')
          break
        case 'searched':
          setStatus('searched')
          setResult(e.data.payload)
          break
      }
    }

    return () => {
      searcher.current?.terminate()
    }
  }, [])

  useEffect(() => {
    if (!(result && catalog)) return
    const itemKeys = result?.itemKeys?.slice(0, 50)
    //@ts-ignore
    const newPage = itemKeys?.map(item => catalog[item.officeId][item.itemId])
    setPage(newPage)
  }, [catalog, result])

  useEffect(() => {
    if (!(catalog && searcher.current)) return
    setStatus('loading')
    searcher.current.postMessage({ type: 'load', payload: catalog })
  }, [catalog])

  useEffect(() => {
    if (!(searcher.current && query)) return
    const enhancedCatalogQuery = {
      ...query,
      classificationName: query.classificationId && classifications?.[query.classificationId]?.name,
      subClassificationName: query.classificationId && query.subClassificationId && classifications?.[query.classificationId]?.subClassifications?.[query.subClassificationId]?.name
    }
    setStatus('searching')
    searcher.current.postMessage({ type: 'search', payload: enhancedCatalogQuery })
  }, [query])

  return { status, result, page }
}