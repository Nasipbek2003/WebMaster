'use client';

import { useState, useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  WrenchScrewdriverIcon,
  ClipboardDocumentListIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  EnvelopeIcon,
  MapPinIcon,
  PhoneIcon,
  UserIcon,
} from '@heroicons/react/24/outline';
import { useToast } from '@/components/Toast';
import ConfirmDialog from '@/components/ConfirmDialog';
import InputDialog from '@/components/InputDialog';

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

interface Order {
  id: string;
  orderNumber: string;
  status: string;
  problemDescription: string;
  address: string;
  city?: string;
  preferredTime?: string;
  urgency: string;
  estimatedPrice?: number;
  finalPrice?: number;
  scheduledAt?: string;
  completedAt?: string;
  createdAt: string;
  client: {
    id: string;
    name: string;
    email: string;
    phone: string;
    address: string;
  } | null;
  service: {
    id: string;
    name: string;
    description: string;
    price: number;
    category: {
      id: string;
      name: string;
      slug: string;
    };
  };
}

export default function MasterDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { showToast, ToastContainer } = useToast();
  const [services, setServices] = useState<Service[]>([]);
  const [categories, setCategories] = useState<ServiceCategory[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [activeTab, setActiveTab] = useState<'services' | 'orders'>('services');
  const [orderStatusFilter, setOrderStatusFilter] = useState<'PENDING' | 'CONFIRMED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED' | 'all'>('all');
  const [newOrdersCount, setNewOrdersCount] = useState(0);
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
  
  // Состояния для диалогов
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    type?: 'warning' | 'danger' | 'info';
    onConfirm?: () => void;
    confirmText?: string;
    cancelText?: string;
  }>({
    isOpen: false,
    title: '',
    message: '',
    type: 'warning',
  });
  
  const [inputDialog, setInputDialog] = useState<{
    isOpen: boolean;
    title: string;
    message?: string;
    placeholder?: string;
    type?: 'text' | 'number' | 'email' | 'tel';
    onConfirm?: (value: string) => void;
    confirmText?: string;
    cancelText?: string;
    defaultValue?: string;
  }>({
    isOpen: false,
    title: '',
    placeholder: '',
    type: 'text',
  });
  
  const dataLoadedRef = useRef(false);
  const ordersPollingRef = useRef<NodeJS.Timeout | null>(null);

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
        loadOrders();
        dataLoadedRef.current = true;
      }
    }
    
    return () => {
      if (ordersPollingRef.current) {
        clearInterval(ordersPollingRef.current);
        ordersPollingRef.current = null;
      }
    };
  }, [status, session?.user?.role, router]);

  // Отдельный useEffect для polling заказов
  useEffect(() => {
    if (activeTab === 'orders' && status === 'authenticated' && session?.user?.role === 'MASTER') {
      if (!ordersPollingRef.current) {
        startOrdersPolling();
      }
    } else {
      if (ordersPollingRef.current) {
        clearInterval(ordersPollingRef.current);
        ordersPollingRef.current = null;
      }
    }
    
    return () => {
      if (ordersPollingRef.current) {
        clearInterval(ordersPollingRef.current);
        ordersPollingRef.current = null;
      }
    };
  }, [activeTab, status, session?.user?.role]);

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

  const loadOrders = async (statusFilter?: string) => {
    try {
      setOrdersLoading(true);
      const url = statusFilter && statusFilter !== 'all' 
        ? `/api/master/orders?status=${statusFilter}`
        : '/api/master/orders';
      
      const response = await fetch(url);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        if (response.status === 401) {
          router.push('/auth/signin?callbackUrl=/master/dashboard');
          return;
        }
        throw new Error(errorData.error || 'Ошибка при загрузке заказов');
      }

      const ordersData = await response.json();
      
      // Проверяем, есть ли новые заказы (PENDING), которых не было раньше
      const previousPendingIds = new Set(
        orders.filter((o: Order) => o.status === 'PENDING').map((o: Order) => o.id)
      );
      const newPendingOrders = ordersData.filter(
        (o: Order) => o.status === 'PENDING' && !previousPendingIds.has(o.id)
      );
      
      setOrders(ordersData);
      
      // Подсчитываем новые заказы (PENDING)
      const pendingCount = ordersData.filter((o: Order) => o.status === 'PENDING').length;
      setNewOrdersCount(pendingCount);
      
      // Показываем уведомление, если есть новые заказы
      if (newPendingOrders.length > 0) {
        const message = newPendingOrders.length === 1
          ? `У вас новый заказ #${newPendingOrders[0].orderNumber}!`
          : `У вас ${newPendingOrders.length} новых заказ(ов)!`;
        showToast(message, 'info', 6000);
      }
    } catch (err: any) {
      console.error('Error loading orders:', err);
      setError(err.message || 'Ошибка при загрузке заказов');
    } finally {
      setOrdersLoading(false);
    }
  };

  const startOrdersPolling = () => {
    // Очищаем предыдущий интервал, если он есть
    if (ordersPollingRef.current) {
      clearInterval(ordersPollingRef.current);
    }
    // Обновляем заказы каждые 30 секунд
    ordersPollingRef.current = setInterval(() => {
      loadOrders(orderStatusFilter);
    }, 30000);
  };

  const handleOrderStatusUpdate = async (orderId: string, newStatus: string, scheduledAt?: string, finalPrice?: number) => {
    try {
      const response = await fetch(`/api/master/orders/${orderId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: newStatus,
          scheduledAt,
          finalPrice,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Ошибка при обновлении статуса заказа');
      }

      // Обновляем список заказов
      await loadOrders(orderStatusFilter);
      
      // Показываем уведомление об успехе
      const message = newStatus === 'CONFIRMED' 
        ? 'Заказ успешно принят!' 
        : newStatus === 'CANCELLED' 
        ? 'Заказ отклонен' 
        : newStatus === 'IN_PROGRESS'
        ? 'Работа начата'
        : newStatus === 'COMPLETED'
        ? 'Заказ завершен'
        : 'Заказ обновлен!';
      
      showToast(message, 'success', 4000);
    } catch (err: any) {
      setError(err.message || 'Ошибка при обновлении статуса заказа');
      showToast(err.message || 'Ошибка при обновлении статуса заказа', 'error', 5000);
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
      showToast(
        editingService ? 'Услуга успешно обновлена!' : 'Услуга успешно создана!',
        'success',
        3000
      );
    } catch (err: any) {
      setError(err.message || 'Ошибка при сохранении услуги');
      showToast(err.message || 'Ошибка при сохранении услуги', 'error', 5000);
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

  const handleDelete = (id: string) => {
    setConfirmDialog({
      isOpen: true,
      title: 'Удалить услугу?',
      message: 'Вы уверены, что хотите удалить эту услугу? Это действие нельзя отменить.',
      type: 'danger',
      confirmText: 'Удалить',
      cancelText: 'Отмена',
      onConfirm: async () => {
        try {
          const response = await fetch(`/api/services/master/${id}`, {
            method: 'DELETE',
          });

          if (!response.ok) {
            const data = await response.json();
            throw new Error(data.error || 'Ошибка при удалении услуги');
          }

          await loadData();
          showToast('Услуга успешно удалена!', 'success', 3000);
        } catch (err: any) {
          setError(err.message || 'Ошибка при удалении услуги');
          showToast(err.message || 'Ошибка при удалении услуги', 'error', 5000);
        }
      },
    });
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

  // Фильтруем заказы по выбранному статусу
  const filteredOrders = orders.filter((order) => {
    if (orderStatusFilter === 'all') return true;
    return order.status === orderStatusFilter;
  });

  // Группируем заказы по статусам
  const pendingOrders = orders.filter((o) => o.status === 'PENDING');
  const activeOrders = orders.filter((o) => o.status === 'CONFIRMED' || o.status === 'IN_PROGRESS');
  const completedOrders = orders.filter((o) => o.status === 'COMPLETED' || o.status === 'CANCELLED');

  return (
    <>
      <ToastContainer />
      {confirmDialog.isOpen && (
        <ConfirmDialog
          isOpen={confirmDialog.isOpen}
          title={confirmDialog.title}
          message={confirmDialog.message}
          type={confirmDialog.type}
          confirmText={confirmDialog.confirmText}
          cancelText={confirmDialog.cancelText}
          onConfirm={() => {
            if (confirmDialog.onConfirm) {
              confirmDialog.onConfirm();
            }
            setConfirmDialog({ ...confirmDialog, isOpen: false });
          }}
          onCancel={() => setConfirmDialog({ ...confirmDialog, isOpen: false })}
        />
      )}
      {inputDialog.isOpen && (
        <InputDialog
          isOpen={inputDialog.isOpen}
          title={inputDialog.title}
          message={inputDialog.message}
          placeholder={inputDialog.placeholder}
          type={inputDialog.type}
          confirmText={inputDialog.confirmText}
          cancelText={inputDialog.cancelText}
          defaultValue={inputDialog.defaultValue}
          onConfirm={(value) => {
            if (inputDialog.onConfirm) {
              inputDialog.onConfirm(value);
            }
            setInputDialog({ ...inputDialog, isOpen: false });
          }}
          onCancel={() => setInputDialog({ ...inputDialog, isOpen: false })}
        />
      )}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2 flex items-center gap-2 sm:gap-3">
            <WrenchScrewdriverIcon className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 text-primary-600" />
            Панель мастера
          </h1>
          <p className="text-sm sm:text-base text-gray-600">Управляйте своими услугами и заказами</p>
        </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-3 sm:px-4 py-2 sm:py-3 rounded-lg mb-4 sm:mb-6 text-sm sm:text-base">
          {error}
        </div>
      )}

      {/* Вкладки */}
      <div className="mb-4 sm:mb-6 border-b border-gray-200 overflow-x-auto">
        <nav className="flex gap-2 sm:gap-4 min-w-max sm:min-w-0">
          <button
            onClick={() => {
              setActiveTab('services');
              if (ordersPollingRef.current) {
                clearInterval(ordersPollingRef.current);
                ordersPollingRef.current = null;
              }
            }}
            className={`px-3 sm:px-4 md:px-6 py-2 sm:py-2.5 md:py-3 font-semibold transition-colors duration-200 border-b-2 text-sm sm:text-base whitespace-nowrap ${
              activeTab === 'services'
                ? 'border-primary-600 text-primary-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            <WrenchScrewdriverIcon className="w-4 h-4 sm:w-5 sm:h-5 inline mr-1.5 sm:mr-2" />
            <span className="hidden sm:inline">Мои услуги</span>
            <span className="sm:hidden">Услуги</span>
          </button>
          <button
            onClick={() => {
              setActiveTab('orders');
              loadOrders(orderStatusFilter);
            }}
            className={`px-3 sm:px-4 md:px-6 py-2 sm:py-2.5 md:py-3 font-semibold transition-colors duration-200 border-b-2 relative text-sm sm:text-base whitespace-nowrap ${
              activeTab === 'orders'
                ? 'border-primary-600 text-primary-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            <ClipboardDocumentListIcon className="w-4 h-4 sm:w-5 sm:h-5 inline mr-1.5 sm:mr-2" />
            Заказы
            {newOrdersCount > 0 && (
              <span className="ml-1 sm:ml-2 px-1.5 sm:px-2 py-0.5 bg-red-500 text-white text-xs font-bold rounded-full animate-pulse">
                {newOrdersCount}
              </span>
            )}
          </button>
        </nav>
      </div>

      {/* Содержимое вкладок */}
      {activeTab === 'services' && (
        <>
          <div className="mb-4 sm:mb-6">
            <button
              onClick={() => {
                resetForm();
                setShowForm(true);
              }}
              className="btn-primary flex items-center gap-2 text-sm sm:text-base px-4 sm:px-6 py-2.5 sm:py-3 w-full sm:w-auto justify-center sm:justify-start"
            >
              <PlusIcon className="w-4 h-4 sm:w-5 sm:h-5" />
              Добавить услугу
            </button>
          </div>

          {showForm && (
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 mb-6 sm:mb-8">
          <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">
            {editingService ? 'Редактировать услугу' : 'Новая услуга'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                Название услуги *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="input-field text-sm sm:text-base py-2.5 sm:py-3"
                placeholder="Например: Ремонт сантехники"
              />
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                Краткое описание
              </label>
              <input
                type="text"
                value={formData.shortDescription}
                onChange={(e) =>
                  setFormData({ ...formData, shortDescription: e.target.value })
                }
                className="input-field text-sm sm:text-base py-2.5 sm:py-3"
                placeholder="Краткое описание для карточки"
              />
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                Полное описание *
              </label>
              <textarea
                required
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                rows={4}
                className="input-field text-sm sm:text-base resize-none py-2.5 sm:py-3"
                placeholder="Подробное описание услуги"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
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

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                  Цена (сом) *
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
                  className="input-field text-sm sm:text-base py-2.5 sm:py-3"
                  placeholder="1500"
                />
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                  Продолжительность (минуты)
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.duration}
                  onChange={(e) =>
                    setFormData({ ...formData, duration: e.target.value })
                  }
                  className="input-field text-sm sm:text-base py-2.5 sm:py-3"
                  placeholder="60"
                />
              </div>
            </div>

            <div className="flex items-center gap-3 sm:gap-4">
              <input
                type="checkbox"
                id="isActive"
                checked={formData.isActive}
                onChange={(e) =>
                  setFormData({ ...formData, isActive: e.target.checked })
                }
                className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
              />
              <label htmlFor="isActive" className="text-xs sm:text-sm font-medium text-gray-700">
                Услуга активна
              </label>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-2">
              <button
                type="submit"
                disabled={submitting}
                className="btn-primary text-sm sm:text-base px-5 sm:px-6 py-2.5 sm:py-3 disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto"
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
                className="px-5 sm:px-6 py-2.5 sm:py-3 border-2 border-gray-300 rounded-xl font-semibold hover:bg-gray-50 transition-colors duration-200 text-sm sm:text-base w-full sm:w-auto"
              >
                Отмена
              </button>
            </div>
          </form>
            </div>
          )}

          <div>
            <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Мои услуги ({services.length})</h2>
            {services.length === 0 ? (
              <div className="text-center py-8 sm:py-12 bg-white rounded-xl sm:rounded-2xl shadow-lg px-4">
                <WrenchScrewdriverIcon className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400 mx-auto mb-3 sm:mb-4" />
                <p className="text-base sm:text-lg text-gray-600 mb-3 sm:mb-4">У вас пока нет услуг</p>
                <button
                  onClick={() => {
                    resetForm();
                    setShowForm(true);
                  }}
                  className="btn-primary text-sm sm:text-base px-4 sm:px-6 py-2.5 sm:py-3"
                >
                  Добавить первую услугу
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {services.map((service) => (
                <div
                  key={service.id}
                  className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 hover:shadow-xl transition-shadow duration-200"
                >
                  <div className="flex items-start justify-between mb-3 sm:mb-4 gap-2">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-1 break-words">
                        {service.name}
                      </h3>
                      <p className="text-xs sm:text-sm text-primary-600 font-medium">
                        {service.category.name}
                      </p>
                    </div>
                    <span
                      className={`px-2 sm:px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap flex-shrink-0 ${
                        service.isActive
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {service.isActive ? 'Активна' : 'Неактивна'}
                    </span>
                  </div>

                  {service.shortDescription && (
                    <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4 line-clamp-2 break-words">
                      {service.shortDescription}
                    </p>
                  )}

                  <div className="mb-3 sm:mb-4">
                    <p className="text-xl sm:text-2xl font-bold text-primary-600">
                      {service.priceType === 'FROM' && 'от '}
                      {service.price.toLocaleString('ru-RU')} сом
                      {service.priceType === 'HOURLY' && '/час'}
                    </p>
                    {service.duration && (
                      <p className="text-xs sm:text-sm text-gray-500 mt-1">
                        Продолжительность: {service.duration} мин.
                      </p>
                    )}
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2">
                    <button
                      onClick={() => handleEdit(service)}
                      className="flex-1 px-3 sm:px-4 py-2 bg-primary-100 text-primary-700 rounded-lg hover:bg-primary-200 transition-colors duration-200 flex items-center justify-center gap-2 text-sm sm:text-base"
                    >
                      <PencilIcon className="w-4 h-4" />
                      <span className="hidden sm:inline">Редактировать</span>
                      <span className="sm:hidden">Изменить</span>
                    </button>
                    <button
                      onClick={() => handleDelete(service.id)}
                      className="px-3 sm:px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors duration-200 flex items-center justify-center sm:inline-block"
                      title="Удалить"
                    >
                      <TrashIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                      <span className="sm:hidden ml-2">Удалить</span>
                    </button>
                  </div>
                </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}

      {activeTab === 'orders' && (
        <div>
          {/* Фильтры заказов */}
          <div className="mb-4 sm:mb-6 flex gap-2 flex-wrap">
            <button
              onClick={() => {
                setOrderStatusFilter('all');
                loadOrders('all');
              }}
              className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg font-medium transition-colors text-xs sm:text-sm ${
                orderStatusFilter === 'all'
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Все ({orders.length})
            </button>
            <button
              onClick={() => {
                setOrderStatusFilter('PENDING');
                loadOrders('PENDING');
              }}
              className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg font-medium transition-colors relative text-xs sm:text-sm ${
                orderStatusFilter === 'PENDING'
                  ? 'bg-yellow-600 text-white'
                  : 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
              }`}
            >
              Новые ({pendingOrders.length})
              {pendingOrders.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 sm:w-3 sm:h-3 bg-red-500 rounded-full animate-pulse"></span>
              )}
            </button>
            <button
              onClick={() => {
                setOrderStatusFilter('CONFIRMED');
                loadOrders('CONFIRMED');
              }}
              className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg font-medium transition-colors text-xs sm:text-sm ${
                orderStatusFilter === 'CONFIRMED'
                  ? 'bg-blue-600 text-white'
                  : 'bg-blue-100 text-blue-800 hover:bg-blue-200'
              }`}
            >
              Активные ({activeOrders.length})
            </button>
            <button
              onClick={() => {
                setOrderStatusFilter('COMPLETED');
                loadOrders('COMPLETED');
              }}
              className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg font-medium transition-colors text-xs sm:text-sm ${
                orderStatusFilter === 'COMPLETED'
                  ? 'bg-green-600 text-white'
                  : 'bg-green-100 text-green-800 hover:bg-green-200'
              }`}
            >
              История ({completedOrders.length})
            </button>
          </div>

          {/* Список заказов */}
          {ordersLoading ? (
            <div className="text-center py-8 sm:py-12">
              <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-primary-600 mx-auto mb-3 sm:mb-4"></div>
              <p className="text-sm sm:text-base text-gray-600">Загрузка заказов...</p>
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="text-center py-8 sm:py-12 bg-white rounded-xl sm:rounded-2xl shadow-lg px-4">
              <ClipboardDocumentListIcon className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400 mx-auto mb-3 sm:mb-4" />
              <p className="text-base sm:text-lg text-gray-600">Заказов нет</p>
            </div>
          ) : (
            <div className="space-y-3 sm:space-y-4">
              {filteredOrders.map((order) => (
                <div
                  key={order.id}
                  className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 hover:shadow-xl transition-shadow duration-200"
                >
                  <div className="flex flex-col sm:flex-row items-start sm:items-start justify-between mb-3 sm:mb-4 gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-2">
                        <h3 className="text-lg sm:text-xl font-bold text-gray-900 break-words">
                          Заказ #{order.orderNumber}
                        </h3>
                        <span
                          className={`px-2 sm:px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${
                            order.status === 'PENDING'
                              ? 'bg-yellow-100 text-yellow-800'
                              : order.status === 'CONFIRMED' || order.status === 'IN_PROGRESS'
                              ? 'bg-blue-100 text-blue-800'
                              : order.status === 'COMPLETED'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {order.status === 'PENDING' && 'Ожидает'}
                          {order.status === 'CONFIRMED' && 'Подтвержден'}
                          {order.status === 'IN_PROGRESS' && 'В работе'}
                          {order.status === 'COMPLETED' && 'Завершен'}
                          {order.status === 'CANCELLED' && 'Отменен'}
                        </span>
                        {order.status === 'PENDING' && (
                          <span className="px-1.5 sm:px-2 py-0.5 bg-red-500 text-white text-xs font-bold rounded-full animate-pulse whitespace-nowrap">
                            НОВЫЙ
                          </span>
                        )}
                      </div>
                      <p className="text-xs sm:text-sm text-gray-500">
                        Создан: {new Date(order.createdAt).toLocaleString('ru-RU')}
                      </p>
                    </div>
                    <div className="text-left sm:text-right w-full sm:w-auto">
                      <p className="text-xl sm:text-2xl font-bold text-primary-600">
                        {order.estimatedPrice ? `${order.estimatedPrice.toLocaleString('ru-RU')} сом` : 'Не указано'}
                      </p>
                      {order.finalPrice && (
                        <p className="text-xs sm:text-sm text-gray-500 mt-1">
                          Финальная цена: {order.finalPrice.toLocaleString('ru-RU')} сом
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-3 sm:mb-4">
                    <div>
                      <p className="text-xs sm:text-sm font-semibold text-gray-700 mb-1">Услуга:</p>
                      <p className="text-sm sm:text-base text-gray-900 break-words">{order.service.name}</p>
                      <p className="text-xs sm:text-sm text-gray-500">{order.service.category.name}</p>
                    </div>
                    {order.client && (
                      <div>
                        <p className="text-xs sm:text-sm font-semibold text-gray-700 mb-1">Клиент:</p>
                        <div className="flex items-center gap-1.5 sm:gap-2 mb-1">
                          <UserIcon className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400 flex-shrink-0" />
                          <p className="text-sm sm:text-base text-gray-900 break-words">{order.client.name}</p>
                        </div>
                        <div className="flex items-center gap-1.5 sm:gap-2 mb-1">
                          <PhoneIcon className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400 flex-shrink-0" />
                          <a href={`tel:${order.client.phone}`} className="text-xs sm:text-sm text-gray-600 break-all hover:text-primary-600 transition-colors">
                            {order.client.phone}
                          </a>
                        </div>
                        <div className="flex items-center gap-1.5 sm:gap-2">
                          <EnvelopeIcon className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400 flex-shrink-0" />
                          <a href={`mailto:${order.client.email}`} className="text-xs sm:text-sm text-gray-600 break-all hover:text-primary-600 transition-colors">
                            {order.client.email}
                          </a>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="mb-3 sm:mb-4">
                    <div className="flex items-start gap-2 mb-2">
                      <MapPinIcon className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs sm:text-sm font-semibold text-gray-700 mb-1">Адрес:</p>
                        <p className="text-sm sm:text-base text-gray-900 break-words">{order.address}</p>
                      </div>
                    </div>
                    {order.preferredTime && (
                      <div className="flex items-center gap-2 mt-2">
                        <ClockIcon className="w-4 h-4 text-gray-400 flex-shrink-0" />
                        <p className="text-xs sm:text-sm text-gray-600 break-words">
                          Предпочтительное время: {new Date(order.preferredTime).toLocaleString('ru-RU')}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="mb-3 sm:mb-4 p-3 sm:p-4 bg-gray-50 rounded-lg">
                    <p className="text-xs sm:text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2">Описание проблемы:</p>
                    <p className="text-sm sm:text-base text-gray-900 break-words whitespace-pre-wrap">{order.problemDescription}</p>
                  </div>

                  {/* Кнопки действий */}
                  {order.status === 'PENDING' && (
                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mt-4 sm:mt-6 pt-3 sm:pt-4 border-t border-gray-200">
                      <button
                        onClick={() => handleOrderStatusUpdate(order.id, 'CONFIRMED')}
                        className="flex-1 btn-primary flex items-center justify-center gap-2 text-sm sm:text-base px-4 sm:px-6 py-2.5 sm:py-3"
                      >
                        <CheckCircleIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                        <span>Принять заказ</span>
                      </button>
                      <button
                        onClick={() => {
                          setConfirmDialog({
                            isOpen: true,
                            title: 'Отклонить заказ?',
                            message: 'Вы уверены, что хотите отклонить этот заказ? Это действие можно будет отменить позже.',
                            type: 'warning',
                            confirmText: 'Отклонить',
                            cancelText: 'Отмена',
                            onConfirm: () => {
                              handleOrderStatusUpdate(order.id, 'CANCELLED');
                            },
                          });
                        }}
                        className="flex-1 sm:flex-initial px-4 sm:px-6 py-2.5 sm:py-3 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition-colors duration-200 flex items-center justify-center gap-2 text-sm sm:text-base"
                      >
                        <XCircleIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                        <span>Отклонить</span>
                      </button>
                    </div>
                  )}

                  {order.status === 'CONFIRMED' && (
                    <div className="flex gap-2 sm:gap-3 mt-4 sm:mt-6 pt-3 sm:pt-4 border-t border-gray-200">
                      <button
                        onClick={() => handleOrderStatusUpdate(order.id, 'IN_PROGRESS')}
                        className="flex-1 btn-primary flex items-center justify-center gap-2 text-sm sm:text-base px-4 sm:px-6 py-2.5 sm:py-3"
                      >
                        <ClockIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                        <span>Начать работу</span>
                      </button>
                    </div>
                  )}

                  {order.status === 'IN_PROGRESS' && (
                    <div className="flex gap-2 sm:gap-3 mt-4 sm:mt-6 pt-3 sm:pt-4 border-t border-gray-200">
                      <button
                        onClick={() => {
                          setInputDialog({
                            isOpen: true,
                            title: 'Завершить заказ',
                            message: 'Введите финальную цену заказа (сом):',
                            placeholder: '0.00',
                            type: 'number',
                            confirmText: 'Завершить',
                            cancelText: 'Отмена',
                            defaultValue: order.estimatedPrice?.toString() || '',
                            onConfirm: (value) => {
                              if (value && !isNaN(parseFloat(value)) && parseFloat(value) >= 0) {
                                handleOrderStatusUpdate(order.id, 'COMPLETED', undefined, parseFloat(value));
                              } else {
                                showToast('Пожалуйста, введите корректную цену', 'error', 4000);
                              }
                            },
                          });
                        }}
                        className="flex-1 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition-colors duration-200 flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 text-sm sm:text-base"
                      >
                        <CheckCircleIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                        <span>Завершить заказ</span>
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
      </div>
    </>
  );
}

