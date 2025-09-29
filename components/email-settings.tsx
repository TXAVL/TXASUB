"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Mail, Bell, AlertTriangle, Calendar, BarChart3 } from "lucide-react"
import { toast } from "@/lib/toast"

interface EmailSettings {
  enabled: boolean
  expiringSoon: boolean
  critical: boolean
  weekly: boolean
  monthly: boolean
}

interface EmailSettingsProps {
  onSettingsChange?: (settings: EmailSettings) => void
}

export function EmailSettings({ onSettingsChange }: EmailSettingsProps) {
    const [settings, setSettings] = useState<EmailSettings>({
    enabled: true,
    expiringSoon: true,
    critical: true,
    weekly: false,
    monthly: false
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    loadSettings()
  }, [])

  const loadSettings = async () => {
    try {
      const response = await fetch('/api/user', {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        }
      })
      if (response.ok) {
        const userData = await response.json()
        const emailSettings = userData.profile?.emailNotifications || {
          enabled: true,
          expiringSoon: true,
          critical: true,
          weekly: false,
          monthly: false
        }
        console.log('Loaded email settings:', emailSettings)
        setSettings(emailSettings)
      } else {
        const error = await response.json()
        console.error('Failed to load user data:', response.status, error)
        // Set default settings if API fails
        setSettings({
          enabled: true,
          expiringSoon: true,
          critical: true,
          weekly: false,
          monthly: false
        })
      }
    } catch (error) {
      console.error('Error loading email settings:', error)
      // Set default settings if request fails
      setSettings({
        enabled: true,
        expiringSoon: true,
        critical: true,
        weekly: false,
        monthly: false
      })
    }
  }

  const saveSettings = async () => {
    try {
      setLoading(true)
      console.log('Saving email settings:', settings)
      
      const response = await fetch('/api/user', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ emailNotifications: settings })
      })
      
      console.log('Save settings response status:', response.status)
      console.log('Save settings response headers:', response.headers)

      if (response.ok) {
        const result = await response.json()
        console.log('Save settings response:', result)
        toast.success('Cài đặt email đã được lưu')
        onSettingsChange?.(settings)
      } else {
        let errorMessage = 'Unknown error'
        try {
          const error = await response.json()
          errorMessage = error.error || error.message || 'Unknown error'
          console.error('Save settings error:', error)
        } catch (parseError) {
          console.error('Failed to parse error response:', parseError)
          errorMessage = `HTTP ${response.status}: ${response.statusText}`
        }
        toast.error(`Không thể lưu cài đặt email: ${errorMessage}`)
      }
    } catch (error) {
      console.error('Error saving email settings:', error)
      toast.error('Lỗi khi lưu cài đặt email')
    } finally {
      setLoading(false)
    }
  }

  const handleSettingChange = (key: keyof EmailSettings, value: boolean) => {
    const newSettings = { ...settings, [key]: value }
    setSettings(newSettings)
  }

  const testEmail = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/notifications/test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include'
      })

      if (response.ok) {
        const result = await response.json()
        console.log('Test email response:', result)
        toast.success('Email test đã được gửi!')
      } else {
        let errorMessage = 'Unknown error'
        try {
          const error = await response.json()
          errorMessage = error.error || error.message || 'Unknown error'
          console.error('Test email error:', error)
        } catch (parseError) {
          console.error('Failed to parse error response:', parseError)
          errorMessage = `HTTP ${response.status}: ${response.statusText}`
        }
        toast.error(`Không thể gửi email test: ${errorMessage}`)
      }
    } catch (error) {
      console.error('Error sending test email:', error)
      toast.error('Lỗi khi gửi email test')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Mail className="h-5 w-5 text-blue-600" />
          <CardTitle>Cài đặt Email Notifications</CardTitle>
        </div>
        <CardDescription>
          Cấu hình các thông báo email bạn muốn nhận về gói đăng ký
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Main toggle */}
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="email-enabled" className="text-base font-medium">
              Bật thông báo email
            </Label>
            <p className="text-sm text-muted-foreground">
              Nhận thông báo qua email về các gói đăng ký
            </p>
          </div>
          <Switch
            id="email-enabled"
            checked={settings.enabled}
            onCheckedChange={(checked) => handleSettingChange('enabled', checked)}
          />
        </div>

        {settings.enabled && (
          <>
            <Separator />
            
            {/* Notification types */}
            <div className="space-y-4">
              <h4 className="text-sm font-medium text-muted-foreground">Loại thông báo</h4>
              
              {/* Expiring Soon */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="h-4 w-4 text-yellow-600" />
                  <div>
                    <Label htmlFor="expiring-soon" className="text-sm font-medium">
                      Sắp hết hạn (3 ngày)
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      Thông báo khi gói sắp hết hạn trong 3 ngày
                    </p>
                  </div>
                </div>
                <Switch
                  id="expiring-soon"
                  checked={settings.expiringSoon}
                  onCheckedChange={(checked) => handleSettingChange('expiringSoon', checked)}
                />
              </div>

              {/* Critical */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Bell className="h-4 w-4 text-red-600" />
                  <div>
                    <Label htmlFor="critical" className="text-sm font-medium">
                      Khẩn cấp (1 ngày)
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      Thông báo khẩn cấp khi gói hết hạn trong 1 ngày
                    </p>
                  </div>
                </div>
                <Switch
                  id="critical"
                  checked={settings.critical}
                  onCheckedChange={(checked) => handleSettingChange('critical', checked)}
                />
              </div>

              {/* Weekly Report */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Calendar className="h-4 w-4 text-blue-600" />
                  <div>
                    <Label htmlFor="weekly" className="text-sm font-medium">
                      Báo cáo tuần
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      Nhận báo cáo tổng quan hàng tuần
                    </p>
                  </div>
                </div>
                <Switch
                  id="weekly"
                  checked={settings.weekly}
                  onCheckedChange={(checked) => handleSettingChange('weekly', checked)}
                />
              </div>

              {/* Monthly Report */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <BarChart3 className="h-4 w-4 text-green-600" />
                  <div>
                    <Label htmlFor="monthly" className="text-sm font-medium">
                      Báo cáo tháng
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      Nhận báo cáo phân tích chi tiết hàng tháng
                    </p>
                  </div>
                </div>
                <Switch
                  id="monthly"
                  checked={settings.monthly}
                  onCheckedChange={(checked) => handleSettingChange('monthly', checked)}
                />
              </div>
            </div>

            <Separator />

            {/* Actions */}
            <div className="flex gap-3">
              <Button 
                onClick={saveSettings} 
                disabled={loading}
                className="flex-1"
              >
                {loading ? 'Đang lưu...' : 'Lưu cài đặt'}
              </Button>
              <Button 
                variant="outline" 
                onClick={testEmail}
                disabled={loading}
              >
                Gửi email test
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}