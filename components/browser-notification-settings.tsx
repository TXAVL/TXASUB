"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Bell, CheckCircle, XCircle, AlertTriangle } from "lucide-react"
import { toast } from "@/lib/toast"

export function BrowserNotificationSettings() {
  const [permission, setPermission] = useState<NotificationPermission>("default")
  const [isSupported, setIsSupported] = useState(false)

  useEffect(() => {
    checkSupport()
    checkPermission()
  }, [])

  const checkSupport = () => {
    setIsSupported("Notification" in window)
  }

  const checkPermission = () => {
    if (isSupported) {
      setPermission(Notification.permission)
    }
  }

  const requestPermission = async () => {
    if (!isSupported) {
      toast.error("Trình duyệt của bạn không hỗ trợ thông báo")
      return
    }

    try {
      const result = await Notification.requestPermission()
      setPermission(result)
      
      if (result === "granted") {
        toast.success("Đã cấp quyền thông báo trình duyệt!")
        // Test notification
        new Notification("Thông báo test", {
          body: "Bạn đã cấp quyền thông báo thành công!",
          icon: "/favicon.ico"
        })
      } else if (result === "denied") {
        toast.error("Thông báo bị từ chối. Vui lòng cấp quyền trong cài đặt trình duyệt")
      }
    } catch (error) {
      console.error("Error requesting notification permission:", error)
      toast.error("Có lỗi xảy ra khi cấp quyền thông báo")
    }
  }

  const testNotification = () => {
    if (permission === "granted") {
      new Notification("Test thông báo", {
        body: "Đây là thông báo test từ Subscription Manager",
        icon: "/favicon.ico",
        tag: "test-notification"
      })
      toast.success("Đã gửi thông báo test!")
    } else {
      toast.error("Cần cấp quyền thông báo trước")
    }
  }

  if (!isSupported) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-3">
            <Bell className="h-6 w-6 text-gray-400" />
            <div>
              <CardTitle>Thông báo trình duyệt</CardTitle>
              <CardDescription>
                Trình duyệt của bạn không hỗ trợ thông báo
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 text-amber-600">
            <AlertTriangle className="h-4 w-4" />
            <span className="text-sm">Trình duyệt không hỗ trợ thông báo</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center space-x-3">
          <Bell className="h-6 w-6 text-blue-600" />
          <div>
            <CardTitle>Thông báo trình duyệt</CardTitle>
            <CardDescription>
              Nhận thông báo trực tiếp từ trình duyệt về subscription
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <span className="font-medium">Trạng thái quyền</span>
                <Badge variant={
                  permission === "granted" ? "default" : 
                  permission === "denied" ? "destructive" : "secondary"
                }>
                  {permission === "granted" ? "Đã cấp quyền" : 
                   permission === "denied" ? "Bị từ chối" : "Chưa cấp quyền"}
                </Badge>
              </div>
              <p className="text-sm text-gray-600">
                {permission === "granted" 
                  ? "Bạn sẽ nhận thông báo về subscription hết hạn" 
                  : permission === "denied"
                  ? "Thông báo bị từ chối. Vui lòng cấp quyền trong cài đặt trình duyệt"
                  : "Cấp quyền để nhận thông báo từ trình duyệt"
                }
              </p>
            </div>
            <div className="flex items-center space-x-2">
              {permission === "granted" ? (
                <CheckCircle className="h-5 w-5 text-green-500" />
              ) : permission === "denied" ? (
                <XCircle className="h-5 w-5 text-red-500" />
              ) : (
                <AlertTriangle className="h-5 w-5 text-yellow-500" />
              )}
            </div>
          </div>

          <div className="flex space-x-3">
            {permission !== "granted" && (
              <Button onClick={requestPermission}>
                {permission === "denied" ? "Cấp quyền lại" : "Cấp quyền thông báo"}
              </Button>
            )}
            {permission === "granted" && (
              <Button onClick={testNotification} variant="outline">
                Test thông báo
              </Button>
            )}
          </div>

          {permission === "denied" && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <XCircle className="h-5 w-5 text-red-500 mt-0.5" />
                <div>
                  <h4 className="font-medium text-red-800">Thông báo bị từ chối</h4>
                  <p className="text-sm text-red-700 mt-1">
                    Để bật lại thông báo, hãy:
                  </p>
                  <ul className="text-sm text-red-700 mt-2 space-y-1">
                    <li>• Click vào biểu tượng khóa/cài đặt trong thanh địa chỉ</li>
                    <li>• Chọn "Cho phép" cho thông báo</li>
                    <li>• Hoặc vào Cài đặt → Quyền riêng tư → Thông báo</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}