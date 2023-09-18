import { insertCatalog } from "../db/dbCatalog"

export function createCatalog(officeId: string, catalog: Catalogs, metadata: OfficeCatalogMetadata) {
  return insertCatalog(officeId, { metadata, ...catalog })
}