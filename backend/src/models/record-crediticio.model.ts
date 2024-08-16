import {Entity, model, property} from '@loopback/repository';

@model({
  settings: {idInjection: false, mssql: {schema: 'dbo', table: 'RecordCrediticio'}}
})
export class RecordCrediticio extends Entity {
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
    mssql: {columnName: 'Codigo', dataType: 'varchar', dataLength: 3, dataPrecision: null, dataScale: null, nullable: 'NO', generated: false},
  })
  codigo: string;

  @property({
    type: 'string',
    required: true,
    jsonSchema: {nullable: false},
    length: 150,
    generated: false,
    mssql: {columnName: 'Descripcion', dataType: 'varchar', dataLength: 150, dataPrecision: null, dataScale: null, nullable: 'NO', generated: false},
  })
  descripcion: string;

  @property({
    type: 'number',
    required: true,
    jsonSchema: {nullable: false},
    precision: 10,
    scale: 0,
    generated: false,
    mssql: {columnName: 'RangoInicio', dataType: 'int', dataLength: null, dataPrecision: 10, dataScale: 0, nullable: 'NO', generated: false},
  })
  rangoInicio: number;

  @property({
    type: 'number',
    required: true,
    jsonSchema: {nullable: false},
    precision: 10,
    scale: 0,
    generated: false,
    mssql: {columnName: 'RangoFin', dataType: 'int', dataLength: null, dataPrecision: 10, dataScale: 0, nullable: 'NO', generated: false},
  })
  rangoFin: number;

  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<RecordCrediticio>) {
    super(data);
  }
}

export interface RecordCrediticioRelations {
  // describe navigational properties here
}

export type RecordCrediticioWithRelations = RecordCrediticio & RecordCrediticioRelations;
