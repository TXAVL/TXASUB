"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export function BrowserDebug() {
  
  const [debugInfo, setDebugInfo] = useState<any>({})
  const [testResults, setTestResults] = useState<any[]>([])

  useEffect(() => {
    // Get all cookies
    const allCookies = document.cookie
    const userCookie = allCookies
      .split(';')
      .find(cookie => cookie.trim().startsWith('user='))
    
    let userData = null
    if (userCookie) {
      try {
        const userValue = userCookie.split('=')[1]
        const decoded = decodeURIComponent(userValue)
        userData = JSON.parse(decoded)
      } catch (error) {
        console.error('Error parsing user cookie:', error)
      }
    }

    setDebugInfo({
      allCookies,
      userCookie: userCookie || 'Not found',
      userData,
      userAgent: navigator.userAgent,
      url: window.location.href
    })
  }, [])

  const testAPI = async (endpoint: string, method: string = 'GET', body?: any) => {
    try {
      console.log(`Testing ${method} ${endpoint}...`)
      
      const options: RequestInit = {
        method,
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        }
      }
      
      if (body) {
        options.body = JSON.stringify(body)
      }
      
      const response = await fetch(endpoint, options)
      const data = await response.text()
      
      const result = {
        endpoint,
        method,
        status: response.status,
        statusText: response.statusText,
        body: data,
        timestamp: new Date().toISOString()
      }
      
      console.log('API Test Result:', result)
      setTestResults(prev => [result, ...prev.slice(0, 4)]) // Keep last 5 results
      
      return result
    } catch (error) {
      const result = {
        endpoint,
        method,
        status: 'ERROR',
        statusText: 'Network Error',
        body: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      }
      
      console.error('API Test Error:', result)
      setTestResults(prev => [result, ...prev.slice(0, 4)])
      
      return result
    }
  }

  const runAllTests = async () => {
    setTestResults([])
    
    // Test 1: /api/user
    await testAPI('/api/user', 'GET')
    
    // Test 2: /api/user (PUT for email settings)
    await testAPI('/api/user', 'PUT', {
      emailNotifications: {
        enabled: true,
        expiringSoon: true,
        critical: true,
        weekly: false,
        monthly: true
      }
    })
    
    // Test 3: /api/notifications/test
    await testAPI('/api/notifications/test', 'POST')
  }

  const clearCookies = () => {
    // Clear all cookies
    document.cookie.split(";").forEach(cookie => {
      const eqPos = cookie.indexOf("=")
      const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie
      document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/"
    })
    
    // Reload page
    window.location.reload()
  }

  const setTestCookie = () => {
    const testUser = {
      googleId: "105968711043650964191",
      name: "TXA VLOG",
      email: "xuananhdepzai9@gmail.com",
      picture: "https://lh3.googleusercontentcom/a/ACg8ocKkpni5NE6E7r1nWVg0CN6yrU_YDi1PN8-IgJ1v8P6PHB6l0z0=s96-c"
    }
    
    document.cookie = `user=${encodeURIComponent(JSON.stringify(testUser))}; path=/`
    console.log('Set test cookie:', testUser)
    
    // Reload debug info
    window.location.reload()
  }

  return (
    <Card className="w-full max-w-4xl">
      <CardHeader>
        <CardTitle>🔍 Browser Debug</CardTitle>
        <CardDescription>
          Debug cookies và API calls trong browser
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Debug Info */}
        <div>
          <h4 className="font-medium mb-2">Debug Info:</h4>
          <div className="bg-gray-100 p-3 rounded text-xs space-y-2">
            <div>
              <strong>All Cookies:</strong>
              <pre className="mt-1 whitespace-pre-wrap">{debugInfo.allCookies || 'No cookies'}</pre>
            </div>
            <div>
              <strong>User Cookie:</strong>
              <pre className="mt-1 whitespace-pre-wrap">{debugInfo.userCookie}</pre>
            </div>
            <div>
              <strong>User Data:</strong>
              <pre className="mt-1 whitespace-pre-wrap">
                {debugInfo.userData ? JSON.stringify(debugInfo.userData, null, 2) : 'No user data'}
              </pre>
            </div>
            <div>
              <strong>URL:</strong> {debugInfo.url}
            </div>
          </div>
        </div>
        
        {/* Actions */}
        <div className="flex gap-2 flex-wrap">
          <Button onClick={runAllTests} variant="default">
            🧪 Run All Tests
          </Button>
          <Button onClick={setTestCookie} variant="outline">
            🍪 Set Test Cookie
          </Button>
          <Button onClick={clearCookies} variant="destructive">
            🗑️ Clear Cookies
          </Button>
        </div>
        
        {/* Test Results */}
        <div>
          <h4 className="font-medium mb-2">Test Results:</h4>
          {testResults.length === 0 ? (
            <p className="text-gray-500 text-sm">No tests run yet</p>
          ) : (
            <div className="space-y-2">
              {testResults.map((result, index) => (
                <div key={index} className="border rounded p-3 text-xs">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant={result.status === 200 ? "default" : "destructive"}>
                      {result.status}
                    </Badge>
                    <span className="font-medium">{result.method} {result.endpoint}</span>
                    <span className="text-gray-500">{result.timestamp}</span>
                  </div>
                  <pre className="whitespace-pre-wrap text-xs bg-gray-50 p-2 rounded">
                    {result.body}
                  </pre>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}