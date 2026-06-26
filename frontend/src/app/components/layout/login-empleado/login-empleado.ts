import { ChangeDetectorRef, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { AuthService } from '../../../services/auth.service';
import { obtenerMensajeError } from '../../../utils/http-error.util';

@Component({
  selector: 'app-login-empleado',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login-empleado.html',
  styleUrls: ['./login-empleado.css'],
})
export class LoginEmpleado {
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

  iniciarSesion(form: NgForm): void {
    this.errorMensaje = '';

    if (form.invalid) {
      form.control.markAllAsTouched();
      this.cdr.markForCheck();
      return;
    }

    this.cargando = true;
    this.cdr.markForCheck();

    this.authService.loginEmpleado(
      {
        nombre_usuario: this.nombreUsuario.trim(),
        contraseña: this.password
      },
      this.recordarme
    ).pipe(
      finalize(() => {
        this.cargando = false;
        this.cdr.markForCheck();
      })
    ).subscribe({
      next: () => {
        this.router.navigate(['/empleado/inicio']);
      },
      error: (error) => {
        this.errorMensaje = obtenerMensajeError(error, 'No se pudo iniciar sesión. Intente nuevamente.');
        this.cdr.markForCheck();
      }
    });
  }
}
