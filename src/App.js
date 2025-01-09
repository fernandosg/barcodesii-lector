import React from 'react'
import { Routes, Route, BrowserRouter as Router } from 'react-router-dom'
import Home from './components/Home' // Este será tu componente actual de App

function App() {
  return (
    <Router basename={process.env.PUBLIC_URL}>
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </Router>
  )
}

export default App
