import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LibrosService, Libro } from '../../services/libros.service';

@Component({
  selector: 'app-actualizar-stock',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './actualizar-stock.component.html',
  styleUrls: ['./actualizar-stock.component.css'],
})
export class ActualizarStockComponent {
  buscarForm: FormGroup;
  stockForm: FormGroup;
  exito = false;
  errorBusqueda = '';
  buscando = false;
  libroEncontrado: Libro | null = null;

  motivos = [
    'Compra a proveedor',
    'Devolución de cliente',
    'Ajuste de inventario',
    'Pérdida o daño',
    'Otro',
  ];

  constructor(private fb: FormBuilder, private librosService: LibrosService) {
    this.buscarForm = this.fb.group({
      titulo: [''],
      isbn: [''],
    });

    this.stockForm = this.fb.group({
      stock: [null, [Validators.required, Validators.min(0)]],
      motivo: [''],
    });
  }

  get b() { return this.buscarForm.controls; }
  get f() { return this.stockForm.controls; }

  buscar() {
    const titulo = (this.buscarForm.value.titulo as string)?.trim();
    const isbn = (this.buscarForm.value.isbn as string)?.trim();

    if (!titulo && !isbn) {
      this.errorBusqueda = 'Ingresá al menos un título o ISBN para buscar.';
      return;
    }

    this.buscando = true;
    this.errorBusqueda = '';
    this.exito = false;
    this.libroEncontrado = null;

    this.librosService.getLibros().subscribe({
      next: (libros) => {
        const tituloLower = titulo.toLowerCase();
        const encontrado = libros.find((l) => {
          const coincideTitulo = !titulo || l.titulo.toLowerCase().includes(tituloLower);
          const coincideIsbn = !isbn || l.isbn === isbn;
          return coincideTitulo && coincideIsbn;
        });

        if (encontrado) {
          this.libroEncontrado = {
            ...encontrado,
            tiene_stock_bajo: encontrado.stock < 5,
          };
          this.stockForm.patchValue({ stock: encontrado.stock, motivo: '' });
        } else {
          this.errorBusqueda = 'No se encontró ningún libro con esos criterios.';
        }
        this.buscando = false;
      },
      error: () => {
        this.errorBusqueda = 'Error al buscar el libro.';
        this.buscando = false;
      },
    });
  }

  guardar() {
    if (this.stockForm.invalid) {
      this.stockForm.markAllAsTouched();
      return;
    }

    const nuevoStock = this.stockForm.value.stock as number;
    this.exito = true;

    if (this.libroEncontrado) {
      this.libroEncontrado = {
        ...this.libroEncontrado,
        stock: nuevoStock,
        tiene_stock_bajo: nuevoStock < 5,
      };
    }
  }

  cancelar() {
    this.libroEncontrado = null;
    this.stockForm.reset();
    this.exito = false;
    this.errorBusqueda = '';
  }
}
