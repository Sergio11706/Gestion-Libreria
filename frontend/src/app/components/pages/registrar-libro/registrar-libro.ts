import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { LibroService } from '../../../services/libro.service';
import { Libro } from '../../../models/libro.model';
import { Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-registrar-libro',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './registrar-libro.html',
  styleUrls: ['./registrar-libro.css'],
})
export class RegistrarLibro {
  hoy = new Date().toISOString().slice(0, 10);

  libro: Omit<Libro, 'id_libro'> = {
    titulo: '',
    autor: '',
    isbn: '',
    editorial: '',
    categoria: '',
    precio_costo: 0,
    precio_venta: 0,
    fecha_ingreso: this.hoy,
    tiene_stock_bajo: false,
    stock: 0,
  };

  categorias = ['Ficción', 'No ficción', 'Infantil', 'Académico', 'Ciencia', 'Historia', 'Tecnología'];
  errorMsg = '';
  exito = false;
  cargando = false;
  libroGuardado: Libro | null = null;
  @Output() saved = new EventEmitter<Libro>();

  constructor(private libroService: LibroService) {}

  validarISBN(): boolean {
    const isbn = this.libro.isbn?.toString().trim() ?? '';
    const normalized = isbn.replace(/[-\s]/g, '');
    const isValid = /^(97(8|9))?[0-9]{10}$/.test(normalized) && (normalized.length === 10 || normalized.length === 13);

    if (!isValid) {
      this.errorMsg = 'El formato del ISBN no es válido';
      return false;
    }

    return true;
  }

  onSubmit(form: NgForm) {
    this.errorMsg = '';
    this.exito = false;
    this.libroGuardado = null;

    if (form.invalid) {
      form.control.markAllAsTouched();
      return;
    }

    if (!this.validarISBN()) {
      return;
    }

    this.registrarLibro();
  }

  registrarLibro() {
    this.cargando = true;
    this.errorMsg = '';

    const libro: Omit<Libro, 'id_libro'> = {
      ...this.libro,
      isbn: this.libro.isbn.trim(),
      precio_costo: Number(this.libro.precio_costo) || 0,
      precio_venta: Number(this.libro.precio_venta) || 0,
      fecha_ingreso: this.libro.fecha_ingreso || this.hoy,
      tiene_stock_bajo: this.libro.stock < 5,
      stock: Number(this.libro.stock) || 0,
    };

    this.libroService.registrarLibro(libro).subscribe({
      next: (savedLibro) => {
        this.cargando = false;
        this.exito = true;
        this.libroGuardado = savedLibro;
        this.resetForm();
        this.saved.emit(savedLibro);
      },
      error: (error) => {
        this.cargando = false;
        this.errorMsg = error?.error?.message || 'No se pudo registrar el libro';
      }
    });
  }

  onReset(form: NgForm) {
    this.errorMsg = '';
    this.exito = false;
    this.libroGuardado = null;
    this.resetForm();
    form.resetForm(this.libro);
  }

  private resetForm() {
    this.libro = {
      titulo: '',
      autor: '',
      isbn: '',
      editorial: '',
      categoria: '',
      precio_costo: 0,
      precio_venta: 0,
      fecha_ingreso: this.hoy,
      tiene_stock_bajo: false,
      stock: 0,
    };
  }
}

