'use client'

import { useState, useEffect } from 'react'
import AppLayout from '@/components/AppLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { MessageCircle, Send, ThumbsUp, User, Clock } from 'lucide-react'

interface Message {
  id: string
  userName: string
  userAvatar: string
  content: string
  timestamp: Date
  likes: number
}

export default function ComunidadePage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [userName, setUserName] = useState('')
  const [userAvatar, setUserAvatar] = useState('👤')

  useEffect(() => {
    // Load user info
    const name = localStorage.getItem('upgrd_user_name') || 'Anônimo'
    const avatar = localStorage.getItem('upgrd_avatar') || '👤'
    setUserName(name)
    setUserAvatar(avatar)

    // Load messages from localStorage
    const savedMessages = localStorage.getItem('upgrd_community_messages')
    if (savedMessages) {
      const parsed = JSON.parse(savedMessages)
      setMessages(parsed.map((msg: any) => ({
        ...msg,
        timestamp: new Date(msg.timestamp)
      })))
    } else {
      // Add some initial messages
      const initialMessages: Message[] = [
        {
          id: '1',
          userName: 'Admin UPGRD',
          userAvatar: '🎮',
          content: 'Bem-vindo à comunidade UPGRD! Aqui você pode conversar com outros usuários, compartilhar seu setup e trocar dicas sobre upgrades.',
          timestamp: new Date(Date.now() - 3600000),
          likes: 5
        },
        {
          id: '2',
          userName: 'Gamer Pro',
          userAvatar: '🚀',
          content: 'Acabei de fazer upgrade na minha GPU! RTX 4070 chegou hoje. Alguém tem dicas de otimização?',
          timestamp: new Date(Date.now() - 1800000),
          likes: 3
        }
      ]
      setMessages(initialMessages)
      localStorage.setItem('upgrd_community_messages', JSON.stringify(initialMessages))
    }
  }, [])

  const handleSendMessage = () => {
    if (!newMessage.trim()) return

    const message: Message = {
      id: Date.now().toString(),
      userName,
      userAvatar,
      content: newMessage,
      timestamp: new Date(),
      likes: 0
    }

    const updatedMessages = [...messages, message]
    setMessages(updatedMessages)
    localStorage.setItem('upgrd_community_messages', JSON.stringify(updatedMessages))
    setNewMessage('')
  }

  const handleLike = (messageId: string) => {
    const updatedMessages = messages.map(msg => 
      msg.id === messageId ? { ...msg, likes: msg.likes + 1 } : msg
    )
    setMessages(updatedMessages)
    localStorage.setItem('upgrd_community_messages', JSON.stringify(updatedMessages))
  }

  const formatTimestamp = (date: Date) => {
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (minutes < 1) return 'Agora'
    if (minutes < 60) return `${minutes}m atrás`
    if (hours < 24) return `${hours}h atrás`
    return `${days}d atrás`
  }

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <div className="p-3 bg-gradient-to-br from-[#4DE1FF] to-[#FF5BD4] rounded-xl">
            <MessageCircle className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">Comunidade</h1>
            <p className="text-[#BEBEBE]">Converse com outros usuários ativos</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="bg-[#111111] border-[#1A1A1A]">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <User className="w-5 h-5 text-[#4DE1FF]" />
                <div>
                  <p className="text-sm text-[#BEBEBE]">Usuários Ativos</p>
                  <p className="text-xl font-bold text-white">12</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#111111] border-[#1A1A1A]">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <MessageCircle className="w-5 h-5 text-[#FF5BD4]" />
                <div>
                  <p className="text-sm text-[#BEBEBE]">Mensagens Hoje</p>
                  <p className="text-xl font-bold text-white">{messages.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#111111] border-[#1A1A1A]">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <ThumbsUp className="w-5 h-5 text-[#00FF88]" />
                <div>
                  <p className="text-sm text-[#BEBEBE]">Total de Likes</p>
                  <p className="text-xl font-bold text-white">
                    {messages.reduce((sum, msg) => sum + msg.likes, 0)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Messages Feed */}
        <Card className="bg-[#111111] border-[#1A1A1A]">
          <CardHeader>
            <CardTitle className="text-white">Feed da Comunidade</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Messages List */}
            <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className="p-4 bg-[#0A0A0A] border border-[#1A1A1A] rounded-lg hover:border-[#2A2A2A] transition-all"
                >
                  <div className="flex items-start gap-3">
                    <div className="text-3xl">{message.userAvatar}</div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-semibold text-white">{message.userName}</span>
                        <span className="text-xs text-[#BEBEBE] flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {formatTimestamp(message.timestamp)}
                        </span>
                      </div>
                      <p className="text-[#BEBEBE] mb-3">{message.content}</p>
                      <Button
                        onClick={() => handleLike(message.id)}
                        variant="ghost"
                        size="sm"
                        className="text-[#BEBEBE] hover:text-[#00FF88] hover:bg-[#00FF88]/10 transition-all"
                      >
                        <ThumbsUp className="w-4 h-4 mr-2" />
                        {message.likes > 0 && <span>{message.likes}</span>}
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* New Message Input */}
            <div className="pt-4 border-t border-[#1A1A1A]">
              <div className="flex items-start gap-3">
                <div className="text-3xl">{userAvatar}</div>
                <div className="flex-1 space-y-3">
                  <Textarea
                    placeholder="Compartilhe algo com a comunidade..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    className="bg-[#0A0A0A] border-[#1A1A1A] text-white placeholder:text-[#666666] resize-none"
                    rows={3}
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim()}
                    className="w-full sm:w-auto bg-gradient-to-r from-[#4DE1FF] to-[#FF5BD4] hover:opacity-90 transition-all"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    Enviar Mensagem
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Community Guidelines */}
        <Card className="bg-[#111111] border-[#1A1A1A]">
          <CardHeader>
            <CardTitle className="text-white text-lg">Diretrizes da Comunidade</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-[#BEBEBE] text-sm">
              <li className="flex items-start gap-2">
                <span className="text-[#4DE1FF]">•</span>
                <span>Seja respeitoso com todos os membros da comunidade</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#4DE1FF]">•</span>
                <span>Compartilhe dicas e experiências sobre hardware e upgrades</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#4DE1FF]">•</span>
                <span>Evite spam e conteúdo ofensivo</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#4DE1FF]">•</span>
                <span>Ajude outros usuários com suas dúvidas</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  )
}
