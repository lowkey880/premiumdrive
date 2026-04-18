import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { VehicleService } from '../../core/services/vehicle.service';
import { ToastService } from '../../core/services/toast.service';
import { Vehicle } from '../../shared/interfaces/models';

@Component({
  selector: 'app-car-list',
  standalone: false,
  templateUrl: './car-list.html',
  styleUrl: './car-list.css',
})
export class CarList implements OnInit {
  allVehicles: Vehicle[] = [];
  isLoading = true;
  selectedBrand = 'Все';
  searchQuery = '';
  skeletons = Array(6);

  brands = ['Все', 'BMW', 'Porsche', 'Mercedes'];

  constructor(
    private vehicleService: VehicleService,
    private toast: ToastService,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const qBrand = this.route.snapshot.queryParamMap.get('brand');
    if (qBrand && this.brands.includes(qBrand)) {
      this.selectedBrand = qBrand;
    }
    this.load();
  }

  load(): void {
    this.isLoading = true;
    this.searchQuery = '';
    const brand = this.selectedBrand !== 'Все' ? this.selectedBrand : undefined;
    console.log('[CarList] Loading vehicles, brand filter:', brand);
    this.vehicleService.getAll({ brand }).subscribe({
      next: data => {
        console.log('[CarList] Got data:', data);
        this.allVehicles = data;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: err => {
        console.log('[CarList] Error:', err);
        this.toast.error('Ошибка загрузки автомобилей');
        this.isLoading = false;
      },
    });
  }

  get vehicles(): Vehicle[] {
    const q = this.searchQuery.trim().toLowerCase();
    if (!q) return this.allVehicles;
    return this.allVehicles.filter(v =>
      v.name.toLowerCase().includes(q) || v.brand.toLowerCase().includes(q)
    );
  }

  filterByBrand(brand: string): void {
    this.selectedBrand = brand;
    this.load();
  }
}
