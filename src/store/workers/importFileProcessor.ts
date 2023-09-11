import { offices } from "../const"
import { itemRecordId } from "../selectors/item"

onmessage = (event) => {
  const records = event.data?.records as ImportRecord[]
  const data = processParsedInputFile(records)
  postMessage(data)
}

function processParsedInputFile(records: ImportRecord[]) {
  const itemRecords = records.reduce((acc, record) => {
    const itemRecord = convertImportRecordToItemRecord(record)
    acc[itemRecordId(itemRecord)] = itemRecord
    return acc
  }, {} as Record<string, ItemRecord>)

  return itemRecords
}

function convertImportRecordToItemRecord(importRecord: ImportRecord): ItemRecord {
  const itemRecord = {
    classificationId: importRecord.classificationId,
    classificationName: importRecord.description,
    subClassificationId: importRecord.subClassificationId,
    subClassificationName: importRecord.description_1,
    itemId: importRecord.itemId,
    itemDescription: importRecord.description_2,
    definition: importRecord.invoiceDescription,
    itemType: importRecord.itemType,
    itemTypeDescription: importRecord.description_3 === '[none]' ? '' : importRecord.description_3,
    unitPrice: parseInt(importRecord.quantityUnitPrice) * 100,
    dispensingFee: parseInt(importRecord.dispensingFee) * 100,
    minimumPrice: parseInt(importRecord.minimumPrice) * 100,
    markUpPercentage: 0,
  } as ItemRecord

  const officeKeys = Object.keys(offices) as OfficeAbbreviation[]
  itemRecord.officeAbbreviationId = officeKeys.find(
    (key) => offices[key].toLocaleLowerCase() === importRecord.locationName.toLocaleLowerCase()
  )! //Hacky, but we know it will be there, .. or hope


  return itemRecord
}
