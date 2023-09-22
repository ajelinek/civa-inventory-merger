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

export function useOfficeSearchParams() {
  const [searchParams, setSearchParams] = useSearchParams()
  const selectedOffices = searchParams.getAll('office')

  function toggleOffice(office: string) {
    const offices = searchParams.getAll('office')
    if (offices.includes(office)) {
      setSearchParams(prev => {
        prev.delete('office', office)
        return prev
      }, { replace: true })
    } else {
      setSearchParams(prev => {
        prev.append('office', office)
        return prev
      }, { replace: true })
    }
  }

  return { selectedOffices, toggleOffice }
}



