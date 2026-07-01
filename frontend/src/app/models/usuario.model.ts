export interface Uusario {
  id_usuario: number;
  nombre_usuario: string;
  contraseña: string;
}

export class Encargado implements Uusario {
  id_usuario: number
  nombre_usuario: string;
  contraseña: string;
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;

  constructor(
    id_usuario: number,
    nombre_usuario: string,
    contraseña: string,
    nombre: string,
    apellido: string,
    email: string,
    telefono: string
  ) 
  {
    this.id_usuario = id_usuario;
    this.nombre_usuario = nombre_usuario;
    this.contraseña = contraseña;
    this.nombre = nombre;
    this.apellido = apellido;
    this.email = email;
    this.telefono = telefono;
  }
}

export class Empleado implements Uusario {
  id_usuario: number
  nombre_usuario: string;
  contraseña: string;
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;

  constructor(
    id_usuario: number,
    nombre_usuario: string,
    contraseña: string,
    nombre: string,
    apellido: string,
    email: string,
    telefono: string
  ) 
  {
    this.id_usuario = id_usuario;
    this.nombre_usuario = nombre_usuario;
    this.contraseña = contraseña;
    this.nombre = nombre;
    this.apellido = apellido;
    this.email = email;
    this.telefono = telefono;
  }
}
