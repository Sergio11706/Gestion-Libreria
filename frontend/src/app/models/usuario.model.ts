export interface Usuario {
  id_usuario: number;
  nombre_usuario: string;
  contraseña: string;
}

export interface Encargado extends Usuario {
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
}

export interface Empleado extends Usuario {
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
}
