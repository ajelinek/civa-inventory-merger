import { useEffect, useMemo, useRef, useState } from "react"
import { useAsync, useAsyncCallback } from "react-async-hook"
import { useStore } from ".."
import { loadCatalog, updateClassifications } from "../providers/catalog"
import { processImportFile } from "../providers/import"
import Searcher from "../workers/searcher.worker?worker"
import { useSearchParams } from "react-router-dom"
import { useDebouncedCallback } from "use-debounce"

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

export function useCatalogSearchParamQuery(): CatalogQuery | undefined {
  const classificationsMap = useStore(state => state.org?.classifications)
  const subClassificationMap = useStore(state => state.subClassifications)
  const [query, setQuery] = useState<CatalogQuery>()
  const [searchParams] = useSearchParams()
  const queryBuilder = useDebouncedCallback(() => {
    const newQuery = {
      officeIds: searchParams.getAll('o'),
      classificationIds: searchParams.getAll('c'),
      classificationNames: searchParams.getAll('c').map(id => classificationsMap?.[id]?.name ?? ''),
      subClassificationIds: searchParams.getAll('cs'),
      keyWords: searchParams.getAll('kw'),
      searchText: searchParams.get('st') || '',
      includeMapped: searchParams.get('im') === 'true',
      includeLinked: searchParams.get('il') === 'true',
      subClassificationNames: searchParams.getAll('cs').map(id => subClassificationMap?.[id]?.name ?? '')
    }
    setQuery(newQuery)
  }, 500)

  useEffect(() => queryBuilder(), [classificationsMap, subClassificationMap, searchParams])

  return query
}

type SearchStatus = 'initial' | 'loading' | 'loaded' | 'searching' | 'searched'
export function useSearchCatalog(query: CatalogQuery | undefined | null): UseSearchCatalogReturn {
  const searcher = useRef<Worker>()
  const catalog = useStore(state => state.catalog)
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
  }, [result])

  useEffect(() => {
    if (!(catalog && searcher.current)) return
    setStatus('loading')
    searcher.current.postMessage({ type: 'load', payload: catalog })
  }, [catalog])


  useEffect(() => {
    if (!(searcher.current && query)) return
    setStatus('searching')
    searcher.current.postMessage({ type: 'search', payload: query })
  }, [query, catalog])

  return { status, result, page }
}

