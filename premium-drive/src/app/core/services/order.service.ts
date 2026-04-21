import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Order, OrderCreatePayload } from '../../shared/interfaces/models';

const API = 'http://127.0.0.1:8000';

@Injectable({ providedIn: 'root' })
export class OrderService {
  constructor(private http: HttpClient) {}

  getMyOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(`${API}/api/orders/`);
  }

  createOrder(payload: OrderCreatePayload): Observable<Order> {
    return this.http.post<Order>(`${API}/api/orders/`, payload);
  }

  cancelOrder(id: number): Observable<Order> {
    return this.http.patch<Order>(`${API}/api/orders/${id}/`, { status: 'cancelled' });
  }

  purchaseVehicle(data: {
    card_number: string;
    vehicle_id: number;
    car_name: string;
    purchase_price: number;
    promo_code?: string;
  }): Observable<{ success: boolean; message: string; card_last4: string; order_id: number }> {
    return this.http.post<any>(`${API}/api/orders/purchase/`, data);
  }
}
