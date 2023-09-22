import { useEffect, useState } from 'react'
import s from './search.module.css'
import { useSearchParam, useSearchParamsListToggle } from '../../hooks/searchParams'

type SearchProps = {
  keyWords?: string[]
}

export default function Search({ keyWords }: SearchProps) {
  const [includeMapped, setIncludeMapped] = useState<boolean>(false) //TODO: make this a parm in
  const searchTerm = useSearchParam('st')
  const selectedTokens = useSearchParamsListToggle('kw')

  useEffect(() => {
    if (keyWords && keyWords.length > 0) selectedTokens.addAll(keyWords)
  }, [keyWords])

  return (
    <form className={s.form}>
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
            value={searchTerm.value || ''}
            onChange={(e) => searchTerm.setValue(e.target.value)}
          />
        </fieldset>
        <fieldset>
          <input
            type="checkbox"
            role='switch'
            id="includeMapped"
            className={s.checkbox}
            checked={includeMapped}
            onChange={() => setIncludeMapped(!includeMapped)}
          />
          <label htmlFor="includeMapped" className={s.label}>Include mapped fields</label>
        </fieldset>
      </div>
    </form>
  )
}
