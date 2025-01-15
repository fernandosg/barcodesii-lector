import { useCallback, useEffect, useMemo, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSDK } from '../sdk'
import { useStore } from '../store'

export default function ScannerComponent() {
  const host = useRef(null)
  const { loaded, sdk } = useSDK()
  const { setBarcode, keepCameraOn } = useStore()
  const navigate = useNavigate()

  const shouldKeepCameraOn = useCallback(async () => {
    if (!keepCameraOn) {
      await sdk.enableCamera(false)
    }
  }, [sdk, keepCameraOn])

  const onScan = useMemo(
    () => ({
      didScan: async (_, session) => {
        if (session.newlyRecognizedBarcode) {
          await sdk.enableScanning(false)
          await shouldKeepCameraOn()
          setBarcode(session.newlyRecognizedBarcode)
          navigate('/result')
        }
      }
    }),
    [setBarcode, sdk, navigate, shouldKeepCameraOn]
  )

  useEffect(() => {
    async function onMount() {
      if (loaded && host.current) {
        sdk.connectToElement(host.current)
        await sdk.enableCamera(true)
        await sdk.enableScanning(true)
        sdk.addBarcodeCaptureListener(onScan)
      }
    }

    void onMount()
    return () => {
      if (loaded) {
        sdk.removeBarcodeCaptureListener(onScan)
        sdk.detachFromElement()
      }
    }
  }, [loaded, sdk, onScan])

  return <div ref={host} className="w-full h-full" />
}
