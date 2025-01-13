import React from 'react'
import { useSIICode } from '../contexts/SIICodeContext'

export default function StrichReader() {
  const { setSiiCode } = useSIICode()
  const [barcode, setBarcode] = React.useState('')
  const [sdkLoaded, setSdkLoaded] = React.useState(false)
  let barcodeRef = React.useRef(null)

  let config = {
    // the CSS selector identifying the host element
    selector: '#scanner',
    engine: {
      // restrict to the required symbologies
      symbologies: ['pdf417'],
      // filter duplicate results
      duplicateInterval: 2500
    }
  }

  const handleScan = async () => {
    /* eslint-disable-next-line no-undef */
    const sdk = await new strich.StrichSDK()
      .initialize(
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJjMDRmMTI1My1lNWRlLTQzYTEtYTQ0ZC04YTk3YjUxZGQ5NDMiLCJpc3MiOiJzdHJpY2guaW8iLCJhdWQiOlsiaHR0cHM6Ly9naXRodWIuY29tL2Zlcm5hbmRvc2cvYmFyY29kZXNpaS1sZWN0b3IiLCJodHRwczovL2ludmVybWFyLWNoZWNrcG9pbnRzLWM5MjY2YzViMzY3OC5oZXJva3VhcHAuY29tLyJdLCJpYXQiOjE3MzY1NDQzMzksIm5iZiI6MTczNjU0NDMzOSwiY2FwYWJpbGl0aWVzIjp7fSwidmVyc2lvbiI6MX0.JEV1ohwjqpS8GdY8QjICoCHSh68FIXwktIyzOY9maXg'
      )
      .then(() => {
        setSdkLoaded(true)
        initCamera()
      })
    /* eslint-disable-next-line no-undef */
    const barcodeReader = new strich.BarcodeReader(sdk)
    await barcodeReader.start()
    barcodeReader.onBarcodeRead((barcode) => {
      setBarcode(barcode)
    })
  }

  const initCamera = async () => {
    /* eslint-disable-next-line no-undef */
    barcodeRef.current = await strich.BarcodeReader.createBarcodeScanner(
      config,
      document.getElementById('scanner')
    )
    barcodeRef.current
      .initialize()
      .then((result) => {
        // initialization successful, store BarcodeReader for later
        this.barcodeReader = result

        // register handler for code detections
        this.barcodeReader.detected = (detections) => {
          console.log('identifico algo')
          console.dir(detections)
          setSiiCode(detections[0].code)
        }

        // start reading barcodes!
        return this.barcodeReader.start()
      })
      .catch((error) => {
        // initialization failed (error message displayed in BarcodeReader)
      })
  }

  const startScanning = () => {
    handleScan()
  }

  const stopScanning = () => {
    barcodeRef.current.stop()
  }

  return { barcode, handleScan, startScanning, stopScanning }
}
