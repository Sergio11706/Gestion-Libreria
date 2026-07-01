import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { Empleado } from '../../../models/usuario.model';

@Component({
  selector: 'app-panel-empleado',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './panel-empleado.html',
  styleUrls: ['./panel-empleado.css'],
})
export class PanelEmpleado implements OnInit {
  empleado: Empleado | null = null;
  recienCreado = false;
  esVistaEncargado = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const state = history.state as { empleado?: Empleado; recienCreado?: boolean };

    if (state?.empleado) {
      this.empleado = state.empleado;
      this.recienCreado = !!state.recienCreado;
      this.esVistaEncargado = this.authService.isEncargadoLoggedIn();
      this.cdr.markForCheck();
      return;
    }

    if (this.authService.isEmpleadoLoggedIn()) {
      this.empleado = this.authService.getEmpleado();
      this.cdr.markForCheck();
      return;
    }

    this.router.navigate(['/login']);
  }

  cerrarSesion(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
