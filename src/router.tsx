import { createBrowserRouter } from "react-router-dom"
import Root from "./pages/Root"
import ErrorPage from "./pages/ErrorPage"
import Home from "./pages/Home"
import Catalog from "./pages/Catalog"
import Mapper from "./pages/Mapper"
import CatalogViewer from "./pages/CatalogViewer"
import LinkerPage from "./pages/Linker"
import ItemPage from "./pages/Item"
import NewItemPage from "./pages/NewItem"
import PasswordReset from "./pages/PasswordReset"
import AdminPage from "./pages/Admin"

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        element: <Catalog />,
        children: [
          {
            path: "admin",
            element: <AdminPage />
          },
          {
            path: "catalogs",
            element: <CatalogViewer />
          },
          {
            path: "mapper",
            element: <Mapper />,
          },
          {
            path: "linker",
            element: <LinkerPage />,
          },
          {
            path: "item/new",
            element: <NewItemPage />,
          },
          {
            path: "item/:recordId/:officeId",
            element: <ItemPage />,
          },
        ],
      },
      {
        path: "resetPassword*",
        element: <PasswordReset />,
      }
    ],
  }
])