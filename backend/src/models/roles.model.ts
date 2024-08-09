import {Entity, model, property} from '@loopback/repository';

@model({settings: {idInjection: false, mssql: {schema: 'dbo', table: 'Roles'}}})
export class Roles extends Entity {
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
    jsonSchema: {nullable: true},
    length: 50,
    generated: false,
    mssql: {columnName: 'Nombre', dataType: 'nvarchar', dataLength: 50, dataPrecision: null, dataScale: null, nullable: 'YES', generated: false},
  })
  nombre?: string;

  @property({
    type: 'string',
    jsonSchema: {nullable: true},
    length: 50,
    generated: false,
    mssql: {columnName: 'Descripcion', dataType: 'nvarchar', dataLength: 50, dataPrecision: null, dataScale: null, nullable: 'YES', generated: false},
  })
  descripcion?: string;

  @property({
    type: 'boolean',
    jsonSchema: {nullable: true},
    generated: false,
    mssql: {columnName: 'Estado', dataType: 'bit', dataLength: null, dataPrecision: null, dataScale: null, nullable: 'YES', generated: false},
  })
  estado?: boolean;

  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<Roles>) {
    super(data);
  }
}

export interface RolesRelations {
  // describe navigational properties here
}

export type RolesWithRelations = Roles & RolesRelations;
