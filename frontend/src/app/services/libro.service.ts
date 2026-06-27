import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Libro } from '../models/libro.model';

@Injectable({
  providedIn: 'root'
})
export class LibroService {
  private apiUrl = '/api/libros';

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
}
