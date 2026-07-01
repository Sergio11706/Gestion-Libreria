import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RegistrarEmpleado } from '../registrar-empleado/registrar-empleado';
import { EmpleadoService } from '../../../services/empleado.service';
import { Empleado } from '../../../models/usuario.model';

@Component({
  selector: 'app-listado-empleados',
  standalone: true,
  imports: [CommonModule, RegistrarEmpleado],
  templateUrl: './listado-empleados.html',
  styleUrls: ['./listado-empleados.css'],
})
export class ListadoEmpleados implements OnInit {
  empleados: Empleado[] = [];
  cargando = true;
  mostrarFormulario = false;
  empleadoEnEdicion: Empleado | null = null;
  errorMsg = '';

  constructor(
    private empleadoService: EmpleadoService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.cargarEmpleados();
  }

  cargarEmpleados(): void {
    this.cargando = true;
    this.errorMsg = '';

    this.empleadoService.obtenerEmpleados().subscribe({
      next: (data) => {
        this.empleados = data;
        this.cargando = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.empleados = [];
        this.cargando = false;
        this.errorMsg = 'No se pudieron cargar los empleados.';
        this.cdr.detectChanges();
      }
    });
  }

  toggleFormulario(): void {
    if (this.mostrarFormulario) {
      this.cerrarFormulario();
    } else {
      this.empleadoEnEdicion = null;
      this.mostrarFormulario = true;
    }
  }

  editarEmpleado(empleado: Empleado): void {
    this.empleadoEnEdicion = { ...empleado };
    this.mostrarFormulario = true;
  }

  cerrarFormulario(): void {
    this.mostrarFormulario = false;
    this.empleadoEnEdicion = null;
  }

  onEmpleadoGuardado(_empleado: Empleado): void {
    this.cerrarFormulario();
    this.cargarEmpleados();
  }

  eliminarEmpleado(empleado: Empleado): void {
    const nombre = `${empleado.nombre} ${empleado.apellido}`;
    if (!confirm(`¿Eliminar al empleado ${nombre}?`)) {
      return;
    }

    this.empleadoService.eliminarEmpleado(empleado.id_usuario).subscribe({
      next: () => this.cargarEmpleados(),
      error: () => {
        this.errorMsg = 'No se pudo eliminar el empleado.';
      }
    });
  }
}
