import { ServiceCategory } from '@/types';

export const serviceCategories: ServiceCategory[] = [
  {
    id: 'plumbing',
    name: 'Сантехник',
    icon: '🔧',
    description: 'Ремонт и установка сантехники',
  },
  {
    id: 'electrician',
    name: 'Электрик',
    icon: '⚡',
    description: 'Электромонтажные работы',
  },
  {
    id: 'appliance',
    name: 'Ремонт техники',
    icon: '🔨',
    description: 'Ремонт бытовой техники',
  },
  {
    id: 'carpenter',
    name: 'Плотник',
    icon: '🪵',
    description: 'Изготовление мебели и ремонт',
  },
  {
    id: 'painter',
    name: 'Маляр-штукатур',
    icon: '🎨',
    description: 'Покраска и отделка',
  },
  {
    id: 'ac',
    name: 'Кондиционеры',
    icon: '❄️',
    description: 'Установка кондиционеров',
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

