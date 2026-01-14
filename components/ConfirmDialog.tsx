'use client';

import { ExclamationTriangleIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'warning' | 'danger' | 'info';
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmDialog({
  isOpen,
  title,
  message,
  confirmText = 'Подтвердить',
  cancelText = 'Отмена',
  type = 'warning',
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  if (!isOpen) return null;

  const getStyles = () => {
    switch (type) {
      case 'danger':
        return {
          iconBg: 'bg-red-100',
          icon: 'text-red-600',
          confirmButton: 'bg-red-600 hover:bg-red-700 text-white',
          border: 'border-red-200',
        };
      case 'info':
        return {
          iconBg: 'bg-blue-100',
          icon: 'text-blue-600',
          confirmButton: 'bg-blue-600 hover:bg-blue-700 text-white',
          border: 'border-blue-200',
        };
      default:
        return {
          iconBg: 'bg-yellow-100',
          icon: 'text-yellow-600',
          confirmButton: 'bg-yellow-600 hover:bg-yellow-700 text-white',
          border: 'border-yellow-200',
        };
    }
  };

  const styles = getStyles();

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 animate-fade-in"
        onClick={onCancel}
      />
      
      {/* Dialog */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-scale-in">
        <div
          className={`bg-white rounded-2xl shadow-2xl border-2 ${styles.border} max-w-md w-full transform transition-all duration-300`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-5 sm:p-6">
            {/* Header */}
            <div className="flex items-start gap-4 mb-4 sm:mb-5">
              <div className={`${styles.iconBg} rounded-full p-3 flex-shrink-0`}>
                <ExclamationTriangleIcon className={`w-6 h-6 sm:w-7 sm:h-7 ${styles.icon}`} />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 break-words">
                  {title}
                </h3>
                <p className="text-sm sm:text-base text-gray-600 break-words leading-relaxed">
                  {message}
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4 border-t border-gray-200">
              <button
                onClick={onCancel}
                className="flex-1 px-4 sm:px-6 py-2.5 sm:py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all duration-200 text-sm sm:text-base"
              >
                {cancelText}
              </button>
              <button
                onClick={onConfirm}
                className={`flex-1 px-4 sm:px-6 py-2.5 sm:py-3 ${styles.confirmButton} rounded-xl font-semibold transition-all duration-200 transform hover:scale-[1.02] active:scale-100 text-sm sm:text-base flex items-center justify-center gap-2`}
              >
                <CheckCircleIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                {confirmText}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
