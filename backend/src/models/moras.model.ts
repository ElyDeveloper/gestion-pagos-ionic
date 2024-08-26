import {belongsTo, Entity, model, property} from '@loopback/repository';
import { PlanesPago } from './planes-pago.model';
import { Prestamos } from './prestamos.model';
import { FechasPagos } from './fechas-pagos.model';
import { Personas } from './personas.model';

@model({settings: {idInjection: false, mssql: {schema: 'dbo', table: 'Moras'}}})
export class Moras extends Entity {
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
    mssql: {columnName: 'DiasRetraso', dataType: 'int', dataLength: null, dataPrecision: 10, dataScale: 0, nullable: 'NO', generated: false},
  })
  diasRetraso: number;

  @property({
    type: 'number',
    required: true,
    jsonSchema: {nullable: false},
    precision: 10,
    scale: 2,
    generated: false,
    mssql: {columnName: 'Mora', dataType: 'decimal', dataLength: null, dataPrecision: 10, dataScale: 2, nullable: 'NO', generated: false},
  })
  mora: number;

  @property({
    type: 'boolean',
    jsonSchema: {nullable: true},
    generated: false,
    mssql: {columnName: 'Estado', dataType: 'bit', dataLength: null, dataPrecision: null, dataScale: null, nullable: 'YES', generated: false},
  })
  estado?: boolean;

  // Define well-known properties here
  @belongsTo(() => Personas, {name: 'cliente'})
  idCliente: number;

  @belongsTo(() => Prestamos, {name: 'prestamo'})
  idPrestamo: number;

  @belongsTo(() => PlanesPago, {name: 'planPago'})
  idPlan: number;

  @belongsTo(() => FechasPagos, {name: 'fechaPago'})
  idFechaPago: number;

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<Moras>) {
    super(data);
  }
}

export interface MorasRelations {
  // describe navigational properties here
}

export type MorasWithRelations = Moras & MorasRelations;
