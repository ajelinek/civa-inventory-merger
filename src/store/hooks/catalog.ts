import { useAsync, useAsyncCallback } from "react-async-hook"
import { storeWorker, useStore } from ".."

export function useFileImport() {
  const email = useStore.getState().user?.email ?? 'unknown'
  return useAsyncCallback(async (file: File) => {
    const answer = await storeWorker.processImportFile(file, email)
    console.log("🚀 ~ file: catalog.ts:9 ~ returnuseAsyncCallback ~ answer:", answer)
  })
}

export function useSearchCatalog() {
  return useAsync(async () => {
    return []
  }, [])
}

