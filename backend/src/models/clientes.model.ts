import {Entity, hasMany, hasOne, model, property} from '@loopback/repository';
import { Prestamos } from './prestamos.model';
import { UsuarioCliente } from './usuario-cliente.model';

@model({settings: {idInjection: false, mssql: {schema: 'dbo', table: 'Clientes'}}})
export class Clientes extends Entity {
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
    length: 13,
    generated: false,
    mssql: {columnName: 'DNI', dataType: 'varchar', dataLength: 13, dataPrecision: null, dataScale: null, nullable: 'YES', generated: false},
  })
  dni?: string;

  @property({
    type: 'string',
    required: true,
    jsonSchema: {nullable: false},
    length: 100,
    generated: false,
    mssql: {columnName: 'Nombres', dataType: 'varchar', dataLength: 100, dataPrecision: null, dataScale: null, nullable: 'NO', generated: false},
  })
  nombres: string;

  @property({
    type: 'string',
    required: true,
    jsonSchema: {nullable: false},
    length: 100,
    generated: false,
    mssql: {columnName: 'Apellidos', dataType: 'varchar', dataLength: 100, dataPrecision: null, dataScale: null, nullable: 'NO', generated: false},
  })
  apellidos: string;

  @property({
    type: 'string',
    required: true,
    jsonSchema: {nullable: false},
    length: 12,
    generated: false,
    mssql: {columnName: 'Cel', dataType: 'varchar', dataLength: 12, dataPrecision: null, dataScale: null, nullable: 'NO', generated: false},
  })
  cel: string;

  @property({
    type: 'string',
    required: true,
    jsonSchema: {nullable: false},
    length: 200,
    generated: false,
    mssql: {columnName: 'Direccion', dataType: 'varchar', dataLength: 200, dataPrecision: null, dataScale: null, nullable: 'NO', generated: false},
  })
  direccion: string;

  @property({
    type: 'string',
    required: true,
    jsonSchema: {nullable: false},
    length: 100,
    generated: false,
    mssql: {columnName: 'Email', dataType: 'varchar', dataLength: 100, dataPrecision: null, dataScale: null, nullable: 'NO', generated: false},
  })
  email: string;

  @property({
    type: 'date',
    required: true,
    jsonSchema: {nullable: false},
    generated: false,
    mssql: {columnName: 'FechaIngreso', dataType: 'date', dataLength: null, dataPrecision: null, dataScale: null, nullable: 'NO', generated: false},
  })
  fechaIngreso: string;

  @property({
    type: 'date',
    jsonSchema: {nullable: true},
    generated: false,
    mssql: {columnName: 'FechaBaja', dataType: 'date', dataLength: null, dataPrecision: null, dataScale: null, nullable: 'YES', generated: false},
  })
  fechaBaja?: string;

  @property({
    type: 'boolean',
    required: true,
    jsonSchema: {nullable: false},
    generated: false,
    mssql: {columnName: 'Estado', dataType: 'bit', dataLength: null, dataPrecision: null, dataScale: null, nullable: 'NO', generated: false},
  })
  estado: boolean;

  // Define well-known properties here
  @hasMany(() => Prestamos, {keyTo: 'idCliente'})
  prestamos: Prestamos[];

  @hasMany(() => UsuarioCliente)
  usuarioCliente: UsuarioCliente[];

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<Clientes>) {
    super(data);
  }
}

export interface ClientesRelations {
  // describe navigational properties here
}

export type ClientesWithRelations = Clientes & ClientesRelations;
