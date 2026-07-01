import { ChangeDetectorRef, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';
import { AuthService } from '../../../services/auth.service';
import { obtenerMensajeError } from '../../../utils/http-error.util';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
})
export class Login {
  nombreUsuario = '';
  password = '';
  recordarme = false;
  cargando = false;
  errorMensaje = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  get subtitulo(): string {
    return 'Acceso al sistema';
  }

  iniciarSesion(form: NgForm): void {
    this.errorMensaje = '';

    if (form.invalid) {
      form.control.markAllAsTouched();
      this.cdr.markForCheck();
      return;
    }

    this.cargando = true;
    this.cdr.markForCheck();

    const credentials = {
      nombre_usuario: this.nombreUsuario.trim(),
      contraseña: this.password
    };

    this.authService.login(credentials, this.recordarme).pipe(
      finalize(() => {
        this.cargando = false;
        this.cdr.markForCheck();
      })
    ).subscribe({
      next: () => {
        const sesion = this.authService.getSesion();
        const destino = sesion?.rol === 'empleado' ? '/libros' : '/empleados';
        this.router.navigate([destino]);
      },
      error: (error) => {
        this.errorMensaje = obtenerMensajeError(error, 'No se pudo iniciar sesión. Intente nuevamente.');
        this.cdr.markForCheck();
      }
    });
  }
}
