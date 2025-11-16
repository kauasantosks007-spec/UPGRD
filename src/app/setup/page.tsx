'use client'

import { useState, useEffect } from 'react'
import AppLayout from '@/components/AppLayout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Sparkles, TrendingUp, Loader2 } from 'lucide-react'

export default function SetupPage() {
  const [setup, setSetup] = useState({
    cpu: '',
    gpu: '',
    ram: '',
    storage: '',
    psu: '',
    monitor: '',
    peripherals: ''
  })

  const [analysisParams, setAnalysisParams] = useState({
    budget: '',
    focus: 'gaming',
    brand: ''
  })

  const [analysis, setAnalysis] = useState('')
  const [marketAnalysis, setMarketAnalysis] = useState('')
  const [loading, setLoading] = useState(false)
  const [marketLoading, setMarketLoading] = useState(false)

  useEffect(() => {
    const savedSetup = localStorage.getItem('userSetup')
    if (savedSetup) {
      setSetup(JSON.parse(savedSetup))
    }
  }, [])

  const handleSave = () => {
    localStorage.setItem('userSetup', JSON.stringify(setup))
    alert('Setup salvo com sucesso!')
  }

  const handleAnalyze = async () => {
    setLoading(true)
    setAnalysis('')
    
    try {
      const response = await fetch('/api/analyze-setup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          setup,
          budget: analysisParams.budget,
          focus: analysisParams.focus,
          brand: analysisParams.brand
        })
      })

      const data = await response.json()
      
      if (data.error) {
        setAnalysis(`Erro: ${data.error}`)
      } else {
        setAnalysis(data.analysis)
      }
    } catch (error) {
      setAnalysis('Erro ao conectar com a API. Verifique se a chave da OpenAI está configurada.')
    } finally {
      setLoading(false)
    }
  }

  const handleMarketAnalysis = async () => {
    setMarketLoading(true)
    setMarketAnalysis('')
    
    try {
      const response = await fetch('/api/market-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category: null,
          budget: analysisParams.budget
        })
      })

      const data = await response.json()
      
      if (data.error) {
        setMarketAnalysis(`Erro: ${data.error}`)
      } else {
        setMarketAnalysis(data.analysis)
      }
    } catch (error) {
      setMarketAnalysis('Erro ao conectar com a API. Verifique se a chave da OpenAI está configurada.')
    } finally {
      setMarketLoading(false)
    }
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Card Principal - Setup */}
        <Card className="bg-[#111111] border-[#1A1A1A]">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#4DE1FF] to-[#FF5BD4]">
              Meu Setup
            </CardTitle>
            <CardDescription className="text-[#BEBEBE]">
              Configure seu setup para receber recomendações personalizadas de upgrade
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Formulário de Setup */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="cpu" className="text-white">CPU/Processador</Label>
                <Input
                  id="cpu"
                  placeholder="Ex: Intel Core i5-12400F"
                  value={setup.cpu}
                  onChange={(e) => setSetup({ ...setup, cpu: e.target.value })}
                  className="bg-[#0A0A0A] border-[#1A1A1A] text-white"
                />
              </div>

              <div>
                <Label htmlFor="gpu" className="text-white">GPU/Placa de Vídeo</Label>
                <Input
                  id="gpu"
                  placeholder="Ex: NVIDIA RTX 3060"
                  value={setup.gpu}
                  onChange={(e) => setSetup({ ...setup, gpu: e.target.value })}
                  className="bg-[#0A0A0A] border-[#1A1A1A] text-white"
                />
              </div>

              <div>
                <Label htmlFor="ram" className="text-white">RAM/Memória</Label>
                <Input
                  id="ram"
                  placeholder="Ex: 16GB DDR4 3200MHz"
                  value={setup.ram}
                  onChange={(e) => setSetup({ ...setup, ram: e.target.value })}
                  className="bg-[#0A0A0A] border-[#1A1A1A] text-white"
                />
              </div>

              <div>
                <Label htmlFor="storage" className="text-white">Armazenamento</Label>
                <Input
                  id="storage"
                  placeholder="Ex: SSD 500GB NVMe"
                  value={setup.storage}
                  onChange={(e) => setSetup({ ...setup, storage: e.target.value })}
                  className="bg-[#0A0A0A] border-[#1A1A1A] text-white"
                />
              </div>

              <div>
                <Label htmlFor="psu" className="text-white">Fonte</Label>
                <Input
                  id="psu"
                  placeholder="Ex: 600W 80+ Bronze"
                  value={setup.psu}
                  onChange={(e) => setSetup({ ...setup, psu: e.target.value })}
                  className="bg-[#0A0A0A] border-[#1A1A1A] text-white"
                />
              </div>

              <div>
                <Label htmlFor="monitor" className="text-white">Monitor</Label>
                <Input
                  id="monitor"
                  placeholder="Ex: 24' 144Hz Full HD"
                  value={setup.monitor}
                  onChange={(e) => setSetup({ ...setup, monitor: e.target.value })}
                  className="bg-[#0A0A0A] border-[#1A1A1A] text-white"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="peripherals" className="text-white">Periféricos</Label>
              <Textarea
                id="peripherals"
                placeholder="Ex: Mouse Logitech G203, Teclado Redragon K552"
                value={setup.peripherals}
                onChange={(e) => setSetup({ ...setup, peripherals: e.target.value })}
                className="bg-[#0A0A0A] border-[#1A1A1A] text-white"
                rows={3}
              />
            </div>

            <Button
              onClick={handleSave}
              className="w-full bg-gradient-to-r from-[#4DE1FF] to-[#FF5BD4] hover:opacity-90 text-black font-semibold"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Salvar Setup
            </Button>
          </CardContent>
        </Card>

        {/* Card de Análise com IA */}
        <Card className="bg-[#111111] border-[#1A1A1A]">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">
              Análise Inteligente com IA
            </CardTitle>
            <CardDescription className="text-[#BEBEBE]">
              Receba recomendações personalizadas de upgrade baseadas em IA
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Parâmetros de Análise */}
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="budget" className="text-white">Orçamento</Label>
                <Input
                  id="budget"
                  placeholder="Ex: R$ 2000"
                  value={analysisParams.budget}
                  onChange={(e) => setAnalysisParams({ ...analysisParams, budget: e.target.value })}
                  className="bg-[#0A0A0A] border-[#1A1A1A] text-white"
                />
              </div>

              <div>
                <Label htmlFor="focus" className="text-white">Foco de Uso</Label>
                <Select
                  value={analysisParams.focus}
                  onValueChange={(value) => setAnalysisParams({ ...analysisParams, focus: value })}
                >
                  <SelectTrigger className="bg-[#0A0A0A] border-[#1A1A1A] text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-[#111111] border-[#1A1A1A]">
                    <SelectItem value="gaming">Gaming</SelectItem>
                    <SelectItem value="edição">Edição de Vídeo</SelectItem>
                    <SelectItem value="produtividade">Produtividade</SelectItem>
                    <SelectItem value="stream">Streaming</SelectItem>
                    <SelectItem value="geral">Uso Geral</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="brand" className="text-white">Preferência de Marca</Label>
                <Input
                  id="brand"
                  placeholder="Ex: Intel, AMD, NVIDIA"
                  value={analysisParams.brand}
                  onChange={(e) => setAnalysisParams({ ...analysisParams, brand: e.target.value })}
                  className="bg-[#0A0A0A] border-[#1A1A1A] text-white"
                />
              </div>
            </div>

            <div className="flex gap-4">
              <Button
                onClick={handleAnalyze}
                disabled={loading}
                className="flex-1 bg-gradient-to-r from-cyan-600 to-blue-600 hover:opacity-90 text-white font-semibold"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Analisando...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Analisar Setup
                  </>
                )}
              </Button>

              <Button
                onClick={handleMarketAnalysis}
                disabled={marketLoading}
                className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:opacity-90 text-white font-semibold"
              >
                {marketLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Analisando Mercado...
                  </>
                ) : (
                  <>
                    <TrendingUp className="w-4 h-4 mr-2" />
                    Analisar Mercado
                  </>
                )}
              </Button>
            </div>

            {/* Resultado da Análise de Setup */}
            {analysis && (
              <div className="mt-6 p-6 bg-[#0A0A0A] rounded-lg border border-cyan-500/20">
                <h3 className="text-xl font-bold text-cyan-400 mb-4">Recomendações de Upgrade</h3>
                <div className="text-[#BEBEBE] whitespace-pre-wrap">{analysis}</div>
              </div>
            )}

            {/* Resultado da Análise de Mercado */}
            {marketAnalysis && (
              <div className="mt-6 p-6 bg-[#0A0A0A] rounded-lg border border-green-500/20">
                <h3 className="text-xl font-bold text-green-400 mb-4">Análise de Mercado</h3>
                <div className="text-[#BEBEBE] whitespace-pre-wrap">{marketAnalysis}</div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  )
}
