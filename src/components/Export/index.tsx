import { sort } from 'fast-sort'
import { utils, writeFile } from 'xlsx'
import { useStore } from '../../store'
import { classifications } from '../../store/const'
import { useOfficeIds } from '../../store/selectors/offices'



export function ExportData() {
  const offices = useOfficeIds(['CIVA'])
  // const offices = ['EC'] as OfficeId[]

  function handleExport() {
    const officeCatalog = useStore.getState().catalog
    const exportXs = new Map<string, Partial<ItemExportRecord>[]>()
    const exportByOffice = new Map<OfficeId, Partial<ItemExportRecord>[]>()

    exportXs.set('ALL', [])
    exportXs.set('Unknown Classification', [])

    //IDEXX CSV File Exports
    offices.forEach(office => {
      const masterCatalog = officeCatalog!['CIVA']

      exportByOffice.get(office) || exportByOffice.set(office, [])

      //Process Master Catalog to see what needs to be added, updated or no change
      Object.values(masterCatalog!).forEach(master => {
        if (master.status === 'inactive') return
        let updateStatus: UpdateStatus = 'CREATE'

        const linked = master.linkedItems?.find(link => link.officeId === office)
        const linkedItem = linked?.recordId && officeCatalog?.[office]?.[linked?.recordId]
        if (linkedItem) {
          if (isChange(master, linkedItem)) {
            updateStatus = 'UPDATE'
          } else {
            updateStatus = 'NO_CHANGE'
          }
        }

        pushRecord(office, updateStatus, master, linkedItem || undefined)

      })

      //Process the specific office for any times that are not linked (so not taken care of in the master catalog)
      if (officeCatalog?.[office]) {
        Object.values(officeCatalog[office]).forEach(officeRecord => {
          if (officeRecord.itemLinkedTo) return
          const updateStatus: UpdateStatus = officeRecord.status === 'inactive' ? 'DELETE' : 'UNKNOWN'
          pushRecord(office, updateStatus, undefined, officeRecord)
        })
      }
    })


    const workbook = utils.book_new()
    const sortedSheets = sort(Array.from(exportXs.keys())).asc()
    sortedSheets.forEach(sheetName => {
      const records = exportXs.get(sheetName)!
      const sorted = sort(records).asc(['itemId', 'officeId'])
      //Add an empty row between each itemId
      const exportData = sorted.flatMap((record, i, arr) => {
        if (i === 0) return [record]
        if (record.itemId !== arr[i - 1].itemId) return [{}, record]
        return [record]
      })

      const sheet = utils.json_to_sheet(exportData)
      utils.book_append_sheet(workbook, sheet, sheetName)
    })
    writeFile(workbook, `civa-inventory-data-export.xlsx`)

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


    type UpdateStatus = 'CREATE' | 'UPDATE' | 'NO_CHANGE' | 'DELETE' | 'UNKNOWN'

    function pushRecord(office: OfficeId, updateStatus: UpdateStatus, master: ItemRecord | undefined, item: ItemRecord | undefined) {
      //Push the data to the different sheets and data.
      if (!master && !item) throw new Error('Both master and item are null')

      const record: Partial<ItemExportRecord> = {
        classificationName: master?.classificationName || item?.classificationName,
        classificationId: master?.classificationId || item?.classificationId,
        subClassificationName: master?.subClassificationName || item?.subClassificationName,
        subClassificationId: master?.subClassificationId || item?.subClassificationId,
        masterItemId: master?.itemId,
        masterItemDescription: master?.itemDescription,
        itemId: item?.itemId || master?.itemId,
        itemDescription: item?.itemDescription || master?.itemDescription,
        itemType: item?.itemType || master?.itemType,
        status: item?.status || master?.status,
        officeId: office,
        updateStatus,
        dispensingFee: item?.dispensingFee || master?.dispensingFee,
        markUpPercentage: item?.markUpPercentage || master?.markUpPercentage,
        definition: item?.definition || master?.definition,
        minimumPrice: item?.minimumPrice || master?.minimumPrice,
        unitOfMeasure: item?.unitOfMeasure || master?.unitOfMeasure,
      }

      exportByOffice.get(office)!.push(record)

      if (classifications[record.classificationId || '']) {
        const sheetName = `${record.subClassificationId} - ${record.classificationName}`.substring(0, 31)
        if (!exportXs.has(sheetName)) exportXs.set(sheetName, [])

        if (record.updateStatus !== 'CREATE') exportXs.get(sheetName)!.push(record)

      } else {
        exportXs.get('Unknown Classification')!.push(record)
      }
      exportXs.get('ALL')!.push(record)
    }
  }

  return (
    <button onClick={handleExport}>Export</button>
  )

}


function isChange(master: ItemRecord, linked: ItemRecord) {
  return master.classificationId !== linked.classificationId ||
    master.subClassificationId !== linked.subClassificationId ||
    master.itemDescription !== linked.itemDescription ||
    master.itemId !== linked.itemId
}