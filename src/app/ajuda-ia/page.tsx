'use client'

import { useState, useEffect, useRef } from 'react'
import { Send, Loader2, Sparkles, MessageCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import AppLayout from '@/components/custom/app-layout'

export default function AjudaIAPage() {
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant'; content: string }[]>([
    {
      role: 'assistant',
      content: 'Olá! Sou o JARVIS, seu assistente inteligente no UPGRD. Posso ajudá-lo com:\n\n• Dúvidas sobre XP e níveis\n• Como completar missões\n• Análise de hardware e setup\n• Recomendações de upgrades\n• Dicas de otimização\n• Qualquer outra dúvida sobre o app\n\nComo posso ajudá-lo hoje?'
    }
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
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
    const newMessages = [...messages, { role: 'user' as const, content: userMessage }]
    setMessages(newMessages)
    setIsLoading(true)

    try {
      const response = await fetch('/api/jarvis', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage,
          conversationHistory: messages,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao processar mensagem')
      }

      setMessages([...newMessages, { role: 'assistant', content: data.response }])
    } catch (error: any) {
      console.error('Erro ao comunicar com JARVIS:', error)
      setMessages([
        ...newMessages,
        {
          role: 'assistant',
          content: 'Desculpe, ocorreu um erro ao processar sua mensagem. Por favor, verifique se a chave da API OpenAI está configurada corretamente.',
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  const quickQuestions = [
    'Como ganhar mais XP?',
    'Quais são as missões disponíveis?',
    'Como melhorar meu setup?',
    'Qual é o melhor upgrade para mim?',
  ]

  const handleQuickQuestion = (question: string) => {
    setInput(question)
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#4DE1FF] to-[#00B8D4] flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-black" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">Ajuda IA</h1>
            <p className="text-[#BEBEBE]">Converse com o JARVIS para tirar suas dúvidas</p>
          </div>
        </div>

        {/* Chat Card */}
        <Card className="bg-[#0A0A0A] border-[#2A2A2A]">
          <CardHeader className="border-b border-[#1A1A1A]">
            <CardTitle className="flex items-center gap-2 text-white">
              <MessageCircle className="w-5 h-5 text-[#4DE1FF]" />
              Chat com JARVIS
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {/* Messages Area */}
            <div className="h-[500px] overflow-y-auto p-6 space-y-4">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] p-4 rounded-lg ${
                      message.role === 'user'
                        ? 'bg-[#4DE1FF]/10 text-white border border-[#4DE1FF]/20'
                        : 'bg-[#1A1A1A] text-[#BEBEBE]'
                    }`}
                  >
                    <div className="whitespace-pre-line">{message.content}</div>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-[#1A1A1A] text-[#BEBEBE] p-4 rounded-lg flex items-center gap-2">
                    <Loader2 className="w-5 h-5 animate-spin text-[#4DE1FF]" />
                    <span>JARVIS está pensando...</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Questions */}
            {messages.length === 1 && (
              <div className="px-6 pb-4">
                <p className="text-sm text-[#BEBEBE] mb-3">Perguntas rápidas:</p>
                <div className="grid grid-cols-2 gap-2">
                  {quickQuestions.map((question, index) => (
                    <Button
                      key={index}
                      onClick={() => handleQuickQuestion(question)}
                      variant="outline"
                      className="bg-[#1A1A1A] border-[#2A2A2A] text-[#BEBEBE] hover:bg-[#2A2A2A] hover:text-white text-sm h-auto py-3 px-4 text-left justify-start"
                    >
                      {question}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* Input Area */}
            <div className="p-6 border-t border-[#1A1A1A]">
              <div className="flex gap-3">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && !isLoading && sendMessage()}
                  placeholder="Digite sua dúvida..."
                  disabled={isLoading}
                  className="bg-[#1A1A1A] border-[#2A2A2A] text-white"
                />
                <Button
                  onClick={sendMessage}
                  disabled={isLoading || !input.trim()}
                  className="bg-[#4DE1FF] hover:bg-[#4DE1FF]/90 text-black px-6"
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

        {/* Info Cards */}
        <div className="grid md:grid-cols-3 gap-4">
          <Card className="bg-[#1A1A1A] border-[#2A2A2A]">
            <CardContent className="p-6">
              <h3 className="text-white font-semibold mb-2">💡 Dicas de XP</h3>
              <p className="text-sm text-[#BEBEBE]">
                Pergunte ao JARVIS sobre as melhores formas de ganhar XP e subir de nível rapidamente.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-[#1A1A1A] border-[#2A2A2A]">
            <CardContent className="p-6">
              <h3 className="text-white font-semibold mb-2">🎯 Missões</h3>
              <p className="text-sm text-[#BEBEBE]">
                Descubra quais missões completar primeiro e como maximizar seus pontos.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-[#1A1A1A] border-[#2A2A2A]">
            <CardContent className="p-6">
              <h3 className="text-white font-semibold mb-2">🖥️ Hardware</h3>
              <p className="text-sm text-[#BEBEBE]">
                Obtenha recomendações personalizadas de upgrades e análises de setup.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  )
}
