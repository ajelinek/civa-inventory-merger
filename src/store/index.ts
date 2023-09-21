import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

console.log('In Store')
const initialState: Store = {
  user: undefined, //undefined means it has not been checked yet
  org: {
    offices: undefined,
    classifications: undefined,
  },
  catalogLastUpdateTimestamp: undefined,
  catalog: undefined,
  catalogSearcher: undefined,
}


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

