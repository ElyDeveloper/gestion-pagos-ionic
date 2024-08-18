import { Prestamos } from "./prestamo";

export interface Productos {
  id?: number;
  nombre: string;
  descripcion?: string;
  estado: boolean;
  prestamos?: Prestamos[];

  // Indexer signature for additional properties
  [prop: string]: any;
}