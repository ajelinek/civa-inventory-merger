import { stringSimilarity } from 'string-similarity-js'
import { nanoid } from 'nanoid'
import * as xlsx from 'xlsx'
import * as fs from 'fs'


/** Const Objects */
const OfficeMap = new Map<string, OfficeId>([['C', 'CIVA'], ['E', 'EC'], ['B', 'BH'], ['L', 'LS'], ['M', 'MC'], ['W', 'WV'], ['V', 'VC']])
const officeData = new Map<string, ItemRecord>()
const noSubClass = ['109', '110']
const allData: ItemRecord[] = []
const header = [
  'officeId',
  'classificationId',
  'classificationName',
  'subClassificationId',
  'subClassificationName',
  'itemId',
  'itemDescription',
  // 'definition', 
  'itemType',
  // 'itemTypeDescription', 
  'unitOfMeasure',
  'unitPrice',
  'dispensingFee',
  'minimumPrice',
  'markUpPercentage',
  // 'lastUpdateTimestamp', 
  // 'processed', 
  // 'classificationMappedTimestamp', 
  'status',
  'idChanged',
  'descriptionChanged',
  'descriptionDifference',
  'duplicateOffice',
  'allCaps',
  'linkedItems',
  'itemLinkedTo',
  'recordId',
]

function main(fileName: string) {
  if (!fileName) {
    console.error('Please provide a file name')
    return
  }

  const workbook = xlsx.readFile(fileName)

  workbook.SheetNames.forEach(sheetName => {
    const sheet = workbook.Sheets[sheetName]
    if (sheetName.includes('Client Instruction Codes')) return

    const data = xlsx.utils.sheet_to_json(sheet, { blankrows: true }) as ItemRow[]
    processWorksheetData(data, sheetName)
  })


  const outSheet = xlsx.utils.json_to_sheet(allData.map(d => ({ ...d, linkedItems: JSON.stringify(d.linkedItems), itemLinkedTo: JSON.stringify(d.itemLinkedTo) })), { header })
  const outWorkbook = xlsx.utils.book_new(outSheet, 'All Data')
  xlsx.writeFileXLSX(outWorkbook, 'output/processed-data-all.xlsx')

  //write the master catalog out to a json file.
  const masterData = allData.filter(d => d.officeId === 'CIVA').reduce((acc, d) => {
    acc[d.recordId] = d
    return acc
  }, {} as Record<string, ItemRecord>)
  fs.writeFileSync('output/masterData.json', JSON.stringify(masterData, null, 2))

  //TODO: HACK
  const wenona = allData.filter(d => d.officeId === 'WV').reduce((acc, d) => {
    acc[d.recordId] = d
    return acc
  }, {} as Record<string, ItemRecord>)
  fs.writeFileSync('output/wenona.json', JSON.stringify(wenona, null, 2))

  //Write a json file of mappings of each item to the classification and subclassifcation.  This will be used to import into the database.
  const massUpdates = allData.map(d => ({
    officeId: d.officeId,
    recordId: d.recordId,
    classificationId: d.classificationId,
    classificationName: d.classificationName,
    subClassificationId: d.subClassificationId,
    subClassificationName: d.subClassificationName,
    status: d.status
  }))
  fs.writeFileSync('output/massUpdates.json', JSON.stringify(massUpdates, null, 2))


  //write out a unique list of classification and sub classification
  const uniqueData = Array.from(new Set(allData.map(d => JSON.stringify({
    classificationId: d.classificationId,
    classificationName: d.classificationName,
    subClassificationId: d.subClassificationId,
    subClassificationName: d.subClassificationName
  }))))

  const uniqueObjects = uniqueData.map(d => JSON.parse(d))
  const classificationList = xlsx.utils.json_to_sheet(uniqueObjects, { header: ['classificationId', 'classificationName', 'subClassificationId', 'subClassificationName'] })
  xlsx.writeFileXLSX(xlsx.utils.book_new(classificationList, 'Classification List'), 'output/classificationList.xlsx')

  console.log('Done')

}

function processWorksheetData(data: ItemRow[], sheetName: string) {

  const classifications: Classifications = {
    classificationName: data[0]['Classification Name'] + '',
    classificationId: data[0]['Classification ID'] + '',
    subClassificationName: data[1]['Classification Name'] + '',
    subClassificationId: data[1][`Classification ID`] + ''
  }

  if (!classifications.classificationName || !classifications.classificationId) {
    throw new Error(`Classification name and id are required - Sheet: ${sheetName}`)
  }

  if (!noSubClass.includes(classifications.classificationId)) {
    if (!classifications.subClassificationId || !classifications.subClassificationName) {
      throw new Error(`Subclassification name and id are required - Sheet: ${sheetName}`)
    }
  }

  let groupType: 'master' | 'none' | 'inactivate' = 'none'
  let masterRecord: ItemRecord = {} as ItemRecord

  for (let rowNum = 2; rowNum <= data.length; rowNum++) {
    const record = data[rowNum]

    if (rowNum === data.length || Object.keys(record).length === 0) {
      if (groupType === 'master') {
        masterRecord = updateMasterRecord(masterRecord, allData)
        pushData(masterRecord)
      }
      groupType = 'none'
      masterRecord = {} as ItemRecord
      continue
    }

    const office = record['Office']?.toLocaleUpperCase()
    const status = record['Status']?.toLocaleUpperCase()

    if (office === 'C' && status !== 'DELETE' && groupType === 'none') {
      if (!record['Master Item ID'] || !record['Master Description']) {
        throw new RowError('Master Item ID and Master Description are required for master record', rowNum, sheetName, record)
      }

      groupType = 'master'
      masterRecord.classificationId = classifications.classificationId
      masterRecord.classificationName = classifications.classificationName
      masterRecord.subClassificationId = classifications.subClassificationId
      masterRecord.subClassificationName = classifications.subClassificationName
      masterRecord.recordId = nanoid(8)
      masterRecord.officeId = 'CIVA'
      masterRecord.itemId = record['Master Item ID'] + ''
      masterRecord.itemDescription = record['Master Description'] + ''
      masterRecord.linkedItems = []
      continue
    }

    if (office === 'C' && status === 'DELETE' && groupType === 'none') {
      groupType = 'inactivate'
      continue
    }

    if (groupType === 'none') {
      throw new RowError('Format error in the document', rowNum, sheetName, record)
    }

    const itemRecord: ItemRecord = createItemRecord(office, status, record, classifications, rowNum, sheetName)
    if (groupType === 'master') {
      itemRecord.itemLinkedTo = { recordId: masterRecord.recordId, officeId: masterRecord.officeId }
      masterRecord.linkedItems?.push({ recordId: itemRecord.recordId, officeId: itemRecord.officeId })

      itemRecord.idChanged = itemRecord.itemId !== masterRecord.itemId
      itemRecord.descriptionChanged = itemRecord.itemDescription !== masterRecord.itemDescription
      try {
        itemRecord.descriptionDifference = stringSimilarity(itemRecord.itemDescription, masterRecord.itemDescription) * 100
      } catch (e) {
        console.log(e)
        throw new RowError('Error in string similarity', rowNum, sheetName, record)
      }

    }
    if (groupType === 'inactivate') {
      itemRecord.status = 'inactive'
    }
    pushData(itemRecord)
  }


  function pushData(itemRecord: ItemRecord) {
    allData.push(itemRecord)
    officeData.set(itemRecord.officeId, itemRecord)
  }

}

class RowError extends Error {
  constructor(message: string, public rowNumber: number, public sheet: string, public row: ItemRow | undefined = undefined) {
    super(message)
    this.name = 'RowError'
    this.rowNumber = rowNumber + 2
    this.sheet = sheet
    this.row = row
  }
}

function createItemRecord(office: string, status: string, record: ItemRow, classifications: Classifications, rowNum: number, sheet: string): ItemRecord {
  const itemId = record['Item Id'] + ''
  const officeId = OfficeMap.get(office)

  if (!officeId) throw new RowError(`Office ID is not valid - RowOffice: ${record['Office']} officeId: ${officeId}`, rowNum, sheet, record)
  if (!itemId) throw new RowError('Item ID is required', rowNum, sheet, record)

  return {
    recordId: itemRecordId(officeId, itemId),
    officeId,
    classificationId: classifications.classificationId,
    classificationName: classifications.classificationName,
    subClassificationId: classifications.subClassificationId,
    subClassificationName: classifications.subClassificationName,
    itemId,
    itemDescription: record['Invoice Item Description'] + '',
    definition: '',
    itemType: record['Service/Inventory'],
    itemTypeDescription: '',
    unitOfMeasure: record['Unit of Measure'],
    unitPrice: record['Unit Price'],
    dispensingFee: record['Dispensing Fee'],
    minimumPrice: record['Minimum Price'],
    markUpPercentage: record['Mark Up %'],
    status: status === 'DELETE' ? 'inactive' : 'active'
  }
}

function updateMasterRecord(masterRecord: ItemRecord, allData: ItemRecord[]) {
  const allDataCopy = [...allData].reverse()
  let bestRecord = allDataCopy.reverse().find(d => d.itemLinkedTo?.recordId === masterRecord.recordId && d.officeId === 'EC')
  if (!bestRecord) bestRecord = allDataCopy.find(d => d.itemLinkedTo?.recordId === masterRecord.recordId && d.officeId === 'BH')
  if (!bestRecord) bestRecord = allDataCopy.find(d => d.itemLinkedTo?.recordId === masterRecord.recordId)

  const record = {
    ...bestRecord,
    linkedItems: masterRecord.linkedItems,
    itemLinkedTo: undefined,
    status: 'active',
    recordId: masterRecord.recordId,
    officeId: masterRecord.officeId,
    classificationId: masterRecord.classificationId,
    classificationName: masterRecord.classificationName,
    subClassificationId: masterRecord.subClassificationId,
    subClassificationName: masterRecord.subClassificationName,
    itemId: masterRecord.itemId,
    itemDescription: masterRecord.itemDescription,
    allCaps: masterRecord.itemDescription === masterRecord.itemDescription.toUpperCase()
  } as ItemRecord
  checkDuplicateOffice(record)
  return record
}

function checkDuplicateOffice(itemRecord: ItemRecord) {
  //Find any time the linkedItems has the same office listed more than once. 
  const officeCount = itemRecord?.linkedItems?.reduce((acc, d) => {
    acc[d.officeId] = acc[d.officeId] ? acc[d.officeId] + 1 : 1
    return acc
  }, {} as Record<string, number>)
  if (officeCount) {
    itemRecord.duplicateOffice = !!Object.keys(officeCount).find(k => officeCount[k] > 1)
  } else {
    itemRecord.duplicateOffice = false
  }
}

const itemRecordId = (officeId: string, itemId: string) => `${officeId}-${itemId.replace(/[.#$\/\[\]]/g, '_')}`
const fileName = process.argv[2]
main(fileName)




type ItemId = string
type RecordId = string
type OfficeId = string
type ItemKey = { recordId: RecordId, officeId: OfficeId }

type ItemRecord = {
  recordId: RecordId
  officeId: OfficeId
  classificationId: string
  classificationName: string
  subClassificationId: string
  subClassificationName: string
  itemId: ItemId
  itemDescription: string
  definition: string
  itemType: string
  itemTypeDescription: string
  unitOfMeasure: string
  unitPrice: number | null
  dispensingFee: number | null
  minimumPrice: number | null
  markUpPercentage: number | null
  lastUpdateTimestamp?: Date
  processed?: Date
  classificationMappedTimestamp?: Date | undefined
  linkedItems?: ItemKey[]
  itemLinkedTo?: ItemKey
  status?: 'active' | 'inactive'
  allCaps?: boolean
  idChanged?: boolean
  descriptionChanged?: boolean
  duplicateOffice?: boolean
  descriptionDifference?: number
}

type ItemRow = {
  'Classification Name': string
  'Classification ID': string
  'Master Item ID': string
  'Master Description': string
  'Item Id': string
  'Invoice Item Description': string
  'Service/Inventory': string
  'Status': string
  'Unit of Measure': string
  'Unit Price': number | null
  'Dispensing Fee': number | null
  'Minimum Price': number | null
  'Mark Up %': number | null
  'Office': string
}

type Classifications = {
  classificationName: string
  classificationId: string
  subClassificationName: string
  subClassificationId: string
}