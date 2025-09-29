"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

import { Button } from "@/components/ui/button"

export function DebugCookies() {
  
  const [cookies, setCookies] = useState<string>('')
  const [userData, setUserData] = useState<any>(null)

  useEffect(() => {
    // Get cookies from browser
    const allCookies = document.cookie
    setCookies(allCookies)
    
    // Try to parse user cookie
    const userCookie = allCookies
      .split(';')
      .find(cookie => cookie.trim().startsWith('user='))
    
    if (userCookie) {
      try {
        const userValue = userCookie.split('=')[1]
        const decoded = decodeURIComponent(userValue)
        const parsed = JSON.parse(decoded)
        setUserData(parsed)
      } catch (error) {
        console.error('Error parsing user cookie:', error)
      }
    }
  }, [])

  const testAPI = async () => {
    try {
      console.log('Testing /api/user...')
      const response = await fetch('/api/user', {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        }
      })
      
      console.log('Response status:', response.status)
      const data = await response.json()
      console.log('Response data:', data)
      
      if (response.ok) {
        alert('API /api/user works!')
      } else {
        alert(`API /api/user failed: ${data.error}`)
      }
    } catch (error) {
      console.error('Error testing API:', error)
      alert('Error testing API')
    }
  }

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>🍪 Debug Cookies</CardTitle>
        <CardDescription>
          Kiểm tra cookies và API calls
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div>
          <h4 className="font-medium mb-2">All Cookies:</h4>
          <pre className="bg-gray-100 p-2 rounded text-xs overflow-auto">
            {cookies || 'No cookies found'}
          </pre>
        </div>
        
        <div>
          <h4 className="font-medium mb-2">User Data:</h4>
          <pre className="bg-gray-100 p-2 rounded text-xs overflow-auto">
            {userData ? JSON.stringify(userData, null, 2) : 'No user cookie found'}
          </pre>
        </div>
        
        <div>
          <Button onClick={testAPI} className="w-full">
            Test /api/user
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}