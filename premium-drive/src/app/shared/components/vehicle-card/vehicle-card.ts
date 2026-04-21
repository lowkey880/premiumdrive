import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Vehicle } from '../../interfaces/models';
import { FavoritesService } from '../../../core/services/favorites.service';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-vehicle-card',
  standalone: false,
  templateUrl: './vehicle-card.html',
  styleUrl: './vehicle-card.css',
})
export class VehicleCard {
  @Input() vehicle!: Vehicle;
  constructor(
    private favorites: FavoritesService,
    private auth: AuthService,
    private toast: ToastService,
    private router: Router
  ) {}

  get isFavorite(): boolean {
    return this.favorites.isFavorite(this.vehicle.id);
  }

  toggleFavorite(): void {
    this.favorites.toggle(this.vehicle);
    const msg = this.isFavorite ? 'Добавлено в избранное' : 'Удалено из избранного';
    this.toast.success(msg);
  }

  openDetail(): void {
    this.router.navigate(['/vehicle', this.vehicle.id]);
  }

  quickOrder(): void {
    if (!this.auth.isLoggedIn()) {
      this.toast.warning('Войдите, чтобы записаться на тест-драйв');
      this.router.navigate(['/login'], { queryParams: { returnUrl: `/vehicle/${this.vehicle.id}` } });
      return;
    }
    this.router.navigate(['/vehicle', this.vehicle.id]);
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(price);
  }
}
