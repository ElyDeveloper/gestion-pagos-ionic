import { EstadosInterno } from "./estado-aprobacion";
import { Monedas } from "./moneda";
import { Pagos } from "./pago";
import { PeriodosCobro } from "./periodo-cobro";
import { Personas } from "./persona";
import { PlanesPago } from "./plan-pago";
import { Productos } from "./producto";


export interface Prestamos {
  id?: number;
  monto: number;
  tasaInteres: number;
  totalMonto: number;
  fechaSolicitud: string | Date;
  fechaAprobacion?: string | Date;
  estado: boolean;
  idCliente: number;
  idProducto: number;
  idPlan: number;
  idMoneda: number;
  idPeriodoCobro: number;
  idEstadoInterno: number;
  idAval: number;
  idEncrypted?:string;

  // Optional properties for related entities
  cliente?: Personas;
  producto?: Productos;
  planPago?: PlanesPago;
  moneda?: Monedas;
  periodoCobro?: PeriodosCobro;
  estadoInterno?: EstadosInterno;
  aval?: Personas;
  pagos?: Pagos[];

  // Indexer signature for additional properties
  [prop: string]: any;
}
