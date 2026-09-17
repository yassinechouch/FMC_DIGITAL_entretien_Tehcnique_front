import {
  Component,
  OnInit,
  inject,
  ChangeDetectorRef
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

import { Taxe } from '../../../core/models/Taxe.model';
import { TaxeService } from '../../../core/services/taxe.service';
import { ToastService } from '../../../core/services/toast.service';
@Component({
  selector: 'app-taxe-list',
  imports: [   CommonModule,
    RouterLink],
  templateUrl: './taxe-list.html',
  styleUrl: './taxe-list.scss',
})
export class TaxeList {
  private readonly taxeservice =
    inject(TaxeService);

  private readonly router =
    inject(Router);

  private readonly toastService =
    inject(ToastService);

  private readonly cdr =
    inject(ChangeDetectorRef);

  taxes: Taxe[] = [];
searchTerm ='';
  loading = true;

  ngOnInit(): void {
    this.loadtaxes();
  }

  loadtaxes(): void {

    this.loading = true;

    this.taxeservice.getAll().subscribe({

      next: (taxes) => {

        this.taxes = taxes;

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
      '/taxes',
      id,
      'edit'
    ]);
  }

  delete(Taxe: Taxe): void {

    const confirmed = confirm(
      `Supprimer le produit "${Taxe.libelle}" ?`
    );

    if (!confirmed) {
      return;
    }

    this.taxeservice
      .delete(Taxe.id)
      .subscribe({

        next: () => {

          this.toastService.success(
            'Produit supprimé avec succès.'
          );

          this.loadtaxes();

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
