import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { VehicleService } from '../../core/services/vehicle.service';
import { OrderService } from '../../core/services/order.service';
import { ReviewService } from '../../core/services/review.service';
import { FavoritesService } from '../../core/services/favorites.service';
import { AuthService } from '../../core/services/auth.service';
import { ToastService } from '../../core/services/toast.service';
import { Vehicle, Review } from '../../shared/interfaces/models';

@Component({
  selector: 'app-vehicle-detail',
  standalone: false,
  templateUrl: './vehicle-detail.html',
  styleUrl: './vehicle-detail.css',
})
export class VehicleDetail implements OnInit {
  vehicle: Vehicle | null = null;
  reviews: Review[] = [];
  isLoading = true;
  isLoggedIn = false;

  showOrderForm = false;
  orderSubmitting = false;
  orderForm = { fullName: '', phone: '', date: '', comment: '' };

  showReviewForm = false;
  reviewSubmitting = false;
  reviewForm = { text: '', rating: 0 };

  starRange = [1, 2, 3, 4, 5];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private vehicleService: VehicleService,
    private orderService: OrderService,
    private reviewService: ReviewService,
    private favorites: FavoritesService,
    private auth: AuthService,
    private toast: ToastService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.auth.isLoggedIn$.subscribe(val => (this.isLoggedIn = val));
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.vehicleService.getById(id).subscribe({
      next: v => {
        this.vehicle = v;
        this.isLoading = false;
        this.cdr.detectChanges();
        this.loadReviews(v.id);
      },
      error: () => {
        this.toast.error('Транспортное средство не найдено');
        this.router.navigate(['/']);
      },
    });
  }

  loadReviews(vehicleId: number): void {
    this.reviewService.getReviewsByVehicleId(vehicleId).subscribe({
      next: data => (this.reviews = data),
      error: () => {},
    });
  }

  get isFavorite(): boolean {
    return this.vehicle ? this.favorites.isFavorite(this.vehicle.id) : false;
  }

  toggleFavorite(): void {
    if (!this.vehicle) return;
    this.favorites.toggle(this.vehicle);
    this.toast.success(this.isFavorite ? 'Добавлено в избранное' : 'Убрано из избранного');
  }

  toggleOrderForm(): void {
    if (!this.isLoggedIn) {
      this.toast.warning('Войдите, чтобы записаться на тест-драйв');
      this.router.navigate(['/login'], { queryParams: { returnUrl: this.router.url } });
      return;
    }
    this.showOrderForm = !this.showOrderForm;
    this.showReviewForm = false;
  }

  submitOrder(): void {
    if (!this.orderForm.fullName || !this.orderForm.phone || !this.orderForm.date) {
      this.toast.warning('Заполните обязательные поля');
      return;
    }
    this.orderSubmitting = true;
    this.orderService.createOrder({
      car_name: this.vehicle!.name,
      vehicle_id: this.vehicle!.id,
      full_name: this.orderForm.fullName,
      phone: this.orderForm.phone,
      date: this.orderForm.date,
      comment: this.orderForm.comment,
    }).subscribe({
      next: () => {
        this.toast.success('Заявка на тест-драйв отправлена!');
        this.showOrderForm = false;
        this.orderForm = { fullName: '', phone: '', date: '', comment: '' };
        this.orderSubmitting = false;
      },
      error: () => {
        this.toast.error('Ошибка при отправке заявки');
        this.orderSubmitting = false;
      },
    });
  }

  toggleReviewForm(): void {
    if (!this.isLoggedIn) {
      this.toast.warning('Войдите, чтобы оставить отзыв');
      this.router.navigate(['/login'], { queryParams: { returnUrl: this.router.url } });
      return;
    }
    this.showReviewForm = !this.showReviewForm;
    this.showOrderForm = false;
  }

  setRating(r: number): void {
    this.reviewForm.rating = r;
  }

  submitReview(): void {
    if (!this.reviewForm.text || this.reviewForm.rating === 0) {
      this.toast.warning('Введите текст и выберите оценку');
      return;
    }
    this.reviewSubmitting = true;
    this.reviewService.createReview({
      car_name: this.vehicle!.name,
      vehicle_id: this.vehicle!.id,
      text: this.reviewForm.text,
      rating: this.reviewForm.rating,
    }).subscribe({
      next: r => {
        this.reviews = [r, ...this.reviews];
        this.toast.success('Отзыв опубликован!');
        this.showReviewForm = false;
        this.reviewForm = { text: '', rating: 0 };
        this.reviewSubmitting = false;
      },
      error: () => {
        this.toast.error('Ошибка при публикации отзыва');
        this.reviewSubmitting = false;
      },
    });
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency', currency: 'USD', maximumFractionDigits: 0,
    }).format(price);
  }

  ratingStars(rating: number): string {
    return '★'.repeat(rating) + '☆'.repeat(5 - rating);
  }
}
