import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';
import { EmpleadoService } from '../../../services/empleado.service';
import { ActualizarEmpleadoRequest, CrearEmpleadoRequest, Empleado } from '../../../models/empleado.model';
import { obtenerMensajeError } from '../../../utils/http-error.util';

@Component({
  selector: 'app-registrar-empleado',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './registrar-empleado.html',
  styleUrls: ['./registrar-empleado.css'],
})
export class RegistrarEmpleado implements OnChanges {
  @Input() empleadoEditar: Empleado | null = null;
  @Input() redirigirAlPanel = false;
  @Output() saved = new EventEmitter<Empleado>();
  @Output() cancelado = new EventEmitter<void>();

  empleado = {
    nombre_usuario: '',
    nombre: '',
    apellido: '',
    email: '',
    telefono: ''
  };

  password = '';
  confirmarPassword = '';
  errorMsg = '';
  exito = false;
  cargando = false;
  empleadoGuardado: Empleado | null = null;

  constructor(
    private empleadoService: EmpleadoService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  get esEdicion(): boolean {
    return !!this.empleadoEditar;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['empleadoEditar']) {
      if (this.empleadoEditar) {
        this.cargarEmpleadoParaEditar();
      } else if (!changes['empleadoEditar'].firstChange) {
        this.limpiarEstado();
      }
    }
  }

  onSubmit(form: NgForm): void {
    this.errorMsg = '';
    this.exito = false;
    this.empleadoGuardado = null;

    if (form.invalid) {
      form.control.markAllAsTouched();
      this.cdr.markForCheck();
      return;
    }

    if (!this.esEdicion || this.password || this.confirmarPassword) {
      if (this.password.length < 4) {
        this.errorMsg = 'La contraseña debe tener al menos 4 caracteres.';
        this.cdr.markForCheck();
        return;
      }

      if (this.password !== this.confirmarPassword) {
        this.errorMsg = 'Las contraseñas no coinciden.';
        this.cdr.markForCheck();
        return;
      }
    }

    if (this.esEdicion) {
      this.actualizarEmpleado();
    } else {
      this.registrarEmpleado();
    }
  }

  registrarEmpleado(): void {
    this.cargando = true;
    this.errorMsg = '';
    this.cdr.markForCheck();

    const payload: CrearEmpleadoRequest = {
      nombre_usuario: this.empleado.nombre_usuario.trim(),
      contraseña: this.password,
      nombre: this.empleado.nombre.trim(),
      apellido: this.empleado.apellido.trim(),
      email: this.empleado.email.trim(),
      telefono: this.empleado.telefono.trim()
    };

    this.empleadoService.registrarEmpleado(payload).pipe(
      finalize(() => {
        this.cargando = false;
        this.cdr.markForCheck();
      })
    ).subscribe({
      next: (guardado) => {
        this.exito = true;
        this.empleadoGuardado = guardado;
        this.saved.emit(guardado);

        if (this.redirigirAlPanel) {
          this.router.navigate(['/empleado/inicio'], {
            state: { empleado: guardado, recienCreado: true }
          });
        }
      },
      error: (error) => {
        this.errorMsg = obtenerMensajeError(error, 'No se pudo registrar el empleado');
        this.cdr.markForCheck();
      }
    });
  }

  actualizarEmpleado(): void {
    if (!this.empleadoEditar) {
      return;
    }

    this.cargando = true;
    this.errorMsg = '';
    this.cdr.markForCheck();

    const payload: ActualizarEmpleadoRequest = {
      nombre_usuario: this.empleado.nombre_usuario.trim(),
      nombre: this.empleado.nombre.trim(),
      apellido: this.empleado.apellido.trim(),
      email: this.empleado.email.trim(),
      telefono: this.empleado.telefono.trim()
    };

    if (this.password) {
      payload.contraseña = this.password;
    }

    this.empleadoService.actualizarEmpleado(this.empleadoEditar.id_usuario, payload).pipe(
      finalize(() => {
        this.cargando = false;
        this.cdr.markForCheck();
      })
    ).subscribe({
      next: (actualizado) => {
        this.exito = true;
        this.empleadoGuardado = actualizado;
        this.saved.emit(actualizado);
      },
      error: (error) => {
        this.errorMsg = obtenerMensajeError(error, 'No se pudo actualizar el empleado');
        this.cdr.markForCheck();
      }
    });
  }

  onReset(form: NgForm): void {
    if (this.esEdicion) {
      this.cargarEmpleadoParaEditar();
      form.resetForm({
        ...this.empleado,
        password: '',
        confirmarPassword: ''
      });
    } else {
      this.limpiarEstado();
      form.resetForm({ ...this.empleado, password: '', confirmarPassword: '' });
    }

    this.cdr.markForCheck();
  }

  cancelarEdicion(): void {
    this.cancelado.emit();
  }

  private cargarEmpleadoParaEditar(): void {
    if (!this.empleadoEditar) {
      return;
    }

    this.errorMsg = '';
    this.exito = false;
    this.empleadoGuardado = null;
    this.password = '';
    this.confirmarPassword = '';
    this.empleado = {
      nombre_usuario: this.empleadoEditar.nombre_usuario ?? '',
      nombre: this.empleadoEditar.nombre,
      apellido: this.empleadoEditar.apellido,
      email: this.empleadoEditar.email,
      telefono: this.empleadoEditar.telefono
    };
  }

  private limpiarEstado(): void {
    this.errorMsg = '';
    this.exito = false;
    this.empleadoGuardado = null;
    this.empleado = {
      nombre_usuario: '',
      nombre: '',
      apellido: '',
      email: '',
      telefono: ''
    };
    this.password = '';
    this.confirmarPassword = '';
  }
}
