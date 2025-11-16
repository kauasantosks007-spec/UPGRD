'use client'

import { useState } from 'react'
import { HelpCircle, X, Send } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { getApiKey } from '@/lib/storage'

export default function HelpButton() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant'; content: string }[]>([
    {
      role: 'assistant',
      content: 'Olá! Sou o assistente da UPGRD. Como posso ajudar você hoje?'
    }
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const sendMessage = async () => {
    if (!input.trim()) return

    const apiKey = getApiKey()
    if (!apiKey) {
      setMessages([
        ...messages,
        { role: 'user', content: input },
        {
          role: 'assistant',
          content: 'Por favor, configure sua API Key na página de Perfil para usar o assistente.'
        }
      ])
      setInput('')
      return
    }

    const userMessage = input
    setInput('')
    setMessages([...messages, { role: 'user', content: userMessage }])
    setIsLoading(true)

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-4o',
          messages: [
            {
              role: 'system',
              content:
                'Você é o assistente de suporte da plataforma UPGRD. Ajude os usuários com dúvidas sobre o app, funcionalidades, como ganhar pontos, missões, conquistas e uso geral da plataforma. Seja amigável e conciso.'
            },
            ...messages.map((m) => ({ role: m.role, content: m.content })),
            { role: 'user', content: userMessage }
          ]
        })
      })

      const data = await response.json()
      const assistantMessage = data.choices[0].message.content

      setMessages((prev) => [...prev, { role: 'assistant', content: assistantMessage }])
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: 'Desculpe, ocorreu um erro. Verifique sua API Key e tente novamente.'
        }
      ])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      {/* Help Button */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-[#4DE1FF] hover:bg-[#4DE1FF]/90 shadow-lg shadow-[#4DE1FF]/20"
        size="icon"
      >
        {isOpen ? <X className="w-6 h-6 text-black" /> : <HelpCircle className="w-6 h-6 text-black" />}
      </Button>

      {/* Chat Window */}
      {isOpen && (
        <Card className="fixed bottom-24 right-6 z-50 w-96 h-[500px] bg-[#0A0A0A] border-[#2A2A2A] shadow-2xl flex flex-col">
          <CardHeader className="border-b border-[#1A1A1A]">
            <CardTitle className="flex items-center gap-2 text-white">
              <HelpCircle className="w-5 h-5 text-[#4DE1FF]" />
              Ajuda UPGRD
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-lg ${
                    message.role === 'user'
                      ? 'bg-[#4DE1FF]/10 text-white border border-[#4DE1FF]/20'
                      : 'bg-[#1A1A1A] text-[#BEBEBE]'
                  }`}
                >
                  {message.content}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-[#1A1A1A] text-[#BEBEBE] p-3 rounded-lg">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-[#4DE1FF] rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-[#4DE1FF] rounded-full animate-bounce delay-100" />
                    <div className="w-2 h-2 bg-[#4DE1FF] rounded-full animate-bounce delay-200" />
                  </div>
                </div>
              </div>
            )}
          </CardContent>
          <div className="p-4 border-t border-[#1A1A1A]">
            <div className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="Digite sua dúvida..."
                className="bg-[#1A1A1A] border-[#2A2A2A] text-white"
              />
              <Button
                onClick={sendMessage}
                disabled={isLoading || !input.trim()}
                className="bg-[#4DE1FF] hover:bg-[#4DE1FF]/90 text-black"
                size="icon"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </Card>
      )}
    </>
  )
}
