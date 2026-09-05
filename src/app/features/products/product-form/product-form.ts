import {
  Component,
  OnInit,
  inject,
  ChangeDetectorRef
} from '@angular/core';

import { CommonModule } from '@angular/common';

import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import {
  ActivatedRoute,
  Router
} from '@angular/router';

import {
  HttpErrorResponse
} from '@angular/common/http';

import {
  ProductService
} from '../../../core/services/product.service';

import {
  ToastService
} from '../../../core/services/toast.service';

@Component({
  selector: 'app-product-form',
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './product-form.html',
  styleUrl: './product-form.scss'
})
export class ProductForm implements OnInit {

  private readonly fb =
    inject(FormBuilder);

  private readonly route =
    inject(ActivatedRoute);

  private readonly router =
    inject(Router);

  private readonly productService =
    inject(ProductService);

  private readonly toastService =
    inject(ToastService);

  private readonly cdr =
    inject(ChangeDetectorRef);

  productId?: number;

  loading = false;

  readonly form =
    this.fb.nonNullable.group({

      reference: [
        '',
        Validators.required
      ],

      nomProduit: [
        '',
        Validators.required
      ],

      description: [
        '',
        Validators.required
      ],

      prixUnitaireHT: [
        0,
        [
          Validators.required,
          Validators.min(0)
        ]
      ],

      quantiteStock: [
        0,
        [
          Validators.required,
          Validators.min(0)
        ]
      ]

    });

  ngOnInit(): void {

    const id =
      this.route.snapshot.paramMap.get('id');

    if (id) {

      this.productId =
        Number(id);

      this.loadProduct(
        this.productId
      );
    }
  }

  loadProduct(id: number): void {

    this.loading = true;

    this.productService
      .getById(id)
      .subscribe({

        next: (product) => {

          this.form.patchValue({

            reference:
              product.reference,

            nomProduit:
              product.nomProduit,

            description:
              product.description,

            prixUnitaireHT:
              product.prixUnitaireHT,

            quantiteStock:
              product.quantiteStock
          });

          this.loading = false;

          this.cdr.detectChanges();
        },

        error: () => {

          this.loading = false;

          this.toastService.error(
            'Produit introuvable.'
          );

          this.cdr.detectChanges();
        }

      });
  }

  submit(): void {

    if (this.form.invalid) {

      this.form.markAllAsTouched();

      return;
    }

    const dto =
      this.form.getRawValue();

    this.loading = true;

    if (this.productId) {

      this.updateProduct(dto);

    } else {

      this.createProduct(dto);
    }
  }

  private createProduct(
    dto: {
      reference: string;
      nomProduit: string;
      description: string;
      prixUnitaireHT: number;
      quantiteStock: number;
    }
  ): void {

    this.productService
      .create(dto)
      .subscribe({

        next: () => {

          this.toastService.success(
            'Produit ajouté avec succès.'
          );

          this.router.navigate([
            '/products'
          ]);
        },

        error: (
          error: HttpErrorResponse
        ) => {

          this.loading = false;

          const message =
            (error.error as any)?.message ??
            'Une erreur est survenue lors de la création du produit.';

          this.toastService.error(
            message
          );

          this.cdr.detectChanges();
        }

      });
  }

  private updateProduct(
    dto: {
      reference: string;
      nomProduit: string;
      description: string;
      prixUnitaireHT: number;
      quantiteStock: number;
    }
  ): void {

    if (!this.productId) {
      return;
    }

    this.productService
      .update(
        this.productId,
        dto
      )
      .subscribe({

        next: () => {

          this.toastService.success(
            'Produit modifié avec succès.'
          );

          this.router.navigate([
            '/products'
          ]);
        },

        error: (
          error: HttpErrorResponse
        ) => {

          this.loading = false;

          const message =
            (error.error as any)?.message ??
            'Une erreur est survenue lors de la modification du produit.';

          this.toastService.error(
            message
          );

          this.cdr.detectChanges();
        }

      });
  }

  cancel(): void {

    this.router.navigate([
      '/products'
    ]);
  }
}