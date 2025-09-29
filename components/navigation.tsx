"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { useAuth } from "@/components/auth-provider"
import { useTheme } from "@/components/theme-provider"
import { logout } from "@/lib/auth"
import { toast } from "@/lib/toast"
import { Home, List, User, LogOut, Sun, Moon, Monitor, Menu, X, BarChart3, Shield } from "lucide-react"

export function Navigation() {
  const { user, refreshAuth } = useAuth()
  const { theme, setTheme, actualTheme } = useTheme()
    const router = useRouter()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleLogout = async () => {
    try {
      await logout()
      await refreshAuth()
      router.push("/auth")
      toast.success("Đăng xuất thành công")
    } catch (error) {
      toast.error("Lỗi khi đăng xuất")
    }
  }

  const ThemeIcon = () => {
    if (!mounted) return <Monitor className="w-4 h-4" />
    if (theme === "system") return <Monitor className="w-4 h-4" />
    return actualTheme === "dark" ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />
  }

  return (
    <nav className="border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <Link href="/" className="text-xl font-bold text-primary">
              SubManager
            </Link>

            {user && (
              <div className="hidden md:flex space-x-4">
                <Link
                  href="/dashboard"
                  className="flex items-center space-x-2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Home className="w-4 h-4" />
                  <span>{"Dashboard"}</span>
                </Link>
                <Link
                  href="/subscriptions"
                  className="flex items-center space-x-2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <List className="w-4 h-4" />
                  <span>{"Gói đăng ký"}</span>
                </Link>
                <Link
                  href="/analytics"
                  className="flex items-center space-x-2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <BarChart3 className="w-4 h-4" />
                  <span>{"Phân tích"}</span>
                </Link>
              </div>
            )}
          </div>

          <div className="flex items-center space-x-4">
            {/* Theme Selector */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="p-2">
                  <ThemeIcon />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setTheme("light")}>
                  <Sun className="w-4 h-4 mr-2" />
                  {"Sáng"}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("dark")}>
                  <Moon className="w-4 h-4 mr-2" />
                  {"Tối"}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("system")}>
                  <Monitor className="w-4 h-4 mr-2" />
                  {"Hệ thống"}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {user ? (
              <>
                {/* Mobile Menu Button */}
                <Button
                  variant="ghost"
                  size="sm"
                  className="md:hidden p-2"
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                  {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
                </Button>

                {/* Desktop User Menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="hidden md:flex items-center space-x-2">
                      <User className="w-4 h-4" />
                      <span className="max-w-32 truncate">{user.name}</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <div className="px-2 py-1.5 text-sm text-muted-foreground">{user.email}</div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard" className="flex items-center">
                        <Home className="w-4 h-4 mr-2" />
                        {"Dashboard"}
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/profile" className="flex items-center">
                        <User className="w-4 h-4 mr-2" />
                        {"Hồ sơ"}
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/security" className="flex items-center">
                        <Shield className="w-4 h-4 mr-2" />
                        {"Bảo mật"}
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleLogout}>
                      <LogOut className="w-4 h-4 mr-2" />
                      {"Đăng xuất"}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <Button asChild>
                <Link href="/auth">{"Đăng nhập"}</Link>
              </Button>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        {user && mobileMenuOpen && (
          <div className="md:hidden border-t border-border bg-card">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link
                href="/dashboard"
                className="flex items-center space-x-2 px-3 py-2 text-muted-foreground hover:text-foreground hover:bg-accent rounded-md transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Home className="w-4 h-4" />
                <span>{"Dashboard"}</span>
              </Link>
              <Link
                href="/subscriptions"
                className="flex items-center space-x-2 px-3 py-2 text-muted-foreground hover:text-foreground hover:bg-accent rounded-md transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                <List className="w-4 h-4" />
                <span>{"Gói đăng ký"}</span>
              </Link>
              <Link
                href="/analytics"
                className="flex items-center space-x-2 px-3 py-2 text-muted-foreground hover:text-foreground hover:bg-accent rounded-md transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                <BarChart3 className="w-4 h-4" />
                <span>{"Phân tích"}</span>
              </Link>
              <Link
                href="/profile"
                className="flex items-center space-x-2 px-3 py-2 text-muted-foreground hover:text-foreground hover:bg-accent rounded-md transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                <User className="w-4 h-4" />
                <span>{"Hồ sơ"}</span>
              </Link>
              <div className="border-t border-border my-2"></div>
              <div className="px-3 py-2 text-sm text-muted-foreground">
                {user.name}
                <div className="text-xs">{user.email}</div>
              </div>
              <button
                onClick={() => {
                  handleLogout()
                  setMobileMenuOpen(false)
                }}
                className="flex items-center space-x-2 px-3 py-2 text-muted-foreground hover:text-foreground hover:bg-accent rounded-md transition-colors w-full text-left"
              >
                <LogOut className="w-4 h-4" />
                <span>{"Đăng xuất"}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
