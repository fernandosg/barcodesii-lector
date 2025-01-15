import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import {
  Camera,
  CameraSwitchControl,
  configure,
  DataCaptureContext,
  DataCaptureView,
  FrameSourceState
} from '@scandit/web-datacapture-core'

import {
  BarcodeCapture,
  barcodeCaptureLoader,
  BarcodeCaptureOverlay,
  BarcodeCaptureSettings,
  Symbology
} from '@scandit/web-datacapture-barcode'

export function createSDKFacade() {
  let context
  let view
  let settings
  let barcodeCapture
  let overlay
  let host
  let cameraSwitchControl
  let camera

  function createHostElementIfNeeded() {
    if (!host) {
      host = document.createElement('div')
      host.style.display = 'none'
      host.style.width = '100%'
      host.style.height = '100%'
      document.body.append(host)
    }
    return host
  }

  return {
    async initialize() {
      try {
        await configure({
          libraryLocation: new URL(
            'library/engine',
            document.baseURI
          ).toString(),
          licenseKey: '-- ENTER YOUR SCANDIT LICENSE KEY HERE --',
          moduleLoaders: [barcodeCaptureLoader()]
        })
      } catch (error) {
        const handledError = error
        let errorMessage = handledError.toString()
        if (handledError.name === 'NoLicenseKeyError') {
          errorMessage = `
          NoLicenseKeyError:

          Make sure SCANDIT_LICENSE_KEY is available in your environment, by either:
          - running \`SCANDIT_LICENSE_KEY=<YOUR_LICENSE_KEY> npm run build\`
          - placing your license key in a \`.env\` file at the root of the sample directory
          — or by inserting your license key into \`sdk.js\`, replacing the placeholder \`-- ENTER YOUR SCANDIT LICENSE KEY HERE --\` with the key.
        `
        }
        console.error(error)
        alert(errorMessage)
      }

      context = await DataCaptureContext.create()
      settings = new BarcodeCaptureSettings()
      settings.enableSymbologies([Symbology.PDF417])

      view = await DataCaptureView.forContext(context)
      view.connectToElement(createHostElementIfNeeded())

      cameraSwitchControl = new CameraSwitchControl()
      view.addControl(cameraSwitchControl)

      barcodeCapture = await BarcodeCapture.forContext(context, settings)
      await barcodeCapture.setEnabled(false)

      overlay = await BarcodeCaptureOverlay.withBarcodeCaptureForView(
        barcodeCapture,
        view
      )
      await view.addOverlay(overlay)

      camera = Camera.default
      await camera.applySettings(BarcodeCapture.recommendedCameraSettings)
      await context.setFrameSource(camera)
    },
    async cleanup() {
      await context?.frameSource?.switchToDesiredState(FrameSourceState.Off)
      await context?.dispose()
      await context?.removeAllModes()
      if (overlay) {
        await overlay.setViewfinder(null)
        await view?.removeOverlay(overlay)
      }
      if (cameraSwitchControl) {
        view?.removeControl(cameraSwitchControl)
        cameraSwitchControl = undefined
      }
      view?.detachFromElement()
      barcodeCapture = undefined
      context = undefined
      view = undefined
      settings = undefined
      camera = undefined
      host?.remove()
      host = undefined
    },
    connectToElement(element) {
      host = createHostElementIfNeeded()
      host.style.display = 'block'
      element.append(host)
    },
    detachFromElement() {
      if (host) {
        host.style.display = 'none'
        document.body.append(host)
      }
    },
    async enableCamera(enabled) {
      if (context?.frameSource) {
        await context.frameSource.switchToDesiredState(
          enabled ? FrameSourceState.On : FrameSourceState.Off
        )
      }
    },
    async enableScanning(enabled) {
      await barcodeCapture?.setEnabled(enabled)
    },
    async enableSymbology(symbology, enabled) {
      settings.enableSymbology(symbology, enabled)
      await barcodeCapture?.applySettings(settings)
    },
    addBarcodeCaptureListener(listener) {
      barcodeCapture?.addListener(listener)
    },
    removeBarcodeCaptureListener(listener) {
      barcodeCapture?.removeListener(listener)
    },
    getEnabledSymbologies() {
      return settings.enabledSymbologies
    }
  }
}

export const SDKContext = createContext({
  loaded: false,
  loading: false,
  sdk: null
})

export default function SDKProvider({ children }) {
  const [loaded, setLoaded] = useState(false)
  const [loading, setLoading] = useState(false)
  const sdk = useMemo(() => createSDKFacade(), [])

  const providerValue = useMemo(
    () => ({ loading, loaded, sdk }),
    [loading, loaded, sdk]
  )

  useEffect(() => {
    async function start() {
      setLoading(true)
      await sdk.initialize()
      setLoading(false)
      setLoaded(true)
      await sdk.enableCamera(true)
    }
    void start()
    return () => {
      void sdk.cleanup()
    }
  }, [sdk])

  return (
    <SDKContext.Provider value={providerValue}>{children}</SDKContext.Provider>
  )
}

export function useSDK() {
  const value = useContext(SDKContext)
  if (value.sdk === null) {
    throw new Error(
      'Sdk facade is null. Did you forget to wrap the component with SDKProvider?'
    )
  }
  return value
}
