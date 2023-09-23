type FirebaseUser = import('firebase/auth').User

interface Store {
  user: FirebaseUser | null | undefined
  org: Org | undefined
  subClassifications: SubClassifications | undefined
  catalog: Catalogs | undefined //all of the data from the database
  catalogSearcher: CatalogSearcher | undefined //the searcher that is used to search the catalog
  catalogLastUpdateTimestamp: Date | undefined
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
}
type ItemKey = { itemId: ItemId, officeId: OfficeId }




interface CatalogQuery {
  officeIds?: string[]
  classificationIds?: string[]
  subClassificationIds?: string[]
  keyWords?: string[]
  searchText?: string
  includeMapped?: boolean
  includeLinked?: boolean
  classificationNames?: string[]
  subClassificationNames?: string[]
}

interface SearcherSearchMessage {
  type: 'search'
  payload: EnhancedCatalogQuery
}

interface SearcherLoadMessage {
  type: 'load'
  payload: Catalogs
}

interface SearcherLoadMessageReturn {
  type: 'loaded'
}

type SearcherMessage = SearcherSearchMessage | SearcherLoadMessage

interface UseSearchCatalogReturn {
  status: SearchStatus
  result: CatalogQueryResult | undefined
  page: ItemRecord[] | undefined
}


