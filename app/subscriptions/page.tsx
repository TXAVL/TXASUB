import { AuthProvider } from "@/components/auth-provider"
import { Layout } from "@/components/layout"
import { SubscriptionsPage } from "@/components/subscriptions-page"

export default function Page() {
  return (
    <AuthProvider>
      <Layout>
        <SubscriptionsPage />
      </Layout>
    </AuthProvider>
  )
}
