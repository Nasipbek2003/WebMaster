export interface Service {
  id: string;
  name: string;
  description: string;
  shortDescription: string;
  price: number;
  image: string;
  category: string;
  reviews?: Review[];
}

export interface Review {
  id: string;
  author: string;
  rating: number;
  comment: string;
  date: string;
}

export interface Order {
  serviceId?: string;
  masterId?: string;
  customerName: string;
  phone: string;
  address: string;
  problemDescription: string;
  preferredTime: string;
}

export interface OrderResponse {
  success: boolean;
  message: string;
  orderId?: string;
}

export interface ServiceCategory {
  id: string;
  name: string;
  icon: string;
  description: string;
}

export interface Master {
  id: string;
  name: string;
  photo: string;
  rating: number;
  reviewsCount: number;
  experience: number;
  price: number;
  categoryId: string;
  categoryName: string;
  phone: string;
  description: string;
  isAvailable: boolean;
}




