import {Entity, hasMany, model, property, hasOne} from '@loopback/repository';
import { Prestamos } from './prestamos.model';
import { FechasPagos } from './fechas-pagos.model';

@model({settings: {idInjection: false, mssql: {schema: 'dbo', table: 'PlanesPago'}}})
export class PlanesPago extends Entity {
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
    type: 'number',
    required: true,
    jsonSchema: {nullable: false},
    precision: 10,
    scale: 0,
    generated: false,
    mssql: {columnName: 'CuotasPagar', dataType: 'int', dataLength: null, dataPrecision: 10, dataScale: 0, nullable: 'NO', generated: false},
  })
  cuotasPagar: number;

  @property({
    type: 'date',
    required: true,
    jsonSchema: {nullable: false},
    generated: false,
    mssql: {columnName: 'FechaInicio', dataType: 'date', dataLength: null, dataPrecision: null, dataScale: null, nullable: 'NO', generated: false},
  })
  fechaInicio: string;

  @property({
    type: 'date',
    jsonSchema: {nullable: true},
    generated: false,
    mssql: {columnName: 'FechaFin', dataType: 'date', dataLength: null, dataPrecision: null, dataScale: null, nullable: 'YES', generated: false},
  })
  fechaFin?: string;

  @property({
    type: 'number',
    required: true,
    jsonSchema: {nullable: false},
    precision: 10,
    scale: 0,
    generated: false,
    mssql: {columnName: 'CuotaPagadas', dataType: 'int', dataLength: null, dataPrecision: 10, dataScale: 0, nullable: 'NO', generated: false},
  })
  cuotaPagadas: number;

  @property({
    type: 'boolean',
    required: true,
    jsonSchema: {nullable: false},
    generated: false,
    mssql: {columnName: 'Estado', dataType: 'bit', dataLength: null, dataPrecision: null, dataScale: null, nullable: 'NO', generated: false},
  })
  estado: boolean;

  @hasMany(() => Prestamos, {keyTo: 'idPlan'})
  prestamos: Prestamos[];

  @hasMany(() => FechasPagos, {keyTo: 'planId'})
  fechasPagos: FechasPagos[];

  @hasOne(() => Prestamos, {keyTo: 'idPlan'})
  prestamo: Prestamos;
  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<PlanesPago>) {
    super(data);
  }
}

export interface PlanesPagoRelations {
  // describe navigational properties here
}

export type PlanesPagoWithRelations = PlanesPago & PlanesPagoRelations;
