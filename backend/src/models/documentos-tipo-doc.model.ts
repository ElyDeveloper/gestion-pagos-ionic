import {belongsTo, Entity, hasMany, model, property, hasOne} from '@loopback/repository';
import { TipoDocumentos } from './tipo-documentos.model';
import { Documentos } from './documentos.model';
import { Pagos } from './pagos.model';

@model({
  settings: {idInjection: false, mssql: {schema: 'dbo', table: 'DocumentosTipoDoc'}}
})
export class DocumentosTipoDoc extends Entity {
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

  // Define well-known properties here
  @belongsTo(() => TipoDocumentos, {name: 'tipoDocumentos'})
  idTipoDocumento: number;

  @hasOne(() => Documentos, {keyTo: 'idDocTipDoc'})
  documentos: Documentos;
  
  @belongsTo(() => Pagos, {name: 'pagos'})
  idDocumento: number;

  // @hasMany(() => Documentos, {keyTo: 'idDocTipDoc'})
  // documentos: Documentos[];

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<DocumentosTipoDoc>) {
    super(data);
  }
}

export interface DocumentosTipoDocRelations {
  // describe navigational properties here
}

export type DocumentosTipoDocWithRelations = DocumentosTipoDoc & DocumentosTipoDocRelations;
