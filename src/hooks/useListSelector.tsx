//@ts-nocheck
import { sort } from "fast-sort"
import { useState, useEffect } from "react"

type SelectMode = 'MULTI' | 'SINGLE' | 'MIXED'

export default function useListSelector<T>(
  preSelected: T[] = [],
  key: string = 'id',
  selectMode: SelectMode = 'MULTI'
): Selector<T> {


  type state = { string: T }
  const [selected, setSelected] = useState<state | {}>(convertPreSelected(preSelected))
  const [initial, setInitial] = useState<state | {}>(convertPreSelected(preSelected))
  const [count, setCount] = useState(preSelected.length)
  const [isDirty, setIsDirty] = useState(false)

  useEffect(() => {
    const initialKeys = Object.keys(initial)
    if (count !== initialKeys.length) return setIsDirty(true)
    const isDirty = JSON.stringify(sort(Object.keys(selected)).asc()) !== JSON.stringify(sort(initialKeys).asc())
    setIsDirty(isDirty)
  }, [selected])

  function convertPreSelected(items) {
    return items.reduce((items, item) => {
      items[item[key]] = item
      return items
    }, {} as state)
  }

  function onSelect(e, item) {
    let tSelected = { ...selected }

    const removed = removeItemFromListIfExists(item, tSelected)

    if (selectMode === 'SINGLE' ||
      (selectMode === 'MIXED' && !(window.matchMedia('(pointer: coarse)').matches || e.ctrlKey || e.shiftKey))) {
      tSelected = {}
    }

    if (!removed) addItemToList(item, tSelected)

    setSelected(tSelected)
    setCount(Object.values(tSelected).length)
    return !removed
  }

  function selectItem(item) {
    let tSelected = { ...selected }
    addItemToList(item, tSelected)
    setSelected(tSelected)
    setCount(Object.values(tSelected).length)
  }

  function resetState(items) {
    setCount(items.length)
    setSelected(convertPreSelected(items))
    setInitial(convertPreSelected(items))
    setIsDirty(false)
  }

  function onSelectAll(items) {
    let tSelected = { ...selected }

    items.forEach(i => {
      const removed = removeItemFromListIfExists(i, tSelected)
      if (!removed) addItemToList(i, tSelected)
    })

    setSelected(tSelected)
    setCount(Object.values(tSelected).length)
  }

  function removeItemFromListIfExists(item, selected) {
    if (!(item[key] in selected)) return false
    delete selected[item[key]]
    setCount(count - 1)
    return true
  }

  function addItemToList(item, selected) {
    selected[item[key]] = item
  }

  function unSelectAll() {
    setSelected({})
    setCount(0)
  }

  function getSelected() {
    return Object.values(selected)
  }

  function getSelectedIds() {
    return Object.keys(selected)
  }

  function isSelected(item) {
    return (item[key] in selected)
  }

  function isAllSelected(items) {
    return (count === items?.length)
  }


  return {
    onSelect,
    isSelected,
    isAllSelected,
    selectItem,
    onSelectAll,
    unSelectAll,
    getSelected,
    getSelectedIds,
    resetState,
    count,
    isDirty,
    selected
  }

}

