import React from 'react'
import { Routes, Route, BrowserRouter } from 'react-router-dom'
import Home from './components/Home'
function App() {
  return (
    <BrowserRouter basename={process.env.PUBLIC_URL}>
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
