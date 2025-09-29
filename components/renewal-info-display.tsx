"use client"

import { Badge } from "@/components/ui/badge"

import { parseISO, addMonths, addYears, format } from "date-fns"
import { vi } from "date-fns/locale"
import { RefreshCw, Calendar, AlertCircle } from "lucide-react"
import type { Subscription } from "@/lib/auth"

interface RenewalInfoDisplayProps {
  subscription: Subscription
  className?: string
}

export function RenewalInfoDisplay({ subscription, className = "" }: RenewalInfoDisplayProps) {
  
  const calculateFinalExpiry = (subscription: Subscription): string | null => {
    if (!subscription.autoRenew || !subscription.finalExpiry) {
      return null
    }
    return subscription.finalExpiry
  }

  const getNextRenewalDate = (subscription: Subscription): string => {
    const currentExpiry = parseISO(subscription.expiry)
    
    if (subscription.cycle === "monthly") {
      return format(addMonths(currentExpiry, 1), "dd/MM/yyyy", { locale: vi })
    } else {
      return format(addYears(currentExpiry, 1), "dd/MM/yyyy", { locale: vi })
    }
  }

  const getRenewalStatus = (subscription: Subscription) => {
    const now = new Date()
    const currentExpiry = parseISO(subscription.expiry)
    const finalExpiry = subscription.finalExpiry ? parseISO(subscription.finalExpiry) : null
    
    // Nếu đã hết hạn
    if (now > currentExpiry) {
      return {
        status: "expired",
        message: "Đã hết hạn",
        color: "destructive" as const
      }
    }
    
    // Nếu có ngày hết hạn cuối và đã hết hạn cuối
    if (finalExpiry && now > finalExpiry) {
      return {
        status: "final_expired",
        message: "Hết hạn cuối cùng",
        color: "destructive" as const
      }
    }
    
    // Nếu có ngày hết hạn cuối và sắp hết hạn cuối (trong 30 ngày)
    if (finalExpiry) {
      const daysUntilFinal = Math.ceil((finalExpiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
      if (daysUntilFinal <= 30) {
        return {
          status: "final_warning",
          message: `Hết hạn cuối trong ${daysUntilFinal} ngày`,
          color: "destructive" as const
        }
      }
    }
    
    // Nếu tự động gia hạn
    if (subscription.autoRenew) {
      return {
        status: "auto_renew",
        message: "Tự động gia hạn",
        color: "default" as const
      }
    }
    
    // Không tự động gia hạn
    return {
      status: "manual",
      message: "Gia hạn thủ công",
      color: "secondary" as const
    }
  }

  const renewalStatus = getRenewalStatus(subscription)
  const nextRenewalDate = getNextRenewalDate(subscription)
  const finalExpiry = calculateFinalExpiry(subscription)

  return (
    <div className={`space-y-2 ${className}`}>
      {/* Trạng thái gia hạn */}
      <div className="flex items-center gap-2">
        <RefreshCw className="w-4 h-4 text-muted-foreground" />
        <Badge variant={renewalStatus.color} className="text-xs">
          {renewalStatus.message}
        </Badge>
      </div>

      {/* Thông tin chi tiết */}
      <div className="space-y-1 text-sm text-muted-foreground">
        {subscription.autoRenew ? (
          <div className="flex items-center gap-2">
            <Calendar className="w-3 h-3" />
            <span>Gia hạn tiếp: {nextRenewalDate}</span>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <AlertCircle className="w-3 h-3" />
            <span>Cần gia hạn thủ công</span>
          </div>
        )}

        {finalExpiry && (
          <div className="flex items-center gap-2">
            <AlertCircle className="w-3 h-3 text-orange-500" />
            <span>Hết hạn cuối: {format(parseISO(finalExpiry), "dd/MM/yyyy", { locale: vi })}</span>
          </div>
        )}

        {subscription.autoRenew && !finalExpiry && (
          <div className="flex items-center gap-2">
            <RefreshCw className="w-3 h-3 text-green-500" />
            <span>Gia hạn vô thời hạn</span>
          </div>
        )}
      </div>
    </div>
  )
}