import { nanoid } from 'nanoid'
import { useEffect, useState } from 'react'
import { FaLink, FaPlusCircle, FaToggleOff, FaToggleOn, FaUnlink } from 'react-icons/fa'
import { AlertMessage } from '../../components/AlertMessage'
import CatalogActionBar from '../../components/CatalogActionBar'
import FacetedSearch from '../../components/CatalogFacetSearch'
import ImportModel from '../../components/ImportModal'
import Search from '../../components/Search'
import SearchResults from '../../components/SearchResults'
import useListSelector from '../../hooks/useListSelector'
import { useActivateItems, useCatalogSearchParamQuery, useInactivateItems, useLinkItems, useSearchCatalog, useStore, useUnLinkItems, useUpsertItem } from '../../store'
import { getItem } from '../../store/selectors/item'
import s from './catalogViewer.module.css'

export default function CatalogViewer() {
  const query = useCatalogSearchParamQuery()
  const search = useSearchCatalog(query)
  const selector = useListSelector<ItemKey>([], 'recordId')
  const unlinkItems = useUnLinkItems()
  const inactivateItems = useInactivateItems()
  const activateItems = useActivateItems()
  const linkItems = useLinkItems()
  const upsertItem = useUpsertItem()
  const [message, setMessage] = useState<string | null>('')



  useEffect(() => {
    selector.unSelectAll()
  }, [query])

  useEffect(() => {
    const selected = selector.getSelected()
    if (selected.length > 0) {
      const handleKeyDown = (event: KeyboardEvent) => {
        event.preventDefault()
        if (event.ctrlKey) {
          switch (event.key) {
            case 'l':
              handleLink()
              break
            case 'u':
              handleUnlinkItems()
              break
            case 'a':
              handleActivateItems()
              break
            case 'r':
              handleInactivateItems()
              break
            case 'c':
              handleCreateAndLink()
              break
            default:
              break
          }
        }
      }

      window.addEventListener('keydown', handleKeyDown)

      return () => {
        window.removeEventListener('keydown', handleKeyDown)
      }
    }
  }, [selector.getSelectedIds()])

  function handleLink() {
    setMessage(null)
    const selected = selector.getSelected()
    const officeIds = selected.map(item => item.officeId)
    const uniqueOfficeIds = new Set(officeIds)
    if (officeIds.length !== uniqueOfficeIds.size) {
      setMessage('Can not select multiple items from the same office')
      return
    }

    const linkedToItem = selected.find(item => item.officeId === 'CIVA')
    if (!linkedToItem) {
      setMessage('Must select an item from CIVA')
      return
    }

    linkItems.execute(linkedToItem!, selected.filter(item => item.officeId !== 'CIVA')).then(() => {
      selector.unSelectAll()
    })
  }

  function handleActivateItems() {
    const selected = selector.getSelected()
    activateItems.execute(selected).then(() => {
      selector.unSelectAll()
    })
  }

  function handleInactivateItems() {
    const selected = selector.getSelected()
    inactivateItems.execute(selected).then(() => {
      selector.unSelectAll()
    })
  }

  function handleUnlinkItems() {
    const selected = selector.getSelected()
    const promises: Promise<void>[] = []

    selected.forEach(itemKey => {
      const item = useStore.getState().catalog?.[itemKey.officeId][itemKey.recordId]
      const promise = unlinkItems.execute(item?.itemLinkedTo!, [itemKey])
      promises.push(promise)
    })

    Promise.all(promises).then(() => {
      selector.unSelectAll()
    })
  }

  function handleCreateAndLink() {
    setMessage(null)
    const selected = selector.getSelected()
    const items = selected.map(itemKey => getItem(itemKey, useStore.getState().catalog!))
    const itemIds = items.map(item => item.itemId)
    const uniqueItemIds = new Set(itemIds)

    if (uniqueItemIds.size !== 1) {
      setMessage('Can not select multiple items with different item ids')
      return
    }

    if (items.find(item => item.officeId === 'CIVA')) {
      setMessage('Can not select a CIVA item when creating a new item')
      return
    }

    if (items.find(item => item.status === 'inactive')) {
      setMessage('Can not create from inactive items')
      return
    }

    const civaItem = { ...items[0], officeId: 'CIVA', recordId: nanoid(8) } as CreateItemRecordInput
    upsertItem.execute(civaItem).then(() => {
      linkItems.execute({ officeId: 'CIVA', recordId: civaItem.recordId }, selected).then(() => {
        selector.unSelectAll()
      })
    })
  }

  return (
    <div className={s.container}>
      <ImportModel />
      <section className={s.facets}>
        <FacetedSearch />
      </section>
      <section className={s.catalog}>
        <CatalogActionBar />
        <Search />
        <div className={s.errorMessageContainer}>
          <AlertMessage message={message} cb={() => setMessage('')} />
          <AlertMessage message={upsertItem.error?.message} />
          <AlertMessage message={linkItems.error?.message} />
          <AlertMessage message={unlinkItems.error?.message} />
          <AlertMessage message={activateItems.error?.message} />
          <AlertMessage message={inactivateItems.error?.message} />
        </div>
        <SearchResults search={search} selector={selector} />
        {selector.count > 0 &&
          <div className={s.quickActions}>

            <button aria-busy={linkItems.loading} className={s.linkSubmit} onClick={handleLink}>
              <FaLink />
              Link
            </button>
            <button aria-busy={unlinkItems.loading} className={s.unLinkSubmit} onClick={handleUnlinkItems}>
              <FaUnlink />
              Unlink
            </button>
            <button aria-busy={activateItems.loading} className={s.activateSubmit} onClick={handleActivateItems}>
              <FaToggleOn />
              Activate
            </button>
            <button aria-busy={inactivateItems.loading} className={s.inactivateSubmit} onClick={handleInactivateItems}>
              <FaToggleOff />
              Inactivate
            </button>

            <button aria-busy={upsertItem.loading} className={s.createAndLinkSubmit} onClick={handleCreateAndLink}>
              <FaPlusCircle />
              Create
            </button>
          </div>}
      </section>
    </div>
  )
}