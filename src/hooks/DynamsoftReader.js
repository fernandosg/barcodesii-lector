import React from 'react'

import '../dynamsoft.config' // Importar efectos secundarios. La licencia, engineResourcePath, etc.
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

  const enableCamera = async () => {
    try {
      const cameraView = await CameraView.createInstance()
      cameraEnhancer.current = await CameraEnhancer.createInstance(cameraView)
      setCameraViewElement(cameraView.getUIElement())

      cvRouter.current = await CaptureVisionRouter.createInstance(cameraView)
      cvRouter.current.setInput(cameraEnhancer.current)

      cvRouter.current.addResultReceiver({
        onDecodedBarcodesReceived: (result) => {
          if (!result.barcodeResultItems.length) return

          let _resultText = ''
          console.log(result)
          for (let item of result.barcodeResultItems) {
            _resultText += `${item.formatString}: ${item.text}\n\n`
          }
          setSiiCode(_resultText)
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

  return { cameraViewElement, enableCamera }
}
