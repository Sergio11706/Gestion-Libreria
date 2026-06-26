import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize } from 'rxjs';
import { AuthService } from '../../../services/auth.service';
import { obtenerMensajeError } from '../../../utils/http-error.util';

export type TipoAcceso = 'encargado' | 'empleado';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
})
export class Login implements OnInit {
  tipoAcceso: TipoAcceso = 'encargado';
  nombreUsuario = '';
  password = '';
  recordarme = false;
  cargando = false;
  errorMensaje = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const tipo = this.route.snapshot.data['tipoAcceso'] as TipoAcceso | undefined;
    if (tipo === 'encargado' || tipo === 'empleado') {
      this.tipoAcceso = tipo;
    }
  }

  get subtitulo(): string {
    return this.tipoAcceso === 'encargado'
      ? 'Acceso encargado'
      : 'Acceso empleado';
  }

  cambiarTipo(tipo: TipoAcceso): void {
    if (this.tipoAcceso === tipo || this.cargando) {
      return;
    }

    this.tipoAcceso = tipo;
    this.errorMensaje = '';
    this.cdr.markForCheck();
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

    const login$ = this.tipoAcceso === 'encargado'
      ? this.authService.loginEncargado(credentials, this.recordarme)
      : this.authService.loginEmpleado(credentials, this.recordarme);

    login$.pipe(
      finalize(() => {
        this.cargando = false;
        this.cdr.markForCheck();
      })
    ).subscribe({
      next: () => {
        const destino = this.tipoAcceso === 'encargado' ? '/empleados' : '/empleado/inicio';
        this.router.navigate([destino]);
      },
      error: (error) => {
        this.errorMensaje = obtenerMensajeError(error, 'No se pudo iniciar sesión. Intente nuevamente.');
        this.cdr.markForCheck();
      }
    });
  }
}
