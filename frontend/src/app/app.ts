import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header/header'; // <-- Ruta exacta para tu archivo header.ts

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, HeaderComponent],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App {
  title = 'frontend';

  // Esta función chequea de manera segura si existe una sesión iniciada
  isLoggedIn(): boolean {
    // Si estás usando localStorage para guardar el token del usuario:
    return !!localStorage.getItem('token'); 
    
    // NOTA PARA LA ENTREGA: Si querés ver el Header YA para probar cómo quedó
    // sin tener que loguearte, cambiá temporalmente la línea de arriba por:
    // return true;
  }
}