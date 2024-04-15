import { useStore } from '../../store'
import { utils, writeFile } from 'xlsx'
import { useOfficeIds } from '../../store/selectors/offices'

export function ExportData() {
  // const offices = useOfficeIds(['CIVA'])
  const offices = ['EC'] as OfficeId[]

  function handleExport() {
    /* We are going to export one csv file for each office which will have every record from the master file and original office file
    /* We will also export an xlxs file with a a sheet that has all the data, and a sheet per classification/subclassification. 
    */

    const officeCatalog = useStore.getState().catalog
    const classificationSheets = new Map<string, ExportRecord[]>()
    const exportByOffice = new Map<OfficeId, ExportRecord[]>()


    //IDEXX CSV File Exports
    offices.forEach(office => {
      const masterCatalog = officeCatalog!['CIVA']

      exportByOffice.get(office) || exportByOffice.set(office, [])

      //Process Master Catalog to see what needs to be added, updated or no change
      console.log('🚀 ~ Object.values ~ masterCatalog:', Object.values(masterCatalog))
      Object.values(masterCatalog!).forEach(master => {
        // console.log('🚀 ~ Object.values ~ master:', master)
        if (master.status === 'inactive') return

        const record = initRecord(office)
        record.status = 'CREATE'
        updateNewRecord(record, master)

        const linked = master.linkedItems?.find(link => link.officeId === office)
        const linkedItem = linked?.recordId && officeCatalog![office]![linked?.recordId]
        if (linkedItem) {
          updateOldRecord(record, linkedItem)

          if (isChange(record)) {
            record.status = 'UPDATE'
          } else {
            record.status = 'NO_CHANGE'
          }
        }


        exportByOffice.get(office)!.push(record)
      })

      //Process the specific office for any times that are not linked (so not taken care of in the master catalog)
      Object.values(officeCatalog![office]!).forEach(officeRecord => {
        if (officeRecord.itemLinkedTo) return
        const record = initRecord(office)
        updateOldRecord(record, officeRecord)
        record.status = officeRecord.status === 'inactive' ? 'DELETE' : 'UNKNOWN'
        exportByOffice.get(office)!.push(record)
      })
    })

    console.log('🚀 ~ Object.values ~ exportByOffice:', exportByOffice)



    // const worksheet = utils.json_to_sheet(exportData)
    // const workbook = utils.book_new()
    // utils.book_append_sheet(workbook, worksheet, "Sheet1")

    // This will download the file directly in the browser.
    // If you want to send the file from a server, you'll need a different approach.
    // writeFile(workbook, `${office}-export.xlsx`)

    //Create CSV Files(s)


    exportByOffice.forEach((records, office) => {
      const sheet = utils.json_to_sheet(records)
      const csv = utils.sheet_to_csv(sheet)
      const blob = new Blob([csv], { type: 'text/csv' })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.setAttribute('href', url)
      a.setAttribute('download', `${office}-idexx-export.csv`)
      a.click()
    })
  }

  return (
    <button onClick={handleExport}>Export</button>
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