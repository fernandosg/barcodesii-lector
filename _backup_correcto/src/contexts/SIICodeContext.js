import React from 'react'

const SIICodeContext = React.createContext()

const SIICodeProvider = ({ children }) => {
  const [siiCode, setSiiCode] = React.useState('')

  return (
    <SIICodeContext.Provider value={{ siiCode, setSiiCode }}>
      {children}
    </SIICodeContext.Provider>
  )
}

const useSIICode = () => React.useContext(SIICodeContext)

export { SIICodeProvider, useSIICode }
