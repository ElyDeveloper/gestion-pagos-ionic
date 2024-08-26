import { Documentos } from "./documento";
import { Pagos } from "./pago";
import { TipoDocumentos } from "./tipo-documento";


export interface DocumentosTipoDoc {
  id?: number;
  idTipoDocumento: number;
  idDocumento: number;

  // Optional properties for related entities
  tipoDocumentos?: TipoDocumentos;
  pagos?: Pagos;
  documentos?: Documentos[];

  // Indexer signature for additional properties
  [prop: string]: any;
}