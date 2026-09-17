import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import {
  Taxe,
  TaxeCreate,
  TaxeUpdate
} from '../models/Taxe.model';

@Injectable({
  providedIn: 'root'
})
export class TaxeService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/taxes`;

  getAll(): Observable<Taxe[]> {
    return this.http.get<Taxe[]>(this.apiUrl);
  }

  getById(id: number): Observable<Taxe> {
    return this.http.get<Taxe>(`${this.apiUrl}/${id}`);
  }

  create(dto: TaxeCreate): Observable<Taxe> {
    return this.http.post<Taxe>(this.apiUrl, dto);
  }

  update(id: number, dto: TaxeUpdate): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, dto);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}