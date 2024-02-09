import { useState } from 'react'
import { FaSort, FaTrash } from 'react-icons/fa6'
import { useSearchParam } from '../../hooks/searchParams'
import s from './sortOrder.module.css'

const sortFieldOptions =
  [
    { field: 'classificationName', name: 'Classification' },
    { field: 'dispensingFee', name: 'Dispensing Fee' },
    { field: 'dispensingFeeVariance', name: 'Dispensing Fee Variance' },
    { field: 'itemDescription', name: 'Description' },
    { field: 'itemId', name: 'Item Id' },
    { field: 'lastUpdateTimestamp', name: 'Last Update Time' },
    { field: 'markUpPercentage', name: 'Markup' },
    { field: 'subClassificationName', name: 'Sub Classification' },
    { field: 'unitPrice', name: 'Unit Price' },
    { field: 'unitPriceVariance', name: 'Unit Price Variance' },
  ]

export default function SortOrder({ className }: { className?: string }) {
  const sort = useSearchParam('srt')
  const sortObj: SortField[] = sort.value ? JSON.parse(atob(sort.value)) : []
  const [sortFields, setSortFields] = useState(sortObj)
  const [showModal, setShowModal] = useState(false)

  const handleReset = () => {
    setSortFields([])
    setShowModal(false)
  }
  const handleApply = () => {
    sort.setValue(btoa(JSON.stringify(sortFields)))
    setShowModal(false)
  }

  function handleFieldSelect(index: number, value: string) {
    const newSortFields = [...sortFields]
    if (index === sortFields.length) newSortFields.push({ field: '', direction: '' })
    newSortFields[index].field = value
    setSortFields(newSortFields)
  }

  function handleDirectionSelect(index: number, value: SortDirection) {
    const newSortFields = [...sortFields]
    if (index === sortFields.length) newSortFields.push({ field: '', direction: '' })
    newSortFields[index].direction = value
    setSortFields(newSortFields)
  }

  function handleRemoveSort(index: number) {
    const newSortFields = [...sortFields]
    newSortFields.splice(index, 1)
    setSortFields(newSortFields)
  }

  function SortField({ index }: { index: number }) {
    return (
      <div className={s.sortFieldSet}>
        <fieldset>
          <label htmlFor="sortField">Sort By</label>
          <select id='softField' value={sortFields[index]?.field} onChange={(e) => handleFieldSelect(index, e.target.value)}>
            <option value=''>Select a field</option>
            {sortFieldOptions.map((option, index) => (
              <option key={option.field + index} value={option.field}>
                {option.name}
              </option>
            ))}
          </select>
        </fieldset>
        <fieldset>
          <label htmlFor='direction'>Direction</label>
          <select id='direction' value={sortFields[index]?.direction} onChange={(e) => handleDirectionSelect(index, e.target.value as SortDirection)}>
            <option value=''>Select a direction</option>
            <option value={'asc'}>Ascending</option>
            <option value={'desc'}>Descending</option>
          </select>
        </fieldset>
        {(index !== sortFields.length) && <button className={s.deleteButton} onClick={() => handleRemoveSort(index)}><FaTrash /></button>}
      </div>
    )
  }

  return (
    <div className={className}>
      <button className={s.sortButton} onClick={() => setShowModal(true)}>
        <FaSort />Sort
      </button>
      {showModal && (
        <dialog open={showModal}>
          <article className={s.content}>
            <header>
              <a aria-label="Close" className='close' onClick={() => setShowModal(false)}> </a>
              Results Sort Order
            </header>
            <button className={s.resetSort} onClick={handleReset}>Reset Sort</button>
            {sortFields.map((_, index) => <SortField key={index} index={index} />)}
            <SortField index={sortFields.length} />
            <button onClick={handleApply}>Apply</button>
          </article>
        </dialog>
      )}
    </div>
  )
}
