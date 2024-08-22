export interface RecordCrediticio {
  id?: number;
  codigo: string;
  descripcion: string;
  rangoInicio: number;
  rangoFin: number;

  // Indexer signature for additional properties
  [prop: string]: any;
}
