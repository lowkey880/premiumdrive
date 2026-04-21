import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Vehicle } from '../../shared/interfaces/models';

const API = 'http://127.0.0.1:8000';

@Injectable({ providedIn: 'root' })
export class VehicleService {
  constructor(private http: HttpClient) {}

  getAll(filters?: { brand?: string; type?: string; category?: number }): Observable<Vehicle[]> {
    let params = new HttpParams();
    if (filters?.brand) params = params.set('brand', filters.brand);
    if (filters?.type) params = params.set('type', filters.type);
    if (filters?.category) params = params.set('category', filters.category.toString());
    return this.http.get<Vehicle[]>(`${API}/api/vehicles/`, { params });
  }

  getById(id: number): Observable<Vehicle> {
    return this.http.get<Vehicle>(`${API}/api/vehicles/${id}/`);
  }

}
