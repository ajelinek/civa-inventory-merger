import { Outlet } from "react-router-dom"
import { useInitializeCatalog, useOrgSettings } from "../../store"

export default function CatalogViewer() {
  const catalogInitialize = useInitializeCatalog()
  const org = useOrgSettings()

  if (catalogInitialize.loading || org.loading) return <div aria-busy={true}></div>

  return (
    <Outlet />
  )

}