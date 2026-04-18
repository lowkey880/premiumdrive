import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { OrderService } from '../../core/services/order.service';
import { ToastService } from '../../core/services/toast.service';
import { Order } from '../../shared/interfaces/models';

@Component({
  selector: 'app-orders',
  standalone: false,
  templateUrl: './orders.html',
  styleUrl: './orders.css',
})
export class Orders implements OnInit {
  orders: Order[] = [];
  isLoading = true;
  cancellingId: number | null = null;

  constructor(
    private orderService: OrderService,
    private toast: ToastService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.isLoading = true;
    this.orderService.getMyOrders().subscribe({
      next: data => {
        this.orders = data.sort(
          (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.toast.error('Ошибка загрузки заявок');
        this.isLoading = false;
        this.cdr.detectChanges();
      },
    });
  }

  isCancellable(order: Order): boolean {
    return order.status === 'new' || order.status === 'pending';
  }

  cancelOrder(order: Order): void {
    this.cancellingId = order.id;
    this.orderService.cancelOrder(order.id).subscribe({
      next: () => {
        const idx = this.orders.findIndex(o => o.id === order.id);
        if (idx !== -1) this.orders[idx] = { ...this.orders[idx], status: 'cancelled' };
        this.toast.success('Заявка отменена');
        this.cancellingId = null;
      },
      error: () => {
        this.toast.error('Не удалось отменить заявку');
        this.cancellingId = null;
      },
    });
  }

  statusLabel(status: string): string {
    const map: Record<string, string> = {
      new: 'Новая',
      pending: 'Ожидает',
      confirmed: 'Подтверждена',
      'test-drive': 'Тест-драйв',
      completed: 'Завершена',
      cancelled: 'Отменена',
    };
    return map[status] ?? status;
  }

  formatDate(iso: string): string {
    return new Date(iso).toLocaleDateString('ru-RU', {
      day: '2-digit', month: 'long', year: 'numeric',
    });
  }

  countByStatus(status: string): number {
    return this.orders.filter(o => o.status === status).length;
  }
}
