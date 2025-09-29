'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"

import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  Zap, 
  CreditCard, 
  Cloud, 
  Bot, 
  CheckCircle, 
  AlertCircle, 
  Settings,
  RefreshCw,
  ExternalLink
} from 'lucide-react'
import { connectProvider, syncSubscriptions } from '@/lib/auth'

interface Provider {
  id: string
  name: string
  description: string
  icon: React.ReactNode
  category: 'payment' | 'cloud' | 'ai' | 'analytics'
  connected: boolean
  credentials: any
}

export function ApiIntegrations() {
  
  const [providers, setProviders] = useState<Provider[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null)
  const [credentials, setCredentials] = useState<any>({})
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    loadProviders()
  }, [])

  const loadProviders = () => {
    // Mock providers data
    const mockProviders: Provider[] = [
      {
        id: 'stripe',
        name: 'Stripe',
        description: 'Xử lý thanh toán và quản lý subscription',
        icon: <CreditCard className="h-5 w-5" />,
        category: 'payment',
        connected: false,
        credentials: {}
      },
      {
        id: 'paypal',
        name: 'PayPal',
        description: 'Thanh toán trực tuyến và chuyển tiền',
        icon: <CreditCard className="h-5 w-5" />,
        category: 'payment',
        connected: false,
        credentials: {}
      },
      {
        id: 'aws',
        name: 'Amazon Web Services',
        description: 'Dịch vụ đám mây và lưu trữ',
        icon: <Cloud className="h-5 w-5" />,
        category: 'cloud',
        connected: false,
        credentials: {}
      },
      {
        id: 'openai',
        name: 'OpenAI',
        description: 'Trí tuệ nhân tạo và xử lý ngôn ngữ',
        icon: <Bot className="h-5 w-5" />,
        category: 'ai',
        connected: false,
        credentials: {}
      }
    ]
    setProviders(mockProviders)
  }

  const handleConnectProvider = async (provider: Provider) => {
    try {
      setLoading(true)
      setError('')
      await connectProvider(provider.id, credentials)
      
      // Update provider status
      setProviders(prev => 
        prev.map(p => 
          p.id === provider.id 
            ? { ...p, connected: true, credentials }
            : p
        )
      )
      
      setSuccess(`Đã kết nối thành công với ${provider.name}!`)
      setSelectedProvider(null)
      setCredentials({})
    } catch (error) {
      setError(`Không thể kết nối với ${provider.name}. Vui lòng kiểm tra thông tin đăng nhập.`)
      console.error('Error connecting provider:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSyncProvider = async (provider: Provider) => {
    try {
      setLoading(true)
      setError('')
      const subscriptions = await syncSubscriptions(provider.id)
      setSuccess(`Đã đồng bộ ${subscriptions.length} subscription từ ${provider.name}!`)
    } catch (error) {
      setError(`Không thể đồng bộ từ ${provider.name}. Vui lòng thử lại.`)
      console.error('Error syncing provider:', error)
    } finally {
      setLoading(false)
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'payment': return <CreditCard className="h-4 w-4" />
      case 'cloud': return <Cloud className="h-4 w-4" />
      case 'ai': return <Bot className="h-4 w-4" />
      case 'analytics': return <Zap className="h-4 w-4" />
      default: return <Settings className="h-4 w-4" />
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'payment': return 'bg-green-100 text-green-800'
      case 'cloud': return 'bg-blue-100 text-blue-800'
      case 'ai': return 'bg-purple-100 text-purple-800'
      case 'analytics': return 'bg-orange-100 text-orange-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getCategoryName = (category: string) => {
    switch (category) {
      case 'payment': return 'Thanh toán'
      case 'cloud': return 'Đám mây'
      case 'ai': return 'AI'
      case 'analytics': return 'Phân tích'
      default: return category
    }
  }

  const groupedProviders = providers.reduce((acc, provider) => {
    if (!acc[provider.category]) {
      acc[provider.category] = []
    }
    acc[provider.category].push(provider)
    return acc
  }, {} as Record<string, Provider[]>)

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Zap className="h-6 w-6" />
        <h2 className="text-2xl font-bold">Tích hợp API</h2>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="all">Tất cả</TabsTrigger>
          <TabsTrigger value="payment">Thanh toán</TabsTrigger>
          <TabsTrigger value="cloud">Đám mây</TabsTrigger>
          <TabsTrigger value="ai">AI</TabsTrigger>
          <TabsTrigger value="analytics">Phân tích</TabsTrigger>
        </TabsList>

        {Objectentries(groupedProviders).map(([category, categoryProviders]) => (
          <TabsContent key={category} value={category === 'payment' ? 'payment' : category}>
            <div className="grid gap-4">
              {categoryProviders.map((provider) => (
                <Card key={provider.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {provider.icon}
                        <div>
                          <CardTitle className="text-lg">{provider.name}</CardTitle>
                          <CardDescription>{provider.description}</CardDescription>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getCategoryColor(provider.category)}>
                          {getCategoryIcon(provider.category)}
                          <span className="ml-1">{getCategoryName(provider.category)}</span>
                        </Badge>
                        <Badge variant={provider.connected ? 'default' : 'secondary'}>
                          {provider.connected ? 'Đã kết nối' : 'Chưa kết nối'}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-2">
                      {!provider.connected ? (
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button onClick={() => setSelectedProvider(provider)}>
                              Kết nối
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-md">
                            <DialogHeader>
                              <DialogTitle>Kết nối với {provider.name}</DialogTitle>
                              <DialogDescription>
                                Nhập thông tin đăng nhập để kết nối với {provider.name}
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                              {provider.id === 'stripe' && (
                                <>
                                  <Input
                                    placeholder="Secret Key"
                                    value={credentials.secretKey || ''}
                                    onChange={(e) => setCredentials({...credentials, secretKey: e.targetvalue})}
                                  />
                                  <Input
                                    placeholder="Publishable Key"
                                    value={credentials.publishableKey || ''}
                                    onChange={(e) => setCredentials({...credentials, publishableKey: e.targetvalue})}
                                  />
                                </>
                              )}
                              {provider.id === 'paypal' && (
                                <>
                                  <Input
                                    placeholder="Client ID"
                                    value={credentials.clientId || ''}
                                    onChange={(e) => setCredentials({...credentials, clientId: e.targetvalue})}
                                  />
                                  <Input
                                    placeholder="Client Secret"
                                    value={credentials.clientSecret || ''}
                                    onChange={(e) => setCredentials({...credentials, clientSecret: e.targetvalue})}
                                  />
                                </>
                              )}
                              {provider.id === 'aws' && (
                                <>
                                  <Input
                                    placeholder="Access Key ID"
                                    value={credentials.accessKeyId || ''}
                                    onChange={(e) => setCredentials({...credentials, accessKeyId: e.targetvalue})}
                                  />
                                  <Input
                                    placeholder="Secret Access Key"
                                    value={credentials.secretAccessKey || ''}
                                    onChange={(e) => setCredentials({...credentials, secretAccessKey: e.targetvalue})}
                                  />
                                  <Input
                                    placeholder="Region"
                                    value={credentials.region || ''}
                                    onChange={(e) => setCredentials({...credentials, region: e.targetvalue})}
                                  />
                                </>
                              )}
                              {provider.id === 'openai' && (
                                <Input
                                  placeholder="API Key"
                                  value={credentials.apiKey || ''}
                                  onChange={(e) => setCredentials({...credentials, apiKey: e.targetvalue})}
                                />
                              )}
                              <Button 
                                onClick={() => handleConnectProvider(provider)}
                                className="w-full"
                                disabled={loading}
                              >
                                {loading ? 'Đang kết nối...' : 'Kết nối'}
                              </Button>
                            </div>
                          </DialogContent>
                        </Dialog>
                      ) : (
                        <>
                          <Button 
                            variant="outline"
                            onClick={() => handleSyncProvider(provider)}
                            disabled={loading}
                          >
                            <RefreshCw className="h-4 w-4 mr-2" />
                            Đồng bộ
                          </Button>
                          <Button variant="outline">
                            <Settings className="h-4 w-4 mr-2" />
                            Cài đặt
                          </Button>
                        </>
                      )}
                      <Button variant="outline" size="sm">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Tài liệu
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        ))}

        <TabsContent value="all">
          <div className="grid gap-4">
            {providers.map((provider) => (
              <Card key={provider.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {provider.icon}
                      <div>
                        <CardTitle className="text-lg">{provider.name}</CardTitle>
                        <CardDescription>{provider.description}</CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getCategoryColor(provider.category)}>
                        {getCategoryIcon(provider.category)}
                        <span className="ml-1">{getCategoryName(provider.category)}</span>
                      </Badge>
                      <Badge variant={provider.connected ? 'default' : 'secondary'}>
                        {provider.connected ? 'Đã kết nối' : 'Chưa kết nối'}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-2">
                    {!provider.connected ? (
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button onClick={() => setSelectedProvider(provider)}>
                            Kết nối
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-md">
                          <DialogHeader>
                            <DialogTitle>Kết nối với {provider.name}</DialogTitle>
                            <DialogDescription>
                              Nhập thông tin đăng nhập để kết nối với {provider.name}
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4">
                            {/* Provider-specific credential inputs */}
                            {provider.id === 'stripe' && (
                              <>
                                <Input
                                  placeholder="Secret Key"
                                  value={credentials.secretKey || ''}
                                  onChange={(e) => setCredentials({...credentials, secretKey: e.targetvalue})}
                                />
                                <Input
                                  placeholder="Publishable Key"
                                  value={credentials.publishableKey || ''}
                                  onChange={(e) => setCredentials({...credentials, publishableKey: e.targetvalue})}
                                />
                              </>
                            )}
                            {provider.id === 'paypal' && (
                              <>
                                <Input
                                  placeholder="Client ID"
                                  value={credentials.clientId || ''}
                                  onChange={(e) => setCredentials({...credentials, clientId: e.targetvalue})}
                                />
                                <Input
                                  placeholder="Client Secret"
                                  value={credentials.clientSecret || ''}
                                  onChange={(e) => setCredentials({...credentials, clientSecret: e.targetvalue})}
                                />
                              </>
                            )}
                            {provider.id === 'aws' && (
                              <>
                                <Input
                                  placeholder="Access Key ID"
                                  value={credentials.accessKeyId || ''}
                                  onChange={(e) => setCredentials({...credentials, accessKeyId: e.targetvalue})}
                                />
                                <Input
                                  placeholder="Secret Access Key"
                                  value={credentials.secretAccessKey || ''}
                                  onChange={(e) => setCredentials({...credentials, secretAccessKey: e.targetvalue})}
                                />
                                <Input
                                  placeholder="Region"
                                  value={credentials.region || ''}
                                  onChange={(e) => setCredentials({...credentials, region: e.targetvalue})}
                                />
                              </>
                            )}
                            {provider.id === 'openai' && (
                              <Input
                                placeholder="API Key"
                                value={credentials.apiKey || ''}
                                onChange={(e) => setCredentials({...credentials, apiKey: e.targetvalue})}
                              />
                            )}
                            <Button 
                              onClick={() => handleConnectProvider(provider)}
                              className="w-full"
                              disabled={loading}
                            >
                              {loading ? 'Đang kết nối...' : 'Kết nối'}
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    ) : (
                      <>
                        <Button 
                          variant="outline"
                          onClick={() => handleSyncProvider(provider)}
                          disabled={loading}
                        >
                          <RefreshCw className="h-4 w-4 mr-2" />
                          Đồng bộ
                        </Button>
                        <Button variant="outline">
                          <Settings className="h-4 w-4 mr-2" />
                          Cài đặt
                        </Button>
                      </>
                    )}
                    <Button variant="outline" size="sm">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Tài liệu
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Error/Success Messages */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert>
          <CheckCircle className="h-4 w-4" />
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}
    </div>
  )
}