import { Prestamos } from "./prestamo";

export interface Monedas {
  id?: number;
  codigoMoneda: string;
  nombreMoneda: string;
  tipoCambio: number;
  fechaActualizacion: string;
  prestamos?: Prestamos[];

  // Indexer signature for additional properties
  [prop: string]: any;
}