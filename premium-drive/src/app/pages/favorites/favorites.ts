import { Component, OnInit } from '@angular/core';
import { FavoritesService } from '../../core/services/favorites.service';
import { ToastService } from '../../core/services/toast.service';
import { Vehicle } from '../../shared/interfaces/models';

@Component({
  selector: 'app-favorites',
  standalone: false,
  templateUrl: './favorites.html',
  styleUrl: './favorites.css',
})
export class Favorites implements OnInit {
  vehicles: Vehicle[] = [];

  constructor(private favorites: FavoritesService, private toast: ToastService) {}

  ngOnInit(): void {
    this.favorites.favorites$.subscribe(favs => (this.vehicles = favs));
  }

  remove(vehicle: Vehicle): void {
    this.favorites.remove(vehicle.id);
    this.toast.success(`«${vehicle.name}» убран из избранного`);
  }

  clearAll(): void {
    this.favorites.clear();
    this.toast.warning('Избранное очищено');
  }

  get totalPrice(): number {
    return this.vehicles.reduce((sum, v) => sum + Number(v.price), 0);
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency', currency: 'USD', maximumFractionDigits: 0,
    }).format(price);
  }
}
