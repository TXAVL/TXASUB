"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useTXAModal } from "@/components/modal-integration"

export default function TestModalPage() {
  const modal = useTXAModal()
  const [result, setResult] = useState<string>("")

  const showResult = (text: string) => {
    setResult(text)
    setTimeout(() => setResult(""), 5000)
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">🧪 Test TXA Modal</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Button
              onClick={async () => {
                const confirmed = await modal.showConfirm("Bạn có chắc chắn muốn thực hiện hành động này?")
                showResult(`Confirm: ${confirmed}`)
              }}
              className="w-full"
            >
              Test Confirm
            </Button>

            <Button
              onClick={async () => {
                await modal.showAlert("Đây là thông báo thông thường")
                showResult("Alert: User clicked OK")
              }}
              variant="outline"
              className="w-full"
            >
              Test Alert
            </Button>

            <Button
              onClick={async () => {
                const confirmed = await modal.showWarning("Cảnh báo: Hành động này có thể gây hậu quả!")
                showResult(`Warning: ${confirmed}`)
              }}
              className="w-full bg-yellow-500 hover:bg-yellow-600"
            >
              Test Warning
            </Button>

            <Button
              onClick={async () => {
                const confirmed = await modal.showDanger("Nguy hiểm: Bạn sắp xóa dữ liệu quan trọng!")
                showResult(`Danger: ${confirmed}`)
              }}
              className="w-full bg-red-500 hover:bg-red-600"
            >
              Test Danger
            </Button>

            <Button
              onClick={async () => {
                await modal.showSuccess("Thành công: Dữ liệu đã được lưu!")
                showResult("Success: User clicked OK")
              }}
              className="w-full bg-green-500 hover:bg-green-600"
            >
              Test Success
            </Button>

            <Button
              onClick={async () => {
                const confirmed = await modal.showCustom({
                  title: "Modal Tùy chỉnh",
                  subtitle: "Với subtitle và icon custom",
                  message: "Đây là modal với nhiều tùy chọn tùy chỉnh. Bạn có thể thay đổi icon, màu sắc, và nội dung.",
                  type: "info",
                  icon: "🎯",
                  confirmText: "Tùy chỉnh OK",
                  cancelText: "Tùy chỉnh Cancel"
                })
                showResult(`Custom: ${confirmed}`)
              }}
              variant="outline"
              className="w-full"
            >
              Test Custom
            </Button>
          </div>

          {result && (
            <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-800 font-medium">Result: {result}</p>
            </div>
          )}

          <div className="mt-8 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold mb-2">✅ Modal Status Check:</h3>
            <div className="space-y-2 text-sm">
              <div className="bg-white p-3 rounded border">
                <code className="text-blue-600">
                  TXAModal available: {typeof window !== 'undefined' && window.txaModal ? '✅ Yes' : '❌ No'}
                </code>
              </div>
              <div className="bg-white p-3 rounded border">
                <code className="text-blue-600">
                  txaModal instance: {typeof window !== 'undefined' && window.txaModal ? '✅ Yes' : '❌ No'}
                </code>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}