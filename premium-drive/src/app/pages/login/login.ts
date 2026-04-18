import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login implements OnInit {
  username = '';
  password = '';
  isLoading = false;
  showPassword = false;
  sessionExpired = false;
  returnUrl = '/';

  constructor(
    private auth: AuthService,
    private toast: ToastService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (this.auth.isLoggedIn()) {
      this.router.navigate(['/']);
      return;
    }
    this.returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') || '/';
    this.sessionExpired = this.route.snapshot.queryParamMap.has('sessionExpired');
    if (this.sessionExpired) {
      this.toast.warning('Сессия истекла. Пожалуйста, войдите снова.');
    }
  }

  login(): void {
    if (!this.username.trim()) {
      this.toast.warning('Введите имя пользователя');
      return;
    }
    if (!this.password) {
      this.toast.warning('Введите пароль');
      return;
    }
    this.isLoading = true;
    this.auth.login(this.username.trim(), this.password, this.returnUrl).subscribe({
      next: () => {
        this.toast.success('Добро пожаловать!');
      },
      error: (err) => {
        const msg = err.status === 401
          ? 'Неверный логин или пароль'
          : 'Ошибка сервера. Попробуйте позже.';
        this.toast.error(msg);
        this.isLoading = false;
      },
    });
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }
}
