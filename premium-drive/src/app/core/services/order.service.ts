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
}
