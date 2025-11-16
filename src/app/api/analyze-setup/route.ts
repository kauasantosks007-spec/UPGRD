import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

const SETUP_ANALYZER_PROMPT = `You are JARVIS, an expert hardware analyst. Analyze the user's PC setup and provide:

1. **Performance Score** (0-100): Overall performance rating
2. **Bottlenecks**: Identify any hardware bottlenecks
3. **Upgrade Recommendations**:
   - Budget ($100-300): Most cost-effective upgrades
   - Mid-Range ($300-700): Balanced performance improvements
   - High-End ($700+): Premium upgrades for maximum performance
4. **Optimization Tips**: Software and configuration improvements
5. **Expected Performance Gains**: Estimated FPS improvements or productivity boosts

Format your response in Portuguese (BR) with clear sections and bullet points.
Be precise, technical, and provide actionable advice.`

export async function POST(request: NextRequest) {
  try {
    const { setup } = await request.json()

    if (!setup) {
      return NextResponse.json(
        { error: 'Informações do setup são obrigatórias' },
        { status: 400 }
      )
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'Chave da API OpenAI não configurada' },
        { status: 500 }
      )
    }

    // Construir prompt com informações do setup
    const userPrompt = `Analise este setup:

CPU: ${setup.cpu || 'Não informado'}
GPU: ${setup.gpu || 'Não informado'}
RAM: ${setup.ram || 'Não informado'}
Storage: ${setup.storage || 'Não informado'}
Monitor: ${setup.monitor || 'Não informado'}
Periféricos: ${setup.peripherals || 'Não informado'}
Uso Principal: ${setup.usage || 'Gaming e trabalho'}

Forneça uma análise completa com recomendações de upgrade.`

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: SETUP_ANALYZER_PROMPT,
        },
        {
          role: 'user',
          content: userPrompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 1500,
    })

    const analysis = completion.choices[0]?.message?.content || 'Não foi possível analisar o setup.'

    return NextResponse.json({
      analysis,
    })
  } catch (error: any) {
    console.error('Erro na análise de setup:', error)
    return NextResponse.json(
      { error: error.message || 'Erro ao analisar setup' },
      { status: 500 }
    )
  }
}
