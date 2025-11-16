'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import AppLayout from '@/components/AppLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Trophy, Zap, Target, Sparkles } from 'lucide-react'

interface UserData {
  name: string
  level: number
  xp: number
  xpToNextLevel: number
  setupScore: number
  totalPoints: number
  achievements: number
  totalAchievements: number
}

interface SetupData {
  cpu: string
  gpu: string
  ram: string
  storage: string
  monitor: string
}

export default function Dashboard() {
  const router = useRouter()
  const [userData, setUserData] = useState<UserData | null>(null)
  const [setupData, setSetupData] = useState<SetupData | null>(null)
  const [budget, setBudget] = useState(0)
  const [aiSuggestion, setAiSuggestion] = useState('')
  const [weeklyMission, setWeeklyMission] = useState({
    name: 'Atualizar Setup Completo',
    description: 'Adicione todas as informações do seu PC',
    xp: 400,
    completed: false
  })

  useEffect(() => {
    const userName = localStorage.getItem('upgrd_user_name')
    if (!userName) {
      router.push('/')
      return
    }

    // Load user data
    const savedData = localStorage.getItem('upgrd_user_data')
    if (savedData) {
      setUserData(JSON.parse(savedData))
    } else {
      const initialData: UserData = {
        name: userName,
        level: 0,
        xp: 0,
        xpToNextLevel: 1000,
        setupScore: 0,
        totalPoints: 0,
        achievements: 0,
        totalAchievements: 10
      }
      setUserData(initialData)
      localStorage.setItem('upgrd_user_data', JSON.stringify(initialData))
    }

    // Load setup data
    const savedSetup = localStorage.getItem('upgrd_setup')
    if (savedSetup) {
      const parsedSetup = JSON.parse(savedSetup)
      setSetupData(parsedSetup)
    }

    // Load budget from separate topic
    const savedBudget = localStorage.getItem('upgrd_budget')
    const budgetValue = savedBudget ? parseFloat(savedBudget) : 0
    setBudget(budgetValue)

    if (savedSetup && budgetValue > 0) {
      generateSmartSuggestion(JSON.parse(savedSetup), budgetValue)
    } else {
      setAiSuggestion('Complete suas informações de setup e defina seu orçamento para receber sugestões personalizadas!')
    }
  }, [router])

  const generateSmartSuggestion = (setup: SetupData, userBudget: number) => {
    // Analyze setup weaknesses
    const hasLowGPU = !setup.gpu.toLowerCase().includes('4070') && 
                      !setup.gpu.toLowerCase().includes('4080') && 
                      !setup.gpu.toLowerCase().includes('4090')
    
    const hasLowRAM = setup.ram.match(/(\d+)/) && parseInt(setup.ram.match(/(\d+)/)![1]) < 16
    
    const hasSlowStorage = !setup.storage.toLowerCase().includes('nvme') && 
                           !setup.storage.toLowerCase().includes('m.2')
    
    const hasBasicMonitor = !setup.monitor.toLowerCase().includes('144') &&
                            !setup.monitor.toLowerCase().includes('165') &&
                            !setup.monitor.toLowerCase().includes('240')

    // Generate budget-aware suggestions
    if (!userBudget) {
      setAiSuggestion('💡 Defina seu orçamento na página "Orçamento" para receber sugestões personalizadas!')
      return
    }

    if (userBudget >= 5000) {
      if (hasLowGPU) {
        setAiSuggestion('🚀 Com R$ 5.000+, você pode investir em uma RTX 4080 (R$ 8.000) para performance extrema em jogos!')
      } else {
        setAiSuggestion('⭐ Seu setup está excelente! Considere um monitor 4K 144Hz (R$ 3.500) para aproveitar ao máximo sua GPU.')
      }
    } else if (userBudget >= 3000) {
      if (hasLowGPU) {
        setAiSuggestion('🎮 Priorize uma RTX 4070 (R$ 4.500) - melhor custo-benefício para jogos em alta qualidade!')
      } else if (hasBasicMonitor) {
        setAiSuggestion('🖥️ Seu PC está ótimo! Invista em um monitor 165Hz 1440p (R$ 1.800) para melhor experiência visual.')
      } else {
        setAiSuggestion('✨ Setup equilibrado! Considere 32GB de RAM (R$ 1.200) para multitarefa pesada e streaming.')
      }
    } else if (userBudget >= 1500) {
      if (hasLowGPU) {
        setAiSuggestion('🎯 Foque em uma RTX 3060 (R$ 2.000) - excelente para jogos em Full HD com alta taxa de FPS!')
      } else if (hasLowRAM) {
        setAiSuggestion('⚡ Upgrade para 16GB de RAM (R$ 350) vai eliminar travamentos e melhorar multitarefa!')
      } else if (hasSlowStorage) {
        setAiSuggestion('💾 Um SSD NVMe 500GB (R$ 350) vai reduzir tempos de carregamento em até 5x!')
      } else {
        setAiSuggestion('🎮 Considere um monitor 144Hz Full HD (R$ 900) para aproveitar melhor seu setup!')
      }
    } else if (userBudget >= 500) {
      if (hasLowRAM) {
        setAiSuggestion('🔧 Prioridade: +8GB de RAM (R$ 180) - upgrade mais impactante para seu orçamento!')
      } else if (hasSlowStorage) {
        setAiSuggestion('💿 Um SSD SATA 240GB (R$ 180) vai transformar a velocidade do seu sistema!')
      } else {
        setAiSuggestion('🖱️ Invista em periféricos: mouse gamer (R$ 120) + mousepad (R$ 60) melhoram muito a experiência!')
      }
    } else {
      setAiSuggestion('🛠️ Faça manutenção: limpeza interna, troca de pasta térmica (R$ 40) e otimize drivers para melhor performance!')
    }
  }

  const getClassification = (score: number) => {
    if (score >= 3500) return { name: 'Diamante', color: 'text-[#4DE1FF]' }
    if (score >= 1500) return { name: 'Ouro', color: 'text-[#D8A84E]' }
    if (score >= 500) return { name: 'Prata', color: 'text-[#BEBEBE]' }
    return { name: 'Bronze', color: 'text-[#CD7F32]' }
  }

  const completeMission = () => {
    if (!userData || weeklyMission.completed) return

    const newXp = userData.xp + weeklyMission.xp
    const newTotalPoints = userData.totalPoints + weeklyMission.xp
    let newLevel = userData.level
    let remainingXp = newXp
    let xpNeeded = userData.xpToNextLevel

    // Level up logic
    while (remainingXp >= xpNeeded) {
      remainingXp -= xpNeeded
      newLevel++
      xpNeeded = 1000 + (newLevel * 1000)
    }

    const updatedData = {
      ...userData,
      level: newLevel,
      xp: remainingXp,
      xpToNextLevel: xpNeeded,
      totalPoints: newTotalPoints
    }

    setUserData(updatedData)
    localStorage.setItem('upgrd_user_data', JSON.stringify(updatedData))
    setWeeklyMission({ ...weeklyMission, completed: true })
  }

  const generateNewSuggestion = () => {
    if (setupData && budget > 0) {
      generateSmartSuggestion(setupData, budget)
    } else {
      const suggestions = [
        'Complete suas informações de setup para receber sugestões personalizadas',
        'Defina seu orçamento na página "Orçamento" para receber recomendações baseadas no que você pode investir',
        'Complete suas missões diárias para ganhar XP extra e subir de nível',
        'Visite a página "Meu Setup" e preencha todas as informações do seu PC'
      ]
      setAiSuggestion(suggestions[Math.floor(Math.random() * suggestions.length)])
    }
  }

  if (!userData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#4DE1FF]"></div>
      </div>
    )
  }

  const classification = getClassification(userData.setupScore)
  const xpPercentage = (userData.xp / userData.xpToNextLevel) * 100

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            Bem-vindo, {userData.name}
          </h1>
          <p className="text-[#BEBEBE]">
            Continue progredindo e desbloqueie novas conquistas
          </p>
        </div>

        {/* Top Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Level Card */}
          <Card className="bg-[#111111] border-[#4DE1FF]/20 hover:border-[#4DE1FF]/40 transition-all">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg text-white">
                <Zap className="w-5 h-5 text-[#4DE1FF]" />
                Nível
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-[#4DE1FF] mb-4">{userData.level}</div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-[#BEBEBE]">
                  <span>XP: {userData.xp}</span>
                  <span>{userData.xpToNextLevel}</span>
                </div>
                <Progress value={xpPercentage} className="h-2 bg-[#1A1A1A]" />
              </div>
            </CardContent>
          </Card>

          {/* Setup Score Card */}
          <Card className="bg-[#111111] border-[#FF5BD4]/20 hover:border-[#FF5BD4]/40 transition-all">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg text-white">
                <Trophy className="w-5 h-5 text-[#FF5BD4]" />
                Setup Score
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-white mb-2">{userData.setupScore}</div>
              <div className={`text-xl font-semibold ${classification.color}`}>
                {classification.name}
              </div>
            </CardContent>
          </Card>

          {/* Total Points Card */}
          <Card className="bg-[#111111] border-[#D8A84E]/20 hover:border-[#D8A84E]/40 transition-all">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg text-white">
                <Target className="w-5 h-5 text-[#D8A84E]" />
                Pontos Totais
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-[#D8A84E]">{userData.totalPoints}</div>
              <p className="text-sm text-[#BEBEBE] mt-2">Acumulados</p>
            </CardContent>
          </Card>

          {/* Achievements Card */}
          <Card className="bg-[#111111] border-[#FF5BD4]/20 hover:border-[#FF5BD4]/40 transition-all">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg text-white">
                <Sparkles className="w-5 h-5 text-[#FF5BD4]" />
                Conquistas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-white">
                {userData.achievements}/{userData.totalAchievements}
              </div>
              <p className="text-sm text-[#BEBEBE] mt-2">Desbloqueadas</p>
            </CardContent>
          </Card>
        </div>

        {/* Weekly Mission */}
        <Card className="bg-[#111111] border-[#4DE1FF]/20">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-2 text-white">
              <Target className="w-6 h-6 text-[#4DE1FF]" />
              Missão Semanal
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h3 className="text-xl font-semibold mb-2 text-white">{weeklyMission.name}</h3>
                <p className="text-[#BEBEBE] mb-2">{weeklyMission.description}</p>
                <p className="text-[#4DE1FF] font-semibold">+{weeklyMission.xp} XP</p>
              </div>
              <Button
                onClick={completeMission}
                disabled={weeklyMission.completed}
                className="bg-[#4DE1FF]/10 border border-[#4DE1FF] text-[#4DE1FF] hover:bg-[#4DE1FF]/20 transition-all"
                size="lg"
              >
                {weeklyMission.completed ? 'Completada ✓' : 'Completar Missão'}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* AI Suggestion */}
        <Card className="bg-[#111111] border-[#4DE1FF]/20">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-2 text-white">
              <Sparkles className="w-6 h-6 text-[#4DE1FF]" />
              Sugestão da IA
              {budget > 0 && (
                <span className="text-sm font-normal text-[#D8A84E] ml-2">
                  (Baseado no seu orçamento de R$ {budget.toLocaleString('pt-BR')})
                </span>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between gap-4">
              <p className="text-lg flex-1 text-[#BEBEBE]">
                {aiSuggestion}
              </p>
              <Button
                onClick={generateNewSuggestion}
                className="bg-transparent border border-[#4DE1FF] text-[#4DE1FF] hover:bg-[#4DE1FF]/10 transition-all whitespace-nowrap"
                size="lg"
              >
                Nova Sugestão
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  )
}
