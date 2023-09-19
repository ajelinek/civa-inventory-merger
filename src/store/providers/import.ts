import Papa from "papaparse"
import { offices } from "../const"
import { createCatalog } from "./catalog"

export async function processImportFile(file: File, email: string) {
  if (!file) throw new Error('No file provided')
  const meta: OfficeCatalogMetadata = {
    lastImportDate: new Date(),
    numberOfItemsIgnored: 0,
    numberOfItemsImported: 0,
    numberOfItemsUpdated: 0,
    updatedBy: email
  }

  const fileAsJSON = await convertFileToJSON(file)
  meta.numberOfItemsImported = fileAsJSON.length
  const { catalog, office } = convertImportFileToCatalog(fileAsJSON)
  if (!office) throw new Error('No office found')
  if (!catalog) throw new Error('No catalog created')
  await createCatalog(office, catalog, meta)
  //Search index is created by the catalog listener
  return {
    meta
    //eventually we may return updated, skipped, record keys
  }
}


function convertFileToJSON(file: File): Promise<ImportRecord[]> {
  return new Promise((resolve, reject) => {
    //@ts-ignore
    Papa.parse(file, {
      header: true,
      // preview: 50,

      transformHeader(header: string) {
        return nameMap.get(header) || header
      },
      complete: (results) => {
        resolve(results.data as ImportRecord[])
      },
      error: (error) => {
        console.log(error)
        reject(new Error('There was an error parsing the file: ' + error.message))
      }
    })
  })
}

function convertImportFileToCatalog(records: ImportRecord[]) {
  console.log("🚀 ~ file: import.ts:51 ~ convertImportFileToCatalog ~ records:", records)
  const office = convertImportRecordToItemRecord(records[0]).officeId
  const catalog = records.reduce((acc, record) => {
    if (!record.itemId) return acc
    const itemRecord = convertImportRecordToItemRecord(record)
    acc[itemRecord.itemId] = itemRecord
    return acc
  }, {} as Record<string, ItemRecord>)

  return { catalog, office }
}

function convertImportRecordToItemRecord(importRecord: ImportRecord): ItemRecord {
  const itemRecord = {
    itemId: importRecord.itemId.replace(/[.#$\/\[\]]/g, '_'),
    originalItemId: importRecord.itemId,
    classificationId: importRecord.classificationId,
    classificationName: importRecord.description,
    subClassificationId: importRecord.subClassificationId,
    subClassificationName: importRecord.description_1,
    itemDescription: importRecord.description_2,
    definition: importRecord.invoiceDescription,
    itemType: importRecord.itemType,
    itemTypeDescription: importRecord.description_3 === '[None]' ? '' : importRecord.description_3,
    unitPrice: parseInt(importRecord.quantityUnitPrice),
    dispensingFee: parseInt(importRecord.dispensingFee),
    minimumPrice: parseInt(importRecord.minimumPrice),
    markUpPercentage: 0,
  } as ItemRecord

  const officeKeys = Object.keys(offices) as OfficeId[]
  const officeId = itemRecord.officeId = officeKeys.find(
    (key) => offices[key]?.name?.toLocaleLowerCase() === importRecord.locationName?.toLocaleLowerCase()
  ) //Hacky, but we know it will be there, .. or hope
  if (!officeId) throw new Error('No office found')
  itemRecord.officeId = officeId

  return itemRecord
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