import { Component, OnInit, inject, ChangeDetectorRef, } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { Client } from '../../../core/models/client.model';
import { ClientService } from '../../../core/services/client.service';

@Component({
  selector: 'app-client-list',
  imports: [
    CommonModule,
    RouterLink
  ],
  templateUrl: './client-list.html',
  styleUrl: './client-list.scss'
})
export class ClientList implements OnInit {

  private readonly clientService = inject(ClientService);
  private readonly router = inject(Router);
private readonly cdr = inject(ChangeDetectorRef);
  clients: Client[] = [];
successMessage = '';
  loading = true;
  errorMessage = '';

  ngOnInit(): void {
  const state = history.state;
  if (state?.successMessage) {
    this.successMessage =
      state.successMessage;
  }

    this.loadClients();
    
  }

  loadClients(): void {
    this.loading = true;
    this.errorMessage = '';

    this.clientService.getAll().subscribe({
      next: clients => {
        this.clients = clients;
        console.log(clients);
        this.loading = false;
         this.cdr.markForCheck();
        console.log(this.loading);
      },

      error: () => {
        this.errorMessage =
          'Impossible de charger les clients.';
        this.loading = false;
        this.cdr.markForCheck();
        
      }
    });
  }

  edit(id: number): void {
    this.router.navigate(['/clients', id, 'edit']);
  }

  delete(client: Client): void {
    const confirmed = confirm(
      `Voulez-vous vraiment supprimer ${client.nom} ?`
    );

    if (!confirmed) {
      return;
    }

    this.clientService.delete(client.id).subscribe({
      next: () => {
        this.loadClients();
      },

      error: error => {
        this.errorMessage =
          error?.error?.message ??
          'Impossible de supprimer ce client.';
      }
    });
  }
}