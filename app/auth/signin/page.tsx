'use client';

import { useState, useEffect } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { 
  WrenchScrewdriverIcon,
  EnvelopeIcon,
  LockClosedIcon,
  ArrowRightIcon,
} from '@heroicons/react/24/outline';

export default function SignInPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (searchParams?.get('registered') === 'true') {
      setSuccess('Регистрация прошла успешно! Войдите в свой аккаунт.');
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError('Неверный email или пароль');
        setLoading(false);
        return;
      }

      // Перенаправление в зависимости от роли
      router.push('/');
      router.refresh();
    } catch (err) {
      setError('Произошла ошибка при входе');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 via-blue-50/30 to-gray-50">
      <div className="max-w-md w-full">
        {/* Карточка формы */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
          {/* Заголовок с градиентом */}
          <div className="bg-gradient-to-r from-primary-600 to-primary-800 px-8 py-6 text-center">
            <Link
              href="/"
              className="flex items-center justify-center gap-2 text-2xl font-bold text-white mb-2 hover:opacity-90 transition-opacity"
            >
              <WrenchScrewdriverIcon className="w-8 h-8" />
              <span>МастерСервис</span>
            </Link>
            <h2 className="text-xl font-semibold text-white/90">
              Добро пожаловать обратно!
            </h2>
          </div>

          {/* Форма */}
          <div className="px-8 py-8">
            {success && (
              <div className="mb-6 bg-green-50 border-l-4 border-green-500 text-green-700 px-4 py-3 rounded-lg flex items-center gap-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-sm font-medium">{success}</span>
              </div>
            )}
            {error && (
              <div className="mb-6 bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <span className="text-sm font-medium">{error}</span>
              </div>
            )}

            <form className="space-y-6" onSubmit={handleSubmit}>
              {/* Email поле */}
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                  Email адрес
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <EnvelopeIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="input-field pl-12 py-3 text-base"
                    placeholder="your@email.com"
                  />
                </div>
              </div>

              {/* Пароль поле */}
              <div>
                <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                  Пароль
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <LockClosedIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="input-field pl-12 py-3 text-base"
                    placeholder="Введите пароль"
                  />
                </div>
              </div>

              {/* Кнопка входа */}
              <button
                type="submit"
                disabled={loading}
                className="w-full btn-primary flex items-center justify-center gap-2 py-4 text-base font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Вход...</span>
                  </>
                ) : (
                  <>
                    <span>Войти</span>
                    <ArrowRightIcon className="w-5 h-5" />
                  </>
                )}
              </button>
            </form>

            {/* Разделитель */}
            <div className="mt-6 mb-6 relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500">Нет аккаунта?</span>
              </div>
            </div>

            {/* Кнопка регистрации */}
            <Link
              href="/auth/signup"
              className="w-full flex items-center justify-center gap-2 px-6 py-4 border-2 border-primary-600 text-primary-600 rounded-xl font-semibold hover:bg-primary-50 transition-all duration-200 transform hover:scale-[1.02] active:scale-100"
            >
              <span>Создать аккаунт</span>
              <ArrowRightIcon className="w-5 h-5" />
            </Link>
          </div>
        </div>

        {/* Дополнительная информация */}
        <p className="mt-6 text-center text-sm text-gray-600">
          Вернуться на{' '}
          <Link href="/" className="font-semibold text-primary-600 hover:text-primary-700 transition-colors">
            главную страницу
          </Link>
        </p>
      </div>
    </div>
  );
}

