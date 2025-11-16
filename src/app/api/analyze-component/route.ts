import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

export async function POST(request: NextRequest) {
  try {
    const { imageUrl } = await request.json()

    if (!imageUrl) {
      return NextResponse.json(
        { error: 'Image URL is required' },
        { status: 400 }
      )
    }

    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: `Analise esta imagem de componente de PC e forneça as seguintes informações em formato JSON:
              
              {
                "componentType": "tipo do componente (GPU, CPU, RAM, SSD, Monitor, etc)",
                "brand": "marca do componente",
                "model": "modelo específico",
                "specs": "especificações técnicas principais (potência, capacidade, velocidade, etc)",
                "estimatedValue": "valor estimado em reais (apenas número)",
                "suggestions": "sugestões de upgrade ou melhorias (máximo 2 frases)"
              }
              
              Se não conseguir identificar claramente, retorne null nos campos que não conseguir determinar.
              Seja específico e técnico nas especificações.`
            },
            {
              type: 'image_url',
              image_url: {
                url: imageUrl
              }
            }
          ]
        }
      ],
      max_tokens: 500
    })

    const content = response.choices[0].message.content
    
    if (!content) {
      return NextResponse.json(
        { error: 'No response from OpenAI' },
        { status: 500 }
      )
    }

    // Extract JSON from response
    const jsonMatch = content.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      return NextResponse.json(
        { error: 'Could not parse component information' },
        { status: 500 }
      )
    }

    const componentData = JSON.parse(jsonMatch[0])

    return NextResponse.json({
      success: true,
      data: componentData
    })

  } catch (error) {
    console.error('Error analyzing component:', error)
    return NextResponse.json(
      { error: 'Failed to analyze component image' },
      { status: 500 }
    )
  }
}
