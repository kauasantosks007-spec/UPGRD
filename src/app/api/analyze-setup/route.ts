import { NextRequest, NextResponse } from 'next/server';
import { analyzeSetup } from '@/lib/openai';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { setup } = body;

    if (!setup) {
      return NextResponse.json(
        { error: 'Setup é obrigatório' },
        { status: 400 }
      );
    }

    const response = await analyzeSetup(setup);

    return NextResponse.json(response);
  } catch (error: any) {
    console.error('Erro na API de análise:', error);
    return NextResponse.json(
      { error: 'Erro ao analisar setup', details: error.message },
      { status: 500 }
    );
  }
}
