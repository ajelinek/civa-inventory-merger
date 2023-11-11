import { useEffect, useState } from "react"
import { useModal } from "../../hooks/searchParams"
import { AlertMessage } from "../AlertMessage"
import s from './importModel.module.css'
import { useFileImport } from "../../store"
import ImportMetaDisplay from "../ImportMetaDisplay"
import { PiWarningDiamondBold } from "react-icons/pi"



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

  function processCsv(e?: React.FormEvent<HTMLFormElement>) {
    console.log('🚀 ~ processCsv ~ options:', options, confirmed)
    setConfirmed('CONFRMED')
    e?.preventDefault()
    if (!options) return
    if (!options.inventoryFile) return
    if (!options.pricingFile) return

    fileImport.execute({
      inventoryFile: options.inventoryFile,
      pricingFile: options.pricingFile,
      masterCatalog: masterCatalog
    })

    setConfirmed('INITIAL')
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
        <button onClick={() => {
          processCsv()
        }}>I am sure</button>
      </div>
    )
  } else {
    content = (
      <>
        <AlertMessage message={fileImport.error?.message} />
        <form className={s.form} onSubmit={(e) => {
          e.preventDefault()
          setConfirmed('ASK')
        }
        }>
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