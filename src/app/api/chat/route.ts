import { NextRequest, NextResponse } from 'next/server';
import { chatWithUpgrdAI } from '@/lib/openai';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message, context } = body;

    console.log('[API Chat] Recebida mensagem:', message);

    if (!message) {
      return NextResponse.json(
        { error: 'Mensagem é obrigatória' },
        { status: 400 }
      );
    }

    const response = await chatWithUpgrdAI(message, context);

    console.log('[API Chat] Resposta da IA:', response);

    if (!response.success) {
      return NextResponse.json(
        { error: 'Erro ao processar com IA', details: response.error },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      success: true,
      message: response.message 
    });
  } catch (error: any) {
    console.error('[API Chat] Erro:', error);
    return NextResponse.json(
      { error: 'Erro ao processar solicitação', details: error.message },
      { status: 500 }
    );
  }
}
