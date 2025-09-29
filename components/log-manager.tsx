'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { 
  FileText, 
  AlertTriangle, 
  Trash2, 
  RefreshCw, 
  Download,
  Clock,
  HardDrive,
  Eye,
  EyeOff
} from 'lucide-react'

interface LogInfo {
  debugLog: {
    exists: boolean
    size: number
    lastModified: string | null
  }
  errorLog: {
    exists: boolean
    size: number
    lastModified: string | null
  }
}

interface LogManagerProps {
  onClose?: () => void
}

export function LogManager({ onClose }: LogManagerProps) {
  
  const [logs, setLogs] = useState<string[]>([])
  const [logInfo, setLogInfo] = useState<LogInfo | null>(null)
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState<'debug' | 'error'>('debug')
  const [showConfirm, setShowConfirm] = useState(false)
  const [showLogs, setShowLogs] = useState(true)

  useEffect(() => {
    loadLogs()
  }, [activeTab])

  const loadLogs = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/logs?type=${activeTab}&limit=200`)
      const data = await response.json()
      
      if (data.success) {
        setLogs(data.logs)
        setLogInfo(data.info)
      }
    } catch (error) {
      console.error('Error loading logs:', error)
    } finally {
      setLoading(false)
    }
  }

  const clearLogs = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/logs?type=${activeTab}`, {
        method: 'DELETE'
      })
      const data = await response.json()
      
      if (data.success) {
        setLogs([])
        await loadLogs() // Reload to get updated info
        setShowConfirm(false)
      }
    } catch (error) {
      console.error('Error clearing logs:', error)
    } finally {
      setLoading(false)
    }
  }

  const downloadLogs = () => {
    const logContent = logs.join('\n')
    const blob = new Blob([logContent], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${activeTab}-logs-${new Date().toISOString().split('T')[0]}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const formatDate = (dateString: string | null): string => {
    if (!dateString) return 'Never'
    return new Date(dateString).toLocaleString()
  }

  const getLogLevelColor = (logLine: string): string => {
    if (logLine.includes('ERROR')) return 'text-red-600'
    if (logLine.includes('WARN')) return 'text-yellow-600'
    if (logLine.includes('INFO')) return 'text-blue-600'
    if (logLine.includes('DEBUG')) return 'text-gray-600'
    return 'text-gray-500'
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <FileText className="h-6 w-6" />
            Log Manager
          </h2>
          <p className="text-gray-600">
            Quản lý và xem logs hệ thống
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setShowLogs(!showLogs)}
          >
            {showLogs ? <EyeOff className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
            {showLogs ? 'Ẩn' : 'Hiện'} Logs
          </Button>
          <Button
            variant="outline"
            onClick={loadLogs}
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Làm mới
          </Button>
        </div>
      </div>

      {/* Log Info Cards */}
      {logInfo && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <FileText className="h-5 w-5 text-blue-500" />
                Debug Logs
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Trạng thái:</span>
                  <Badge variant={logInfo.debugLog.exists ? 'default' : 'secondary'}>
                    {logInfo.debugLog.exists ? 'Có' : 'Không có'}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Kích thước:</span>
                  <span className="text-sm font-mono">{formatFileSize(logInfo.debugLog.size)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Cập nhật cuối:</span>
                  <span className="text-sm">{formatDate(logInfo.debugLog.lastModified)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-red-500" />
                Error Logs
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Trạng thái:</span>
                  <Badge variant={logInfo.errorLog.exists ? 'destructive' : 'secondary'}>
                    {logInfo.errorLog.exists ? 'Có' : 'Không có'}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Kích thước:</span>
                  <span className="text-sm font-mono">{formatFileSize(logInfo.errorLog.size)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Cập nhật cuối:</span>
                  <span className="text-sm">{formatDate(logInfo.errorLog.lastModified)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Log Tabs */}
      <Tabs value={activeTab} onValueChange={(value: any) => setActiveTab(value)}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="debug">Debug Logs</TabsTrigger>
          <TabsTrigger value="error">Error Logs</TabsTrigger>
        </TabsList>

        <TabsContent value="debug" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Debug Logs</h3>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={downloadLogs}
                disabled={logs.length === 0}
              >
                <Download className="h-4 w-4 mr-2" />
                Tải xuống
              </Button>
              <Dialog open={showConfirm} onOpenChange={setShowConfirm}>
                <DialogTrigger asChild>
                  <Button variant="destructive">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Xóa logs
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Xác nhận xóa logs</DialogTitle>
                    <DialogDescription>
                      Bạn có chắc chắn muốn xóa tất cả debug logs? Hành động này không thể hoàn tác.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="flex gap-2 justify-end">
                    <Button variant="outline" onClick={() => setShowConfirm(false)}>
                      Hủy
                    </Button>
                    <Button variant="destructive" onClick={clearLogs}>
                      Xóa
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {showLogs && (
            <Card>
              <CardContent className="p-0">
                <ScrollArea className="h-96">
                  <div className="p-4 space-y-1">
                    {loading ? (
                      <div className="flex items-center justify-center py-8">
                        <RefreshCw className="h-6 w-6 animate-spin mr-2" />
                        Đang tải logs...
                      </div>
                    ) : logs.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        Không có debug logs
                      </div>
                    ) : (
                      logs.map((log, index) => (
                        <div
                          key={index}
                          className={`text-sm font-mono ${getLogLevelColor(log)}`}
                        >
                          {log}
                        </div>
                      ))
                    )}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="error" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Error Logs</h3>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={downloadLogs}
                disabled={logs.length === 0}
              >
                <Download className="h-4 w-4 mr-2" />
                Tải xuống
              </Button>
              <Dialog open={showConfirm} onOpenChange={setShowConfirm}>
                <DialogTrigger asChild>
                  <Button variant="destructive">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Xóa logs
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Xác nhận xóa logs</DialogTitle>
                    <DialogDescription>
                      Bạn có chắc chắn muốn xóa tất cả error logs? Hành động này không thể hoàn tác.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="flex gap-2 justify-end">
                    <Button variant="outline" onClick={() => setShowConfirm(false)}>
                      Hủy
                    </Button>
                    <Button variant="destructive" onClick={clearLogs}>
                      Xóa
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {showLogs && (
            <Card>
              <CardContent className="p-0">
                <ScrollArea className="h-96">
                  <div className="p-4 space-y-1">
                    {loading ? (
                      <div className="flex items-center justify-center py-8">
                        <RefreshCw className="h-6 w-6 animate-spin mr-2" />
                        Đang tải logs...
                      </div>
                    ) : logs.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        Không có error logs
                      </div>
                    ) : (
                      logs.map((log, index) => (
                        <div
                          key={index}
                          className={`text-sm font-mono ${getLogLevelColor(log)}`}
                        >
                          {log}
                        </div>
                      ))
                    )}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}