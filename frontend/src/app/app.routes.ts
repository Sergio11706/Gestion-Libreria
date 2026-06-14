import { Routes } from '@angular/router';
import { Login } from './components/layout/login/login';
import { ListadoLibros } from './components/pages/listado-libros/listado-libros';
import { RegistrarLibro } from './components/pages/registrar-libro/registrar-libro';
import { ActualizarStockComponent } from './components/pages/actualizar-stock/actualizar-stock.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: Login },
  { path: 'registrar', component: RegistrarLibro },
  { path: 'libros', component: ListadoLibros },
  { path: 'libros/actualizar/:id', component: ActualizarStockComponent },
];