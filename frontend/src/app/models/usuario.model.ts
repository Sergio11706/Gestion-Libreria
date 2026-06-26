export type RolSesion = 'encargado' | 'empleado';

export interface Encargado {
  id_usuario: number;
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
}

export interface UsuarioSesion {
  rol: RolSesion;
  id_usuario: number;
  nombre_usuario: string;
  encargado?: Encargado;
  empleado?: {
    id_usuario: number;
    nombre: string;
    apellido: string;
    email: string;
    telefono: string;
  };
}
