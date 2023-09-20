type FirebaseUser = import('firebase/auth').User


interface Store {
  user: FirebaseUser | null | undefined
  org: Org | undefined
  searchOptions: SearchOptions | undefined
  catalog: dbCatalog | undefined //all of the data from the database
  catalogSearcher: unknown | undefined
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
  items: ItemRecord[]
}

interface CatalogQuery {
  classificationId?: string
  subClassificationId?: sting
  autoTokens?: string[]
  searchText?: string
  includeMapped?: boolean
  includeLinked?: boolean
  pageSize?: number
  page?: number
}