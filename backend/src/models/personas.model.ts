import {Entity, model, property, belongsTo, hasOne} from '@loopback/repository';
import {RecordCrediticio} from './record-crediticio.model';
import {Nacionalidades} from './nacionalidades.model';
import {EstadoCivil} from './estado-civil.model';
import {TipoPersonas} from './tipo-personas.model';
import {UsuarioCliente} from './usuario-cliente.model';

@model({settings: {idInjection: false, mssql: {schema: 'dbo', table: 'Personas'}}})
export class Personas extends Entity {
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

  @belongsTo(() => RecordCrediticio, {name: 'recordCrediticio'})
  idRecordCrediticio: number;

  @belongsTo(() => Nacionalidades, {name: 'nacionalidad'})
  idNacionalidad: number;

  @belongsTo(() => EstadoCivil, {name: 'estadoCivil'})
  idEstadoCivil: number;

  @belongsTo(() => TipoPersonas, {name: 'tipoPersona'})
  idTipoPersona: number;

  @hasOne(() => UsuarioCliente, {keyTo: 'clienteId'})
  usuarioCliente: UsuarioCliente;
  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<Personas>) {
    super(data);
  }
}

export interface PersonasRelations {
  // describe navigational properties here
}

export type PersonasWithRelations = Personas & PersonasRelations;