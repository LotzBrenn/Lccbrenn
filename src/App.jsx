import { useState } from 'react'
import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Base from './pages/Base'
import 'bootstrap-icons/font/bootstrap-icons.css'

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Base />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
