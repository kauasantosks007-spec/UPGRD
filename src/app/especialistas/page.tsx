'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import AppLayout from '@/components/custom/app-layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Sparkles, Send, TrendingUp, Gamepad2, BookOpen, Video, Code, Users, DollarSign, Briefcase } from 'lucide-react'
import { getUserName, getApiKey, addPoints } from '@/lib/storage'
import { AISpecialist } from '@/lib/types'

const specialists: AISpecialist[] = [
  {
    id: 'produtividade',
    name: 'IA de Produtividade',
    description: 'Especialista em otimização de tempo e produtividade',
    icon: 'TrendingUp',
    systemPrompt: 'Você é um especialista em produtividade e gestão de tempo. Ajude o usuário a otimizar sua rotina, criar hábitos eficientes e alcançar seus objetivos.'
  },
  {
    id: 'games',
    name: 'IA de Games',
    description: 'Especialista em jogos e performance gaming',
    icon: 'Gamepad2',
    systemPrompt: 'Você é um especialista em jogos e hardware gaming. Ajude com dicas de jogos, otimização de performance, configurações e recomendações.'
  },
  {
    id: 'estudos',
    name: 'IA de Estudos',
    description: 'Especialista em aprendizado e técnicas de estudo',
    icon: 'BookOpen',
    systemPrompt: 'Você é um especialista em educação e técnicas de estudo. Ajude o usuário a aprender de forma eficiente, criar planos de estudo e dominar novos assuntos.'
  },
  {
    id: 'edicao',
    name: 'IA de Edição',
    description: 'Especialista em edição de vídeo e foto',
    icon: 'Video',
    systemPrompt: 'Você é um especialista em edição de vídeo e fotografia. Ajude com técnicas de edição, software, efeitos e dicas profissionais.'
  },
  {
    id: 'programacao',
    name: 'IA de Programação',
    description: 'Especialista em desenvolvimento e código',
    icon: 'Code',
    systemPrompt: 'Você é um especialista em programação e desenvolvimento de software. Ajude com código, debugging, arquitetura e melhores práticas.'
  },
  {
    id: 'criadores',
    name: 'IA de Criadores',
    description: 'Especialista em criação de conteúdo',
    icon: 'Users',
    systemPrompt: 'Você é um especialista em criação de conteúdo digital. Ajude com estratégias de conteúdo, crescimento de audiência e monetização.'
  },
  {
    id: 'marketing',
    name: 'IA de Marketing',
    description: 'Especialista em marketing digital',
    icon: 'Briefcase',
    systemPrompt: 'Você é um especialista em marketing digital. Ajude com estratégias de marketing, branding, redes sociais e campanhas.'
  },
  {
    id: 'financeira',
    name: 'IA Financeira',
    description: 'Especialista em finanças pessoais',
    icon: 'DollarSign',
    systemPrompt: 'Você é um especialista em finanças pessoais. Ajude com planejamento financeiro, investimentos, orçamento e economia.'
  }
]

export default function Especialistas() {
  const router = useRouter()
  const [activeSpecialist, setActiveSpecialist] = useState(specialists[0])
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant'; content: string }[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [apiKey, setApiKeyState] = useState('')

  useEffect(() => {
    const name = getUserName()
    if (!name) {
      router.push('/')
      return
    }

    const key = getApiKey()
    if (key) {
      setApiKeyState(key)
    }

    // Initialize with welcome message
    setMessages([
      {
        role: 'assistant',
        content: `Olá! Sou a ${activeSpecialist.name}. ${activeSpecialist.description}. Como posso ajudar você hoje?`
      }
    ])
  }, [router])

  const switchSpecialist = (specialist: AISpecialist) => {
    setActiveSpecialist(specialist)
    setMessages([
      {
        role: 'assistant',
        content: `Olá! Sou a ${specialist.name}. ${specialist.description}. Como posso ajudar você hoje?`
      }
    ])
  }

  const sendMessage = async () => {
    if (!input.trim()) return

    if (!apiKey) {
      alert('Por favor, configure sua API Key abaixo para usar os especialistas IA')
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
              content: activeSpecialist.systemPrompt
            },
            ...messages.map((m) => ({ role: m.role, content: m.content })),
            { role: 'user', content: userMessage }
          ]
        })
      })

      const data = await response.json()
      const assistantMessage = data.choices[0].message.content

      setMessages((prev) => [...prev, { role: 'assistant', content: assistantMessage }])
      
      // Add points for using AI
      addPoints(2, 'Uso de IA especialista')
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

  const getIcon = (iconName: string) => {
    const icons: Record<string, any> = {
      TrendingUp,
      Gamepad2,
      BookOpen,
      Video,
      Code,
      Users,
      Briefcase,
      DollarSign
    }
    const Icon = icons[iconName] || Sparkles
    return <Icon className="w-5 h-5" />
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            Especialistas IA
          </h1>
          <p className="text-[#BEBEBE]">
            Converse com IAs especializadas em diferentes áreas
          </p>
        </div>

        {/* API Key Input */}
        {!apiKey && (
          <Card className="bg-[#FF5BD4]/10 border-[#FF5BD4]/40">
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <Sparkles className="w-6 h-6 text-[#FF5BD4] flex-shrink-0 mt-1" />
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white mb-2">
                    Configure sua API Key
                  </h3>
                  <p className="text-sm text-[#BEBEBE] mb-4">
                    Insira sua chave API da OpenAI para usar os especialistas IA. Você pode configurar isso na página de Perfil.
                  </p>
                  <Button
                    onClick={() => router.push('/perfil')}
                    className="bg-[#FF5BD4] hover:bg-[#FF5BD4]/90 text-black"
                  >
                    Ir para Perfil
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Specialists List */}
          <Card className="bg-[#111111] border-[#2A2A2A] lg:col-span-1">
            <CardHeader>
              <CardTitle className="text-white text-sm">Especialistas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {specialists.map((specialist) => (
                <Button
                  key={specialist.id}
                  onClick={() => switchSpecialist(specialist)}
                  variant="ghost"
                  className={`w-full justify-start ${
                    activeSpecialist.id === specialist.id
                      ? 'bg-[#4DE1FF]/10 text-[#4DE1FF] border border-[#4DE1FF]/20'
                      : 'text-[#BEBEBE] hover:bg-[#1A1A1A] hover:text-white'
                  }`}
                >
                  {getIcon(specialist.icon)}
                  <span className="ml-2 text-sm">{specialist.name.replace('IA de ', '')}</span>
                </Button>
              ))}
            </CardContent>
          </Card>

          {/* Chat Interface */}
          <Card className="bg-[#111111] border-[#2A2A2A] lg:col-span-3 flex flex-col h-[600px]">
            <CardHeader className="border-b border-[#1A1A1A]">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-[#4DE1FF]/10 rounded-lg">
                  {getIcon(activeSpecialist.icon)}
                </div>
                <div>
                  <CardTitle className="text-white">{activeSpecialist.name}</CardTitle>
                  <p className="text-sm text-[#BEBEBE]">{activeSpecialist.description}</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
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
                    <div className="whitespace-pre-wrap">{message.content}</div>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-[#1A1A1A] text-[#BEBEBE] p-4 rounded-lg">
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
                  placeholder="Digite sua mensagem..."
                  className="bg-[#1A1A1A] border-[#2A2A2A] text-white"
                  disabled={!apiKey}
                />
                <Button
                  onClick={sendMessage}
                  disabled={isLoading || !input.trim() || !apiKey}
                  className="bg-[#4DE1FF] hover:bg-[#4DE1FF]/90 text-black"
                  size="icon"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </AppLayout>
  )
}
