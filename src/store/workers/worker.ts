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

async function initializeApplication(cb: (time: Date) => void) {
  const catalogRef = ref(rdb, 'catalogs')
  onValue(catalogRef, (snapshot) => {
    const data = snapshot.val()
    catalog = data as Catalogs
    //Setup Searcher
    cb(new Date())
  })
}

function queryCatalog() {
  console.log('data', catalog)
}

expose({
  initializeApplication,
  processImportFile,
  queryCatalog
})