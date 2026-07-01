import { Routes } from '@angular/router';
import { Login } from './components/layout/login/login';
import { MainLayout } from './components/layout/main-layout/main-layout';
import { ListadoLibros } from './components/pages/listado-libros/listado-libros';
import { RegistrarLibro } from './components/pages/registrar-libro/registrar-libro';
import { ActualizarStockComponent } from './components/pages/actualizar-stock/actualizar-stock.component';
import { ListadoEmpleados } from './components/pages/listado-empleados/listado-empleados';
import {authGuard, encargadoGuard, loginGuard} from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: Login, canActivate: [loginGuard] },
  {
    path: '',
    component: MainLayout,
    canActivate: [authGuard],
    children: [
      { path: 'empleados', component: ListadoEmpleados, canActivate: [encargadoGuard] },
      { path: 'registrar', component: RegistrarLibro, canActivate: [encargadoGuard] },
      { path: 'libros', component: ListadoLibros },
      { path: 'libros/actualizar/:id', component: ActualizarStockComponent },
    ]
  },
];