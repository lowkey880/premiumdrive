import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Vehicle } from '../../shared/interfaces/models';

const STORAGE_KEY = 'pd_favorites';

@Injectable({ providedIn: 'root' })
export class FavoritesService {
  private favoritesSubject = new BehaviorSubject<Vehicle[]>(this.load());
  favorites$ = this.favoritesSubject.asObservable();

  private load(): Vehicle[] {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    } catch {
      return [];
    }
  }

  private save(vehicles: Vehicle[]): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(vehicles));
    this.favoritesSubject.next(vehicles);
  }

  getAll(): Vehicle[] {
    return this.favoritesSubject.value;
  }

  isFavorite(id: number): boolean {
    return this.favoritesSubject.value.some(v => v.id === id);
  }

  toggle(vehicle: Vehicle): void {
    const current = this.favoritesSubject.value;
    const exists = current.some(v => v.id === vehicle.id);
    const updated = exists ? current.filter(v => v.id !== vehicle.id) : [...current, vehicle];
    this.save(updated);
  }

  remove(id: number): void {
    this.save(this.favoritesSubject.value.filter(v => v.id !== id));
  }

  clear(): void {
    this.save([]);
  }
}
