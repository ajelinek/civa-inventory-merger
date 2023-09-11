import { doc, setDoc } from "firebase/firestore"
import { db } from "../firebase"

export function createNewOfficeCatalog(catalog: dbCatalog, office: OfficeAbbreviation) {
  return setDoc(doc(db, 'catalogs', office), catalog)
}