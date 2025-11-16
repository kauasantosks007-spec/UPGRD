'use client'

import { ReactNode, useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Monitor, Target, Trophy, User, HelpCircle, TrendingUp, DollarSign, Menu, X, ChevronLeft, Users, Tag } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface AppLayoutProps {
  children: ReactNode
}

export default function AppLayout({ children }: AppLayoutProps) {
  const pathname = usePathname()
  const [userName, setUserName] = useState('')
  const [userAvatar, setUserAvatar] = useState('👤')
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)

  useEffect(() => {
    // Load user name and avatar
    const name = localStorage.getItem('upgrd_user_name') || ''
    const avatar = localStorage.getItem('upgrd_avatar') || '👤'
    setUserName(name)
    setUserAvatar(avatar)

    // Listen for storage changes (when user updates profile)
    const handleStorageChange = () => {
      const updatedName = localStorage.getItem('upgrd_user_name') || ''
      const updatedAvatar = localStorage.getItem('upgrd_avatar') || '👤'
      setUserName(updatedName)
      setUserAvatar(updatedAvatar)
    }

    window.addEventListener('storage', handleStorageChange)
    
    // Also listen for custom event (for same-tab updates)
    window.addEventListener('profileUpdated', handleStorageChange)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('profileUpdated', handleStorageChange)
    }
  }, [])

  const navItems = [
    { href: '/dashboard', icon: Home, label: 'Dashboard' },
    { href: '/setup', icon: Monitor, label: 'Meu Setup' },
    { href: '/orcamento', icon: DollarSign, label: 'Orçamento' },
    { href: '/upgrade', icon: TrendingUp, label: 'Upgrade' },
    { href: '/missoes', icon: Target, label: 'Missões' },
    { href: '/ranking', icon: Trophy, label: 'Ranking' },
    { href: '/comunidade', icon: Users, label: 'Comunidade' },
    { href: '/grupo-promo', icon: Tag, label: 'Grupo de Promo' },
    { href: '/perfil', icon: User, label: 'Perfil' },
    { href: '/ajuda', icon: HelpCircle, label: 'Ajuda IA' },
  ]

  return (
    <div className="flex min-h-screen bg-[#0A0A0A]">
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileMenuOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-40 p-2 bg-[#111111] border border-[#1A1A1A] rounded-lg text-white hover:bg-[#151515] transition-all"
      >
        <Menu className="w-6 h-6" />
      </button>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          ${isSidebarCollapsed ? 'w-20' : 'w-64'}
          bg-[#0A0A0A] border-r border-[#1A1A1A] fixed h-full overflow-y-auto z-50 transition-all duration-300
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0
        `}
      >
        <div className="p-6">
          {/* Close button for mobile */}
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="lg:hidden absolute top-4 right-4 p-2 text-white hover:bg-[#151515] rounded-lg transition-all"
          >
            <X className="w-5 h-5" />
          </button>

          <h1 className={`text-3xl font-bold bg-gradient-to-r from-[#4DE1FF] to-[#FF5BD4] bg-clip-text text-transparent mb-2 ${isSidebarCollapsed ? 'text-center' : ''}`}>
            {isSidebarCollapsed ? 'U' : 'UPGRD'}
          </h1>
          
          {/* User Info */}
          {userName && !isSidebarCollapsed && (
            <div className="mb-4 p-3 bg-[#111111] rounded-lg border border-[#1A1A1A]">
              <div className="flex items-center gap-3">
                <div className="text-3xl">{userAvatar}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-[#BEBEBE]">Olá,</p>
                  <p className="text-white font-semibold truncate">{userName}</p>
                </div>
              </div>
            </div>
          )}

          {/* Collapsed User Avatar */}
          {userName && isSidebarCollapsed && (
            <div className="mb-4 flex justify-center">
              <div className="text-3xl">{userAvatar}</div>
            </div>
          )}

          {/* Toggle Sidebar Button (Desktop only) */}
          <Button
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            className="hidden lg:flex w-full mb-4 bg-[#111111] border border-[#1A1A1A] text-white hover:bg-[#151515] transition-all justify-center items-center gap-2"
            size="sm"
          >
            <ChevronLeft className={`w-4 h-4 transition-transform ${isSidebarCollapsed ? 'rotate-180' : ''}`} />
            {!isSidebarCollapsed && <span>Esconder Menu</span>}
          </Button>

          <nav className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center ${isSidebarCollapsed ? 'justify-center' : 'gap-3'} px-4 py-3 rounded-lg transition-all ${
                    isActive
                      ? 'bg-[#151515] border-l-2 border-[#4DE1FF] text-white'
                      : 'text-[#BEBEBE] hover:text-white hover:bg-[#151515]/50'
                  }`}
                  title={isSidebarCollapsed ? item.label : ''}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'text-[#4DE1FF]' : ''}`} />
                  {!isSidebarCollapsed && <span className="font-medium">{item.label}</span>}
                </Link>
              )
            })}
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <main className={`flex-1 p-4 lg:p-8 ${isSidebarCollapsed ? 'lg:ml-20' : 'lg:ml-64'} transition-all duration-300 pt-16 lg:pt-8`}>
        {children}
      </main>
    </div>
  )
}
