import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Review, ReviewCreatePayload } from '../../shared/interfaces/models';

const API = 'http://127.0.0.1:8000';

@Injectable({ providedIn: 'root' })
export class ReviewService {
  constructor(private http: HttpClient) {}

  getReviewsByVehicleId(vehicleId: number): Observable<Review[]> {
    const params = new HttpParams().set('vehicle', vehicleId.toString());
    return this.http.get<Review[]>(`${API}/api/reviews/`, { params });
  }

  createReview(payload: ReviewCreatePayload): Observable<Review> {
    return this.http.post<Review>(`${API}/api/reviews/`, payload);
  }
}
