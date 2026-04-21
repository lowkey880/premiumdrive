import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { CarList } from './pages/car-list/car-list';
import { MotoList } from './pages/moto-list/moto-list';
import { VehicleDetail } from './pages/vehicle-detail/vehicle-detail';
import { Favorites } from './pages/favorites/favorites';
import { Orders } from './pages/orders/orders';
import { Profile } from './pages/profile/profile';
import { Login } from './pages/login/login';
import { Register } from './pages/register/register';
import { AuthGuard } from './core/guards/auth.guard';

const routes: Routes = [
  { path: '', component: Home },
  { path: 'cars', component: CarList },
  { path: 'motorcycles', component: MotoList },
  { path: 'vehicle/:id', component: VehicleDetail },
  { path: 'favorites', component: Favorites, canActivate: [AuthGuard] },
  { path: 'orders', component: Orders, canActivate: [AuthGuard] },
  { path: 'profile', component: Profile, canActivate: [AuthGuard] },
  { path: 'login', component: Login },
  { path: 'register', component: Register },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
