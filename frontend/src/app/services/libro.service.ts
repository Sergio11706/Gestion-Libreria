import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Libro } from '../models/libro.model';

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

@Injectable({
  providedIn: 'root'
})
export class LibroService {
  private apiUrl = '/api/libros';
  private isbnApiUrl = '/api/validar-isbn';

  constructor(private http: HttpClient) {}

  registrarLibro(libro: Omit<Libro, 'id_libro'>): Observable<Libro> {
    return this.http.post<Libro>(this.apiUrl, libro);
  }

  obtenerLibros(): Observable<Libro[]> {
    return this.http.get<Libro[]>(this.apiUrl);
  }

  obtenerLibroPorId(id: number): Observable<Libro> {
    return this.http.get<Libro>(`${this.apiUrl}/${id}`);
  }

  actualizarLibro(id: number, cambios: Partial<Libro>): Observable<Libro> {
    return this.http.put<Libro>(`${this.apiUrl}/${id}`, cambios);
  }

  eliminarLibro(id: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/${id}`);
  }

  validarIsbn(isbn: string): Observable<ValidarIsbnResponse> {
    return this.http.get<ValidarIsbnResponse>(this.isbnApiUrl, { params: { isbn } });
  }
}
