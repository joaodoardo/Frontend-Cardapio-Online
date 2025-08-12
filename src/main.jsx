import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from './App.jsx';
import AdmPage from './pages/AdmPage.jsx';
import PedidosStatus from './pages/pedidoStatus.jsx';
import './index.css';

// Define as rotas da aplicação
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />, // A página principal (cardápio)
  },
   {
    path: "/adm",
    element: <AdmPage />, // A página de administração
  },
  {
    path: "/pedidos",
    element: <PedidosStatus />, // A página de pedidos
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
