import { Clientes } from "./cliente";
import { EstadosAprobacion } from "./estado-aprobacion";
import { Monedas } from "./moneda";
import { PeriodosCobro } from "./periodo-cobro";
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
  idPeriodoCobro: number;
  idEstadoAprobacion: number;
  idPlan: number;
  idMoneda: number;

  // Optional: include related objects if needed
  cliente?: Clientes;
  producto?: Productos;
  periodo?: PeriodosCobro;
  estadoAprobacion?: EstadosAprobacion;
  planPago?: PlanesPago;
  moneda?: Monedas;

  // Indexer signature for additional properties
  [prop: string]: any;
}
