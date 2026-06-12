import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Libro {
  id?: number;
  titulo: string;
  autor: string;
  isbn: string;
  editorial?: string;
  categoria?: string;
  precio_costo?: number;
  precio_venta?: number;
  fecha_ingreso?: string;
  tiene_stock_bajo?: boolean;
  stock: number;
}

@Injectable({ providedIn: 'root' })
export class LibrosService {
  private apiUrl = 'http://localhost/api/libros';

  constructor(private http: HttpClient) {}

  registrarLibro(libro: Libro): Observable<unknown> {
    return this.http.post(this.apiUrl, libro);
  }

  getLibros(): Observable<Libro[]> {
    return this.http.get<Libro[]>(this.apiUrl);
  }
}
