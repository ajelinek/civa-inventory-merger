import { useEffect, useState } from "react"
import { useModal } from "../../hooks/searchParams"
import { AlertMessage } from "../AlertMessage"
import s from './importModel.module.css'
import { useFileImport } from "../../store"



export default function ImportModel() {
  const { modal, closeModel } = useModal()
  const fileImport = useFileImport()
  console.log("🚀 ~ file: index.tsx:12 ~ ImportModel ~ fileImport:", fileImport)
  const [file, setFile] = useState<File | null>(null)

  function handleFileSelection(event: React.ChangeEvent<HTMLInputElement>) {
    if (event.target.files && event.target.files.length > 0) {
      setFile(event.target.files[0])
    }
  }

  function processCsv(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!file) return
    fileImport.execute(file)
  }

  useEffect(() => {
    if (fileImport.result && !fileImport.error && !fileImport.loading) {
      closeModel()
      //TODO:Auto select office in the url
    }
  }, [fileImport.result])

  return (
    <dialog open={modal === 'import'}>
      <article>
        <header>
          <a className="close" onClick={closeModel} />
          Import
        </header>
        <AlertMessage message={fileImport.error?.message} />
        <form onSubmit={processCsv}>
          <input type="file" id="file" accept=".csv" onChange={handleFileSelection} />
          <button type='submit' aria-busy={fileImport.loading} disabled={!file}>Process File</button>
        </form>
        <p className={s.warning}>If you upload the same office file again, your updates and mappings for that office will be lost.</p>
      </article>
    </dialog>
  )
}