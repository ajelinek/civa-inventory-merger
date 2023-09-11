import ImportWorker from './workers/importFileProcessor?worker'
import Papa from 'papaparse'
import { useAsyncCallback } from "react-async-hook"

const importWorker = new ImportWorker()
export function useFileImport() {
  return useAsyncCallback(async (file: File | null) => {
    if (!file) throw new Error('No file provided')

    return new Promise<dbItemRecords>((resolve, reject) => {
      importWorker.onmessage = (event) => {
        console.log("🚀 ~ file: import.ts:12 ~ returnuseAsyncCallback ~ event:", event.data)
        resolve(event.data)
      }

      //@ts-ignore
      Papa.parse(file, {
        header: true,
        preview: 10,
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
