"use client"

import { useState, useEffect, useCallback } from "react"
import { X, Bell, AlertTriangle, Info, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

export interface CustomNotificationProps {
  id: string
  type: 'success' | 'warning' | 'error' | 'info'
  title: string
  message: string
  duration?: number // milliseconds, 0 = không tự tắt
  onClose?: () => void
  onAction?: () => void
  actionText?: string
  persistent?: boolean // Không thể đóng
}

export function CustomNotification({
  id,
  type,
  title,
  message,
  duration = 0,
  onClose,
  onAction,
  actionText = "Xem",
  persistent = false
}: CustomNotificationProps) {
  const [isVisible, setIsVisible] = useState(true)
  const [progress, setProgress] = useState(100)

  useEffect(() => {
    if (duration > 0) {
      const interval = setInterval(() => {
        setProgress(prev => {
          const newProgress = prev - (100 / (duration / 100))
          if (newProgress <= 0) {
            // Delay the close to avoid setState during render
            setTimeout(() => {
              setIsVisible(false)
              onClose?.()
            }, 0)
            return 0
          }
          return newProgress
        })
      }, 100)

      return () => clearInterval(interval)
    }
  }, [duration, onClose])

  const handleClose = () => {
    if (!persistent) {
      setIsVisible(false)
      setTimeout(() => onClose?.(), 300) // Delay để animation hoàn thành
    }
  }

  const getIcon = () => {
    switch (type) {
      case 'success': return <CheckCircle className="h-5 w-5 text-green-500" />
      case 'warning': return <AlertTriangle className="h-5 w-5 text-yellow-500" />
      case 'error': return <AlertTriangle className="h-5 w-5 text-red-500" />
      case 'info': return <Info className="h-5 w-5 text-blue-500" />
      default: return <Bell className="h-5 w-5 text-gray-500" />
    }
  }

  const getColors = () => {
    switch (type) {
      case 'success': return 'bg-green-50 border-green-200 text-green-900'
      case 'warning': return 'bg-yellow-50 border-yellow-200 text-yellow-900'
      case 'error': return 'bg-red-50 border-red-200 text-red-900'
      case 'info': return 'bg-blue-50 border-blue-200 text-blue-900'
      default: return 'bg-gray-50 border-gray-200 text-gray-900'
    }
  }

  if (!isVisible) return null

  return (
    <div 
      className={`
        fixed top-4 right-4 z-50 max-w-sm w-full
        border rounded-lg shadow-lg p-4
        transform transition-all duration-300 ease-in-out
        ${getColors()}
        ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}
        hover:shadow-xl
        ${persistent ? 'notification-pulse' : ''}
      `}
      style={{ animation: 'slideInRight 0.3s ease-out' }}
    >
      {/* Progress bar */}
      {duration > 0 && (
        <div className="absolute top-0 left-0 right-0 h-1 bg-black/10 rounded-t-lg overflow-hidden">
          <div 
            className="h-full bg-current transition-all duration-100 ease-linear"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      {/* Header */}
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          {getIcon()}
          <h4 className="font-semibold text-sm">{title}</h4>
        </div>
        {!persistent && (
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            title="Đóng thông báo"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Message */}
      <p className="text-sm mb-3 leading-relaxed">{message}</p>

      {/* Actions */}
      <div className="flex gap-2">
        {onAction && (
          <Button
            size="sm"
            variant="outline"
            onClick={onAction}
            className="text-xs"
          >
            {actionText}
          </Button>
        )}
        {duration > 0 && (
          <div className="text-xs text-gray-500 self-center">
            {Math.ceil((progress / 100) * (duration / 1000))}s
          </div>
        )}
      </div>
    </div>
  )
}

// Notification Manager
export class NotificationManager {
  private static notifications: Map<string, CustomNotificationProps> = new Map()
  private static listeners: Set<(notifications: CustomNotificationProps[]) => void> = new Set()

  static show(notification: Omit<CustomNotificationProps, 'id'>) {
    const id = `notification-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    const fullNotification = { ...notification, id }
    
    this.notifications.set(id, fullNotification)
    this.notifyListeners()
    
    return id
  }

  static dismiss(id: string) {
    this.notifications.delete(id)
    this.notifyListeners()
  }

  static dismissAll() {
    this.notifications.clear()
    this.notifyListeners()
  }

  static subscribe(listener: (notifications: CustomNotificationProps[]) => void) {
    this.listeners.add(listener)
    return () => this.listeners.delete(listener)
  }

  private static notifyListeners() {
    const notifications = Array.from(this.notifications.values())
    // Use setTimeout to avoid setState during render
    setTimeout(() => {
      this.listeners.forEach(listener => listener(notifications))
    }, 0)
  }
}

// Notification Container
export function NotificationContainer() {
  const [notifications, setNotifications] = useState<CustomNotificationProps[]>([])

  const handleNotificationsUpdate = useCallback((newNotifications: CustomNotificationProps[]) => {
    setNotifications(newNotifications)
  }, [])

  useEffect(() => {
    const unsubscribe = NotificationManager.subscribe(handleNotificationsUpdate)
    return () => {
      unsubscribe()
    }
  }, [handleNotificationsUpdate])

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {notifications.map(notification => (
        <CustomNotification
          key={notification.id}
          {...notification}
          onClose={() => NotificationManager.dismiss(notification.id)}
        />
      ))}
    </div>
  )
}

// CSS Animation - Only add once
if (typeof window !== 'undefined' && !document.getElementById('custom-notification-styles')) {
  const style = document.createElement('style')
  style.id = 'custom-notification-styles'
  style.textContent = `
    @keyframes slideInRight {
      from {
        transform: translateX(100%);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }
    
    @keyframes slideOutRight {
      from {
        transform: translateX(0);
        opacity: 1;
      }
      to {
        transform: translateX(100%);
        opacity: 0;
      }
    }
    
    @keyframes pulse {
      0%, 100% {
        transform: scale(1);
      }
      50% {
        transform: scale(1.05);
      }
    }
    
    .notification-pulse {
      animation: pulse 2s infinite;
    }
  `
  document.head.appendChild(style)
}