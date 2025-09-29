import { AuthProvider } from "@/components/auth-provider"
import { Layout } from "@/components/layout"
import { HomePage } from "@/components/home-page"

export default function DashboardPage() {
  return (
    <AuthProvider>
      <Layout>
        <HomePage />
      </Layout>
    </AuthProvider>
  )
}