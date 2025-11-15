'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import AppLayout from '@/components/AppLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Monitor, Cpu, HardDrive, MemoryStick, Save } from 'lucide-react'

interface SetupData {
  cpu: string
  gpu: string
  ram: string
  storage: string
  monitor: string
}

export default function Setup() {
  const router = useRouter()
  const [setup, setSetup] = useState<SetupData>({
    cpu: '',
    gpu: '',
    ram: '',
    storage: '',
    monitor: ''
  })
  const [setupScore, setSetupScore] = useState(0)
  const [classification, setClassification] = useState({ name: 'Bronze', color: 'text-[#CD7F32]' })

  useEffect(() => {
    const userName = localStorage.getItem('upgrd_user_name')
    if (!userName) {
      router.push('/')
      return
    }

    const savedSetup = localStorage.getItem('upgrd_setup')
    if (savedSetup) {
      const parsedSetup = JSON.parse(savedSetup)
      setSetup(parsedSetup)
      calculateScore(parsedSetup)
    }
  }, [router])

  const calculateScore = (setupData: SetupData) => {
    let score = 0

    // CPU scoring (max 300)
    if (setupData.cpu.toLowerCase().includes('i9') || setupData.cpu.toLowerCase().includes('ryzen 9')) {
      score += 300
    } else if (setupData.cpu.toLowerCase().includes('i7') || setupData.cpu.toLowerCase().includes('ryzen 7')) {
      score += 250
    } else if (setupData.cpu.toLowerCase().includes('i5') || setupData.cpu.toLowerCase().includes('ryzen 5')) {
      score += 180
    } else if (setupData.cpu) {
      score += 100
    }

    // GPU scoring (max 400)
    if (setupData.gpu.toLowerCase().includes('4090') || setupData.gpu.toLowerCase().includes('7900')) {
      score += 400
    } else if (setupData.gpu.toLowerCase().includes('4080') || setupData.gpu.toLowerCase().includes('7800')) {
      score += 350
    } else if (setupData.gpu.toLowerCase().includes('4070') || setupData.gpu.toLowerCase().includes('7700')) {
      score += 280
    } else if (setupData.gpu.toLowerCase().includes('3060') || setupData.gpu.toLowerCase().includes('6600')) {
      score += 200
    } else if (setupData.gpu) {
      score += 120
    }

    // RAM scoring (max 150)
    const ramMatch = setupData.ram.match(/(\d+)/)
    if (ramMatch) {
      const ramSize = parseInt(ramMatch[1])
      if (ramSize >= 32) score += 150
      else if (ramSize >= 16) score += 100
      else if (ramSize >= 8) score += 60
      else score += 30
    }

    // Storage scoring (max 100)
    if (setupData.storage.toLowerCase().includes('nvme') || setupData.storage.toLowerCase().includes('m.2')) {
      score += 100
    } else if (setupData.storage.toLowerCase().includes('ssd')) {
      score += 70
    } else if (setupData.storage) {
      score += 40
    }

    // Monitor scoring (max 100)
    if (setupData.monitor.toLowerCase().includes('240') || setupData.monitor.toLowerCase().includes('4k')) {
      score += 100
    } else if (setupData.monitor.toLowerCase().includes('144') || setupData.monitor.toLowerCase().includes('165')) {
      score += 80
    } else if (setupData.monitor.toLowerCase().includes('120')) {
      score += 60
    } else if (setupData.monitor) {
      score += 40
    }

    setSetupScore(score)

    // Update classification
    if (score >= 3500) {
      setClassification({ name: 'Diamante', color: 'text-[#4DE1FF]' })
    } else if (score >= 1500) {
      setClassification({ name: 'Ouro', color: 'text-[#D8A84E]' })
    } else if (score >= 500) {
      setClassification({ name: 'Prata', color: 'text-[#BEBEBE]' })
    } else {
      setClassification({ name: 'Bronze', color: 'text-[#CD7F32]' })
    }

    return score
  }

  const handleSave = () => {
    const score = calculateScore(setup)
    localStorage.setItem('upgrd_setup', JSON.stringify(setup))

    // Update user data with new setup score
    const userData = JSON.parse(localStorage.getItem('upgrd_user_data') || '{}')
    const oldScore = userData.setupScore || 0
    userData.setupScore = score

    // Award XP for updating setup
    if (oldScore === 0) {
      userData.xp = (userData.xp || 0) + 150
      userData.totalPoints = (userData.totalPoints || 0) + 150
    }

    localStorage.setItem('upgrd_user_data', JSON.stringify(userData))

    alert('Setup salvo com sucesso! +150 XP')
  }

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Meu Setup</h1>
          <p className="text-[#BEBEBE]">
            Adicione as informações do seu PC para calcular o score e receber recomendações
          </p>
        </div>

        {/* Score Display */}
        <Card className="bg-[#111111] border-[#4DE1FF]/20">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-6xl font-bold text-white mb-2">{setupScore}</div>
              <div className={`text-3xl font-semibold ${classification.color}`}>
                {classification.name}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Setup Form */}
        <Card className="bg-[#111111] border-[#333333]">
          <CardHeader>
            <CardTitle className="text-2xl text-white">Informações do PC</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="cpu" className="flex items-center gap-2 text-lg text-white">
                <Cpu className="w-5 h-5 text-[#4DE1FF]" />
                Processador
              </Label>
              <Input
                id="cpu"
                placeholder="Ex: Intel Core i7-13700K"
                value={setup.cpu}
                onChange={(e) => setSetup({ ...setup, cpu: e.target.value })}
                className="text-lg bg-[#0A0A0A] border-[#333333] text-white"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="gpu" className="flex items-center gap-2 text-lg text-white">
                <Monitor className="w-5 h-5 text-[#4DE1FF]" />
                Placa de Vídeo
              </Label>
              <Input
                id="gpu"
                placeholder="Ex: NVIDIA RTX 4070"
                value={setup.gpu}
                onChange={(e) => setSetup({ ...setup, gpu: e.target.value })}
                className="text-lg bg-[#0A0A0A] border-[#333333] text-white"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="ram" className="flex items-center gap-2 text-lg text-white">
                <MemoryStick className="w-5 h-5 text-[#4DE1FF]" />
                Memória RAM
              </Label>
              <Input
                id="ram"
                placeholder="Ex: 16GB DDR4 3200MHz"
                value={setup.ram}
                onChange={(e) => setSetup({ ...setup, ram: e.target.value })}
                className="text-lg bg-[#0A0A0A] border-[#333333] text-white"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="storage" className="flex items-center gap-2 text-lg text-white">
                <HardDrive className="w-5 h-5 text-[#4DE1FF]" />
                Armazenamento
              </Label>
              <Input
                id="storage"
                placeholder="Ex: SSD NVMe 1TB"
                value={setup.storage}
                onChange={(e) => setSetup({ ...setup, storage: e.target.value })}
                className="text-lg bg-[#0A0A0A] border-[#333333] text-white"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="monitor" className="flex items-center gap-2 text-lg text-white">
                <Monitor className="w-5 h-5 text-[#4DE1FF]" />
                Monitor (Hz, Resolução)
              </Label>
              <Input
                id="monitor"
                placeholder="Ex: 144Hz 1920x1080"
                value={setup.monitor}
                onChange={(e) => setSetup({ ...setup, monitor: e.target.value })}
                className="text-lg bg-[#0A0A0A] border-[#333333] text-white"
              />
            </div>

            <Button
              onClick={handleSave}
              className="w-full text-lg py-6 bg-[#4DE1FF]/10 border border-[#4DE1FF] text-[#4DE1FF] hover:bg-[#4DE1FF]/20 transition-all"
              size="lg"
            >
              <Save className="w-5 h-5 mr-2" />
              Salvar Setup
            </Button>
          </CardContent>
        </Card>

        {/* Score Breakdown */}
        <Card className="bg-[#111111] border-[#333333]">
          <CardHeader>
            <CardTitle className="text-white">Como o Score é Calculado</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between text-[#BEBEBE]">
              <span>Processador (CPU)</span>
              <span className="text-[#4DE1FF] font-semibold">até 300 pontos</span>
            </div>
            <div className="flex justify-between text-[#BEBEBE]">
              <span>Placa de Vídeo (GPU)</span>
              <span className="text-[#4DE1FF] font-semibold">até 400 pontos</span>
            </div>
            <div className="flex justify-between text-[#BEBEBE]">
              <span>Memória RAM</span>
              <span className="text-[#4DE1FF] font-semibold">até 150 pontos</span>
            </div>
            <div className="flex justify-between text-[#BEBEBE]">
              <span>Armazenamento</span>
              <span className="text-[#4DE1FF] font-semibold">até 100 pontos</span>
            </div>
            <div className="flex justify-between text-[#BEBEBE]">
              <span>Monitor</span>
              <span className="text-[#4DE1FF] font-semibold">até 100 pontos</span>
            </div>
            <div className="border-t border-[#333333] pt-3 mt-3 flex justify-between font-bold text-lg">
              <span className="text-white">Total Máximo</span>
              <span className="text-[#4DE1FF]">1050 pontos</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  )
}
