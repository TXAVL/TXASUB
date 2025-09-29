import { AuthProvider } from "@/components/auth-provider"
import { Layout } from "@/components/layout"
import { ProfilePage } from "@/components/profile-page"

export default function Page() {
  return (
    <AuthProvider>
      <Layout>
        <ProfilePage />
      </Layout>
    </AuthProvider>
  )
}