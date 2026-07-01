import { Component, OnInit, OnChanges, SimpleChanges, ChangeDetectorRef, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Libro } from '../../../models/libro.model';
import { LibroService } from '../../../services/libro.service';

@Component({
  selector: 'app-actualizar-stock',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './actualizar-stock.component.html',
  styleUrls: ['./actualizar-stock.component.css'],
})
export class ActualizarStockComponent implements OnInit, OnChanges {
  @Input() libroInicial: Libro | null = null;
  @Output() cerrado = new EventEmitter<void>();
  @Output() actualizado = new EventEmitter<void>();

  libro: Libro | null = null;
  cargando = false;
  error = '';
  exito = false;

  cantidadADescontar: number | null = null;
  stockResultante: number | null = null;
  mostrandoConfirmacion = false;
  actualizando = false;

  constructor(
    private libroService: LibroService,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) {}

  ngOnInit() {
    if (this.libroInicial) {
      this.libro = { ...this.libroInicial };
      return;
    }

    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!id || isNaN(id)) {
      this.error = 'ID de libro inválido en la URL.';
      return;
    }

    this.cargando = true;
    this.libroService.obtenerLibroPorId(id).subscribe({
      next: (libro) => {
        this.cargando = false;
        this.libro = libro;
        this.cdr.detectChanges();
      },
      error: () => {
        this.cargando = false;
        this.error = 'No se pudo cargar el libro. Verificá el ID en la URL.';
        this.cdr.detectChanges();
      }
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['libroInicial'] && !changes['libroInicial'].firstChange && this.libroInicial) {
      this.libro = { ...this.libroInicial };
      this.error = '';
      this.exito = false;
      this.cantidadADescontar = null;
      this.stockResultante = null;
      this.mostrandoConfirmacion = false;
    }
  }

  calcularStockResultante(form: NgForm) {
    if (!this.libro) {
      this.error = 'No hay libro cargado.';
      return;
    }

    if (form.invalid) {
      form.control.markAllAsTouched();
      return;
    }

    const cantidad = Number(this.cantidadADescontar);
    if (cantidad > this.libro.stock) {
      this.error = `No podés descontar más de ${this.libro.stock} unidades.`;
      this.mostrandoConfirmacion = false;
      this.stockResultante = null;
      return;
    }

    this.error = '';
    this.stockResultante = this.libro.stock - cantidad;
    this.mostrandoConfirmacion = true;
  }

actualizarStock() {
  if (!this.libro || this.stockResultante == null) {
    this.error = 'No se encontró el stock resultante para actualizar.';
    return;
  }

  if (this.stockResultante < 0) {
    this.error = 'El stock resultante no puede ser negativo.';
    return;
  }

  this.actualizando = true;

  const payload: any = { stock: this.stockResultante };
  if (this.stockResultante < 5) {
    payload.tiene_stock_bajo = true;
  } else {
    payload.tiene_stock_bajo = false;
  }

  this.libroService.actualizarLibro(this.libro.id_libro, payload).subscribe({
    next: (updated) => {
      this.actualizando = false;
      this.exito = true;
      this.libro = { ...updated };
      this.mostrandoConfirmacion = false;
      this.stockResultante = null;
      this.cantidadADescontar = null;
      this.actualizado.emit();
      this.cdr.detectChanges();
    },
    error: () => {
      this.actualizando = false;
      this.error = 'No se pudo actualizar el stock.';
      this.cdr.detectChanges();
    }
  });
}


  cancelar() {
    this.mostrandoConfirmacion = false;
    this.stockResultante = null;
    this.error = '';
  }

  salirAlListado(): void {
    if (this.router.url === '/libros') {
      this.cerrado.emit();
      return;
    }

    this.router.navigate(['/libros']);
  }
}