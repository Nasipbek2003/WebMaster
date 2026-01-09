import { Metadata } from 'next';
import { getServiceById } from '@/lib/api';
import { getMastersByCategory } from '@/lib/masters';
import OrderForm from '@/components/OrderForm';

interface OrderPageProps {
  searchParams: {
    serviceId?: string;
    masterId?: string;
  };
}

export const metadata: Metadata = {
  title: 'Оформление заказа - МастерСервис',
  description: 'Заполните форму для оформления заказа вызова мастера на дом.',
};

export default async function OrderPage({ searchParams }: OrderPageProps) {
  const { serviceId, masterId } = searchParams;
  let service = null;
  let serviceName = '';
  let masterName = '';

  if (serviceId) {
    service = await getServiceById(serviceId);
    if (service) {
      serviceName = service.name;
    }
  }

  if (masterId) {
    // Находим мастера по ID
    const allCategories = ['plumbing', 'electrician', 'appliance', 'carpenter', 'painter', 'ac'];
    for (const categoryId of allCategories) {
      const masters = getMastersByCategory(categoryId);
      const master = masters.find(m => m.id === masterId);
      if (master) {
        masterName = master.name;
        break;
      }
    }
  }

  return (
    <div className="max-w-3xl mx-auto animate-fade-in">
      <div className="text-center mb-10">
        <h1 className="text-4xl md:text-5xl font-bold gradient-text mb-4">
          Оформление заказа
        </h1>
        <p className="text-lg text-gray-600">
          Заполните форму, и наш мастер свяжется с вами в ближайшее время
        </p>
      </div>

      <div className="card p-6 md:p-10">
        <OrderForm 
          serviceId={serviceId} 
          serviceName={serviceName}
          masterId={masterId}
          masterName={masterName}
        />
      </div>
    </div>
  );
}

