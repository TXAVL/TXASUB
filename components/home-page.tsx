"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/components/auth-provider"
import { fetchSubscriptions, type Subscription } from "@/lib/auth"
import { CalendarView } from "@/components/calendar-view"
import { StatsCards } from "@/components/stats-cards"
import { UpcomingExpirations } from "@/components/upcoming-expirations"
import { SubscriptionModal } from "@/components/subscription-modal"
import { ExportManager } from "@/components/export-manager"
import { ExpirationNotifications } from "@/components/expiration-notifications"
import { Dashboard } from "@/components/dashboard"
import { toast } from "@/lib/toast"
import { Plus } from "lucide-react"

export function HomePage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([])
  const [loadingSubscriptions, setLoadingSubscriptions] = useState(false)
  const [showModal, setShowModal] = useState(false)

  // Xử lý thông báo verified từ URL
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const verified = urlParams.get('verified')
    
    if (verified === 'true') {
      toast.success('Email đã được xác thực thành công! Chào mừng bạn đến với Subscription Manager!')
      // Xóa parameter khỏi URL
      window.history.replaceState({}, document.title, window.location.pathname)
    }
  }, [])

  useEffect(() => {
    if (user) {
      loadSubscriptions()
    }
  }, [user])

  // Chỉ hiển thị dashboard khi user đã login
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!user) {
    return null // Không hiển thị gì, để HeroSection và FeatureCards hiển thị
  }

  const loadSubscriptions = async () => {
    try {
      setLoadingSubscriptions(true)
      const data = await fetchSubscriptions()
      setSubscriptions(data)
    } catch (error) {
      toast.error("Không thể tải danh sách gói đăng ký")
    } finally {
      setLoadingSubscriptions(false)
    }
  }

  const handleSubscriptionUpdate = () => {
    loadSubscriptions()
    setShowModal(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="text-3xl font-bold">Chào mừng đến với ứng dụng quản lý gói đăng ký!</CardTitle>
              <CardDescription className="text-lg">Đăng nhập để quản lý gói của bạn.</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild size="lg">
                <a href="/auth">Đăng nhập ngay</a>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">{"Dashboard"}</h1>
            <p className="text-muted-foreground mt-2">{"Quản lý gói đăng ký của bạn"}</p>
          </div>
          <Button onClick={() => setShowModal(true)} className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            {"Thêm gói đăng ký"}
          </Button>
        </div>

        {loadingSubscriptions ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="space-y-8">
            <ExpirationNotifications subscriptions={subscriptions} />
            
            {/* Dashboard with Charts */}
            <Dashboard />

            <StatsCards subscriptions={subscriptions} />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <CalendarView subscriptions={subscriptions} />
              <UpcomingExpirations subscriptions={subscriptions} onUpdate={loadSubscriptions} />
            </div>

            {subscriptions.length > 0 && <ExportManager subscriptions={subscriptions} />}
          </div>
        )}

        {showModal && <SubscriptionModal onClose={() => setShowModal(false)} onSuccess={handleSubscriptionUpdate} />}
      </div>
    </>
  )
}
