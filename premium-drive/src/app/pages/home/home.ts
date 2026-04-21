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
    { value: '25+',  label: 'Премиальных авто' },
    { value: '500+', label: 'Довольных клиентов' },
    { value: '5',    label: 'Брендов' },
    { value: '100%', label: 'Незабываемых впечатлений' },
  ];

  brands = [
    { name: 'BMW',             img: 'https://cdn.worldvectorlogo.com/logos/bmw-2.svg',              w: 60, route: '/cars',        query: 'BMW' },
    { name: 'Porsche',         img: 'https://cdn.worldvectorlogo.com/logos/porsche-2.svg',          w: 60, route: '/cars',        query: 'Porsche' },
    { name: 'Mercedes',        img: 'https://cdn.worldvectorlogo.com/logos/mercedes-benz-9.svg',    w: 60, route: '/cars',        query: 'Mercedes' },
    { name: 'Ducati',          img: 'https://cdn.worldvectorlogo.com/logos/ducati-4.svg',           w: 60, route: '/motorcycles', query: 'Ducati' },
    { name: 'Harley-Davidson', img: 'https://cdn.worldvectorlogo.com/logos/harley-davidson-1.svg',  w: 80, route: '/motorcycles', query: 'Harley-Davidson' },
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
