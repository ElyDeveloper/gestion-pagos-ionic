import {belongsTo, Entity, model, property} from '@loopback/repository';
import { FechasPagos } from './fechas-pagos.model';

@model({
  settings: {idInjection: false, mssql: {schema: 'dbo', table: 'TransaccionesExternas'}}
})
export class TransaccionesExternas extends Entity {
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
    length: 20,
    generated: false,
    mssql: {columnName: 'EstadoTransaccion', dataType: 'nvarchar', dataLength: 20, dataPrecision: null, dataScale: null, nullable: 'NO', generated: false},
  })
  estadoTransaccion: string;

  @property({
    type: 'date',
    required: true,
    jsonSchema: {nullable: false},
    generated: false,
    mssql: {columnName: 'FechaTransaccion', dataType: 'datetime2', dataLength: null, dataPrecision: null, dataScale: null, nullable: 'NO', generated: false},
  })
  fechaTransaccion: string;

  // Define well-known properties here
  @belongsTo(() => FechasPagos, {name: 'fechasPagos'})
  idPago: number;

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<TransaccionesExternas>) {
    super(data);
  }
}

export interface TransaccionesExternasRelations {
  // describe navigational properties here
}

export type TransaccionesExternasWithRelations = TransaccionesExternas & TransaccionesExternasRelations;
