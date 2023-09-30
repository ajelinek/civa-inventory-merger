import { useEffect, useState } from 'react'
import { useSearchParam, useSearchParamsListToggle } from '../../hooks/searchParams'
import s from './search.module.css'
import { useSearchParams } from 'react-router-dom'
import { PiSneakerMoveBold } from 'react-icons/pi'

type SearchProps = {
  keyWords?: string[]
  excludeMappedDefault?: boolean | undefined
  excludeLinkedDefault?: boolean | undefined
}

export default function Search({ keyWords, excludeLinkedDefault, excludeMappedDefault }: SearchProps) {
  const excludeMapped = useSearchParam('exm')
  const excludeLinked = useSearchParam('exl')
  const searchTerm = useSearchParam('st')
  const [searchInput, setSearchInput] = useState(searchTerm.value || '')
  const selectedTokens = useSearchParamsListToggle('kw')
  const [_, setParams] = useSearchParams()

  useEffect(() => {
    if (searchTerm.value) setSearchInput(searchTerm.value)
  }, [searchTerm.value])

  useEffect(() => {
    setParams((prevParams) => {
      if (excludeLinked.value === null && excludeLinkedDefault !== undefined) prevParams.set('exl', excludeLinkedDefault ? 'true' : 'false')
      if (excludeMapped.value === null && excludeMappedDefault !== undefined) prevParams.set('exm', excludeMappedDefault ? 'true' : 'false')
      return prevParams
    })
  }, [])

  useEffect(() => {
    if (keyWords && keyWords.length > 0) selectedTokens.addAll(keyWords)
  }, [keyWords])

  function handleOnSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    searchTerm.setValue(searchInput)
  }

  return (
    <form className={s.form} onSubmit={handleOnSubmit}>
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
