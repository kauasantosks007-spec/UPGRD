'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import AppLayout from '@/components/AppLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Target, Calendar, Zap } from 'lucide-react'

interface Mission {
  id: string
  name: string
  description: string
  xp: number
  type: 'daily' | 'weekly'
  completed: boolean
}

export default function Missoes() {
  const router = useRouter()
  const [missions, setMissions] = useState<Mission[]>([])

  useEffect(() => {
    const userName = localStorage.getItem('upgrd_user_name')
    if (!userName) {
      router.push('/')
      return
    }

    initializeMissions()
  }, [router])

  const initializeMissions = () => {
    const savedMissions = localStorage.getItem('upgrd_missions')
    const lastReset = localStorage.getItem('upgrd_last_reset')
    const today = new Date().toDateString()

    const shouldReset = !lastReset || isNewWeek(new Date(lastReset), new Date())

    if (savedMissions && !shouldReset) {
      setMissions(JSON.parse(savedMissions))
    } else {
      const newMissions: Mission[] = [
        {
          id: 'd1',
          name: 'Acesse o UPGRD',
          description: 'Entre no aplicativo hoje',
          xp: 20,
          type: 'daily',
          completed: false
        },
        {
          id: 'd2',
          name: 'Visualize seu Setup',
          description: 'Acesse a página Meu Setup',
          xp: 30,
          type: 'daily',
          completed: false
        },
        {
          id: 'd3',
          name: 'Confira o Ranking',
          description: 'Veja sua posição no ranking global',
          xp: 25,
          type: 'daily',
          completed: false
        },
        {
          id: 'w1',
          name: 'Atualizar Setup Completo',
          description: 'Preencha todas as informações do seu PC',
          xp: 400,
          type: 'weekly',
          completed: false
        },
        {
          id: 'w2',
          name: 'Complete 5 Missões Diárias',
          description: 'Finalize 5 missões diárias durante a semana',
          xp: 300,
          type: 'weekly',
          completed: false
        },
        {
          id: 'w3',
          name: 'Alcance 1000 Pontos',
          description: 'Acumule 1000 pontos totais',
          xp: 500,
          type: 'weekly',
          completed: false
        }
      ]

      setMissions(newMissions)
      localStorage.setItem('upgrd_missions', JSON.stringify(newMissions))
      localStorage.setItem('upgrd_last_reset', today)
    }
  }

  const isNewWeek = (lastDate: Date, currentDate: Date): boolean => {
    const lastMonday = getMonday(lastDate)
    const currentMonday = getMonday(currentDate)
    return lastMonday.getTime() !== currentMonday.getTime()
  }

  const getMonday = (date: Date): Date => {
    const d = new Date(date)
    const day = d.getDay()
    const diff = d.getDate() - day + (day === 0 ? -6 : 1)
    return new Date(d.setDate(diff))
  }

  const completeMission = (missionId: string) => {
    const mission = missions.find(m => m.id === missionId)
    if (!mission || mission.completed) return

    const updatedMissions = missions.map(m =>
      m.id === missionId ? { ...m, completed: true } : m
    )
    setMissions(updatedMissions)
    localStorage.setItem('upgrd_missions', JSON.stringify(updatedMissions))

    const userData = JSON.parse(localStorage.getItem('upgrd_user_data') || '{}')
    const newXp = (userData.xp || 0) + mission.xp
    const newTotalPoints = (userData.totalPoints || 0) + mission.xp
    let newLevel = userData.level || 0
    let remainingXp = newXp
    let xpNeeded = userData.xpToNextLevel || 1000

    while (remainingXp >= xpNeeded) {
      remainingXp -= xpNeeded
      newLevel++
      xpNeeded = 1000 + (newLevel * 1000)
    }

    userData.level = newLevel
    userData.xp = remainingXp
    userData.xpToNextLevel = xpNeeded
    userData.totalPoints = newTotalPoints

    localStorage.setItem('upgrd_user_data', JSON.stringify(userData))

    alert(`Missão completada! +${mission.xp} XP`)
  }

  const dailyMissions = missions.filter(m => m.type === 'daily')
  const weeklyMissions = missions.filter(m => m.type === 'weekly')

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Missões</h1>
          <p className="text-[#BEBEBE]">
            Complete missões para ganhar XP e subir de nível
          </p>
        </div>

        {/* Daily Missions */}
        <div>
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-white">
            <Calendar className="w-6 h-6 text-[#4DE1FF]" />
            Missões Diárias
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {dailyMissions.map(mission => (
              <Card
                key={mission.id}
                className={`bg-[#111111] border-[#333333] hover:border-[#4DE1FF]/40 transition-all ${
                  mission.completed ? 'opacity-60' : ''
                }`}
              >
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <Target className="w-5 h-5 text-[#4DE1FF]" />
                    {mission.name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-[#BEBEBE]">{mission.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-[#D8A84E] font-semibold flex items-center gap-1">
                      <Zap className="w-4 h-4" />
                      +{mission.xp} XP
                    </span>
                    <Button
                      onClick={() => completeMission(mission.id)}
                      disabled={mission.completed}
                      size="sm"
                      className="bg-[#4DE1FF]/10 border border-[#4DE1FF] text-[#4DE1FF] hover:bg-[#4DE1FF]/20"
                    >
                      {mission.completed ? 'Completa ✓' : 'Completar'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Weekly Missions */}
        <div>
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-white">
            <Target className="w-6 h-6 text-[#4DE1FF]" />
            Missões Semanais
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {weeklyMissions.map(mission => (
              <Card
                key={mission.id}
                className={`bg-[#111111] border-[#4DE1FF]/20 hover:border-[#4DE1FF]/40 transition-all ${
                  mission.completed ? 'opacity-60' : ''
                }`}
              >
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <Target className="w-5 h-5 text-[#4DE1FF]" />
                    {mission.name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-[#BEBEBE]">{mission.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-[#D8A84E] font-semibold flex items-center gap-1 text-lg">
                      <Zap className="w-5 h-5" />
                      +{mission.xp} XP
                    </span>
                    <Button
                      onClick={() => completeMission(mission.id)}
                      disabled={mission.completed}
                      className="bg-[#4DE1FF]/10 border border-[#4DE1FF] text-[#4DE1FF] hover:bg-[#4DE1FF]/20"
                    >
                      {mission.completed ? 'Completa ✓' : 'Completar'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Reset Info */}
        <Card className="bg-[#111111] border-[#333333]">
          <CardContent className="pt-6">
            <p className="text-center text-[#BEBEBE]">
              ⏰ As missões semanais resetam toda segunda-feira às 00:00
            </p>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  )
}
