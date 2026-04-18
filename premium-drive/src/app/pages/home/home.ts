import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { VehicleService } from '../../core/services/vehicle.service';
import { ToastService } from '../../core/services/toast.service';
import { AuthService } from '../../core/services/auth.service';
import { Vehicle } from '../../shared/interfaces/models';

@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit {
  featured: Vehicle[] = [];
  isLoading = true;
  skeletons = Array(6);

  stats = [
    { value: '50+',  label: 'Премиальных авто' },
    { value: '500+', label: 'Довольных клиентов' },
    { value: '5',    label: 'Брендов' },
    { value: '100%', label: 'Незабываемых впечатлений' },
  ];

  brands = [
    { name: 'BMW',             img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/BMW.svg/600px-BMW.svg.png',              route: '/cars',        query: 'BMW' },
    { name: 'Porsche',         img: 'https://upload.wikimedia.org/wikipedia/de/thumb/5/5c/Porsche_Logo.svg/800px-Porsche_Logo.svg.png', route: '/cars',        query: 'Porsche' },
    { name: 'Mercedes',        img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/90/Mercedes-Logo.svg/800px-Mercedes-Logo.svg.png', route: '/cars',  query: 'Mercedes' },
    { name: 'Ducati',          img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/Ducati_logo.svg/800px-Ducati_logo.svg.png', route: '/motorcycles', query: 'Ducati' },
    { name: 'Harley-Davidson', img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/de/Harley-Davidson_logo.svg/800px-Harley-Davidson_logo.svg.png', route: '/motorcycles', query: 'Harley-Davidson' },
  ];

  constructor(
    private vehicleService: VehicleService,
    private toast: ToastService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private auth: AuthService
  ) {}

  ngOnInit(): void {
    this.vehicleService.getAll().subscribe({
      next: data => {
        this.featured = data.slice(0, 4);
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.toast.error('Не удалось загрузить каталог');
        this.isLoading = false;
        this.cdr.detectChanges();
      },
    });
  }

  goToBrand(brand: { route: string; query: string }): void {
    this.router.navigate([brand.route], { queryParams: { brand: brand.query } });
  }

  onStartClick(): void {
    this.router.navigate([this.auth.isLoggedIn() ? '/cars' : '/login']);
  }
}
