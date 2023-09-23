import { useSearchParams } from 'react-router-dom'

type Modal = 'import' | 'add' | null
export function useModal() {
  const [searchParams, setSearchParams] = useSearchParams()
  const modal: Modal = searchParams.get('modal') as Modal

  function showModel(model: 'import' | 'add') {
    setSearchParams(prev => {
      prev.set('modal', model)
      return prev
    }, { replace: true })
  };

  function closeModel() {
    setSearchParams(prev => {
      prev.delete('modal')
      return prev
    }, { replace: true })
  }

  return { modal, showModel, closeModel }
}

type SelectParams = 'o' | 'c' | 'sc' | 'kw'
export function useSearchParamsListToggle(param: SelectParams) {
  const [searchParams, setSearchParams] = useSearchParams()
  const values = searchParams.getAll(param)

  function toggle(value: string) {
    if (isSelected(value)) {
      setSearchParams(prev => {
        prev.delete(param, value)
        return prev
      }, { replace: true })
      return false
    }

    setSearchParams(prev => {
      prev.append(param, value)
      return prev
    }, { replace: true })
    return true
  }

  function isSelected(value: string) {
    return values.includes(value)
  }

  function removeAll() {
    setSearchParams(prev => {
      prev.delete(param)
      return prev
    }, { replace: true })
  }

  function addAll(values: string[]) {
    setSearchParams(prev => {
      prev.delete(param)
      values.forEach(value => prev.append(param, value))
      return prev
    }, { replace: true })
  }

  function add(value: string) {
    setSearchParams(prev => {
      prev.append(param, value)
      return prev
    }, { replace: true })
  }

  return {
    values, toggle, isSelected, removeAll, addAll, add
  }
}

type SearchParams = 'o' | 'c' | 'sc' | 'st' | 'exm' | 'exl' | 'mc' | 'msc'
export function useSearchParam(param: SearchParams) {
  const [searchParams, setSearchParams] = useSearchParams()
  const value = searchParams.get(param)

  function setValue(value: string) {
    setSearchParams(prev => {
      prev.set(param, value)
      return prev
    }, { replace: true })
  }

  function remove() {
    setSearchParams(prev => {
      prev.delete(param)
      return prev
    }, { replace: true })
  }

  return { value, setValue, remove }
}

