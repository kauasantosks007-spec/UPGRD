import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { messages, apiKey } = await request.json()

    if (!apiKey) {
      return NextResponse.json(
        { error: 'API Key não fornecida' },
        { status: 400 }
      )
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: `Você é o assistente inteligente da plataforma UPGRD, uma plataforma gamificada para entusiastas de hardware de PC.

SOBRE A PLATAFORMA UPGRD:
- Sistema de XP e níveis para gamificar a experiência
- Missões diárias e semanais que dão XP
- Setup Score calculado automaticamente baseado nas peças do PC
- Ranking global de jogadores
- Sistema de conquistas e troféus
- Comunidade de entusiastas de hardware

FUNCIONALIDADES PRINCIPAIS:
1. Meu Setup: Usuários cadastram suas peças de PC (CPU, GPU, RAM, Storage, Monitor)
2. Setup Score: IA calcula pontuação automática baseada no hardware (Bronze: 0-500, Prata: 500-1500, Ouro: 1500-3500, Diamante: 3500+)
3. Missões: Diárias (20-40 XP) e Semanais (300-500 XP)
4. Conquistas: Marcos especiais que dão +250 XP cada
5. Ranking: Classificação global baseada em pontos totais
6. Orçamento: Ferramenta para planejar upgrades
7. Comunidade: Interação entre usuários

COMO GANHAR XP:
- Completar missões diárias: 20-40 XP
- Completar missões semanais: 300-500 XP
- Atualizar setup: +150 XP
- Desbloquear conquistas: +250 XP
- Interagir com comunidade: +30 XP

NÍVEIS E PROGRESSÃO:
- Nível 0 → 1: 1.000 XP
- Nível 1 → 2: 2.000 XP
- Nível 2 → 3: 3.500 XP
- Nível 3 → 4: 5.000 XP
- Nível 4 → 5: 8.000 XP

CONQUISTAS DISPONÍVEIS:
- Primeiro Setup Criado
- Setup Bronze/Prata/Ouro/Diamante
- 10 missões concluídas
- 4 semanas seguidas ativo
- Nível 5 alcançado
- 1000 XP ganhos

SEJA:
- Amigável e motivador
- Conciso mas informativo
- Use emojis para deixar as respostas mais visuais
- Incentive o usuário a progredir na plataforma
- Dê dicas práticas sobre hardware quando relevante
- Responda em português brasileiro

IMPORTANTE:
- Se perguntarem sobre hardware específico, dê informações técnicas precisas
- Se perguntarem sobre a plataforma, use as informações acima
- Sempre incentive o usuário a explorar as funcionalidades
- Seja prestativo e educado`
          },
          ...messages
        ],
        temperature: 0.7,
        max_tokens: 500
      })
    })

    if (!response.ok) {
      const error = await response.json()
      return NextResponse.json(
        { error: error.error?.message || 'Erro ao processar requisição' },
        { status: response.status }
      )
    }

    const data = await response.json()
    const assistantMessage = data.choices[0].message.content

    return NextResponse.json({ message: assistantMessage })
  } catch (error) {
    console.error('Erro na API de chat:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
