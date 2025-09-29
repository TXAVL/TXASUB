"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { Subscription } from "@/lib/auth"
import { parseISO, format, isAfter } from "date-fns"
import { vi } from "date-fns/locale"
import { Edit, Trash2, AlertTriangle } from "lucide-react"
import { TimeRemainingDisplay } from "@/components/time-remaining-display"
import { RenewalInfoDisplay } from "@/components/renewal-info-display"
import { useTXAModal } from "@/components/modal-integration"

interface SubscriptionTableProps {
  subscriptions: Subscription[]
  onEdit: (subscription: Subscription) => void
  onDelete: (id: string) => void
}

export function SubscriptionTable({ subscriptions, onEdit, onDelete }: SubscriptionTableProps) {
    const modal = useTXAModal()

  if (subscriptions.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <p className="text-muted-foreground">Không tìm thấy gói đăng ký nào</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left p-4 font-medium">Tên gói</th>
                <th className="text-left p-4 font-medium">Ngày hết hạn</th>
                <th className="text-left p-4 font-medium">Thời gian còn lại</th>
                <th className="text-left p-4 font-medium">Gia hạn</th>
                <th className="text-left p-4 font-medium">Chi phí</th>
                <th className="text-left p-4 font-medium">Chu kỳ</th>
                <th className="text-left p-4 font-medium">Ghi chú</th>
                <th className="text-left p-4 font-medium">Trạng thái</th>
                <th className="text-right p-4 font-medium">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {subscriptions.map((subscription) => {
                const expiryDate = parseISO(subscription.expiry)
                const isExpired = isAfter(new Date(), expiryDate)
                const isExpiringSoon = !isExpired && isAfter(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), expiryDate)

                return (
                  <tr key={subscription.id} className="border-b border-border hover:bg-muted/50">
                    <td className="p-4">
                      <div className="font-medium">{subscription.name}</div>
                    </td>
                    <td className="p-4">
                      <div
                        className={`${isExpired ? "text-destructive" : isExpiringSoon ? "text-yellow-500" : "text-foreground"}`}
                      >
                        {format(expiryDate, "dd/MM/yyyy", { locale: vi })}
                      </div>
                    </td>
                    <td className="p-4">
                      <TimeRemainingDisplay expiryDate={subscription.expiry} />
                    </td>
                    <td className="p-4">
                      <RenewalInfoDisplay subscription={subscription} />
                    </td>
                    <td className="p-4">
                      <div className="font-medium">${subscription.cost}</div>
                    </td>
                    <td className="p-4">
                      <Badge variant="secondary">{subscription.cycle === "monthly" ? "Hàng tháng" : "Hàng năm"}</Badge>
                    </td>
                    <td className="p-4">
                      <div className="text-sm text-muted-foreground max-w-xs truncate">{subscription.notes || "-"}</div>
                    </td>
                    <td className="p-4">
                      {isExpired ? (
                        <Badge variant="destructive" className="flex items-center gap-1 w-fit">
                          <AlertTriangle className="w-3 h-3" />
                          Hết hạn
                        </Badge>
                      ) : isExpiringSoon ? (
                        <Badge
                          variant="outline"
                          className="flex items-center gap-1 w-fit border-yellow-500 text-yellow-500"
                        >
                          <AlertTriangle className="w-3 h-3" />
                          Sắp hết hạn
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-green-500 border-green-500">
                          Hoạt động
                        </Badge>
                      )}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="sm" onClick={() => onEdit(subscription)}>
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={async () => {
                            const confirmed = await modal.showDanger(
                              `Bạn có chắc chắn muốn xóa gói "${subscription.name}"?`,
                              'Xóa gói đăng ký'
                            )
                            if (confirmed) {
                              onDelete(subscription.id)
                            }
                          }}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}
