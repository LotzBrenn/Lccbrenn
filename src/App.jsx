import { useState } from 'react'
import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Base from './pages/Base'
import 'bootstrap-icons/font/bootstrap-icons.css'
import About from './pages/About'

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Base />} />
        <Route path='/about' element={<About />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
