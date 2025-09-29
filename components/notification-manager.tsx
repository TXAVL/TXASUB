"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/components/auth-provider"
import { fetchSubscriptions, type Subscription } from "@/lib/auth"
import { NotificationManager as CustomNotificationManager } from "@/components/custom-notification"
import { parseISO, isAfter, differenceInDays } from "date-fns"
import { Button } from "@/components/ui/button"
import { SubscriptionModal } from "@/components/subscription-modal"

export function NotificationManager() {
    const { user } = useAuth()
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([])
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>("default")
  const [editingSubscription, setEditingSubscription] = useState<Subscription | null>(null)
  
  // Toast notification settings
  const [toastSettings, setToastSettings] = useState({
    showExpired: true,
    showExpiring: true,
    showWeekly: true,
    duration: 15000 // 15 seconds default
  })

  useEffect(() => {
    if (user) {
      loadSubscriptions()
      checkNotificationPermission()
    }
  }, [user])

  useEffect(() => {
    if (subscriptions.length > 0) {
      checkExpirations()
    }
  }, [subscriptions])

  const loadSubscriptions = async () => {
    try {
      const data = await fetchSubscriptions()
      setSubscriptions(data)
    } catch (error) {
      console.error("Failed to load subscriptions for notifications")
    }
  }

  const checkNotificationPermission = () => {
    if (typeof window !== 'undefined' && "Notification" in window) {
      setNotificationPermission(Notification.permission)
    }
  }

  const requestNotificationPermission = async () => {
    if (typeof window !== 'undefined' && "Notification" in window) {
      const permission = await Notification.requestPermission()
      setNotificationPermission(permission)
      if (permission === "granted") {
        CustomNotificationManager.show({
          type: 'success',
          title: 'Thông báo đã bật',
          message: 'Đã bật thông báo trình duyệt thành công!',
          duration: 3000
        })
      }
    }
  }

  const sendBrowserNotification = (subscription: Subscription, daysLeft: number) => {
    if (notificationPermission === "granted") {
      const title = daysLeft === 0 ? `Gói ${subscription.name} đã hết hạn!` : `Gói ${subscription.name} sắp hết hạn!`

      const body =
        daysLeft === 0
          ? `Gói ${subscription.name} đã hết hạn hôm nay.`
          : `Gói ${subscription.name} sẽ hết hạn trong ${daysLeft} ngày.`

      new Notification(title, {
        body,
        icon: "/favicon.ico",
        badge: "/favicon.ico",
        tag: `subscription-${subscription.id}`,
        requireInteraction: true,
      })
    }
  }

  const checkExpirations = () => {
    const now = new Date()

    subscriptions.forEach((subscription) => {
      const expiryDate = parseISO(subscription.expiry)
      const daysLeft = differenceInDays(expiryDate, now)

      // Check for expired subscriptions
      if (isAfter(now, expiryDate)) {
        CustomNotificationManager.show({
          type: 'error',
          title: 'Gói đã hết hạn!',
          message: `Gói ${subscription.name} đã hết hạn ngày ${expiryDate.toLocaleDateString("vi-VN")}`,
          duration: 0, // Không tự tắt
          persistent: true, // Không thể đóng
          actionText: 'Quản lý',
          onAction: () => setEditingSubscription(subscription)
        })

        sendBrowserNotification(subscription, 0)
      }
      // Check for subscriptions expiring in 1 day
      else if (daysLeft === 1) {
        CustomNotificationManager.show({
          type: 'warning',
          title: 'Gói sắp hết hạn!',
          message: `Gói ${subscription.name} sẽ hết hạn ngày ${expiryDate.toLocaleDateString("vi-VN")}`,
          duration: toastSettings.duration,
          actionText: 'Quản lý',
          onAction: () => setEditingSubscription(subscription)
        })

        sendBrowserNotification(subscription, 1)
      }
      // Check for subscriptions expiring in 7 days
      else if (daysLeft === 7) {
        CustomNotificationManager.show({
          type: 'info',
          title: 'Gói sắp hết hạn trong 7 ngày',
          message: `Gói ${subscription.name} sẽ hết hạn ngày ${expiryDate.toLocaleDateString("vi-VN")}`,
          duration: toastSettings.duration,
          actionText: 'Quản lý',
          onAction: () => setEditingSubscription(subscription)
        })
      }
    })
  }

  const handleModalClose = () => {
    setEditingSubscription(null)
  }

  const handleModalSuccess = () => {
    setEditingSubscription(null)
    loadSubscriptions()
  }

  const sendTestNotification = () => {
    if (notificationPermission === "granted") {
      new Notification("Test thông báo", {
        body: "Đây là thông báo test để kiểm tra hệ thống thông báo trình duyệt của hệ thống.",
        icon: "/favicon.ico",
        badge: "/favicon.ico",
        tag: "test-notification",
        requireInteraction: true,
      })
      CustomNotificationManager.show({
        type: 'success',
        title: 'Thông báo test',
        message: 'Đã gửi thông báo test thành công!',
        duration: 3000
      })
    }
  }

  return (
    <div className="space-y-6">
      {/* Notification Permission Status */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">Trạng thái thông báo</h3>
            <p className="text-sm text-muted-foreground">
              Quản lý quyền thông báo trình duyệt
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${
              notificationPermission === "granted" ? "bg-green-500" : 
              notificationPermission === "denied" ? "bg-red-500" : "bg-yellow-500"
            }`}></div>
            <span className="text-sm font-medium">
              {notificationPermission === "granted" ? "Đã bật" : 
               notificationPermission === "denied" ? "Đã tắt" : "Chưa xác định"}
            </span>
          </div>
        </div>

        {notificationPermission === "default" && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-semibold text-blue-900 mb-2">Bật thông báo trình duyệt</h4>
            <p className="text-sm text-blue-800 mb-3">
              Nhận thông báo khi gói đăng ký sắp hết hạn để không bỏ lỡ gia hạn quan trọng.
            </p>
            <Button onClick={requestNotificationPermission} className="bg-blue-600 hover:bg-blue-700">
              Bật thông báo
            </Button>
          </div>
        )}

        {notificationPermission === "granted" && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h4 className="font-semibold text-green-900 mb-2">✅ Thông báo đã được bật</h4>
            <p className="text-sm text-green-800">
              Bạn sẽ nhận được thông báo khi gói đăng ký sắp hết hạn.
            </p>
          </div>
        )}

        {notificationPermission === "denied" && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <h4 className="font-semibold text-red-900 mb-2">❌ Thông báo đã bị tắt</h4>
            <p className="text-sm text-red-800 mb-3">
              Để nhận thông báo, bạn cần bật lại quyền thông báo trong trình duyệt.
            </p>
            <Button 
              variant="outline" 
              onClick={() => {
                setNotificationPermission("default")
                checkNotificationPermission()
              }}
            >
              Kiểm tra lại
            </Button>
          </div>
        )}
      </div>

      {/* Subscription List */}
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold">Gói đăng ký ({subscriptions.length})</h3>
          <p className="text-sm text-muted-foreground">
            Danh sách các gói đăng ký sẽ được theo dõi thông báo
          </p>
        </div>

        {subscriptions.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>Chưa có gói đăng ký nào</p>
            <p className="text-sm">Thêm gói đăng ký để nhận thông báo</p>
          </div>
        ) : (
          <div className="grid gap-3">
            {subscriptions.map((subscription) => (
              <div key={subscription.id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h4 className="font-medium">{subscription.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      Hết hạn: {new Date(subscription.expiry).toLocaleDateString('vi-VN')}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{subscription.cost}</p>
                    <p className="text-xs text-muted-foreground">{subscription.cycle}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Toast Settings */}
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold">Cài đặt thông báo</h3>
          <p className="text-sm text-muted-foreground">
            Điều chỉnh thời gian hiển thị thông báo
          </p>
        </div>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Thời gian hiển thị (giây)</label>
            <select 
              value={toastSettings.duration / 1000}
              onChange={(e) => setToastSettings(prev => ({ 
                ...prev, 
                duration: parseInt(e.target.value) * 1000 
              }))}
              className="px-3 py-1 border rounded-md text-sm"
            >
              <option value={5}>5 giây</option>
              <option value={10}>10 giây</option>
              <option value={15}>15 giây</option>
              <option value={30}>30 giây</option>
              <option value={60}>1 phút</option>
              <option value={0}>Không tự tắt</option>
            </select>
          </div>
          
          <div className="text-xs text-muted-foreground">
            Hiện tại: {toastSettings.duration === 0 ? 'Không tự tắt' : `${toastSettings.duration / 1000} giây`}
          </div>
        </div>
      </div>

      {/* Test Notification */}
      {notificationPermission === "granted" && (
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold">Test thông báo</h3>
            <p className="text-sm text-muted-foreground">
              Kiểm tra xem thông báo có hoạt động không
            </p>
          </div>
          <div className="space-y-2">
            <Button 
              variant="outline" 
              onClick={sendTestNotification}
              className="w-full"
            >
              Gửi thông báo test
            </Button>
            <Button 
              variant="outline" 
              onClick={() => {
                CustomNotificationManager.show({
                  type: 'info',
                  title: 'Test Custom Notification',
                  message: `Thời gian hiển thị: ${toastSettings.duration === 0 ? 'Không tự tắt' : `${toastSettings.duration / 1000} giây`}`,
                  duration: toastSettings.duration,
                  actionText: 'OK',
                  onAction: () => console.log('Test notification action clicked')
                })
              }}
              className="w-full"
            >
              Test Custom Notification
            </Button>
          </div>
        </div>
      )}

      {editingSubscription && (
        <SubscriptionModal
          subscription={editingSubscription}
          onClose={handleModalClose}
          onSuccess={handleModalSuccess}
        />
      )}
    </div>
  )
}
