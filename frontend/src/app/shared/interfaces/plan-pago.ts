import { Prestamos } from "./prestamo";

export interface PlanesPago {
  id?: number;
  cuotasPagar: number;
  fechaInicio: string | Date;
  fechaFin?: string | Date;
  cuotaPagadas: number;
  estado: boolean;
  prestamos?: Prestamos[];

  // Indexer signature for additional properties
  [prop: string]: any;
}
