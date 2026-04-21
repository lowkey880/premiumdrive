export interface Category {
  id: number;
  name: string;
}

export interface Vehicle {
  id: number;
  name: string;
  brand: string;
  price: number;
  type: string;
  image: string;
  category: number | Category;
  year?: number;
  engine?: string;
  horsepower?: number;
  description?: string;
  available?: boolean;
}

export type OrderStatus = 'new' | 'pending' | 'confirmed' | 'test-drive' | 'completed' | 'cancelled';

export interface Order {
  id: number;
  car_name: string;
  vehicle_id: number | null;
  full_name: string;
  phone: string;
  date: string | null;
  comment: string;
  status: OrderStatus;
  is_purchased?: boolean;
  purchase_price?: string | null;
  card_last4?: string;
  purchased_at?: string | null;
  created_at: string;
}

export interface OrderCreatePayload {
  car_name: string;
  vehicle_id: number;
  full_name: string;
  phone: string;
  date: string;
  comment: string;
}

export interface Review {
  id: number;
  car_name: string;
  vehicle_id: number | null;
  text: string;
  rating: number;
  created_at: string;
  username?: string;
}

export interface ReviewCreatePayload {
  car_name: string;
  vehicle_id: number;
  text: string;
  rating: number;
}

export interface Toast {
  id: number;
  message: string;
  type: 'success' | 'error' | 'warning';
}

export interface AuthResponse {
  access: string;
  refresh: string;
}
