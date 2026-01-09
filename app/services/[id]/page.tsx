import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { getServiceById, getServices } from '@/lib/api';
import ReviewCard from '@/components/ReviewCard';
import { ChatBubbleLeftRightIcon } from '@heroicons/react/24/outline';

interface ServicePageProps {
  params: Promise<{
    id: string;
  }>;
}

export async function generateStaticParams() {
  const services = await getServices();
  return services.map((service) => ({
    id: service.id,
  }));
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
      priceCurrency: 'RUB',
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <div className="animate-fade-in">
      <Link
        href="/"
        className="text-primary-600 hover:text-primary-700 mb-6 inline-flex items-center gap-2 font-medium transition-colors duration-200 group"
      >
        <span className="group-hover:-translate-x-1 transition-transform duration-200">←</span>
        Назад к списку услуг
      </Link>

      <div className="card overflow-hidden">
        <div className="relative h-64 md:h-96 w-full bg-gradient-to-br from-primary-100 to-primary-200 overflow-hidden">
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

        <div className="p-6 md:p-10">
          <div className="mb-8">
            <div className="flex items-start justify-between mb-4 flex-wrap gap-4">
              <h1 className="text-3xl md:text-5xl font-bold text-gray-900 gradient-text">
                {service.name}
              </h1>
              <span className="px-4 py-2 bg-gradient-to-r from-primary-100 to-blue-100 text-primary-700 rounded-xl text-sm font-semibold">
                {service.category}
              </span>
            </div>
            <div className="mb-6 p-4 bg-gradient-to-r from-primary-50 to-blue-50 rounded-xl border-l-4 border-primary-500">
              <span className="text-sm text-gray-600 block mb-1">Цена от</span>
              <span className="text-4xl font-bold gradient-text">
                {service.price.toLocaleString('ru-RU')} ₽
              </span>
            </div>
            <p className="text-lg md:text-xl text-gray-700 leading-relaxed">
              {service.description}
            </p>
          </div>

          <div className="border-t border-gray-200 pt-6 mb-6">
            <Link
              href={`/order?serviceId=${service.id}`}
              className="inline-block btn-primary text-lg"
            >
              Заказать услугу →
            </Link>
          </div>

          {service.reviews && service.reviews.length > 0 && (
            <div className="border-t border-gray-200 pt-8">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <ChatBubbleLeftRightIcon className="w-8 h-8 text-primary-600" />
                Отзывы клиентов
              </h2>
              <div className="space-y-4">
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

