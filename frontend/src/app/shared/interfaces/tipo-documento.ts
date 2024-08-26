import { DocumentosTipoDoc } from "./documento-tipo-doc";

export interface TipoDocumentos {
  id?: number;
  descripcion: string;

  // Optional property for related entities
  documentosTipoDocs?: DocumentosTipoDoc[];

  // Indexer signature for additional properties
  [prop: string]: any;
}
