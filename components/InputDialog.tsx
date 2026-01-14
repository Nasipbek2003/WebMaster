'use client';

import { useState, useEffect } from 'react';
import { CheckCircleIcon } from '@heroicons/react/24/outline';

interface InputDialogProps {
  isOpen: boolean;
  title: string;
  message?: string;
  placeholder?: string;
  type?: 'text' | 'number' | 'email' | 'tel';
  confirmText?: string;
  cancelText?: string;
  defaultValue?: string;
  onConfirm: (value: string) => void;
  onCancel: () => void;
}

export default function InputDialog({
  isOpen,
  title,
  message,
  placeholder = 'Введите значение',
  type = 'text',
  confirmText = 'Подтвердить',
  cancelText = 'Отмена',
  defaultValue = '',
  onConfirm,
  onCancel,
}: InputDialogProps) {
  const [value, setValue] = useState(defaultValue);

  useEffect(() => {
    if (isOpen) {
      setValue(defaultValue);
      // Фокус на input при открытии
      setTimeout(() => {
        const input = document.querySelector('#input-dialog-input') as HTMLInputElement;
        input?.focus();
      }, 100);
    }
  }, [isOpen, defaultValue]);

  const handleConfirm = () => {
    if (value.trim()) {
      onConfirm(value.trim());
      setValue('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleConfirm();
    } else if (e.key === 'Escape') {
      onCancel();
    }
  };

  if (!isOpen) return null;

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
          className="bg-white rounded-2xl shadow-2xl border-2 border-gray-200 max-w-md w-full transform transition-all duration-300"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-5 sm:p-6">
            {/* Header */}
            <div className="mb-4 sm:mb-5">
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 break-words">
                {title}
              </h3>
              {message && (
                <p className="text-sm sm:text-base text-gray-600 break-words leading-relaxed">
                  {message}
                </p>
              )}
            </div>

            {/* Input */}
            <div className="mb-4 sm:mb-5">
              <input
                id="input-dialog-input"
                type={type}
                value={value}
                onChange={(e) => setValue(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder={placeholder}
                className="input-field w-full py-2.5 sm:py-3 text-sm sm:text-base"
                autoFocus
              />
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
                onClick={handleConfirm}
                disabled={!value.trim()}
                className="flex-1 px-4 sm:px-6 py-2.5 sm:py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-semibold transition-all duration-200 transform hover:scale-[1.02] active:scale-100 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 text-sm sm:text-base flex items-center justify-center gap-2"
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
