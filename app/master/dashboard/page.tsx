'use client';

import { useState, useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  WrenchScrewdriverIcon,
} from '@heroicons/react/24/outline';

interface ServiceCategory {
  id: string;
  name: string;
  slug: string;
}

interface Service {
  id: string;
  name: string;
  description: string;
  shortDescription?: string;
  price: number;
  priceType: string;
  duration?: number;
  categoryId: string;
  category: ServiceCategory;
  images: string[];
  isActive: boolean;
  createdAt: string;
}

export default function MasterDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [services, setServices] = useState<Service[]>([]);
  const [categories, setCategories] = useState<ServiceCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    shortDescription: '',
    price: '',
    priceType: 'FIXED',
    duration: '',
    categoryId: '',
    images: [] as string[],
    isActive: true,
  });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const dataLoadedRef = useRef(false);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
      return;
    }

    if (status === 'authenticated') {
      if (session.user.role !== 'MASTER') {
        router.push('/');
        return;
      }
      // Загружаем данные только один раз при первой загрузке
      if (!dataLoadedRef.current) {
        loadData();
        dataLoadedRef.current = true;
      }
    }
  }, [status, session?.user?.role, router]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError('');
      const [servicesRes, categoriesRes] = await Promise.all([
        fetch('/api/services/master'),
        fetch('/api/categories'),
      ]);

      if (!categoriesRes.ok) {
        throw new Error('Ошибка при загрузке категорий');
      }

      const categoriesData = await categoriesRes.json();

      if (!servicesRes.ok) {
        const errorData = await servicesRes.json().catch(() => ({}));
        if (servicesRes.status === 401) {
          // Сессия недействительна, перенаправляем на вход
          router.push('/auth/signin?callbackUrl=/master/dashboard');
          return;
        }
        throw new Error(errorData.error || 'Ошибка при загрузке услуг');
      }

      const servicesData = await servicesRes.json();

      setServices(servicesData);
      setCategories(categoriesData);
    } catch (err: any) {
      console.error('Error loading data:', err);
      setError(err.message || 'Ошибка при загрузке данных');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      const url = editingService
        ? `/api/services/master/${editingService.id}`
        : '/api/services/master';
      const method = editingService ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price),
          duration: formData.duration ? parseInt(formData.duration) : null,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Ошибка при сохранении услуги');
      }

      // Обновить список услуг
      await loadData();
      resetForm();
    } catch (err: any) {
      setError(err.message || 'Ошибка при сохранении услуги');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (service: Service) => {
    setEditingService(service);
    setFormData({
      name: service.name,
      description: service.description,
      shortDescription: service.shortDescription || '',
      price: service.price.toString(),
      priceType: service.priceType,
      duration: service.duration?.toString() || '',
      categoryId: service.categoryId,
      images: service.images || [],
      isActive: service.isActive,
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Вы уверены, что хотите удалить эту услугу?')) {
      return;
    }

    try {
      const response = await fetch(`/api/services/master/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Ошибка при удалении услуги');
      }

      await loadData();
    } catch (err: any) {
      setError(err.message || 'Ошибка при удалении услуги');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      shortDescription: '',
      price: '',
      priceType: 'FIXED',
      duration: '',
      categoryId: '',
      images: [],
      isActive: true,
    });
    setEditingService(null);
    setShowForm(false);
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

  if (status === 'unauthenticated' || session?.user.role !== 'MASTER') {
    return null;
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2 flex items-center gap-3">
          <WrenchScrewdriverIcon className="w-10 h-10 text-primary-600" />
          Панель мастера
        </h1>
        <p className="text-gray-600">Управляйте своими услугами</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      <div className="mb-6">
        <button
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
          className="btn-primary flex items-center gap-2"
        >
          <PlusIcon className="w-5 h-5" />
          Добавить услугу
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold mb-6">
            {editingService ? 'Редактировать услугу' : 'Новая услуга'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Название услуги *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="input-field"
                placeholder="Например: Ремонт сантехники"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Краткое описание
              </label>
              <input
                type="text"
                value={formData.shortDescription}
                onChange={(e) =>
                  setFormData({ ...formData, shortDescription: e.target.value })
                }
                className="input-field"
                placeholder="Краткое описание для карточки"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Полное описание *
              </label>
              <textarea
                required
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                rows={4}
                className="input-field"
                placeholder="Подробное описание услуги"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Категория *
                </label>
                <select
                  required
                  value={formData.categoryId}
                  onChange={(e) =>
                    setFormData({ ...formData, categoryId: e.target.value })
                  }
                  className="input-field"
                >
                  <option value="">Выберите категорию</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Тип цены *
                </label>
                <select
                  required
                  value={formData.priceType}
                  onChange={(e) =>
                    setFormData({ ...formData, priceType: e.target.value })
                  }
                  className="input-field"
                >
                  <option value="FIXED">Фиксированная</option>
                  <option value="FROM">От (минимальная)</option>
                  <option value="HOURLY">Почасовая</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Цена (руб.) *
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({ ...formData, price: e.target.value })
                  }
                  className="input-field"
                  placeholder="1500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Продолжительность (минуты)
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.duration}
                  onChange={(e) =>
                    setFormData({ ...formData, duration: e.target.value })
                  }
                  className="input-field"
                  placeholder="60"
                />
              </div>
            </div>

            <div className="flex items-center gap-4">
              <input
                type="checkbox"
                id="isActive"
                checked={formData.isActive}
                onChange={(e) =>
                  setFormData({ ...formData, isActive: e.target.checked })
                }
                className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
              />
              <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
                Услуга активна
              </label>
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                disabled={submitting}
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting
                  ? 'Сохранение...'
                  : editingService
                  ? 'Сохранить изменения'
                  : 'Добавить услугу'}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="px-6 py-3 border-2 border-gray-300 rounded-xl font-semibold hover:bg-gray-50 transition-colors duration-200"
              >
                Отмена
              </button>
            </div>
          </form>
        </div>
      )}

      <div>
        <h2 className="text-2xl font-bold mb-6">Мои услуги ({services.length})</h2>
        {services.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl shadow-lg">
            <WrenchScrewdriverIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 text-lg mb-4">У вас пока нет услуг</p>
            <button
              onClick={() => {
                resetForm();
                setShowForm(true);
              }}
              className="btn-primary"
            >
              Добавить первую услугу
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => (
              <div
                key={service.id}
                className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-200"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-1">
                      {service.name}
                    </h3>
                    <p className="text-sm text-primary-600 font-medium">
                      {service.category.name}
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      service.isActive
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {service.isActive ? 'Активна' : 'Неактивна'}
                  </span>
                </div>

                {service.shortDescription && (
                  <p className="text-gray-600 mb-4 line-clamp-2">
                    {service.shortDescription}
                  </p>
                )}

                <div className="mb-4">
                  <p className="text-2xl font-bold text-primary-600">
                    {service.priceType === 'FROM' && 'от '}
                    {service.price} ₽
                    {service.priceType === 'HOURLY' && '/час'}
                  </p>
                  {service.duration && (
                    <p className="text-sm text-gray-500">
                      Продолжительность: {service.duration} мин.
                    </p>
                  )}
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(service)}
                    className="flex-1 px-4 py-2 bg-primary-100 text-primary-700 rounded-lg hover:bg-primary-200 transition-colors duration-200 flex items-center justify-center gap-2"
                  >
                    <PencilIcon className="w-4 h-4" />
                    Редактировать
                  </button>
                  <button
                    onClick={() => handleDelete(service.id)}
                    className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors duration-200"
                  >
                    <TrashIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

