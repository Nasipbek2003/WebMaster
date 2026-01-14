'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useSession } from 'next-auth/react';

interface MasterOrderFormProps {
  masterId: string;
  masterName: string;
  masterPhone?: string;
}

interface Service {
  id: string;
  name: string;
  price: number;
  description: string;
}

export default function MasterOrderForm({ 
  masterId, 
  masterName,
  masterPhone 
}: MasterOrderFormProps) {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [services, setServices] = useState<Service[]>([]);
  const [selectedServiceId, setSelectedServiceId] = useState<string>('');
  const [formData, setFormData] = useState({
    customerName: '',
    phone: '',
    address: '',
    problemDescription: '',
    preferredTime: '',
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  // Загружаем услуги мастера и данные пользователя
  useEffect(() => {
    if (isOpen) {
      fetchMasterServices();
      if (session?.user) {
        fetchUserData();
      } else {
        // Сбрасываем форму для неавторизованных
        setFormData({
          customerName: '',
          phone: '',
          address: '',
          problemDescription: '',
          preferredTime: '',
        });
      }
    } else {
      // Сбрасываем форму при закрытии
      setSelectedServiceId('');
      if (!session?.user) {
        setFormData({
          customerName: '',
          phone: '',
          address: '',
          problemDescription: '',
          preferredTime: '',
        });
      }
    }
  }, [isOpen, session]);

  const fetchMasterServices = async () => {
    try {
      const response = await fetch(`/api/masters/${masterId}/services`);
      if (response.ok) {
        const data = await response.json();
        setServices(data || []);
        if (data && data.length > 0) {
          setSelectedServiceId(data[0].id);
        }
      } else {
        // Если ошибка, просто оставляем пустой массив услуг
        setServices([]);
      }
    } catch (error) {
      console.error('Ошибка загрузки услуг мастера:', error);
      setServices([]);
    }
  };

  const fetchUserData = async () => {
    try {
      const response = await fetch('/api/user/current');
      if (response.ok) {
        const userData = await response.json();
        setFormData(prev => ({
          ...prev,
          customerName: userData.name || '',
          phone: userData.phone || '',
          address: userData.address || '',
        }));
      }
    } catch (error) {
      console.error('Ошибка загрузки данных пользователя:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (services.length > 0 && !selectedServiceId) {
      showNotification('Пожалуйста, выберите услугу', 'error');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...(selectedServiceId && { serviceId: selectedServiceId }),
          masterId,
          customerName: formData.customerName,
          phone: formData.phone,
          address: formData.address,
          problemDescription: formData.problemDescription,
          ...(formData.preferredTime && { preferredTime: formData.preferredTime }),
        }),
      });

      const result = await response.json();

      if (response.ok) {
        showNotification('Заказ успешно отправлен! Мастер свяжется с вами в ближайшее время.', 'success');
        setIsOpen(false);
        setFormData({
          customerName: session?.user?.name || '',
          phone: '',
          address: '',
          problemDescription: '',
          preferredTime: '',
        });
      } else {
        throw new Error(result.error || 'Ошибка при отправке заказа');
      }
    } catch (error: any) {
      showNotification(error.message || 'Ошибка при отправке заказа', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const showNotification = (message: string, type: 'success' | 'error') => {
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 z-50 ${
      type === 'success' ? 'bg-green-50 border-2 border-green-200' : 'bg-red-50 border-2 border-red-200'
    } rounded-xl p-4 shadow-lg animate-slide-up max-w-md`;
    notification.innerHTML = `
      <div class="flex items-start gap-3">
        <div class="${type === 'success' ? 'bg-green-100' : 'bg-red-100'} rounded-full p-2">
          ${type === 'success' 
            ? '<svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>'
            : '<svg class="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>'
          }
        </div>
        <div>
          <p class="font-semibold ${type === 'success' ? 'text-green-800' : 'text-red-800'}">${type === 'success' ? 'Успешно!' : 'Ошибка!'}</p>
          <p class="text-sm ${type === 'success' ? 'text-green-700' : 'text-red-700'}">${message}</p>
        </div>
      </div>
    `;
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 5000);
  };

  const modalContent = isOpen && mounted ? (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] animate-fade-in"
        onClick={() => setIsOpen(false)}
      />
      
      {/* Modal */}
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-scale-in pointer-events-none">
        <div
          className="bg-white rounded-2xl shadow-2xl border-2 border-gray-200 max-w-2xl w-full max-h-[90vh] overflow-y-auto pointer-events-auto transform transition-all"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-6 sm:p-8">
            {/* Header */}
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                  Заказать услугу
                </h2>
                <p className="text-sm sm:text-base text-gray-600">
                  Мастер: {masterName}
                </p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors p-2"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
              {/* Выбор услуги */}
              {services.length > 0 ? (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Выберите услугу *
                  </label>
                  <select
                    value={selectedServiceId}
                    onChange={(e) => setSelectedServiceId(e.target.value)}
                    className="input-field w-full"
                    required
                  >
                    <option value="">-- Выберите услугу --</option>
                    {services.map((service) => (
                      <option key={service.id} value={service.id}>
                        {service.name} - {service.price.toLocaleString('ru-RU')} сом
                      </option>
                    ))}
                  </select>
                </div>
              ) : (
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                  <p className="text-sm text-gray-600">
                    У этого мастера пока нет доступных услуг. Вы можете оставить общий заказ, и мастер свяжется с вами.
                  </p>
                </div>
              )}

              {/* Имя */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ваше имя {!session && '*'}
                </label>
                <input
                  type="text"
                  name="customerName"
                  value={formData.customerName}
                  onChange={handleChange}
                  required={!session}
                  readOnly={!!(session && formData.customerName)}
                  className={`input-field w-full ${session && formData.customerName ? 'bg-gray-50' : ''}`}
                  placeholder="Введите ваше имя"
                />
              </div>

              {/* Телефон */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Телефон {!session && '*'}
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required={!session}
                  readOnly={!!(session && formData.phone)}
                  className={`input-field w-full ${session && formData.phone ? 'bg-gray-50' : ''}`}
                  placeholder="+996 555 123 456"
                />
              </div>

              {/* Адрес */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Адрес *
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                  readOnly={!!(session && formData.address)}
                  className={`input-field w-full ${session && formData.address ? 'bg-gray-50' : ''}`}
                  placeholder="Город, улица, дом, квартира"
                />
              </div>

              {/* Описание проблемы */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Описание проблемы *
                </label>
                <textarea
                  name="problemDescription"
                  value={formData.problemDescription}
                  onChange={handleChange}
                  required
                  rows={4}
                  className="input-field w-full resize-none"
                  placeholder="Опишите подробно, что нужно сделать..."
                />
              </div>

              {/* Предпочтительное время */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Предпочтительное время
                </label>
                <input
                  type="datetime-local"
                  name="preferredTime"
                  value={formData.preferredTime}
                  onChange={handleChange}
                  className="input-field w-full"
                  min={new Date().toISOString().slice(0, 16)}
                />
              </div>

              {/* Информация для незарегистрированных */}
              {!session && (
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                  <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                      <p className="text-sm font-medium text-blue-800 mb-1">
                        Совет: Зарегистрируйтесь для удобства
                      </p>
                      <p className="text-sm text-blue-700">
                        После регистрации ваши данные будут автоматически заполняться в формах заказа.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all duration-200"
                >
                  Отмена
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 btn-primary px-6 py-3 font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Отправка...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                      </svg>
                      Отправить заказ
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  ) : null;

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex-1 sm:flex-initial btn-primary text-xs sm:text-sm px-3 sm:px-4 py-2 sm:py-2.5 text-center whitespace-nowrap flex items-center justify-center gap-2"
      >
        <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M8 11v6h8v-6M8 11H6a2 2 0 00-2 2v6a2 2 0 002 2h12a2 2 0 002-2v-6a2 2 0 00-2-2h-2" />
        </svg>
        Заказать
      </button>
      {mounted && createPortal(modalContent, document.body)}
    </>
  );
}
