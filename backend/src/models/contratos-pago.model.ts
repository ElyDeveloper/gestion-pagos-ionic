import {Entity, model, property} from '@loopback/repository';

@model({settings: {idInjection: false, mssql: {schema: 'dbo', table: 'ContratosPago'}}})
export class ContratosPago extends Entity {
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
    mssql: {columnName: 'IdPrestamo', dataType: 'int', dataLength: null, dataPrecision: 10, dataScale: 0, nullable: 'NO', generated: false},
  })
  idPrestamo?: number;

  @property({
    type: 'string',
    required: true,
    jsonSchema: {nullable: false},
    length: 10,
    generated: false,
    mssql: {columnName: 'Correlativo', dataType: 'varchar', dataLength: 10, dataPrecision: null, dataScale: null, nullable: 'NO', generated: false},
  })
  correlativo?: string;

  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<ContratosPago>) {
    super(data);
  }
}

export interface ContratosPagoRelations {
  // describe navigational properties here
}

export type ContratosPagoWithRelations = ContratosPago & ContratosPagoRelations;
