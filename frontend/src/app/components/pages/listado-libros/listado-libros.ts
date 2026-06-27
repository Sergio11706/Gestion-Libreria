import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { RegistrarLibro } from '../registrar-libro/registrar-libro';
import { LibroService } from '../../../services/libro.service';
import { Libro } from '../../../models/libro.model';

@Component({
  selector: 'app-listado-libros',
  standalone: true,
  imports: [CommonModule, RegistrarLibro, RouterModule],
  templateUrl: './listado-libros.html',
  styleUrls: ['./listado-libros.css'],
})
export class ListadoLibros implements OnInit {
  libros: Libro[] = [];
  cargando = true;
  mostrarFormulario = false;
  libroEnEdicion: Libro | null = null;

  criterioActual: keyof Libro = 'titulo'; 
  ordenAscendente: boolean = true;

  constructor(private libroService: LibroService, private cdr: ChangeDetectorRef) {}

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
    this.libroEnEdicion = { ...libro };
    this.mostrarFormulario = true;
  }

  cerrarFormulario(): void {
    this.mostrarFormulario = false;
    this.libroEnEdicion = null;
  }

  onLibroGuardado() {
    this.cerrarFormulario();
    this.cargarLibros();
  }
}