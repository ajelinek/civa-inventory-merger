interface RealDbSchema {
  org: Org
  catalogs: Catalogs
  prevId: {
    [officeId: OfficeId]: {
      [itemId: string]: string
    }
  }
  catalogHistory: {
    [officeId: OfficeId]: {
      metadata: OfficeCatalogMetadata
      [itemId: string]: ItemRecord
    }
  }
}

interface Catalogs {
  [officeId: OfficeId]: {
    metadata: OfficeCatalogMetadata
    [itemId: string]: ItemRecord
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
interface Classification {
  name: string
  subClassifications?: Record<string, { name: string }>
}

type OfficeId =
  'VC' |
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
  // unitOfMeasure: string
  unitPrice: number
  dispensingFee: number
  minimumPrice: number
  markUpPercentage: number
}