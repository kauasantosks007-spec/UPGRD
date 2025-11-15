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

  const getResponse = (userMessage: string): string => {
    const msg = userMessage.toLowerCase()

    // Respostas sobre XP
    if (msg.includes('xp') || msg.includes('experiência') || msg.includes('ganhar')) {
      return 'Você ganha XP de várias formas:\n\n• Registrar setup → +40 XP\n• Atualizar setup → +20 XP\n• Completar missão semanal → +10 a +40 XP\n• Usar o balão de ajuda → +5 XP\n• Abrir área ranking → +10 XP\n\nCada ação que você faz no app contribui para sua evolução!'
    }

    // Respostas sobre missões
    if (msg.includes('missão') || msg.includes('missões') || msg.includes('missao') || msg.includes('missoes')) {
      return 'As missões semanais são tarefas que você pode completar para ganhar XP extra!\n\nToda semana você recebe 5 novas missões, como:\n• Fazer benchmark\n• Atualizar drivers\n• Limpar o PC\n• Organizar cabos\n• Testar FPS\n• Checar temperaturas\n\nCada missão vale entre 10-40 XP. Complete todas para maximizar seu progresso!'
    }

    // Respostas sobre níveis
    if (msg.includes('nível') || msg.includes('nivel') || msg.includes('subir')) {
      return 'O sistema de níveis funciona assim:\n\nNível 1 → 100 XP\nNível 2 → 250 XP\nNível 3 → 500 XP\nNível 4 → 900 XP\nNível 5 → 1500 XP\n\nQuanto mais XP você ganha, mais rápido sobe de nível! Cada nível desbloqueado mostra sua dedicação e conhecimento sobre hardware.'
    }

    // Respostas sobre setup
    if (msg.includes('setup') || msg.includes('pc') || msg.includes('computador') || msg.includes('análise') || msg.includes('analise')) {
      return 'No UPGRD, você pode registrar seu setup completo incluindo:\n\n• CPU\n• GPU\n• RAM\n• Armazenamento\n• Placa-mãe\n• Cooling\n• Monitor\n\nA IA analisa cada componente e dá uma pontuação de 0-100. Você recebe feedback sobre pontos fracos e sugestões de upgrade dentro do seu orçamento!'
    }

    // Respostas sobre ranking
    if (msg.includes('ranking') || msg.includes('tier') || msg.includes('classificação') || msg.includes('classificacao')) {
      return 'O ranking compara seu setup com outros usuários usando:\n\n• Score total do setup\n• Nível atual\n• XP recente\n• Eficiência custo-benefício\n• Performance geral\n\nOs setups são classificados em Tiers:\n• Tier S (melhor)\n• Tier A\n• Tier B\n• Tier C\n\nQuanto melhor seu setup e nível, maior sua classificação!'
    }

    // Respostas sobre pontuação
    if (msg.includes('pontuação') || msg.includes('pontos') || msg.includes('score') || msg.includes('pontuacao')) {
      return 'A pontuação do seu setup é calculada assim:\n\nCPU → até 30 pts\nGPU → até 40 pts\nRAM → até 10 pts\nArmazenamento → até 5 pts\nPlaca-mãe → até 5 pts\nCooling → até 5 pts\nMonitor → até 5 pts\n\nTotal: 0-100 pontos\n\nA GPU tem maior peso porque é o componente mais importante para gaming e performance gráfica!'
    }

    // Respostas sobre perfil
    if (msg.includes('perfil') || msg.includes('nome') || msg.includes('mudar')) {
      return 'No seu Perfil você pode:\n\n• Ver e mudar seu nome\n• Acompanhar seu nível atual\n• Ver quanto XP você tem\n• Conferir seu Score UPGRD\n• Visualizar seu setup salvo\n\nÉ o hub central das suas informações no app!'
    }

    // Respostas sobre como usar o app
    if (msg.includes('como usar') || msg.includes('começar') || msg.includes('comecar') || msg.includes('funciona')) {
      return 'Para começar no UPGRD:\n\n1. Registre seu setup na aba Setup\n2. Complete missões semanais para ganhar XP\n3. Suba de nível e melhore seu ranking\n4. Receba recomendações de upgrade\n5. Compare seu setup com outros usuários\n\nO app foi feito para ser intuitivo - explore cada aba e divirta-se!'
    }

    // Resposta padrão
    return 'Desculpe, não entendi sua pergunta. Você pode perguntar sobre:\n\n• Como ganhar XP\n• Missões semanais\n• Sistema de níveis\n• Análise de setup\n• Ranking e tiers\n• Pontuação do setup\n• Como usar o app\n• Perfil do usuário\n\nTente reformular sua pergunta ou escolha uma das perguntas rápidas acima!'
  }

  const handleSend = () => {
    if (!input.trim()) return

    const userMessage = input.trim()
    setMessages(prev => [...prev, { role: 'user', text: userMessage }])
    setInput('')

    // Simula um pequeno delay para parecer mais natural
    setTimeout(() => {
      const aiResponse = getResponse(userMessage)
      setMessages(prev => [...prev, { role: 'ai', text: aiResponse }])
    }, 300)
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
