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
  ClientService
} from '../../../core/services/client.service';

import {
  ToastService
} from '../../../core/services/toast.service';

@Component({
  selector: 'app-client-form',
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './client-form.html',
  styleUrl: './client-form.scss'
})
export class ClientForm implements OnInit {

  private readonly fb = inject(FormBuilder);

  private readonly route = inject(ActivatedRoute);

  private readonly router = inject(Router);

  private readonly clientService = inject(ClientService);

  private readonly toastService = inject(ToastService);

  private readonly cdr = inject(ChangeDetectorRef);

  clientId?: number;

  loading = false;

  readonly form = this.fb.nonNullable.group({

    nom: [
      '',
      Validators.required
    ],

    prenomOuRaisonSociale: [
      '',
      Validators.required
    ],

    email: [
      '',
      [
        Validators.required,
        Validators.email
      ]
    ],

    telephone: [
      '',
      Validators.required
    ],

    adresses: this.fb.array([
      this.createAdresseControl()
    ])

  });


  ngOnInit(): void {

    const id =
      this.route.snapshot.paramMap.get('id');

    if (id) {

      this.clientId =
        Number(id);

      this.loadClient(
        this.clientId
      );
    }
  }


  // =========================
  // ADRESSES
  // =========================

  get adresses() {
    return this.form.controls.adresses;
  }


  private createAdresseControl() {

    return this.fb.nonNullable.control(
      '',
      Validators.required
    );
  }


  addAdresse(): void {

    this.adresses.push(
      this.createAdresseControl()
    );
  }


  removeAdresse(index: number): void {

    // Au moins une adresse
    if (this.adresses.length === 1) {
      return;
    }

    this.adresses.removeAt(index);
  }


  // =========================
  // LOAD CLIENT
  // =========================

  private loadClient(
    id: number
  ): void {

    this.loading = true;

    this.clientService
      .getById(id)
      .subscribe({

        next: (client) => {

          this.form.patchValue({

            nom:
              client.nom,

            prenomOuRaisonSociale:
              client.prenomOuRaisonSociale,

            email:
              client.email,

            telephone:
              client.telephone

          });


          // Supprimer les anciennes lignes
          this.adresses.clear();


          // Ajouter les adresses du client
          if (
            client.adresses &&
            client.adresses.length > 0
          ) {

            client.adresses.forEach(
              adresse => {

                this.adresses.push(
                  this.fb.nonNullable.control(
                    adresse,
                    Validators.required
                  )
                );

              }
            );

          } else {

            // Toujours au moins une adresse
            this.adresses.push(
              this.createAdresseControl()
            );

          }


          this.loading = false;

          this.cdr.detectChanges();
        },

        error: () => {

          this.loading = false;

          this.toastService.error(
            'Client introuvable.'
          );

          this.cdr.detectChanges();
        }

      });
  }


  // =========================
  // SUBMIT
  // =========================

  submit(): void {

    if (this.form.invalid) {

      this.form.markAllAsTouched();

      return;
    }


    const value =
      this.form.getRawValue();


    const dto = {

      nom:
        value.nom,

      prenomOuRaisonSociale:
        value.prenomOuRaisonSociale,

      email:
        value.email,

      telephone:
        value.telephone,

      adresses:
        value.adresses

    };


    this.loading = true;


    if (this.clientId) {

      this.updateClient(dto);

    } else {

      this.createClient(dto);
    }
  }


  // =========================
  // CREATE
  // =========================

  private createClient(
    dto: {
      nom: string;
      prenomOuRaisonSociale: string;
      email: string;
      telephone: string;
      adresses: string[];
    }
  ): void {

    this.clientService
      .create(dto)
      .subscribe({

        next: () => {

          this.toastService.success(
            'Client ajouté avec succès.'
          );

          this.router.navigate([
            '/clients'
          ]);
        },

        error: (
          error: HttpErrorResponse
        ) => {

          this.loading = false;

          const message =
            (error.error as any)?.message ??
            'Une erreur est survenue lors de la création du client.';

          this.toastService.error(
            message
          );

          this.cdr.detectChanges();
        }

      });
  }


  // =========================
  // UPDATE
  // =========================

  private updateClient(
    dto: {
      nom: string;
      prenomOuRaisonSociale: string;
      email: string;
      telephone: string;
      adresses: string[];
    }
  ): void {

    if (!this.clientId) {
      return;
    }


    this.clientService
      .update(
        this.clientId,
        dto
      )
      .subscribe({

        next: () => {

          this.toastService.success(
            'Client modifié avec succès.'
          );

          this.router.navigate([
            '/clients'
          ]);
        },

        error: (
          error: HttpErrorResponse
        ) => {

          this.loading = false;

          const message =
            (error.error as any)?.message ??
            'Une erreur est survenue lors de la modification du client.';

          this.toastService.error(
            message
          );

          this.cdr.detectChanges();
        }

      });
  }


  // =========================
  // CANCEL
  // =========================

  cancel(): void {

    this.router.navigate([
      '/clients'
    ]);
  }

}