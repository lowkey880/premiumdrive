import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { VehicleService } from '../../core/services/vehicle.service';
import { ToastService } from '../../core/services/toast.service';
import { Vehicle } from '../../shared/interfaces/models';

@Component({
  selector: 'app-moto-list',
  standalone: false,
  templateUrl: './moto-list.html',
  styleUrl: './moto-list.css',
})
export class MotoList implements OnInit {
  allVehicles: Vehicle[] = [];
  isLoading = true;
  selectedBrand = 'Все';
  searchQuery = '';
  skeletons = Array(6);

  brands = ['Все', 'Ducati', 'Harley-Davidson'];

  constructor(
    private vehicleService: VehicleService,
    private toast: ToastService,
    private route: ActivatedRoute
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
    this.vehicleService.getAll({ brand }).subscribe({
      next: data => {
        this.allVehicles = data;
        this.isLoading = false;
      },
      error: () => {
        this.toast.error('Ошибка загрузки мотоциклов');
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
