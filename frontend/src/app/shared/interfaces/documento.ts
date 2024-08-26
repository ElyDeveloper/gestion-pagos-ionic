import { DocumentosTipoDoc } from "./documento-tipo-doc";

export interface Documentos {
  id?: number;
  urlDocumento?: string;
  fechaSubida: string;
  idDocTipDoc: number;

  // Optional property for related entity
  documentosTipoDoc?: DocumentosTipoDoc;

  // Indexer signature for additional properties
  [prop: string]: any;
}
