import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

const initialState: Store = {
  user: undefined //undefined means it has not been checked yet
} as Store


export const useStore = create<Store>()(
  devtools(() => ({ ...initialState }))
)

export function resetState() {
  useStore.setState({ ...initialState })
}