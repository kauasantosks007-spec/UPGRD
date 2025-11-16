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

  const handleSend = () => {
    if (!input.trim()) return

    const userMessage = input.trim()
    setMessages(prev => [...prev, { role: 'user', text: userMessage }])
    setInput('')

    // Simulated AI responses
    setTimeout(() => {
      let response = ''
      const lowerInput = userMessage.toLowerCase()

      if (lowerInput.includes('xp') || lowerInput.includes('experiência')) {
        response = 'Você ganha XP completando missões, atualizando seu setup e desbloqueando conquistas! Cada ação vale pontos diferentes.'
      } else if (lowerInput.includes('missão') || lowerInput.includes('missões')) {
        response = 'As missões resetam toda segunda-feira! Complete-as para ganhar XP e subir de nível. Vá na aba Missões para ver as disponíveis.'
      } else if (lowerInput.includes('setup') || lowerInput.includes('score')) {
        response = 'Seu Setup Score é calculado automaticamente pela IA baseado nas peças do seu PC. Quanto melhor o hardware, maior o score! Vá em "Meu Setup" para atualizar.'
      } else if (lowerInput.includes('nível') || lowerInput.includes('nivel')) {
        response = 'Você sobe de nível ganhando XP! Cada nível requer mais XP que o anterior. Complete missões e conquistas para progredir mais rápido.'
      } else if (lowerInput.includes('ranking')) {
        response = 'O ranking mostra os melhores jogadores do UPGRD! Quanto mais XP e melhor seu setup, maior sua posição no ranking global.'
      } else {
        response = 'Posso ajudar com: ganhar XP, completar missões, melhorar setup, subir de nível e entender o ranking. O que você gostaria de saber?'
      }

      setMessages(prev => [...prev, { role: 'ai', text: response }])
    }, 500)
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
                  {msg.text}
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
