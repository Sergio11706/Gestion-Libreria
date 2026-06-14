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

  constructor(private libroService: LibroService, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.cargarLibros();
  }

  cargarLibros(): void {
    this.libroService.obtenerLibros().subscribe({
      next: (data) => {
        this.libros = data.sort((a, b) => a.titulo.localeCompare(b.titulo));
        this.cargando = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.libros = [];
        this.cargando = false;
        this.cdr.detectChanges()
      }
    });
  }

  toggleFormulario() {
    this.mostrarFormulario = !this.mostrarFormulario;
  }

  onLibroGuardado() {
    this.mostrarFormulario = false;
    this.cargarLibros();
  }
}
