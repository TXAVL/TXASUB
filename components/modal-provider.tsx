"use client"

import { createContext, useContext, useEffect, useState } from 'react'

interface ModalContextType {
  isLoaded: boolean
}

const ModalContext = createContext<ModalContextType>({ isLoaded: false })

export function ModalProvider({ children }: { children: React.ReactNode }) {
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    // Load TXA Modal script chỉ một lần
    const loadTXAModal = () => {
      if (typeof window !== 'undefined' && !window.txaModal && !document.getElementById('txa-modal-script')) {
        const script = document.createElement('script')
        script.id = 'txa-modal-script'
        script.src = '/js/txa-modal.js'
        script.async = true
        script.onload = () => {
          console.log('TXA Modal loaded successfully')
          setIsLoaded(true)
        }
        script.onerror = () => {
          console.error('Failed to load TXA Modal')
        }
        document.head.appendChild(script)
      } else if (window.txaModal) {
        setIsLoaded(true)
      }
    }

    loadTXAModal()
  }, [])

  return (
    <ModalContext.Provider value={{ isLoaded }}>
      {children}
    </ModalContext.Provider>
  )
}

export function useModalContext() {
  return useContext(ModalContext)
}