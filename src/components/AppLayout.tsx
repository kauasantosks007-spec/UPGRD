'use client'

import { ReactNode, useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Monitor, Target, Trophy, User, HelpCircle, TrendingUp, DollarSign } from 'lucide-react'

interface AppLayoutProps {
  children: ReactNode
}

export default function AppLayout({ children }: AppLayoutProps) {
  const pathname = usePathname()
  const [userName, setUserName] = useState('')
  const [userAvatar, setUserAvatar] = useState('👤')

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
    { href: '/perfil', icon: User, label: 'Perfil' },
    { href: '/ajuda', icon: HelpCircle, label: 'Ajuda IA' },
  ]

  return (
    <div className="flex min-h-screen bg-[#0A0A0A]">
      {/* Sidebar */}
      <aside className="w-64 bg-[#0A0A0A] border-r border-[#1A1A1A] fixed h-full overflow-y-auto">
        <div className="p-6">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-[#4DE1FF] to-[#FF5BD4] bg-clip-text text-transparent mb-2">
            UPGRD
          </h1>
          
          {/* User Info */}
          {userName && (
            <div className="mb-6 p-3 bg-[#111111] rounded-lg border border-[#1A1A1A]">
              <div className="flex items-center gap-3">
                <div className="text-3xl">{userAvatar}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-[#BEBEBE]">Olá,</p>
                  <p className="text-white font-semibold truncate">{userName}</p>
                </div>
              </div>
            </div>
          )}

          <nav className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                    isActive
                      ? 'bg-[#151515] border-l-2 border-[#4DE1FF] text-white'
                      : 'text-[#BEBEBE] hover:text-white hover:bg-[#151515]/50'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'text-[#4DE1FF]' : ''}`} />
                  <span className="font-medium">{item.label}</span>
                </Link>
              )
            })}
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-64 flex-1 p-8">
        {children}
      </main>
    </div>
  )
}
