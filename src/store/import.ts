import ImportWorker from './workers/importFileProcessor?worker'
import Papa from 'papaparse'
import { useAsyncCallback } from "react-async-hook"
import { createNewOfficeCatalog } from './db/item'
import { ImportFileProcessorReturnEvent } from './workers/importFileProcessor'

const importWorker = new ImportWorker()
export function useFileImport() {
  return useAsyncCallback(async (file: File | null) => {
    if (!file) throw new Error('No file provided')

    return new Promise<ImportFileProcessorReturnEvent>((resolve, reject) => {
      importWorker.onmessage = (event) => {
        try {
          const { catalog, office } = event.data as ImportFileProcessorReturnEvent
          createNewOfficeCatalog(catalog, office)
          resolve({ catalog, office })

        } catch (error) {
          reject(error)
        }
      }

      //@ts-ignore
      Papa.parse(file, {
        header: true,
        // preview: 50,
        dynamicType: true,
        transformHeader(header: string) {
          return nameMap.get(header) || header
        },
        complete: (results) => {
          importWorker.postMessage({ records: results.data })
        },
        error: (error) => {
          console.log(error)
          reject(new Error('There was an error parsing the file: ' + error.message))
        }
      })
    })
  })
}



const nameMap = new Map<string, string>([
  ['classid', 'classificationId'],
  // ['description', 'classificationDescription'],
  ['subclassid', 'subClassificationId'],
  // ['description_1', 'subClassificationDescription'],
  ['invoiceitemid', 'itemId'],
  // ['description_2', 'itemDescription'],
  ['invoicedescription', 'invoiceDescription'],
  ['itemtype', 'itemType'],
  // ['description_3', 'itemTypeDescription'],
  ['quantityfrom', 'quantityFrom'],
  ['quanitytunitprice', 'quantityUnitPrice'],
  ['dispensingfee', 'dispensingFee'],
  ['minimumprice', 'minimumPrice'],
  ['name1', 'locationName'],
  ['revenue_id', 'revenueId'],
  ['allow_price_chg', 'allowPriceChange'],
  ['nbr_disp', 'numberOfDisp'],
  ['status', 'status']
])
