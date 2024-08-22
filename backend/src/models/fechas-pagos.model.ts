import {belongsTo, Entity, hasMany, model, property} from '@loopback/repository';
import { PlanesPago } from './planes-pago.model';
import { TransaccionesExternas } from './transacciones-externas.model';

@model({settings: {idInjection: false, mssql: {schema: 'dbo', table: 'FechasPagos'}}})
export class FechasPagos extends Entity {
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
    type: 'boolean',
    required: true,
    jsonSchema: {nullable: false},
    generated: false,
    mssql: {columnName: 'Estado', dataType: 'bit', dataLength: null, dataPrecision: null, dataScale: null, nullable: 'NO', generated: false},
  })
  estado: boolean;

  @property({
    type: 'number',
    jsonSchema: {nullable: true},
    precision: 10,
    scale: 2,
    generated: false,
    mssql: {columnName: 'Cuota', dataType: 'decimal', dataLength: null, dataPrecision: 10, dataScale: 2, nullable: 'YES', generated: false},
  })
  cuota?: number;

  // Define well-known properties here
  @belongsTo(() => PlanesPago, {name: 'planPago'})
  planId: number;

  @hasMany(() => TransaccionesExternas, {keyTo: 'idPago'})
  transaccionesExternas: TransaccionesExternas[];

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<FechasPagos>) {
    super(data);
  }
}

export interface FechasPagosRelations {
  // describe navigational properties here
}

export type FechasPagosWithRelations = FechasPagos & FechasPagosRelations;
