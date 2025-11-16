'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import AppLayout from '@/components/AppLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Sparkles, Send } from 'lucide-react'

interface Message {
  role: 'user' | 'ai'
  text: string
}

export default function Ajuda() {
  const router = useRouter()
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'ai',
      text: 'Olá! Sou a IA do UPGRD. Estou aqui para ajudar você com qualquer dúvida sobre o aplicativo. Posso explicar como ganhar XP, completar missões, melhorar seu setup e muito mais!'
    }
  ])
  const [input, setInput] = useState('')

  useEffect(() => {
    const userName = localStorage.getItem('upgrd_user_name')
    if (!userName) {
      router.push('/')
      return
    }
  }, [router])

  const handleSend = () => {
    if (!input.trim()) return

    const userMessage = input.trim()
    setMessages(prev => [...prev, { role: 'user', text: userMessage }])
    setInput('')

    setTimeout(() => {
      const response = generateAIResponse(userMessage)
      setMessages(prev => [...prev, { role: 'ai', text: response }])
    }, 500)
  }

  const generateAIResponse = (message: string): string => {
    const lowerMessage = message.toLowerCase()

    if (lowerMessage.includes('xp') || lowerMessage.includes('experiência') || lowerMessage.includes('pontos')) {
      return 'Você pode ganhar XP de várias formas:\n\n• Completar missões diárias (20-40 XP)\n• Completar missões semanais (300-500 XP)\n• Atualizar seu setup (+150 XP)\n• Desbloquear conquistas (+250 XP)\n• Interagir com a comunidade (+30 XP)\n\nQuanto mais XP você ganhar, mais rápido subirá de nível!'
    }

    if (lowerMessage.includes('missão') || lowerMessage.includes('missões') || lowerMessage.includes('tarefa')) {
      return 'As missões são divididas em dois tipos:\n\n📅 Missões Diárias: Resetam todo dia e dão 20-40 XP cada\n📆 Missões Semanais: Resetam toda segunda-feira e dão 300-500 XP cada\n\nVá na aba "Missões" para ver todas disponíveis. Complete-as clicando no botão "Completar Missão" e ganhe XP instantaneamente!'
    }

    if (lowerMessage.includes('setup') || lowerMessage.includes('pc') || lowerMessage.includes('score')) {
      return 'Seu Setup Score é calculado automaticamente pela IA baseado nas peças do seu PC:\n\n💻 CPU: até 300 pontos\n🎮 GPU: até 400 pontos\n🧠 RAM: até 150 pontos\n💾 Storage: até 100 pontos\n🖥️ Monitor: até 100 pontos\n\nQuanto melhor o hardware, maior o score! Vá em "Meu Setup" para adicionar ou atualizar suas peças. Você ganha +150 XP ao atualizar!'
    }

    if (lowerMessage.includes('nível') || lowerMessage.includes('nivel') || lowerMessage.includes('subir')) {
      return 'Para subir de nível, você precisa ganhar XP:\n\n🎯 Nível 0 → 1: 1.000 XP\n🎯 Nível 1 → 2: 2.000 XP\n🎯 Nível 2 → 3: 3.500 XP\n🎯 Nível 3 → 4: 5.000 XP\n🎯 Nível 4 → 5: 8.000 XP\n\nCada nível requer mais XP que o anterior. Complete missões e conquistas para progredir mais rápido!'
    }

    if (lowerMessage.includes('ranking') || lowerMessage.includes('posição') || lowerMessage.includes('classificação')) {
      return 'O Ranking Global mostra os melhores jogadores do UPGRD!\n\n🏆 A classificação é baseada nos pontos totais acumulados\n📊 Quanto mais XP você ganhar, maior sua posição\n💎 Melhore seu Setup Score para se destacar\n\nVá na aba "Ranking" para ver sua posição atual e comparar com outros jogadores!'
    }

    if (lowerMessage.includes('conquista') || lowerMessage.includes('achievement') || lowerMessage.includes('troféu')) {
      return 'Conquistas são marcos especiais que você pode desbloquear:\n\n🎯 Primeiro Setup Criado\n🥉 Setup Bronze/Prata/Ouro/Diamante\n🎮 10 missões concluídas\n🔥 4 semanas seguidas ativo\n⭐ Nível 5 alcançado\n💯 1000 XP ganhos\n\nCada conquista dá +250 XP de bônus! Veja todas no seu Perfil.'
    }

    if (lowerMessage.includes('bronze') || lowerMessage.includes('prata') || lowerMessage.includes('ouro') || lowerMessage.includes('diamante')) {
      return 'As classificações são baseadas no seu Setup Score:\n\n🥉 Bronze: até 500 pontos\n🥈 Prata: 500-1500 pontos\n🥇 Ouro: 1500-3500 pontos\n💎 Diamante: acima de 3500 pontos\n\nMelhore suas peças de hardware para aumentar seu score e alcançar classificações superiores!'
    }

    if (lowerMessage.includes('como usar') || lowerMessage.includes('começar') || lowerMessage.includes('funciona')) {
      return 'Bem-vindo ao UPGRD! Aqui está como usar:\n\n1️⃣ Vá em "Meu Setup" e adicione as informações do seu PC\n2️⃣ Complete missões diárias e semanais na aba "Missões"\n3️⃣ Ganhe XP e suba de nível\n4️⃣ Desbloqueie conquistas no seu "Perfil"\n5️⃣ Veja sua posição no "Ranking Global"\n\nO objetivo é melhorar seu setup, ganhar XP e se tornar o melhor jogador do UPGRD!'
    }

    return 'Posso ajudar você com:\n\n💡 Como ganhar XP\n🎯 Como completar missões\n💻 Como melhorar seu setup\n📈 Como subir de nível\n🏆 Como funciona o ranking\n🎖️ Como desbloquear conquistas\n\nO que você gostaria de saber?'
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
                    setTimeout(() => handleSend(), 100)
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
                    <div className="whitespace-pre-line">{msg.text}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Input Area */}
            <div className="border-t border-[#333333] p-4">
              <div className="flex gap-2">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Digite sua dúvida..."
                  className="flex-1 text-lg bg-[#0A0A0A] border-[#333333] text-white"
                />
                <Button
                  onClick={handleSend}
                  className="bg-[#4DE1FF]/10 border border-[#4DE1FF] text-[#4DE1FF] hover:bg-[#4DE1FF]/20"
                  size="lg"
                >
                  <Send className="w-5 h-5" />
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
