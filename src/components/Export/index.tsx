import { unparse } from 'papaparse'
import { useSearchParams } from 'react-router-dom'
import { useStore } from '../../store'

export function ExportData() {
  const [searchParams] = useSearchParams()
  const officeParams = searchParams.getAll('o')
  const office = officeParams[0] as OfficeId
  const disabled = officeParams.length !== 1 || office === 'CIVA'


  function handleExport() {
    console.log('Exporting', office)
    const exportData = [] as ExportRecord[]
    const linkedItemIds = [] as ItemId[]

    const masterCatalog = useStore.getState().catalog?.['CIVA']
    if (!masterCatalog) {
      alert('System Error: Master Catalog not found')
      return
    }
    const officeCatalog = useStore.getState().catalog?.[office]
    if (!officeCatalog) {
      alert('System Error: Office Catalog not found')
      return
    }

    Object.values(masterCatalog!).forEach(master => {
      if (master.status === 'inactive') return

      const record = initRecord(office)
      record.status = 'CREATE'
      updateNewRecord(record, master)

      const linked = master.linkedItems?.find(link => link.officeId === office)
      const linkedItem = linked?.recordId && officeCatalog![linked?.recordId]
      if (linkedItem) {
        updateOldRecord(record, linkedItem)
        linkedItemIds.push(linkedItem.itemId)

        if (isChange(record)) {
          record.status = 'UPDATE'
        } else {
          record.status = 'NO_CHANGE'
        }
      }

      exportData.push(record)
    })

    Object.values(officeCatalog!).forEach(officeItem => {
      const record = initRecord(office)
      record.status = 'DELETE'
      if (!linkedItemIds.includes(officeItem.recordId)) {
        updateOldRecord(record, officeItem)
        exportData.push(record)
      }
    })

    const csv = unparse(exportData, { header: true })
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.setAttribute('href', url)
    a.setAttribute('download', `${office}-export.csv`)
    a.click()

  }

  return (
    <button disabled={disabled} onClick={handleExport}>Export {!disabled && office}</button>
  )

}

function initRecord(office: OfficeId) {
  const record = {
    officeId: office,
    status: 'UNKNOWN',
    oldItemId: '',
    oldClassificationId: '',
    oldClassificationName: '',
    oldSubClassificationId: '',
    oldSubClassificationName: '',
    oldItemDescription: '',
    newItemId: '',
    newClassificationId: '',
    newClassificationName: '',
    newSubClassificationId: '',
    newSubClassificationName: '',
    newItemDescription: ''
  } as ExportRecord
  return record
}

function updateNewRecord(record: ExportRecord, newRecord: ItemRecord) {
  record.newClassificationId = newRecord.classificationId
  record.newClassificationName = newRecord.classificationName
  record.newSubClassificationId = newRecord.subClassificationId
  record.newSubClassificationName = newRecord.subClassificationName
  record.newItemId = newRecord.itemId
  record.newItemDescription = newRecord.itemDescription
}

function updateOldRecord(record: ExportRecord, oldRecord: ItemRecord) {
  record.oldClassificationId = oldRecord.classificationId
  record.oldClassificationName = oldRecord.classificationName
  record.oldSubClassificationId = oldRecord.subClassificationId
  record.oldSubClassificationName = oldRecord.subClassificationName
  record.oldItemId = oldRecord.itemId
  record.oldItemDescription = oldRecord.itemDescription
}


function isChange(record: ExportRecord) {
  return record.oldClassificationId !== record.newClassificationId ||
    record.oldSubClassificationId !== record.newSubClassificationId ||
    record.oldItemDescription !== record.newItemDescription ||
    record.oldItemId !== record.newItemId
}