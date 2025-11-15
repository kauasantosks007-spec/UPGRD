'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import AppLayout from '@/components/AppLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { User, Trophy, Target, Save } from 'lucide-react'

interface UserProfile {
  name: string
  avatar: string
  level: number
  setupScore: number
  achievements: number
  totalAchievements: number
}

export default function Perfil() {
  const router = useRouter()
  const [profile, setProfile] = useState<UserProfile>({
    name: '',
    avatar: '👤',
    level: 0,
    setupScore: 0,
    achievements: 0,
    totalAchievements: 10
  })
  const [newName, setNewName] = useState('')
  const [newAvatar, setNewAvatar] = useState('')

  useEffect(() => {
    const userName = localStorage.getItem('upgrd_user_name')
    if (!userName) {
      router.push('/')
      return
    }

    loadProfile(userName)
  }, [router])

  const loadProfile = (userName: string) => {
    const userData = JSON.parse(localStorage.getItem('upgrd_user_data') || '{}')
    const savedAvatar = localStorage.getItem('upgrd_avatar') || '👤'

    const profileData: UserProfile = {
      name: userName,
      avatar: savedAvatar,
      level: userData.level || 0,
      setupScore: userData.setupScore || 0,
      achievements: userData.achievements || 0,
      totalAchievements: userData.totalAchievements || 10
    }

    setProfile(profileData)
    setNewName(userName)
    setNewAvatar(savedAvatar)
  }

  const handleSave = () => {
    if (!newName.trim()) {
      alert('Por favor, insira um nome válido')
      return
    }

    // Update localStorage
    localStorage.setItem('upgrd_user_name', newName.trim())

    const avatarToSave = newAvatar.trim() || '👤'
    localStorage.setItem('upgrd_avatar', avatarToSave)

    // Update local state
    setProfile({
      ...profile,
      name: newName.trim(),
      avatar: avatarToSave
    })

    // Dispatch custom event to update AppLayout
    window.dispatchEvent(new Event('profileUpdated'))

    alert('Perfil atualizado com sucesso! Seu nome foi alterado em todo o aplicativo.')
  }

  const avatarOptions = ['👤', '🎮', '💻', '🚀', '⚡', '🔥', '💎', '🏆', '🎯', '👾', '🤖', '🦾']

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Meu Perfil</h1>
          <p className="text-[#BEBEBE]">
            Personalize suas informações e acompanhe seu progresso
          </p>
        </div>

        {/* Profile Overview */}
        <Card className="bg-[#111111] border-[#4DE1FF]/20">
          <CardContent className="pt-6">
            <div className="flex items-center gap-6">
              <div className="text-8xl">{profile.avatar}</div>
              <div className="flex-1">
                <h2 className="text-3xl font-bold text-white mb-2">{profile.name}</h2>
                <div className="grid grid-cols-3 gap-4 mt-4">
                  <div>
                    <div className="text-sm text-[#BEBEBE]">Nível</div>
                    <div className="text-2xl font-bold text-[#4DE1FF]">{profile.level}</div>
                  </div>
                  <div>
                    <div className="text-sm text-[#BEBEBE]">Setup Score</div>
                    <div className="text-2xl font-bold text-white">{profile.setupScore}</div>
                  </div>
                  <div>
                    <div className="text-sm text-[#BEBEBE]">Conquistas</div>
                    <div className="text-2xl font-bold text-white">
                      {profile.achievements}/{profile.totalAchievements}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Edit Profile */}
        <Card className="bg-[#111111] border-[#333333]">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-2 text-white">
              <User className="w-6 h-6 text-[#4DE1FF]" />
              Editar Perfil
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-lg text-white">Nome</Label>
              <Input
                id="name"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Digite seu nome"
                className="text-lg bg-[#0A0A0A] border-[#333333] text-white"
              />
              <p className="text-sm text-[#BEBEBE]">
                Seu nome será atualizado em todo o aplicativo
              </p>
            </div>

            <div className="space-y-2">
              <Label className="text-lg text-white">Avatar</Label>
              <div className="grid grid-cols-6 gap-3">
                {avatarOptions.map((emoji) => (
                  <button
                    key={emoji}
                    onClick={() => setNewAvatar(emoji)}
                    className={`text-4xl p-4 rounded-lg border-2 transition-all hover:scale-110 ${
                      newAvatar === emoji
                        ? 'border-[#4DE1FF] bg-[#4DE1FF]/10'
                        : 'border-[#333333] hover:border-[#4DE1FF]/50'
                    }`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>

            <Button
              onClick={handleSave}
              className="w-full text-lg py-6 bg-[#4DE1FF]/10 border border-[#4DE1FF] text-[#4DE1FF] hover:bg-[#4DE1FF]/20 transition-all"
              size="lg"
            >
              <Save className="w-5 h-5 mr-2" />
              Salvar Alterações
            </Button>
          </CardContent>
        </Card>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-[#111111] border-[#333333]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Trophy className="w-5 h-5 text-[#4DE1FF]" />
                Nível Atual
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-[#4DE1FF]">{profile.level}</div>
              <p className="text-sm text-[#BEBEBE] mt-2">
                Continue completando missões para subir de nível
              </p>
            </CardContent>
          </Card>

          <Card className="bg-[#111111] border-[#333333]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Target className="w-5 h-5 text-[#FF5BD4]" />
                Setup Score
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-white">{profile.setupScore}</div>
              <p className="text-sm text-[#BEBEBE] mt-2">
                Atualize seu setup para aumentar o score
              </p>
            </CardContent>
          </Card>

          <Card className="bg-[#111111] border-[#333333]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Trophy className="w-5 h-5 text-[#FF5BD4]" />
                Conquistas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-white">
                {profile.achievements}/{profile.totalAchievements}
              </div>
              <p className="text-sm text-[#BEBEBE] mt-2">
                {profile.totalAchievements - profile.achievements} conquistas restantes
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Achievements Preview */}
        <Card className="bg-[#111111] border-[#333333]">
          <CardHeader>
            <CardTitle className="text-2xl text-white">Conquistas Disponíveis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {[
                { icon: '🎯', name: 'Primeiro Setup' },
                { icon: '🥉', name: 'Bronze' },
                { icon: '🥈', name: 'Prata' },
                { icon: '🥇', name: 'Ouro' },
                { icon: '💎', name: 'Diamante' },
                { icon: '🎮', name: '10 Missões' },
                { icon: '🔥', name: '4 Semanas' },
                { icon: '⭐', name: 'Nível 5' },
                { icon: '💯', name: '1000 XP' },
                { icon: '🏆', name: 'Top 10' }
              ].map((achievement, idx) => (
                <div
                  key={idx}
                  className={`text-center p-4 rounded-lg border ${
                    idx < profile.achievements
                      ? 'border-[#4DE1FF] bg-[#4DE1FF]/10'
                      : 'border-[#333333] opacity-50'
                  }`}
                >
                  <div className="text-4xl mb-2">{achievement.icon}</div>
                  <div className="text-sm font-semibold text-white">{achievement.name}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  )
}
