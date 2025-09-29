import { Suspense } from "react"
import { AuthProvider } from "@/components/auth-provider"
import { Layout } from "@/components/layout"
import dynamic from "next/dynamic"

// Lazy load components for better performance
const HeroSection = dynamic(() => import("@/components/hero-section").then(mod => ({ default: mod.HeroSection })), {
  loading: () => <div className="h-96 bg-gradient-to-r from-blue-600 to-purple-600 animate-pulse rounded-lg" />
})

const FeatureCards = dynamic(() => import("@/components/feature-cards").then(mod => ({ default: mod.FeatureCards })), {
  loading: () => <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
    {[...Array(3)].map((_, i) => (
      <div key={i} className="h-64 bg-gray-200 dark:bg-gray-700 animate-pulse rounded-lg" />
    ))}
  </div>
})

const StatsSection = dynamic(() => import("@/components/feature-cards").then(mod => ({ default: mod.StatsSection })), {
  loading: () => <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
    {[...Array(4)].map((_, i) => (
      <div key={i} className="h-32 bg-gray-200 dark:bg-gray-700 animate-pulse rounded-lg" />
    ))}
  </div>
})

export default function Page() {
  return (
    <AuthProvider>
      <Layout>
        <Suspense fallback={<div className="min-h-screen bg-gray-50 dark:bg-gray-900" />}>
          <HeroSection />
          <FeatureCards />
          <StatsSection />
        </Suspense>
      </Layout>
    </AuthProvider>
  )
}
