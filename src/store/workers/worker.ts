import { expose } from 'comlink'
import { processImportFile } from '../providers/import'
import { loadCatalog, queryCatalog } from '../providers/catalog'
import { fetchOrgSettings } from '../providers/org'

expose({
  loadCatalog,
  processImportFile,
  fetchOrgSettings,
  queryCatalog
})