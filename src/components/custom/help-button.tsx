'use client'

import { useState, useEffect, useRef } from 'react'
import { HelpCircle, X, Send, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'

export default function HelpButton() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant'; content: string }[]>([
    {
      role: 'assistant',
      content: 'Olá! Sou o JARVIS, seu assistente inteligente no UPGRD. Como posso ajudá-lo hoje?'
    }
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [threadId, setThreadId] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Auto-scroll para última mensagem
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages])

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return

    const userMessage = input
    setInput('')
    setMessages([...messages, { role: 'user', content: userMessage }])
    setIsLoading(true)

    try {
      const response = await fetch('/api/jarvis', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage,
          threadId: threadId,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao processar mensagem')
      }

      setThreadId(data.threadId)
      setMessages((prev) => [...prev, { role: 'assistant', content: data.response }])
    } catch (error: any) {
      console.error('Erro ao comunicar com JARVIS:', error)
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: 'Desculpe, ocorreu um erro ao processar sua mensagem. Por favor, tente novamente.',
        },
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
              JARVIS - Assistente IA
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
                  <div className="whitespace-pre-line text-sm">{message.content}</div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-[#1A1A1A] text-[#BEBEBE] p-3 rounded-lg flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin text-[#4DE1FF]" />
                  <span className="text-sm">JARVIS está pensando...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </CardContent>
          <div className="p-4 border-t border-[#1A1A1A]">
            <div className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && !isLoading && sendMessage()}
                placeholder="Digite sua dúvida..."
                disabled={isLoading}
                className="bg-[#1A1A1A] border-[#2A2A2A] text-white text-sm"
              />
              <Button
                onClick={sendMessage}
                disabled={isLoading || !input.trim()}
                className="bg-[#4DE1FF] hover:bg-[#4DE1FF]/90 text-black"
                size="icon"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </Button>
            </div>
          </div>
        </Card>
      )}
    </>
  )
}
