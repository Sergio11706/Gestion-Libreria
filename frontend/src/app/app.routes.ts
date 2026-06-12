import { Routes } from '@angular/router';
import { Login } from './components/layout/login/login';
import { RegistrarLibroComponent } from './components/registrar-libro/registrar-libro.component';
import { ActualizarStockComponent } from './components/actualizar-stock/actualizar-stock.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: Login },
  { path: 'registrar-libro', component: RegistrarLibroComponent }, 
  { path: 'actualizar-stock', component: ActualizarStockComponent },
];