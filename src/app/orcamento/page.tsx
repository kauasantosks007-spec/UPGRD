'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import AppLayout from '@/components/AppLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { DollarSign, Save, TrendingUp, Sparkles, AlertCircle } from 'lucide-react'

export default function Orcamento() {
  const router = useRouter()
  const [budget, setBudget] = useState('')
  const [savedBudget, setSavedBudget] = useState(0)

  useEffect(() => {
    const userName = localStorage.getItem('upgrd_user_name')
    if (!userName) {
      router.push('/')
      return
    }

    const savedBudgetValue = localStorage.getItem('upgrd_budget')
    if (savedBudgetValue) {
      const budgetNum = parseFloat(savedBudgetValue)
      setSavedBudget(budgetNum)
      setBudget(budgetNum.toString())
    }
  }, [router])

  const handleSave = () => {
    const budgetValue = parseFloat(budget.replace(/[^\d]/g, ''))
    
    if (!budgetValue || isNaN(budgetValue) || budgetValue <= 0) {
      alert('Por favor, insira um valor válido')
      return
    }

    localStorage.setItem('upgrd_budget', budgetValue.toString())
    setSavedBudget(budgetValue)

    // Award XP for setting budget
    const userData = JSON.parse(localStorage.getItem('upgrd_user_data') || '{}')
    if (!savedBudget) {
      userData.xp = (userData.xp || 0) + 50
      userData.totalPoints = (userData.totalPoints || 0) + 50
      localStorage.setItem('upgrd_user_data', JSON.stringify(userData))
      alert('Orçamento salvo com sucesso! +50 XP')
    } else {
      alert('Orçamento atualizado com sucesso!')
    }
  }

  const getBudgetAnalysis = () => {
    if (savedBudget >= 5000) {
      return {
        title: 'Orçamento Excelente! 🚀',
        description: 'Você pode montar um setup HIGH-END completo com os melhores componentes do mercado.',
        color: 'from-[#4DE1FF] to-[#FF5BD4]',
        recommendations: [
          'GPU: RTX 4080 ou 4090',
          'CPU: Ryzen 9 7950X ou i9-14900K',
          'RAM: 32GB DDR5',
          'Monitor: 240Hz 1440p ou 4K'
        ]
      }
    } else if (savedBudget >= 3000) {
      return {
        title: 'Orçamento Muito Bom! 💎',
        description: 'Você pode montar um setup GAMER de alta performance com excelente custo-benefício.',
        color: 'from-[#D8A84E] to-[#4DE1FF]',
        recommendations: [
          'GPU: RTX 4070 ou 4070 Ti',
          'CPU: Ryzen 7 7800X3D ou i7-14700K',
          'RAM: 16GB DDR5',
          'SSD NVMe: 1TB Gen4'
        ]
      }
    } else if (savedBudget >= 1500) {
      return {
        title: 'Orçamento Bom! ⚡',
        description: 'Você pode fazer upgrades estratégicos importantes no seu setup.',
        color: 'from-[#FF5BD4] to-[#4DE1FF]',
        recommendations: [
          'GPU: RTX 3060 ou RX 6600',
          'RAM: 16GB DDR4',
          'SSD: 500GB NVMe',
          'Monitor: 144Hz Full HD'
        ]
      }
    } else if (savedBudget >= 500) {
      return {
        title: 'Orçamento Inicial 🎯',
        description: 'Você pode fazer upgrades pontuais e essenciais para melhorar a performance.',
        color: 'from-[#4DE1FF] to-[#D8A84E]',
        recommendations: [
          'RAM: +8GB',
          'SSD: 240GB SATA',
          'Cooler: Melhor refrigeração',
          'Periféricos básicos'
        ]
      }
    } else {
      return {
        title: 'Orçamento Limitado 💡',
        description: 'Foque em otimizações e manutenção para maximizar o que você já tem.',
        color: 'from-[#BEBEBE] to-[#4DE1FF]',
        recommendations: [
          'Limpeza e manutenção do PC',
          'Pasta térmica nova',
          'Organização de cabos',
          'Otimização de software'
        ]
      }
    }
  }

  const analysis = savedBudget > 0 ? getBudgetAnalysis() : null

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
            <DollarSign className="w-10 h-10 text-[#D8A84E]" />
            Meu Orçamento
          </h1>
          <p className="text-[#BEBEBE]">
            Defina quanto você pode investir para receber recomendações personalizadas de upgrade
          </p>
        </div>

        {/* Current Budget Display */}
        {savedBudget > 0 && (
          <Card className={`bg-gradient-to-r ${analysis?.color} border-[#4DE1FF]/20`}>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-sm text-[#BEBEBE] mb-2">Orçamento Disponível</p>
                <div className="text-6xl font-bold text-white mb-4">
                  R$ {savedBudget.toLocaleString('pt-BR')}
                </div>
                <div className="text-2xl font-semibold text-white">
                  {analysis?.title}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Budget Form */}
        <Card className="bg-[#111111] border-[#333333]">
          <CardHeader>
            <CardTitle className="text-2xl text-white flex items-center gap-2">
              <DollarSign className="w-6 h-6 text-[#D8A84E]" />
              {savedBudget > 0 ? 'Atualizar Orçamento' : 'Definir Orçamento'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="budget" className="text-lg text-white">
                Quanto você pode investir? (R$)
              </Label>
              <Input
                id="budget"
                type="number"
                placeholder="Ex: 3000"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                className="text-2xl bg-[#0A0A0A] border-[#333333] text-white py-6"
              />
              <p className="text-sm text-[#BEBEBE]">
                Informe o valor total que você tem disponível para investir em upgrades do seu setup
              </p>
            </div>

            <Button
              onClick={handleSave}
              className="w-full text-lg py-6 bg-[#D8A84E]/10 border border-[#D8A84E] text-[#D8A84E] hover:bg-[#D8A84E]/20 transition-all"
              size="lg"
            >
              <Save className="w-5 h-5 mr-2" />
              Salvar Orçamento
            </Button>
          </CardContent>
        </Card>

        {/* Budget Analysis */}
        {analysis && (
          <>
            <Card className="bg-[#111111] border-[#4DE1FF]/20">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-2 text-white">
                  <Sparkles className="w-6 h-6 text-[#4DE1FF]" />
                  Análise do Seu Orçamento
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-[#4DE1FF]/10 border border-[#4DE1FF]/30 rounded-lg">
                  <p className="text-lg text-white font-semibold mb-2">
                    {analysis.description}
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-white mb-4">
                    O que você pode comprar:
                  </h3>
                  <div className="space-y-3">
                    {analysis.recommendations.map((rec, index) => (
                      <div
                        key={index}
                        className="p-3 bg-[#0A0A0A] border border-[#333333] rounded-lg flex items-center gap-3"
                      >
                        <div className="w-8 h-8 rounded-full bg-[#4DE1FF]/20 flex items-center justify-center text-[#4DE1FF] font-bold">
                          {index + 1}
                        </div>
                        <p className="text-white">{rec}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-[#FF5BD4]/10 to-[#4DE1FF]/10 border-[#FF5BD4]/20">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <TrendingUp className="w-6 h-6 text-[#4DE1FF] flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-2">
                      Próximo Passo
                    </h3>
                    <p className="text-[#BEBEBE] mb-4">
                      Agora que você definiu seu orçamento, visite a página "Upgrade" para receber recomendações personalizadas baseadas no seu setup atual e no valor disponível.
                    </p>
                    <Button
                      onClick={() => router.push('/upgrade')}
                      className="bg-[#4DE1FF]/10 border border-[#4DE1FF] text-[#4DE1FF] hover:bg-[#4DE1FF]/20 transition-all"
                    >
                      Ver Recomendações de Upgrade
                      <TrendingUp className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        )}

        {/* Info Card */}
        {!savedBudget && (
          <Card className="bg-[#111111] border-yellow-500/20">
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <AlertCircle className="w-6 h-6 text-yellow-500 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">
                    Por que definir um orçamento?
                  </h3>
                  <ul className="space-y-2 text-[#BEBEBE]">
                    <li className="flex items-start gap-2">
                      <span className="text-[#4DE1FF]">•</span>
                      <span>Receba recomendações realistas e adequadas ao seu bolso</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#4DE1FF]">•</span>
                      <span>A IA prioriza upgrades com melhor custo-benefício</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#4DE1FF]">•</span>
                      <span>Evite gastar dinheiro em componentes incompatíveis</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#4DE1FF]">•</span>
                      <span>Planeje seus upgrades de forma inteligente e gradual</span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </AppLayout>
  )
}
