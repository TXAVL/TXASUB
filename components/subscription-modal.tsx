"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { createSubscription, updateSubscription, type Subscription } from "@/lib/auth"
import { toast } from "@/lib/toast"

interface SubscriptionModalProps {
  subscription?: Subscription
  onClose: () => void
  onSuccess: () => void
}

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

export function SubscriptionModal({ subscription, onClose, onSuccess }: SubscriptionModalProps) {
    const [formData, setFormData] = useState({
    name: "",
    expiry: "",
    cost: "",
    notes: "",
    cycle: "monthly" as "monthly" | "yearly",
    autoRenew: false,
    finalExpiry: "",
  })
  const [loading, setLoading] = useState(false)
  const [suggestions, setSuggestions] = useState<string[]>([])

  useEffect(() => {
    if (subscription) {
      setFormData({
        name: subscription.name,
        expiry: subscription.expiry,
        cost: subscription.cost.toString(),
        notes: subscription.notes,
        cycle: subscription.cycle,
        autoRenew: subscription.autoRenew || false,
        finalExpiry: subscription.finalExpiry || "",
      })
    }
  }, [subscription])

  const handleNameChange = (value: string) => {
    setFormData((prev) => ({ ...prev, name: value }))

    if (value.length > 0) {
      const filtered = SUBSCRIPTION_SUGGESTIONS.filter((suggestion) =>
        suggestion.toLowerCase().includes(value.toLowerCase()),
      )
      setSuggestions(filtered.slice(0, 5))
    } else {
      setSuggestions([])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const subscriptionData = {
        name: formData.name,
        expiry: formData.expiry,
        cost: Number.parseFloat(formData.cost),
        notes: formData.notes,
        cycle: formData.cycle,
        autoRenew: formData.autoRenew,
        finalExpiry: formData.finalExpiry || undefined,
        createdAt: subscription?.createdAt || new Date().toISOString(),
      }

      if (subscription) {
        await updateSubscription(subscription.id, subscriptionData)
        toast.success("Cập nhật gói thành công!")
      } else {
        await createSubscription(subscriptionData)
        toast.success("Thêm gói thành công!")
      }

      onSuccess()
    } catch (error) {
      toast.error(subscription ? "Lỗi khi cập nhật gói" : "Lỗi khi thêm gói")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{subscription ? "Sửa gói đăng ký" : "Thêm gói đăng ký"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Tên gói</Label>
            <div className="relative">
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="Nhập tên gói..."
                required
              />
              {suggestions.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-popover border border-border rounded-md shadow-lg">
                  {suggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      type="button"
                      className="w-full px-3 py-2 text-left hover:bg-accent hover:text-accent-foreground"
                      onClick={() => {
                        setFormData((prev) => ({ ...prev, name: suggestion }))
                        setSuggestions([])
                      }}
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="expiry">Ngày hết hạn</Label>
            <Input
              id="expiry"
              type="date"
              value={formData.expiry}
              onChange={(e) => setFormData((prev) => ({ ...prev, expiry: e.target.value }))}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="cost">Chi phí ($)</Label>
            <Input
              id="cost"
              type="number"
              step="0.01"
              value={formData.cost}
              onChange={(e) => setFormData((prev) => ({ ...prev, cost: e.target.value }))}
              placeholder="0.00"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="cycle">Chu kỳ</Label>
            <Select
              value={formData.cycle}
              onValueChange={(value: "monthly" | "yearly") => setFormData((prev) => ({ ...prev, cycle: value }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="monthly">Hàng tháng</SelectItem>
                <SelectItem value="yearly">Hàng năm</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Ghi chú</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData((prev) => ({ ...prev, notes: e.target.value }))}
              placeholder="Ghi chú thêm..."
              rows={3}
            />
          </div>

          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="autoRenew"
                checked={formData.autoRenew}
                onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, autoRenew: checked }))}
              />
              <Label htmlFor="autoRenew">Tự động gia hạn</Label>
            </div>

            {formData.autoRenew && (
              <div className="space-y-2">
                <Label htmlFor="finalExpiry">Ngày hết hạn cuối (tùy chọn)</Label>
                <Input
                  id="finalExpiry"
                  type="date"
                  value={formData.finalExpiry}
                  onChange={(e) => setFormData((prev) => ({ ...prev, finalExpiry: e.target.value }))}
                  placeholder="Để trống nếu gia hạn vô thời hạn"
                />
                <p className="text-xs text-muted-foreground">
                  Để trống nếu gói gia hạn vô thời hạn. Nhập ngày nếu có giới hạn thời gian.
                </p>
              </div>
            )}
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Hủy
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Đang xử lý..." : subscription ? "Cập nhật" : "Thêm gói"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
