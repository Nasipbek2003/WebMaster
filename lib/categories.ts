import { ServiceCategory } from '@/types';

export const serviceCategories: ServiceCategory[] = [
  {
    id: 'plumbing',
    name: 'Сантехник',
    slug: 'plumbing',
    icon: null,
    description: 'Ремонт и установка сантехники',
    isActive: true,
  },
  {
    id: 'electrician',
    name: 'Электрик',
    slug: 'electrician',
    icon: null,
    description: 'Электромонтажные работы',
    isActive: true,
  },
  {
    id: 'appliance',
    name: 'Ремонт техники',
    slug: 'appliance',
    icon: null,
    description: 'Ремонт бытовой техники',
    isActive: true,
  },
  {
    id: 'carpenter',
    name: 'Плотник',
    slug: 'carpenter',
    icon: null,
    description: 'Изготовление мебели и ремонт',
    isActive: true,
  },
  {
    id: 'painter',
    name: 'Маляр-штукатур',
    slug: 'painter',
    icon: null,
    description: 'Покраска и отделка',
    isActive: true,
  },
  {
    id: 'ac',
    name: 'Кондиционеры',
    slug: 'ac',
    icon: null,
    description: 'Установка кондиционеров',
    isActive: true,
  },
];

export function getCategoryById(id: string): ServiceCategory | undefined {
  return serviceCategories.find(cat => cat.id === id);
}

export function getCategoryIdByName(name: string): string | undefined {
  // Маппинг старых названий категорий на новые
  const categoryMapping: Record<string, string> = {
    'Сантехник': 'plumbing',
    'Электрик': 'electrician',
    'Ремонт техники': 'appliance',
    'Мастер по ремонту бытовой техники': 'appliance',
    'Плотник': 'carpenter',
    'Маляр-штукатур': 'painter',
    'Установка кондиционеров': 'ac',
    'Кондиционеры': 'ac',
    'Ремонт': 'plumbing', // По умолчанию для общих категорий
    'Отделка': 'painter',
    'Климат': 'ac',
  };

  // Сначала проверяем точное совпадение
  const exactMatch = serviceCategories.find(cat => cat.name === name);
  if (exactMatch) return exactMatch.id;

  // Затем проверяем маппинг
  const mappedId = categoryMapping[name];
  if (mappedId) return mappedId;

  // Если ничего не найдено, возвращаем undefined
  return undefined;
}

