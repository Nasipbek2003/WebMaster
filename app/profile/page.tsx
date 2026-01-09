'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import {
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  LockClosedIcon,
  CameraIcon,
  BriefcaseIcon,
  MapPinIcon,
  CurrencyDollarIcon,
  WrenchScrewdriverIcon,
  PencilIcon,
  CheckIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';

interface UserProfile {
  id: string;
  email: string;
  name?: string | null;
  phone?: string | null;
  avatar?: string | null;
  role: string;
  master?: {
    id: string;
    bio?: string | null;
    experience: number;
    city?: string | null;
    address?: string | null;
    workRadius?: number | null;
    hourlyRate?: number | null;
  } | null;
}

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    bio: '',
    experience: '',
    city: '',
    address: '',
    workRadius: '',
    hourlyRate: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
      return;
    }

    if (status === 'authenticated') {
      loadProfile();
    }
  }, [status, router]);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/profile');

      if (!response.ok) {
        if (response.status === 401) {
          router.push('/auth/signin');
          return;
        }
        throw new Error('Ошибка при загрузке профиля');
      }

      const data = await response.json();
      setProfile(data);

      // Заполняем форму данными пользователя
      setFormData({
        name: data.name || '',
        email: data.email || '',
        phone: data.phone || '',
        bio: data.master?.bio || '',
        experience: data.master?.experience?.toString() || '',
        city: data.master?.city || '',
        address: data.master?.address || '',
        workRadius: data.master?.workRadius?.toString() || '',
        hourlyRate: data.master?.hourlyRate?.toString() || '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (err: any) {
      setError(err.message || 'Ошибка при загрузке профиля');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Файл должен быть изображением');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('Размер файла не должен превышать 5MB');
      return;
    }

    try {
      setUploadingAvatar(true);
      setError('');
      
      const formData = new FormData();
      formData.append('avatar', file);

      const response = await fetch('/api/profile/avatar', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Ошибка при загрузке фото');
      }

      // Обновляем профиль
      await loadProfile();
      setSuccess('Фото успешно обновлено');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.message || 'Ошибка при загрузке фото');
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Валидация пароля
    if (formData.newPassword) {
      if (formData.newPassword !== formData.confirmPassword) {
        setError('Пароли не совпадают');
        return;
      }
      if (formData.newPassword.length < 6) {
        setError('Пароль должен содержать минимум 6 символов');
        return;
      }
    }

    try {
      setSaving(true);

      const updateData: any = {
        name: formData.name || null,
        email: formData.email,
        phone: formData.phone || null,
      };

      if (formData.newPassword) {
        updateData.currentPassword = formData.currentPassword;
        updateData.newPassword = formData.newPassword;
      }

      // Добавляем данные мастера, если пользователь - мастер
      if (profile?.role === 'MASTER') {
        updateData.bio = formData.bio || null;
        updateData.experience = formData.experience ? parseInt(formData.experience) : 0;
        updateData.city = formData.city || null;
        updateData.address = formData.address || null;
        updateData.workRadius = formData.workRadius ? parseInt(formData.workRadius) : null;
        updateData.hourlyRate = formData.hourlyRate ? parseFloat(formData.hourlyRate) : null;
      }

      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Ошибка при сохранении профиля');
      }

      // Обновляем профиль
      await loadProfile();
      setEditing(false);
      setSuccess('Профиль успешно обновлен');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.message || 'Ошибка при сохранении профиля');
    } finally {
      setSaving(false);
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Загрузка...</p>
        </div>
      </div>
    );
  }

  if (status === 'unauthenticated' || !profile) {
    return null;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2 flex items-center gap-3">
          <UserIcon className="w-10 h-10 text-primary-600" />
          Личный кабинет
        </h1>
        <p className="text-gray-600">Управляйте своими данными и настройками</p>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
          <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
          <span className="text-sm font-medium">{error}</span>
        </div>
      )}

      {success && (
        <div className="mb-6 bg-green-50 border-l-4 border-green-500 text-green-700 px-4 py-3 rounded-lg flex items-center gap-2">
          <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <span className="text-sm font-medium">{success}</span>
        </div>
      )}

      {/* Фото профиля */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
        <div className="flex items-center gap-6">
          <div className="relative">
            <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-200 border-4 border-primary-100">
              {profile.avatar ? (
                <Image
                  src={profile.avatar}
                  alt={profile.name || 'Профиль'}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <UserIcon className="w-16 h-16 text-gray-400" />
                </div>
              )}
            </div>
            {uploadingAvatar && (
              <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {profile.name || 'Без имени'}
            </h2>
            <p className="text-gray-600 mb-4">{profile.email}</p>
            {profile.role === 'MASTER' && (
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-semibold">
                <WrenchScrewdriverIcon className="w-4 h-4" />
                Мастер
              </div>
            )}
            {profile.role === 'CLIENT' && (
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">
                <UserIcon className="w-4 h-4" />
                Клиент
              </div>
            )}
          </div>
          <div>
            <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
              <CameraIcon className="w-5 h-5" />
              <span>Изменить фото</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarUpload}
                className="hidden"
                disabled={uploadingAvatar}
              />
            </label>
          </div>
        </div>
      </div>

      {/* Форма редактирования */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Основная информация</h2>
          {!editing && (
            <button
              onClick={() => setEditing(true)}
              className="flex items-center gap-2 px-4 py-2 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
            >
              <PencilIcon className="w-5 h-5" />
              Редактировать
            </button>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Основные данные */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <UserIcon className="w-4 h-4 inline mr-1" />
                Имя
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                disabled={!editing}
                className="input-field disabled:bg-gray-100 disabled:cursor-not-allowed"
                placeholder="Ваше имя"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <EnvelopeIcon className="w-4 h-4 inline mr-1" />
                Email *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                disabled={!editing}
                required
                className="input-field disabled:bg-gray-100 disabled:cursor-not-allowed"
                placeholder="your@email.com"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <PhoneIcon className="w-4 h-4 inline mr-1" />
                Телефон
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                disabled={!editing}
                className="input-field disabled:bg-gray-100 disabled:cursor-not-allowed"
                placeholder="+7 (999) 123-45-67"
              />
            </div>
          </div>

          {/* Данные мастера */}
          {profile.role === 'MASTER' && (
            <>
              <div className="border-t pt-6 mt-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <BriefcaseIcon className="w-6 h-6 text-primary-600" />
                  Информация мастера
                </h3>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  О себе
                </label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  disabled={!editing}
                  rows={4}
                  className="input-field disabled:bg-gray-100 disabled:cursor-not-allowed"
                  placeholder="Расскажите о себе, своем опыте и навыках..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Опыт работы (лет)
                  </label>
                  <input
                    type="number"
                    name="experience"
                    value={formData.experience}
                    onChange={handleChange}
                    disabled={!editing}
                    min="0"
                    className="input-field disabled:bg-gray-100 disabled:cursor-not-allowed"
                    placeholder="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <CurrencyDollarIcon className="w-4 h-4 inline mr-1" />
                    Почасовая ставка (₽)
                  </label>
                  <input
                    type="number"
                    name="hourlyRate"
                    value={formData.hourlyRate}
                    onChange={handleChange}
                    disabled={!editing}
                    min="0"
                    step="0.01"
                    className="input-field disabled:bg-gray-100 disabled:cursor-not-allowed"
                    placeholder="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <MapPinIcon className="w-4 h-4 inline mr-1" />
                    Город
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    disabled={!editing}
                    className="input-field disabled:bg-gray-100 disabled:cursor-not-allowed"
                    placeholder="Город"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Радиус работы (км)
                  </label>
                  <input
                    type="number"
                    name="workRadius"
                    value={formData.workRadius}
                    onChange={handleChange}
                    disabled={!editing}
                    min="0"
                    className="input-field disabled:bg-gray-100 disabled:cursor-not-allowed"
                    placeholder="0"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <MapPinIcon className="w-4 h-4 inline mr-1" />
                    Адрес
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    disabled={!editing}
                    className="input-field disabled:bg-gray-100 disabled:cursor-not-allowed"
                    placeholder="Ваш адрес"
                  />
                </div>
              </div>
            </>
          )}

          {/* Смена пароля */}
          {editing && (
            <div className="border-t pt-6 mt-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <LockClosedIcon className="w-6 h-6 text-primary-600" />
                Смена пароля
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Оставьте поля пустыми, если не хотите менять пароль
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Текущий пароль
                  </label>
                  <input
                    type="password"
                    name="currentPassword"
                    value={formData.currentPassword}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="Введите текущий пароль"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Новый пароль
                  </label>
                  <input
                    type="password"
                    name="newPassword"
                    value={formData.newPassword}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="Минимум 6 символов"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Подтвердите новый пароль
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="Повторите новый пароль"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Кнопки действий */}
          {editing && (
            <div className="flex gap-4 pt-6 border-t">
              <button
                type="submit"
                disabled={saving}
                className="btn-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Сохранение...</span>
                  </>
                ) : (
                  <>
                    <CheckIcon className="w-5 h-5" />
                    <span>Сохранить изменения</span>
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={() => {
                  setEditing(false);
                  loadProfile(); // Загружаем исходные данные
                }}
                className="px-6 py-3 border-2 border-gray-300 rounded-xl font-semibold hover:bg-gray-50 transition-colors duration-200 flex items-center gap-2"
              >
                <XMarkIcon className="w-5 h-5" />
                Отмена
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

