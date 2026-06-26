import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { UsuarioSesion } from '../models/usuario.model';
import { Empleado } from '../models/empleado.model';

export interface LoginRequest {
  nombre_usuario: string;
  contraseña: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly encargadoLoginUrl = '/api/usuarios/validar';
  private readonly empleadoLoginUrl = '/api/usuarios/validar-empleado';
  private readonly storageKey = 'gestion_libreria_usuario';

  constructor(private http: HttpClient) {}

  loginEncargado(credentials: LoginRequest, recordarme: boolean): Observable<UsuarioSesion> {
    return this.http.post<UsuarioSesion>(this.encargadoLoginUrl, credentials).pipe(
      tap((usuario) => this.guardarSesion(usuario, recordarme))
    );
  }

  loginEmpleado(credentials: LoginRequest, recordarme: boolean): Observable<UsuarioSesion> {
    return this.http.post<UsuarioSesion>(this.empleadoLoginUrl, credentials).pipe(
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
