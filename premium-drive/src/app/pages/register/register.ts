import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ToastService } from '../../core/services/toast.service';

const API = 'http://127.0.0.1:8000';

@Component({
  selector: 'app-register',
  standalone: false,
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  form = { username: '', email: '', password: '', password2: '' };
  isLoading = false;
  errorMessage = '';

  constructor(
    private http: HttpClient,
    private router: Router,
    private toast: ToastService
  ) {}

  onRegister(): void {
    this.errorMessage = '';

    if (!this.form.username.trim() || !this.form.password) {
      this.errorMessage = 'Заполните все обязательные поля';
      return;
    }
    if (this.form.password !== this.form.password2) {
      this.errorMessage = 'Пароли не совпадают';
      return;
    }
    if (this.form.password.length < 6) {
      this.errorMessage = 'Пароль должен быть не менее 6 символов';
      return;
    }

    this.isLoading = true;
    this.http.post(`${API}/api/auth/register/`, this.form).subscribe({
      next: () => {
        this.toast.success('Регистрация успешна! Войдите в аккаунт.');
        this.router.navigate(['/login']);
      },
      error: err => {
        this.errorMessage = err.error?.error || 'Ошибка регистрации. Попробуйте снова.';
        this.isLoading = false;
      },
    });
  }
}
