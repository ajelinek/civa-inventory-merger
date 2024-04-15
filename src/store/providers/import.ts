import Papa from "papaparse"
import { offices } from "../const"
import { createCatalog, fetchCatalog } from "./catalog"
import { itemRecordId } from "../selectors/item"
import { nanoid } from "nanoid"
import { addItemKeyToLinkedItems, multipleItemLink } from "./items"

export async function processImportFile(options: importFileOptions) {
  if (!options.inventoryFile) throw new Error('No inventory file provided')
  const meta: OfficeCatalogMetadata = {
    lastImportDate: new Date(),
    inventoryItemsImported: 0,
    pricingItemsImported: 0,
    matchedPricingItems: 0,
    unmatchedPricingItems: [],
    erroredPricingItems: [],
    multiplePricingInfoItems: [],
    numberOfItemsLinkedToMaster: 0
  }

  /****************************************************/
  /* 0. Check if file is a wenona import              */
  /****************************************************/
  const inventoryFileText = await options.inventoryFile.text()

  function isWenonaImport() {
    return inventoryFileText.includes('Printed') && inventoryFileText.includes('Inventory reports')
  }

  const { catalog, officeId } = isWenonaImport() ? await createWenonaCatalog(options, meta) : await createCornerstoneCatalog(options, meta)

  /****************************************************/
  /* 4. If creating master catalog, convert and return*/
  /****************************************************/
  if (options.masterCatalog) {
    await createCatalog('CIVA', convertToMasterCatalog(catalog))
    return { meta }
  }

  /****************************************************/
  /* 5. Link items to master catalog                  */
  /****************************************************/
  const autoLinkItems: LinkedItemUpdate[] = []
  const masterCatalog = await fetchCatalog('CIVA')
  if (!masterCatalog) throw new Error('No primary catalog found')
  Object.keys(catalog).forEach((key) => {
    const itemRecord = catalog[key]
    const masterItemRecord = searchMasterCatalog(masterCatalog, itemRecord)

    if (masterItemRecord) {
      autoLinkItems.push({
        linkedItems: addItemKeyToLinkedItems(masterItemRecord.linkedItems || [], [{ officeId, recordId: itemRecord.recordId }]),
        linkTo: { officeId: masterItemRecord.officeId, recordId: masterItemRecord.recordId }
      })

      itemRecord.itemLinkedTo = { officeId: 'CIVA', recordId: masterItemRecord.recordId }
    }
  })

  /***************************************************************/
  /* 6. Create catalog in DB & Update Master Catalog LinkedItems */
  /***************************************************************/
  await createCatalog(officeId, catalog)
  meta.numberOfItemsLinkedToMaster = autoLinkItems.length
  await multipleItemLink(autoLinkItems)

  return { meta }
}

async function createWenonaCatalog(options: importFileOptions, meta: OfficeCatalogMetadata) {
  const inventoryText = await options.inventoryFile.text()
  const inventoryFileLines = inventoryText.split('\n')
  const recordStrings: string[] = []
  inventoryFileLines.forEach((line) => {
    if (line.includes('Printed,')) return
    if (line.startsWith('Inventory Total Valuation,')) return
    if (line.startsWith('All items,')) return
    if (line.startsWith('Item code,')) return
    recordStrings.push(line)
  })

  const parsed = Papa.parse(recordStrings.join('\n'), { delimiter: ',', })
  const records = [] as ItemRecord[]
  parsed.data.forEach((r) => {
    const record = r as string[]
    const itemId = record[0].trim()

    if (!itemId) return
    meta.inventoryItemsImported++

    const recordId = itemRecordId({ itemId: itemId, officeId: 'WV' })

    records.push({
      ...ItemRecordTemplate,
      itemId,
      recordId,
      officeId: 'WV',
      itemDescription: record[1],
      markUpPercentage: parseFloat(record[7]),
      unitPrice: parseFloat(record[8]),
      dispensingFee: parseFloat(record[9])
    })

    if (record[12]) {
      const itemId = record[12].trim()
      const recordId = itemRecordId({ itemId, officeId: 'WV' })
      meta.inventoryItemsImported++

      records.push({
        ...ItemRecordTemplate,
        itemId,
        recordId,
        officeId: 'WV',
        itemDescription: record[13],
        markUpPercentage: parseFloat(record[16]),
        unitPrice: parseFloat(record[17]),
        dispensingFee: parseFloat(record[18])
      })
    }
  })

  const catalog = records.reduce((acc, record) => {
    acc[record.recordId] = record
    return acc
  }, {} as Catalog)


  return { catalog, officeId: 'WV' as OfficeId }
}

async function createCornerstoneCatalog(options: importFileOptions, meta: OfficeCatalogMetadata) {
  if (!options.pricingFile) throw new Error('No pricing file provided')

  /****************************************************/
  /* 1. Convert the inventory file to a JSON object    */
  /****************************************************/
  const inventoryAsJSON = await convertFileToJSON(options.inventoryFile) as ImportRecord[]
  meta.inventoryItemsImported = inventoryAsJSON.length
  const { catalog, officeId } = convertImportFileToCatalog(inventoryAsJSON)
  if (!officeId) throw new Error('No office found')
  if (!catalog) throw new Error('No catalog created')


  /****************************************************/
  /* 2. Convert the pricing file to a JSON object      */
  /****************************************************/
  //Read in content of file and split by line
  const pricingRecordFileText = await options.pricingFile.text()
  const pricingRecordFileLines = pricingRecordFileText.split('\n')


  /****************************************************/
  /* 3. Merge the pricing data with the inventory data */
  /****************************************************/
  pricingRecordFileLines.forEach((record) => {
    meta.pricingItemsImported++

    try {
      const priceDataList = convertImportPriceRecordToPriceRecord(record)
      if (!priceDataList) return
      const pricing = priceDataList[0]
      if (priceDataList.length > 1) meta.multiplePricingInfoItems.push(pricing.itemId)
      const priceItemId = itemRecordId({ itemId: pricing.itemId, officeId })

      if (!catalog[priceItemId]) {
        meta.unmatchedPricingItems.push(pricing.itemId)
        return
      }

      catalog[priceItemId] = { ...catalog[priceItemId], ...pricing }
      meta.matchedPricingItems++
    } catch (error) {
      console.error(error, record)
      const regex = /inv_item=([\w+]+)/
      meta.erroredPricingItems.push(record?.match(regex)?.[1] || 'unknown')
    }
  })

  return { catalog, officeId }
}

function searchMasterCatalog(catalog: Catalog, itemRecord: ItemRecord) {
  const matchedMasterItemKeys = Object.keys(catalog).map((key) => {
    const masterItemRecord = catalog[key]
    let score = 0


    if (masterItemRecord?.classificationName?.toLocaleLowerCase() === itemRecord?.classificationName?.toLocaleLowerCase()) {
      if (masterItemRecord.itemId === itemRecord.itemId) {
        score++
      }

      if (masterItemRecord.itemDescription?.toLocaleLowerCase() === itemRecord?.itemDescription?.toLocaleLowerCase()) {
        score++
      }
    }


    if (masterItemRecord.linkedItems?.find((itemKey) => (
      itemKey.recordId === itemRecord.recordId &&
      itemKey.officeId === itemRecord.officeId)
    )) {
      score++
    }

    return { key, score }
  })

  matchedMasterItemKeys.sort((a, b) => b.score - a.score)

  const key = matchedMasterItemKeys[0]?.score > 0 ? matchedMasterItemKeys[0].key : null
  return key ? catalog[key] : null
}


function convertToMasterCatalog(catalog: Record<string, ItemRecord>) {
  return Object.keys(catalog).reduce((acc, key) => {
    const itemRecord = catalog[key]
    const newItemRecord = {
      ...itemRecord,
      recordId: nanoid(8),
      officeId: 'CIVA',
      linkedItems: [{
        recordId: itemRecord.recordId,
        officeId: itemRecord.officeId
      }]
    } as ItemRecord
    acc[newItemRecord.recordId] = newItemRecord
    return acc
  }, {} as Catalog)
}



function convertFileToJSON(file: File): Promise<ImportRecord[]> | Promise<PriceRecordRaw[]> {
  //@ts-ignore
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      // preview: 10,

      transformHeader(header: string) {
        return nameMap.get(header) || header
      },
      complete: (results) => {
        resolve(results.data as ImportRecord[] | PriceRecordRaw[])
      },
      error: (error) => {
        console.log(error)
        reject(new Error('There was an error parsing the file: ' + error.message))
      }
    })
  })
}

function convertImportFileToCatalog(records: ImportRecord[]) {
  const officeId = convertImportRecordToItemRecord(records[0]).officeId
  const catalog = records.reduce((acc, record) => {
    if (!record.itemId) return acc
    const itemRecord = convertImportRecordToItemRecord(record)
    acc[itemRecord.recordId] = itemRecord
    return acc
  }, {} as Record<string, ItemRecord>)

  return { catalog, officeId }
}

function convertImportRecordToItemRecord(importRecord: ImportRecord): ItemRecord {
  const itemRecord = {
    itemId: importRecord.itemId,
    classificationId: importRecord.classificationId,
    classificationName: importRecord.description,
    subClassificationId: importRecord.subClassificationId,
    subClassificationName: importRecord.description_1,
    itemDescription: importRecord.description_2,
    definition: importRecord.invoiceDescription,
    itemType: importRecord.itemType,
    itemTypeDescription: importRecord.description_3 === '[None]' ? '' : importRecord.description_3,
    unitPrice: parseFloat(importRecord.quantityUnitPrice),
    dispensingFee: parseFloat(importRecord.dispensingFee),
    minimumPrice: parseFloat(importRecord.minimumPrice),
    markUpPercentage: 0,
  } as ItemRecord

  const officeKeys = Object.keys(offices) as OfficeId[]
  const officeId = officeKeys.find(
    (key) => offices[key]?.name?.toLocaleLowerCase() === importRecord.locationName?.toLocaleLowerCase()
  ) //Hacky, but we know it will be there, .. or hope
  if (!officeId) throw new Error('No office found')
  itemRecord.officeId = officeId
  itemRecord.recordId = itemRecordId(itemRecord)

  return itemRecord
}

function convertImportPriceRecordToPriceRecord(record: String): PriceRecord[] | null {
  const jsArrayOfObjReg = /\[({.*?})\]/g
  const match = record.match(jsArrayOfObjReg)?.[0]
  if (!match) return null
  const priceString = match.replace(/(\w+)(=)([^,}\s]+)/g, '"$1":"$3"')
  const priceDataList = JSON.parse(priceString)
  return priceDataList.map((priceData: any) => {
    if (!priceData.inv_item) throw new Error('No item id found')
    return {
      itemId: priceData.inv_item,
      unitPrice: priceData.quanitytunitprice === 'null' ? 0 : parseFloat(priceData.quanitytunitprice),
      markUpPercentage: priceData.markup === 'null' ? 0 : parseFloat(priceData.markup),
    }
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
  ['markup', 'markUpPercentage'],
  ['qualityunityprice', 'unitPrice'],
  ['qualityfrom', 'quantityFrom'],
  ['name1', 'locationName'],
  ['revenue_id', 'revenueId'],
  ['allow_price_chg', 'allowPriceChange'],
  ['nbr_disp', 'numberOfDisp'],
  ['status', 'status']
])


const ItemRecordTemplate: ItemRecord = {
  recordId: '',
  itemId: '',
  officeId: 'CIVA',
  classificationId: '',
  classificationName: '',
  subClassificationId: '',
  subClassificationName: '',
  itemDescription: '',
  definition: '',
  itemType: 'U',
  itemTypeDescription: '',
  unitOfMeasure: '',
  unitPrice: 0,
  dispensingFee: 0,
  minimumPrice: 0,
  markUpPercentage: 0,
  status: 'active'
}