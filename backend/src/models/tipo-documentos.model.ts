import {Entity, hasMany, model, property} from '@loopback/repository';
import { DocumentosTipoDoc } from './documentos-tipo-doc.model';

@model({
  settings: {idInjection: false, mssql: {schema: 'dbo', table: 'TipoDocumentos'}}
})
export class TipoDocumentos extends Entity {
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
    required: true,
    jsonSchema: {nullable: false},
    length: 150,
    generated: false,
    mssql: {columnName: 'Descripcion', dataType: 'varchar', dataLength: 150, dataPrecision: null, dataScale: null, nullable: 'NO', generated: false},
  })
  descripcion: string;

  // Define well-known properties here
  @hasMany(() => DocumentosTipoDoc, {keyTo: 'idTipoDocumento'})
  documentosTipoDocs: DocumentosTipoDoc[];

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<TipoDocumentos>) {
    super(data);
  }
}

export interface TipoDocumentosRelations {
  // describe navigational properties here
}

export type TipoDocumentosWithRelations = TipoDocumentos & TipoDocumentosRelations;
