import OpenAI from 'openai';

// Inicializa o cliente OpenAI com a chave de API do ambiente
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Função principal para interagir com a IA UPGRD
 * @param userMessage - Mensagem do usuário
 * @param context - Contexto adicional (setup, perfil, etc)
 * @returns Resposta da IA
 */
export async function chatWithUpgrdAI(
  userMessage: string,
  context?: {
    userName?: string;
    userLevel?: number;
    userXP?: number;
    userScore?: number;
    userSetup?: any;
    userBudget?: number;
  }
) {
  try {
    const systemPrompt = `
--------------------------------------------------------
---- SISTEMA PRINCIPAL UPGRD (PROMPT OFICIAL DA LASY) ---
--------------------------------------------------------

Você é a IA oficial do aplicativo UPGRD. Seu objetivo é entregar uma experiência premium, gamificada e automática para o usuário. A partir de agora, siga estas regras:

////////////////////////////////////////////////////////
//// IDENTIDADE DA IA
////////////////////////////////////////////////////////

- Nome interno da IA: UPGRD AI Core
- Tom: tecnológico, premium, direto, amigável.
- Função: ajudar o usuário em análise de setup, upgrades, ranking, desempenho e dúvidas sobre o app.

////////////////////////////////////////////////////////
//// FUNCIONALIDADES DO APP (CONTROLADAS PELA IA)
////////////////////////////////////////////////////////

[1] PERFIL:
- O usuário pode escolher um nome quando entrar pela primeira vez.
- A IA salva mentalmente o nome escolhido e usa nas respostas.
- Pelo Perfil, o usuário pode:
  • mudar o nome
  • ver nível
  • ver XP atual
  • ver seu Score UPGRD
  • ver seu setup salvo

[2] SETUP:
Quando o usuário inserir o setup dele, siga esta lógica de pontuação:

CPU — até 30 pts  
GPU — até 40 pts  
RAM — até 10 pts  
Armazenamento — até 5 pts  
Placa-mãe — até 5 pts  
Cooling — até 5 pts  
Monitor — até 5 pts  

Calcule também o Score Total (0–100).  
Use informações técnicas, geração, benchmarks aproximados e compatibilidades.

Sempre entregue:
- Pontuação por peça
- Pontuação total
- Pontos fracos
- Recomendações de upgrade dentro do orçamento

[3] SISTEMA DE NÍVEIS:
Progressão de XP:

Nível 1 → 100 XP  
Nível 2 → 250 XP  
Nível 3 → 500 XP  
Nível 4 → 900 XP  
Nível 5 → 1500 XP  

XP ganho:
- Registrar setup → +40 XP  
- Atualizar setup → +20 XP  
- Completar missão semanal → +10 a +40 XP  
- Usar o balão de ajuda → +5 XP  
- Abrir área ranking → +10 XP  

A IA deve somar XP automaticamente e avisar quando o usuário subir de nível.

[4] MISSÕES SEMANAIS:
Gere automaticamente 5 novas missões toda semana, escolhendo entre:

• Fazer benchmark  
• Atualizar drivers  
• Limpar o PC  
• Organizar cabos  
• Testar FPS  
• Checar temperaturas  
• Verificar energia  
• Otimizar inicialização  

Cada missão vale entre 10–40 XP.

[5] RANKING:
Compare setups usando:

• Score total  
• Nível  
• XP recente  
• Eficiência custo-benefício  
• Performance geral  

Classifique em:
Tier S  
Tier A  
Tier B  
Tier C  

Explique claramente o motivo da classificação.

[6] AJUDA (BALÃO FLUTUANTE):
Responda dúvidas sobre:
- Como usar cada aba
- Análise rápida do setup
- Ranking
- Pontos
- Missões
- Níveis
- Recomendações técnicas

As respostas devem ser rápidas (<3 parágrafos) e objetivas.

////////////////////////////////////////////////////////
//// REGRAS DE COMUNICAÇÃO
////////////////////////////////////////////////////////

- Nunca peça email, login ou senha.
- Seja direto, premium e profissional.
- Se faltar informação, pergunte.
- Sempre incentive evolução do setup.
- Use feedback visual:
  "✔ Setup salvo"
  "✔ Missão concluída! +30 XP"
  "⬆ Parabéns! Você subiu para o nível 2!"

////////////////////////////////////////////////////////
//// CONTEXTO DO USUÁRIO
////////////////////////////////////////////////////////

${context?.userName ? `Nome do usuário: ${context.userName}` : ''}
${context?.userLevel ? `Nível atual: ${context.userLevel}` : ''}
${context?.userXP ? `XP atual: ${context.userXP}` : ''}
${context?.userScore ? `Score UPGRD: ${context.userScore}` : ''}
${context?.userBudget ? `Orçamento disponível: R$ ${context.userBudget}` : ''}
${context?.userSetup ? `Setup atual: ${JSON.stringify(context.userSetup)}` : ''}
`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userMessage }
      ],
      temperature: 0.7,
      max_tokens: 1000,
    });

    return {
      success: true,
      message: completion.choices[0].message.content || 'Desculpe, não consegui processar sua mensagem.',
      usage: completion.usage,
    };
  } catch (error: any) {
    console.error('Erro ao chamar OpenAI:', error);
    return {
      success: false,
      message: 'Desculpe, ocorreu um erro ao processar sua solicitação. Tente novamente.',
      error: error.message,
    };
  }
}

/**
 * Função para analisar setup e gerar pontuação
 */
export async function analyzeSetup(setup: {
  cpu?: string;
  gpu?: string;
  ram?: string;
  storage?: string;
  motherboard?: string;
  cooling?: string;
  monitor?: string;
}) {
  const setupDescription = `
Analise este setup e forneça:
1. Pontuação de cada componente (CPU até 30pts, GPU até 40pts, RAM até 10pts, Armazenamento até 5pts, Placa-mãe até 5pts, Cooling até 5pts, Monitor até 5pts)
2. Score total (0-100)
3. Pontos fracos
4. Recomendações de upgrade

Setup:
- CPU: ${setup.cpu || 'Não informado'}
- GPU: ${setup.gpu || 'Não informado'}
- RAM: ${setup.ram || 'Não informado'}
- Armazenamento: ${setup.storage || 'Não informado'}
- Placa-mãe: ${setup.motherboard || 'Não informado'}
- Cooling: ${setup.cooling || 'Não informado'}
- Monitor: ${setup.monitor || 'Não informado'}

Responda em formato JSON:
{
  "scores": {
    "cpu": number,
    "gpu": number,
    "ram": number,
    "storage": number,
    "motherboard": number,
    "cooling": number,
    "monitor": number
  },
  "totalScore": number,
  "weakPoints": string[],
  "recommendations": string[]
}
`;

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: 'Você é um especialista em hardware de PC. Analise setups e forneça pontuações precisas baseadas em benchmarks e especificações técnicas.' },
        { role: 'user', content: setupDescription }
      ],
      temperature: 0.3,
      response_format: { type: 'json_object' },
    });

    const result = JSON.parse(completion.choices[0].message.content || '{}');
    return {
      success: true,
      data: result,
    };
  } catch (error: any) {
    console.error('Erro ao analisar setup:', error);
    return {
      success: false,
      error: error.message,
    };
  }
}

/**
 * Função para gerar recomendações de upgrade baseadas no orçamento
 */
export async function generateUpgradeRecommendations(
  currentSetup: any,
  budget: number
) {
  const prompt = `
Baseado no setup atual e no orçamento de R$ ${budget}, sugira upgrades prioritários.

Setup atual:
${JSON.stringify(currentSetup, null, 2)}

Forneça recomendações em formato JSON:
{
  "recommendations": [
    {
      "component": "nome do componente",
      "currentItem": "item atual",
      "suggestedItem": "item sugerido",
      "price": number,
      "priority": "Alta|Média|Baixa",
      "benefit": "descrição do benefício"
    }
  ],
  "totalCost": number,
  "expectedScoreIncrease": number
}
`;

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: 'Você é um consultor especializado em upgrades de PC. Sugira melhorias baseadas em custo-benefício e compatibilidade.' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.5,
      response_format: { type: 'json_object' },
    });

    const result = JSON.parse(completion.choices[0].message.content || '{}');
    return {
      success: true,
      data: result,
    };
  } catch (error: any) {
    console.error('Erro ao gerar recomendações:', error);
    return {
      success: false,
      error: error.message,
    };
  }
}

export default openai;
