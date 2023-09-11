import { createBrowserRouter } from "react-router-dom"
import Root from "./pages/Root"
import ErrorPage from "./pages/ErrorPage"
import Home from "./pages/Home"
import Catalog from "./pages/Catalog"
import Mapper from "./pages/Mapper"

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <Home /> },
      {
        path: "/catalogs",
        element: <Catalog />,
      },
      {
        path: "/mapper",
        element: <Mapper />,
      },
    ],
  },
])