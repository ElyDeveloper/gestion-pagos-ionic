import {Entity, hasMany, model, property} from '@loopback/repository';
import { Prestamos } from './prestamos.model';

@model({settings: {idInjection: false, mssql: {schema: 'dbo', table: 'Monedas'}}})
export class Monedas extends Entity {
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
    length: 3,
    generated: false,
    mssql: {columnName: 'CodigoMoneda', dataType: 'nvarchar', dataLength: 3, dataPrecision: null, dataScale: null, nullable: 'NO', generated: false},
  })
  codigoMoneda: string;

  @property({
    type: 'string',
    required: true,
    jsonSchema: {nullable: false},
    length: 50,
    generated: false,
    mssql: {columnName: 'NombreMoneda', dataType: 'varchar', dataLength: 50, dataPrecision: null, dataScale: null, nullable: 'NO', generated: false},
  })
  nombreMoneda: string;

  @property({
    type: 'number',
    required: true,
    jsonSchema: {nullable: false},
    precision: 10,
    scale: 4,
    generated: false,
    mssql: {columnName: 'TipoCambio', dataType: 'decimal', dataLength: null, dataPrecision: 10, dataScale: 4, nullable: 'NO', generated: false},
  })
  tipoCambio: number;

  @property({
    type: 'date',
    required: true,
    jsonSchema: {nullable: false},
    generated: false,
    mssql: {columnName: 'FechaActualizacion', dataType: 'datetime2', dataLength: null, dataPrecision: null, dataScale: null, nullable: 'NO', generated: false},
  })
  fechaActualizacion: string;

  // Define well-known properties here
  @hasMany(() => Prestamos, {keyTo: 'idMoneda'})
  prestamos: Prestamos[];
  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<Monedas>) {
    super(data);
  }
}

export interface MonedasRelations {
  // describe navigational properties here
}

export type MonedasWithRelations = Monedas & MonedasRelations;
