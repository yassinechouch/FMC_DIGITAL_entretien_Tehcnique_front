import {
  Component,
  OnInit,
  inject,
  ChangeDetectorRef
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import {
  ActivatedRoute,
  Router
} from '@angular/router';

import {
  Order,
  OrderStatus
} from '../../../core/models/order.model';

import {
  OrderService
} from '../../../core/services/order.service';

import {
  ToastService
} from '../../../core/services/toast.service';

@Component({
  selector: 'app-order-detail',
  imports: [
    CommonModule
  ],
  templateUrl: './order-detail.html',
  styleUrl: './order-detail.scss'
})
export class OrderDetail implements OnInit {

  private readonly route =
    inject(ActivatedRoute);

  private readonly router =
    inject(Router);

  private readonly orderService =
    inject(OrderService);

  private readonly toastService =
    inject(ToastService);

  private readonly cdr =
    inject(ChangeDetectorRef);

  order?: Order;

  loading = true;

  validating = false;

  ngOnInit(): void {

    const id =
      Number(
        this.route.snapshot
          .paramMap
          .get('id')
      );

    this.loadOrder(id);
  }

  loadOrder(id: number): void {

    this.loading = true;

    this.orderService
      .getById(id)
      .subscribe({

        next: (order) => {

          this.order = order;

          this.loading = false;

          this.cdr.detectChanges();
        },

        error: () => {

          this.loading = false;

          this.toastService.error(
            'Commande introuvable.'
          );

          this.cdr.detectChanges();
        }
      });
  }

  statusLabel(
    status: OrderStatus | string
  ): string {

    if (typeof status === 'string') {
      return status;
    }

    switch (status) {

      case OrderStatus.Validee:
        return 'Validée';

      case OrderStatus.Annulee:
        return 'Annulée';

      default:
        return 'Brouillon';
    }
  }

  isValidated(): boolean {

    if (!this.order) {
      return false;
    }

    return (
      this.order.statut ===
        OrderStatus.Validee ||

      String(this.order.statut)
        .toLowerCase()
        .includes('valid')
    );
  }

  validate(): void {

    if (!this.order) {
      return;
    }

    const confirmed =
      confirm(
        'Valider cette commande ?'
      );

    if (!confirmed) {
      return;
    }

    this.validating = true;

    this.orderService
      .validate(this.order.id)
      .subscribe({

        next: (order) => {

          this.order = order;

          this.validating = false;

          this.toastService.success(
            'Commande validée avec succès. Le stock a été mis à jour.'
          );

          this.cdr.detectChanges();
        },

        error: (
          error: HttpErrorResponse
        ) => {

          this.validating = false;

          const message =
            error.error?.message ??
            'Impossible de valider la commande.';

          this.toastService.error(
            message
          );

          this.cdr.detectChanges();
        }
      });
  }

  back(): void {

    this.router.navigate([
      '/orders'
    ]);
  }

  edit(): void {

    if (!this.order) {
      return;
    }

    this.router.navigate([
      '/orders',
      this.order.id,
      'edit'
    ]);
  }
}