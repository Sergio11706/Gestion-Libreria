import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isLoggedIn()) {
    return true;
  }

  return router.createUrlTree(['/login']);
};

export const encargadoGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isEncargadoLoggedIn()) {
    return true;
  }

  if (authService.isEmpleadoLoggedIn()) {
    return router.createUrlTree(['/libros']);
  }

  return router.createUrlTree(['/login']);
};

export const empleadoGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isEmpleadoLoggedIn()) {
    return true;
  }

  const state = history.state as { empleado?: unknown };
  if (state?.empleado && authService.isEncargadoLoggedIn()) {
    return true;
  }

  return router.createUrlTree(['/login']);
};

export const loginGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isEncargadoLoggedIn()) {
    return router.createUrlTree(['/empleados']);
  }

  if (authService.isEmpleadoLoggedIn()) {
    return router.createUrlTree(['/libros']);
  }

  return true;
};

export const empleadoLoginGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isEmpleadoLoggedIn()) {
    return router.createUrlTree(['/libros']);
  }

  if (authService.isEncargadoLoggedIn()) {
    return router.createUrlTree(['/empleados']);
  }

  return true;
};