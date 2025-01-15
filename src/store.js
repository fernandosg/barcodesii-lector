import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { useSDK } from './sdk'

export const StoreContext = createContext({
  barcode: undefined,
  keepCameraOn: true,
  symbologies: {},
  setBarcode: () => {},
  setKeepCameraOn: () => {},
  setSymbologies: () => {}
})

export function StoreProvider({ children }) {
  const { sdk, loaded } = useSDK()
  const [barcode, setBarcode] = useState(undefined)
  const [keepCameraOn, setKeepCameraOn] = useState(true)
  const [symbologies, setSymbologies] = useState({})

  useEffect(() => {
    if (loaded) {
      const enabledSymbologyEntries = sdk
        .getEnabledSymbologies()
        ?.map((symbology) => [symbology, true])
      if (enabledSymbologyEntries) {
        const enabledSymbologies = Object.fromEntries(enabledSymbologyEntries)
        setSymbologies(enabledSymbologies)
      }
    }
  }, [loaded, sdk])

  return (
    <StoreContext.Provider
      value={useMemo(
        () => ({
          barcode,
          setBarcode,
          keepCameraOn,
          setKeepCameraOn,
          symbologies,
          setSymbologies
        }),
        [barcode, keepCameraOn, symbologies]
      )}
    >
      {children}
    </StoreContext.Provider>
  )
}

export function useStore() {
  return useContext(StoreContext)
}
