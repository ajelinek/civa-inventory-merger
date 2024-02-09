import { FaFileImport, FaPlus } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'
import { useModal } from '../../hooks/searchParams'
import s from './catalogActionBar.module.css'
import { ExportData } from '../Export'

export default function CatalogActionBar() {
  const nav = useNavigate()
  const { showModel } = useModal()

  return (
    <div className={s.container}>
      <h3>Inventory Items</h3>
      <div className={s.buttons}>
        <button onClick={() => nav(`/item/new`)}>
          <FaPlus /> New Item
        </button>
        <button onClick={() => showModel('import')}>
          <FaFileImport />
          Import
        </button>
        <ExportData />
      </div>
    </div>
  )
}