import { Clientes } from "./cliente";
import { Cuotas } from "./cuotas";
import { Pagos } from "./pago";

export interface Prestamos {
  id?: number;
  monto: number;
  tasaInteres: number;
  totalMonto: number;
  fechaInicial: string;
  fechaFinal: string;
  estado: boolean;
  IdCliente: number;
  IdTipoPrestamo: number;
  IdCuotas: number;
  pagos?: Pagos[];
  cliente?: Clientes;
  tipoPrestamo?: Prestamos;
  cuotas?: Cuotas;
  [prop: string]: any;
}
