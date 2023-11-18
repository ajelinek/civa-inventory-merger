import { FaAngleDoubleLeft, FaAngleDoubleRight } from "react-icons/fa"
import { FaAngleLeft, FaAngleRight } from "react-icons/fa6"
import ItemSummary from "../ItemSummary"
import SortOrder from "../SortOrder"
import s from './searchResults.module.css'
import { useState } from "react"

type props = {
  search: UseSearchCatalogReturn
  selector: Selector<ItemKey>
}

export default function SearchResults({ search, selector }: props) {
  const [expandAll, setExpandAll] = useState(false)
  return (
    <div className={`${s.container} SearchResults-container`}>
      {(search?.result?.matchedRecords || 0 > 0) &&
        <p className={s.pageResults}>Page {search.pages.currentPage} of {search.pages.total} ({search?.result?.matchedRecords} items) </p>}
      <div className={s.actionBar}>
        <Paging search={search} />
        <SortOrder className={s.sortButton} />
      </div>


      {search?.status === 'searching' && <div className={s.loading} aria-busy={true}>Searching...</div>}
      {(search?.status === 'searched' && search?.result?.matchedRecords === 0) && <p>No Results Found</p>}


      {(search?.page && search.page.length && search.page.length > 0)
        ? <div className={s.itemList}>
          <div className={s.selectButtons}>
            <fieldset>
              <input type="checkbox"
                id='selectAll'
                checked={selector.isAllSelected(search?.page || [])}
                onChange={() => selector.onSelectAll(search?.page || [])} />
              <label className={s.selectAll} htmlFor='selectAll'>Select All</label>
            </fieldset>

            <fieldset>
              <input type="checkbox"
                id='expandAll'
                checked={expandAll}
                onChange={() => setExpandAll(!expandAll)} />
              <label className={s.selectAll} htmlFor='expandAll'>Expand All</label>
            </fieldset>
          </div>

          {search?.page.map(r =>
            <ItemSummary key={r.recordId} itemKey={r} selector={selector} expandAll={expandAll} />)}
        </div>
        : null
      }
      <Paging search={search} />
    </div>
  )
}


function Paging({ search }: { search: UseSearchCatalogReturn }) {
  if (search.pages.total <= 1) return null
  const pages = search.pages
  const startIndex = pages.currentPage <= 2 ? 0 : pages.currentPage - 2
  const endIndex = startIndex + 4

  return (
    <div className={s.pageNavContainer}>
      <div className={s.pageNav}>
        <button className={s.navButtonFirst} onClick={() => pages.goToPage(1)}><FaAngleDoubleLeft /></button>
        <button className={s.navButton} onClick={pages.previousPage}><FaAngleLeft /></button>
        {pages.numbers.slice(startIndex, endIndex).map((number, index) => (
          <button
            key={index}
            className={`${s.numberButton} ${pages.currentPage === number ? s.activePageButton : ''}`}
            onClick={() => pages.goToPage(number)}
          >
            {number}
          </button>
        ))}
        {pages.numbers.length > endIndex && <button className={s.numberButton} onClick={() => pages.goToPage(endIndex + 1)}>...</button>}
        <button className={s.navButton} onClick={pages.nextPage}><FaAngleRight /></button>
        <button className={s.navButtonLast} onClick={() => pages.goToPage(pages.total)}><FaAngleDoubleRight /></button>
      </div>
    </div>
  )
}