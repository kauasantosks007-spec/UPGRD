import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

const MARKET_PROMPT = `Você é um analista especializado no mercado brasileiro de hardware e periféricos. Sua função é fornecer insights sobre tendências, preços e oportunidades de compra.

REGRAS:
1. Sempre responda de forma objetiva e organizada
2. Foque no mercado brasileiro (preços em R$)
3. Considere lojas populares: Kabum, Pichau, Terabyte, Amazon BR, Mercado Livre

Estrutura da RESPOSTA:

A) ANÁLISE DE MERCADO ATUAL
   - Tendências de preço dos componentes principais
   - Melhor momento para comprar (agora ou esperar)
   - Componentes com melhor custo-benefício no momento

B) OPORTUNIDADES DESTACADAS (3 a 5 itens)
   - Nome do produto
   - Faixa de preço atual
   - Por que é uma boa oportunidade
   - Categoria (CPU/GPU/RAM/etc)

C) ALERTAS E AVISOS
   - Componentes que estão caros no momento
   - Lançamentos próximos que podem afetar preços
   - Promoções sazonais esperadas

D) CUPONS GENÉRICOS ATIVOS
   - Liste 5 a 8 cupons comuns que costumam funcionar
   - Exemplos: GANHE10, PRIMEIRA COMPRA, NEWUSER, etc
   - Especifique para quais lojas geralmente funcionam

E) RECOMENDAÇÃO FINAL
   - Melhor estratégia de compra para o momento
   - Prioridades de upgrade considerando o mercado atual

Mantenha linguagem técnica mas acessível. Seja realista com preços e oportunidades.`

export async function POST(request: NextRequest) {
  try {
    const { category, budget } = await request.json()

    const apiKey = process.env.GEMINI_API_KEY

    if (!apiKey) {
      return NextResponse.json(
        { error: 'Chave da API do Gemini não configurada' },
        { status: 500 }
      )
    }

    const genAI = new GoogleGenerativeAI(apiKey)
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' })

    const userMessage = `${MARKET_PROMPT}

${category 
  ? `Analise o mercado atual de ${category} no Brasil. Orçamento disponível: ${budget || 'não especificado'}`
  : `Faça uma análise geral do mercado de hardware e periféricos no Brasil. Orçamento: ${budget || 'não especificado'}`
}`

    const result = await model.generateContent(userMessage)
    const response = await result.response
    const analysis = response.text()

    return NextResponse.json({ analysis })
  } catch (error: any) {
    console.error('Erro na análise de mercado:', error)
    return NextResponse.json(
      { error: error.message || 'Erro ao analisar mercado' },
      { status: 500 }
    )
  }
}
