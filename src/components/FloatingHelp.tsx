'use client'

import { useState } from 'react'
import { MessageCircle, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'

export default function FloatingHelp() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<{ role: 'user' | 'ai'; text: string }[]>([
    { role: 'ai', text: 'Olá! Como posso ajudar você no UPGRD?' }
  ])
  const [input, setInput] = useState('')

  const getResponse = (userMessage: string): string => {
    const msg = userMessage.toLowerCase()

    // Respostas sobre XP
    if (msg.includes('xp') || msg.includes('experiência') || msg.includes('ganhar')) {
      return 'Você ganha XP de várias formas:\n\n• Registrar setup → +40 XP\n• Atualizar setup → +20 XP\n• Completar missão semanal → +10 a +40 XP\n• Usar o balão de ajuda → +5 XP\n• Abrir área ranking → +10 XP'
    }

    // Respostas sobre missões
    if (msg.includes('missão') || msg.includes('missões') || msg.includes('missao') || msg.includes('missoes')) {
      return 'As missões semanais são tarefas que você pode completar para ganhar XP extra! Toda semana você recebe 5 novas missões, como fazer benchmark, atualizar drivers, limpar o PC, etc. Cada missão vale entre 10-40 XP.'
    }

    // Respostas sobre níveis
    if (msg.includes('nível') || msg.includes('nivel') || msg.includes('subir')) {
      return 'O sistema de níveis funciona assim:\n\nNível 1 → 100 XP\nNível 2 → 250 XP\nNível 3 → 500 XP\nNível 4 → 900 XP\nNível 5 → 1500 XP\n\nQuanto mais XP você ganha, mais rápido sobe de nível!'
    }

    // Respostas sobre setup
    if (msg.includes('setup') || msg.includes('pc') || msg.includes('computador')) {
      return 'No UPGRD, você pode registrar seu setup completo (CPU, GPU, RAM, etc.) e receber uma análise detalhada com pontuação de 0-100. A IA identifica pontos fracos e sugere upgrades dentro do seu orçamento!'
    }

    // Respostas sobre ranking
    if (msg.includes('ranking') || msg.includes('tier') || msg.includes('classificação')) {
      return 'O ranking compara seu setup com outros usuários usando Score total, Nível, XP recente e eficiência. Os setups são classificados em Tiers: S (melhor), A, B e C. Quanto melhor seu setup e nível, maior sua classificação!'
    }

    // Respostas sobre pontuação
    if (msg.includes('pontuação') || msg.includes('pontos') || msg.includes('score')) {
      return 'A pontuação do seu setup é calculada assim:\n\nCPU → até 30 pts\nGPU → até 40 pts\nRAM → até 10 pts\nArmazenamento → até 5 pts\nPlaca-mãe → até 5 pts\nCooling → até 5 pts\nMonitor → até 5 pts\n\nTotal: 0-100 pontos'
    }

    // Resposta padrão
    return 'Desculpe, não entendi sua pergunta. Você pode perguntar sobre:\n\n• Como ganhar XP\n• Missões semanais\n• Sistema de níveis\n• Análise de setup\n• Ranking e tiers\n• Pontuação do setup'
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

  return (
    <>
      {/* Floating Button */}
      {!isOpen && (
        <Button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-[#0A0A0A] border-2 border-[#4DE1FF]/30 text-[#4DE1FF] hover:border-[#4DE1FF] hover:bg-[#4DE1FF]/10 transition-all z-50"
          size="icon"
        >
          <MessageCircle className="w-6 h-6" />
        </Button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <Card className="fixed bottom-6 right-6 w-96 h-[500px] bg-[#0A0A0A] border-[#4DE1FF]/30 z-50 flex flex-col">
          <CardHeader className="flex flex-row items-center justify-between border-b border-[#1A1A1A]">
            <CardTitle className="text-lg text-white">Ajuda IA</CardTitle>
            <Button
              onClick={() => setIsOpen(false)}
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-[#BEBEBE] hover:text-white"
            >
              <X className="w-4 h-4" />
            </Button>
          </CardHeader>
          <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-lg ${
                    msg.role === 'user'
                      ? 'bg-[#4DE1FF]/10 border border-[#4DE1FF] text-white'
                      : 'bg-[#111111] text-[#BEBEBE]'
                  }`}
                >
                  <div className="whitespace-pre-line">{msg.text}</div>
                </div>
              </div>
            ))}
          </CardContent>
          <div className="p-4 border-t border-[#1A1A1A]">
            <div className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Digite sua dúvida..."
                className="flex-1 bg-[#111111] border-[#333333] text-white"
              />
              <Button 
                onClick={handleSend}
                className="bg-[#4DE1FF]/10 border border-[#4DE1FF] text-[#4DE1FF] hover:bg-[#4DE1FF]/20"
              >
                Enviar
              </Button>
            </div>
          </div>
        </Card>
      )}
    </>
  )
}
