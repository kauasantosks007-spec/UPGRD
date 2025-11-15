import { NextRequest, NextResponse } from 'next/server';
import { generateUpgradeRecommendations } from '@/lib/openai';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { currentSetup, budget } = body;

    if (!currentSetup || !budget) {
      return NextResponse.json(
        { error: 'Setup atual e orçamento são obrigatórios' },
        { status: 400 }
      );
    }

    const response = await generateUpgradeRecommendations(currentSetup, budget);

    return NextResponse.json(response);
  } catch (error: any) {
    console.error('Erro na API de recomendações:', error);
    return NextResponse.json(
      { error: 'Erro ao gerar recomendações', details: error.message },
      { status: 500 }
    );
  }
}
