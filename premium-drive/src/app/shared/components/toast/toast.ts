import { Component, OnInit } from '@angular/core';
import { ToastService } from '../../../core/services/toast.service';
import { Toast as ToastModel } from '../../interfaces/models';

@Component({
  selector: 'app-toast',
  standalone: false,
  templateUrl: './toast.html',
  styleUrl: './toast.css',
})
export class Toast implements OnInit {
  toasts: ToastModel[] = [];

  constructor(private toastService: ToastService) {}

  ngOnInit(): void {
    this.toastService.toasts$.subscribe(t => (this.toasts = t));
  }

  dismiss(id: number): void {
    this.toastService.remove(id);
  }
}
