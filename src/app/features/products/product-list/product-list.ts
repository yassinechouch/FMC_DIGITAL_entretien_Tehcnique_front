import {
  Component,
  OnInit,
  inject,
  ChangeDetectorRef
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

import { Product } from '../../../core/models/product.model';
import { ProductService } from '../../../core/services/product.service';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-product-list',
  imports: [
    CommonModule,
    RouterLink
  ],
  templateUrl: './product-list.html',
  styleUrl: './product-list.scss'
})
export class ProductList implements OnInit {

  private readonly productService =
    inject(ProductService);

  private readonly router =
    inject(Router);

  private readonly toastService =
    inject(ToastService);

  private readonly cdr =
    inject(ChangeDetectorRef);

  products: Product[] = [];

  loading = true;

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {

    this.loading = true;

    this.productService.getAll().subscribe({

      next: (products) => {

        this.products = products;

        this.loading = false;

        this.cdr.detectChanges();
      },

      error: () => {

        this.loading = false;

        this.toastService.error(
          'Impossible de charger les produits.'
        );

        this.cdr.detectChanges();
      }
    });
  }

  edit(id: number): void {

    this.router.navigate([
      '/products',
      id,
      'edit'
    ]);
  }

  delete(product: Product): void {

    const confirmed = confirm(
      `Supprimer le produit "${product.nomProduit}" ?`
    );

    if (!confirmed) {
      return;
    }

    this.productService
      .delete(product.id)
      .subscribe({

        next: () => {

          this.toastService.success(
            'Produit supprimé avec succès.'
          );

          this.loadProducts();

          this.cdr.detectChanges();
        },

        error: (error: HttpErrorResponse) => {

          const message =
            (error.error as any)?.message ??
            'Impossible de supprimer le produit.';

          this.toastService.error(message);

          this.cdr.detectChanges();
        }
      });
  }
}