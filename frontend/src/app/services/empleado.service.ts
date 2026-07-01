import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Empleado } from '../models/usuario.model';

export interface CrearEmpleadoRequest {
  nombre_usuario: string;
  contraseña: string;
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
}

export interface ActualizarEmpleadoRequest {
  nombre_usuario?: string;
  contraseña?: string;
  nombre?: string;
  apellido?: string;
  email?: string;
  telefono?: string;
}

@Injectable({
  providedIn: 'root'
})
export class EmpleadoService {
  private readonly apiUrl = '/api/empleados';

  constructor(private http: HttpClient) {}

  registrarEmpleado(empleado: CrearEmpleadoRequest): Observable<Empleado> {
    return this.http.post<Empleado>(this.apiUrl, empleado);
  }

  obtenerEmpleados(): Observable<Empleado[]> {
    return this.http.get<Empleado[]>(this.apiUrl);
  }

  actualizarEmpleado(id: number, cambios: ActualizarEmpleadoRequest): Observable<Empleado> {
    return this.http.put<Empleado>(`${this.apiUrl}/${id}`, cambios);
  }

  eliminarEmpleado(id: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/${id}`);
  }
}
