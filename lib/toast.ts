// Toast helper - thay thế react-toastify
import { NotificationManager } from "@/components/custom-notification"

export const toast = {
  success: (message: string, options?: any) => {
    return NotificationManager.show({
      type: 'success',
      title: 'Thành công',
      message,
      duration: options?.autoClose || 3000,
      ...options
    })
  },
  
  error: (message: string, options?: any) => {
    return NotificationManager.show({
      type: 'error',
      title: 'Lỗi',
      message,
      duration: options?.autoClose || 5000,
      ...options
    })
  },
  
  warning: (message: string, options?: any) => {
    return NotificationManager.show({
      type: 'warning',
      title: 'Cảnh báo',
      message,
      duration: options?.autoClose || 4000,
      ...options
    })
  },
  
  info: (message: string, options?: any) => {
    return NotificationManager.show({
      type: 'info',
      title: 'Thông tin',
      message,
      duration: options?.autoClose || 3000,
      ...options
    })
  },
  
  dismiss: (id: string) => {
    NotificationManager.dismiss(id)
  },
  
  dismissAll: () => {
    NotificationManager.dismissAll()
  }
}