'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import AppLayout from '@/components/AppLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Monitor, Cpu, HardDrive, MemoryStick, Save, Camera, Upload, X, Sparkles } from 'lucide-react'

interface SetupData {
  cpu: string
  gpu: string
  ram: string
  storage: string
  monitor: string
}

interface ComponentAnalysis {
  componentType: string
  brand: string
  model: string
  specs: string
  estimatedValue: string
  suggestions: string
}

interface UploadedComponent {
  id: string
  imageUrl: string
  analysis: ComponentAnalysis | null
  isAnalyzing: boolean
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
  const [uploadedComponents, setUploadedComponents] = useState<UploadedComponent[]>([])

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

    const savedComponents = localStorage.getItem('upgrd_components')
    if (savedComponents) {
      setUploadedComponents(JSON.parse(savedComponents))
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

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Create a temporary URL for the image
    const imageUrl = URL.createObjectURL(file)
    const componentId = Date.now().toString()

    // Add component to list with analyzing state
    const newComponent: UploadedComponent = {
      id: componentId,
      imageUrl,
      analysis: null,
      isAnalyzing: true
    }

    const updatedComponents = [...uploadedComponents, newComponent]
    setUploadedComponents(updatedComponents)
    localStorage.setItem('upgrd_components', JSON.stringify(updatedComponents))

    // Convert image to base64 for API
    const reader = new FileReader()
    reader.onloadend = async () => {
      const base64Image = reader.result as string

      try {
        const response = await fetch('/api/analyze-component', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            imageUrl: base64Image
          })
        })

        const data = await response.json()

        if (data.success) {
          // Update component with analysis
          const updatedComponentsWithAnalysis = updatedComponents.map(comp =>
            comp.id === componentId
              ? { ...comp, analysis: data.data, isAnalyzing: false }
              : comp
          )
          setUploadedComponents(updatedComponentsWithAnalysis)
          localStorage.setItem('upgrd_components', JSON.stringify(updatedComponentsWithAnalysis))
        } else {
          // Remove component if analysis failed
          const filteredComponents = updatedComponents.filter(comp => comp.id !== componentId)
          setUploadedComponents(filteredComponents)
          localStorage.setItem('upgrd_components', JSON.stringify(filteredComponents))
          alert('Não foi possível analisar a imagem. Tente novamente.')
        }
      } catch (error) {
        console.error('Error analyzing component:', error)
        const filteredComponents = updatedComponents.filter(comp => comp.id !== componentId)
        setUploadedComponents(filteredComponents)
        localStorage.setItem('upgrd_components', JSON.stringify(filteredComponents))
        alert('Erro ao analisar componente. Tente novamente.')
      }
    }

    reader.readAsDataURL(file)
  }

  const removeComponent = (componentId: string) => {
    const updatedComponents = uploadedComponents.filter(comp => comp.id !== componentId)
    setUploadedComponents(updatedComponents)
    localStorage.setItem('upgrd_components', JSON.stringify(updatedComponents))
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

        {/* Component Photo Analysis Section */}
        <Card className="bg-[#111111] border-[#4DE1FF]/20">
          <CardHeader>
            <CardTitle className="text-2xl text-white flex items-center gap-2">
              <Camera className="w-6 h-6 text-[#4DE1FF]" />
              Análise de Componentes por Foto
              <Sparkles className="w-5 h-5 text-[#D8A84E]" />
            </CardTitle>
            <p className="text-[#BEBEBE] text-sm mt-2">
              Tire fotos dos seus componentes e a IA identificará marca, modelo e especificações automaticamente
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Upload Button */}
            <div className="flex justify-center">
              <label htmlFor="component-upload" className="cursor-pointer">
                <div className="flex items-center gap-2 px-6 py-3 bg-[#4DE1FF]/10 border border-[#4DE1FF] text-[#4DE1FF] rounded-lg hover:bg-[#4DE1FF]/20 transition-all">
                  <Upload className="w-5 h-5" />
                  <span className="font-semibold">Adicionar Foto de Componente</span>
                </div>
                <input
                  id="component-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
            </div>

            {/* Uploaded Components Grid */}
            {uploadedComponents.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                {uploadedComponents.map(component => (
                  <Card key={component.id} className="bg-[#0A0A0A] border-[#333333] relative">
                    <Button
                      onClick={() => removeComponent(component.id)}
                      className="absolute top-2 right-2 w-8 h-8 p-0 bg-red-500/20 hover:bg-red-500/40 border border-red-500"
                      size="sm"
                    >
                      <X className="w-4 h-4 text-red-500" />
                    </Button>
                    <CardContent className="p-4">
                      <img
                        src={component.imageUrl}
                        alt="Component"
                        className="w-full h-48 object-cover rounded-lg mb-4"
                      />
                      
                      {component.isAnalyzing ? (
                        <div className="text-center py-4">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#4DE1FF] mx-auto mb-2"></div>
                          <p className="text-[#BEBEBE] text-sm">Analisando componente...</p>
                        </div>
                      ) : component.analysis ? (
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 mb-3">
                            <span className="px-3 py-1 bg-[#4DE1FF]/20 text-[#4DE1FF] rounded-full text-sm font-semibold">
                              {component.analysis.componentType}
                            </span>
                          </div>
                          
                          <div>
                            <p className="text-white font-semibold text-lg">
                              {component.analysis.brand} {component.analysis.model}
                            </p>
                          </div>
                          
                          <div className="pt-2 border-t border-[#333333]">
                            <p className="text-[#BEBEBE] text-sm mb-1">
                              <span className="text-white font-semibold">Especificações:</span>
                            </p>
                            <p className="text-[#BEBEBE] text-sm">{component.analysis.specs}</p>
                          </div>
                          
                          {component.analysis.estimatedValue && (
                            <div className="pt-2">
                              <p className="text-[#D8A84E] font-semibold">
                                Valor estimado: R$ {component.analysis.estimatedValue}
                              </p>
                            </div>
                          )}
                          
                          {component.analysis.suggestions && (
                            <div className="pt-2 border-t border-[#333333]">
                              <p className="text-[#4DE1FF] text-sm mb-1 font-semibold flex items-center gap-1">
                                <Sparkles className="w-4 h-4" />
                                Sugestões:
                              </p>
                              <p className="text-[#BEBEBE] text-sm">{component.analysis.suggestions}</p>
                            </div>
                          )}
                        </div>
                      ) : (
                        <p className="text-red-400 text-sm text-center">Falha na análise</p>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
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
