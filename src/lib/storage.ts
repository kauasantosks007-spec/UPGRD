// Storage utilities for UPGRD Platform

import { UserData, SetupData, Achievement, Mission } from './types'

// User Data
export const getUserData = (): UserData | null => {
  if (typeof window === 'undefined') return null
  const data = localStorage.getItem('upgrd_user_data')
  return data ? JSON.parse(data) : null
}

export const setUserData = (data: UserData): void => {
  if (typeof window === 'undefined') return
  localStorage.setItem('upgrd_user_data', JSON.stringify(data))
}

export const getUserName = (): string | null => {
  if (typeof window === 'undefined') return null
  return localStorage.getItem('upgrd_user_name')
}

export const setUserName = (name: string): void => {
  if (typeof window === 'undefined') return
  localStorage.setItem('upgrd_user_name', name)
}

// Setup Data
export const getSetupData = (): SetupData | null => {
  if (typeof window === 'undefined') return null
  const data = localStorage.getItem('upgrd_setup')
  return data ? JSON.parse(data) : null
}

export const setSetupData = (data: SetupData): void => {
  if (typeof window === 'undefined') return
  localStorage.setItem('upgrd_setup', JSON.stringify(data))
}

// Achievements
export const getAchievements = (): Achievement[] => {
  if (typeof window === 'undefined') return []
  const data = localStorage.getItem('upgrd_achievements')
  return data ? JSON.parse(data) : getDefaultAchievements()
}

export const setAchievements = (achievements: Achievement[]): void => {
  if (typeof window === 'undefined') return
  localStorage.setItem('upgrd_achievements', JSON.stringify(achievements))
}

export const getDefaultAchievements = (): Achievement[] => [
  {
    id: 'setup_master',
    name: 'Setup Master',
    description: 'Complete todas as informações do seu setup',
    icon: 'Monitor',
    points: 30,
    unlocked: false
  },
  {
    id: 'upgrd_pro',
    name: 'UPGRD Pro',
    description: 'Alcance 1000 pontos totais',
    icon: 'Trophy',
    points: 30,
    unlocked: false
  },
  {
    id: 'estudioso',
    name: 'Estudioso',
    description: 'Use a IA de Estudos 10 vezes',
    icon: 'BookOpen',
    points: 30,
    unlocked: false
  },
  {
    id: 'criador',
    name: 'Criador de Conteúdo',
    description: 'Use a IA de Criadores 5 vezes',
    icon: 'Video',
    points: 30,
    unlocked: false
  },
  {
    id: 'visionario',
    name: 'Visionário',
    description: 'Complete 5 missões semanais',
    icon: 'Eye',
    points: 30,
    unlocked: false
  },
  {
    id: 'streak_7',
    name: '7 Dias Consecutivos',
    description: 'Entre no app por 7 dias seguidos',
    icon: 'Flame',
    points: 30,
    unlocked: false
  },
  {
    id: 'streak_30',
    name: '30 Dias Consecutivos',
    description: 'Entre no app por 30 dias seguidos',
    icon: 'Award',
    points: 30,
    unlocked: false
  },
  {
    id: 'first_mission',
    name: 'Primeira Missão',
    description: 'Complete sua primeira missão semanal',
    icon: 'Target',
    points: 30,
    unlocked: false
  }
]

// Missions
export const getMissions = (): Mission[] => {
  if (typeof window === 'undefined') return []
  const data = localStorage.getItem('upgrd_missions')
  return data ? JSON.parse(data) : []
}

export const setMissions = (missions: Mission[]): void => {
  if (typeof window === 'undefined') return
  localStorage.setItem('upgrd_missions', JSON.stringify(missions))
}

// API Key
export const getApiKey = (): string | null => {
  if (typeof window === 'undefined') return null
  return localStorage.getItem('upgrd_api_key')
}

export const setApiKey = (key: string): void => {
  if (typeof window === 'undefined') return
  localStorage.setItem('upgrd_api_key', key)
}

// Points calculation
export const addPoints = (points: number, reason: string): void => {
  const userData = getUserData()
  if (!userData) return

  const newXp = userData.xp + points
  const newTotalPoints = userData.totalPoints + points
  let newLevel = userData.level
  let remainingXp = newXp
  let xpNeeded = userData.xpToNextLevel

  // Level up logic
  while (remainingXp >= xpNeeded) {
    remainingXp -= xpNeeded
    newLevel++
    xpNeeded = 1000 + (newLevel * 500)
  }

  const updatedData: UserData = {
    ...userData,
    level: newLevel,
    xp: remainingXp,
    xpToNextLevel: xpNeeded,
    totalPoints: newTotalPoints
  }

  setUserData(updatedData)
}
