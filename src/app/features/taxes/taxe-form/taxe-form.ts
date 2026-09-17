
import {
  Component,
  OnInit,

  ChangeDetectorRef,
  inject
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
import { TaxeService } from '../../../core/services/taxe.service';

@Component({
  selector: 'app-taxe-form',
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './taxe-form.html',
  styleUrl: './taxe-form.scss',
})
export class TaxeForm {
  private readonly fb =
    inject(FormBuilder);

  private readonly route =
    inject(ActivatedRoute);

  private readonly router =
    inject(Router);

  private readonly taxeService =
    inject(TaxeService);

  private readonly toastService =
    inject(ToastService);

  private readonly cdr =
    inject(ChangeDetectorRef);

  taxeId?: number;

  loading = false;
   readonly form =
    this.fb.nonNullable.group({
reference:['',[Validators.required, Validators.minLength(3)]],
      
      libelle: [
        '',
        Validators.required
      ],

      type: [
        '',
        Validators.required
      ],

      valeur: [
        0,
        [
          Validators.required,
          Validators.min(0)
        ]
      ],



    });
      ngOnInit(): void {

    const id =
      this.route.snapshot.paramMap.get('id');

    if (id) {

      this.taxeId =
        Number(id);

      this.loadTaxe(
        this.taxeId
      );
    }
  }
  
loadTaxe(id: number): void {

    this.loading = true;

    this.taxeService
      .getById(id)
      .subscribe({

        next: (taxe) => {

          this.form.patchValue({

            libelle:
              taxe.libelle,

            type:
              taxe.type,

            valeur:
              taxe.valeur,


           
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

    if (this.taxeId) {

      this.updateTaxe(dto);

    } else {

      this.createTaxe(dto);
    }
  }
 private createTaxe(
    dto: {
      libelle: string;
      type: string;
      valeur: number;
    
    }
  ): void {

    this.taxeService
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

  private updateTaxe(
    dto: {
      libelle: string;
      type: string;
      valeur: number;
   
    }
  ): void {

    if (!this.taxeId) {
      return;
    }

    this.taxeService
      .update(
        this.taxeId,
        dto
      )
      .subscribe({

        next: () => {

          this.toastService.success(
            'taxe modifié avec succès.'
          );

          this.router.navigate([
            '/taxes'
          ]);
        },

        error: (
          error: HttpErrorResponse
        ) => {

          this.loading = false;

          const message =
            (error.error as any)?.message ??
            'Une erreur est survenue lors de la modification du taxe.';

          this.toastService.error(
            message
          );

          this.cdr.detectChanges();
        }

      });
  }

  cancel(): void {

    this.router.navigate([
      '/taxes'
    ]);
  }


}

