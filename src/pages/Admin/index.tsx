import { ChangeEvent, useState } from 'react'
import { useMassItemUpdates } from "../../store"
import s from './styles.module.css'

export default function AdminPage() {
  const massItemUpdates = useMassItemUpdates()
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || event.target.files.length === 0) return
    setSelectedFile(event.target.files[0])
  }

  const handleButtonClick = () => {
    if (!selectedFile) return

    const reader = new FileReader()

    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string)
        massItemUpdates.execute(json)
      } catch (error) {
        console.error('Error parsing JSON', error)
      }
    }

    reader.readAsText(selectedFile)
  }

  return (
    <div className="container">
      <h1>Admin</h1>

      <form className={s.form}>
        <h2>Mass Updates - {massItemUpdates.status}</h2>
        <p>{massItemUpdates.error?.message}</p>
        <label>Mass Update jason JSON</label>
        <input type="file" accept=".json" onChange={handleFileChange} />
        <button type='button' aria-busy={massItemUpdates.loading} onClick={handleButtonClick}>Process Items</button>
      </form>
    </div>
  )
}