import { useEffect, useRef, useState } from "react"
import { useAsync, useAsyncCallback } from "react-async-hook"
import { useSearchParams } from "react-router-dom"
import { useDebouncedCallback } from "use-debounce"
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

export function useCatalogSearchParamQuery(): CatalogQuery | undefined {
  const classificationsMap = useStore(state => state.org?.classifications)
  // const subClassificationMap = useStore(state => state.subClassifications)
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
      excludeMapped: searchParams.get('exm') === 'true',
      excludeLinked: searchParams.get('exl') === 'true',
      // subClassificationNames: searchParams.getAll('cs').map(id => subClassificationMap?.[id]?.name ?? '')
    }
    setQuery(newQuery)
  }, 500)

  useEffect(() => queryBuilder(), [classificationsMap, searchParams])

  return query
}

type SearchStatus = 'initial' | 'loading' | 'loaded' | 'searching' | 'searched'
export function useSearchCatalog(query: CatalogQuery | undefined | null): UseSearchCatalogReturn {
  const searcher = useRef<Worker>()
  const catalogs = useStore(state => state.catalog)
  const offices = useStore(state => state.org?.offices)
  const [status, setStatus] = useState<SearchStatus>('initial')
  const [result, setResult] = useState<CatalogQueryResult>()
  const [page, setPage] = useState<ItemKey[]>()
  const [matchedItemKeys, setMatchedItemKeys] = useState<MatchedItemKeys>()
  const [error, setError] = useState<Error | undefined>()
  const [comparingText, setComparingText] = useState<string>()


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
          setComparingText(undefined)
          break
        case 'compare-status':
          setComparingText(e.data.payload.text)
          break
      }
    }
    searcher.current.onerror = (e) => {
      setError(e.error)
      setStatus('initial')
    }

    return () => {
      searcher.current?.terminate()
    }
  }, [])

  useEffect(() => {
    if (!(result && catalogs)) return
    const itemKeys = result?.itemKeys?.slice(0, 50)
    // const itemKeys = result?.itemKeys
    //@ts-ignore
    // const newPage = itemKeys?.map(item => catalog[item.officeId][item.recordId])
    setPage(itemKeys)
    setMatchedItemKeys(result?.matchedItemKeys)
  }, [result])

  useEffect(() => {
    if (!(catalogs && searcher.current)) return
    setStatus('loading')
    searcher.current.postMessage({ type: 'load', payload: { catalogs, offices } })
  }, [catalogs])


  useEffect(() => {
    console.log("🚀 ~ file: catalog.ts:110 ~ useEffect ~ query:", query)
    if (!(searcher.current && query && catalogs)) return
    setStatus('searching')
    searcher.current.postMessage({ type: 'search', payload: query })
  }, [query, catalogs])

  return { status, result, page, matchedItemKeys, error, comparingText }
}

export function useCatalogItem(itemKey?: ItemKey) {
  if (!itemKey) return
  return useStore(state => state.catalog?.[itemKey.officeId][itemKey.recordId])
}
