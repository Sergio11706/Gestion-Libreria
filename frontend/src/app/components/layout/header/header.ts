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

  get nombreEncargado(): string {
    const encargado = this.authService.getEncargado();
    if (!encargado) {
      return 'Encargado';
    }
    return `${encargado.nombre} ${encargado.apellido}`;
  }

  cerrarSesion(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
