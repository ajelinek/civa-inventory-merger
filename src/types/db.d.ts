interface RealDbSchema {
  org: Org
  catalogs: Catalogs
  prevId: {
    [OfficeId]: {
      [itemId]: string
    }
  }
  catalogHistory: {
    [OfficeId]: {
      metadata: OfficeCatalogMetadata
      [itemId]: ItemRecord
    }
  }
}
type itemId = string
interface Catalogs {
  [OfficeId]: {
    metadata: OfficeCatalogMetadata
    [itemId]: ItemRecord
  }
}

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

type OfficeId = 'VC' |
  'LS' |
  'EC' |
  'BH' |
  'WV' |
  'MC' |
  'CIVA'

interface OfficeCatalogMetadata {
  lastImportDate: Date
  numberOfItemsImported: number
  numberOfItemsUpdated: number
  numberOfItemsIgnored: number
  updatedBy: string
}

interface ItemRecord {
  recordId: string //officeId-itemId
  officeId: OfficeAbbreviation
  classificationId: string
  classificationName: string
  subClassificationId: string
  subClassificationName: string
  itemId: string
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
  classificationMappedTimestamp?: Date
  itemLinkedTimestamp?: Date
}

interface UpdateClassificationInput {
  classificationId: string
  classificationName: string
  subClassificationId?: string
  subClassificationName?: string
  items: ItemRecord[]
}

type CreateItemRecordInput = Pick<ItemRecord,
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