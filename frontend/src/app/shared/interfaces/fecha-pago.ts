import { PlanesPago } from "./plan-pago";

export interface FechasPagos {
  id?: number;
  fechaPago: string;
  estado: boolean;
  monto?: number;
  planId: number;

  // Optional property for related entity
  plan?: PlanesPago;

  // Indexer signature for additional properties
  [prop: string]: any;
}