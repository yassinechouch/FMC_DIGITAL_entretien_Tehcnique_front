import {
  Component,
  OnInit,
  inject,
  ChangeDetectorRef
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';

import {
  FormArray,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import {
  ActivatedRoute,
  Router
} from '@angular/router';

import { Client } from '../../../core/models/client.model';
import { Product } from '../../../core/models/product.model';
import { OrderCreate } from '../../../core/models/order.model';

import { ClientService } from '../../../core/services/client.service';
import { ProductService } from '../../../core/services/product.service';
import { OrderService } from '../../../core/services/order.service';
import { ToastService } from '../../../core/services/toast.service';

type OrderLineForm = FormGroup<{
  productId: FormControl<number>;
  quantite: FormControl<number>;
}>;

@Component({
  selector: 'app-order-form',
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './order-form.html',
  styleUrl: './order-form.scss'
})
export class OrderForm implements OnInit {

  private readonly route =
    inject(ActivatedRoute);

  private readonly router =
    inject(Router);

  private readonly clientService =
    inject(ClientService);

  private readonly productService =
    inject(ProductService);

  private readonly orderService =
    inject(OrderService);

  private readonly toastService =
    inject(ToastService);

  private readonly cdr =
    inject(ChangeDetectorRef);

  clients: Client[] = [];
  products: Product[] = [];

  orderId?: number;

  loading = false;

  readonly form = new FormGroup({

    numeroCommande: new FormControl('', {
      nonNullable: true,
      validators: [
        Validators.required
      ]
    }),

    clientId: new FormControl(0, {
      nonNullable: true,
      validators: [
        Validators.min(1)
      ]
    }),

    lignes:
      new FormArray<OrderLineForm>([])
  });

  get lignes(): FormArray<OrderLineForm> {
    return this.form.controls.lignes;
  }

  ngOnInit(): void {

    this.loadReferenceData();

    const id =
      this.route.snapshot.paramMap.get('id');

    if (id) {

      this.orderId =
        Number(id);

      this.loadOrder(
        this.orderId
      );

    } else {

      this.addLine();
    }
  }

  private loadReferenceData(): void {

    this.clientService
      .getAll()
      .subscribe({

        next: (clients) => {

          this.clients = clients;

          this.cdr.detectChanges();
        },

        error: () => {

          this.toastService.error(
            'Impossible de charger les clients.'
          );

          this.cdr.detectChanges();
        }
      });

    this.productService
      .getAll()
      .subscribe({

        next: (products) => {

          this.products = products;

          this.cdr.detectChanges();
        },

        error: () => {

          this.toastService.error(
            'Impossible de charger les produits.'
          );

          this.cdr.detectChanges();
        }
      });
  }

  private loadOrder(id: number): void {

    this.loading = true;

    this.orderService
      .getById(id)
      .subscribe({

        next: (order) => {

          this.form.patchValue({
            numeroCommande:
              order.numeroCommande,

            clientId:
              order.clientId
          });

          this.lignes.clear();

          order.lignes.forEach(
            (line) => {

              this.lignes.push(
                this.createLineForm(
                  line.productId,
                  line.quantite
                )
              );
            }
          );

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

  private createLineForm(
    productId: number = 0,
    quantite: number = 1
  ): OrderLineForm {

    return new FormGroup({

      productId:
        new FormControl(productId, {
          nonNullable: true,
          validators: [
            Validators.min(1)
          ]
        }),

      quantite:
        new FormControl(quantite, {
          nonNullable: true,
          validators: [
            Validators.min(1)
          ]
        })
    });
  }

  addLine(): void {

    this.lignes.push(
      this.createLineForm()
    );
  }

  removeLine(index: number): void {

    if (this.lignes.length <= 1) {
      return;
    }

    this.lignes.removeAt(index);
  }

  getProduct(
    productId: number
  ): Product | undefined {

    return this.products.find(
      product =>
        product.id ===
        Number(productId)
    );
  }

  getLineTotal(
    index: number
  ): number {

    const line =
      this.lignes.at(index);

    const productId =
      line.controls.productId.value;

    const quantite =
      line.controls.quantite.value;

    const product =
      this.getProduct(productId);

    if (!product) {
      return 0;
    }

    return (
      product.prixUnitaireHT *
      quantite
    );
  }

  get totalHT(): number {

    return this.lignes.controls.reduce(
      (total, _, index) =>
        total +
        this.getLineTotal(index),
      0
    );
  }

  get totalTVA(): number {
    return this.totalHT * 0.19;
  }

  get totalTTC(): number {
    return this.totalHT * 1.19;
  }

  submit(): void {

    if (
      this.form.invalid ||
      this.lignes.length === 0
    ) {

      this.form.markAllAsTouched();

      return;
    }

    const raw =
      this.form.getRawValue();

    const dto: OrderCreate = {

      numeroCommande:
        raw.numeroCommande,

      clientId:
        raw.clientId,

      lignes:
        raw.lignes.map(
          line => ({
            productId:
              line.productId,

            quantite:
              line.quantite
          })
        )
    };

    this.loading = true;

    if (this.orderId) {

      this.updateOrder(
        this.orderId,
        dto
      );

    } else {

      this.createOrder(dto);
    }
  }

  private createOrder(
    dto: OrderCreate
  ): void {

    this.orderService
      .create(dto)
      .subscribe({

        next: () => {

          this.toastService.success(
            'Commande créée avec succès.'
          );

          this.router.navigate([
            '/orders'
          ]);
        },

        error: (
          error: HttpErrorResponse
        ) => {

          this.loading = false;

          this.toastService.error(
            this.getErrorMessage(
              error,
              'Impossible de créer la commande.'
            )
          );

          this.cdr.detectChanges();
        }
      });
  }

  private updateOrder(
    id: number,
    dto: OrderCreate
  ): void {

    this.orderService
      .update(id, dto)
      .subscribe({

        next: () => {

          this.toastService.success(
            'Commande modifiée avec succès.'
          );

          this.router.navigate([
            '/orders'
          ]);
        },

        error: (
          error: HttpErrorResponse
        ) => {

          this.loading = false;

          this.toastService.error(
            this.getErrorMessage(
              error,
              'Impossible de modifier la commande.'
            )
          );

          this.cdr.detectChanges();
        }
      });
  }

  private getErrorMessage(
    error: HttpErrorResponse,
    defaultMessage: string
  ): string {

    return (
      error.error?.message ??
      defaultMessage
    );
  }

  cancel(): void {

    this.router.navigate([
      '/orders'
    ]);
  }
}