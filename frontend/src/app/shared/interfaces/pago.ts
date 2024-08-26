import { DocumentosTipoDoc } from "./documento-tipo-doc";
import { FechasPagos } from "./fecha-pago";
import { Vouchers } from "./voucher";


export interface Pagos {
  id?: number;
  fechaPago: string;
  monto: number;
  estado: boolean;
  idFechaPago: number;
  idPrestamo?: number;

  // Optional properties for related entities
  cuota?: FechasPagos;
  vouchers?: Vouchers[];
  documentosTipoDocs?: DocumentosTipoDoc[];

  // Indexer signature for additional properties
  [prop: string]: any;
}

