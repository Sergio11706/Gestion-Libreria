import { Routes } from '@angular/router';
import { Login } from './components/layout/login/login';
import { MainLayout } from './components/layout/main-layout/main-layout';
import { ListadoLibros } from './components/pages/listado-libros/listado-libros';
import { RegistrarLibro } from './components/pages/registrar-libro/registrar-libro';
import { ActualizarStockComponent } from './components/pages/actualizar-stock/actualizar-stock.component';
import { ListadoEmpleados } from './components/pages/listado-empleados/listado-empleados';
import { PanelEmpleado } from './components/pages/panel-empleado/panel-empleado';
import {
  authGuard,
  encargadoGuard,
  empleadoGuard,
  empleadoLoginGuard,
  loginGuard
} from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: Login, canActivate: [loginGuard], data: { tipoAcceso: 'encargado' } },
  { path: 'empleado/login', component: Login, canActivate: [empleadoLoginGuard], data: { tipoAcceso: 'empleado' } },
  { path: 'empleado/inicio', component: PanelEmpleado, canActivate: [empleadoGuard] },
  {
    path: '',
    component: MainLayout,
    canActivate: [authGuard, encargadoGuard],
    children: [
      { path: 'empleados', component: ListadoEmpleados },
      { path: 'registrar', component: RegistrarLibro },
      { path: 'libros', component: ListadoLibros },
      { path: 'libros/actualizar/:id', component: ActualizarStockComponent },
    ]
  },
];
