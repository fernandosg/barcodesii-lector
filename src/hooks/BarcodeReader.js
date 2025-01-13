import { useEffect, useState } from 'react'
import {
  BarcodeReader,
  StrichSDK,
  PopupScanner
} from '@pixelverse/strichjs-sdk'
import { sdkLicenseKey } from '../scanner-config'
import { useSIICode } from '../contexts/SIICodeContext'

export default function BarcodeReaderHook() {
  const { setSiiCode } = useSIICode()
  const [sdkInitialized, setSdkInitialized] = useState(
    StrichSDK.isInitialized()
  )

  const initReadCamera = async () => {
    if (sdkInitialized) {
      let configuration = {
        selector: '.container',
        engine: {
          symbologies: ['pdf417']
        },
        frameSource: {
          // high resolution recommended for PDF417
          resolution: 'full-hd'
        }
      }
      const detections = await PopupScanner.scan(configuration)
      if (detections) {
        alert(detections[0].data)
        setSiiCode(detections[0].data)
      }
    }
  }

  useEffect(() => {
    const initializeSDK = async () => {
      if (StrichSDK.isInitialized()) {
        return
      } else {
        try {
          await StrichSDK.initialize(sdkLicenseKey())
          setSdkInitialized(true)
        } catch (e) {
          console.error(`Failed to initialize STRICH SDK: ${e}`)
        }
      }
    }

    // run async initialization
    if (!sdkInitialized) {
      initializeSDK()
    }
  }, [sdkInitialized])

  return { initReadCamera }
}
