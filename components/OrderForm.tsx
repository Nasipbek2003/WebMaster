'use client';

import { useState, FormEvent, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Order } from '@/types';
import { createOrder } from '@/lib/api';
import { ExclamationTriangleIcon, XMarkIcon } from '@heroicons/react/24/outline';

interface OrderFormProps {
  serviceId?: string;
  serviceName?: string;
  masterId?: string;
  masterName?: string;
}

export default function OrderForm({ serviceId, serviceName, masterId, masterName }: OrderFormProps) {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [userData, setUserData] = useState<{ name?: string | null; phone?: string | null; address?: string | null } | null>(null);

  const [formData, setFormData] = useState<Order>({
    serviceId: serviceId || '',
    masterId: masterId || '',
    customerName: '',
    phone: '',
    address: '',
    problemDescription: '',
    preferredTime: '',
  });

  // Загружаем данные пользователя, если он авторизован
  useEffect(() => {
    const fetchUserData = async () => {
      if (status === 'authenticated' && session?.user) {
        try {
          const response = await fetch('/api/user/current');
          if (response.ok) {
            const data = await response.json();
            if (data) {
              setUserData(data);
              // Автоматически заполняем форму данными пользователя
              setFormData(prev => ({
                ...prev,
                customerName: data.name || '',
                phone: data.phone || '',
                address: data.address || '',
              }));
            }
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      } else {
        setUserData(null);
      }
    };

    fetchUserData();
  }, [status, session]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    const isAuthenticated = status === 'authenticated';

    // Для неавторизованных пользователей все поля обязательны
    if (!isAuthenticated) {
      if (!formData.customerName.trim()) {
        newErrors.customerName = 'Имя обязательно для заполнения';
      }

      if (!formData.phone.trim()) {
        newErrors.phone = 'Телефон обязателен для заполнения';
      } else if (!/^[\d\s\-\+\(\)]+$/.test(formData.phone)) {
        newErrors.phone = 'Неверный формат телефона';
      }

      if (!formData.address.trim()) {
        newErrors.address = 'Адрес обязателен для заполнения';
      }

      if (!formData.preferredTime.trim()) {
        newErrors.preferredTime = 'Удобное время визита обязательно';
      }
    } else {
      // Для авторизованных пользователей проверяем только обязательные поля
      if (!formData.phone.trim()) {
        newErrors.phone = 'Телефон обязателен для заполнения';
      } else if (!/^[\d\s\-\+\(\)]+$/.test(formData.phone)) {
        newErrors.phone = 'Неверный формат телефона';
      }

      if (!formData.address.trim()) {
        newErrors.address = 'Адрес обязателен для заполнения';
      }
    }

    // Описание проблемы обязательно для всех
    if (!formData.problemDescription.trim()) {
      newErrors.problemDescription = 'Описание проблемы обязательно';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitSuccess(false);

    try {
      const response = await createOrder(formData);

      if (response.success) {
        setSubmitSuccess(true);
        // Очистка формы
        setFormData({
          serviceId: serviceId || '',
          masterId: masterId || '',
          customerName: status === 'authenticated' ? (userData?.name || '') : '',
          phone: status === 'authenticated' ? (userData?.phone || '') : '',
          address: status === 'authenticated' ? (userData?.address || '') : '',
          problemDescription: '',
          preferredTime: '',
        });

        // Перенаправление через 3 секунды
        setTimeout(() => {
          router.push('/');
        }, 3000);
      }
    } catch (error: any) {
      console.error('Error submitting order:', error);
      setErrors({ submit: error.message || 'Произошла ошибка при отправке заказа. Попробуйте еще раз.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Очистка ошибки при изменении поля
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  if (submitSuccess) {
    return (
      <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl p-8 md:p-12 text-center animate-scale-in shadow-soft">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-green-500 rounded-full mb-6 animate-scale-in">
          <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-2xl md:text-3xl font-bold text-green-800 mb-3">Заказ успешно отправлен!</h3>
        <p className="text-green-700 mb-6 text-lg">
          Наш менеджер свяжется с вами в ближайшее время для уточнения деталей.
        </p>
        <div className="flex items-center justify-center gap-2 text-sm text-green-600">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span>Вы будете перенаправлены на главную страницу...</span>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5 md:space-y-6 animate-fade-in">
      {masterName && (
        <div className="bg-gradient-to-r from-primary-50 to-blue-50 border-l-4 border-primary-500 p-4 sm:p-5 rounded-xl">
          <label className="block text-xs sm:text-sm font-medium text-primary-700 mb-2">Выбранный мастер</label>
          <p className="text-lg sm:text-xl font-bold gradient-text break-words">{masterName}</p>
        </div>
      )}
      {serviceName && !masterName && (
        <div className="bg-gradient-to-r from-primary-50 to-blue-50 border-l-4 border-primary-500 p-4 sm:p-5 rounded-xl">
          <label className="block text-xs sm:text-sm font-medium text-primary-700 mb-2">Выбранная услуга</label>
          <p className="text-lg sm:text-xl font-bold gradient-text break-words">{serviceName}</p>
        </div>
      )}

      {status !== 'authenticated' && (
        <div>
          <label htmlFor="customerName" className="block text-sm font-semibold text-gray-700 mb-2">
            Имя клиента <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="customerName"
            name="customerName"
            value={formData.customerName}
            onChange={handleChange}
            className={`input-field ${
              errors.customerName ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''
            }`}
            placeholder="Введите ваше имя"
          />
          {errors.customerName && (
            <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
              <ExclamationTriangleIcon className="w-4 h-4" />
              {errors.customerName}
            </p>
          )}
        </div>
      )}

      {status === 'authenticated' && userData && (
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-l-4 border-green-500 p-3 sm:p-4 rounded-xl">
          <p className="text-xs sm:text-sm font-medium text-green-700 mb-1.5 sm:mb-2">Ваши данные:</p>
          <p className="text-base sm:text-lg text-gray-900 font-semibold break-words">{userData.name || 'Не указано'}</p>
        </div>
      )}

      <div>
        <label htmlFor="phone" className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2">
          Телефон <span className="text-red-500">*</span>
        </label>
        <input
          type="tel"
          id="phone"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          readOnly={status === 'authenticated' && !!userData?.phone}
          className={`input-field text-sm sm:text-base py-2.5 sm:py-3 ${
            errors.phone ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''
          } ${status === 'authenticated' && userData?.phone ? 'bg-gray-100 cursor-not-allowed' : ''}`}
          placeholder="+7 (999) 123-45-67"
        />
        {errors.phone && (
          <p className="mt-1.5 sm:mt-2 text-xs sm:text-sm text-red-600 flex items-center gap-1">
            <ExclamationTriangleIcon className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
            <span>{errors.phone}</span>
          </p>
        )}
      </div>

      <div>
        <label htmlFor="address" className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2">
          Адрес <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="address"
          name="address"
          value={formData.address}
          onChange={handleChange}
          readOnly={status === 'authenticated' && !!userData?.address}
          className={`input-field text-sm sm:text-base py-2.5 sm:py-3 ${
            errors.address ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''
          } ${status === 'authenticated' && userData?.address ? 'bg-gray-100 cursor-not-allowed' : ''}`}
          placeholder="Город, улица, дом, квартира"
        />
        {errors.address && (
          <p className="mt-1.5 sm:mt-2 text-xs sm:text-sm text-red-600 flex items-center gap-1">
            <ExclamationTriangleIcon className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
            <span>{errors.address}</span>
          </p>
        )}
      </div>

      <div>
        <label htmlFor="problemDescription" className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2">
          Описание проблемы <span className="text-red-500">*</span>
        </label>
        <textarea
          id="problemDescription"
          name="problemDescription"
          value={formData.problemDescription}
          onChange={handleChange}
          rows={4}
          className={`input-field text-sm sm:text-base resize-none py-2.5 sm:py-3 ${
            errors.problemDescription ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''
          }`}
          placeholder="Опишите проблему подробно..."
        />
        {errors.problemDescription && (
          <p className="mt-1.5 sm:mt-2 text-xs sm:text-sm text-red-600 flex items-center gap-1">
            <ExclamationTriangleIcon className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
            <span>{errors.problemDescription}</span>
          </p>
        )}
      </div>

      {status !== 'authenticated' && (
        <div>
          <label htmlFor="preferredTime" className="block text-sm font-semibold text-gray-700 mb-2">
            Удобное время визита <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="preferredTime"
            name="preferredTime"
            value={formData.preferredTime}
            onChange={handleChange}
            className={`input-field ${
              errors.preferredTime ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''
            }`}
            placeholder="Например: завтра с 10:00 до 14:00"
          />
          {errors.preferredTime && (
            <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
              <ExclamationTriangleIcon className="w-4 h-4" />
              {errors.preferredTime}
            </p>
          )}
        </div>
      )}

      {errors.submit && (
        <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 animate-scale-in">
          <p className="text-sm text-red-600 flex items-center gap-2">
            <XMarkIcon className="w-5 h-5" />
            {errors.submit}
          </p>
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full btn-primary text-sm sm:text-base py-3 sm:py-3.5 md:py-4 disabled:bg-gray-400 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:shadow-lg"
      >
        {isSubmitting ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-4 w-4 sm:h-5 sm:w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span className="text-sm sm:text-base">Отправка...</span>
          </span>
        ) : (
          'Отправить заказ'
        )}
      </button>
    </form>
  );
}

