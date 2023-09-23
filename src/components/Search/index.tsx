import { useEffect } from 'react'
import { useSearchParam, useSearchParamsListToggle } from '../../hooks/searchParams'
import s from './search.module.css'

type SearchProps = {
  keyWords?: string[]
  includeDefaultState?: boolean | undefined
}

export default function Search({ keyWords, includeDefaultState }: SearchProps) {
  const includeMapped = useSearchParam('im')
  const includeLinked = useSearchParam('il')
  const searchTerm = useSearchParam('st')
  const selectedTokens = useSearchParamsListToggle('kw')

  useEffect(() => {
    if (includeMapped.value === undefined && includeDefaultState !== undefined) includeMapped.setValue(includeDefaultState ? 'true' : 'false')
    if (includeLinked.value === undefined && includeDefaultState !== undefined) includeLinked.setValue(includeDefaultState ? 'true' : 'false')
  }, [])

  useEffect(() => {
    if (keyWords && keyWords.length > 0) selectedTokens.addAll(keyWords)
  }, [keyWords])

  return (
    <div className={s.form}>
      {(keyWords?.length || 0 > 0) &&
        <>
          <fieldset>
            <label htmlFor="pillbox" className={s.label}>Automatic Terms</label>
            <div id='pillbox' className={s.pillbox}>
              {keyWords?.map((token) => (
                <button
                  type='button'
                  key={token}
                  className={`${s.pill} ${selectedTokens.isSelected(token) ? s.selected : ''}`}
                  onClick={() => selectedTokens.toggle(token)}
                >
                  {token}
                </button>
              ))}
            </div>
          </fieldset>
          <div className={s.searchOptions}>
            <a onClick={() => selectedTokens.removeAll()}>Unselect All</a>
          </div>
        </>
      }
      <div className={s.searchContainer}>
        <fieldset className={s.searchInput}>
          <input
            type="search"
            id="searchInput"
            placeholder='Search for an item'
            value={searchTerm.value || undefined}
            onChange={(e) => searchTerm.setValue(e.target.value)}
          />
        </fieldset>
        <div className={s.includeOptions}>
          <fieldset>
            <input
              type="checkbox"
              role='switch'
              id="includeMapped"
              className={s.checkbox}
              checked={!!includeMapped.value}
              onChange={() => !!includeMapped.value ? includeMapped.remove() : includeMapped.setValue('true')}
            />
            <label htmlFor="includeMapped" className={s.label}>Include mapped items</label>
          </fieldset>
          <fieldset>
            <input
              type="checkbox"
              role='switch'
              id="includeLinked"
              className={s.checkbox}
              checked={!!includeLinked.value}
              onChange={() => !!includeLinked.value ? includeLinked.remove() : includeLinked.setValue('true')}
            />
            <label htmlFor="includeLinked" className={s.label}>Include linked items</label>
          </fieldset>
        </div>
      </div>
    </div>
  )
}
