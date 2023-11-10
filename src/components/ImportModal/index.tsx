import { useEffect, useState } from "react"
import { useModal } from "../../hooks/searchParams"
import { AlertMessage } from "../AlertMessage"
import s from './importModel.module.css'
import { useFileImport } from "../../store"



export default function ImportModel() {
  const { modal, closeModel } = useModal()
  const fileImport = useFileImport()
  const [options, setOptions] = useState<Partial<importFileOptions>>()
  const [masterCatalog, setMasterCatalog] = useState(false)

  function handleFileSelection(event: React.ChangeEvent<HTMLInputElement>) {
    if (event.target.files && event.target.files.length > 0) {
      setOptions({
        ...options,
        [event.target.id]: event.target.files[0] as File
      })
    }
  }

  function processCsv(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!options) return
    if (!options.inventoryFile) return
    if (!options.pricingFile) return

    fileImport.execute({
      inventoryFile: options.inventoryFile,
      pricingFile: options.pricingFile,
      masterCatalog: masterCatalog
    })
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
        <form className={s.form} onSubmit={processCsv}>
          <fieldset>
            <label htmlFor="inventoryFile">Inventory File</label>
            <input type="file" id="inventoryFile" accept=".csv" onChange={handleFileSelection} />
          </fieldset>
          <fieldset>
            <label htmlFor="pricingFile">Pricing File</label>
            <input type="file" id="pricingFile" accept=".csv" onChange={handleFileSelection} />
          </fieldset>
          <fieldset>
            <label htmlFor="masterCatalog">Master Catalog</label>
            <input type="checkbox" id="masterCatalog" checked={masterCatalog} onChange={e => setMasterCatalog(e.target.checked)} />
          </fieldset>
          <button type='submit' aria-busy={fileImport.loading} disabled={!options}>Process File</button>
        </form>
        <p className={s.warning}>If you upload the same office file again, your updates and mappings for that office will be lost.</p>
      </article>
    </dialog>
  )
}