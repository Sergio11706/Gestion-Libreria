import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { RegistrarLibro } from '../registrar-libro/registrar-libro';
import { ActualizarStockComponent } from '../actualizar-stock/actualizar-stock.component';
import { LibroService } from '../../../services/libro.service';
import { Libro } from '../../../models/libro.model';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-listado-libros',
  standalone: true,
  imports: [CommonModule, FormsModule, RegistrarLibro, ActualizarStockComponent, RouterModule],
  templateUrl: './listado-libros.html',
  styleUrls: ['./listado-libros.css'],
})
export class ListadoLibros implements OnInit {
  libros: Libro[] = [];
  cargando = true;
  mostrarFormulario = false;
  mostrarStock = false;
  libroEnEdicion: Libro | null = null;
  libroParaStock: Libro | null = null;
  mostrarModalEliminar = false;
  libroAEliminar: Libro | null = null;

  criterioActual: keyof Libro = 'titulo';
  ordenAscendente: boolean = true;
  filtroTitulo = '';
  filtroAutor = '';
  filtroCategoria = '';

  constructor(
    private libroService: LibroService,
    private cdr: ChangeDetectorRef,
    private authService: AuthService
  ) {}

  get esEmpleado(): boolean {
    return this.authService.isEmpleadoLoggedIn();
  }

  ngOnInit() {
    this.cargarLibros();
  }

  cargarLibros(): void {
    this.libroService.obtenerLibros().subscribe({
      next: (data) => {
        this.libros = data;
        this.aplicarOrdenamiento(); 
        this.cargando = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.libros = [];
        this.cargando = false;
        this.cdr.detectChanges();
      }
    });
  }

  ordenarLibros(criterio: keyof Libro): void {
    if (this.criterioActual === criterio) {
      this.ordenAscendente = !this.ordenAscendente;
    } else {
      this.criterioActual = criterio;
      this.ordenAscendente = true;
    }
    
    this.aplicarOrdenamiento();
  }

get librosFiltrados(): Libro[] {
    const titulo = this.filtroTitulo.trim().toLowerCase();
    const autor = this.filtroAutor.trim().toLowerCase();
    const categoria = this.filtroCategoria.trim().toLowerCase();

    const filtrados = this.libros.filter((libro) => {
      const coincideTitulo = !titulo || (libro.titulo || '').toLowerCase().includes(titulo);
      const coincideAutor = !autor || (libro.autor || '').toLowerCase().includes(autor);
      const coincideCategoria = !categoria || (libro.categoria || '').toLowerCase().includes(categoria);
      return coincideTitulo && coincideAutor && coincideCategoria;
    });

    return [...filtrados].sort((a, b) => {
      if (a.tiene_stock_bajo !== b.tiene_stock_bajo) {
        return a.tiene_stock_bajo ? -1 : 1;
      }

      const valorA = String(a[this.criterioActual] || '').toLowerCase();
      const valorB = String(b[this.criterioActual] || '').toLowerCase();

      if (this.ordenAscendente) {
        return valorA.localeCompare(valorB);
      }

      return valorB.localeCompare(valorA);
    });
  }

  private aplicarOrdenamiento(): void {
    this.libros.sort((a, b) => {
      const valorA = String(a[this.criterioActual] || '').toLowerCase();
      const valorB = String(b[this.criterioActual] || '').toLowerCase();

      if (this.ordenAscendente) {
        return valorA.localeCompare(valorB);
      } else {
        return valorB.localeCompare(valorA);
      }
    });
  }

  toggleFormulario() {
    if (this.mostrarFormulario) {
      this.cerrarFormulario();
    } else {
      this.libroEnEdicion = null;
      this.mostrarFormulario = true;
    }
  }

  editarLibro(libro: Libro, event: Event): void {
    event.stopPropagation();
    event.preventDefault();
    this.mostrarStock = false;
    this.libroParaStock = null;
    this.libroEnEdicion = { ...libro };
    this.mostrarFormulario = true;
  }

  abrirStock(libro: Libro, event: Event): void {
    event.stopPropagation();
    event.preventDefault();
    this.mostrarFormulario = false;
    this.libroEnEdicion = null;
    this.libroParaStock = { ...libro };
    this.mostrarStock = true;
  }

  cerrarFormulario(): void {
    this.mostrarFormulario = false;
    this.mostrarStock = false;
    this.libroEnEdicion = null;
    this.libroParaStock = null;
  }

  eliminarLibro(libro: Libro, event: Event): void {
    event.stopPropagation();
    event.preventDefault();
    this.libroAEliminar = libro;
    this.mostrarModalEliminar = true;
  }

  confirmarEliminacion(): void {
    if (!this.libroAEliminar) {
      return;
    }

    this.libroService.eliminarLibro(this.libroAEliminar.id_libro).subscribe({
      next: () => {
        this.mostrarModalEliminar = false;
        this.libroAEliminar = null;
        this.cargarLibros();
      },
      error: () => {
        this.mostrarModalEliminar = false;
        this.libroAEliminar = null;
        alert('No se pudo eliminar el libro.');
      }
    });
  }

  cancelarEliminacion(): void {
    this.mostrarModalEliminar = false;
    this.libroAEliminar = null;
  }

  onLibroGuardado() {
    this.cargarLibros();
  }

  onStockActualizado(): void {
    this.cargarLibros();
  }
}