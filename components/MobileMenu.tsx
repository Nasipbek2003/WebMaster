'use client';

import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import {
  Bars3Icon,
  XMarkIcon,
  WrenchScrewdriverIcon,
  MapPinIcon,
  PhoneIcon,
  UserIcon,
  HomeIcon,
  ClipboardDocumentListIcon,
} from '@heroicons/react/24/outline';

export default function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const menuPanelRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const { data: session } = useSession();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      // Проверяем, что клик не по кнопке меню и не по самому меню
      if (
        isOpen &&
        menuPanelRef.current &&
        buttonRef.current &&
        !menuPanelRef.current.contains(target) &&
        !buttonRef.current.contains(target)
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
      // Используем небольшую задержку, чтобы не закрыть меню сразу при открытии
      setTimeout(() => {
        document.addEventListener('mousedown', handleClickOutside);
      }, 100);
      document.addEventListener('keydown', handleEscape);
      // Блокируем скролл при открытом меню
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleLinkClick = () => {
    setIsOpen(false);
  };

  const menuContent = isOpen && mounted ? (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 z-[9998] animate-fade-in"
        onClick={() => setIsOpen(false)}
      />
      
      {/* Меню панель */}
      <div 
        ref={menuPanelRef}
        className="fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-white shadow-2xl z-[9999] transform transition-transform duration-300 ease-in-out animate-slide-in-right overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-gray-900">Меню</h2>
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors"
                  aria-label="Закрыть"
                >
                  <XMarkIcon className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            </div>

            <nav className="p-4 space-y-2">
              {/* Главная */}
              <Link
                href="/"
                onClick={handleLinkClick}
                className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-primary-50 transition-colors duration-200 group"
              >
                <HomeIcon className="w-5 h-5 text-gray-600 group-hover:text-primary-600" />
                <span className="font-medium text-gray-700 group-hover:text-primary-600">Главная</span>
              </Link>

              {/* Услуги - список категорий */}
              <div className="px-4 py-2">
                <div className="flex items-center gap-3 mb-2">
                  <WrenchScrewdriverIcon className="w-5 h-5 text-gray-600" />
                  <span className="font-semibold text-gray-700">Категории услуг</span>
                </div>
                <div className="ml-8 space-y-1">
                  <Link
                    href="/masters/plumbing"
                    onClick={handleLinkClick}
                    className="block px-3 py-2 rounded-lg hover:bg-primary-50 transition-colors text-sm text-gray-700"
                  >
                    Сантехник
                  </Link>
                  <Link
                    href="/masters/electrician"
                    onClick={handleLinkClick}
                    className="block px-3 py-2 rounded-lg hover:bg-primary-50 transition-colors text-sm text-gray-700"
                  >
                    Электрик
                  </Link>
                  <Link
                    href="/masters/appliance"
                    onClick={handleLinkClick}
                    className="block px-3 py-2 rounded-lg hover:bg-primary-50 transition-colors text-sm text-gray-700"
                  >
                    Ремонт техники
                  </Link>
                  <Link
                    href="/masters/carpenter"
                    onClick={handleLinkClick}
                    className="block px-3 py-2 rounded-lg hover:bg-primary-50 transition-colors text-sm text-gray-700"
                  >
                    Плотник
                  </Link>
                  <Link
                    href="/masters/painter"
                    onClick={handleLinkClick}
                    className="block px-3 py-2 rounded-lg hover:bg-primary-50 transition-colors text-sm text-gray-700"
                  >
                    Маляр-штукатур
                  </Link>
                  <Link
                    href="/masters/ac"
                    onClick={handleLinkClick}
                    className="block px-3 py-2 rounded-lg hover:bg-primary-50 transition-colors text-sm text-gray-700"
                  >
                    Кондиционеры
                  </Link>
                </div>
              </div>

              {/* Все услуги */}
              <Link
                href="/services"
                onClick={handleLinkClick}
                className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-primary-50 transition-colors duration-200 group"
              >
                <ClipboardDocumentListIcon className="w-5 h-5 text-gray-600 group-hover:text-primary-600" />
                <span className="font-medium text-gray-700 group-hover:text-primary-600">Все услуги</span>
              </Link>

              {/* Контакты */}
              <Link
                href="/contacts"
                onClick={handleLinkClick}
                className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-primary-50 transition-colors duration-200 group"
              >
                <PhoneIcon className="w-5 h-5 text-gray-600 group-hover:text-primary-600" />
                <span className="font-medium text-gray-700 group-hover:text-primary-600">Контакты</span>
              </Link>

              {/* Профиль (если авторизован) */}
              {session?.user && (
                <>
                  <div className="border-t border-gray-200 my-2"></div>
                  <Link
                    href="/profile"
                    onClick={handleLinkClick}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-primary-50 transition-colors duration-200 group"
                  >
                    <UserIcon className="w-5 h-5 text-gray-600 group-hover:text-primary-600" />
                    <span className="font-medium text-gray-700 group-hover:text-primary-600">Профиль</span>
                  </Link>
                  {session.user.role === 'MASTER' && (
                    <Link
                      href="/master/dashboard"
                      onClick={handleLinkClick}
                      className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-primary-50 transition-colors duration-200 group"
                    >
                      <WrenchScrewdriverIcon className="w-5 h-5 text-gray-600 group-hover:text-primary-600" />
                      <span className="font-medium text-gray-700 group-hover:text-primary-600">Панель мастера</span>
                    </Link>
                  )}
                </>
              )}
            </nav>
          </div>
    </>
  ) : null;

  return (
    <>
      <div className="sm:hidden relative" ref={menuRef}>
        {/* Кнопка меню */}
        <button
          ref={buttonRef}
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center justify-center w-10 h-10 rounded-lg hover:bg-gray-100 transition-colors duration-200"
          aria-label="Меню"
          aria-expanded={isOpen}
        >
          {isOpen ? (
            <XMarkIcon className="w-6 h-6 text-gray-700" />
          ) : (
            <Bars3Icon className="w-6 h-6 text-gray-700" />
          )}
        </button>
      </div>
      
      {/* Рендерим меню через портал в body */}
      {mounted && createPortal(menuContent, document.body)}
    </>
  );
}
