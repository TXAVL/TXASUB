"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function CookieTest() {
  
  const [testResult, setTestResult] = useState<string>('')
  const [manualCookie, setManualCookie] = useState<string>('')

  const testCurrentCookies = async () => {
    try {
      console.log('🍪 Current cookies:', document.cookie)
      
      const response = await fetch('/api/user', {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        }
      })
      
      console.log('📡 Response status:', response.status)
      console.log('📡 Response headers:', response.headers)
      
      const data = await response.text()
      console.log('📡 Response body:', data)
      
      setTestResult(`Status: ${response.status}\nBody: ${data}`)
      
    } catch (error) {
      console.error('❌ Error:', error)
      setTestResult(`Error: ${error}`)
    }
  }

  const testWithManualCookie = async () => {
    try {
      console.log('🍪 Manual cookie:', manualCookie)
      
      const response = await fetch('/api/user', {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'Cookie': manualCookie
        }
      })
      
      console.log('📡 Manual response status:', response.status)
      
      const data = await response.text()
      console.log('📡 Manual response body:', data)
      
      setTestResult(`Manual Test - Status: ${response.status}\nBody: ${data}`)
      
    } catch (error) {
      console.error('❌ Manual error:', error)
      setTestResult(`Manual Error: ${error}`)
    }
  }

  const setCookieManually = () => {
    // Get the cookie from the debug script result
    const testCookie = 'user=' + encodeURIComponent(JSON.stringify({
      googleId: "105968711043650964191",
      name: "TXA VLOG", 
      email: "xuananhdepzai9@gmail.com",
      picture: "https://lh3.googleusercontentcom/a/ACg8ocKkpni5NE6E7r1nWVg0CN6yrU_YDi1PN8-IgJ1v8P6PHB6l0z0=s96-c"
    }))
    
    document.cookie = testCookie + '; path=/'
    console.log('🍪 Set cookie manually:', testCookie)
    setTestResult('Cookie set manually. Try testing again.')
  }

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>🍪 Cookie Test</CardTitle>
        <CardDescription>
          Test cookie handling và API calls
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="manual-cookie">Manual Cookie (paste from debug script):</Label>
          <Input
            id="manual-cookie"
            value={manualCookie}
            onChange={(e) => setManualCookie(e.target.value)}
            placeholder="user=..."
            className="mt-1"
          />
        </div>
        
        <div className="flex gap-2">
          <Button onClick={testCurrentCookies} variant="outline">
            Test Current Cookies
          </Button>
          <Button onClick={testWithManualCookie} variant="outline">
            Test Manual Cookie
          </Button>
          <Button onClick={setCookieManually} variant="secondary">
            Set Cookie Manually
          </Button>
        </div>
        
        <div>
          <Label>Test Result:</Label>
          <pre className="bg-gray-100 p-2 rounded text-xs overflow-auto mt-1 whitespace-pre-wrap">
            {testResult || 'No test results yet'}
          </pre>
        </div>
        
        <div className="text-sm text-gray-600">
          <p><strong>Steps:</strong></p>
          <ol className="list-decimal list-inside space-y-1">
            <li>Click "Set Cookie Manually" to set a test cookie</li>
            <li>Click "Test Current Cookies" to test with current cookies</li>
            <li>Or paste cookie from debug script and test manually</li>
          </ol>
        </div>
      </CardContent>
    </Card>
  )
}