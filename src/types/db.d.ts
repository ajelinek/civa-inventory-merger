type ItemId = string
type RecordId = string
type ItemKey = { recordId: RecordId, officeId: OfficeId }

interface RealDbSchema {
  org: Org
  catalogs: Catalogs
}
type Catalogs = Record<OfficeId, Catalog>
type Catalog = Record<RecordId, ItemRecord>

interface Org {
  offices: Offices | undefined
  classifications: Classifications | undefined
}

type Offices = Record<OfficeId, OfficeRecord>
interface OfficeRecord {
  name: string
}

type Classifications = Record<string, Classification>
type SubClassifications = Record<string, { name: string }>
interface Classification {
  name: string
  subClassifications?: SubClassifications
}

type OfficeId =
  'VC' |
  'LS' |
  'EC' |
  'BH' |
  'WV' |
  'MC' |
  'CIVA' |
  ''

interface OfficeCatalogMetadata {
  lastImportDate: Date
  numberOfItemsImported: number
  numberOfItemsUpdated: number
  numberOfItemsIgnored: number
  updatedBy: string
}

interface ItemRecord {
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
  unitPrice: number
  dispensingFee: number
  minimumPrice: number
  markUpPercentage: number
  originalItemId: string //Set on import
  lastUpdateTimestamp?: Date
  classificationMappedTimestamp?: Date | undefined
  itemLinkedTimestamp?: Date | undefined
}

interface UpdateClassificationInput {
  classificationId: string
  classificationName: string
  subClassificationId?: string
  subClassificationName?: string
  items: ItemRecord[]
}

type CreateItemRecordInput = Pick<ItemRecord,
  'recordId' |
  'officeId' |
  'itemId' |
  'itemDescription' |
  'classificationId' |
  'classificationName' |
  'subClassificationId' |
  'subClassificationName' |
  'unitOfMeasure' |
  'itemType' |
  'minimumPrice' |
  'markUpPercentage'
>