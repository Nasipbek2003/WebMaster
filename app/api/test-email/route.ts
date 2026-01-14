import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { sendEmail } from '@/lib/email';

// Тестовый endpoint для проверки отправки email
// Доступен только для авторизованных пользователей
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Необходима авторизация' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { to } = body;

    if (!to) {
      return NextResponse.json(
        { error: 'Укажите email адрес получателя' },
        { status: 400 }
      );
    }

    // Отправляем тестовое письмо
    const result = await sendEmail({
      to,
      subject: 'Тестовое письмо от МастерСервис',
      html: `
        <h1>Тестовое письмо</h1>
        <p>Если вы получили это письмо, значит настройка SMTP работает корректно!</p>
        <p>Отправлено: ${new Date().toLocaleString('ru-RU')}</p>
      `,
      text: `Тестовое письмо от МастерСервис\n\nЕсли вы получили это письмо, значит настройка SMTP работает корректно!\n\nОтправлено: ${new Date().toLocaleString('ru-RU')}`,
    });

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: 'Тестовое письмо отправлено успешно!',
        messageId: result.messageId,
      });
    } else {
      return NextResponse.json(
        {
          success: false,
          error: result.error || result.message || 'Неизвестная ошибка',
          code: (result as any).code,
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error in test-email endpoint:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Неизвестная ошибка',
      },
      { status: 500 }
    );
  }
}
