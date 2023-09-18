import { create } from 'zustand'
import { wrap } from 'comlink'
import { devtools } from 'zustand/middleware'
import Worker from '../store/workers/worker?worker'

const worker = new Worker()
export const storeWorker = wrap<StoreWorker>(worker)
storeWorker.initializeApp()

worker.onmessage = (event) => {
  console.log(event)
}

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

export function initializeApplication() {
  storeWorker.initializeApp()
}

export * from './hooks/auth'
export * from './hooks/catalog'
export * from './hooks/items'
export * from './hooks/org'