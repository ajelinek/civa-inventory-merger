type FirebaseUser = import('firebase/auth').User

type Classification = {
  name: string
  subClassifications?: Record<string, { name: string }>
}
type Classifications = Record<string, Classification>
type Offices = Record<OfficeAbbreviation, string>


interface Store {
  user: FirebaseUser | null | undefined
  classifications: Classifications
  offices: Offices
  catalog: dbCatalog //Represents the actively queried catalog
  catalogSearcher: unknown
}

interface Creds {
  email: string
  password: string
}

type OfficeAbbreviation =
  'VC' |
  'LS' |
  'EC' |
  'BH' |
  'WV' |
  'MC' |
  'CIVA'


type dbCatalog = Record<string, ItemRecord>
interface ItemRecord {
  officeAbbreviationId: OfficeAbbreviation
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
  mapped: number
}

interface ImportRecord {
  allowPriceChange: string
  classificationId: string
  description: string
  subClassificationId: string
  description_1: string
  dispensingFee: string
  invoiceDescription: string
  itemId: string
  description_2: string
  itemType: string
  description_3: string
  locationName: string
  minimumPrice: string
  numberOfDisp: string
  quantityFrom: string
  quantityUnitPrice: string
  revenueId: string
  status: string
}

interface Selector<T> {
  selectItem: (item: T) => void
  onSelect: (e: React.MouseEvent | React.KeyboardEvent | React.ChangeEvent<HTMLInputElement>, item: T) => boolean
  onSelectAll: (items: T[]) => void
  resetState: (items: T[]) => void
  unSelectAll: () => void
  isSelected: (item: T) => boolean
  isAllSelected: (items: T[]) => boolean
  getSelected: () => T[]
  getSelectedIds: () => string[]
  isDirty: boolean
  count: number
  selected: { string: T } | {}
}