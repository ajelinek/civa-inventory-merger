import { useEffect, useState } from "react"
import { useModal } from "../../hooks/searchParams"
import { useStore } from "../../store"
import { officesForSelectInput } from "../../store/selectors/offices"
import { useFileImport } from "../../store/import"
import { AlertMessage } from "../AlertMessage"

export default function ImportModel() {
  const { modal, closeModel } = useModal()
  const fileImport = useFileImport()
  const [file, setFile] = useState<File | null>(null)

  function handleFileSelection(event: React.ChangeEvent<HTMLInputElement>) {
    if (event.target.files && event.target.files.length > 0) {
      setFile(event.target.files[0])
    }
  }

  function processCsv(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    fileImport.execute(file)
  }

  useEffect(() => {
    if (fileImport.result && !fileImport.error && !fileImport.loading) {
      closeModel()
      //Set URL to the correct search params for office. 
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
          <button type='submit' aria-busy={fileImport.loading} >Process File</button>
        </form>
      </article>
    </dialog>
  )
}