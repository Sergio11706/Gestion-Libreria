import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Libro } from '../../../models/libro.model';
import { LibroService } from '../../../services/libro.service';

@Component({
  selector: 'app-actualizar-stock',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './actualizar-stock.component.html',
  styleUrls: ['./actualizar-stock.component.css'],
})
export class ActualizarStockComponent implements OnInit {
  libro: Libro | null = null;
  cargando = false;
  error = '';
  exito = false;

  cantidadADescontar: number | null = null;
  stockResultante: number | null = null;
  mostrandoConfirmacion = false;
  actualizando = false;

  constructor(private libroService: LibroService, private route: ActivatedRoute, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
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

  calcularStockResultante() {
    if (!this.libro) {
      this.error = 'No hay libro cargado.';
      return;
    }

    const cantidad = Number(this.cantidadADescontar);
    if (isNaN(cantidad) || cantidad < 0) {
      this.error = 'Ingresá una cantidad válida para descontar.';
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

    this.actualizando = true;
    this.libroService.actualizarLibro(this.libro.id_libro, { stock: this.stockResultante }).subscribe({
      next: (updated) => {
        this.actualizando = false;
        this.exito = true;
        this.libro = { ...updated };
        this.mostrandoConfirmacion = false;
        this.stockResultante = null;
        this.cantidadADescontar = null;
      },
      error: () => {
        this.actualizando = false;
        this.error = 'No se pudo actualizar el stock.';
      }
    });
  }

  cancelar() {
    this.mostrandoConfirmacion = false;
    this.stockResultante = null;
    this.error = '';
  }
}
