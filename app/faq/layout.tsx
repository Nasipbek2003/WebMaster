import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Вопросы и Ответы - МастерСервис',
  description: 'Часто задаваемые вопросы о наших услугах. Ответы на популярные вопросы о вызове мастера на дом.',
};

export default function FAQLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}







