// import { StrictMode } from 'react'
import React from "react";
// import ReactDOM from "react-dom/client";
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { AppProvider } from "./context/GlobalContext.tsx"; 

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
  <AppProvider>
    <App />
  </AppProvider>
  
</React.StrictMode>,
)
