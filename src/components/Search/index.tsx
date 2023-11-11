import { useEffect, useState } from 'react'
import { PiSneakerMoveBold } from 'react-icons/pi'
import { useSearchParam, useSearchParamsListToggle } from '../../hooks/searchParams'
import s from './search.module.css'
import AdvancedSearchTable from '../AdvancedSearchHelp'

type SearchProps = {
  keyWords?: string[]
}

export default function Search({ keyWords }: SearchProps) {
  const excludeMapped = useSearchParam('exm')
  const excludeLinked = useSearchParam('exl')
  const excludeInactive = useSearchParam('exi')
  const searchTerm = useSearchParam('st')
  const [showAllAutoTerms, setShowAutoTerms] = useState(false)
  const [searchInput, setSearchInput] = useState(searchTerm.value || '')
  const selectedTokens = useSearchParamsListToggle('kw')

  useEffect(() => {
    if (searchTerm.value) setSearchInput(searchTerm.value)
  }, [searchTerm.value])


  useEffect(() => {
    if (keyWords && keyWords.length > 0) {
      selectedTokens.addAll(keyWords)
    } else {
      if (selectedTokens.values.length > 0) selectedTokens.removeAll()
    }
  }, [keyWords])

  function handleOnSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    searchTerm.setValue(searchInput)
  }

  const displayKeywords: string[] = (showAllAutoTerms ? keyWords : keyWords?.slice(0, 5)) || []

  return (
    <form className={s.form} onSubmit={handleOnSubmit}>
      {(displayKeywords?.length > 0) &&
        <>
          <fieldset>
            <div className={s.keyWordsLabel}>
              <label htmlFor="pillbox" className={s.label}>Automatic Terms</label>
              <div className={s.searchOptions}>
                <a onClick={() => selectedTokens.removeAll()}>Unselect All</a>
              </div>
            </div>
            <div id='pillbox' className={s.pillbox}>
              {displayKeywords.map((token) => (
                <button
                  type='button'
                  key={token}
                  className={`${s.pill} ${selectedTokens.isSelected(token) ? s.selected : ''}`}
                  onClick={() => selectedTokens.toggle(token)}
                >
                  {token}
                </button>
              ))}
              {(keyWords?.length || 0 > 5) &&
                <button className={s.more} type='button' onClick={() => setShowAutoTerms(!showAllAutoTerms)}>
                  {showAllAutoTerms ? '-' : '+'} {keyWords?.length! - 5}
                </button>
              }
            </div>
          </fieldset>
        </>
      }
      <div className={s.searchContainer}>
        <AdvancedSearchTable className={s.searchHelp} />
        <fieldset className={s.searchInput}>
          <input
            type="search"
            id="searchInput"
            placeholder='Search for an item'
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
          <button type="submit" className={s.submitButton}><PiSneakerMoveBold /></button>
        </fieldset>
        <div className={s.includeOptions}>
          <fieldset>
            <input
              type="checkbox"
              role='switch'
              id="excludeInactive"
              className={s.checkbox}
              checked={!!excludeInactive.value}
              onChange={() => !!excludeInactive.value ? excludeInactive.remove() : excludeInactive.setValue('true')}
            />
            <label htmlFor="excludeInactive" className={s.label}>Exclude inactive items</label>
          </fieldset>
          <fieldset>
            <input
              type="checkbox"
              role='switch'
              id="excludeMapped"
              className={s.checkbox}
              checked={!!excludeMapped.value}
              onChange={() => !!excludeMapped.value ? excludeMapped.remove() : excludeMapped.setValue('true')}
            />
            <label htmlFor="excludeMapped" className={s.label}>Exclude mapped items</label>
          </fieldset>
          <fieldset>
            <input
              type="checkbox"
              role='switch'
              id="excludeLinked"
              className={s.checkbox}
              checked={!!excludeLinked.value}
              onChange={() => !!excludeLinked.value ? excludeLinked.remove() : excludeLinked.setValue('true')}
            />
            <label htmlFor="excludeLinked" className={s.label}>Exclude linked items</label>
          </fieldset>
        </div>
      </div>
    </form>
  )
}