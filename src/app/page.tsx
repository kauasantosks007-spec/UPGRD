'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function Home() {
  const [userName, setUserName] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const savedName = localStorage.getItem('upgrd_user_name')
    if (savedName) {
      router.push('/dashboard')
    } else {
      setIsLoading(false)
    }
  }, [router])

  const handleEnter = () => {
    if (userName.trim()) {
      localStorage.setItem('upgrd_user_name', userName.trim())
      router.push('/dashboard')
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 md:h-32 md:w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-3 md:p-4 relative overflow-hidden">
      {/* Particles Background */}
      <div className="particles">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="particle"
            style={{
              left: `${Math.random() * 100}%`,
              width: `${Math.random() * 4 + 2}px`,
              height: `${Math.random() * 4 + 2}px`,
              animationDelay: `${Math.random() * 6}s`,
              animationDuration: `${Math.random() * 4 + 6}s`,
            }}
          />
        ))}
      </div>

      <Card className="w-full max-w-md bg-card/95 backdrop-blur-sm border-primary/50">
        <CardHeader className="text-center pb-4 md:pb-6">
          <CardTitle className="text-2xl md:text-3xl font-bold neon-text text-primary">
            UPGRD
          </CardTitle>
          <p className="text-sm md:text-base text-muted-foreground">
            Como você quer ser chamado na UPGRD?
          </p>
        </CardHeader>
        <CardContent className="space-y-3 md:space-y-4">
          <Input
            type="text"
            placeholder="Digite seu nome..."
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleEnter()}
            className="text-center text-base md:text-lg"
          />
          <Button
            onClick={handleEnter}
            className="w-full text-base md:text-lg py-5 md:py-6 neon-glow hover:scale-105 transition-transform"
            disabled={!userName.trim()}
          >
            Entrar no App
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
