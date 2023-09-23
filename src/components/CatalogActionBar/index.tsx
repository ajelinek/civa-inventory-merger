import { FaEdit, FaFileImport, FaPlus } from 'react-icons/fa'
import { useModal } from '../../hooks/searchParams'
import s from './catalogActionBar.module.css'

export default function CatalogActionBar({ selectedCount }: { selectedCount: number }) {
  const { showModel } = useModal()

  return (
    <div className={s.container}>
      <h3>Inventory Items</h3>
      <div className={s.buttons}>
        <button onClick={() => showModel('add')}>
          {selectedCount > 0 ? <FaEdit /> : <FaPlus />}
          {selectedCount > 0 ? 'Edit' : 'Add'}
        </button>
        <button onClick={() => showModel('import')}>
          <FaFileImport />
          Import
        </button>
      </div>
    </div>
  )
}