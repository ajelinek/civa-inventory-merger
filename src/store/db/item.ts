import { doc, setDoc, writeBatch } from "firebase/firestore"
import { db } from "../firebase"
import { offices } from "../const"
import { useAsyncCallback } from "react-async-hook"

export function createNewOfficeCatalog(catalog: dbCatalog, office: OfficeAbbreviation) {
  return setDoc(doc(db, 'catalogs', office), catalog)
}


interface UpdateClassificationInput {
  classificationId: string
  classificationName: string
  subClassificationId?: string
  subClassificationName?: string
  items: ItemRecord[]
}
export function updateClassifications() {
  //Batch Update firestore. only update the specific classifcation and sub classification
  function updateFireStore(updateInput: UpdateClassificationInput) {
    const batch = writeBatch(db)

    //Loop thru the available offices and filter the items that belong to the office.
    Object.keys(offices).forEach((office) => {
      const items = updateInput.items.filter((item) => item.officeAbbreviationId === office)
      if (!items.length) return

      const objects = items.map((item) => {
        return {
          [`${item.itemId}.classificationId`]: updateInput.classificationId,
          [`${item.itemId}.classificationName`]: updateInput.classificationName,
          [`${item.itemId}.subClassificationId`]: updateInput.subClassificationId,
          [`${item.itemId}.subClassificationName`]: updateInput.subClassificationName,
          [`${item.itemId}.mapped`]: Date.now(),
        }
      })

      const updateObject = Object.assign({}, ...objects)
      batch.update(doc(db, 'catalogs', office), updateObject)
    })

    return batch.commit()
  }

  return useAsyncCallback(updateFireStore)
}
