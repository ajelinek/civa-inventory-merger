import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { classifications, offices } from './const'

const initialState: Store = {
  user: undefined, //undefined means it has not been checked yet
  offices: offices,
  classifications: classifications,
} as Store


export const useStore = create<Store>()(
  devtools(() => ({ ...initialState }))
)

export function resetState() {
  useStore.setState({ ...initialState })
}