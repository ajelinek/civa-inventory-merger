import { offices } from "../const"
import { itemRecordId } from "../selectors/item"

export interface ImportFileProcessorReturnEvent {
  office: OfficeAbbreviation
  catalog: Record<string, ItemRecord>
}
onmessage = (event) => {
  const records = event.data?.records as ImportRecord[]
  const data = processParsedInputFile(records)
  postMessage(data)
}

function processParsedInputFile(records: ImportRecord[]) {
  const office = convertImportRecordToItemRecord(records[0]).officeAbbreviationId
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
    classificationId: importRecord.classificationId,
    classificationName: importRecord.description,
    subClassificationId: importRecord.subClassificationId,
    subClassificationName: importRecord.description_1,
    itemId: importRecord.itemId,
    itemDescription: importRecord.description_2,
    definition: importRecord.invoiceDescription,
    itemType: importRecord.itemType,
    itemTypeDescription: importRecord.description_3 === '[none]' ? '' : importRecord.description_3,
    unitPrice: parseInt(importRecord.quantityUnitPrice),
    dispensingFee: parseInt(importRecord.dispensingFee),
    minimumPrice: parseInt(importRecord.minimumPrice),
    markUpPercentage: 0,
  } as ItemRecord

  const officeKeys = Object.keys(offices) as OfficeAbbreviation[]
  itemRecord.officeAbbreviationId = officeKeys.find(
    (key) => offices[key]?.toLocaleLowerCase() === importRecord.locationName?.toLocaleLowerCase()
  )! //Hacky, but we know it will be there, .. or hope

  itemRecord.itemId = itemRecordId(itemRecord)

  return itemRecord
}
