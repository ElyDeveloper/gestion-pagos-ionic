import { Pagos } from "./pago";

export interface Vouchers {
  id?: number;
  numeroVoucher: string;
  fechaVoucher: string;
  contenido: string;
  idPago: number;

  // Optional property for related entity
  pagos?: Pagos;

  // Indexer signature for additional properties
  [prop: string]: any;
}
