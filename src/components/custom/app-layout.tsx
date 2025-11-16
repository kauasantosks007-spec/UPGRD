'use client'

import { ReactNode } from 'react'
import Sidebar from '@/components/custom/sidebar'
import HelpButton from '@/components/custom/help-button'

interface AppLayoutProps {
  children: ReactNode
}

export default function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      <Sidebar />
      <main className="lg:ml-64 p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
      <HelpButton />
    </div>
  )
}
