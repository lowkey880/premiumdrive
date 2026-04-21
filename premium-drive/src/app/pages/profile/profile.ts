import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { OrderService } from '../../core/services/order.service';
import { FavoritesService } from '../../core/services/favorites.service';
import { Order } from '../../shared/interfaces/models';

@Component({
  selector: 'app-profile',
  standalone: false,
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile implements OnInit {
  username = '';
  allOrders: Order[] = [];
  favCount = 0;
  isLoading = true;

  constructor(
    private auth: AuthService,
    private orderService: OrderService,
    private favorites: FavoritesService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.username = this.auth.getUsername();

    this.favorites.favorites$.subscribe(favs => {
      this.favCount = favs.length;
      this.cdr.detectChanges();
    });

    this.orderService.getMyOrders().subscribe({
      next: data => {
        this.allOrders = data.sort(
          (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.isLoading = false;
        this.cdr.detectChanges();
      },
    });
  }

  get initial(): string {
    return this.username ? this.username[0].toUpperCase() : '?';
  }

  get completedCount(): number {
    return this.allOrders.filter(o => o.status === 'completed').length;
  }

  get recentOrders(): Order[] {
    return this.allOrders.filter(o => !o.is_purchased).slice(0, 3);
  }

  get purchasedOrders(): Order[] {
    return this.allOrders.filter(o => o.is_purchased);
  }

  get vip(): { label: string; color: string } {
    const purchased = this.allOrders.filter(o => o.is_purchased === true).length;
    if (purchased >= 5) return { label: 'Gold',   color: '#c9a84c' };
    if (purchased >= 2) return { label: 'Silver', color: '#a8a8a8' };
    return                     { label: 'Bronze', color: '#cd7f32' };
  }

  logout(): void {
    this.auth.logout();
  }

  statusLabel(status: string): string {
    const map: Record<string, string> = {
      new: 'Новая', pending: 'Ожидает', confirmed: 'Подтверждена',
      'test-drive': 'Тест-драйв', completed: 'Завершена', cancelled: 'Отменена',
    };
    return map[status] ?? status;
  }

  statusClass(status: string): string {
    const map: Record<string, string> = {
      new: 'status-new', pending: 'status-pending', confirmed: 'status-confirmed',
      'test-drive': 'status-drive', completed: 'status-done', cancelled: 'status-cancelled',
    };
    return map[status] ?? '';
  }

  formatDate(iso: string): string {
    return new Date(iso).toLocaleDateString('ru-RU', { day: '2-digit', month: 'long', year: 'numeric' });
  }
}
