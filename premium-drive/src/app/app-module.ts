import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

import { AppRoutingModule } from './app-routing-module';
import { AuthInterceptor } from './core/interceptors/auth.interceptor';

import { App } from './app';
import { Navbar } from './shared/components/navbar/navbar';
import { Footer } from './shared/components/footer/footer';
import { VehicleCard } from './shared/components/vehicle-card/vehicle-card';
import { Toast } from './shared/components/toast/toast';
import { SkeletonCard } from './shared/components/skeleton-card/skeleton-card';
import { Home } from './pages/home/home';
import { CarList } from './pages/car-list/car-list';
import { MotoList } from './pages/moto-list/moto-list';
import { VehicleDetail } from './pages/vehicle-detail/vehicle-detail';
import { Favorites } from './pages/favorites/favorites';
import { Orders } from './pages/orders/orders';
import { Profile } from './pages/profile/profile';
import { Login } from './pages/login/login';
import { Register } from './pages/register/register';

@NgModule({
  declarations: [
    App,
    Navbar,
    Footer,
    VehicleCard,
    Toast,
    SkeletonCard,
    Home,
    CarList,
    MotoList,
    VehicleDetail,
    Favorites,
    Orders,
    Profile,
    Login,
    Register,
  ],
  imports: [BrowserModule, AppRoutingModule, FormsModule],
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideHttpClient(withInterceptorsFromDi()),
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
  ],
  bootstrap: [App],
})
export class AppModule {}
