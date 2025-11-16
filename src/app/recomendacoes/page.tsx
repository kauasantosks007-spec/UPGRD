'use client'

import { useState, useEffect } from 'react'
import AppLayout from '@/components/AppLayout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Sparkles, Cpu, DollarSign, TrendingUp, Gift, Target, Loader2 } from 'lucide-react'

interface SetupData {
  cpu: string
  gpu: string
  ram: string
  storage: string
  powerSupply: string
  monitor: string
  peripherals: string
}

export default function RecomendacoesPage() {
  const [setup, setSetup] = useState<SetupData>({
    cpu: '',
    gpu: '',
    ram: '',
    storage: '',
    powerSupply: '',
    monitor: '',
    peripherals: ''
  })
  const [budget, setBudget] = useState('')
  const [focus, setFocus] = useState('gaming')
  const [brandPreference, setBrandPreference] = useState('')
  const [recommendation, setRecommendation] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Carregar setup salvo do localStorage
  useEffect(() => {
    const savedSetup = localStorage.getItem('userSetup')
    if (savedSetup) {
      try {
        const parsed = JSON.parse(savedSetup)
        setSetup({
          cpu: parsed.cpu || '',
          gpu: parsed.gpu || '',
          ram: parsed.ram || '',
          storage: parsed.storage || '',
          powerSupply: parsed.powerSupply || parsed.psu || '',
          monitor: parsed.monitor || '',
          peripherals: parsed.peripherals || ''
        })
      } catch (e) {
        console.error('Error loading setup:', e)
      }
    }
  }, [])

  const handleGetRecommendations = async () => {
    setLoading(true)
    setError('')
    setRecommendation('')

    try {
      const response = await fetch('/api/hardware-advisor', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          setup,
          budget,
          focus,
          brandPreference
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao obter recomendações')
      }

      setRecommendation(data.recommendation)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-purple-500/20 px-4 py-2 rounded-full mb-4">
            <Sparkles className="w-5 h-5 text-purple-400" />
            <span className="text-purple-300 font-medium">IA Hardware Advisor</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 mb-3">
            Recomendações de Upgrade
          </h1>
          <p className="text-gray-400 text-lg">
            Análise inteligente do seu setup com sugestões personalizadas
          </p>
        </div>

        {/* Setup Form */}
        <Card className="bg-[#111111] border-[#1A1A1A]">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600 flex items-center gap-2">
              <Cpu className="w-6 h-6 text-cyan-400" />
              Seu Setup Atual
            </CardTitle>
            <CardDescription className="text-[#BEBEBE]">
              Preencha as informações do seu setup para receber recomendações personalizadas
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="cpu" className="text-white">CPU/Processador</Label>
                <Input
                  id="cpu"
                  value={setup.cpu}
                  onChange={(e) => setSetup({ ...setup, cpu: e.target.value })}
                  placeholder="Ex: Intel i5-12400F"
                  className="bg-[#0A0A0A] border-[#1A1A1A] text-white"
                />
              </div>

              <div>
                <Label htmlFor="gpu" className="text-white">GPU/Placa de Vídeo</Label>
                <Input
                  id="gpu"
                  value={setup.gpu}
                  onChange={(e) => setSetup({ ...setup, gpu: e.target.value })}
                  placeholder="Ex: RTX 3060 Ti"
                  className="bg-[#0A0A0A] border-[#1A1A1A] text-white"
                />
              </div>

              <div>
                <Label htmlFor="ram" className="text-white">RAM/Memória</Label>
                <Input
                  id="ram"
                  value={setup.ram}
                  onChange={(e) => setSetup({ ...setup, ram: e.target.value })}
                  placeholder="Ex: 16GB DDR4 3200MHz"
                  className="bg-[#0A0A0A] border-[#1A1A1A] text-white"
                />
              </div>

              <div>
                <Label htmlFor="storage" className="text-white">Armazenamento</Label>
                <Input
                  id="storage"
                  value={setup.storage}
                  onChange={(e) => setSetup({ ...setup, storage: e.target.value })}
                  placeholder="Ex: SSD 500GB NVMe"
                  className="bg-[#0A0A0A] border-[#1A1A1A] text-white"
                />
              </div>

              <div>
                <Label htmlFor="powerSupply" className="text-white">Fonte</Label>
                <Input
                  id="powerSupply"
                  value={setup.powerSupply}
                  onChange={(e) => setSetup({ ...setup, powerSupply: e.target.value })}
                  placeholder="Ex: 600W 80+ Bronze"
                  className="bg-[#0A0A0A] border-[#1A1A1A] text-white"
                />
              </div>

              <div>
                <Label htmlFor="monitor" className="text-white">Monitor</Label>
                <Input
                  id="monitor"
                  value={setup.monitor}
                  onChange={(e) => setSetup({ ...setup, monitor: e.target.value })}
                  placeholder="Ex: 24' 144Hz IPS"
                  className="bg-[#0A0A0A] border-[#1A1A1A] text-white"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="peripherals" className="text-white">Periféricos</Label>
              <Textarea
                id="peripherals"
                value={setup.peripherals}
                onChange={(e) => setSetup({ ...setup, peripherals: e.target.value })}
                placeholder="Ex: Mouse Logitech G203, Teclado Redragon K552"
                className="bg-[#0A0A0A] border-[#1A1A1A] text-white"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="budget" className="text-white flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-green-400" />
                  Orçamento
                </Label>
                <Input
                  id="budget"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  placeholder="Ex: 2000 ou sem limite"
                  className="bg-[#0A0A0A] border-[#1A1A1A] text-white"
                />
              </div>

              <div>
                <Label htmlFor="focus" className="text-white flex items-center gap-2">
                  <Target className="w-4 h-4 text-blue-400" />
                  Foco de Uso
                </Label>
                <Select value={focus} onValueChange={setFocus}>
                  <SelectTrigger className="bg-[#0A0A0A] border-[#1A1A1A] text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-[#111111] border-[#1A1A1A]">
                    <SelectItem value="gaming">Gaming</SelectItem>
                    <SelectItem value="edição">Edição de Vídeo</SelectItem>
                    <SelectItem value="produtividade">Produtividade</SelectItem>
                    <SelectItem value="stream">Streaming</SelectItem>
                    <SelectItem value="uso geral">Uso Geral</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="brandPreference" className="text-white">Marca Preferida</Label>
                <Input
                  id="brandPreference"
                  value={brandPreference}
                  onChange={(e) => setBrandPreference(e.target.value)}
                  placeholder="Ex: AMD, Intel, NVIDIA"
                  className="bg-[#0A0A0A] border-[#1A1A1A] text-white"
                />
              </div>
            </div>

            <Button
              onClick={handleGetRecommendations}
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-90 text-white font-semibold"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Analisando seu setup...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 mr-2" />
                  Obter Recomendações IA
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Error Message */}
        {error && (
          <Card className="bg-red-500/10 border-red-500/50">
            <CardContent className="pt-6">
              <p className="text-red-400 text-sm">{error}</p>
            </CardContent>
          </Card>
        )}

        {/* Recommendations */}
        {recommendation && (
          <Card className="bg-[#111111] border-[#1A1A1A]">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-600 flex items-center gap-2">
                <TrendingUp className="w-6 h-6 text-green-400" />
                Análise e Recomendações
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose prose-invert max-w-none">
                <pre className="whitespace-pre-wrap text-gray-300 text-sm leading-relaxed bg-[#0A0A0A] p-6 rounded-lg border border-green-500/20">
                  {recommendation}
                </pre>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </AppLayout>
  )
}
