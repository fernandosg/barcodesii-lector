import React from 'react'
import { Modal } from '@mui/material'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import { useSIICode } from '../contexts/SIICodeContext'
import DynamsoftReader from '../hooks/DynamsoftReader'

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
  const { cameraViewElement, enableCamera } = DynamsoftReader()
  const handleOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  const handleCopySIICode = () => {
    navigator.clipboard.writeText('SII')
    handleClose()
  }

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <Typography id="modal-modal-title" variant="h6" component="h2">
          Leer código QR
        </Typography>
        <Typography id="modal-modal-description" variant="body1" component="p">
          Sii code:{siiCode}
        </Typography>
        <Button variant="contained" onClick={enableCamera}>
          Habilitar cámara
        </Button>
        <Button variant="contained" onClick={handleCopySIICode}>
          Copiar código SII
        </Button>
        <Button variant="contained" onClick={handleClose}>
          Cerrar lectura
        </Button>
        <div id="camera-view-container" sx={{ width: '70%', height: '70vh' }}>
          {cameraViewElement && (
            <div
              ref={(node) => {
                if (node && !node.hasChildNodes()) {
                  node.appendChild(cameraViewElement)
                }
              }}
            />
          )}
        </div>
      </Box>
    </Modal>
  )
}
