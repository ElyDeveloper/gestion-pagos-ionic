import {belongsTo, Entity, hasMany, model, property, hasOne} from '@loopback/repository';
import { FechasPagos } from './fechas-pagos.model';
import { Vouchers } from './vouchers.model';
import { DocumentosTipoDoc } from './documentos-tipo-doc.model';

@model({settings: {idInjection: false, mssql: {schema: 'dbo', table: 'Pagos'}}})
export class Pagos extends Entity {
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
    type: 'date',
    required: true,
    jsonSchema: {nullable: false},
    generated: false,
    mssql: {columnName: 'FechaPago', dataType: 'date', dataLength: null, dataPrecision: null, dataScale: null, nullable: 'NO', generated: false},
  })
  fechaPago: string;

  @property({
    type: 'number',
    required: true,
    jsonSchema: {nullable: false},
    precision: 10,
    scale: 2,
    generated: false,
    mssql: {columnName: 'Monto', dataType: 'decimal', dataLength: null, dataPrecision: 10, dataScale: 2, nullable: 'NO', generated: false},
  })
  monto: number;

  @property({
    type: 'boolean',
    required: true,
    jsonSchema: {nullable: false},
    generated: false,
    mssql: {columnName: 'Estado', dataType: 'bit', dataLength: null, dataPrecision: null, dataScale: null, nullable: 'NO', generated: false},
  })
  estado: boolean;

  // Define well-known properties here
  @belongsTo(() => FechasPagos, {name: 'cuota'})
  idFechaPago: number;

  @hasOne(() => DocumentosTipoDoc, {keyTo: 'idDocumento'})
  documentosTipoDoc: DocumentosTipoDoc;

  @hasMany(() => Vouchers, {keyTo: 'idPago'})
  vouchers: Vouchers[];


  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<Pagos>) {
    super(data);
  }
}

export interface PagosRelations {
  // describe navigational properties here
}

export type PagosWithRelations = Pagos & PagosRelations;
