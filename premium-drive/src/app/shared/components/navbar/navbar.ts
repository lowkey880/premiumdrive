import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { FavoritesService } from '../../../core/services/favorites.service';

@Component({
  selector: 'app-navbar',
  standalone: false,
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar implements OnInit {
  isLoggedIn = false;
  username = '';
  favCount = 0;
  menuOpen = false;

  constructor(private auth: AuthService, private favorites: FavoritesService) {}

  ngOnInit(): void {
    this.auth.isLoggedIn$.subscribe(val => {
      this.isLoggedIn = val;
      this.username = this.auth.getUsername();
    });
    this.favorites.favorites$.subscribe(favs => (this.favCount = favs.length));
  }

  toggleMenu(): void {
    this.menuOpen = !this.menuOpen;
  }

  closeMenu(): void {
    this.menuOpen = false;
  }

  logout(): void {
    this.auth.logout();
    this.closeMenu();
  }
}
