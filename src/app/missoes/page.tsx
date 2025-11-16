'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import AppLayout from '@/components/AppLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Target, Calendar, Zap, Upload, CheckCircle, X } from 'lucide-react'

interface Mission {
  id: number
  name: string
  description: string
  xp: number
  type: 'daily' | 'weekly'
  requirements: string
}

interface UserMission {
  id: number
  mission_id: number
  completed: boolean
  completed_at: string | null
  week_start: string
}

// Mock missions data
const MOCK_MISSIONS: Mission[] = [
  {
    id: 1,
    name: 'Benchmark Diário',
    description: 'Execute um benchmark no seu PC',
    xp: 50,
    type: 'daily',
    requirements: 'Rodar qualquer ferramenta de benchmark'
  },
  {
    id: 2,
    name: 'Atualizar Driver',
    description: 'Atualize um driver do sistema',
    xp: 100,
    type: 'daily',
    requirements: 'Atualizar driver de GPU, áudio ou outro componente'
  },
  {
    id: 3,
    name: 'Limpeza de Sistema',
    description: 'Faça uma limpeza completa do sistema',
    xp: 75,
    type: 'daily',
    requirements: 'Limpar arquivos temporários e cache'
  },
  {
    id: 4,
    name: 'Upgrade de Hardware',
    description: 'Instale ou upgrade um componente',
    xp: 500,
    type: 'weekly',
    requirements: 'Instalar RAM, SSD, GPU ou outro componente'
  },
  {
    id: 5,
    name: 'Otimização Completa',
    description: 'Otimize completamente seu setup',
    xp: 300,
    type: 'weekly',
    requirements: 'Aplicar múltiplas otimizações de performance'
  }
]

export default function Missoes() {
  const router = useRouter()
  const [missions] = useState<Mission[]>(MOCK_MISSIONS)
  const [userMissions, setUserMissions] = useState<UserMission[]>([])
  const [userId, setUserId] = useState<string | null>(null)
  const [userName, setUserName] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [selectedMission, setSelectedMission] = useState<Mission | null>(null)
  const [proofText, setProofText] = useState('')
  const [proofImage, setProofImage] = useState<File | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  useEffect(() => {
    initializeUser()
  }, [])

  const initializeUser = () => {
    const name = localStorage.getItem('upgrd_user_name')
    if (!name) {
      router.push('/')
      return
    }
    setUserName(name)

    // Create a temporary user ID based on name
    const tempUserId = `temp_${name.replace(/\s+/g, '_').toLowerCase()}`
    setUserId(tempUserId)

    loadMissions(tempUserId)
  }

  const loadMissions = (uid: string) => {
    // Load user mission progress from localStorage
    const currentWeekStart = getWeekStart()
    const storageKey = `user_missions_${uid}_${currentWeekStart}`
    const stored = localStorage.getItem(storageKey)
    
    if (stored) {
      setUserMissions(JSON.parse(stored))
    }
  }

  const getWeekStart = (): string => {
    const now = new Date()
    const monday = new Date(now)
    monday.setDate(now.getDate() - now.getDay() + 1)
    return monday.toISOString().split('T')[0]
  }

  const isMissionCompleted = (missionId: number): boolean => {
    return userMissions.some(um => um.mission_id === missionId && um.completed)
  }

  const handleCompleteMission = async (mission: Mission) => {
    if (mission.type === 'daily') {
      // Daily missions are auto-completed
      await completeMission(mission.id)
    } else {
      // Weekly missions require proof
      setSelectedMission(mission)
      setIsDialogOpen(true)
    }
  }

  const completeMission = async (missionId: number) => {
    if (!userId) return

    const currentWeekStart = getWeekStart()

    // Create new user mission
    const newUserMission: UserMission = {
      id: Date.now(),
      mission_id: missionId,
      completed: true,
      completed_at: new Date().toISOString(),
      week_start: currentWeekStart
    }

    const updatedMissions = [...userMissions.filter(um => um.mission_id !== missionId), newUserMission]
    setUserMissions(updatedMissions)

    // Save to localStorage
    const storageKey = `user_missions_${userId}_${currentWeekStart}`
    localStorage.setItem(storageKey, JSON.stringify(updatedMissions))

    // Award XP
    const mission = missions.find(m => m.id === missionId)
    if (mission) {
      await awardXP(mission.xp)
    }
  }

  const awardXP = async (xpAmount: number) => {
    if (!userId) return

    // Get current profile from localStorage
    const profileKey = `profile_${userId}`
    const stored = localStorage.getItem(profileKey)
    const profile = stored ? JSON.parse(stored) : { xp: 0, level: 1 }

    const newXp = profile.xp + xpAmount
    const newLevel = Math.floor(newXp / 1000) + 1

    // Update profile
    const updatedProfile = {
      ...profile,
      xp: newXp,
      level: newLevel,
      updated_at: new Date().toISOString()
    }

    localStorage.setItem(profileKey, JSON.stringify(updatedProfile))
  }

  const submitProof = async () => {
    if (!selectedMission || !proofText.trim()) return

    setIsLoading(true)

    try {
      // Call API route to verify proof with OpenAI
      const response = await fetch('/api/missions/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          missionName: selectedMission.name,
          missionRequirements: selectedMission.requirements,
          proof: proofText
        })
      })

      const data = await response.json()

      if (data.isValid) {
        await completeMission(selectedMission.id)
        setIsDialogOpen(false)
        setProofText('')
        setProofImage(null)
        alert(`Missão completada! +${selectedMission.xp} XP`)
      } else {
        alert('Prova insuficiente. Tente fornecer mais detalhes sobre como você completou a missão.')
      }
    } catch (error) {
      console.error('Error analyzing proof:', error)
      alert('Erro ao analisar prova. Tente novamente.')
    } finally {
      setIsLoading(false)
    }
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
            {dailyMissions.map(mission => {
              const completed = isMissionCompleted(mission.id)
              return (
                <Card
                  key={mission.id}
                  className={`bg-[#111111] border-[#333333] hover:border-[#4DE1FF]/40 transition-all ${
                    completed ? 'opacity-60' : ''
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
                        onClick={() => handleCompleteMission(mission)}
                        disabled={completed}
                        size="sm"
                        className={`${
                          completed
                            ? 'bg-green-600 hover:bg-green-700'
                            : 'bg-[#4DE1FF]/10 border border-[#4DE1FF] text-[#4DE1FF] hover:bg-[#4DE1FF]/20'
                        }`}
                      >
                        {completed ? (
                          <>
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Completa
                          </>
                        ) : (
                          'Completar'
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>

        {/* Weekly Missions */}
        <div>
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-white">
            <Target className="w-6 h-6 text-[#4DE1FF]" />
            Missões Semanais
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {weeklyMissions.map(mission => {
              const completed = isMissionCompleted(mission.id)
              return (
                <Card
                  key={mission.id}
                  className={`bg-[#111111] border-[#4DE1FF]/20 hover:border-[#4DE1FF]/40 transition-all ${
                    completed ? 'opacity-60' : ''
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
                        onClick={() => handleCompleteMission(mission)}
                        disabled={completed}
                        className={`${
                          completed
                            ? 'bg-green-600 hover:bg-green-700'
                            : 'bg-[#4DE1FF]/10 border border-[#4DE1FF] text-[#4DE1FF] hover:bg-[#4DE1FF]/20'
                        }`}
                      >
                        {completed ? (
                          <>
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Completa
                          </>
                        ) : (
                          'Completar'
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
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

        {/* Proof Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="bg-[#111111] border-[#1A1A1A] text-white">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold">
                Provar Conclusão da Missão
              </DialogTitle>
            </DialogHeader>
            {selectedMission && (
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-[#4DE1FF]">{selectedMission.name}</h3>
                  <p className="text-[#BEBEBE] text-sm">{selectedMission.description}</p>
                </div>

                <div>
                  <Label htmlFor="proof" className="text-white">
                    Descreva como você completou esta missão:
                  </Label>
                  <Textarea
                    id="proof"
                    value={proofText}
                    onChange={(e) => setProofText(e.target.value)}
                    placeholder="Forneça detalhes sobre como você cumpriu os requisitos da missão..."
                    className="bg-[#0A0A0A] border-[#1A1A1A] text-white mt-2"
                    rows={4}
                  />
                </div>

                <div>
                  <Label className="text-white">Imagem opcional (prova visual):</Label>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setProofImage(e.target.files?.[0] || null)}
                    className="bg-[#0A0A0A] border-[#1A1A1A] text-white mt-2"
                  />
                </div>

                <div className="flex gap-2 justify-end">
                  <Button
                    onClick={() => setIsDialogOpen(false)}
                    variant="outline"
                    className="border-[#1A1A1A] text-white hover:bg-[#1A1A1A]"
                  >
                    <X className="w-4 h-4 mr-2" />
                    Cancelar
                  </Button>
                  <Button
                    onClick={submitProof}
                    disabled={isLoading || !proofText.trim()}
                    className="bg-[#4DE1FF] hover:bg-[#3BC8E0] text-black"
                  >
                    {isLoading ? 'Analisando...' : 'Enviar Prova'}
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AppLayout>
  )
}
