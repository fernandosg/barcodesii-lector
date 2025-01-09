import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from './components/Home' // Este será tu componente actual de App

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
    </Routes>
  )
}

export default App
