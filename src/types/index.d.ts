type FirebaseUser = import('firebase/auth').User


interface Store {
  user: FirebaseUser | null | undefined
  org: Org | undefined
  searchOptions: SearchOptions | undefined
  catalog: dbCatalog | undefined //all of the data from the database
  catalogSearcher: unknown | undefined
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


type WorkerActionType =
  'PROCESS_IMPORT_FILE' |
  'INITIALIZE_APPLICATION' |
  'UPDATE_CLASSIFICATIONS' |
  'UPDATE_OFFICES' |
  'QUERY_CATALOG' |
  'UPDATE_ITEM' |
  'REMOVE_TIME' |
  'ADD_ITEM' |
  'UPDATE_ITEMS_CLASSIFICATION'

type ClientActionType =
  'ON_QUERY_RETURN'

interface Action {
  type: ClientActionType | WorkerActionType
  payload?: unknown
}

interface OnAuthStateChangePayload {
  user: FirebaseUser | null
}

interface OnQueryReturnPayload {
  queryName: string,
  items: ItemRecord[]
}


interface StoreWorker {
  initializeApplication: (cb: (time: Dayjs) => void) => void
  queryCatalog: () => ItemRecord[]
  processImportFile: (file: File, email: string) => OfficeCatalogMetadata
}