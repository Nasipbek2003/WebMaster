'use client';

import { useState, useEffect, useRef } from 'react';
import { MapPinIcon } from '@heroicons/react/24/outline';

const cities = [
  'Бишкек',
  'Ош',
  'Джалал-Абад',
  'Каракол',
  'Токмок',
  'Кара-Балта',
  'Узген',
  'Балыкчи',
  'Кызыл-Кия',
  'Таш-Кумыр',
];

export default function CitySelector() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCity, setSelectedCity] = useState('Бишкек');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isOpen &&
        dropdownRef.current &&
        buttonRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 text-gray-700 hover:text-primary-600 font-medium transition-colors duration-200 relative group px-3 py-2 rounded-lg hover:bg-primary-50 active:scale-95"
      >
        <MapPinIcon className="w-5 h-5" />
        <span className="hidden md:inline">{selectedCity}</span>
        <span className="md:hidden">Город</span>
        <svg
          className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div
          ref={dropdownRef}
          className="absolute top-full right-0 mt-2 w-64 bg-white rounded-xl shadow-2xl border border-gray-100 z-50 animate-scale-in overflow-hidden"
        >
            <div className="p-2">
              <div className="text-xs font-semibold text-gray-500 px-3 py-2 mb-1">
                Выберите город
              </div>
              {cities.map((city) => (
                <button
                  key={city}
                  onClick={() => {
                    setSelectedCity(city);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2 rounded-lg transition-colors duration-200 ${
                    selectedCity === city
                      ? 'bg-primary-50 text-primary-700 font-semibold'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {city}
                </button>
              ))}
            </div>
        </div>
      )}
    </div>
  );
}

