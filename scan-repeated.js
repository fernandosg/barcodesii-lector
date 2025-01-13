/**
 * Import STRICH SDK via ES6 import clause. It is recommended to pin a specific version, especially for
 * business-critical applications.
 */
import {
  StrichSDK,
  BarcodeReader
} from 'https://cdn.jsdelivr.net/npm/@pixelverse/strichjs-sdk@1.6.0'

let theBarcodeReader = null

// data and hooks for popup dialog
let numScanned = 0
const confirmScanDialog = document.getElementById('confirmScanDialog')
document.getElementById('continueScanning').onclick = async () => {
  await theBarcodeReader.start()
  confirmScanDialog.close()
}
document.getElementById('finishScanning').onclick = async () => {
  await theBarcodeReader.destroy()
  window.location.replace('/')
}

function handleCodeDetection(codeDetection) {
  numScanned++
  sessionStorage.setItem('scannedCode', codeDetection.data)
  document.getElementById('numScanned').innerText = numScanned.toString()
  document.getElementById('scannedCode').innerText = codeDetection.data
  confirmScanDialog.showModal()
}

/**
 * Initialize STRICH BarcodeReader and start scanning.
 */
async function initializeBarcodeReader() {
  // see https://docs.strich.io/reference/interfaces/Configuration.html for all available options
  let configuration = {
    selector: '.barcode-scanner',
    frameSource: {
      resolution: 'full-hd'
    },
    engine: {
      symbologies: ['pdf417'],
      duplicateInterval: 1500
    }
  }

  // initialize BarcodeReader and start scanning barcodes
  try {
    const barcodeReader = await new BarcodeReader(configuration).initialize()
    barcodeReader.detected = (detections) => {
      barcodeReader.stop()
      handleCodeDetection(detections[0])
    }
    theBarcodeReader = barcodeReader
    await theBarcodeReader.start()
  } catch (err) {
    window.alert(
      `Failed to initialize BarcodeReader: ${err.message} ${err.detailMessage}`
    )
  }
}

/**
 * Handle initialization error. All exceptions thrown by the SDK are of type SdkError:
 * https://docs.strich.io/reference/classes/SdkError.html
 *
 * This is just for illustration, in a production app you would not be using window.alert().
 */
function handleInitializationError(err) {
  let message = err.message
  if (err.detailMessage) {
    // some errors contain additional details in the detailMessage property
    message += '\n' + err.detailMessage
  }
  window.alert(`Initialization failed: ${message}`)
}

// Initialize STRICH SDK and BarcodeReader
const licenseKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIyMmI3ZGE1ZC0zY2I2LTQ1NDgtYTIwZi1kNzkyNmNlNDNiZjciLCJpc3MiOiJzdHJpY2guaW8iLCJhdWQiOlsiaHR0cHM6Ly9yYWlscy1wcm9kdWN0aW9uLTBmZjQudXAucmFpbHdheS5hcHAiLCJodHRwczovL2Zlcm5hbmRvc2cuZ2l0aHViLmlvL2JhcmNvZGVzaWktbGVjdG9yIl0sImlhdCI6MTczNjc5MTg1OCwibmJmIjoxNzM2NzkxODU4LCJjYXBhYmlsaXRpZXMiOnt9LCJ2ZXJzaW9uIjoxfQ.zW_RQOVsv02Tg6ijmFvltneV5mhs7DeofoifHK5swFg'
try {
  await StrichSDK.initialize(licenseKey)
  await initializeBarcodeReader()
} catch (err) {
  handleInitializationError(err)
}
