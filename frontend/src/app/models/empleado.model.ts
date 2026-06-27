export interface Empleado {
  id_usuario: number;
  nombre_usuario?: string;
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
}

export interface CrearEmpleadoRequest {
  nombre_usuario: string;
  contraseña: string;
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
}

export interface ActualizarEmpleadoRequest {
  nombre_usuario?: string;
  contraseña?: string;
  nombre?: string;
  apellido?: string;
  email?: string;
  telefono?: string;
}
