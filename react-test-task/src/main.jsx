import './styles/App.css'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { ListProducts } from './components/ListProducts'
import { DetailsProduct, GlobalProvider } from './components/DetailsProduct'
import { Cart } from './components/Cart'

const router = createBrowserRouter([
  {
    path: "/",
    element: <ListProducts />,
  },
  {
    path: "/product/:id",
    element: <DetailsProduct />,
  },
  {
    path: "/cart",
    element: <Cart />,
  }
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <GlobalProvider>
    <RouterProvider router={router} />
  </GlobalProvider>
)