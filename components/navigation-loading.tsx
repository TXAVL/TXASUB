'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'

export function NavigationLoading() {
  const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [currentStep, setCurrentStep] = useState('')
  const pathname = usePathname()

  useEffect(() => {
    setLoading(true)
    setProgress(0)

    const steps = [
      { text: 'Đang khởi tạo...', progress: 10 },
      { text: 'Đang compile...', progress: 30 },
      { text: 'Đang tối ưu hóa...', progress: 60 },
      { text: 'Đang render...', progress: 85 },
      { text: 'Hoàn thành...', progress: 100 }
    ]

    let currentStepIndex = 0
    const progressInterval = setInterval(() => {
      if (currentStepIndex < steps.length) {
        const step = steps[currentStepIndex]
        setCurrentStep(step.text)
        setProgress(step.progress)
        currentStepIndex++
      } else {
        clearInterval(progressInterval)
      }
    }, 200)

    // Simulate compilation time - optimized for faster loading
    const compilationTime = Math.random() * 800 + 400 // 0.4-1.2 seconds
    const finishTimeout = setTimeout(() => {
      setProgress(100)
      setCurrentStep('Hoàn thành...')
      setTimeout(() => {
        setLoading(false)
        setProgress(0)
        setCurrentStep('')
      }, 300)
    }, compilationTime)

    return () => {
      clearInterval(progressInterval)
      clearTimeout(finishTimeout)
    }
  }, [pathname])

  if (!loading) return null

  return (
    <div className="fixed top-0 left-0 right-0 z-50">
      {/* Progress bar */}
      <div className="h-1 bg-gray-200">
        <div 
          className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 transition-all duration-500 ease-out relative overflow-hidden"
          style={{ width: `${progress}%` }}
        >
          {/* Shimmer effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-pulse" />
        </div>
      </div>
      
      {/* Loading indicator */}
      <div className="bg-white/95 backdrop-blur-sm border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex space-x-1">
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
              <span className="text-sm font-medium text-gray-700">
                {currentStep}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="text-xs text-gray-500 font-mono">
                {Math.round(progress)}%
              </div>
              <div className="w-4 h-4 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Loading state for specific actions
export function ActionLoading({ loading, children }: { loading: boolean, children: React.ReactNode }) {
  if (!loading) return <>{children}</>

  return (
    <div className="relative">
      <div className="opacity-50 pointer-events-none">
        {children}
      </div>
      <div className="absolute inset-0 bg-white/90 backdrop-blur-sm flex items-center justify-center z-10 rounded-lg">
        <div className="text-center">
          <div className="w-6 h-6 border-3 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-2" />
          <p className="text-xs text-gray-600">Đang xử lý...</p>
        </div>
      </div>
    </div>
  )
}