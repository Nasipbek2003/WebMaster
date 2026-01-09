'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  WrenchScrewdriverIcon,
  EnvelopeIcon,
  LockClosedIcon,
  UserIcon,
  PhoneIcon,
  UserGroupIcon,
  ArrowRightIcon,
} from '@heroicons/react/24/outline';

export default function SignUpPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    phone: '',
    role: 'CLIENT' as 'CLIENT' | 'MASTER',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Валидация
    if (formData.password !== formData.confirmPassword) {
      setError('Пароли не совпадают');
      return;
    }

    if (formData.password.length < 6) {
      setError('Пароль должен содержать минимум 6 символов');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          name: formData.name || null,
          phone: formData.phone || null,
          role: formData.role,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Ошибка при регистрации');
        setLoading(false);
        return;
      }

      // Перенаправление на страницу входа
      router.push('/auth/signin?registered=true');
    } catch (err) {
      setError('Произошла ошибка при регистрации');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 via-blue-50/30 to-gray-50">
      <div className="max-w-lg w-full">
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
              Создайте свой аккаунт
            </h2>
            <p className="text-sm text-white/80 mt-1">
              Присоединяйтесь к нашему сообществу
            </p>
          </div>

          {/* Форма */}
          <div className="px-8 py-8">
            {error && (
              <div className="mb-6 bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
                <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <span className="text-sm font-medium">{error}</span>
              </div>
            )}

            <form className="space-y-5" onSubmit={handleSubmit}>
              {/* Роль */}
              <div>
                <label htmlFor="role" className="block text-sm font-semibold text-gray-700 mb-2">
                  Я регистрируюсь как: *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <UserGroupIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <select
                    id="role"
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    className="input-field pl-12 py-3 text-base appearance-none cursor-pointer"
                  >
                    <option value="CLIENT">Клиент</option>
                    <option value="MASTER">Мастер</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Имя */}
              <div>
                <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                  Имя <span className="text-gray-400 font-normal">(необязательно)</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <UserIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    className="input-field pl-12 py-3 text-base"
                    placeholder="Ваше имя"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                  Email адрес *
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
                    value={formData.email}
                    onChange={handleChange}
                    className="input-field pl-12 py-3 text-base"
                    placeholder="your@email.com"
                  />
                </div>
              </div>

              {/* Телефон */}
              <div>
                <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2">
                  Телефон <span className="text-gray-400 font-normal">(необязательно)</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <PhoneIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    className="input-field pl-12 py-3 text-base"
                    placeholder="+7 (999) 123-45-67"
                  />
                </div>
              </div>

              {/* Пароль */}
              <div>
                <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                  Пароль *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <LockClosedIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="new-password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="input-field pl-12 py-3 text-base"
                    placeholder="Минимум 6 символов"
                  />
                </div>
              </div>

              {/* Подтверждение пароля */}
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700 mb-2">
                  Подтвердите пароль *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <LockClosedIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    autoComplete="new-password"
                    required
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="input-field pl-12 py-3 text-base"
                    placeholder="Повторите пароль"
                  />
                </div>
              </div>

              {/* Кнопка регистрации */}
              <button
                type="submit"
                disabled={loading}
                className="w-full btn-primary flex items-center justify-center gap-2 py-4 text-base font-semibold disabled:opacity-50 disabled:cursor-not-allowed mt-6"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Регистрация...</span>
                  </>
                ) : (
                  <>
                    <span>Зарегистрироваться</span>
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
                <span className="px-4 bg-white text-gray-500">Уже есть аккаунт?</span>
              </div>
            </div>

            {/* Кнопка входа */}
            <Link
              href="/auth/signin"
              className="w-full flex items-center justify-center gap-2 px-6 py-4 border-2 border-primary-600 text-primary-600 rounded-xl font-semibold hover:bg-primary-50 transition-all duration-200 transform hover:scale-[1.02] active:scale-100"
            >
              <span>Войти в аккаунт</span>
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

