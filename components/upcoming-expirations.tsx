"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import type { Subscription } from "@/lib/auth"
import { parseISO, format, isAfter, addDays } from "date-fns"
import { vi } from "date-fns/locale"
import { SubscriptionModal } from "@/components/subscription-modal"
import { TimeRemainingDisplay } from "@/components/time-remaining-display"
import { RenewalInfoDisplay } from "@/components/renewal-info-display"
import { Settings } from "lucide-react"

interface UpcomingExpirationsProps {
  subscriptions: Subscription[]
  onUpdate: () => void
}

export function UpcomingExpirations({ subscriptions, onUpdate }: UpcomingExpirationsProps) {
    const [editingSubscription, setEditingSubscription] = useState<Subscription | null>(null)

  const upcomingExpirations = subscriptions
    .filter((sub) => {
      const expiryDate = parseISO(sub.expiry)
      const thirtyDaysFromNow = addDays(new Date(), 30)
      return isAfter(thirtyDaysFromNow, expiryDate) && isAfter(expiryDate, new Date())
    })
    .sort((a, b) => parseISO(a.expiry).getTime() - parseISO(b.expiry).getTime())
    .slice(0, 3)

  const handleEdit = (subscription: Subscription) => {
    setEditingSubscription(subscription)
  }

  const handleModalClose = () => {
    setEditingSubscription(null)
  }

  const handleModalSuccess = () => {
    setEditingSubscription(null)
    onUpdate()
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Gói sắp hết hạn</CardTitle>
        </CardHeader>
        <CardContent>
          {upcomingExpirations.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">Không có gói nào sắp hết hạn</p>
          ) : (
            <div className="space-y-4">
              {upcomingExpirations.map((subscription) => {
                const expiryDate = parseISO(subscription.expiry)
                const isExpiringSoon = isAfter(addDays(new Date(), 7), expiryDate)

                return (
                  <div
                    key={subscription.id}
                    className={`p-4 rounded-lg border ${
                      isExpiringSoon ? "border-destructive bg-destructive/10" : "border-border bg-muted/50"
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h4 className="font-semibold">{subscription.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          Hết hạn: {format(expiryDate, "dd/MM/yyyy", { locale: vi })}
                        </p>
                        <div className="mt-2">
                          <TimeRemainingDisplay expiryDate={subscription.expiry} />
                        </div>
                        <div className="mt-2">
                          <RenewalInfoDisplay subscription={subscription} />
                        </div>
                        {subscription.notes && (
                          <p className="text-sm text-muted-foreground mt-1">{subscription.notes}</p>
                        )}
                        <p className="text-sm font-medium mt-2">
                          ${subscription.cost}/{subscription.cycle === "monthly" ? "tháng" : "năm"}
                        </p>
                      </div>
                      <Button variant="ghost" size="sm" onClick={() => handleEdit(subscription)} className="ml-2">
                        <Settings className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {editingSubscription && (
        <SubscriptionModal
          subscription={editingSubscription}
          onClose={handleModalClose}
          onSuccess={handleModalSuccess}
        />
      )}
    </>
  )
}
