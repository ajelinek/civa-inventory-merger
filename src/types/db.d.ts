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
  itemTypes: ItemTypes | undefined
}

type ItemTypeId = 'I' | 'S' | 'G' | 'D' | 'U'
type ItemTypes = Record<ItemTypeId, ItemTypeRecord>
interface ItemTypeRecord {
  name: string
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
  'CIVA'

interface OfficeCatalogMetadata {
  lastImportDate: Date
  inventoryItemsImported: number
  pricingItemsImported: number
  matchedPricingItems: number
  unmatchedPricingItems: string[]
  erroredPricingItems: string[]
  multiplePricingInfoItems: string[]
  numberOfItemsLinkedToMaster: number
}

interface PriceRecordRaw {
  itemId: ItemId
  eval_key: string //JSON
}

type PriceRecord = {
  itemId: ItemId
  unitPrice: number
  markUpPercentage: number
}

interface ItemRecordCore {
  officeId: OfficeId
  classificationId: string
  classificationName: string
  subClassificationId: string
  subClassificationName: string
  itemId: ItemId
  itemDescription: string
  definition: string
  itemType: ItemTypeId
  itemTypeDescription: string
  unitOfMeasure: string
  unitPrice: number | null
  dispensingFee: number | null
  minimumPrice: number | null
  markUpPercentage: number | null
}

interface ItemRecord extends ItemRecordCore {
  recordId: RecordId
  lastUpdateTimestamp?: Date
  processed?: Date
  classificationMappedTimestamp?: Date | undefined
  linkedItems?: ItemKey[]
  itemLinkedTo?: ItemKey
  status?: 'active' | 'inactive'

}
type ItemRecordWithLinkedItemTotals = ItemRecord & LinkItemTotals | undefined

interface UpdateClassificationInput {
  classificationId: string
  classificationName: string
  subClassificationId?: string
  subClassificationName?: string
  items: ItemKeys[]
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
  'itemTypeDescription' |
  'minimumPrice' |
  'markUpPercentage' |
  'status' |
  'unitPrice' |
  'dispensingFee' |
  'linkedItems'
>

interface LinkItemTotals {
  maxUnitPrice: number
  minUnitPrice: number
  avgUnitPrice: number
  unitPriceVariance: number
  maxDispensingFee: number
  minDispensingFee: number
  avgDispensingFee: number
  dispensingFeeVariance: number
  maxMarkupPercentage: number
  minMarkupPercentage: number
  avgMarkupPercentage: number
  unitPrices: number[]
  dispensingFees: number[]
  markupPercentages: number[]
  officeIds: OfficeId[]
}