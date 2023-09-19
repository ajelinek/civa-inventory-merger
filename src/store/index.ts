import { create } from 'zustand'
import { wrap, proxy } from 'comlink'
import { devtools } from 'zustand/middleware'
import Worker from '../store/workers/worker?worker'
import dayjs, { Dayjs } from 'dayjs'

const worker = new Worker()
export const storeWorker = wrap<StoreWorker>(worker)
// storeWorker.initializeApplication(proxy(catalogListener))

// function catalogListener(time: Date) {
//   console.log('catalogListener', time)
// }

const initialState: Store = {
  user: undefined, //undefined means it has not been checked yet
  org: {
    offices: undefined,
    classifications: undefined,
  },
  searchOptions: {
    office: undefined,
    classification: undefined,
    subClassification: undefined,
    item: undefined,
  },
  catalogLastUpdateTimestamp: undefined,
  catalog: undefined,
  catalogSearcher: undefined,
  storeWorker
} as Store


export const useStore = create<Store>()(
  devtools(() => ({ ...initialState }))
)

export function resetState() {
  useStore.setState({ ...initialState })
}

export * from './hooks/auth'
export * from './hooks/catalog'
export * from './hooks/items'
export * from './hooks/org'