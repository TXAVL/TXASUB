"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { Subscription } from "@/lib/auth"
import { parseISO, isAfter, addDays } from "date-fns"
import { AlertTriangle, Clock, X } from "lucide-react"
import { TimeRemainingDisplay } from "@/components/time-remaining-display"

interface ExpirationNotificationsProps {
  subscriptions: Subscription[]
}

export function ExpirationNotifications({ subscriptions }: ExpirationNotificationsProps) {
  
  const [dismissedNotifications, setDismissedNotifications] = useState<Set<string>>(new Set())

  const criticalSubscriptions = subscriptions.filter((sub) => {
    const expiryDate = parseISO(sub.expiry)
    const twoDaysFromNow = addDays(new Date(), 2)
    return isAfter(twoDaysFromNow, expiryDate) && isAfter(expiryDate, new Date())
  })

  const expiringSoonSubscriptions = subscriptions.filter((sub) => {
    const expiryDate = parseISO(sub.expiry)
    const thirtyDaysFromNow = addDays(new Date(), 30)
    const twoDaysFromNow = addDays(new Date(), 2)
    return isAfter(thirtyDaysFromNow, expiryDate) && isAfter(expiryDate, twoDaysFromNow)
  })

  const dismissNotification = (subscriptionId: string) => {
    setDismissedNotifications(prev => new Set([...prev, subscriptionId]))
  }

  const visibleCritical = criticalSubscriptions.filter(sub => !dismissedNotifications.has(sub.id))
  const visibleExpiringSoon = expiringSoonSubscriptions.filter(sub => !dismissedNotifications.has(sub.id))

  if (visibleCritical.length === 0 && visibleExpiringSoon.length === 0) {
    return null
  }

  return (
    <div className="space-y-4">
      {/* Critical notifications */}
      {visibleCritical.map((subscription) => (
        <Card key={`critical-${subscription.id}`} className="border-destructive bg-destructive/10">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-destructive">
                <AlertTriangle className="w-5 h-5" />
                Khẩn cấp: {subscription.name}
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => dismissNotification(subscription.id)}
                className="text-destructive hover:text-destructive"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <TimeRemainingDisplay expiryDate={subscription.expiry} />
              <p className="text-sm text-muted-foreground">
                Chi phí: ${subscription.cost}/{subscription.cycle === "monthly" ? "tháng" : "năm"}
              </p>
              {subscription.notes && (
                <p className="text-sm text-muted-foreground">{subscription.notes}</p>
              )}
            </div>
          </CardContent>
        </Card>
      ))}

      {/* Expiring soon notifications */}
      {visibleExpiringSoon.map((subscription) => (
        <Card key={`expiring-${subscription.id}`} className="border-yellow-500 bg-yellow-500/10">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-yellow-600">
                <Clock className="w-5 h-5" />
                Sắp hết hạn: {subscription.name}
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => dismissNotification(subscription.id)}
                className="text-yellow-600 hover:text-yellow-600"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <TimeRemainingDisplay expiryDate={subscription.expiry} />
              <p className="text-sm text-muted-foreground">
                Chi phí: ${subscription.cost}/{subscription.cycle === "monthly" ? "tháng" : "năm"}
              </p>
              {subscription.notes && (
                <p className="text-sm text-muted-foreground">{subscription.notes}</p>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}