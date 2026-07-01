import { Component } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './header.html',
  styleUrls: ['./header.css'],
})
export class Header {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  get esEmpleado(): boolean {
    return this.authService.isEmpleadoLoggedIn();
  }

  get nombreUsuario(): string {
    const encargado = this.authService.getEncargado();
    if (encargado) {
      return `${encargado.nombre} ${encargado.apellido}`;
    }
    const empleado = this.authService.getEmpleado();
    if (empleado) {
      return `${empleado.nombre} ${empleado.apellido}`;
    }
    return 'Usuario';
  }

  cerrarSesion(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}