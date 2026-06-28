import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ValidarIsbnResponse {
  valido: boolean;
  error?: string;
  existe?: boolean | null;
  tipo?: 'ISBN-10' | 'ISBN-13';
  isbn10?: string | null;
  isbn13?: string | null;
  titulo?: string | null;
  autor?: string | null;
  editorial?: string | null;
  portada?: string | null;
}

@Injectable({ providedIn: 'root' })
export class IsbnService {
  private apiUrl = '/api/validar-isbn';

  constructor(private http: HttpClient) {}

  validar(isbn: string): Observable<ValidarIsbnResponse> {
    return this.http.get<ValidarIsbnResponse>(this.apiUrl, { params: { isbn } });
  }
}