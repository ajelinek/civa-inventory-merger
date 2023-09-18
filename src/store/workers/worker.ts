import { expose } from 'comlink'
import { onValue, ref } from "firebase/database"
import { rdb } from "../firebase"
import { processAndLoadFile } from '../providers/import'

let catalog: Catalogs = {}
let searcher: unknown = undefined


async function processImportFile(file: File, email: string) {
  const data = await processAndLoadFile(file, email)
  return data
}

async function initializeApplication() {
  console.log("🚀 ~ file: worker.ts:17 ~ initializeApplication ~ catalogRef:")

  const catalogRef = ref(rdb, 'catalogs')
  onValue(catalogRef, (snapshot) => {
    const data = snapshot.val()
    catalog = data as Catalogs
    console.log(data)
  })

  postMessage('data-load')
}

function queryCatalog() {
  console.log('data', catalog)
}

expose({
  initializeApplication,
  processImportFile,
  queryCatalog
})