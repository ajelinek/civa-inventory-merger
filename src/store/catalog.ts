import { collection, onSnapshot, query } from 'firebase/firestore'
import MiniSearch from 'minisearch'
import { useEffect, useState } from 'react'
import { useStore } from '../store'
import { rdb } from './firebase'

export function useAllCatalogsQuery() {
  const [state, setState] = useState({ loading: true, error: null })
  useEffect(() => {
    // const q = query(collection(db, "catalogs"))
    // const unsubscribe = onSnapshot(q, (snapshot) => {
    //   const docs: dbCatalog[] = []
    //   snapshot.forEach((result) => {
    //     const d = result.data() as dbCatalog
    //     docs.push(d)
    //   })

    //   try {
    //     const { catalog, catalogSearcher } = prepareDataForStore(docs)
    //     useStore.setState({ catalog, catalogSearcher })
    //     setState({ loading: false, error: null })
    //   } catch (e) {
    //     //@ts-ignore
    //     setState({ loading: false, error: e?.message })
    //   }
    // })

    // return unsubscribe
  }, [])

  return state
}

function prepareDataForStore(catalogs: dbCatalog[]) {
  // merge the catalogs into a single object
  const catalog = catalogs.reduce((acc, catalog) => {
    acc = { ...acc, ...catalog }
    return acc
  }, {} as dbCatalog)

  //create a new miniseach instance with all the values in the catalog
  const catalogSearcher = new MiniSearch<ItemRecord>({
    idField: 'itemId',
    fields: ['itemId', 'officeAbbreviationId', 'classificationId', 'classificationName', 'subClassificationId', 'subClassificationName', 'itemId', 'itemDescription', 'definition', 'itemType', 'itemTypeDescription', 'mapped'],
    storeFields: ['itemId', 'mapped'],
  })

  catalogSearcher.addAll(Object.values(catalog))
  return { catalog, catalogSearcher }

}