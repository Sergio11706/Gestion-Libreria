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
import { IsbnService, ValidarIsbnResponse } from '../../../services/isbn.service';
import { Libro } from '../../../models/libro.model';
import { obtenerMensajeError } from '../../../utils/http-error.util';

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

  // Estado de la validación de ISBN contra el backend (formato + Google Books)
  validandoIsbn = false;
  isbnValido: boolean | null = null; // null = todavía no se consultó
  isbnInfoMsg = '';

  constructor(
    private libroService: LibroService,
    private isbnService: IsbnService
  ) {}

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

  /**
   * Se dispara al salir del campo ISBN (blur).
   * Valida formato + busca metadatos en Google Books vía el backend.
   * Si el libro existe y los campos están vacíos, autocompleta Título/Autor/Editorial.
   * Nunca bloquea el formulario: si el backend falla o el libro no aparece en Google Books,
   * simplemente no autocompleta nada.
   */
  onIsbnBlur(): void {
    const isbn = this.libro.isbn?.toString().trim() ?? '';
    this.isbnValido = null;
    this.isbnInfoMsg = '';

    if (!isbn) {
      return;
    }

    this.validandoIsbn = true;

    this.isbnService.validar(isbn).subscribe({
      next: (res: ValidarIsbnResponse) => {
        this.validandoIsbn = false;
        this.isbnValido = res.valido;

        if (!res.valido) {
          this.isbnInfoMsg = res.error || 'El formato del ISBN no es válido.';
          return;
        }

        this.isbnInfoMsg = res.existe ? 'ISBN válido — datos encontrados.' : 'ISBN válido.';

        // Autocompletar solo al registrar un libro nuevo (no al editar), y solo campos vacíos
        if (!this.esEdicion) {
          if (!this.libro.titulo && res.titulo) this.libro.titulo = res.titulo;
          if (!this.libro.autor && res.autor) this.libro.autor = res.autor;
          if (!this.libro.editorial && res.editorial) this.libro.editorial = res.editorial;
        }
      },
      error: () => {
        // Falla de red, backend caído, etc. -> no bloqueamos el registro, solo ocultamos el spinner
        this.validandoIsbn = false;
        this.isbnValido = null;
      }
    });
  }

  validarISBN(): boolean {
    const isbn = this.libro.isbn?.toString().trim() ?? '';
    const normalized = isbn.replace(/[-\s]/g, '');
    const isValid = /^(97(8|9))?[0-9]{10}$/.test(normalized) && (normalized.length === 10 || normalized.length === 13);

    if (!isValid) {
      this.errorMsg = 'El formato del ISBN no es válido (10 o 13 dígitos).';
      return false;
    }

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

    const libro = this.prepararPayload();

    this.libroService.registrarLibro(libro).subscribe({
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
    if (!this.libroEditar) {
      return;
    }

    this.cargando = true;
    this.errorMsg = '';

    const cambios = this.prepararPayload();

    this.libroService.actualizarLibro(this.libroEditar.id_libro, cambios).subscribe({
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
    if (!this.libroEditar) {
      return;
    }

    this.errorMsg = '';
    this.exito = false;
    this.libroGuardado = null;
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