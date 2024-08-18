import { Prestamos } from "./prestamo";

export interface PlanesPago {
  id?: number;
  cuotasPagar: number;
  fechaInicio: string;
  fechaFin?: string;
  diaCobro: number;
  cuotaPagadas: number;
  estado: boolean;
  prestamos?: Prestamos[];

  // Indexer signature for additional properties
  [prop: string]: any;
}