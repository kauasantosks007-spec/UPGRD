import { NextRequest, NextResponse } from 'next/server';
import { chatWithUpgrdAI } from '@/lib/openai';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message, context } = body;

    if (!message) {
      return NextResponse.json(
        { error: 'Mensagem é obrigatória' },
        { status: 400 }
      );
    }

    const response = await chatWithUpgrdAI(message, context);

    return NextResponse.json(response);
  } catch (error: any) {
    console.error('Erro na API de chat:', error);
    return NextResponse.json(
      { error: 'Erro ao processar solicitação', details: error.message },
      { status: 500 }
    );
  }
}
