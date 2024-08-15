import {Entity, model, property, belongsTo, hasMany} from '@loopback/repository';
import {Roles} from './roles.model';
import { UsuarioCliente } from './usuario-cliente.model';

@model({settings: {idInjection: false, mssql: {schema: 'dbo', table: 'Usuarios'}}})
export class Usuario extends Entity {
  @property({
    type: 'number',
    jsonSchema: {nullable: false},
    precision: 10,
    scale: 0,
    generated: 1,
    id: 1,
    mssql: {columnName: 'id', dataType: 'int', dataLength: null, dataPrecision: 10, dataScale: 0, nullable: 'NO', generated: 1},
  })
  id?: number;

  @property({
    type: 'string',
    jsonSchema: {nullable: true},
    length: 150,
    generated: false,
    mssql: {columnName: 'Nombre', dataType: 'varchar', dataLength: 150, dataPrecision: null, dataScale: null, nullable: 'YES', generated: false},
  })
  nombre?: string;

  @property({
    type: 'string',
    jsonSchema: {nullable: true},
    length: 150,
    generated: false,
    mssql: {columnName: 'Apellido', dataType: 'varchar', dataLength: 150, dataPrecision: null, dataScale: null, nullable: 'YES', generated: false},
  })
  apellido?: string;

  @property({
    type: 'string',
    jsonSchema: {nullable: true},
    length: 150,
    generated: false,
    mssql: {columnName: 'Telefono', dataType: 'varchar', dataLength: 150, dataPrecision: null, dataScale: null, nullable: 'YES', generated: false},
  })
  telefono?: string;

  @property({
    type: 'string',
    jsonSchema: {nullable: true},
    length: 150,
    generated: false,
    mssql: {columnName: 'Observacion', dataType: 'varchar', dataLength: 150, dataPrecision: null, dataScale: null, nullable: 'YES', generated: false},
  })
  observacion?: string;

  @property({
    type: 'boolean',
    jsonSchema: {nullable: true},
    generated: false,
    mssql: {columnName: 'AD', dataType: 'bit', dataLength: null, dataPrecision: null, dataScale: null, nullable: 'YES', generated: false},
  })
  ad?: boolean;

  @property({
    type: 'string',
    jsonSchema: {nullable: true},
    length: 150,
    generated: false,
    mssql: {columnName: 'Correo', dataType: 'varchar', dataLength: 150, dataPrecision: null, dataScale: null, nullable: 'YES', generated: false},
  })
  correo?: string;

  @property({
    type: 'boolean',
    jsonSchema: {nullable: true},
    generated: false,
    mssql: {columnName: 'Estado', dataType: 'bit', dataLength: null, dataPrecision: null, dataScale: null, nullable: 'YES', generated: false},
  })
  estado?: boolean;

  @property({
    type: 'boolean',
    required: true,
    jsonSchema: {nullable: false},
    generated: false,
    mssql: {columnName: 'changedPassword', dataType: 'bit', dataLength: null, dataPrecision: null, dataScale: null, nullable: 'NO', generated: false},
  })
  changedPassword: boolean;
  

  // Define well-known properties here
  @belongsTo(() => Roles, {name: 'rol'})
  rolid: number;

  @hasMany(() => UsuarioCliente)
  usuarioClientes: UsuarioCliente[];

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<Usuario>) {
    super(data);
  }
}

export interface UsuarioRelations {
  // describe navigational properties here
}

export type UsuarioWithRelations = Usuario & UsuarioRelations;
