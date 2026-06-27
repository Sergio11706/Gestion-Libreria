import { HttpErrorResponse } from '@angular/common/http';

export function obtenerMensajeError(error: unknown, mensajePorDefecto: string): string {
  if (error instanceof HttpErrorResponse) {
    if (error.status === 401) {
      return error.error?.error ?? 'Usuario o contraseña incorrectos.';
    }

    if (error.status === 409) {
      return error.error?.error ?? 'El registro ya existe.';
    }

    if (error.status === 400) {
      return error.error?.error ?? 'Datos inválidos. Revise el formulario.';
    }

    if (error.status === 0) {
      return 'No se pudo conectar con el servidor.';
    }

    return error.error?.error ?? mensajePorDefecto;
  }

  return mensajePorDefecto;
}
