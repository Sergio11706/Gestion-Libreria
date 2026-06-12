import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-registrar-libro',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './registrar-libro.component.html',
  styleUrls: ['./registrar-libro.component.css'],
})
export class RegistrarLibroComponent {
  form: FormGroup;
  exito = false;
  errorMsg = '';
  cargando = false; // 👈 agregá esta
  hoy = new Date().toISOString().split('T')[0];

  categorias = [
    'Ficción', 'No ficción', 'Ciencia ficción', 'Fantasía',
    'Terror', 'Romance', 'Historia', 'Ciencia', 'Tecnología',
    'Derecho', 'Economía', 'Arte', 'Infantil', 'Otro',
  ];

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      titulo:        ['', [Validators.required, Validators.maxLength(255)]],
      autor:         ['', [Validators.required, Validators.maxLength(255)]],
      isbn:          ['', [Validators.required, Validators.pattern(/^[\d\-]{10,17}$/)]],
      editorial:     [''],
      categoria:     [''],
      precio_costo:  [null, [Validators.min(0)]],
      precio_venta:  [null, [Validators.min(0)]],
      stock:         [0,    [Validators.required, Validators.min(0)]],
      fecha_ingreso: [this.hoy],
    });
  }

  get f() { return this.form.controls; }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    // Por ahora solo muestra éxito visualmente
    this.exito = true;
    this.form.reset({ stock: 0, fecha_ingreso: this.hoy });
  }
}