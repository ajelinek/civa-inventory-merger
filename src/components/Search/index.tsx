import MiniSearch, { QueryCombination, SearchResult } from 'minisearch'
import { useEffect, useMemo, useState } from 'react'
import { removeStopwords } from 'stopword'
import s from './search.module.css'
import { useStore } from '../../store'

type SearchProps = {
  automaticSearchStrings?: string[]
  onSearch: (result: SearchResult[]) => void
}

export default function Search({ automaticSearchStrings, onSearch }: SearchProps) {
  const [selectedTokens, setSelectedTokens] = useState<string[]>([])
  const [excludeTerms, setExcludeTerms] = useState<string>('')
  const [includeMapped, setIncludeMapped] = useState<boolean>(false) //TODO: make this a parm in
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [showAdvancedSearch, setShowAdvancedSearch] = useState<boolean>(false)
  const searcher = useStore(state => state.catalogSearcher) as MiniSearch<ItemRecord>

  const uniqueTokens = useMemo(() => {
    const tokensSet = new Set<string>()
    automaticSearchStrings?.forEach((str) => {
      const strTokens = removeStopwords(str?.split(' ')).filter((t) => t.length > 2)
      strTokens.forEach((token) => tokensSet.add(token.toLocaleLowerCase()))
    })

    const tokens = Array.from(tokensSet)
    setSelectedTokens([...tokens])
    return tokens
  }, [automaticSearchStrings])

  useEffect(() => {
    onSearch(searchIt())
  }, [selectedTokens])

  function searchIt() {
    const q = createQuery()
    const results = searcher.search(q)
    return results.filter((r) => {
      return includeMapped ? true : !r.mapped
    })
  }

  function createQuery() {
    return buildSearchQuery(selectedTokens, searchTerm, excludeTerms)
  }


  function handleTokenClick(token: string) {
    if (selectedTokens.includes(token)) {
      setSelectedTokens(selectedTokens.filter((t) => t !== token))
    } else {
      setSelectedTokens([...selectedTokens, token])
    }
  }

  //when new tokes come in add new tokes to the selected tokens
  useEffect(() => {
  }, [automaticSearchStrings])


  function handleSearchSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    onSearch(searchIt())
  }


  return (
    <form className={s.form} onSubmit={handleSearchSubmit}>
      <fieldset>
        <label htmlFor="pillbox" className={s.label}>Automatic Terms</label>
        <div id='pillbox' className={s.pillbox}>
          {uniqueTokens.map((token) => (
            <button
              type='button'
              key={token}
              className={`${s.pill} ${selectedTokens.includes(token) ? s.selected : ''}`}
              onClick={() => handleTokenClick(token)}
            >
              {token}
            </button>
          ))}
        </div>
      </fieldset>
      <div className={s.searchOptions}>
        <a onClick={() => setShowAdvancedSearch(!showAdvancedSearch)}>Show Advanced Search</a>
        <a onClick={() => setSelectedTokens([])}>Unselect All</a>
      </div>
      {showAdvancedSearch &&
        <>
          <div className={s.searchContainer}>
            <div className={s.searchTextInputs}>
              <fieldset className={s.searchInput}>
                <label htmlFor="searchInput" className={s.label}> Search:</label>
                <input
                  type="text"
                  id="searchInput"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </fieldset>

              <fieldset className={s.excludeInput} >
                <label htmlFor="excludeInput" className={s.label}> Exclude: </label>
                <input
                  type="text"
                  id="excludeInput"
                  value={excludeTerms}
                  onChange={(e) => setExcludeTerms(e.target.value)}
                />
              </fieldset>
            </div>
            <fieldset>
              <input
                type="checkbox"
                role='switch'
                id="includeMapped"
                className={s.checkbox}
                checked={includeMapped}
                onChange={() => setIncludeMapped(!includeMapped)}
              />
              <label htmlFor="includeMapped" className={s.label}> Include mapped fields </label>
            </fieldset>
          </div>
          <button type="submit" className={s.searchButton}> Search</button>
        </>
      }
    </form>
  )
}

function buildSearchQuery(selected: string[], searchTerm: string, excludeTerm: string): QueryCombination {
  let level = 1

  const query = {
    combineWith: 'OR',
    fuzzy: 0.1,
    // prefix: true, 
    boost: { itemDescription: 2 },
    queries: []
  }

  if (excludeTerm) {
    query.combineWith = 'AND_NOT'
    //@ts-ignore
  }

  if (selected.length > 0) {
    //@ts-ignore
    query.queries.push(selected.join(' '))
    //@ts-ignore
    excludeTerm && query.queries.push(excludeTerm)
    //@ts-ignore
    level = 2
  }

  if (searchTerm && level === 1) {
    //@ts-ignore
    query.queries.push(searchTerm)
    //@ts-ignore
    excludeTerm && query.queries.push(excludeTerm)
    //@ts-ignore
    level = 2
  }

  if (searchTerm && level === 2) {
    //@ts-ignore
    query.queries.push({
      combineWith: 'AND',
      // prefix: true,
      boost: { itemDescription: 2, itemId: 3 },
      queries: [searchTerm]
    })
    level = 3
  }

  // if (excludeTerm && level === 1) return query
  // if (excludeTerm && level === 2) {
  //   //@ts-ignore
  //   query.queries.push({ combineWith: 'AND_NOT', queries: [excludeTerm] })
  // }
  // if (excludeTerm && level === 3) {
  //   //@ts-ignore
  //   query.queries[1].queries.push({
  //     combineWith: 'AND_NOT',
  //     // prefix: true,
  //     boost: { itemDescription: 2 },
  //     queries: [excludeTerm]
  //   })
  // }



  return query
}

