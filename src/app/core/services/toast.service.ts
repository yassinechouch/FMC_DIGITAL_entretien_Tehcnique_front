import { Injectable, signal } from '@angular/core';

export type ToastType = 'success' | 'error';

export interface Toast {
  message: string;
  type: ToastType;
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  readonly toast = signal<Toast | null>(null);

  private timeoutId?: ReturnType<typeof setTimeout>;

  success(message: string): void {
    this.show(message, 'success');
  }

  error(message: string): void {
    this.show(message, 'error');
  }

  private show(
    message: string,
    type: ToastType
  ): void {

    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }

    this.toast.set({
      message,
      type
    });

    this.timeoutId = setTimeout(() => {
      this.toast.set(null);
    }, 3000);
  }

  close(): void {
    this.toast.set(null);
  }
}