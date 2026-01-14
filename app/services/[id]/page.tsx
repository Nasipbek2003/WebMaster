import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { getServiceById, getServices } from '@/lib/api';
import ReviewCard from '@/components/ReviewCard';
import ServiceOrderForm from '@/components/ServiceOrderForm';
import { ChatBubbleLeftRightIcon } from '@heroicons/react/24/outline';

interface ServicePageProps {
  params: Promise<{
    id: string;
  }>;
}

export async function generateStaticParams() {
  try {
    // Получаем все услуги для генерации статических страниц
    // Используем большой лимит, чтобы получить все услуги
    const { services } = await getServices(1, 1000);
    return services.map((service) => ({
      id: service.id,
    }));
  } catch (error) {
    // Если не удалось получить услуги (например, БД недоступна при build),
    // возвращаем пустой массив - страницы будут генерироваться динамически
    console.warn('Failed to generate static params for services:', error);
    return [];
  }
}

export async function generateMetadata({ params }: ServicePageProps): Promise<Metadata> {
  const { id } = await params;
  const service = await getServiceById(id);

  if (!service) {
    return {
      title: 'Услуга не найдена - МастерСервис',
    };
  }

  return {
    title: service.name,
    description: service.shortDescription,
    keywords: [service.name, service.category, 'мастер на дом'],
    openGraph: {
      title: `${service.name} - МастерСервис`,
      description: service.shortDescription,
      images: [service.image],
      type: 'website',
    },
    alternates: {
      canonical: `/services/${service.id}`,
    },
  };
}

export default async function ServicePage({ params }: ServicePageProps) {
  const { id } = await params;
  const service = await getServiceById(id);

  if (!service) {
    notFound();
  }

  // Структурированные данные для SEO
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: service.name,
    description: service.description,
    provider: {
      '@type': 'LocalBusiness',
      name: 'МастерСервис',
    },
    areaServed: {
      '@type': 'City',
      name: 'Россия',
    },
    offers: {
      '@type': 'Offer',
      price: service.price,
      priceCurrency: 'KGS',
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
        <div className="animate-fade-in px-3 sm:px-4 md:px-6">
          {/* ToastContainer для уведомлений */}
          <div id="toast-container"></div>
        <Link
          href="/"
          className="text-primary-600 hover:text-primary-700 mb-4 sm:mb-6 inline-flex items-center gap-1.5 sm:gap-2 font-medium transition-colors duration-200 group text-sm sm:text-base"
        >
          <span className="group-hover:-translate-x-1 transition-transform duration-200">←</span>
          <span className="hidden sm:inline">Назад к списку услуг</span>
          <span className="sm:hidden">Назад</span>
        </Link>

        <div className="card overflow-hidden">
          <div className="relative h-48 sm:h-64 md:h-80 lg:h-96 w-full bg-gradient-to-br from-primary-100 to-primary-200 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent z-10"></div>
            <Image
              src={service.image}
              alt={service.name}
              fill
              className="object-cover"
              sizes="100vw"
              priority
            />
          </div>

          <div className="p-4 sm:p-6 md:p-8 lg:p-10">
            <div className="mb-6 sm:mb-8">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-3 sm:gap-4">
                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 gradient-text break-words">
                  {service.name}
                </h1>
                <span className="px-3 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-primary-100 to-blue-100 text-primary-700 rounded-lg sm:rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap">
                  {service.category}
                </span>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 mb-6 sm:mb-8">
                <div className="lg:col-span-2">
                  <p className="text-sm sm:text-base md:text-lg text-gray-700 leading-relaxed break-words mb-6">
                    {service.description}
                  </p>
                </div>
                
                <div className="lg:col-span-1">
                  <div className="bg-gradient-to-br from-primary-50 to-blue-50 rounded-2xl p-6 border-2 border-primary-100 shadow-lg">
                    <div className="text-center mb-6">
                      <span className="text-sm text-gray-600 block mb-2">Цена от</span>
                      <span className="text-3xl sm:text-4xl font-bold gradient-text block mb-4">
                        {service.price.toLocaleString('ru-RU')} сом
                      </span>
                    </div>
                    
                    {/* Информация о мастере */}
                    {(service as any).master && (
                      <div className="mb-6 p-4 bg-white/70 rounded-xl border border-primary-200">
                        <h3 className="font-semibold text-gray-900 mb-2">Мастер</h3>
                        <p className="text-sm text-gray-700 mb-2">{(service as any).master.name}</p>
                        <div className="flex items-center gap-2">
                          <div className="flex items-center">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <span key={i} className={`text-sm ${i < Math.floor((service as any).master.rating) ? 'text-yellow-400' : 'text-gray-300'}`}>
                                ★
                              </span>
                            ))}
                          </div>
                          <span className="text-sm text-gray-600">
                            {(service as any).master.rating} ({(service as any).master.reviewsCount} отзывов)
                          </span>
                        </div>
                      </div>
                    )}
                    
                    {/* Кнопки заказа */}
                    <div className="space-y-3">
                      <ServiceOrderForm
                        serviceId={service.id}
                        serviceName={service.name}
                        masterId={(service as any).master?.id || ''}
                        masterName={(service as any).master?.name || 'Мастер'}
                        servicePrice={service.price}
                      />
                      
                      <div className="text-center text-xs text-gray-500 py-2">
                        или
                      </div>
                      
                      <a
                        href={`tel:${(service as any).master?.phone || '+996555123456'}`}
                        className="w-full bg-white border-2 border-primary-600 text-primary-600 hover:bg-primary-50 flex items-center justify-center gap-2 py-3 sm:py-4 text-base font-semibold rounded-xl transition-all duration-200"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                        Позвонить мастеру
                      </a>
                      
                      <div className="text-center">
                        <a
                          href={`https://wa.me/${(service as any).master?.phone?.replace(/[^0-9]/g, '') || '996555123456'}?text=Здравствуйте! Меня интересует услуга: ${service.name}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 text-green-600 hover:text-green-700 font-medium text-sm"
                        >
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488z"/>
                          </svg>
                          WhatsApp
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>


            {service.reviews && service.reviews.length > 0 && (
              <div className="border-t border-gray-200 pt-6 sm:pt-8">
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-4 sm:mb-6 flex items-center gap-2 sm:gap-3">
                  <ChatBubbleLeftRightIcon className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-primary-600" />
                  Отзывы клиентов
                </h2>
                <div className="space-y-3 sm:space-y-4">
                  {service.reviews.map((review, index) => (
                    <div 
                      key={review.id}
                      className="animate-slide-up"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <ReviewCard review={review} />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

