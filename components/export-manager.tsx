"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Subscription } from "@/lib/auth"
import { toast } from "@/lib/toast"
import { Download, FileText, Table } from "lucide-react"
import { parseISO, format } from "date-fns"
import { vi } from "date-fns/locale"

interface ExportManagerProps {
  subscriptions: Subscription[]
}

export function ExportManager({ subscriptions }: ExportManagerProps) {
    const [exportFormat, setExportFormat] = useState<"json" | "csv">("json")
  const [exportFilter, setExportFilter] = useState<"all" | "active" | "expired" | "expiring">("all")

  const getFilteredSubscriptions = () => {
    const now = new Date()
    const sevenDaysFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)

    switch (exportFilter) {
      case "active":
        return subscriptions.filter((sub) => parseISO(sub.expiry) > now)
      case "expired":
        return subscriptions.filter((sub) => parseISO(sub.expiry) <= now)
      case "expiring":
        return subscriptions.filter((sub) => {
          const expiryDate = parseISO(sub.expiry)
          return expiryDate > now && expiryDate <= sevenDaysFromNow
        })
      default:
        return subscriptions
    }
  }

  const exportToJSON = () => {
    const filteredData = getFilteredSubscriptions()
    const exportData = {
      exportDate: new Date().toISOString(),
      totalSubscriptions: filteredData.length,
      filter: exportFilter,
      subscriptions: filteredData.map((sub) => ({
        ...sub,
        expiryFormatted: format(parseISO(sub.expiry), "dd/MM/yyyy", { locale: vi }),
        status: parseISO(sub.expiry) <= new Date() ? "expired" : "active",
        cycleFormatted: sub.cycle === "monthly" ? "Hàng tháng" : "Hàng năm",
      })),
    }

    const dataStr = JSON.stringify(exportData, null, 2)
    const dataUri = "data:application/json;charset=utf-8," + encodeURIComponent(dataStr)

    const exportFileDefaultName = `subscriptions-${exportFilter}-${format(new Date(), "yyyy-MM-dd")}.json`

    const linkElement = document.createElement("a")
    linkElement.setAttribute("href", dataUri)
    linkElement.setAttribute("download", exportFileDefaultName)
    linkElement.click()

    toast.success(`Xuất ${filteredData.length} gói đăng ký ra JSON thành công!`)
  }

  const exportToCSV = () => {
    const filteredData = getFilteredSubscriptions()
    const headers = ["Tên gói", "Ngày hết hạn", "Chi phí (USD)", "Chu kỳ", "Ghi chú", "Trạng thái"]

    const csvContent = [
      headers.join(","),
      ...filteredData.map((sub) => {
        const status = parseISO(sub.expiry) <= new Date() ? "Hết hạn" : "Hoạt động"
        const cycle = sub.cycle === "monthly" ? "Hàng tháng" : "Hàng năm"
        const expiryFormatted = format(parseISO(sub.expiry), "dd/MM/yyyy", { locale: vi })

        return [
          `"${sub.name}"`,
          `"${expiryFormatted}"`,
          sub.cost,
          `"${cycle}"`,
          `"${sub.notes.replace(/"/g, '""')}"`,
          `"${status}"`,
        ].join(",")
      }),
    ].join("\n")

    // Add BOM for proper UTF-8 encoding in Excel
    const BOM = "\uFEFF"
    const dataUri = "data:text/csv;charset=utf-8," + encodeURIComponent(BOM + csvContent)

    const exportFileDefaultName = `subscriptions-${exportFilter}-${format(new Date(), "yyyy-MM-dd")}.csv`

    const linkElement = document.createElement("a")
    linkElement.setAttribute("href", dataUri)
    linkElement.setAttribute("download", exportFileDefaultName)
    linkElement.click()

    toast.success(`Xuất ${filteredData.length} gói đăng ký ra CSV thành công!`)
  }

  const handleExport = () => {
    if (exportFormat === "json") {
      exportToJSON()
    } else {
      exportToCSV()
    }
  }

  const filteredCount = getFilteredSubscriptions().length

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Download className="w-5 h-5" />
          Xuất dữ liệu
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Định dạng xuất</label>
            <Select value={exportFormat} onValueChange={(value: "json" | "csv") => setExportFormat(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="json">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    JSON
                  </div>
                </SelectItem>
                <SelectItem value="csv">
                  <div className="flex items-center gap-2">
                    <Table className="w-4 h-4" />
                    CSV
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Lọc dữ liệu</label>
            <Select
              value={exportFilter}
              onValueChange={(value: "all" | "active" | "expired" | "expiring") => setExportFilter(value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả ({subscriptions.length})</SelectItem>
                <SelectItem value="active">Đang hoạt động</SelectItem>
                <SelectItem value="expired">Đã hết hạn</SelectItem>
                <SelectItem value="expiring">Sắp hết hạn (7 ngày)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-border">
          <div className="text-sm text-muted-foreground">Sẽ xuất {filteredCount} gói đăng ký</div>
          <Button onClick={handleExport} disabled={filteredCount === 0}>
            <Download className="w-4 h-4 mr-2" />
            Xuất {exportFormat.toUpperCase()}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
