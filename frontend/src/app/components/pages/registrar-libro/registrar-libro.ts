import { ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { LibroService } from '../../../services/libro.service';
import { Libro } from '../../../models/libro.model';
import { obtenerMensajeError } from '../../../utils/http-error.util';
import { firstValueFrom } from 'rxjs';

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
  @Output() cerrado = new EventEmitter<void>();

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

  errorMsg = '';
  exito = false;
  cargando = false;
  libroGuardado: Libro | null = null;

  // Estado validación ISBN
  isbnValido: boolean | null = null;   // null = sin validar, true = válido, false = inválido
  isbnMsg = '';                         // mensaje a mostrar bajo el campo

  constructor(
    private libroService: LibroService,
    private router: Router,
    private cdr: ChangeDetectorRef
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

  // Se llama en (blur) del campo ISBN y también desde onSubmit
  async validarISBN(): Promise<boolean> {
    const isbn = this.libro.isbn?.toString().trim() ?? '';

    if (!isbn) {
      this.isbnValido = false;
      this.isbnMsg = 'El ISBN es obligatorio.';
      return false;
    }

    try {
      const respuesta = await firstValueFrom(this.libroService.validarIsbn(isbn));

      if (!respuesta.valido) {
        this.isbnValido = false;
        this.isbnMsg = respuesta.error ?? 'El ISBN no es válido.';
        return false;
      }

      const formateado = respuesta.isbn13 ?? respuesta.isbn10 ?? isbn;
      this.libro.isbn = formateado;
      this.isbnValido = true;
      this.isbnMsg = `ISBN válido ✔ — ${respuesta.tipo ?? 'ISBN'}: ${formateado}`;
      return true;
    } catch {
      this.isbnValido = false;
      this.isbnMsg = 'No se pudo validar el ISBN en este momento.';
      return false;
    }
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

  async onSubmit(form: NgForm): Promise<void> {
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
    if (!(await this.validarISBN())) {
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
        this.resetearFormulario();
        this.saved.emit(savedLibro);
        this.cdr.detectChanges();
      },
      error: (error) => {
        this.cargando = false;
        this.errorMsg = obtenerMensajeError(error, 'No se pudo registrar el libro');
        this.cdr.detectChanges();
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
        this.cdr.detectChanges();
      },
      error: (error) => {
        this.cargando = false;
        this.errorMsg = obtenerMensajeError(error, 'No se pudo actualizar el libro');
        this.cdr.detectChanges();
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

  salirAlListado(): void {
    if (this.router.url === '/libros') {
      this.cerrado.emit();
      return;
    }

    this.router.navigate(['/libros']);
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

  private resetearFormulario(): void {
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