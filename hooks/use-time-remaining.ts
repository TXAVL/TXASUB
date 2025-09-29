import { useState, useEffect } from 'react'
import { parseISO, differenceInDays, differenceInHours, differenceInMinutes, differenceInSeconds } from 'date-fns'

export interface TimeRemaining {
  days: number
  hours: number
  minutes: number
  seconds: number
  totalDays: number
  isExpired: boolean
  isExpiringSoon: boolean
  isCritical: boolean
}

export function useTimeRemaining(expiryDate: string): TimeRemaining {
  const [timeRemaining, setTimeRemaining] = useState<TimeRemaining>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    totalDays: 0,
    isExpired: false,
    isExpiringSoon: false,
    isCritical: false
  })

  useEffect(() => {
    const calculateTimeRemaining = () => {
      const now = new Date()
      const expiry = parseISO(expiryDate)
      
      const totalDays = differenceInDays(expiry, now)
      const isExpired = totalDays < 0
      const isExpiringSoon = totalDays <= 30 && totalDays >= 0
      const isCritical = totalDays <= 2 && totalDays >= 0

      if (isExpired) {
        setTimeRemaining({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
          totalDays: 0,
          isExpired: true,
          isExpiringSoon: false,
          isCritical: false
        })
        return
      }

      const hours = differenceInHours(expiry, now) % 24
      const minutes = differenceInMinutes(expiry, now) % 60
      const seconds = differenceInSeconds(expiry, now) % 60

      setTimeRemaining({
        days: totalDays,
        hours,
        minutes,
        seconds,
        totalDays,
        isExpired: false,
        isExpiringSoon,
        isCritical
      })
    }

    // Tính toán ngay lập tức
    calculateTimeRemaining()

    // Cập nhật mỗi giây nếu đang trong giai đoạn critical (< 2 ngày)
    const interval = setInterval(calculateTimeRemaining, 1000)

    return () => clearInterval(interval)
  }, [expiryDate])

  return timeRemaining
}