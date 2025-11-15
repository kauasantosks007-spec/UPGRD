'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import AppLayout from '@/components/AppLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  TrendingUp, 
  Zap, 
  DollarSign, 
  Cpu, 
  Monitor, 
  HardDrive,
  MemoryStick,
  Sparkles,
  ChevronRight,
  AlertCircle
} from 'lucide-react'

interface SetupData {
  cpu: string
  gpu: string
  ram: string
  storage: string
  monitor: string
}

interface UpgradeRecommendation {
  id: string
  component: string
  icon: any
  currentItem: string
  recommendedItem: string
  price: string
  priority: 'Alta' | 'Média' | 'Baixa'
  impact: string
  reason: string
  color: string
}

export default function Upgrade() {
  const router = useRouter()
  const [setupData, setSetupData] = useState<SetupData | null>(null)
  const [recommendations, setRecommendations] = useState<UpgradeRecommendation[]>([])
  const [budget, setBudget] = useState(0)

  useEffect(() => {
    const userName = localStorage.getItem('upgrd_user_name')
    if (!userName) {
      router.push('/')
      return
    }

    const savedSetup = localStorage.getItem('upgrd_setup')
    if (savedSetup) {
      const parsedSetup = JSON.parse(savedSetup)
      setSetupData(parsedSetup)
      
      // Get budget from separate "Orçamento" topic
      const savedBudget = localStorage.getItem('upgrd_budget')
      const budgetValue = savedBudget ? parseFloat(savedBudget) : 0
      setBudget(budgetValue)
      
      generateRecommendations(parsedSetup, budgetValue)
    }
  }, [router])

  const generateRecommendations = (setup: SetupData, userBudget: number) => {
    const recs: UpgradeRecommendation[] = []

    // Analyze GPU
    const hasLowGPU = !setup.gpu.toLowerCase().includes('4070') && 
                      !setup.gpu.toLowerCase().includes('4080') && 
                      !setup.gpu.toLowerCase().includes('4090') &&
                      !setup.gpu.toLowerCase().includes('3080') &&
                      !setup.gpu.toLowerCase().includes('3090')

    if (hasLowGPU) {
      if (userBudget >= 5000) {
        recs.push({
          id: 'gpu-high',
          component: 'Placa de Vídeo',
          icon: Cpu,
          currentItem: setup.gpu || 'Não informado',
          recommendedItem: 'NVIDIA RTX 4080',
          price: 'R$ 8.000',
          priority: 'Alta',
          impact: '+150% performance em jogos',
          reason: 'Sua GPU atual limita o potencial do seu setup. A RTX 4080 oferece ray tracing avançado e 4K nativo.',
          color: '#4DE1FF'
        })
      } else if (userBudget >= 3000) {
        recs.push({
          id: 'gpu-mid',
          component: 'Placa de Vídeo',
          icon: Cpu,
          currentItem: setup.gpu || 'Não informado',
          recommendedItem: 'NVIDIA RTX 4070',
          price: 'R$ 4.500',
          priority: 'Alta',
          impact: '+100% performance em jogos',
          reason: 'Melhor custo-benefício para jogos em alta qualidade. Roda tudo em Full HD/1440p com ray tracing.',
          color: '#4DE1FF'
        })
      } else if (userBudget >= 1500) {
        recs.push({
          id: 'gpu-entry',
          component: 'Placa de Vídeo',
          icon: Cpu,
          currentItem: setup.gpu || 'Não informado',
          recommendedItem: 'NVIDIA RTX 3060',
          price: 'R$ 2.000',
          priority: 'Alta',
          impact: '+80% performance em jogos',
          reason: 'Excelente para jogos em Full HD com alta taxa de FPS. Suporta ray tracing básico.',
          color: '#4DE1FF'
        })
      }
    }

    // Analyze RAM
    const ramMatch = setup.ram.match(/(\d+)/)
    const ramSize = ramMatch ? parseInt(ramMatch[1]) : 0
    
    if (ramSize < 16 && userBudget >= 500) {
      recs.push({
        id: 'ram-upgrade',
        component: 'Memória RAM',
        icon: MemoryStick,
        currentItem: setup.ram || 'Não informado',
        recommendedItem: ramSize < 8 ? '16GB DDR4 3200MHz' : '32GB DDR4 3200MHz',
        price: ramSize < 8 ? 'R$ 350' : 'R$ 1.200',
        priority: ramSize < 8 ? 'Alta' : 'Média',
        impact: ramSize < 8 ? 'Elimina travamentos e melhora multitarefa' : 'Ideal para streaming e edição',
        reason: ramSize < 8 
          ? 'RAM insuficiente causa travamentos em jogos modernos e multitarefa.'
          : 'Mais RAM permite rodar jogos, Discord, OBS e navegador simultaneamente.',
        color: '#FF5BD4'
      })
    }

    // Analyze Storage
    const hasSlowStorage = !setup.storage.toLowerCase().includes('nvme') && 
                           !setup.storage.toLowerCase().includes('m.2')

    if (hasSlowStorage && userBudget >= 500) {
      if (userBudget >= 1500) {
        recs.push({
          id: 'storage-high',
          component: 'Armazenamento',
          icon: HardDrive,
          currentItem: setup.storage || 'Não informado',
          recommendedItem: 'SSD NVMe 1TB Gen4',
          price: 'R$ 600',
          priority: 'Média',
          impact: 'Carregamentos 7x mais rápidos',
          reason: 'SSD NVMe Gen4 oferece velocidades de até 7000MB/s, ideal para jogos de nova geração.',
          color: '#D8A84E'
        })
      } else {
        recs.push({
          id: 'storage-entry',
          component: 'Armazenamento',
          icon: HardDrive,
          currentItem: setup.storage || 'Não informado',
          recommendedItem: 'SSD NVMe 500GB',
          price: 'R$ 350',
          priority: 'Alta',
          impact: 'Carregamentos 5x mais rápidos',
          reason: 'Upgrade mais impactante para velocidade do sistema. Reduz boot para 10 segundos.',
          color: '#D8A84E'
        })
      }
    }

    // Analyze Monitor
    const hasBasicMonitor = !setup.monitor.toLowerCase().includes('144') &&
                            !setup.monitor.toLowerCase().includes('165') &&
                            !setup.monitor.toLowerCase().includes('240')

    if (hasBasicMonitor && userBudget >= 1000) {
      if (userBudget >= 3000) {
        recs.push({
          id: 'monitor-high',
          component: 'Monitor',
          icon: Monitor,
          currentItem: setup.monitor || 'Não informado',
          recommendedItem: 'Monitor 1440p 165Hz IPS',
          price: 'R$ 1.800',
          priority: 'Média',
          impact: 'Imagens mais nítidas e fluidas',
          reason: 'Resolução 1440p oferece 77% mais pixels que Full HD. 165Hz garante fluidez extrema.',
          color: '#4DE1FF'
        })
      } else {
        recs.push({
          id: 'monitor-entry',
          component: 'Monitor',
          icon: Monitor,
          currentItem: setup.monitor || 'Não informado',
          recommendedItem: 'Monitor Full HD 144Hz',
          price: 'R$ 900',
          priority: 'Baixa',
          impact: 'Jogos mais fluidos e responsivos',
          reason: '144Hz reduz motion blur e melhora precisão em jogos competitivos.',
          color: '#4DE1FF'
        })
      }
    }

    // CPU Analysis
    const hasOldCPU = setup.cpu.toLowerCase().includes('i3') || 
                      setup.cpu.toLowerCase().includes('i5') && !setup.cpu.includes('12') && !setup.cpu.includes('13') ||
                      setup.cpu.toLowerCase().includes('ryzen 3') ||
                      setup.cpu.toLowerCase().includes('ryzen 5') && !setup.cpu.includes('5600')

    if (hasOldCPU && userBudget >= 2000) {
      if (userBudget >= 4000) {
        recs.push({
          id: 'cpu-high',
          component: 'Processador',
          icon: Cpu,
          currentItem: setup.cpu || 'Não informado',
          recommendedItem: 'Intel i7-13700K ou Ryzen 7 7700X',
          price: 'R$ 2.200',
          priority: 'Média',
          impact: '+60% performance em jogos e produtividade',
          reason: 'CPUs modernos oferecem mais cores, melhor eficiência e suporte a tecnologias recentes.',
          color: '#FF5BD4'
        })
      } else {
        recs.push({
          id: 'cpu-mid',
          component: 'Processador',
          icon: Cpu,
          currentItem: setup.cpu || 'Não informado',
          recommendedItem: 'Intel i5-13400F ou Ryzen 5 5600X',
          price: 'R$ 1.100',
          priority: 'Baixa',
          impact: '+40% performance geral',
          reason: 'Excelente custo-benefício para jogos. Elimina gargalos em GPUs modernas.',
          color: '#FF5BD4'
        })
      }
    }

    // Sort by priority
    const priorityOrder = { 'Alta': 0, 'Média': 1, 'Baixa': 2 }
    recs.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority])

    setRecommendations(recs)
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Alta': return 'bg-red-500/10 text-red-500 border-red-500/20'
      case 'Média': return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'
      case 'Baixa': return 'bg-green-500/10 text-green-500 border-green-500/20'
      default: return 'bg-gray-500/10 text-gray-500 border-gray-500/20'
    }
  }

  if (!setupData) {
    return (
      <AppLayout>
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
          <AlertCircle className="w-16 h-16 text-[#4DE1FF] mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">
            Complete seu Setup Primeiro
          </h2>
          <p className="text-[#BEBEBE] mb-6 max-w-md">
            Para receber recomendações personalizadas de upgrade, você precisa adicionar as informações do seu PC.
          </p>
          <Button
            onClick={() => router.push('/setup')}
            className="bg-[#4DE1FF] text-black hover:bg-[#4DE1FF]/90 transition-all"
            size="lg"
          >
            Ir para Meu Setup
          </Button>
        </div>
      </AppLayout>
    )
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
            <TrendingUp className="w-10 h-10 text-[#4DE1FF]" />
            Recomendações de Upgrade
          </h1>
          <p className="text-[#BEBEBE]">
            Análise inteligente baseada no seu setup e orçamento disponível
          </p>
        </div>

        {/* Budget Info */}
        <Card className="bg-gradient-to-r from-[#4DE1FF]/10 to-[#FF5BD4]/10 border-[#4DE1FF]/20">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-4 bg-[#D8A84E]/20 rounded-xl">
                  <DollarSign className="w-8 h-8 text-[#D8A84E]" />
                </div>
                <div>
                  <p className="text-sm text-[#BEBEBE] mb-1">Orçamento Disponível</p>
                  <p className="text-3xl font-bold text-white">
                    {budget > 0 ? `R$ ${budget.toLocaleString('pt-BR')}` : 'Não definido'}
                  </p>
                </div>
              </div>
              <Button
                onClick={() => router.push('/orcamento')}
                className="bg-transparent border border-[#4DE1FF] text-[#4DE1FF] hover:bg-[#4DE1FF]/10 transition-all"
              >
                {budget > 0 ? 'Atualizar Orçamento' : 'Definir Orçamento'}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Recommendations */}
        {budget === 0 ? (
          <Card className="bg-[#111111] border-yellow-500/20">
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <AlertCircle className="w-6 h-6 text-yellow-500 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">
                    Defina seu Orçamento
                  </h3>
                  <p className="text-[#BEBEBE] mb-4">
                    Para receber recomendações personalizadas e realistas, adicione quanto você pode investir em upgrades na página "Orçamento".
                  </p>
                  <Button
                    onClick={() => router.push('/orcamento')}
                    className="bg-yellow-500/10 border border-yellow-500 text-yellow-500 hover:bg-yellow-500/20 transition-all"
                  >
                    Definir Orçamento
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : recommendations.length === 0 ? (
          <Card className="bg-[#111111] border-green-500/20">
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <Sparkles className="w-6 h-6 text-green-500 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">
                    Setup Excelente!
                  </h3>
                  <p className="text-[#BEBEBE]">
                    Seu setup está muito bem equilibrado para o seu orçamento atual. Continue aproveitando e fique de olho em promoções!
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-[#4DE1FF]" />
                {recommendations.length} Recomendações Encontradas
              </h2>
            </div>

            {recommendations.map((rec) => {
              const IconComponent = rec.icon
              return (
                <Card 
                  key={rec.id} 
                  className="bg-[#111111] border-[#4DE1FF]/20 hover:border-[#4DE1FF]/40 transition-all group"
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4">
                        <div 
                          className="p-3 rounded-xl"
                          style={{ backgroundColor: `${rec.color}20` }}
                        >
                          <IconComponent 
                            className="w-6 h-6" 
                            style={{ color: rec.color }}
                          />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <CardTitle className="text-xl text-white">
                              {rec.component}
                            </CardTitle>
                            <Badge className={`${getPriorityColor(rec.priority)} border`}>
                              Prioridade {rec.priority}
                            </Badge>
                          </div>
                          <div className="space-y-2 text-sm">
                            <div>
                              <span className="text-[#BEBEBE]">Atual: </span>
                              <span className="text-white">{rec.currentItem}</span>
                            </div>
                            <div>
                              <span className="text-[#BEBEBE]">Recomendado: </span>
                              <span className="text-[#4DE1FF] font-semibold">{rec.recommendedItem}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-[#D8A84E]">{rec.price}</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-start gap-2">
                        <Zap className="w-5 h-5 text-[#4DE1FF] flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm text-[#BEBEBE] mb-1">Impacto</p>
                          <p className="text-white font-semibold">{rec.impact}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <AlertCircle className="w-5 h-5 text-[#FF5BD4] flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm text-[#BEBEBE] mb-1">Por que fazer esse upgrade?</p>
                          <p className="text-white">{rec.reason}</p>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-[#1A1A1A]">
                      <Button
                        className="w-full bg-transparent border border-[#4DE1FF] text-[#4DE1FF] hover:bg-[#4DE1FF]/10 transition-all group-hover:bg-[#4DE1FF]/10"
                      >
                        Ver Onde Comprar
                        <ChevronRight className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}

        {/* Tips Card */}
        <Card className="bg-gradient-to-r from-[#FF5BD4]/10 to-[#4DE1FF]/10 border-[#FF5BD4]/20">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2 text-white">
              <Sparkles className="w-5 h-5 text-[#FF5BD4]" />
              Dicas Inteligentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3 text-[#BEBEBE]">
              <li className="flex items-start gap-2">
                <ChevronRight className="w-5 h-5 text-[#4DE1FF] flex-shrink-0 mt-0.5" />
                <span>Priorize upgrades com "Prioridade Alta" - eles têm maior impacto no desempenho</span>
              </li>
              <li className="flex items-start gap-2">
                <ChevronRight className="w-5 h-5 text-[#4DE1FF] flex-shrink-0 mt-0.5" />
                <span>Aguarde promoções como Black Friday para economizar até 40% nos componentes</span>
              </li>
              <li className="flex items-start gap-2">
                <ChevronRight className="w-5 h-5 text-[#4DE1FF] flex-shrink-0 mt-0.5" />
                <span>Faça upgrades gradualmente - não precisa trocar tudo de uma vez</span>
              </li>
              <li className="flex items-start gap-2">
                <ChevronRight className="w-5 h-5 text-[#4DE1FF] flex-shrink-0 mt-0.5" />
                <span>Verifique compatibilidade antes de comprar - especialmente placa-mãe e processador</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  )
}
