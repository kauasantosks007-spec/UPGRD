'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import AppLayout from '@/components/AppLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Sparkles, Send, Loader2 } from 'lucide-react'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

export default function Ajuda() {
  const router = useRouter()
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: 'Olá! 👋 Sou a IA do UPGRD. Estou aqui para ajudar você com qualquer dúvida sobre o aplicativo. Posso explicar como ganhar XP, completar missões, melhorar seu setup e muito mais! Como posso ajudar?'
    }
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const userName = localStorage.getItem('upgrd_user_name')
    if (!userName) {
      router.push('/')
      return
    }
  }, [router])

  const getAutomaticResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase()

    if (lowerMessage.includes('xp') || lowerMessage.includes('ganhar xp') || lowerMessage.includes('como ganhar')) {
      return 'Para ganhar XP no UPGRD, você pode:\n\n🎯 Completar missões diárias: 20-40 XP cada\n🏆 Completar missões semanais: 300-500 XP cada\n🔧 Atualizar seu setup: +150 XP\n🏅 Desbloquear conquistas: +250 XP cada\n💬 Interagir na comunidade: +30 XP\n\nQuanto mais ativo você for, mais rápido sobe de nível!'
    }

    if (lowerMessage.includes('missão') || lowerMessage.includes('missões') || lowerMessage.includes('completar')) {
      return 'As missões são divididas em:\n\n📅 Diárias: Aparecem todos os dias, valem 20-40 XP\n📆 Semanais: Renovam toda semana, valem 300-500 XP\n\nComplete-as para ganhar XP e subir de nível. Verifique sempre a aba "Missões"!'
    }

    if (lowerMessage.includes('setup') || lowerMessage.includes('melhorar') || lowerMessage.includes('setup score')) {
      return 'Para melhorar seu Setup Score:\n\n🔧 Cadastre todas as peças do seu PC (CPU, GPU, RAM, etc.)\n📊 O score é calculado automaticamente baseado no hardware\n🥇 Scores altos desbloqueiam conquistas especiais\n\nAtualize seu setup na aba "Meu Setup" para ganhar +150 XP!'
    }

    if (lowerMessage.includes('nível') || lowerMessage.includes('subir') || lowerMessage.includes('level')) {
      return 'Para subir de nível:\n\n📈 Acumule XP completando missões e conquistas\n🎯 Nível 0→1: 1.000 XP\n🎯 Nível 1→2: 2.000 XP\n🎯 Nível 2→3: 3.500 XP\n🎯 Nível 3→4: 5.000 XP\n🎯 Nível 4→5: 8.000 XP\n\nCada nível traz novas conquistas e benefícios!'
    }

    if (lowerMessage.includes('ranking') || lowerMessage.includes('classificação')) {
      return 'O ranking global mostra os jogadores mais ativos:\n\n🏆 Baseado em pontos totais acumulados\n📊 Atualizado em tempo real\n🎖️ Apareça no top 10 para ganhar reconhecimento\n\nQuanto mais XP você ganhar, melhor sua posição!'
    }

    if (lowerMessage.includes('conquista') || lowerMessage.includes('troféu') || lowerMessage.includes('conquistas')) {
      return 'Conquistas especiais dão +250 XP cada:\n\n🏅 Primeiro Setup Criado\n🥉 Setup Bronze/Prata/Ouro/Diamante\n🎯 10 missões concluídas\n📅 4 semanas seguidas ativo\n⭐ Nível 5 alcançado\n💯 1000 XP ganhos\n\nComplete todas para maximizar seus pontos!'
    }

    if (lowerMessage.includes('comunidade') || lowerMessage.includes('interagir')) {
      return 'Na comunidade UPGRD você pode:\n\n💬 Compartilhar seu setup\n🤝 Pedir dicas de upgrade\n🏆 Competir no ranking\n🎉 Participar de eventos\n\nCada interação dá +30 XP. Vamos conversar!'
    }

    if (lowerMessage.includes('orçamento') || lowerMessage.includes('upgrade') || lowerMessage.includes('planejar')) {
      return 'Use a ferramenta de Orçamento para:\n\n💰 Planejar upgrades futuros\n📊 Comparar preços\n🎯 Definir metas de economia\n📈 Acompanhar progresso\n\nAcesse em "Ferramentas > Orçamento"!'
    }

    // Resposta genérica para outras dúvidas
    return 'Desculpe, não entendi sua pergunta específica. Sobre o que você gostaria de saber?\n\nPosso ajudar com:\n• Como ganhar XP\n• Missões e conquistas\n• Setup e upgrades\n• Ranking e níveis\n• Comunidade\n• Orçamento\n\nTente reformular sua pergunta! 😊'
  }

  const handleSend = async () => {
    if (!input.trim()) return

    const userMessage = input.trim()
    setMessages(prev => [...prev, { role: 'user', content: userMessage }])
    setInput('')
    setIsLoading(true)

    // Simular delay para resposta automática
    setTimeout(() => {
      const response = getAutomaticResponse(userMessage)
      setMessages(prev => [
        ...prev,
        { role: 'assistant', content: response }
      ])
      setIsLoading(false)
    }, 1000)
  }

  const quickQuestions = [
    'Como ganhar XP?',
    'Como completar missões?',
    'Como melhorar meu setup?',
    'Como subir de nível?',
    'Como funciona o ranking?'
  ]

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
            <Sparkles className="w-10 h-10 text-[#4DE1FF]" />
            Ajuda IA
          </h1>
          <p className="text-[#BEBEBE]">
            Tire suas dúvidas com nossa inteligência artificial
          </p>
        </div>

        {/* Quick Questions */}
        <Card className="bg-[#111111] border-[#4DE1FF]/20">
          <CardHeader>
            <CardTitle className="text-white">Perguntas Rápidas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {quickQuestions.map((question, idx) => (
                <Button
                  key={idx}
                  onClick={() => {
                    setInput(question)
                  }}
                  className="bg-transparent border border-[#4DE1FF] text-[#4DE1FF] hover:bg-[#4DE1FF]/10"
                >
                  {question}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Chat Area */}
        <Card className="bg-[#111111] border-[#333333]">
          <CardContent className="p-0">
            {/* Messages */}
            <div className="h-[500px] overflow-y-auto p-6 space-y-4">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] p-4 rounded-lg ${
                      msg.role === 'user'
                        ? 'bg-[#4DE1FF]/10 border border-[#4DE1FF] text-white'
                        : 'bg-[#0A0A0A] text-[#BEBEBE]'
                    }`}
                  >
                    <div className="whitespace-pre-line">{msg.content}</div>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-[#0A0A0A] text-[#BEBEBE] p-4 rounded-lg flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin text-[#4DE1FF]" />
                    <span>Pensando...</span>
                  </div>
                </div>
              )}
            </div>

            {/* Input Area */}
            <div className="border-t border-[#333333] p-4">
              <div className="flex gap-2">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && !isLoading && handleSend()}
                  placeholder="Digite sua dúvida..."
                  disabled={isLoading}
                  className="flex-1 text-lg bg-[#0A0A0A] border-[#333333] text-white"
                />
                <Button
                  onClick={handleSend}
                  disabled={isLoading || !input.trim()}
                  className="bg-[#4DE1FF]/10 border border-[#4DE1FF] text-[#4DE1FF] hover:bg-[#4DE1FF]/20"
                  size="lg"
                >
                  {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Send className="w-5 h-5" />
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Info Card */}
        <Card className="bg-[#111111] border-[#333333]">
          <CardContent className="pt-6">
            <p className="text-center text-[#BEBEBE]">
              💡 A IA está sempre disponível para ajudar. Você também pode usar o balão flutuante no canto inferior direito em qualquer página!
            </p>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  )
}