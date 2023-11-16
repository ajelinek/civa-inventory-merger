import { useState } from "react"
import { PiWarningDiamondBold } from "react-icons/pi"
import { useModal } from "../../hooks/searchParams"
import { useFileImport } from "../../store"
import { AlertMessage } from "../AlertMessage"
import ImportMetaDisplay from "../ImportMetaDisplay"
import s from './importModel.module.css'



export default function ImportModel() {
  const { modal, closeModel } = useModal()
  const fileImport = useFileImport()
  const [options, setOptions] = useState<Partial<importFileOptions>>()
  const [masterCatalog, setMasterCatalog] = useState(false)
  const [confirmed, setConfirmed] = useState<'INITIAL' | 'ASK' | 'CONFRMED'>('INITIAL')

  function handleFileSelection(event: React.ChangeEvent<HTMLInputElement>) {
    if (event.target.files && event.target.files.length > 0) {
      setOptions({
        ...options,
        [event.target.id]: event.target.files[0] as File
      })
    }
  }

  async function processCsv(e?: React.FormEvent<HTMLFormElement>) {
    e?.preventDefault()
    setConfirmed('CONFRMED')
    if (!options) return
    if (!options.inventoryFile) return
    // if (!options.pricingFile) return

    await fileImport.execute({
      inventoryFile: options.inventoryFile,
      pricingFile: options.pricingFile,
      masterCatalog: masterCatalog
    })

    setConfirmed('INITIAL')
  }

  function handleProcessCsv(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (masterCatalog) {
      setConfirmed('ASK')
    } else {
      processCsv(e)
    }
  }


  function handleCloseModel() {
    fileImport.reset()
    closeModel()
  }


  let content = null
  if (fileImport.loading) {
    content = (<p>Loading...</p>)
  } else if (fileImport.result?.meta) {
    content = (
      <>
        <ImportMetaDisplay meta={fileImport.result.meta} />
        <button className={s.closeButton} onClick={() => handleCloseModel()}>Close</button>
      </>
    )
  } else if (confirmed === 'ASK') {
    content = (
      <div className={s.confirmContent}>
        <PiWarningDiamondBold className={s.warningIcon} />
        <p>This will overright existing data and can not be undone</p>
        <button className={s.confirmButton} onClick={() => {
          processCsv()
        }}>I AM SURE</button>
        <button onClick={() => setConfirmed('INITIAL')}>Cancel</button>
      </div>
    )
  } else {
    content = (
      <>
        <AlertMessage message={fileImport.error?.message} />
        <form className={s.form} onSubmit={handleProcessCsv}>
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
            <input type="checkbox" role='switch' id="masterCatalog" checked={masterCatalog} onChange={e => setMasterCatalog(e.target.checked)} />
          </fieldset>
          <button type='submit' aria-busy={fileImport.loading} disabled={!options}>Process File</button>
        </form>
      </>
    )
  }

  return (
    <dialog open={modal === 'import'}>
      <article className={s.content}>
        <header>
          <a className="close" onClick={() => handleCloseModel()} />
          Import
        </header>
        {content}
      </article>
    </dialog>
  )
}