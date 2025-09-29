"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useAuth } from "@/components/auth-provider"
import { 
  Mail, 
  Phone, 
  MapPin, 
  ArrowUp,
  Home
} from "lucide-react"

interface FooterConfig {
  socialLinks: {
    github: string
    twitter: string
    linkedin: string
    facebook: string
    youtube: string
  }
  contactInfo: {
    email: string
    phone: string
    address: string
  }
}

export function Footer() {
  const { user } = useAuth()
  const [config, setConfig] = useState<FooterConfig>({
    socialLinks: {
      github: '',
      twitter: '',
      linkedin: '',
      facebook: '',
      youtube: ''
    },
    contactInfo: {
      email: '',
      phone: '',
      address: ''
    }
  })
  const [showScrollTop, setShowScrollTop] = useState(false)
  
  useEffect(() => {
    const loadConfig = async () => {
      try {
        // Get config from server-side API (same as Gmail config)
        const response = await fetch('/api/config')
        if (response.ok) {
          const data = await response.json()
          setConfig(data)
          console.log('Footer Config from API:', data)
        } else {
          // Fallback to hardcoded values
          setConfig({
            socialLinks: {
              github: 'https://github.com/TXAVL',
              twitter: '',
              linkedin: '',
              facebook: 'https://facebook.com/vlog.txa.2311',
              youtube: 'https://youtube.com/@admintxa?sub-confirmation=1'
            },
            contactInfo: {
              email: 'txafile@gmail.com',
              phone: '+84 389 077 187',
              address: 'Hải Phòng(Hải Dương cũ), Việt Nam'
            }
          })
        }
      } catch (error) {
        console.error('Error loading footer config:', error)
        // Fallback to hardcoded values
        setConfig({
          socialLinks: {
            github: 'https://github.com/TXAVL',
            twitter: '',
            linkedin: '',
            facebook: 'https://facebook.com/vlog.txa.2311',
            youtube: 'https://youtube.com/@admintxa?sub-confirmation=1'
          },
          contactInfo: {
            email: 'txafile@gmail.com',
            phone: '+84 389 077 187',
            address: 'Hải Phòng(Hải Dương cũ), Việt Nam'
          }
        })
      }
    }
    
    loadConfig()
  }, [])

  // Scroll detection effect
  useEffect(() => {
    const handleScroll = () => {
      if (typeof window !== 'undefined') {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop
        const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight
        const scrollPercent = (scrollTop / scrollHeight) * 100
        
        // Show button when scrolled more than 5%
        setShowScrollTop(scrollPercent > 5)
      }
    }

    // Add scroll listener
    if (typeof window !== 'undefined') {
      window.addEventListener('scroll', handleScroll)
      
      // Check initial scroll position
      handleScroll()
      
      // Cleanup
      return () => window.removeEventListener('scroll', handleScroll)
    }
  }, [])
  
  const scrollToTop = () => {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }
  
  
  return (
    <footer id="main-footer" className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-2xl font-bold mb-4">Subscription Manager</h3>
            <p className="text-gray-400 mb-6 max-w-md">
              Công cụ quản lý subscription hàng đầu Việt Nam. 
              Giúp bạn theo dõi và quản lý tất cả các gói dịch vụ một cách thông minh.
            </p>
            <div className="flex space-x-4">
              {config.socialLinks.github && (
                <Button variant="outline" size="icon" className="border-gray-600 hover:bg-gray-800 group transition-all duration-300 hover:scale-110 hover:shadow-lg" asChild>
                  <a href={config.socialLinks.github} target="_blank" rel="noopener noreferrer">
                    <svg className="h-4 w-4 fill-[#333333] dark:fill-[#f0f6fc] group-hover:fill-[#58a6ff] transition-colors duration-300" viewBox="0 0 24 24">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                    </svg>
                  </a>
                </Button>
              )}
              {config.socialLinks.twitter && (
                <Button variant="outline" size="icon" className="border-gray-600 hover:bg-gray-800 group transition-all duration-300 hover:scale-110 hover:shadow-lg" asChild>
                  <a href={config.socialLinks.twitter} target="_blank" rel="noopener noreferrer">
                    <svg className="h-4 w-4 fill-[#1DA1F2] group-hover:fill-[#0d8bd9] transition-colors duration-300" viewBox="0 0 24 24">
                      <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                    </svg>
                  </a>
                </Button>
              )}
              {config.socialLinks.linkedin && (
                <Button variant="outline" size="icon" className="border-gray-600 hover:bg-gray-800 group transition-all duration-300 hover:scale-110 hover:shadow-lg" asChild>
                  <a href={config.socialLinks.linkedin} target="_blank" rel="noopener noreferrer">
                    <svg className="h-4 w-4 fill-[#0077B5] group-hover:fill-[#005885] transition-colors duration-300" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                  </a>
                </Button>
              )}
              {config.socialLinks.facebook && (
                <Button variant="outline" size="icon" className="border-gray-600 hover:bg-gray-800 group transition-all duration-300 hover:scale-110 hover:shadow-lg" asChild>
                  <a href={config.socialLinks.facebook} target="_blank" rel="noopener noreferrer">
                    <svg className="h-4 w-4 fill-[#1877F2] group-hover:fill-[#166fe5] transition-colors duration-300" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                  </a>
                </Button>
              )}
              {config.socialLinks.youtube && (
                <Button variant="outline" size="icon" className="border-gray-600 hover:bg-gray-800 group transition-all duration-300 hover:scale-110 hover:shadow-lg" asChild>
                  <a href={config.socialLinks.youtube} target="_blank" rel="noopener noreferrer">
                    <svg className="h-4 w-4 fill-[#FF0000] group-hover:fill-[#cc0000] transition-colors duration-300" viewBox="0 0 24 24">
                      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                    </svg>
                  </a>
                </Button>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Liên kết nhanh</h4>
            <ul className="space-y-2">
              <li><Link href="/" className="text-gray-400 hover:text-white transition-colors">Trang chủ</Link></li>
              {user && (
                <li><Link href="/dashboard" className="text-gray-400 hover:text-white transition-colors flex items-center gap-2">
                  <Home className="h-4 w-4" />
                  Dashboard
                </Link></li>
              )}
              <li><Link href="#features" className="text-gray-400 hover:text-white transition-colors">Tính năng</Link></li>
              <li><Link href="/privacy" className="text-gray-400 hover:text-white transition-colors">Chính sách</Link></li>
              <li><Link href="/terms" className="text-gray-400 hover:text-white transition-colors">Điều khoản</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Liên hệ</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-gray-400" />
                <a href={`mailto:${config.contactInfo.email}`} className="text-gray-400 hover:text-white transition-colors">
                  {config.contactInfo.email}
                </a>
          </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-4 w-4 text-gray-400" />
                <a href={`tel:${config.contactInfo.phone}`} className="text-gray-400 hover:text-white transition-colors">
                  {config.contactInfo.phone}
                </a>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="h-4 w-4 text-gray-400" />
                <span className="text-gray-400">{config.contactInfo.address}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom section */}
        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © {new Date().getFullYear()} Subscription Manager by TXA. Tất cả quyền được bảo lưu.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Chính sách bảo mật</a>
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Điều khoản sử dụng</a>
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Cookie</a>
            </div>
          </div>
        </div>
      </div>

      {/* Back to top button - only show when scrolled more than 5% */}
      {showScrollTop && (
        <Button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 rounded-full p-3 shadow-lg z-50 transition-opacity duration-300"
          size="icon"
        >
          <ArrowUp className="h-4 w-4" />
        </Button>
      )}
    </footer>
  )
}