"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAuth } from "@/components/auth-provider"
import { fetchSubscriptions, deleteSubscription, type Subscription } from "@/lib/auth"
import { SubscriptionModal } from "@/components/subscription-modal"
import { SubscriptionTable } from "@/components/subscription-table"
import { toast } from "@/lib/toast"
import { Plus, Search, Filter, Download } from "lucide-react"
import { parseISO, isAfter, addDays } from "date-fns"

const SUBSCRIPTION_SUGGESTIONS = [
  "ChatGPT",
  "Cursor IDE",
  "Notion",
  "Spotify",
  "Netflix",
  "Adobe Creative Cloud",
  "Microsoft 365",
  "GitHub Pro",
  "Figma",
  "Canva Pro",
]

export function SubscriptionsPage() {
    const { user, loading } = useAuth()
  const router = useRouter()
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([])
  const [filteredSubscriptions, setFilteredSubscriptions] = useState<Subscription[]>([])
  const [loadingSubscriptions, setLoadingSubscriptions] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [editingSubscription, setEditingSubscription] = useState<Subscription | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [expiryFilter, setExpiryFilter] = useState<string>("all")
  const [cycleFilter, setCycleFilter] = useState<string>("all")
  const [suggestions, setSuggestions] = useState<string[]>([])

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth")
    }
  }, [user, loading, router])

  useEffect(() => {
    if (user) {
      loadSubscriptions()
    }
  }, [user])

  useEffect(() => {
    filterSubscriptions()
  }, [subscriptions, searchTerm, expiryFilter, cycleFilter])

  const loadSubscriptions = async () => {
    try {
      setLoadingSubscriptions(true)
      const data = await fetchSubscriptions()
      console.log("Loaded subscriptions:", data)
      setSubscriptions(data)
    } catch (error) {
      console.error("Error loading subscriptions:", error)
      toast.error("Không thể tải danh sách gói đăng ký")
    } finally {
      setLoadingSubscriptions(false)
    }
  }

  const filterSubscriptions = () => {
    let filtered = [...subscriptions]

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (sub) =>
          sub.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          sub.notes.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Expiry filter
    if (expiryFilter !== "all") {
      const now = new Date()
      filtered = filtered.filter((sub) => {
        const expiryDate = parseISO(sub.expiry)
        switch (expiryFilter) {
          case "7days":
            return isAfter(addDays(now, 7), expiryDate) && isAfter(expiryDate, now)
          case "30days":
            return isAfter(addDays(now, 30), expiryDate) && isAfter(expiryDate, now)
          case "expired":
            return isAfter(now, expiryDate)
          default:
            return true
        }
      })
    }

    // Cycle filter
    if (cycleFilter !== "all") {
      filtered = filtered.filter((sub) => sub.cycle === cycleFilter)
    }

    setFilteredSubscriptions(filtered)
  }

  const handleSearchChange = (value: string) => {
    setSearchTerm(value)

    if (value.length > 0) {
      const userSubscriptions = subscriptions.map((sub) => sub.name)
      const allSuggestions = [...new Set([...userSubscriptions, ...SUBSCRIPTION_SUGGESTIONS])]
      const filtered = allSuggestions.filter((suggestion) => suggestion.toLowerCase().includes(value.toLowerCase()))
      setSuggestions(filtered.slice(0, 5))
    } else {
      setSuggestions([])
    }
  }

  const handleEdit = (subscription: Subscription) => {
    setEditingSubscription(subscription)
    setShowModal(true)
  }

  const handleDelete = async (id: string) => {
    if (confirm("Bạn có chắc chắn muốn xóa gói này?")) {
      try {
        await deleteSubscription(id)
        toast.success("Xóa gói thành công!")
        loadSubscriptions()
      } catch (error) {
        toast.error("Lỗi khi xóa gói")
      }
    }
  }

  const handleModalClose = () => {
    setShowModal(false)
    setEditingSubscription(null)
  }

  const handleModalSuccess = () => {
    setShowModal(false)
    setEditingSubscription(null)
    // Force refresh with small delay to ensure API has processed
    setTimeout(() => {
      loadSubscriptions()
    }, 100)
  }

  const exportToJSON = () => {
    const dataStr = JSON.stringify(filteredSubscriptions, null, 2)
    const dataUri = "data:application/json;charset=utf-8," + encodeURIComponent(dataStr)

    const exportFileDefaultName = "subscriptions.json"

    const linkElement = document.createElement("a")
    linkElement.setAttribute("href", dataUri)
    linkElement.setAttribute("download", exportFileDefaultName)
    linkElement.click()

    toast.success("Xuất dữ liệu thành công!")
  }

  const exportToCSV = () => {
    const headers = ["Tên", "Ngày hết hạn", "Chi phí", "Chu kỳ", "Ghi chú"]
    const csvContent = [
      headers.join(","),
      ...filteredSubscriptions.map((sub) =>
        [
          `"${sub.name}"`,
          sub.expiry,
          sub.cost,
          sub.cycle === "monthly" ? "Hàng tháng" : "Hàng năm",
          `"${sub.notes}"`,
        ].join(","),
      ),
    ].join("\n")

    const dataUri = "data:text/csv;charset=utf-8," + encodeURIComponent(csvContent)

    const linkElement = document.createElement("a")
    linkElement.setAttribute("href", dataUri)
    linkElement.setAttribute("download", "subscriptions.csv")
    linkElement.click()

    toast.success("Xuất CSV thành công!")
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Danh sách gói đăng ký</h1>
          <p className="text-muted-foreground mt-2">Quản lý tất cả gói đăng ký của bạn</p>
        </div>
        <Button onClick={() => setShowModal(true)} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Thêm gói
        </Button>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Tìm kiếm và lọc
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Tìm kiếm theo tên hoặc ghi chú..."
                value={searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="pl-10"
              />
            </div>
            {suggestions.length > 0 && (
              <div className="absolute z-10 w-full mt-1 bg-popover border border-border rounded-md shadow-lg">
                {suggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    type="button"
                    className="w-full px-3 py-2 text-left hover:bg-accent hover:text-accent-foreground"
                    onClick={() => {
                      setSearchTerm(suggestion)
                      setSuggestions([])
                    }}
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Lọc theo hết hạn</label>
              <Select value={expiryFilter} onValueChange={setExpiryFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả</SelectItem>
                  <SelectItem value="7days">Trong 7 ngày</SelectItem>
                  <SelectItem value="30days">Trong 30 ngày</SelectItem>
                  <SelectItem value="expired">Đã hết hạn</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Lọc theo chu kỳ</label>
              <Select value={cycleFilter} onValueChange={setCycleFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả</SelectItem>
                  <SelectItem value="monthly">Hàng tháng</SelectItem>
                  <SelectItem value="yearly">Hàng năm</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end gap-2">
              <Button onClick={exportToJSON} variant="outline" className="flex items-center gap-2 bg-transparent">
                <Download className="w-4 h-4" />
                JSON
              </Button>
              <Button onClick={exportToCSV} variant="outline" className="flex items-center gap-2 bg-transparent">
                <Download className="w-4 h-4" />
                CSV
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {loadingSubscriptions ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : (
        <SubscriptionTable subscriptions={filteredSubscriptions} onEdit={handleEdit} onDelete={handleDelete} />
      )}

      {showModal && (
        <SubscriptionModal
          subscription={editingSubscription || undefined}
          onClose={handleModalClose}
          onSuccess={handleModalSuccess}
        />
      )}
    </div>
  )
}
