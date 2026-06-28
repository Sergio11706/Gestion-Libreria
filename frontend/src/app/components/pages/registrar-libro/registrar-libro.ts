import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { LibroService } from '../../../services/libro.service';
import { Libro } from '../../../models/libro.model';
import { obtenerMensajeError } from '../../../utils/http-error.util';
import * as ISBN from 'isbn3';

@Component({
  selector: 'app-registrar-libro',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './registrar-libro.html',
  styleUrls: ['./registrar-libro.css'],
})
export class RegistrarLibro implements OnChanges {
  @Input() libroEditar: Libro | null = null;
  @Output() saved = new EventEmitter<Libro>();
  @Output() cancelado = new EventEmitter<void>();

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

  // Estado validación ISBN
  isbnValido: boolean | null = null;   // null = sin validar, true = válido, false = inválido
  isbnMsg = '';                         // mensaje a mostrar bajo el campo

  constructor(private libroService: LibroService) {}

  get esEdicion(): boolean {
    return !!this.libroEditar;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['libroEditar']) {
      if (this.libroEditar) {
        this.cargarLibroParaEditar();
      } else if (!changes['libroEditar'].firstChange) {
        this.limpiarEstado();
      }
    }
  }

  // Se llama en (blur) del campo ISBN y también desde onSubmit
  validarISBN(): boolean {
    const isbn = this.libro.isbn?.toString().trim() ?? '';

    if (!isbn) {
      this.isbnValido = false;
      this.isbnMsg = 'El ISBN es obligatorio.';
      return false;
    }

    const parsed = ISBN.parse(isbn);

    if (!parsed) {
      this.isbnValido = false;
      this.isbnMsg = 'El ISBN no es válido. Revisá que los dígitos sean correctos.';
      return false;
    }

    // isbn3 devuelve el ISBN formateado con guiones correctamente
    const formateado = parsed.isbn13h ?? parsed.isbn10h ?? isbn;

    this.isbnValido = true;
    this.isbnMsg = `ISBN válido ✔ — ${parsed.isIsbn13 ? 'ISBN-13' : 'ISBN-10'}: ${formateado}`;

    // Reemplazar el valor del campo con el ISBN formateado
    this.libro.isbn = formateado;

    return true;
  }

  validarPrecios(): boolean {
    const costo = Number(this.libro.precio_costo);
    const venta = Number(this.libro.precio_venta);

    if (costo < 0 || venta < 0) {
      this.errorMsg = 'Los precios no pueden ser negativos.';
      return false;
    }

    if (venta > 0 && costo > venta) {
      this.errorMsg = 'El precio de venta no puede ser menor al precio de costo.';
      return false;
    }

    return true;
  }

  onSubmit(form: NgForm): void {
    this.errorMsg = '';
    this.exito = false;
    this.libroGuardado = null;

    if (form.invalid) {
      form.control.markAllAsTouched();
      return;
    }

    if (Number(this.libro.stock) < 0) {
      this.errorMsg = 'El stock no puede ser negativo.';
      return;
    }

    // Siempre revalidar al enviar por si el usuario no salió del campo
    if (!this.validarISBN()) {
      return;
    }

    if (!this.validarPrecios()) {
      return;
    }

    if (this.esEdicion) {
      this.actualizarLibro();
    } else {
      this.registrarLibro();
    }
  }

  registrarLibro(): void {
    this.cargando = true;
    this.errorMsg = '';

    this.libroService.registrarLibro(this.prepararPayload()).subscribe({
      next: (savedLibro) => {
        this.cargando = false;
        this.exito = true;
        this.libroGuardado = savedLibro;
        this.limpiarEstado();
        this.saved.emit(savedLibro);
      },
      error: (error) => {
        this.cargando = false;
        this.errorMsg = obtenerMensajeError(error, 'No se pudo registrar el libro');
      }
    });
  }

  actualizarLibro(): void {
    if (!this.libroEditar) return;

    this.cargando = true;
    this.errorMsg = '';

    this.libroService.actualizarLibro(this.libroEditar.id_libro, this.prepararPayload()).subscribe({
      next: (actualizado) => {
        this.cargando = false;
        this.exito = true;
        this.libroGuardado = actualizado;
        this.saved.emit(actualizado);
      },
      error: (error) => {
        this.cargando = false;
        this.errorMsg = obtenerMensajeError(error, 'No se pudo actualizar el libro');
      }
    });
  }

  onReset(form: NgForm): void {
    if (this.esEdicion) {
      this.cargarLibroParaEditar();
      form.resetForm(this.libro);
    } else {
      this.limpiarEstado();
      form.resetForm(this.libro);
    }
  }

  cancelarEdicion(): void {
    this.cancelado.emit();
  }

  private prepararPayload(): Omit<Libro, 'id_libro'> {
    const stock = Number(this.libro.stock) || 0;
    return {
      ...this.libro,
      titulo: this.libro.titulo.trim(),
      autor: this.libro.autor.trim(),
      isbn: this.libro.isbn.trim(),
      editorial: this.libro.editorial?.trim() ?? '',
      categoria: this.libro.categoria?.trim() ?? '',
      precio_costo: Number(this.libro.precio_costo) || 0,
      precio_venta: Number(this.libro.precio_venta) || 0,
      fecha_ingreso: this.libro.fecha_ingreso || this.hoy,
      tiene_stock_bajo: stock < 5,
      stock,
    };
  }

  private cargarLibroParaEditar(): void {
    if (!this.libroEditar) return;
    this.errorMsg = '';
    this.exito = false;
    this.libroGuardado = null;
    this.isbnValido = true;
    this.isbnMsg = '';
    this.libro = {
      titulo: this.libroEditar.titulo,
      autor: this.libroEditar.autor,
      isbn: this.libroEditar.isbn,
      editorial: this.libroEditar.editorial ?? '',
      categoria: this.libroEditar.categoria ?? '',
      precio_costo: this.libroEditar.precio_costo,
      precio_venta: this.libroEditar.precio_venta,
      fecha_ingreso: this.libroEditar.fecha_ingreso || this.hoy,
      tiene_stock_bajo: this.libroEditar.tiene_stock_bajo,
      stock: this.libroEditar.stock,
    };
  }

  private limpiarEstado(): void {
    this.errorMsg = '';
    this.exito = false;
    this.libroGuardado = null;
    this.isbnValido = null;
    this.isbnMsg = '';
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