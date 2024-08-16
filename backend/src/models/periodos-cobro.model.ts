import {Entity, hasMany, model, property} from '@loopback/repository';
import { Prestamos } from './prestamos.model';

@model({settings: {idInjection: false, mssql: {schema: 'dbo', table: 'PeriodosCobro'}}})
export class PeriodosCobro extends Entity {
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
    length: 50,
    generated: false,
    mssql: {columnName: 'Nombre', dataType: 'varchar', dataLength: 50, dataPrecision: null, dataScale: null, nullable: 'NO', generated: false},
  })
  nombre: string;

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
  @hasMany(() => Prestamos, {keyTo: 'idPeriodoCobro'})
  prestamos: Prestamos[];

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<PeriodosCobro>) {
    super(data);
  }
}

export interface PeriodosCobroRelations {
  // describe navigational properties here
}

export type PeriodosCobroWithRelations = PeriodosCobro & PeriodosCobroRelations;
