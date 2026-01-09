'use client';

import { useState } from 'react';

const faqData = [
  {
    id: 1,
    question: 'Как быстро приедет мастер?',
    answer: 'Обычно мастер приезжает в течение 1-2 часов после оформления заказа. В экстренных случаях возможен выезд в течение 30 минут.',
  },
  {
    id: 2,
    question: 'Какие гарантии вы предоставляете?',
    answer: 'Мы предоставляем гарантию на все виды работ от 6 месяцев до 2 лет в зависимости от типа услуги. Гарантийные обязательства прописываются в договоре.',
  },
  {
    id: 3,
    question: 'Как происходит оплата?',
    answer: 'Оплата производится после выполнения работ. Вы можете оплатить наличными или банковской картой. Также доступна оплата через онлайн-платежи.',
  },
  {
    id: 4,
    question: 'Работаете ли вы в выходные и праздники?',
    answer: 'Да, мы работаем круглосуточно, включая выходные и праздничные дни. Наши мастера готовы приехать к вам в любое время.',
  },
  {
    id: 5,
    question: 'Нужно ли покупать материалы самостоятельно?',
    answer: 'Нет, не обязательно. Мастер может привезти все необходимые материалы с собой. Стоимость материалов согласовывается с вами заранее.',
  },
  {
    id: 6,
    question: 'Что делать, если работа выполнена некачественно?',
    answer: 'Если вы недовольны качеством работы, мы бесплатно устраним все недочеты в рамках гарантийного обслуживания. Свяжитесь с нами, и мы решим проблему.',
  },
  {
    id: 7,
    question: 'Можно ли заказать несколько услуг одновременно?',
    answer: 'Конечно! Вы можете заказать несколько услуг, и мы организуем работу так, чтобы все было выполнено максимально эффективно и в удобное для вас время.',
  },
  {
    id: 8,
    question: 'Есть ли скидки для постоянных клиентов?',
    answer: 'Да, у нас действует программа лояльности. Постоянные клиенты получают скидки до 15% на все услуги. Также действуют специальные предложения и акции.',
  },
];

export default function FAQPage() {
  const [openId, setOpenId] = useState<number | null>(1);

  const toggleQuestion = (id: number) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold gradient-text mb-4">
          Вопросы и Ответы
        </h1>
        <p className="text-lg text-gray-600">
          Часто задаваемые вопросы о наших услугах
        </p>
      </div>

      <div className="space-y-4">
        {faqData.map((item, index) => (
          <div
            key={item.id}
            className="card overflow-hidden animate-slide-up"
            style={{ animationDelay: `${index * 0.05}s` }}
          >
            <button
              onClick={() => toggleQuestion(item.id)}
              className="w-full text-left p-6 flex items-center justify-between hover:bg-gray-50 transition-colors duration-200"
            >
              <h3 className="text-lg md:text-xl font-bold text-gray-900 pr-4">
                {item.question}
              </h3>
              <svg
                className={`w-6 h-6 text-primary-600 flex-shrink-0 transition-transform duration-300 ${
                  openId === item.id ? 'rotate-180' : ''
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
            <div
              className={`overflow-hidden transition-all duration-300 ${
                openId === item.id ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
              }`}
            >
              <div className="px-6 pb-6 pt-0">
                <p className="text-gray-700 leading-relaxed">{item.answer}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 card p-8 md:p-12 bg-gradient-to-br from-primary-50 to-blue-50 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Не нашли ответ на свой вопрос?
        </h2>
        <p className="text-gray-700 mb-6">
          Свяжитесь с нами, и мы с радостью ответим на все ваши вопросы
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="tel:+79991234567"
            className="inline-block btn-primary"
          >
            Позвонить нам
          </a>
          <a
            href="/contacts"
            className="inline-block bg-white text-primary-600 px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-primary-200"
          >
            Все контакты
          </a>
        </div>
      </div>
    </div>
  );
}

