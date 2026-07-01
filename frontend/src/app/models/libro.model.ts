export class Libro {
  id_libro: number;
  titulo: string;
  autor: string;
  isbn: string;
  editorial: string;
  categoria: string;
  precio_costo: number;
  precio_venta: number;
  fecha_ingreso: string;
  tiene_stock_bajo: boolean;
  stock: number;

  constructor(
    id_libro: number,
    titulo: string,
    autor: string,
    isbn: string,
    editorial: string,
    categoria: string,
    precio_costo: number,
    precio_venta: number,
    fecha_ingreso: string,
    tiene_stock_bajo: boolean,
    stock: number
  ) {
    this.id_libro = id_libro;
    this.titulo = titulo;
    this.autor = autor;
    this.isbn = isbn;
    this.editorial = editorial;
    this.categoria = categoria;
    this.precio_costo = precio_costo;
    this.precio_venta = precio_venta;
    this.fecha_ingreso = fecha_ingreso;
    this.tiene_stock_bajo = tiene_stock_bajo;
    this.stock = stock;
  }
}