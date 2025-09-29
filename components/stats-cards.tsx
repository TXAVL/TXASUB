"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { Subscription } from "@/lib/auth"
import { parseISO, isAfter, addDays } from "date-fns"
import { Package, DollarSign, AlertTriangle } from "lucide-react"

interface StatsCardsProps {
  subscriptions: Subscription[]
}

export function StatsCards({ subscriptions }: StatsCardsProps) {
    const totalSubscriptions = subscriptions.length

  const totalCost = subscriptions.reduce((sum, sub) => {
    const monthlyCost = sub.cycle === "yearly" ? sub.cost / 12 : sub.cost
    return sum + monthlyCost
  }, 0)

  const expiringSoon = subscriptions.filter((sub) => {
    const expiryDate = parseISO(sub.expiry)
    const sevenDaysFromNow = addDays(new Date(), 7)
    return isAfter(sevenDaysFromNow, expiryDate) && isAfter(expiryDate, new Date())
  }).length

  const expiringIn30Days = subscriptions.filter((sub) => {
    const expiryDate = parseISO(sub.expiry)
    const thirtyDaysFromNow = addDays(new Date(), 30)
    return isAfter(thirtyDaysFromNow, expiryDate) && isAfter(expiryDate, new Date())
  }).length

  const criticalExpiring = subscriptions.filter((sub => {
    const expiryDate = parseISO(sub.expiry)
    const twoDaysFromNow = addDays(new Date(), 2)
    return isAfter(twoDaysFromNow, expiryDate) && isAfter(expiryDate, new Date())
  })).length

  const autoRenewSubscriptions = subscriptions.filter(sub => sub.autoRenew).length
  const manualRenewSubscriptions = subscriptions.filter(sub => !sub.autoRenew).length

  return (
    <div className="grid grid-cols-1 md:grid-cols-6 gap-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">{"Tổng số gói"}</CardTitle>
          <Package className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalSubscriptions}</div>
          <p className="text-xs text-muted-foreground">{"Gói đăng ký đang hoạt động"}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">{"Chi phí hàng tháng"}</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${totalCost.toFixed(2)}</div>
          <p className="text-xs text-muted-foreground">{"Tổng chi phí ước tính"}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">{"Sắp hết hạn"}</CardTitle>
          <AlertTriangle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-yellow-500">{expiringIn30Days}</div>
          <p className="text-xs text-muted-foreground">{"Trong 30 ngày tới"}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">{"Khẩn cấp"}</CardTitle>
          <AlertTriangle className="h-4 w-4 text-destructive" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-destructive">{criticalExpiring}</div>
          <p className="text-xs text-muted-foreground">{"Trong 2 ngày tới"}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">{"Tự động gia hạn"}</CardTitle>
          <Package className="h-4 w-4 text-green-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-500">{autoRenewSubscriptions}</div>
          <p className="text-xs text-muted-foreground">{"Gói tự động gia hạn"}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">{"Gia hạn thủ công"}</CardTitle>
          <AlertTriangle className="h-4 w-4 text-orange-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-orange-500">{manualRenewSubscriptions}</div>
          <p className="text-xs text-muted-foreground">{"Cần gia hạn thủ công"}</p>
        </CardContent>
      </Card>
    </div>
  )
}
