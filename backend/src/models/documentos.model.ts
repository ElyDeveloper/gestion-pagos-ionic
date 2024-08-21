import { Entity, hasMany, model, property, belongsTo } from '@loopback/repository';
import { DocumentosTipoDoc } from './documentos-tipo-doc.model';

@model({settings: {idInjection: false, mssql: {schema: 'dbo', table: 'Documentos'}}})
export class Documentos extends Entity {
  @property({
    type: 'number',
    jsonSchema: {nullable: false},
    precision: 10,
    scale: 0,
    generated: 1,
    id: 1,
    mssql: {columnName: 'Id', dataType: 'int', dataLength: null, dataPrecision: 10, dataScale: 0, nullable: 'NO', generated: 1},
  })
  id?: number;

  @property({
    type: 'string',
    jsonSchema: {nullable: true},
    length: 1000,
    generated: false,
    mssql: {columnName: 'UrlDocumento', dataType: 'varchar', dataLength: 1000, dataPrecision: null, dataScale: null, nullable: 'YES', generated: false},
  })
  urlDocumento?: string;

  @property({
    type: 'date',
    required: true,
    jsonSchema: {nullable: false},
    generated: false,
    mssql: {columnName: 'FechaSubida', dataType: 'datetime2', dataLength: null, dataPrecision: null, dataScale: null, nullable: 'NO', generated: false},
  })
  fechaSubida: string;

  // Define well-known properties here
  @belongsTo(() => DocumentosTipoDoc, {name: 'documentosTipoDoc'})
  idDocTipDoc: number;

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<Documentos>) {
    super(data);
  }
}

export interface DocumentosRelations {
  // describe navigational properties here
}

export type DocumentosWithRelations = Documentos & DocumentosRelations;
