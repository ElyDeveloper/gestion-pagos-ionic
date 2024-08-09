import {Entity, hasMany, model, property} from '@loopback/repository';
import { Prestamos } from './prestamos.model';

@model({settings: {idInjection: false, mssql: {schema: 'dbo', table: 'TipoPrestamos'}}})
export class TipoPrestamos extends Entity {
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
    length: 100,
    generated: false,
    mssql: {columnName: 'Nombre', dataType: 'varchar', dataLength: 100, dataPrecision: null, dataScale: null, nullable: 'NO', generated: false},
  })
  nombre: string;

  @property({
    type: 'boolean',
    required: true,
    jsonSchema: {nullable: false},
    generated: false,
    mssql: {columnName: 'Estado', dataType: 'bit', dataLength: null, dataPrecision: null, dataScale: null, nullable: 'NO', generated: false},
  })
  estado: boolean;

  // Define well-known properties here
  @hasMany(() => Prestamos, {keyTo: 'IdTipoPrestamo'})
  prestamos: Prestamos[];

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<TipoPrestamos>) {
    super(data);
  }
}

export interface TipoPrestamosRelations {
  // describe navigational properties here
}

export type TipoPrestamosWithRelations = TipoPrestamos & TipoPrestamosRelations;
