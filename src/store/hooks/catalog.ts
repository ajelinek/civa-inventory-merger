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
  return useAsyncCallback(async (file: importFileOptions) => {
    return processImportFile(file, email)
  })
}

export function useInitializeCatalog() {
  return useAsync(async () => loadCatalog(catalog => useStore.setState({ catalog })), [])
}

export function useClassificationUpdate() {
  return useAsyncCallback(updateClassifications)
}

export function useCatalogSearchParamQuery(initialQuery?: CatalogQuery): CatalogQuery | undefined {
  const classificationsMap = useStore(state => state.org?.classifications)
  const [query, setQuery] = useState<CatalogQuery>()
  const [searchParams, setSearchParams] = useSearchParams()
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
      excludeInactive: searchParams.get('exi') === 'true',
      missingOfficeIds: searchParams.get('mo') === 'true',
      unitPriceLow: searchParams.get('upl') ? Number(searchParams.get('upl')) : undefined,
      unitPriceHigh: searchParams.get('uph') ? Number(searchParams.get('uph')) : undefined,
      dispensingFeeLow: searchParams.get('dfl') ? Number(searchParams.get('dfl')) : undefined,
      dispensingFeeHigh: searchParams.get('dfh') ? Number(searchParams.get('dfh')) : undefined,
      markUpPercentageLow: searchParams.get('mpl') ? Number(searchParams.get('mpl')) : undefined,
      markUpPercentageHigh: searchParams.get('mph') ? Number(searchParams.get('mph')) : undefined,
      sort: searchParams.get('srt') ? JSON.parse(atob(searchParams.get('srt') ?? '')) : undefined,
    } as CatalogQuery
    setQuery(newQuery)
  }, 500)

  useEffect(() => {
    if (!initialQuery) return
    setSearchParams(prev => {
      prev.delete('o')
      prev.delete('c')
      prev.delete('cs')
      prev.delete('kw')
      prev.delete('st')
      prev.delete('exm')
      prev.delete('exl')
      prev.delete('exi')
      prev.delete('mo')
      prev.delete('mc')
      prev.delete('msc')
      prev.delete('cc')
      prev.delete('upl')
      prev.delete('uph')
      prev.delete('dfl')
      prev.delete('dfh')
      prev.delete('mpl')
      prev.delete('mph')
      prev.delete('srt')

      if (initialQuery?.officeIds?.length ?? 0 > 0) {
        initialQuery?.officeIds?.forEach(id => prev.append('o', id))
      }
      if (initialQuery?.classificationIds?.length ?? 0 > 0) {
        initialQuery?.classificationIds?.forEach(id => prev.append('c', id))
      }
      if (initialQuery?.subClassificationIds?.length ?? 0 > 0) {
        initialQuery?.subClassificationIds?.forEach(id => prev.append('cs', id))
      }
      if (initialQuery?.keyWords?.length ?? 0 > 0) {
        initialQuery?.keyWords?.forEach(id => prev.append('kw', id))
      }
      if (initialQuery?.searchText) prev.append('st', initialQuery.searchText)
      if (initialQuery?.excludeMapped !== undefined) prev.append('exm', initialQuery.excludeMapped?.toString() ?? 'false')
      if (initialQuery?.excludeLinked !== undefined) prev.append('exl', initialQuery.excludeLinked?.toString() ?? 'false')
      if (initialQuery?.excludeInactive !== undefined) prev.append('exi', initialQuery.excludeInactive?.toString() ?? 'true')
      if (initialQuery?.missingOfficeIds !== undefined) prev.append('mo', initialQuery.missingOfficeIds?.toString() ?? 'false')
      if (initialQuery?.unitPriceLow !== undefined) prev.append('upl', initialQuery.unitPriceLow?.toString() ?? '')
      if (initialQuery?.unitPriceHigh !== undefined) prev.append('uph', initialQuery.unitPriceHigh?.toString() ?? '')
      if (initialQuery?.dispensingFeeLow !== undefined) prev.append('dfl', initialQuery.dispensingFeeLow?.toString() ?? '')
      if (initialQuery?.dispensingFeeHigh !== undefined) prev.append('dfh', initialQuery.dispensingFeeHigh?.toString() ?? '')
      if (initialQuery?.markUpPercentageLow !== undefined) prev.append('mpl', initialQuery.markUpPercentageLow?.toString() ?? '')
      if (initialQuery?.markUpPercentageHigh !== undefined) prev.append('mph', initialQuery.markUpPercentageHigh?.toString() ?? '')
      if (initialQuery?.sort?.length ?? 0 > 0) prev.append('srt', btoa(JSON.stringify(initialQuery?.sort)))
      return prev
    }, { replace: true })
  }, [])
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
    if (!(searcher.current && query && catalogs)) return
    console.log("🚀 ~ file: catalog.ts:157 ~ useEffect ~ query:", query)
    setStatus('searching')
    searcher.current.postMessage({ type: 'search', payload: query })
  }, [query, catalogs])

  return { status, result, page, matchedItemKeys, error, comparingText }
}

export function useCatalogSearchCallback() {
  const [comparingText, setComparingText] = useState<string>()

  function executeSearchPromise(query: CatalogQuery): Promise<CatalogQueryResult> {
    return new Promise((resolve, reject) => {
      const worker = new Searcher()
      worker.postMessage({ type: 'load', payload: { catalogs: useStore.getState().catalog, offices: useStore.getState().org?.offices } })
      worker.onmessage = (e) => {
        switch (e.data.type) {
          case 'loaded':
            worker.postMessage({ type: 'search', payload: query })
            break
          case 'searched':
            resolve(e.data.payload)
            break
          case 'compare-status':
            setComparingText(e.data.payload.text)
            break
        }
      }
      worker.onerror = (err) => {
        reject(err)
      }
    })
  }

  const search = useAsyncCallback(executeSearchPromise)
  return { search, comparingText }
}

export function useCatalogItem(itemKey?: ItemKey) {
  if (!itemKey) return
  return useStore(state => state.catalog?.[itemKey.officeId]?.[itemKey.recordId])
}
