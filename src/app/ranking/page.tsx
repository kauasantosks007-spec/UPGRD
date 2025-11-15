'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import AppLayout from '@/components/AppLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Trophy, Medal, Award } from 'lucide-react'

interface RankingUser {
  name: string
  level: number
  totalPoints: number
  setupScore: number
}

export default function Ranking() {
  const router = useRouter()
  const [ranking, setRanking] = useState<RankingUser[]>([])
  const [currentUser, setCurrentUser] = useState<RankingUser | null>(null)

  useEffect(() => {
    const userName = localStorage.getItem('upgrd_user_name')
    if (!userName) {
      router.push('/')
      return
    }

    loadRanking(userName)
  }, [router])

  const loadRanking = (currentUserName: string) => {
    const userData = JSON.parse(localStorage.getItem('upgrd_user_data') || '{}')
    const user: RankingUser = {
      name: currentUserName,
      level: userData.level || 0,
      totalPoints: userData.totalPoints || 0,
      setupScore: userData.setupScore || 0
    }
    setCurrentUser(user)

    const mockUsers: RankingUser[] = [
      user,
      { name: 'ProGamer123', level: 8, totalPoints: 4500, setupScore: 850 },
      { name: 'TechMaster', level: 7, totalPoints: 3800, setupScore: 920 },
      { name: 'SetupKing', level: 6, totalPoints: 3200, setupScore: 780 },
      { name: 'GamerElite', level: 5, totalPoints: 2800, setupScore: 650 },
      { name: 'PCBuilder', level: 5, totalPoints: 2500, setupScore: 720 },
      { name: 'HardwareNerd', level: 4, totalPoints: 2100, setupScore: 580 },
      { name: 'RGBLover', level: 4, totalPoints: 1900, setupScore: 620 },
      { name: 'FPSHunter', level: 3, totalPoints: 1500, setupScore: 490 },
      { name: 'Overclocker', level: 3, totalPoints: 1300, setupScore: 550 }
    ]

    const sorted = mockUsers.sort((a, b) => b.totalPoints - a.totalPoints)
    setRanking(sorted)
  }

  const getMedalIcon = (position: number) => {
    if (position === 0) return <Trophy className="w-8 h-8 text-[#D8A84E]" />
    if (position === 1) return <Medal className="w-8 h-8 text-[#BEBEBE]" />
    if (position === 2) return <Award className="w-8 h-8 text-[#CD7F32]" />
    return null
  }

  const getPositionColor = (position: number) => {
    if (position === 0) return 'bg-[#111111] border-[#D8A84E]/30'
    if (position === 1) return 'bg-[#111111] border-[#BEBEBE]/30'
    if (position === 2) return 'bg-[#111111] border-[#CD7F32]/30'
    return 'bg-[#111111] border-[#333333]'
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Ranking Global</h1>
          <p className="text-[#BEBEBE]">
            Veja os melhores jogadores do UPGRD
          </p>
        </div>

        {/* Current User Position */}
        {currentUser && (
          <Card className="bg-[#111111] border-[#4DE1FF]/20">
            <CardHeader>
              <CardTitle className="text-xl text-white">Sua Posição</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="text-3xl font-bold text-[#4DE1FF]">
                    #{ranking.findIndex(u => u.name === currentUser.name) + 1}
                  </div>
                  <div>
                    <div className="font-semibold text-lg text-white">{currentUser.name}</div>
                    <div className="text-sm text-[#BEBEBE]">
                      Nível {currentUser.level} • {currentUser.totalPoints} pontos
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-[#BEBEBE]">Setup Score</div>
                  <div className="text-2xl font-bold text-[#FF5BD4]">{currentUser.setupScore}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Ranking List */}
        <div className="space-y-3">
          {ranking.map((user, index) => (
            <Card
              key={index}
              className={`${getPositionColor(index)} hover:border-[#4DE1FF]/40 transition-all ${
                currentUser && user.name === currentUser.name ? 'ring-2 ring-[#4DE1FF]' : ''
              }`}
            >
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    {/* Position */}
                    <div className="flex items-center justify-center w-12">
                      {getMedalIcon(index) || (
                        <span className="text-2xl font-bold text-[#BEBEBE]">
                          #{index + 1}
                        </span>
                      )}
                    </div>

                    {/* User Info */}
                    <div>
                      <div className="font-semibold text-lg flex items-center gap-2 text-white">
                        {user.name}
                        {currentUser && user.name === currentUser.name && (
                          <span className="text-xs bg-[#4DE1FF]/20 text-[#4DE1FF] px-2 py-1 rounded border border-[#4DE1FF]">
                            Você
                          </span>
                        )}
                      </div>
                      <div className="text-sm text-[#BEBEBE]">
                        Nível {user.level}
                      </div>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="flex gap-8 text-right">
                    <div>
                      <div className="text-xs text-[#BEBEBE]">Pontos</div>
                      <div className="text-xl font-bold text-white">
                        {user.totalPoints.toLocaleString()}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-[#BEBEBE]">Setup Score</div>
                      <div className="text-xl font-bold text-[#FF5BD4]">{user.setupScore}</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Info Card */}
        <Card className="bg-[#111111] border-[#333333]">
          <CardContent className="pt-6">
            <p className="text-center text-[#BEBEBE]">
              💡 Complete missões e melhore seu setup para subir no ranking!
            </p>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  )
}
