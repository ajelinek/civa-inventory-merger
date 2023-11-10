type FirebaseUser = import('firebase/auth').User

interface Store {
  user: FirebaseUser | null | undefined
  org: Org | undefined
  catalog: Catalogs | undefined //all of the data from the database
  catalogSearcher: CatalogSearcher | undefined //the searcher that is used to search the catalog
  catalogLastUpdateTimestamp: Date | undefined
}

interface importFileOptions {
  masterCatalog: boolean
  inventoryFile: File
  pricingFile: File
}

interface Creds {
  email: string
  password: string
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



interface StoreWorker {
  loadCatalog: (cb: (time: Date) => void) => void
  queryCatalog: (query: CatalogQuery) => CatalogQueryResult
  processImportFile: (file: File, email: string) => OfficeCatalogMetadata
  fetchOrgSettings(cb: (org: Org) => void)
}

interface CatalogQueryResult {
  matchedCatalogs: number
  matchedRecords: number
  keyWords: string[]
  itemKeys: ItemKey[]
  matchedItemKeys?: MatchedItemKeys
}

type MatchedItemKeys = Record<RecordId, ItemKey[]>//Item key per office

interface CatalogQuery {
  searchType?: 'general' | 'comparison'
  comparisonCount?: number
  officeIds?: string[]
  classificationIds?: string[]
  subClassificationIds?: string[]
  keyWords?: string[]
  searchText?: string
  excludeMapped?: boolean
  excludeLinked?: boolean
  classificationNames?: string[]
  subClassificationNames?: string[]
  unitPriceLow?: number
  unitPriceHigh?: number
  dispensingFeeLow?: number
  dispensingFeeHigh?: number
  markUpPercentageLow?: number
  markUpPercentageHigh?: number
}

interface SearcherSearchMessage {
  type: 'search'
  payload: EnhancedCatalogQuery
}

interface SearcherLoadMessage {
  type: 'load'
  payload: {
    catalogs: Catalogs
    offices: Offices
  }
}

interface SearcherLoadMessageReturn {
  type: 'loaded'
}


type SearcherMessage = SearcherSearchMessage | SearcherLoadMessage

interface UseSearchCatalogReturn {
  status: SearchStatus
  result: CatalogQueryResult | undefined
  page: ItemKey[] | undefined
  matchedItemKeys: MatchedItemKeys | undefined
  error: Error | undefined
  comparingText: string | undefined
}


