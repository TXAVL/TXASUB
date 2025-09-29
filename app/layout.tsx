import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { NotificationContainer } from "@/components/custom-notification"
import "./globals.css"
import { Suspense } from "react"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/components/auth-provider"
import { ModalProvider } from "@/components/modal-provider"
import { NavigationLoading } from "@/components/navigation-loading"

export const metadata: Metadata = {
  title: "Subscription Manager",
  description: "Quản lý gói đăng ký của bạn",
  generator: "v0.app",
}

export const viewport = {
  width: "device-width",
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Digital+7:wght@400&display=swap" rel="stylesheet" />
      </head>
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable} antialiased scroll-smooth`}>
        <ThemeProvider>
          <AuthProvider>
            <ModalProvider>
              <NavigationLoading />
              <Suspense fallback={null}>{children}</Suspense>
            <NotificationContainer />
            </ModalProvider>
          </AuthProvider>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}
