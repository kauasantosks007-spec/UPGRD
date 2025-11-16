import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

const SYSTEM_PROMPT = `Você é um assistente técnico especializado em hardware e periféricos. Sua função é analisar setups, recomendar upgrades e encontrar preços, ofertas e cupons válidos no momento.

REGRAS:
1. Sempre responda curto, objetivo e organizado.
2. Estrutura da ENTRADA do usuário:
   - Setup atual: (CPU, GPU, RAM, Armazenamento, Fonte, Monitor e Periféricos)
   - Orçamento: R$ X (ou "sem limite")
   - Foco: gaming / edição / produtividade / stream / uso geral
   - Preferência de marca (opcional)

3. Estrutura da SUA RESPOSTA:
A) RECOMENDAÇÃO PRINCIPAL (maior impacto no desempenho)
   - Nome do componente/periférico recomendado
   - Por que isso melhora o setup
   - Faixa de preço média no Brasil
   - Impacto estimado (%) no desempenho

B) RECOMENDAÇÕES SECUNDÁRIAS (2 a 3 upgrades)
   - Mesma estrutura, impacto médio

C) OPCIONAIS / LUXO / QUALIDADE DE VIDA
   - 1 a 3 upgrades não obrigatórios, mas interessantes

D) CUPONS E DESCONTOS
   - Procure automaticamente cupons normalmente usados em lojas brasileiras
   - Exemplos:  
     — Cupom genérico de desconto (ex.: "GANHE10", "OFERTA5", "BRASIL10", "NEWUSER")  
     — Cupons que costumam aparecer na Shopee, Mercado Livre e Amazon  
     — Cupons de carrinho cheio (ex.: "30REAIS")
   - Informe: "Cupons comuns que *podem* funcionar neste tipo de item:" e liste 3 a 5.

E) RESUMO DE IMPACTO
   - Melhora total estimada no SetupScore (%)
   - Custo total estimado se o usuário seguir tudo

F) MISSÃO SEMANAL
   - Gere uma missão que combina com o upgrade sugerido
   - Exemplo: "Rodar benchmark após instalar nova RAM — +40 XP"

4. Caso falte informação importante (CPU, GPU, orçamento), pergunte com uma frase curta.

5. Limites:
   - Máx. 12 linhas por seção
   - Linguagem simples, premium e técnica na medida certa
   - Não invente preços impossíveis — use faixas realistas do mercado BR

6. Sempre finalize perguntando:
   "Quer que eu gere links afiliados e alertas de desconto para esses itens?"`

export async function POST(request: NextRequest) {
  try {
    const { setup, budget, focus, brandPreference } = await request.json()

    // Validação básica
    if (!setup) {
      return NextResponse.json(
        { error: 'Setup information is required' },
        { status: 400 }
      )
    }

    const apiKey = process.env.GEMINI_API_KEY

    if (!apiKey) {
      return NextResponse.json(
        { error: 'Gemini API key not configured' },
        { status: 500 }
      )
    }

    const genAI = new GoogleGenerativeAI(apiKey)
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' })

    // Montar mensagem do usuário
    let userMessage = `${SYSTEM_PROMPT}

Setup atual:
- CPU: ${setup.cpu || 'Não informado'}
- GPU: ${setup.gpu || 'Não informado'}
- RAM: ${setup.ram || 'Não informado'}
- Armazenamento: ${setup.storage || 'Não informado'}
- Fonte: ${setup.powerSupply || 'Não informado'}
- Monitor: ${setup.monitor || 'Não informado'}
- Periféricos: ${setup.peripherals || 'Não informado'}

`
    
    if (budget) {
      userMessage += `Orçamento: R$ ${budget}\n`
    }
    
    if (focus) {
      userMessage += `Foco: ${focus}\n`
    }
    
    if (brandPreference) {
      userMessage += `Preferência de marca: ${brandPreference}\n`
    }

    userMessage += `\nAnalise meu setup e me dê recomendações de upgrade.`

    const result = await model.generateContent(userMessage)
    const response = await result.response
    const recommendation = response.text()

    return NextResponse.json({
      success: true,
      recommendation
    })

  } catch (error: any) {
    console.error('Hardware advisor error:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}
