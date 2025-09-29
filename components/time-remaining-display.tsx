"use client"

import { useTimeRemaining } from "@/hooks/use-time-remaining"
import { Badge } from "@/components/ui/badge"

import { AlertTriangle, Clock } from "lucide-react"

interface TimeRemainingDisplayProps {
  expiryDate: string
  className?: string
}

export function TimeRemainingDisplay({ expiryDate, className = "" }: TimeRemainingDisplayProps) {
  
  const timeRemaining = useTimeRemaining(expiryDate)

  if (timeRemaining.isExpired) {
    return (
      <Badge variant="destructive" className={`flex items-center gap-1 ${className}`}>
        <AlertTriangle className="w-3 h-3" />
        Đã hết hạn
      </Badge>
    )
  }

  if (timeRemaining.isCritical) {
    // Hiển thị countdown real-time nếu < 2 ngày
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <Clock className="w-4 h-4 text-red-500" />
        <div className="text-sm font-mono text-red-500">
          {String(timeRemaining.hours).padStart(2, '0')}:
          {String(timeRemaining.minutes).padStart(2, '0')}:
          {String(timeRemaining.seconds).padStart(2, '0')}
        </div>
        <Badge variant="destructive" className="text-xs">
          {timeRemaining.days === 0 ? 'Hôm nay' : `${timeRemaining.days} ngày`}
        </Badge>
      </div>
    )
  }

  if (timeRemaining.isExpiringSoon) {
    // Hiển thị số ngày còn lại nếu < 30 ngày
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <Clock className="w-4 h-4 text-yellow-500" />
        <div className="text-sm">
          Còn {timeRemaining.totalDays} ngày
        </div>
        <Badge variant="outline" className="text-xs border-yellow-500 text-yellow-500">
          Sắp hết hạn
        </Badge>
      </div>
    )
  }

  // Nếu > 30 ngày, không hiển thị gì đặc biệt
  return null
}