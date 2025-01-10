import React from 'react'

import '../dynamsoft.config'
import { CameraEnhancer, CameraView } from 'dynamsoft-camera-enhancer'
import { CaptureVisionRouter } from 'dynamsoft-capture-vision-router'
import { MultiFrameResultCrossFilter } from 'dynamsoft-utility'
import { useSIICode } from '../contexts/SIICodeContext'

export default function DynamsoftReader() {
  const [cameraViewElement, setCameraViewElement] = React.useState(null)
  const { setSiiCode } = useSIICode()

  const cameraEnhancer = React.useRef(null)
  const cvRouter = React.useRef(null)
  let filter = null

  const stopScanning = async () => {
    if (cvRouter.current) {
      await cvRouter.current.stopCapturing()
    }
    if (cameraEnhancer.current) {
      await cameraEnhancer.current.close()
    }
  }

  const enableCamera = async () => {
    try {
      const cameraView = await CameraView.createInstance()
      cameraEnhancer.current = await CameraEnhancer.createInstance(cameraView)
      setCameraViewElement(cameraView.getUIElement())

      cvRouter.current = await CaptureVisionRouter.createInstance(cameraView)
      cvRouter.current.setInput(cameraEnhancer.current)
      let _resultText = ''
      cvRouter.current.addResultReceiver({
        onDecodedBarcodesReceived: async (result) => {
          if (!result.barcodeResultItems.length) return

          _resultText = ''
          console.log(result)
          for (let item of result.barcodeResultItems) {
            _resultText += `${item.formatString}: ${item.text}\n\n`
          }
          setSiiCode(_resultText)

          // Stop scanning after detecting a code
          if (_resultText.length > 0) {
            await stopScanning()
          }
        }
      })
      filter = new MultiFrameResultCrossFilter()
      filter.enableResultCrossVerification('barcode', true)
      filter.enableResultDeduplication('barcode', true)
      cvRouter.current.addResultFilter(filter)
      await cameraEnhancer.current.open()
      cameraView.setScanLaserVisible(true)

      cvRouter.current.startCapturing('ReadSingleBarcode')
    } catch (ex) {
      let errMsg = ex.message || ex
      console.error(errMsg)
    }
  }

  return { cameraViewElement, enableCamera, stopScanning }
}
