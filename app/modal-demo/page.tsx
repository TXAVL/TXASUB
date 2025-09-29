"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useTXAModal } from "@/components/modal-integration"
import { ModalIntegration } from "@/components/modal-integration"

export default function ModalDemoPage() {
  const modal = useTXAModal()
  const [result, setResult] = useState<string>("")

  const showResult = (text: string) => {
    setResult(text)
    setTimeout(() => setResult(""), 5000)
  }

  return (
    <>
      <ModalIntegration />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold">🚀 TXA Modal Demo</CardTitle>
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
                Confirm
              </Button>

              <Button
                onClick={async () => {
                  await modal.showAlert("Đây là thông báo thông thường")
                  showResult("Alert: User clicked OK")
                }}
                variant="outline"
                className="w-full"
              >
                Alert
              </Button>

              <Button
                onClick={async () => {
                  const confirmed = await modal.showWarning("Cảnh báo: Hành động này có thể gây hậu quả!")
                  showResult(`Warning: ${confirmed}`)
                }}
                className="w-full bg-yellow-500 hover:bg-yellow-600"
              >
                Warning
              </Button>

              <Button
                onClick={async () => {
                  const confirmed = await modal.showDanger("Nguy hiểm: Bạn sắp xóa dữ liệu quan trọng!")
                  showResult(`Danger: ${confirmed}`)
                }}
                className="w-full bg-red-500 hover:bg-red-600"
              >
                Danger
              </Button>

              <Button
                onClick={async () => {
                  await modal.showSuccess("Thành công: Dữ liệu đã được lưu!")
                  showResult("Success: User clicked OK")
                }}
                className="w-full bg-green-500 hover:bg-green-600"
              >
                Success
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
                Custom Modal
              </Button>

              <Button
                onClick={async () => {
                  const result = await modal.showAsync(
                    "Thực hiện thao tác bất đồng bộ?",
                    "Async Operation",
                    async () => {
                      // Simulate API call
                      await new Promise(resolve => setTimeout(resolve, 3000))
                      return { success: true, data: "Operation completed" }
                    }
                  )
                  showResult(`Async: ${JSON.stringify(result)}`)
                }}
                className="w-full bg-blue-500 hover:bg-blue-600"
              >
                Async Operation
              </Button>

              <Button
                onClick={() => {
                  modal.showProgress("Đang xử lý dữ liệu...", "Processing")
                  
                  // Simulate progress
                  setTimeout(() => {
                    modal.hide()
                    modal.showSuccess("Hoàn thành!")
                  }, 2000)
                  
                  showResult("Progress: Started")
                }}
                className="w-full bg-purple-500 hover:bg-purple-600"
              >
                Progress Modal
              </Button>

              <Button
                onClick={async () => {
                  const confirmed = await modal.showCustom({
                    title: "Modal Không có Cancel",
                    message: "Modal này chỉ có nút OK, không có nút Cancel.",
                    type: "info",
                    confirmText: "OK",
                    cancelText: null
                  })
                  showResult(`No Cancel: ${confirmed}`)
                }}
                variant="outline"
                className="w-full"
              >
                No Cancel Button
              </Button>
            </div>

            {result && (
              <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-green-800 font-medium">Result: {result}</p>
              </div>
            )}

            <div className="mt-8 p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold mb-2">💡 Code Examples:</h3>
              <div className="space-y-2 text-sm">
                <div className="bg-white p-3 rounded border">
                  <code className="text-blue-600">
                    const result = await modal.showConfirm("Bạn có chắc chắn?")
                  </code>
                </div>
                <div className="bg-white p-3 rounded border">
                  <code className="text-blue-600">
                    await modal.showAlert("Thông báo quan trọng")
                  </code>
                </div>
                <div className="bg-white p-3 rounded border">
                  <code className="text-blue-600">
                    const result = await modal.showCustom({`{`}
                    <br />
                    &nbsp;&nbsp;title: "Custom Title",
                    <br />
                    &nbsp;&nbsp;message: "Custom message",
                    <br />
                    &nbsp;&nbsp;type: "info",
                    <br />
                    &nbsp;&nbsp;icon: "🎯"
                    <br />
                    {`}`})
                  </code>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  )
}