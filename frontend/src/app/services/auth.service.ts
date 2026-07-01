import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Empleado, Encargado } from '../models/usuario.model';

export interface LoginRequest {
  nombre_usuario: string;
  contraseña: string;
}

export interface UsuarioSesion {
  rol: 'encargado' | 'empleado';
  id_usuario: number;
  nombre_usuario: string;
  encargado?: Encargado;
  empleado?: Empleado;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly loginUrl = '/api/usuarios/validar';
  private readonly storageKey = 'gestion_libreria_usuario';

  constructor(private http: HttpClient) {}

  login(credentials: LoginRequest, recordarme: boolean): Observable<UsuarioSesion> {
    return this.http.post<UsuarioSesion>(this.loginUrl, credentials).pipe(
      tap((usuario) => this.guardarSesion(usuario, recordarme))
    );
  }

  logout(): void {
    localStorage.removeItem(this.storageKey);
    sessionStorage.removeItem(this.storageKey);
  }

  isLoggedIn(): boolean {
    return !!this.getSesion();
  }

  isEncargadoLoggedIn(): boolean {
    return this.getSesion()?.rol === 'encargado';
  }

  isEmpleadoLoggedIn(): boolean {
    return this.getSesion()?.rol === 'empleado';
  }

  getSesion(): UsuarioSesion | null {
    const stored = localStorage.getItem(this.storageKey) ?? sessionStorage.getItem(this.storageKey);
    if (!stored) {
      return null;
    }

    try {
      return JSON.parse(stored) as UsuarioSesion;
    } catch {
      this.logout();
      return null;
    }
  }

  getEncargado() {
    return this.getSesion()?.encargado ?? null;
  }

  getEmpleado(): Empleado | null {
    const empleado = this.getSesion()?.empleado;
    const sesion = this.getSesion();
    if (!empleado || !sesion) {
      return null;
    }

    return {
      ...empleado,
      nombre_usuario: sesion.nombre_usuario
    };
  }

  private guardarSesion(usuario: UsuarioSesion, recordarme: boolean): void {
    const serialized = JSON.stringify(usuario);
    this.logout();
    const storage = recordarme ? localStorage : sessionStorage;
    storage.setItem(this.storageKey, serialized);
  }
}
