// Types for UPGRD Platform

export interface UserData {
  name: string
  level: number
  xp: number
  xpToNextLevel: number
  setupScore: number
  totalPoints: number
  achievements: number
  totalAchievements: number
  avatar?: string
  createdAt: string
  lastLogin: string
  consecutiveDays: number
}

export interface SetupData {
  cpu: string
  gpu: string
  ram: string
  monitor: string
  peripherals: string
  usageType: string
  budget?: string
}

export interface Achievement {
  id: string
  name: string
  description: string
  icon: string
  points: number
  unlocked: boolean
  unlockedAt?: string
}

export interface Mission {
  id: string
  title: string
  description: string
  xp: number
  completed: boolean
  completedAt?: string
  weekStart: string
}

export interface RankingUser {
  id: string
  name: string
  avatar?: string
  points: number
  level: number
  league: 'Bronze' | 'Prata' | 'Ouro' | 'Platina' | 'Diamante' | 'Onyx'
  rank: number
}

export interface AISpecialist {
  id: string
  name: string
  description: string
  icon: string
  systemPrompt: string
}
