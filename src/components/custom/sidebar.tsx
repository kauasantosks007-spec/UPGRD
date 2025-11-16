'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  LayoutDashboard, 
  Monitor, 
  Trophy, 
  Award, 
  Target, 
  Sparkles, 
  User,
  Menu,
  X
} from 'lucide-react'
import { Button } from '@/components/ui/button'

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Setup', href: '/setup', icon: Monitor },
  { name: 'Ranking', href: '/ranking', icon: Trophy },
  { name: 'Conquistas', href: '/conquistas', icon: Award },
  { name: 'Missões Semanais', href: '/missoes', icon: Target },
  { name: 'Especialistas IA', href: '/especialistas', icon: Sparkles },
  { name: 'Perfil', href: '/perfil', icon: User },
]

export default function Sidebar() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      {/* Mobile Menu Button */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 bg-[#111111] border border-[#2A2A2A] hover:bg-[#1A1A1A]"
        size="icon"
      >
        {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </Button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-full w-64 bg-[#0A0A0A] border-r border-[#1A1A1A] z-40
          transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0
        `}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-[#1A1A1A]">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-[#4DE1FF] to-[#FF5BD4] bg-clip-text text-transparent">
              UPGRD
            </h1>
            <p className="text-xs text-[#666666] mt-1">Premium Tech Platform</p>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            {navigation.map((item) => {
              const isActive = pathname === item.href
              const Icon = item.icon

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={`
                    flex items-center gap-3 px-4 py-3 rounded-lg transition-all
                    ${
                      isActive
                        ? 'bg-[#4DE1FF]/10 text-[#4DE1FF] border border-[#4DE1FF]/20'
                        : 'text-[#BEBEBE] hover:bg-[#1A1A1A] hover:text-white'
                    }
                  `}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.name}</span>
                </Link>
              )
            })}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-[#1A1A1A]">
            <p className="text-xs text-[#666666] text-center">
              © 2024 UPGRD Platform
            </p>
          </div>
        </div>
      </aside>
    </>
  )
}
