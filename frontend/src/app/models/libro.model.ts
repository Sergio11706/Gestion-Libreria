export interface Libro {
  id_libro: number;
  titulo: string;
  autor: string;
  isbn: string;
  editorial: string;
  categoria: string;
  precio_costo: number;
  precio_venta: number;
  fecha_ingreso: string; // YYYY-MM-DD
  tiene_stock_bajo: boolean;
  stock: number;
}
