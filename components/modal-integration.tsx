"use client"



import { useModalContext } from './modal-provider'

// Component để tích hợp TXA Modal vào React app
export function ModalIntegration() {
  
  const { isLoaded } = useModalContext()
  
  // Component này không cần render gì, chỉ để đảm bảo modal được load
  return null
}

// Hook để sử dụng TXA Modal trong React components
export function useTXAModal() {
  const showConfirm = async (message: string, title?: string) => {
    if (typeof window !== 'undefined' && window.txaModal) {
      return await window.txaModal.confirm(message, title)
    }
    return false
  }

  const showAlert = async (message: string, title?: string) => {
    if (typeof window !== 'undefined' && window.txaModal) {
      return await window.txaModal.alert(message, title)
    }
  }

  const showWarning = async (message: string, title?: string) => {
    if (typeof window !== 'undefined' && window.txaModal) {
      return await window.txaModal.warning(message, title)
    }
    return false
  }

  const showDanger = async (message: string, title?: string) => {
    if (typeof window !== 'undefined' && window.txaModal) {
      return await window.txaModal.danger(message, title)
    }
    return false
  }

  const showSuccess = async (message: string, title?: string) => {
    if (typeof window !== 'undefined' && window.txaModal) {
      return await window.txaModal.success(message, title)
    }
  }

  const showCustom = async (options: {
    title: string
    message: string
    subtitle?: string
    type?: 'warning' | 'danger' | 'info' | 'success'
    icon?: string
    confirmText?: string
    cancelText?: string | null
    allowOverlayClose?: boolean
    showProgress?: boolean
    async?: () => Promise<any>
  }) => {
    if (typeof window !== 'undefined' && window.txaModal) {
      return await window.txaModal.show(options)
    }
    return false
  }

  const showAsync = async (
    message: string,
    title: string,
    asyncFunction: () => Promise<any>
  ) => {
    if (typeof window !== 'undefined' && window.txaModal) {
      return await window.txaModal.confirmAsync(message, title, asyncFunction)
    }
    return false
  }

  const showProgress = (message: string, title?: string) => {
    if (typeof window !== 'undefined' && window.txaModal) {
      return window.txaModal.progress(message, title)
    }
  }

  const hide = () => {
    if (typeof window !== 'undefined' && window.txaModal) {
      window.txaModal.hide()
    }
  }

  return {
    showConfirm,
    showAlert,
    showWarning,
    showDanger,
    showSuccess,
    showCustom,
    showAsync,
    showProgress,
    hide
  }
}

// Global type declarations
declare global {
  interface Window {
    txaModal: {
      confirm: (message: string, title?: string) => Promise<boolean>
      alert: (message: string, title?: string) => Promise<void>
      warning: (message: string, title?: string) => Promise<boolean>
      danger: (message: string, title?: string) => Promise<boolean>
      success: (message: string, title?: string) => Promise<void>
      show: (options: any) => Promise<boolean>
      confirmAsync: (message: string, title: string, asyncFunction: () => Promise<any>) => Promise<any>
      progress: (message: string, title?: string) => void
      hide: () => void
    }
  }
}