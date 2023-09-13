import { useSearchParams } from 'react-router-dom'

type Modal = 'import' | 'add' | null
export function useModal() {
  const [searchParams, setSearchParams] = useSearchParams()
  const modal: Modal = searchParams.get('modal') as Modal

  function showModel(model: 'import' | 'add') {
    setSearchParams(updateParam('modal', model))
  };

  function closeModel() {
    setSearchParams(removeParam('modal'))
  }

  return { modal, showModel, closeModel }
}

export function useOfficeSearchParams() {
  const [searchParams, setSearchParams] = useSearchParams()
  const selectedOffices = searchParams.getAll('office')

  function toggleOffice(office: string) {
    const offices = searchParams.getAll('office')
    if (offices.includes(office)) {
      setSearchParams(removeParam('office'))
    } else {
      setSearchParams(updateParam('office', office))
    }
  }

  return { selectedOffices, toggleOffice }
}

function updateParam(key: string, value: string) {
  const searchString = new URLSearchParams(window.location.search)
  searchString.set(key, value)
  return searchString
}

function removeParam(key: string) {
  const searchString = new URLSearchParams(window.location.search)
  searchString.delete(key)
  return searchString
}

