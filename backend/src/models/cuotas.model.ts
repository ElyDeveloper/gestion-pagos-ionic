import {Entity, hasMany, model, property} from '@loopback/repository';
import { Prestamos } from './prestamos.model';

@model({settings: {idInjection: false, mssql: {schema: 'dbo', table: 'Cuotas'}}})
export class Cuotas extends Entity {
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
    scale: 2,
    generated: false,
    mssql: {columnName: 'Cuotas', dataType: 'decimal', dataLength: null, dataPrecision: 10, dataScale: 2, nullable: 'NO', generated: false},
  })
  cuotas: number;

  @property({
    type: 'boolean',
    jsonSchema: {nullable: true},
    generated: false,
    mssql: {columnName: 'Estado', dataType: 'bit', dataLength: null, dataPrecision: null, dataScale: null, nullable: 'YES', generated: false},
  })
  estado?: boolean;

  // Define well-known properties here
  @hasMany(() => Prestamos, {keyTo: 'idCuotas'})
  prestamos: Prestamos[];

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<Cuotas>) {
    super(data);
  }
}

export interface CuotasRelations {
  // describe navigational properties here
}

export type CuotasWithRelations = Cuotas & CuotasRelations;
