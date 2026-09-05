import { Component, OnInit, inject,ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';

import {
  Order,
  OrderStatus
} from '../../../core/models/order.model';

import { OrderService } from '../../../core/services/order.service';

@Component({
  selector: 'app-order-list',
  imports: [
    CommonModule,
    RouterLink
  ],
  templateUrl: './order-list.html',
  styleUrl: './order-list.scss'
})
export class OrderList implements OnInit {

  private readonly orderService = inject(OrderService);
  private readonly router = inject(Router);
private readonly cdr = inject(ChangeDetectorRef);
  orders: Order[] = [];

  loading = true;
  errorMessage = '';

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.loading = true;

    this.orderService.getAll().subscribe({
      next: orders => {
        this.orders = orders;
        this.loading = false;
        this.cdr.markForCheck();
      },

      error: () => {
        this.errorMessage =
          'Impossible de charger les commandes.';
        this.loading = false;
        this.cdr.markForCheck();
      }
    });
  }

  statusLabel(status: OrderStatus | string): string {
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

  statusClass(status: OrderStatus | string): string {
    const value = this.statusLabel(status).toLowerCase();

    if (
      value.includes('valid')
    ) {
      return 'validated';
    }

    if (
      value.includes('annul')
    ) {
      return 'cancelled';
    }

    return 'draft';
  }

  detail(id: number): void {
    this.router.navigate(['/orders', id]);
  }

  edit(id: number): void {
    this.router.navigate(['/orders', id, 'edit']);
  }

  delete(order: Order): void {
    if (
      !confirm(
        `Supprimer la commande ${order.numeroCommande} ?`
      )
    ) {
      return;
    }

    this.orderService.delete(order.id).subscribe({
      next: () => this.loadOrders(),

      error: error => {
        this.errorMessage =
          error?.error?.message ??
          'Impossible de supprimer la commande.';
      }
    });
  }
}