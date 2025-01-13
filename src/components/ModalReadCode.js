import React from 'react'
import { Modal } from '@mui/material'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import { useSIICode } from '../contexts/SIICodeContext'
import BarcodeReaderHook from '../hooks/BarcodeReader'

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 800,
  height: '80vh',
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4
}

export default function ModalReadCode({ open, setOpen }) {
  const { siiCode } = useSIICode()
  const barcodeReader = BarcodeReaderHook()
  const { initReadCamera } = barcodeReader || {}
  const handleReadCode = () => {
    initReadCamera()
  }

  const handleClose = () => {
    setOpen(false)
  }

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <Button variant="contained" onClick={handleReadCode}>
          Leer código SII
        </Button>
        <Typography id="modal-modal-description" variant="body1" component="p">
          Sii code:{siiCode}
        </Typography>
        <Button variant="contained" onClick={handleClose}>
          Cerrar lectura
        </Button>
        <div id="scanner" sx={{ width: '70%', height: '70vh' }}></div>
        <div className="actions"></div>
      </Box>
    </Modal>
  )
}
