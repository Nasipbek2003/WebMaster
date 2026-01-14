'use client';

import { useState, useEffect } from 'react';
import { XMarkIcon, CheckCircleIcon, ExclamationCircleIcon, InformationCircleIcon } from '@heroicons/react/24/outline';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ToastItem {
  id: number;
  message: string;
  type: ToastType;
  duration?: number;
}

interface ToastProps {
  toast: ToastItem;
  onClose: () => void;
}

function Toast({ toast, onClose }: ToastProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (toast.duration && toast.duration > 0) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(() => onClose(), 300);
      }, toast.duration);

      return () => clearTimeout(timer);
    }
  }, [toast.duration, onClose]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => onClose(), 300);
  };

  const getStyles = () => {
    switch (toast.type) {
      case 'success':
        return {
          bg: 'bg-gradient-to-r from-green-50 to-emerald-50',
          border: 'border-green-200',
          text: 'text-green-800',
          icon: 'text-green-600',
          iconBg: 'bg-green-100',
          iconComponent: CheckCircleIcon,
        };
      case 'error':
        return {
          bg: 'bg-gradient-to-r from-red-50 to-rose-50',
          border: 'border-red-200',
          text: 'text-red-800',
          icon: 'text-red-600',
          iconBg: 'bg-red-100',
          iconComponent: ExclamationCircleIcon,
        };
      case 'warning':
        return {
          bg: 'bg-gradient-to-r from-yellow-50 to-amber-50',
          border: 'border-yellow-200',
          text: 'text-yellow-800',
          icon: 'text-yellow-600',
          iconBg: 'bg-yellow-100',
          iconComponent: ExclamationCircleIcon,
        };
      default:
        return {
          bg: 'bg-gradient-to-r from-blue-50 to-cyan-50',
          border: 'border-blue-200',
          text: 'text-blue-800',
          icon: 'text-blue-600',
          iconBg: 'bg-blue-100',
          iconComponent: InformationCircleIcon,
        };
    }
  };

  const styles = getStyles();
  const Icon = styles.iconComponent;

  return (
    <div
      className={`transform transition-all duration-300 ease-in-out ${
        isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
      }`}
    >
      <div
        className={`${styles.bg} ${styles.border} border-2 rounded-xl shadow-2xl p-4 sm:p-5 min-w-[280px] sm:min-w-[320px] max-w-[90vw] sm:max-w-md animate-slide-up`}
      >
        <div className="flex items-start gap-3 sm:gap-4">
          <div className={`${styles.iconBg} rounded-full p-2 flex-shrink-0`}>
            <Icon className={`w-5 h-5 sm:w-6 sm:h-6 ${styles.icon}`} />
          </div>
          <div className="flex-1 min-w-0">
            <p className={`${styles.text} font-semibold text-sm sm:text-base break-words`}>
              {toast.message}
            </p>
          </div>
          <button
            onClick={handleClose}
            className={`${styles.icon} hover:opacity-70 transition-opacity flex-shrink-0 p-1`}
            aria-label="Закрыть"
          >
            <XMarkIcon className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>
      </div>
    </div>
  );
}

// Hook для управления уведомлениями
export function useToast() {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const showToast = (message: string, type: ToastType = 'info', duration = 4000) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type, duration }]);
    return id;
  };

  const removeToast = (id: number) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  const ToastContainer = () => (
    <div className="fixed top-4 right-4 z-[100] pointer-events-none space-y-3 flex flex-col items-end">
      {toasts.map((toast, index) => (
        <div 
          key={toast.id} 
          className="pointer-events-auto animate-slide-up"
          style={{ animationDelay: `${index * 0.1}s` }}
        >
          <Toast toast={toast} onClose={() => removeToast(toast.id)} />
        </div>
      ))}
    </div>
  );

  return { showToast, removeToast, ToastContainer };
}
