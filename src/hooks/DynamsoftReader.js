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

  React.useEffect(() => {
    enableCamera()
  }, [])

  const enableCamera = () => {
    try {
      const cameraView = cameraView.createInstance()
      cameraEnhancer = CameraEnhancer.createInstance(cameraView)
      //document
      //  .querySelector('#camera-view-container')
      //  .append(cameraView.getUIElement()) // Get default UI and append it to DOM.
      setCameraViewElement(cameraView.getUIElement())

      cvRouter = CaptureVisionRouter.createInstance(cameraView) // ESTO INICIAILMENTE NO TENÍA ARGUMENTO
      cvRouter.setInput(cameraEnhancer)

      // Definir un callback para los resultados.
      cvRouter.addResultReceiver({
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

      // Filtrar resultados no verificados y duplicados.
      filter = new MultiFrameResultCrossFilter()
      filter.enableResultCrossVerification('barcode', true) // Filtrar códigos de barras no verificados.
      filter.enableResultDeduplication('barcode', true) // Filtrar códigos de barras duplicados dentro de 3 segundos.
      cvRouter.addResultFilter(filter)
      // ----

      // Abrir la cámara y comenzar a escanear un solo código de barras.
      cameraEnhancer.open()
      cameraView.setScanLaserVisible(true)

      cvRouter.startCapturing('ReadSingleBarcode')
    } catch (ex) {
      let errMsg = ex.message || ex
      console.error(errMsg)
      //alert(errMsg)
    }
  }

  return { cameraViewElement }
}
