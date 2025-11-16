import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.MISSOES_UPGRD
})

export async function POST(request: NextRequest) {
  try {
    const { missionName, missionRequirements, proof } = await request.json()

    if (!missionName || !missionRequirements || !proof) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const prompt = `Analise se a seguinte prova indica que o usuário completou a missão "${missionName}".
Requisitos da missão: ${missionRequirements}

Prova fornecida pelo usuário: "${proof}"

Responda apenas com "SIM" se a prova for suficiente e convincente, ou "NÃO" se não for. Seja rigoroso mas justo.`

    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 10,
      temperature: 0.1
    })

    const result = response.choices[0]?.message?.content?.trim().toUpperCase()
    const isValid = result === 'SIM'

    return NextResponse.json({ isValid })
  } catch (error) {
    console.error('Error verifying mission:', error)
    return NextResponse.json(
      { error: 'Failed to verify mission' },
      { status: 500 }
    )
  }
}