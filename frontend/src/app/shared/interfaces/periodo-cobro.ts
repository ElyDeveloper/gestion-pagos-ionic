import { Prestamos } from "./prestamo";

export interface PeriodosCobro {
  id?: number;
  nombre: string;
  descripcion: string;
  prestamos?: Prestamos[];

  // Indexer signature for additional properties
  [prop: string]: any;
}
