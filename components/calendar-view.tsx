"use client"

import { useState } from "react"
import Calendar from "react-calendar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { Subscription } from "@/lib/auth"
import { format, parseISO, isSameDay } from "date-fns"
import { vi } from "date-fns/locale"

interface CalendarViewProps {
  subscriptions: Subscription[]
}

export function CalendarView({ subscriptions }: CalendarViewProps) {
    const [selectedDate, setSelectedDate] = useState<Date>(new Date())

  const getExpiryDates = () => {
    return subscriptions.map((sub) => parseISO(sub.expiry))
  }

  const getSubscriptionsForDate = (date: Date) => {
    return subscriptions.filter((sub) => isSameDay(parseISO(sub.expiry), date))
  }

  const tileClassName = ({ date }: { date: Date }) => {
    const hasExpiry = getExpiryDates().some((expiryDate) => isSameDay(expiryDate, date))
    return hasExpiry ? "expiry-date" : ""
  }

  const tileContent = ({ date }: { date: Date }) => {
    const subscriptionsOnDate = getSubscriptionsForDate(date)
    if (subscriptionsOnDate.length > 0) {
      return (
        <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2">
          <div className="w-2 h-2 bg-destructive rounded-full"></div>
        </div>
      )
    }
    return null
  }

  const selectedDateSubscriptions = getSubscriptionsForDate(selectedDate)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Lịch hết hạn</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="calendar-container">
          <Calendar
            onChange={(value) => setSelectedDate(value as Date)}
            value={selectedDate}
            tileClassName={tileClassName}
            tileContent={tileContent}
            locale="vi-VN"
            className="w-full"
          />
        </div>

        {selectedDateSubscriptions.length > 0 && (
          <div className="mt-4">
            <h4 className="font-semibold mb-2">
              Gói hết hạn ngày {format(selectedDate, "dd/MM/yyyy", { locale: vi })}:
            </h4>
            <div className="space-y-2">
              {selectedDateSubscriptions.map((sub) => (
                <div key={sub.id} className="p-3 bg-muted rounded-lg border border-border">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{sub.name}</span>
                    <span className="text-sm text-muted-foreground">
                      ${sub.cost}/{sub.cycle === "monthly" ? "tháng" : "năm"}
                    </span>
                  </div>
                  {sub.notes && <p className="text-sm text-muted-foreground mt-1">{sub.notes}</p>}
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
