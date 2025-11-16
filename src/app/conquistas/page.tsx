'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import AppLayout from '@/components/custom/app-layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Award, Lock, CheckCircle, Trophy, BookOpen, Video, Eye, Flame, Target, Monitor } from 'lucide-react'
import { getUserName, getAchievements, setAchievements, getUserData, setUserData } from '@/lib/storage'
import { Achievement } from '@/lib/types'

export default function Conquistas() {
  const router = useRouter()
  const [achievements, setAchievementsState] = useState<Achievement[]>([])
  const [unlockedCount, setUnlockedCount] = useState(0)

  useEffect(() => {
    const name = getUserName()
    if (!name) {
      router.push('/')
      return
    }

    const savedAchievements = getAchievements()
    setAchievementsState(savedAchievements)
    setUnlockedCount(savedAchievements.filter(a => a.unlocked).length)
  }, [router])

  const getIcon = (iconName: string) => {
    const icons: Record<string, any> = {
      Monitor,
      Trophy,
      BookOpen,
      Video,
      Eye,
      Flame,
      Award,
      Target
    }
    const Icon = icons[iconName] || Award
    return <Icon className="w-8 h-8" />
  }

  const unlockAchievement = (id: string) => {
    const updated = achievements.map(achievement => {
      if (achievement.id === id && !achievement.unlocked) {
        const userData = getUserData()
        if (userData) {
          const newAchievements = userData.achievements + 1
          const newTotalPoints = userData.totalPoints + achievement.points
          const newXp = userData.xp + achievement.points
          
          let newLevel = userData.level
          let remainingXp = newXp
          let xpNeeded = userData.xpToNextLevel

          while (remainingXp >= xpNeeded) {
            remainingXp -= xpNeeded
            newLevel++
            xpNeeded = 1000 + (newLevel * 500)
          }

          setUserData({
            ...userData,
            achievements: newAchievements,
            totalPoints: newTotalPoints,
            level: newLevel,
            xp: remainingXp,
            xpToNextLevel: xpNeeded
          })
        }

        return {
          ...achievement,
          unlocked: true,
          unlockedAt: new Date().toISOString()
        }
      }
      return achievement
    })

    setAchievementsState(updated)
    setAchievements(updated)
    setUnlockedCount(updated.filter(a => a.unlocked).length)
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            Conquistas
          </h1>
          <p className="text-[#BEBEBE]">
            Desbloqueie achievements e ganhe pontos extras
          </p>
        </div>

        {/* Progress Card */}
        <Card className="bg-gradient-to-r from-[#D8A84E]/10 to-[#FF5BD4]/10 border-[#D8A84E]/20">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold text-white mb-2">
                  {unlockedCount} / {achievements.length}
                </h3>
                <p className="text-[#BEBEBE]">Conquistas Desbloqueadas</p>
              </div>
              <Trophy className="w-16 h-16 text-[#D8A84E]" />
            </div>
          </CardContent>
        </Card>

        {/* Achievements Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {achievements.map((achievement) => (
            <Card
              key={achievement.id}
              className={`transition-all ${
                achievement.unlocked
                  ? 'bg-gradient-to-br from-[#D8A84E]/10 to-[#FF5BD4]/10 border-[#D8A84E]/40'
                  : 'bg-[#111111] border-[#2A2A2A] opacity-60'
              }`}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div
                    className={`p-3 rounded-lg ${
                      achievement.unlocked
                        ? 'bg-[#D8A84E]/20 text-[#D8A84E]'
                        : 'bg-[#1A1A1A] text-[#666666]'
                    }`}
                  >
                    {achievement.unlocked ? (
                      getIcon(achievement.icon)
                    ) : (
                      <Lock className="w-8 h-8" />
                    )}
                  </div>
                  {achievement.unlocked && (
                    <CheckCircle className="w-6 h-6 text-[#4DE1FF]" />
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <h3 className="text-xl font-bold text-white mb-2">
                  {achievement.name}
                </h3>
                <p className="text-sm text-[#BEBEBE] mb-4">
                  {achievement.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-[#4DE1FF] font-semibold">
                    +{achievement.points} pts
                  </span>
                  {achievement.unlocked && achievement.unlockedAt && (
                    <span className="text-xs text-[#666666]">
                      {new Date(achievement.unlockedAt).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Tips Card */}
        <Card className="bg-[#111111] border-[#2A2A2A]">
          <CardHeader>
            <CardTitle className="text-white">Dicas para Desbloquear</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="p-3 bg-[#1A1A1A] rounded-lg">
              <p className="text-[#BEBEBE]">
                <span className="text-[#4DE1FF] font-semibold">Setup Master:</span> Complete todas as informações na página Setup
              </p>
            </div>
            <div className="p-3 bg-[#1A1A1A] rounded-lg">
              <p className="text-[#BEBEBE]">
                <span className="text-[#4DE1FF] font-semibold">UPGRD Pro:</span> Acumule 1000 pontos totais
              </p>
            </div>
            <div className="p-3 bg-[#1A1A1A] rounded-lg">
              <p className="text-[#BEBEBE]">
                <span className="text-[#4DE1FF] font-semibold">Sequências:</span> Entre no app todos os dias para manter sua streak
              </p>
            </div>
            <div className="p-3 bg-[#1A1A1A] rounded-lg">
              <p className="text-[#BEBEBE]">
                <span className="text-[#4DE1FF] font-semibold">Especialistas:</span> Use as IAs especializadas para desbloquear conquistas específicas
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  )
}
