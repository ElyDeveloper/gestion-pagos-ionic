import { Prestamos } from "./prestamo";

export interface ContratosPago {
  id?: number;
  correlativo: string;
  fechaGeneracion: string;
  contenido: string;
  idPrestamo: number;
  idPrestamoEncrypted?: string;

  // Optional property for related entity
  prestamo?: Prestamos;

  // Indexer signature for additional properties
  [prop: string]: any;
}
