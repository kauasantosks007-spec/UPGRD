'use client'

import { useState, useEffect } from 'react'
import AppLayout from '@/components/AppLayout'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Tag, TrendingUp, ExternalLink, Heart, MessageCircle, Share2, Clock, DollarSign, MessageSquare } from 'lucide-react'

interface Promo {
  id: string
  userName: string
  userAvatar: string
  title: string
  description: string
  link: string
  price: string
  discount: string
  category: string
  timestamp: number
  likes: number
  comments: number
}

export default function GrupoPromoPage() {
  const [promos, setPromos] = useState<Promo[]>([])
  const [newPromo, setNewPromo] = useState({
    title: '',
    description: '',
    link: '',
    price: '',
    discount: '',
    category: 'Hardware'
  })
  const [userName, setUserName] = useState('')
  const [userAvatar, setUserAvatar] = useState('👤')
  const [likedPromos, setLikedPromos] = useState<Set<string>>(new Set())

  useEffect(() => {
    // Load user info
    const name = localStorage.getItem('upgrd_user_name') || 'Usuário'
    const avatar = localStorage.getItem('upgrd_avatar') || '👤'
    setUserName(name)
    setUserAvatar(avatar)

    // Load promos from localStorage
    const savedPromos = localStorage.getItem('upgrd_promos')
    if (savedPromos) {
      setPromos(JSON.parse(savedPromos))
    }

    // Load liked promos
    const savedLikes = localStorage.getItem('upgrd_liked_promos')
    if (savedLikes) {
      setLikedPromos(new Set(JSON.parse(savedLikes)))
    }
  }, [])

  const savePromos = (updatedPromos: Promo[]) => {
    localStorage.setItem('upgrd_promos', JSON.stringify(updatedPromos))
    setPromos(updatedPromos)
  }

  const handleSubmitPromo = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!newPromo.title || !newPromo.link) {
      alert('Por favor, preencha pelo menos o título e o link da promoção!')
      return
    }

    const promo: Promo = {
      id: Date.now().toString(),
      userName,
      userAvatar,
      ...newPromo,
      timestamp: Date.now(),
      likes: 0,
      comments: 0
    }

    const updatedPromos = [promo, ...promos]
    savePromos(updatedPromos)

    // Reset form
    setNewPromo({
      title: '',
      description: '',
      link: '',
      price: '',
      discount: '',
      category: 'Hardware'
    })
  }

  const handleLike = (promoId: string) => {
    const newLikedPromos = new Set(likedPromos)
    const updatedPromos = promos.map(promo => {
      if (promo.id === promoId) {
        if (likedPromos.has(promoId)) {
          newLikedPromos.delete(promoId)
          return { ...promo, likes: promo.likes - 1 }
        } else {
          newLikedPromos.add(promoId)
          return { ...promo, likes: promo.likes + 1 }
        }
      }
      return promo
    })

    setLikedPromos(newLikedPromos)
    localStorage.setItem('upgrd_liked_promos', JSON.stringify([...newLikedPromos]))
    savePromos(updatedPromos)
  }

  const formatTimeAgo = (timestamp: number) => {
    const seconds = Math.floor((Date.now() - timestamp) / 1000)
    if (seconds < 60) return 'agora mesmo'
    const minutes = Math.floor(seconds / 60)
    if (minutes < 60) return `${minutes}m atrás`
    const hours = Math.floor(minutes / 60)
    if (hours < 24) return `${hours}h atrás`
    const days = Math.floor(hours / 24)
    return `${days}d atrás`
  }

  const categories = ['Hardware', 'Periféricos', 'Jogos', 'Software', 'Acessórios', 'Outros']

  return (
    <AppLayout>
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <div className="p-3 bg-gradient-to-br from-[#FF5BD4] to-[#4DE1FF] rounded-xl">
            <Tag className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">Grupo de Promoções</h1>
            <p className="text-[#BEBEBE]">Compartilhe e descubra as melhores ofertas</p>
          </div>
        </div>

        {/* WhatsApp Group Button */}
        <Card className="bg-gradient-to-r from-[#25D366]/20 to-[#128C7E]/20 border-[#25D366]/30 p-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-[#25D366] rounded-xl">
                <MessageSquare className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Grupo no WhatsApp</h3>
                <p className="text-[#BEBEBE] text-sm">Junte-se à comunidade e receba promoções em tempo real!</p>
              </div>
            </div>
            <a
              href="https://chat.whatsapp.com/ErWqP7RIgZAC9Ax16Q3C7m"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full md:w-auto"
            >
              <Button className="w-full md:w-auto bg-[#25D366] hover:bg-[#128C7E] text-white font-semibold px-8 py-6 text-lg transition-all">
                <MessageSquare className="w-5 h-5 mr-2" />
                Entrar no Grupo
              </Button>
            </a>
          </div>
        </Card>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-[#111111] border-[#1A1A1A] p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[#BEBEBE] text-sm">Total de Promoções</p>
                <p className="text-3xl font-bold text-white mt-1">{promos.length}</p>
              </div>
              <Tag className="w-10 h-10 text-[#4DE1FF]" />
            </div>
          </Card>

          <Card className="bg-[#111111] border-[#1A1A1A] p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[#BEBEBE] text-sm">Curtidas Totais</p>
                <p className="text-3xl font-bold text-white mt-1">
                  {promos.reduce((sum, promo) => sum + promo.likes, 0)}
                </p>
              </div>
              <Heart className="w-10 h-10 text-[#FF5BD4]" />
            </div>
          </Card>

          <Card className="bg-[#111111] border-[#1A1A1A] p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[#BEBEBE] text-sm">Promoções Hoje</p>
                <p className="text-3xl font-bold text-white mt-1">
                  {promos.filter(p => Date.now() - p.timestamp < 86400000).length}
                </p>
              </div>
              <TrendingUp className="w-10 h-10 text-[#00FF94]" />
            </div>
          </Card>
        </div>

        {/* New Promo Form */}
        <Card className="bg-[#111111] border-[#1A1A1A] p-6">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <Tag className="w-5 h-5 text-[#4DE1FF]" />
            Compartilhar Nova Promoção
          </h2>
          
          <form onSubmit={handleSubmitPromo} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-[#BEBEBE] mb-2 block">Título da Promoção *</label>
                <Input
                  value={newPromo.title}
                  onChange={(e) => setNewPromo({ ...newPromo, title: e.target.value })}
                  placeholder="Ex: RTX 4060 Ti com 30% OFF"
                  className="bg-[#0A0A0A] border-[#1A1A1A] text-white"
                />
              </div>

              <div>
                <label className="text-sm text-[#BEBEBE] mb-2 block">Categoria</label>
                <select
                  value={newPromo.category}
                  onChange={(e) => setNewPromo({ ...newPromo, category: e.target.value })}
                  className="w-full bg-[#0A0A0A] border border-[#1A1A1A] text-white rounded-lg px-3 py-2"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="text-sm text-[#BEBEBE] mb-2 block">Descrição</label>
              <Textarea
                value={newPromo.description}
                onChange={(e) => setNewPromo({ ...newPromo, description: e.target.value })}
                placeholder="Detalhes sobre a promoção..."
                className="bg-[#0A0A0A] border-[#1A1A1A] text-white min-h-[100px]"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm text-[#BEBEBE] mb-2 block">Link da Promoção *</label>
                <Input
                  value={newPromo.link}
                  onChange={(e) => setNewPromo({ ...newPromo, link: e.target.value })}
                  placeholder="https://..."
                  className="bg-[#0A0A0A] border-[#1A1A1A] text-white"
                />
              </div>

              <div>
                <label className="text-sm text-[#BEBEBE] mb-2 block">Preço</label>
                <Input
                  value={newPromo.price}
                  onChange={(e) => setNewPromo({ ...newPromo, price: e.target.value })}
                  placeholder="R$ 1.299,00"
                  className="bg-[#0A0A0A] border-[#1A1A1A] text-white"
                />
              </div>

              <div>
                <label className="text-sm text-[#BEBEBE] mb-2 block">Desconto</label>
                <Input
                  value={newPromo.discount}
                  onChange={(e) => setNewPromo({ ...newPromo, discount: e.target.value })}
                  placeholder="30% OFF"
                  className="bg-[#0A0A0A] border-[#1A1A1A] text-white"
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-[#4DE1FF] to-[#FF5BD4] text-white hover:opacity-90 transition-all"
            >
              <Tag className="w-4 h-4 mr-2" />
              Compartilhar Promoção
            </Button>
          </form>
        </Card>

        {/* Promos Feed */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-[#00FF94]" />
            Promoções Recentes
          </h2>

          {promos.length === 0 ? (
            <Card className="bg-[#111111] border-[#1A1A1A] p-12 text-center">
              <Tag className="w-16 h-16 text-[#4DE1FF] mx-auto mb-4 opacity-50" />
              <p className="text-[#BEBEBE] text-lg">Nenhuma promoção compartilhada ainda.</p>
              <p className="text-[#BEBEBE] text-sm mt-2">Seja o primeiro a compartilhar uma oferta incrível!</p>
            </Card>
          ) : (
            promos.map((promo) => (
              <Card key={promo.id} className="bg-[#111111] border-[#1A1A1A] p-6 hover:border-[#2A2A2A] transition-all">
                {/* User Info */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="text-3xl">{promo.userAvatar}</div>
                  <div className="flex-1">
                    <p className="text-white font-semibold">{promo.userName}</p>
                    <div className="flex items-center gap-2 text-sm text-[#BEBEBE]">
                      <Clock className="w-3 h-3" />
                      {formatTimeAgo(promo.timestamp)}
                      <span className="mx-1">•</span>
                      <span className="px-2 py-0.5 bg-[#1A1A1A] rounded text-xs">{promo.category}</span>
                    </div>
                  </div>
                </div>

                {/* Promo Content */}
                <div className="space-y-3">
                  <h3 className="text-xl font-bold text-white">{promo.title}</h3>
                  
                  {promo.description && (
                    <p className="text-[#BEBEBE]">{promo.description}</p>
                  )}

                  {/* Price and Discount */}
                  <div className="flex items-center gap-4">
                    {promo.price && (
                      <div className="flex items-center gap-2 text-[#00FF94]">
                        <DollarSign className="w-4 h-4" />
                        <span className="font-semibold">{promo.price}</span>
                      </div>
                    )}
                    {promo.discount && (
                      <div className="px-3 py-1 bg-gradient-to-r from-[#FF5BD4] to-[#4DE1FF] rounded-full text-white text-sm font-semibold">
                        {promo.discount}
                      </div>
                    )}
                  </div>

                  {/* Link */}
                  <a
                    href={promo.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-[#4DE1FF] hover:text-[#FF5BD4] transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span className="text-sm">Ver Promoção</span>
                  </a>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-4 mt-4 pt-4 border-t border-[#1A1A1A]">
                  <button
                    onClick={() => handleLike(promo.id)}
                    className={`flex items-center gap-2 transition-all ${
                      likedPromos.has(promo.id)
                        ? 'text-[#FF5BD4]'
                        : 'text-[#BEBEBE] hover:text-[#FF5BD4]'
                    }`}
                  >
                    <Heart className={`w-5 h-5 ${likedPromos.has(promo.id) ? 'fill-current' : ''}`} />
                    <span className="text-sm font-medium">{promo.likes}</span>
                  </button>

                  <button className="flex items-center gap-2 text-[#BEBEBE] hover:text-[#4DE1FF] transition-colors">
                    <MessageCircle className="w-5 h-5" />
                    <span className="text-sm font-medium">{promo.comments}</span>
                  </button>

                  <button className="flex items-center gap-2 text-[#BEBEBE] hover:text-[#00FF94] transition-colors ml-auto">
                    <Share2 className="w-5 h-5" />
                    <span className="text-sm font-medium">Compartilhar</span>
                  </button>
                </div>
              </Card>
            ))
          )}
        </div>

        {/* Tips Card */}
        <Card className="bg-gradient-to-br from-[#111111] to-[#0A0A0A] border-[#1A1A1A] p-6">
          <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-[#00FF94]" />
            Dicas para Compartilhar Promoções
          </h3>
          <ul className="space-y-2 text-[#BEBEBE] text-sm">
            <li className="flex items-start gap-2">
              <span className="text-[#4DE1FF] mt-1">•</span>
              <span>Verifique se o link está funcionando antes de compartilhar</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#4DE1FF] mt-1">•</span>
              <span>Adicione detalhes importantes como prazo de validade e condições</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#4DE1FF] mt-1">•</span>
              <span>Use títulos claros e objetivos para facilitar a busca</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#4DE1FF] mt-1">•</span>
              <span>Compartilhe apenas promoções legítimas de lojas confiáveis</span>
            </li>
          </ul>
        </Card>
      </div>
    </AppLayout>
  )
}
