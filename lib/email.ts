import nodemailer from 'nodemailer';

// Создаем транспорт для отправки email
const getTransporter = () => {
  const host = process.env.SMTP_HOST || 'smtp.gmail.com';
  const port = parseInt(process.env.SMTP_PORT || '587');
  const secure = process.env.SMTP_SECURE === 'true'; // true для порта 465, false для других
  
  const config: any = {
    host,
    port,
    secure,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  };

  // Для Gmail и других сервисов, использующих STARTTLS
  if (!secure && port === 587) {
    config.requireTLS = true;
    config.tls = {
      rejectUnauthorized: false, // Для разработки, в продакшене лучше true
    };
  }

  // Для порта 465 (SSL)
  if (secure && port === 465) {
    config.tls = {
      rejectUnauthorized: false, // Для разработки, в продакшене лучше true
    };
  }

  return nodemailer.createTransport(config);
};

interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

/**
 * Отправка email
 */
export async function sendEmail({ to, subject, html, text }: SendEmailOptions) {
  // Проверяем наличие обязательных переменных окружения
  const smtpUser = process.env.SMTP_USER;
  const smtpPassword = process.env.SMTP_PASSWORD;
  const smtpHost = process.env.SMTP_HOST || 'smtp.gmail.com';
  const smtpPort = parseInt(process.env.SMTP_PORT || '587');
  
  console.log('📧 Попытка отправки email:');
  console.log('  To:', to);
  console.log('  Subject:', subject);
  console.log('  SMTP Host:', smtpHost);
  console.log('  SMTP Port:', smtpPort);
  console.log('  SMTP User:', smtpUser ? `${smtpUser.substring(0, 3)}***` : 'НЕ УСТАНОВЛЕН');
  console.log('  SMTP Password:', smtpPassword ? '***установлен***' : 'НЕ УСТАНОВЛЕН');
  
  // Если SMTP не настроен, логируем в консоль для разработки
  if (!smtpUser || !smtpPassword) {
    console.error('❌ Email не отправлен: SMTP не настроен!');
    console.error('   Необходимо установить переменные окружения:');
    console.error('   - SMTP_USER');
    console.error('   - SMTP_PASSWORD');
    console.error('   - SMTP_HOST (опционально, по умолчанию smtp.gmail.com)');
    console.error('   - SMTP_PORT (опционально, по умолчанию 587)');
    console.error('   - SMTP_FROM (опционально, используется SMTP_USER)');
    return { success: false, message: 'SMTP не настроен' };
  }

  try {
    const transporter = getTransporter();
    
    // Проверяем соединение с SMTP сервером
    await transporter.verify();
    console.log('✅ SMTP сервер готов к отправке');

    const info = await transporter.sendMail({
      from: process.env.SMTP_FROM || smtpUser,
      to,
      subject,
      html,
      text,
    });

    console.log('✅ Email успешно отправлен!');
    console.log('   Message ID:', info.messageId);
    console.log('   Response:', info.response);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Ошибка при отправке email:');
    if (error instanceof Error) {
      console.error('   Сообщение:', error.message);
      console.error('   Код:', (error as any).code);
      console.error('   Команда:', (error as any).command);
    } else {
      console.error('   Ошибка:', error);
    }
    
    // Дополнительная информация для отладки
    if ((error as any).code === 'EAUTH') {
      console.error('   Проблема с аутентификацией. Проверьте:');
      console.error('   - Правильность SMTP_USER и SMTP_PASSWORD');
      console.error('   - Для Gmail используйте пароль приложения, а не обычный пароль');
    } else if ((error as any).code === 'ECONNECTION') {
      console.error('   Проблема с подключением. Проверьте:');
      console.error('   - Правильность SMTP_HOST и SMTP_PORT');
      console.error('   - Доступность SMTP сервера');
    }
    
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Неизвестная ошибка',
      code: (error as any).code,
    };
  }
}

/**
 * Отправка уведомления мастеру о новом заказе
 */
export async function sendNewOrderNotificationToMaster(
  masterEmail: string,
  masterName: string,
  orderNumber: string,
  clientName: string,
  serviceName: string,
  address: string,
  problemDescription: string,
  preferredTime?: string
) {
  const subject = `Новый заказ #${orderNumber} - МастерСервис`;
  
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          color: #333;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
        }
        .header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 30px;
          border-radius: 10px 10px 0 0;
          text-align: center;
        }
        .content {
          background: #f9f9f9;
          padding: 30px;
          border-radius: 0 0 10px 10px;
        }
        .order-info {
          background: white;
          padding: 20px;
          border-radius: 8px;
          margin: 20px 0;
          border-left: 4px solid #667eea;
        }
        .info-row {
          margin: 10px 0;
          padding: 10px;
          background: #f5f5f5;
          border-radius: 5px;
        }
        .label {
          font-weight: bold;
          color: #667eea;
        }
        .button {
          display: inline-block;
          padding: 12px 30px;
          background: #667eea;
          color: white;
          text-decoration: none;
          border-radius: 5px;
          margin-top: 20px;
        }
        .footer {
          text-align: center;
          margin-top: 30px;
          color: #666;
          font-size: 12px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🎉 Новый заказ!</h1>
          <p>Заказ #${orderNumber}</p>
        </div>
        <div class="content">
          <p>Здравствуйте, <strong>${masterName}</strong>!</p>
          <p>У вас новый заказ на услугу <strong>"${serviceName}"</strong>.</p>
          
          <div class="order-info">
            <h2>Детали заказа:</h2>
            <div class="info-row">
              <span class="label">Номер заказа:</span> #${orderNumber}
            </div>
            <div class="info-row">
              <span class="label">Клиент:</span> ${clientName || 'Не указано'}
            </div>
            <div class="info-row">
              <span class="label">Услуга:</span> ${serviceName}
            </div>
            <div class="info-row">
              <span class="label">Адрес:</span> ${address}
            </div>
            ${preferredTime ? `
            <div class="info-row">
              <span class="label">Предпочтительное время:</span> ${preferredTime}
            </div>
            ` : ''}
            <div class="info-row">
              <span class="label">Описание проблемы:</span><br>
              ${problemDescription}
            </div>
          </div>
          
          <div style="text-align: center;">
            <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/master/dashboard" class="button">
              Открыть панель мастеров
            </a>
          </div>
          
          <p style="margin-top: 30px; font-size: 14px; color: #666;">
            Пожалуйста, подтвердите или отклоните заказ в панели мастеров как можно скорее.
          </p>
        </div>
        <div class="footer">
          <p>© ${new Date().getFullYear()} МастерСервис. Все права защищены.</p>
          <p>Это автоматическое уведомление, пожалуйста, не отвечайте на это письмо.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  const text = `
Новый заказ #${orderNumber} - МастерСервис

Здравствуйте, ${masterName}!

У вас новый заказ на услугу "${serviceName}".

Детали заказа:
- Номер заказа: #${orderNumber}
- Клиент: ${clientName || 'Не указано'}
- Услуга: ${serviceName}
- Адрес: ${address}
${preferredTime ? `- Предпочтительное время: ${preferredTime}\n` : ''}
Описание проблемы:
${problemDescription}

Откройте панель мастеров для просмотра и принятия заказа:
${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/master/dashboard

© ${new Date().getFullYear()} МастерСервис
  `;

  return sendEmail({
    to: masterEmail,
    subject,
    html,
    text,
  });
}

/**
 * Отправка уведомления клиенту об изменении статуса заказа
 */
export async function sendOrderStatusUpdateToClient(
  clientEmail: string,
  clientName: string,
  orderNumber: string,
  serviceName: string,
  masterName: string,
  status: string,
  scheduledAt?: Date,
  finalPrice?: number
) {
  const statusMessages: Record<string, { subject: string; message: string; emoji: string }> = {
    CONFIRMED: {
      subject: `Заказ #${orderNumber} подтвержден`,
      message: 'Ваш заказ подтвержден мастером!',
      emoji: '✅',
    },
    IN_PROGRESS: {
      subject: `Заказ #${orderNumber} в работе`,
      message: 'Мастер приступил к выполнению вашего заказа.',
      emoji: '🔧',
    },
    COMPLETED: {
      subject: `Заказ #${orderNumber} завершен`,
      message: 'Ваш заказ успешно завершен!',
      emoji: '🎉',
    },
    CANCELLED: {
      subject: `Заказ #${orderNumber} отменен`,
      message: 'К сожалению, ваш заказ был отменен.',
      emoji: '❌',
    },
  };

  const statusInfo = statusMessages[status] || {
    subject: `Статус заказа #${orderNumber} изменен`,
    message: `Статус вашего заказа изменен на: ${status}`,
    emoji: '📋',
  };

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          color: #333;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
        }
        .header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 30px;
          border-radius: 10px 10px 0 0;
          text-align: center;
        }
        .content {
          background: #f9f9f9;
          padding: 30px;
          border-radius: 0 0 10px 10px;
        }
        .order-info {
          background: white;
          padding: 20px;
          border-radius: 8px;
          margin: 20px 0;
          border-left: 4px solid #667eea;
        }
        .info-row {
          margin: 10px 0;
          padding: 10px;
          background: #f5f5f5;
          border-radius: 5px;
        }
        .label {
          font-weight: bold;
          color: #667eea;
        }
        .button {
          display: inline-block;
          padding: 12px 30px;
          background: #667eea;
          color: white;
          text-decoration: none;
          border-radius: 5px;
          margin-top: 20px;
        }
        .footer {
          text-align: center;
          margin-top: 30px;
          color: #666;
          font-size: 12px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>${statusInfo.emoji} ${statusInfo.message}</h1>
          <p>Заказ #${orderNumber}</p>
        </div>
        <div class="content">
          <p>Здравствуйте, <strong>${clientName}</strong>!</p>
          <p>${statusInfo.message}</p>
          
          <div class="order-info">
            <h2>Детали заказа:</h2>
            <div class="info-row">
              <span class="label">Номер заказа:</span> #${orderNumber}
            </div>
            <div class="info-row">
              <span class="label">Услуга:</span> ${serviceName}
            </div>
            <div class="info-row">
              <span class="label">Мастер:</span> ${masterName}
            </div>
            <div class="info-row">
              <span class="label">Статус:</span> ${status}
            </div>
            ${scheduledAt ? `
            <div class="info-row">
              <span class="label">Запланировано на:</span> ${new Date(scheduledAt).toLocaleString('ru-RU')}
            </div>
            ` : ''}
            ${finalPrice ? `
            <div class="info-row">
              <span class="label">Итоговая стоимость:</span> ${finalPrice.toLocaleString('ru-RU')} сом
            </div>
            ` : ''}
          </div>
          
          <div style="text-align: center;">
            <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/profile" class="button">
              Посмотреть заказ
            </a>
          </div>
        </div>
        <div class="footer">
          <p>© ${new Date().getFullYear()} МастерСервис. Все права защищены.</p>
          <p>Это автоматическое уведомление, пожалуйста, не отвечайте на это письмо.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  const text = `
${statusInfo.subject} - МастерСервис

Здравствуйте, ${clientName}!

${statusInfo.message}

Детали заказа:
- Номер заказа: #${orderNumber}
- Услуга: ${serviceName}
- Мастер: ${masterName}
- Статус: ${status}
${scheduledAt ? `- Запланировано на: ${new Date(scheduledAt).toLocaleString('ru-RU')}\n` : ''}
${finalPrice ? `- Итоговая стоимость: ${finalPrice.toLocaleString('ru-RU')} сом\n` : ''}

Посмотреть заказ: ${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/profile

© ${new Date().getFullYear()} МастерСервис
  `;

  return sendEmail({
    to: clientEmail,
    subject: statusInfo.subject,
    html,
    text,
  });
}
