'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  WrenchScrewdriverIcon,
  BoltIcon,
  Cog6ToothIcon,
  PaintBrushIcon,
  CloudIcon
} from '@heroicons/react/24/outline';
import { serviceCategories } from '@/lib/categories';

const getCategoryIcon = (categoryId: string) => {
  switch (categoryId) {
    case 'plumbing':
      return <WrenchScrewdriverIcon className="w-6 h-6 text-primary-600" />;
    case 'electrician':
      return <BoltIcon className="w-6 h-6 text-yellow-500" />;
    case 'appliance':
      return <Cog6ToothIcon className="w-6 h-6 text-gray-600" />;
    case 'carpenter':
      return <WrenchScrewdriverIcon className="w-6 h-6 text-amber-600" />;
    case 'painter':
      return <PaintBrushIcon className="w-6 h-6 text-blue-500" />;
    case 'ac':
      return <CloudIcon className="w-6 h-6 text-cyan-500" />;
    default:
      return <WrenchScrewdriverIcon className="w-6 h-6 text-primary-600" />;
  }
};

export default function ServiceSelector() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const handleCategoryClick = (categoryId: string) => {
    router.push(`/masters/${categoryId}`);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="nav-link hidden md:flex items-center gap-1 active:scale-95"
      >
        <WrenchScrewdriverIcon className="w-5 h-5" />
        <span>Услуги</span>
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
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          ></div>
          <div className="absolute top-full left-0 mt-2 w-80 bg-white rounded-xl shadow-2xl border border-gray-100 z-50 animate-scale-in overflow-hidden max-h-96 overflow-y-auto">
            <div className="p-2">
              <div className="text-xs font-semibold text-gray-500 px-3 py-2 mb-1">
                Выберите категорию услуг
              </div>
              {serviceCategories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => handleCategoryClick(category.id)}
                  className="w-full text-left px-4 py-3 rounded-lg transition-colors duration-200 hover:bg-primary-50 group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary-50 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-primary-100 transition-colors">
                      {getCategoryIcon(category.id)}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
                        {category.name}
                      </h4>
                      <p className="text-xs text-gray-500 mt-1">
                        {category.description}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

