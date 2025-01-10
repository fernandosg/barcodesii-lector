import React from 'react'
import logo from '../logo.svg'
import '../App.css'
import { Button } from '@mui/material'
import ModalReadCode from './ModalReadCode'
import { SIICodeProvider } from '../contexts/SIICodeContext'

function Home() {
  const [open, setOpen] = React.useState(false)

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <Button variant="contained" onClick={() => setOpen(true)}>
          Read Code
        </Button>
      </header>
      <SIICodeProvider>
        <ModalReadCode open={open} setOpen={setOpen} />
      </SIICodeProvider>
    </div>
  )
}

export default Home
